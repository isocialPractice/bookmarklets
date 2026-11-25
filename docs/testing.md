# Testing the bookmarklets

`test-bm.js` answers one question for any bookmarklet in this repository: does
it still work on the page it was written for? It runs the bookmarklet in a real
browser through [Playwright](https://playwright.dev/), the way a reader clicking
the bookmark would, and gives each one a verdict of `pass`, `fail` or `skip`.

What each bookmarklet is run against lives in `test-bm.json`, described by
`test-bm.schema.json`. `node test-bm.js --help` prints the whole of what the
harness does.

- [Install](#install)
- [Run the tests](#run-the-tests)
- [Flags](#flags)
- [Exit codes](#exit-codes)
- [Where the report is written](#where-the-report-is-written)
- [Configuration reference](#configuration-reference)
- [Scheduling a run](#scheduling-a-run)
- [What `npm test` runs](#what-npm-test-runs)
- [Working with an AI assistant](#working-with-an-ai-assistant)
- [Giving an assistant a browser](#giving-an-assistant-a-browser)

## Install

From the repository root:

```sh
npm install
npx playwright install chromium
```

`npm install` brings in Playwright and to-explorer, and the second line
downloads the Chromium build Playwright drives. That is all a run needs. Two
more are optional:

- **Firefox**, for `--browser firefox`: `npx playwright install firefox`, once,
  on the machine that runs it. A run that needs Firefox where it is not
  installed stops with exit 2, naming that step.
- **ffmpeg on the `PATH`**, for `--short`, which writes its recordings as GIFs.
  A machine without ffmpeg leaves every short owed rather than failing the run.

### What the repository uses

| Tool | What it is | What uses it | Without it |
| --- | --- | --- | --- |
| [Playwright](https://playwright.dev/) 1.65.0 | Dev dependency, `npm install` | `test-bm.js` and the three suites under `test/` | Nothing runs: a run says to install it |
| [to-explorer](https://github.com/jhauga/to-explorer) 1.1.0 | Dev dependency, `npm install` | A reader opening a page by hand in a chosen Chrome profile, as the sections below show; no test calls it | The page is opened another way |
| Chromium, and Firefox for `--browser firefox` | Browser builds, `npx playwright install` | Every run in that engine | Exit 2, naming the install step |
| [ffmpeg](https://ffmpeg.org/) | A program on the `PATH` | `--short`, for its GIFs | Every short stays owed; the run does not fail |
| [`@playwright/mcp`](https://www.npmjs.com/package/@playwright/mcp) | Optional, run with `npx` | An assistant given a browser of its own (see [Giving an assistant a browser](#giving-an-assistant-a-browser)) | The assistant works without a browser |
| [GitHub CLI](https://cli.github.com/), `gh` | A program on the `PATH` | `TODO.md`'s check of the latest Pages build | The build is checked on GitHub instead |
| `gitHubTask` | A local tool of the maintainer's, not part of this repository | Posting and updating each bookmarklet's gist, as `TODO.md` describes | A gist is posted and updated by hand |

## Run the tests

### Run one

```sh
node test-bm.js dom_Example_HighlightLinks
```

The bookmarklet can be named as `dom_Example_HighlightLinks`,
`dom_Example_HighlightLinks.js` or `JSFormatted/dom_Example_HighlightLinks.js`.
The run prints the verdict, its time and its reason, followed by the notes
about the run. It writes no report, except `failure.md` when the bookmarklet
fails (see [Where the report is written](#where-the-report-is-written)).

### Run all

```sh
node test-bm.js --all
```

Every file in `JSFormatted/`, configured or not. A bookmarklet with an entry in
`test-bm.json` runs as its entry says, and one without gets the default safe
run. `npm run test:bookmarklets` runs the same command.

### Run the scheduled set

```sh
node test-bm.js --scheduled
```

Only the entries marked `"scheduled": true`. This is what a cron job or a
Windows scheduled task calls, and nothing on this path waits for input. An
entry is marked scheduled only when its page loads in a headless browser with
no consent wall and no bot check. `npm run test:scheduled` runs the same
command.

### See what a run would do

```sh
node test-bm.js --list
```

One line per bookmarklet, saying whether it gets the default safe run, is
configured, is signed in, is skipped, is deprecated or is tested by hand, with
its page and what its entry adds, or its reason. The last line counts the
bookmarklets, the configured, the scheduled, the signed-in, the everyday, the
deprecated and the by-hand ones. No browser is opened.

## Flags

| Flag | What it does |
| --- | --- |
| `<name>` | Run one bookmarklet. |
| `--all` | Run every file in `JSFormatted/`, configured or not. |
| `--scheduled` | Run only the entries marked `"scheduled": true`. |
| `--list` | Say what a run would do with each bookmarklet, without opening a browser. |
| `--sign-in <site>` | Ask the sign-in launcher to open `<site>` for signing in, then exit. It is for the maintainer at a keyboard; see [Signed-in sites](#signed-in-sites-auth-signedin-and-test_bm_auth_launcher). |
| `--browser <engine>` | The engine every entry runs in: `chromium`, the default, or `firefox`. Without it, an entry runs in Chromium and in any other engine its `browsers` names. |
| `--headed` | Watch the run in a browser window. |
| `--slow-mo <ms>` | Milliseconds between actions, for the same reason as `--headed`. Neither is ever needed. |
| `--capture` | Capture every entry the run reaches: a screenshot either side of the bookmarklet and a video of the whole entry. |
| `--short` | Record every entry the run reaches as a short, the bookmarklet's own recording. |

`--all`, `--scheduled`, `--list` and `--sign-in` each ask for a different run,
so a command takes one of them or a name, never two.

### `--browser firefox`

Runs the same checks in Firefox, the second most likely place a reader pastes a
bookmarklet. Chromium stays the default, and the only engine `--scheduled` uses
unless an entry asks for more with `"browsers": ["chromium", "firefox"]`.

Firefox does not say which code started a request. So in Firefox every request
to another host after the bookmarklet first ran is judged as the bookmarklet's,
and a page that keeps reaching other hosts on its own can fail there and pass in
Chromium, never the other way round. For the same reason, an entry that counts
requests is a skip in Firefox, and so is an entry with `auth`. A short is
recorded in Chromium only, so `--short` takes no other engine.

### `--capture`

Writes `before.png` and `after.png`, the page either side of the bookmarklet
(with a numbered pair for each later `run` step), and a video of the whole
entry, into
`test-results/test-bm/<run>/capture/<name>/`. The report gives each file's path
and the offset into the video at which every step started, so a clip can be cut
to the moment the bookmarklet ran. An entry can ask for the same with
`"capture": true`. An entry with `auth` captures nothing.

### `--short`

Records what `--capture` records, and turns it into the recording a short is
made from:

- The viewport is 648x648, so the page itself lays out square.
- The clip runs from a little before the bookmarklet ran to its result being on
  screen, at 10 fps and up to thirty seconds.
- The GIF goes to the folder `TEST_BM_SHORTS_DIR` names, `test-results/shorts/`
  without one, as `<name>.gif`.
- **A clip over fifteen seconds is written twice.** `<name>_Full.gif` is the
  whole clip, and `<name>.gif` is its 15 second cut. The cut keeps only the
  moments that show the bookmarklet's use: each time it runs, and each `click`,
  `fill`, `press` or `select` step a reader would make, each from a little
  before it to an even share of fifteen seconds after it (two seconds at
  least), plus the clip's end, which is the result on screen. Waits, checks and
  set-up steps between them are dropped. A cut still over fifteen seconds is
  time-stretched to fifteen when the short is rendered.
- **A short never holds still for two seconds**, in the middle or at its end.
  Where nothing on the page moves for longer than a second and a half, the clip
  keeps that second and a half and cuts the rest. This happens before the 15
  second cut is chosen, and in both GIFs of a long clip. A change ffmpeg's
  `mpdecimate` sees between frames counts as moving, so a dot or a line drawn
  on the page does and a blinking caret does not. The report names the parts
  cut as `stills`, in seconds of the whole clip. The rule is for shorts only: a
  demo ends on fifteen still seconds for YouTube's countdown to the next video.
- A recording already at `<name>.gif` is kept, and the entry is not recorded
  again for it.
- Only an entry that passed gets one.

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Nothing failed. Skips are allowed: a skip never fails a run, and neither does a deprecated or a by-hand entry. |
| `1` | At least one bookmarklet failed. |
| `2` | A usage or configuration error: an unknown flag, a `test-bm.json` the harness refuses, Playwright or a browser engine not installed, or a sign-in launcher that is set but wrong. These stop the run before any entry runs. An error inside the harness itself also exits 2. |

## Where the report is written

Every run that writes something gets its own folder under
`test-results/test-bm/`, named for the second it started:
`test-results/test-bm/<YYYY-MM-DD_HHMMSS>/`. A run that starts in a second
another run already has takes `<YYYY-MM-DD_HHMMSS>-2/`, then `-3/` and so on, so
no two runs share a folder. The folder is made the first time something is
written into it, so a quiet run of one bookmarklet leaves none.
`test-results/` is ignored by git.

| File | Written by | Holds |
| --- | --- | --- |
| `report.json` | `--all` and `--scheduled` | The mode, the engine asked for and the engines used, the start and finish times, the counts, and every result: name, engine, verdict, reason, page, time, notes, dialogs, popups, console messages and errors. |
| `summary.txt` | `--all` and `--scheduled` | One line per result, then the tally, such as `test-bm: 12 run, 10 passed, 1 failed, 1 skipped`. A run that met a deprecated or a by-hand entry adds both counts, as `, 1 deprecated, 1 by hand`. |
| `failure.md` | any run where something failed, a run of one included | One section per failing bookmarklet, holding what is needed to act on it without running anything again. |
| `capture/<name>/` | `--capture`, `"capture": true`, and any failure | The screenshots and the video. A failure keeps `failure.png`, the page as it stood when it failed, whether or not the entry was captured. |

The run prints the folder on its last lines, as `report: <path>` and
`failures: <path>`.

`failure.md` is written to be read as plain text:

- For a missing `requires` selector, it gives the selector, the lines of the
  formatted file that use it, and an ARIA snapshot and trimmed markup of the
  part of the page the selector was expected in.
- For a bookmarklet that threw, it gives the message and the lines of the
  formatted file its stack came from.
- For an entry with `auth`, it gives only the selector or the message and the
  bookmarklet's own lines: no snapshot, no markup, no frames from the page and
  no screenshot.

Shorts are not under the run folder. They go to `test-results/shorts/`, or the
folder `TEST_BM_SHORTS_DIR` names, because a recording is the one thing a run
makes that outlives the run.

## Configuration reference

`test-bm.json` holds one entry per bookmarklet, keyed by the file's name in
`JSFormatted/` without its `.js`. A key that names no file there is a
configuration error. The first key points at the schema, so an editor offers
completion and validation:

```json
{
 "$schema": "./test-bm.schema.json",

 "dom_Example_HighlightLinks": {
  "url": "fixture:article.html",
  "scheduled": true,
  "requires": ["a[href]"],
  "steps": [
   { "run": true },
   { "expect": { "selector": "a.highlighted", "count": 3 } },
   { "run": true },
   { "expect": { "selector": "a.highlighted", "count": 0 } }
  ]
 }
}
```

Every name in the examples below is a placeholder. A real entry is keyed by a
file that exists.

### The default safe run

A bookmarklet with no entry still runs. Before any browser starts, its file is
checked:

- it is joined onto one line both ways a browser could join it (every line
  break replaced by a space, and every line break dropped), and must parse both
  ways;
- the joined code is percent-decoded, as a URL field decodes it, and checked
  again;
- it must not touch `document.cookie`, run a string as code (`eval`,
  `new Function`, a string handed to `setTimeout` or `setInterval`, `import()`),
  or load a `<script>` by its `src` without an integrity hash.

Then it is run once on `https://example.com/`, at 1280x720, and given half a
second to finish. It passes when it parsed, ran and threw nothing, and sent no
request to a host other than the page's own.

**What that proves:** the file survives being pasted as a bookmark, it runs
without throwing, and it does nothing that could pass for malicious.

**What it does not prove:** that the bookmarklet did its job. Nothing is
asserted about the page, and `example.com` is not the page the bookmarklet was
written for. A bookmarklet that looks for a site's own markup usually finds
none on `example.com`, does nothing, and passes. A dialog it opens is
dismissed. An entry with `requires` and `expect` steps, on the bookmarklet's own
page or a fixture page like it, is what turns a pass into "it still works".

### Entry properties

| Property | What it does | Example |
| --- | --- | --- |
| `url` | The page to open. Defaults to `https://example.com/`. It may also be a fixture page or an environment variable (see below). | `"url": "https://www.example.org/report"` |
| `scheduled` | Include the entry in `--scheduled`. Defaults to `false`. Only for pages that load headless with no consent wall and no bot check. | `"scheduled": true` |
| `requires` | The CSS selectors the bookmarklet reads, taken from its source. Each is waited for, up to ten seconds, before the bookmarklet runs, and a missing one fails with `site changed: <selector> not found on <url>`. | `"requires": ["main h1", "table.totals"]` |
| `steps` | What to do on the page, in order (see [Steps](#steps)). The bookmarklet runs once: at the step that names it, or after load when no step does. | `"steps": [{ "run": true }]` |
| `dialogs` | Answers to `alert`, `confirm` and `prompt`, in the order they appear. Each is `accept` (default `false`) and, for a prompt, `text`. A dialog with no answer left is dismissed. | `"dialogs": [{ "accept": true, "text": "Jane Doe" }]` |
| `permissions` | Browser permissions the context grants. An `expect` on the clipboard needs `clipboard-read`. Firefox has no clipboard permissions to grant, so a run there leaves those two out. | `"permissions": ["clipboard-read", "clipboard-write"]` |
| `skip` | A reason to list the entry as skipped without running it. | `"skip": "the page serves a consent wall to a headless browser"` |
| `deprecated` | The bookmarklet is kept as it is and no longer tested or updated: `why`, the reason, or `see`, the address of what replaces it. The entry holds nothing else. See [Kept out of every run](#kept-out-of-every-run-deprecated-and-byhand). | `"deprecated": { "see": "https://example.org/the-replacement" }` |
| `byHand` | The bookmarklet is still maintained, but a person tests it, because its page is unsafe to automate. The entry keeps its page and steps as the record of how. See [Kept out of every run](#kept-out-of-every-run-deprecated-and-byhand). | `"byHand": "it works on a signed-in mailbox, so a person tests and updates it"` |
| `timeout` | Milliseconds the whole entry is allowed. Defaults to `30000`. | `"timeout": 45000` |
| `settle` | Milliseconds to wait after the last step, for anything the bookmarklet started. Defaults to `500`. | `"settle": 1000` |
| `network` | The hosts other than the page's own that the bookmarklet may send a request to, each with its reason. A request to any other host fails the entry. `*.` and a domain allows its subdomains. | `"network": [{ "host": "api.example.com", "reason": "the totals come from the site's own API" }]` |
| `capture` | Capture this entry, as `--capture` does for every entry. Takes only `true`. | `"capture": true` |
| `browsers` | The engines this entry runs in when the run names none with `--browser`. Defaults to Chromium alone. | `"browsers": ["chromium", "firefox"]` |
| `auth` | The sign-in the entry needs, by site name (see [Signed-in sites](#signed-in-sites-auth-signedin-and-test_bm_auth_launcher)). | `"auth": "example-app"` |
| `signedIn` | A selector only the signed-in page has. Goes with `auth` or `drive`, and only with them. | `"signedIn": "#account-menu"` |
| `drive` | Run the entry in the reader's everyday browser, through a driver outside the repository (see [The everyday browser](#the-everyday-browser-drive-personal-and-_test_bm_everyday_driver)). Takes only `"everyday"`. | `"drive": "everyday"` |
| `personal` | Marks a page that shows what the account holds, and keeps the entry to selectors, counts and states. Takes only `true`, and goes with `drive`. | `"personal": true` |

A property the schema does not list is a configuration error.

### Kept out of every run: `deprecated` and `byHand`

Two properties keep a bookmarklet out of every run, each with the reason it
is kept out.

```json
"siteSpecific_Example_OldFeature": {
 "deprecated": { "why": "the site now has this feature itself" }
},
"siteSpecific_Example_Replaced": {
 "deprecated": { "see": "https://example.org/the-replacement" }
},
"siteSpecific_Example_Mailbox": {
 "byHand": "it works on a signed-in mailbox, so a person tests and updates it",
 "url": "https://mail.example.com/",
 "drive": "everyday",
 "personal": true,
 "signedIn": "#account-menu",
 "steps": [
  { "run": true },
  { "expect": { "selector": "#sidebar-handle", "count": 1 } }
 ]
}
```

- **`deprecated`** is a bookmarklet its site or a better tool has overtaken.
  It stays in `JSFormatted/` as it is, and is no longer tested or updated. It
  takes `why`, the reason, or `see`, the `https` address of what replaces it,
  one of the two. The entry holds nothing else, so nothing in it reads as
  still tested.
- **`byHand`** is a bookmarklet whose page is unsafe to automate, such as a
  signed-in mailbox. It is still maintained, by a person, and its entry keeps
  its page and steps as the record of how a person checks it. It takes no
  `skip`, `"scheduled": true` or `capture`, since no run reaches it.
- **Neither is ever run,** by a name, `--all`, `--scheduled`, `--short` or the
  everyday driver. The file is not checked, no browser starts for it, and
  neither the sign-in launcher nor the everyday driver is loaded for it.
- **Each has its own verdict,** `deprecated` or `by-hand`, with its reason; a
  `see` reads `replaced by <address>`, and the result carries `see` too. Both
  are counted in `report.json` and on the tally, and neither fails a run.
- An entry with both, `deprecated` with neither `why` nor `see` or with both,
  a `see` that is not an `https` address, or a deprecated entry holding any
  other property is a configuration error.

### Steps

Each step does exactly one thing.

| Step | What it does | Example |
| --- | --- | --- |
| `run` | Run the bookmarklet here. A second `run` runs it again, which is how a bookmarklet that turns itself off on a second run is checked. | `{ "run": true }` |
| `run` with `set` | Run it with variables changed first (see below). | `{ "run": { "set": { "img": "sample.png" } } }` |
| `bookmarklet` | Run another bookmarklet from `JSFormatted/` first, in the same page, the way a reader runs one bookmarklet to set up what the next one reads. Its file is checked as the entry's own is, and its errors and requests are judged the same way. An entry with one names its own run with a `run` step. | `{ "bookmarklet": "dom_Example_AddNoteBox" }` |
| `click` | Click a selector. See below for `button`, `withText`, `at` and `via`. | `{ "click": "button.toggle" }` |
| `hover` | Move the pointer over the first match. | `{ "hover": "#panel-handle" }` |
| `fill` | Type a value into a selector. The value can sit beside it as `value` or `text`, or both can be nested. | `{ "fill": "#search", "value": "Springfield" }` or `{ "fill": { "selector": "#search", "value": "Springfield" } }` |
| `press` | Press a key. With `selector` beside it, the key goes to that element. | `{ "press": "Enter", "selector": "#search" }` |
| `select` | Select a selector's text, the way a reader drags across it. | `{ "select": "p.intro" }` |
| `wait` | Wait a number of milliseconds, or for a selector to be on the page. | `{ "wait": 800 }` or `{ "wait": "#results" }` |
| `answer` | Answer every request to a host from the entry itself, until a later `answer` hands it back with `pass` (see below). | `{ "answer": { "host": "api.example.com", "status": 403 } }` |
| `detach` | Take the elements a selector matches off the page and keep them. `as` names what was taken. A selector matching nothing fails the entry. | `{ "detach": "table tr:has(th)", "as": "headerRow" }` |
| `attach` | Put back what an earlier `detach` took, where it came from. | `{ "attach": "headerRow" }` |
| `viewport` | Size the page for every step after this one (see below). | `{ "viewport": { "width": 1024, "height": 720 } }` |
| `expect` | Say what should be true (see [Expectations](#expectations)). | `{ "expect": { "selector": "#panel", "visible": true } }` |

**Aiming a click or a hover.** Three optional properties sit beside the
selector:

- `withText`: the element's own text, matched whole, to pick one match of
  several, such as one item of a menu;
- `at`: `{ "dx": n, "dy": n }` in CSS pixels from the element's centre, to aim
  somewhere other than its middle, as a map is clicked;
- `button` (a click only): `left`, `right` or `middle`.

```json
{ "click": "[role='menu'] [role='menuitem']", "withText": "Sample Item" },
{ "click": "canvas", "at": { "dx": 100, "dy": -110 } }
```

A fourth, `via`, goes only in an everyday entry (see
[The everyday browser](#the-everyday-browser-drive-personal-and-_test_bm_everyday_driver)).

**`run` with `set`.** Some bookmarklets ask the reader to edit a value before
saving them, such as `var img = "CHANGE_IMAGE";`. `set` makes that edit for the
run: the file must declare each name exactly once as `var <name> = "<string>"`,
and the value replaces that string as a string literal, so a quote or a
backslash in it stays inside the string. The changed file is checked again the
way the file itself was, before any browser starts. Nothing is ever written back
to the file. A name the file does not declare once as a string, a value that is
not a string, or `set` outside a `run` is a configuration error.

**`answer`.** Puts the page in a state only the site's own server can produce,
such as the 403 an API gives past its hourly limit:

```json
{ "answer": { "host": "api.example.com", "status": 403, "contentType": "application/json; charset=utf-8", "body": "{\"message\":\"API rate limit exceeded\"}" } },
{ "answer": { "host": "api.example.com", "pass": true } }
```

`contentType` defaults to `text/plain; charset=utf-8`, and `body` to nothing.
The answer carries `access-control-allow-origin`, so it reaches the
bookmarklet's code. A host answered this way must still be named in `network`,
with its reason, and its requests are still counted and judged.

**`detach` and `attach`.** Hold a state a site produces for a moment, such as a
listing replaced header row and all, long enough to assert against it. The
nodes are held outside the page, so the bookmarklet meets a page that lost
something, as it would on the site.

**`viewport`.** Lays the page out at another size from that step on. The entry's
own size, 1280x720 or 648x648 for a short, comes back when the entry ends. It is
how an expectation that reads geometry, as `clear` does, is asked at a width a
reader's window has: a heading that fits its column at 1280 can cover the one
beside it at 1024. Width and height are whole pixels from 100 to 4000.

### Expectations

| Expect | Passes when | Example |
| --- | --- | --- |
| `selector` + `visible` | The first match is showing. | `{ "selector": "#panel", "visible": true }` |
| `selector` + `hidden` | The first match is not showing. | `{ "selector": "#panel", "hidden": true }` |
| `selector` + `count` | The selector matches exactly that many elements. | `{ "selector": "li.note", "count": 1 }` |
| `selector` + `matches` | The selector matches as many elements as a second selector, such as one cell per listed row. The failure names both counts. | `{ "selector": "td.size", "matches": "table tr:has(a)" }` |
| `selector` + `text` | The first match holds that text somewhere in it. | `{ "selector": "h1", "text": "Acme Corp" }` |
| `selector` + `clear` | The first match paints its text inside its own box, and where the text runs past, over nothing that paints text of its own. It is the one expectation that reads geometry. | `{ "selector": "th.size", "clear": true }` |
| `clipboard` | The clipboard holds exactly that value, trimmed at both ends. Needs `clipboard-read`. | `{ "clipboard": "- [Home](https://example.com/)" }` |
| `clipboard` + `selector` | The clipboard holds that element's own value: its property named by `attr` when it has one, or else the attribute. `href` gives the absolute address. | `{ "clipboard": { "selector": "a.copy-link", "attr": "href" } }` |
| `clipboard` + its shape | The clipboard's value starts with that text, is on one line, or is not empty, for a value no entry could write down in full. Any of the three. | `{ "clipboard": { "startsWith": "javascript:", "singleLine": true, "nonEmpty": true } }` |
| `storage` | Compares the page's storage, `local` or `session`, with the keys it held before the first bookmarklet ran: `newKeys` is how many are new, and `valueIncludes` that each new key's value holds the text. The new keys are then removed, unless `remove` is `false`. Names and values stay in the page, and a failure gives counts. | `{ "storage": "local", "newKeys": 1, "valueIncludes": "Sample Note" }` |
| `check` | A check the everyday driver holds, by name, for what no selector can say, such as a distance read within a tolerance. Only in an everyday entry. | `{ "check": "map-distance" }` |
| `location` | The page's address holds that text, for a bookmarklet that navigates. | `{ "location": "#section-2" }` |
| `popup` | The address of a new tab the bookmarklet opened holds that text. | `{ "popup": "example.org" }` |
| `requests` + `count` | The bookmarklet sent exactly that many requests to the host since the last expect that counted it, or since the page opened. | `{ "requests": "api.example.com", "count": 1 }` |
| `requests` + `atMost` | The same count, bounded rather than fixed, for a span a site's own re-render can add one to. | `{ "requests": "api.example.com", "atMost": 2 }` |

### Fixture pages

```json
"url": "fixture:article.html"
```

A `fixture:<file>.html` url is a page in `test/fixtures/pages/`, served from
`https://fixtures.test/` without a network. A hash may follow the file name, as
`fixture:sidebar.html#intro`. The origin is a real one, so `localStorage`, the
clipboard and `location` behave as they do on a site; a `file://` page has an
opaque origin and refuses all three.

The folder holds nine practice pages (`index.html`, `article.html`,
`table.html`, `form.html`, `sidebar.html`, `video.html`, `lazy.html`,
`scroll.html` and `snippet.html`), which the deployed site also links to, and
two self-test pages that `test/harness.test.js` reads. A fixture that names a
page that is not there, or reaches outside the folder, is a configuration
error.

A fixture page is the right place for a bookmarklet whose job can be shown on
any page of the right shape: a run there needs no network and the page never
changes. A bookmarklet that checks the site's address before it acts does
nothing there, because the page's address is `https://fixtures.test/`.

### A page whose address stays out of the repository

```json
"url": "$EXAMPLE_PAGE_URL"
```

A url written as `$` and an upper-case name, such as a page on the reader's own
network, is read from that environment variable when the entry runs. The
address is never written down: every reason, `report.json` and `summary.txt`
names the variable in its place. An unset variable is a skip, not a failure,
and a variable holding anything other than an `http` or `https` address fails
the entry.

### Signed-in sites: `auth`, `signedIn` and `TEST_BM_AUTH_LAUNCHER`

Some bookmarklets only do their work on a page behind a sign-in. **No sign-in
and no session is ever in this repository**, and `test-bm.js` never signs in or
starts a signed-in browser itself. An entry asks for one by site name, and a
module outside the repository, the sign-in launcher, provides it:

```json
"siteSpecific_Example_ShowTotals": {
 "url": "https://app.example.org/dashboard",
 "auth": "example-app",
 "signedIn": "#account-menu",
 "requires": ["table.totals"],
 "steps": [
  { "run": true },
  { "expect": { "selector": "#totals-panel", "visible": true } }
 ]
}
```

**The entry.**

- `auth` is a site name of lower-case letters, digits and hyphens, up to 40
  characters. Entries that share a sign-in share the name.
- `signedIn` is a selector only the signed-in page has, and it is checked before
  `requires`. A page without it, or one that lands on another origin, is a skip
  reading `signed out of <site>`, not a site-changed failure.
- An entry with `auth` is never scheduled, captures nothing, and runs in
  Chromium only. Each of those is a configuration error if the entry asks for
  it.
- It runs read-only. A `click`, `fill` or `press` aimed at a form, a text area,
  an editable region or a submit control is refused before it acts.
- Nothing the page shows is written down. Its console messages and page errors
  are counted and not recorded, and `failure.md` gets only the selector or the
  message and the bookmarklet's own lines.

**The launcher.** `TEST_BM_AUTH_LAUNCHER` names it: an absolute path to an
ES module outside the repository. The module provides three functions, as its
default export or as named exports:

| Function | Called | Takes | Returns |
| --- | --- | --- | --- |
| `launch` | For each Chromium run of an entry with `auth`. Required. | `{ chromium, site, recordVideo }`: Playwright's Chromium browser type, the entry's `auth` name, and `recordVideo` as `{ dir, size }` for a `--short` run only (otherwise `undefined`). A launcher is free to ignore `recordVideo`. | A Playwright `BrowserContext` signed in to the site, or nothing when it has no sign-in for it. The harness opens its page in that context and closes the context when the entry ends. |
| `signIn` | Only by `node test-bm.js --sign-in <site>`. | `{ site }`, the site name and nothing else. | Nothing the harness reads. It opens the site for a person to sign in. |
| `signInState` | Once, at the end of a run in which any entry with `auth` got as far as checking `signedIn`. Optional. | An object of site names, each `true` when the run found it signed in and `false` when it did not. A site seen signed out once stays `false` for the run. | Nothing the harness reads. A throw is printed and changes no verdict. |

**When there is no sign-in, the entry is a skip.**

- With `TEST_BM_AUTH_LAUNCHER` unset, every entry with `auth` is a skip, so a
  machine without a launcher still runs everything else.
- A `launch` that returns nothing, throws, or returns something other than a
  browser context makes that entry a skip, with the reason.
- A variable that is set but wrong is exit 2 before any browser starts: a
  relative path, a path inside the repository, a file that is not there, a
  module that will not load, or one with no `launch`. `--sign-in` also needs
  `signIn`.

### A signed-in page on the reader's own network

A page on the reader's own network can need a sign-in too. The two sections
above fit together: the address comes from a url variable, and the sign-in from
`auth`. An entry for a bookmarklet that changes the image behind a status graph
on a self-hosted dashboard does both:

```json
"siteSpecific_Example_ChangeGraphImage": {
 "url": "$EXAMPLE_DASHBOARD_URL",
 "scheduled": false,
 "auth": "example-dashboard",
 "signedIn": "#account-menu",
 "requires": ["#status-graph"],
 "timeout": 45000,
 "steps": [
  { "run": true },
  { "expect": { "selector": "#status-graph[style*='background']", "count": 1 } },
  { "run": { "set": { "img": "sample-graph.png" } } },
  { "expect": { "selector": "#status-graph[style*='/static/img/sample-graph.png']", "count": 1 } }
 ]
}
```

- **The address.** `EXAMPLE_DASHBOARD_URL` holds the dashboard's page, such as
  `http://dashboard.local/#status`:

  ```bat
  setx EXAMPLE_DASHBOARD_URL "http://dashboard.local/#status"
  ```

  ```sh
  export EXAMPLE_DASHBOARD_URL='http://dashboard.local/#status'
  ```

  `setx` sets it for the shells opened after it. With it unset, the entry is a
  skip.
- **The sign-in.** `launch` is handed the site name, `example-dashboard`, and no
  address, so a launcher that signs in to it has to find the address itself;
  reading the same variable keeps it out of the launcher too. With no launcher,
  or one that has no sign-in for `example-dashboard`, the entry is a skip. A page
  that comes up at the dashboard's sign-in form has no `#account-menu`, so a
  signed-out run is a skip reading `signed out of example-dashboard`, never a
  failure.
- **Nothing on the device changes.** The entry asserts only `#status-graph` and
  its style. Nothing in it sends a command to whatever the dashboard runs.
- **The two paths.** The first `run` is the bookmarklet as published, which
  takes the graph's image away. The second sets `img`, as a reader would before
  saving the bookmark, and the last `expect` checks the address the bookmarklet
  writes into the graph's style, not that a file is served there.
- **Never scheduled.** `scheduled` stays `false`, because an entry with `auth`
  is never scheduled.

To open the same page by hand, in a chosen Chrome profile, use
[to-explorer](https://github.com/jhauga/to-explorer), a dev dependency that
`npm install` brings in:
`npx to-explorer --chrome [0-9]+ http://dashboard.local/#status`, where
`[0-9]+` is the profile's number.

### The everyday browser: `drive`, `personal` and `_TEST_BM_EVERYDAY_DRIVER`

Some pages never reach the harness's own browser: a site that answers an
automated browser with a bot check, or a page only the reader's own browser
profile shows. An entry with `"drive": "everyday"` runs in that everyday
browser instead. **`test-bm.js` never reaches it itself.** It hands the entry to
a driver, a module outside the repository, the way an entry with `auth` gets
its sign-in from the launcher:

```json
"siteSpecific_Example_HighlightRows": {
 "url": "https://app.example.org/inbox",
 "drive": "everyday",
 "personal": true,
 "signedIn": "#account-menu",
 "scheduled": false,
 "requires": ["table.rows"],
 "steps": [
  { "run": true },
  { "expect": { "selector": "tr[data-highlighted]", "count": 3 } },
  { "hover": "#row-handle", "via": "cdp" },
  { "run": true },
  { "expect": { "selector": "tr[data-highlighted]", "count": 0 } }
 ]
}
```

**The entry.**

- It is never scheduled, takes no `auth`, captures nothing, grants no
  `permissions` and names no `network`: the everyday browser is the reader's
  own, it is not run unattended, and the harness does not watch the requests a
  bookmarklet sends there. A bookmarklet that sends any is tested in the
  harness's own browser.
- Its `url` is a site's own `https` page, never a fixture, a variable or the
  default.
- It types into no prompt, and presses only keys that submit nothing: `Tab`,
  `Escape`, the arrows, `Home`, `End`, `PageUp`, `PageDown`, `Backspace` and
  `Delete`.
- It has no `select`, `answer`, `detach`, `attach` or `viewport` step, and no
  `clear`, `location`, `popup` or `requests` expectation. Each of those needs
  the harness's own browser.
- `signedIn` is a selector only the signed-in page has, which the driver looks
  for first. A page without it is a skip reading `sign-in wall`, since nothing
  here signs in.
- `"personal": true` marks a page that shows what the account holds, such as
  mail, chats or watch history. Such an entry names `signedIn`, and is kept to
  selectors, counts and states: no `withText`, no desktop input, and no
  expectation on `text`, the clipboard, `valueIncludes`, `matches` or a
  `check`.
- `via` on a `click`, `hover`, `fill` or `press` says how the driver sends it:
  `"cdp"`, an event inside the tab, which reaches no other window, or
  `"desktop"`, the computer's own mouse and keyboard, for a page that answers
  only real input.
- `{ "check": "<name>" }` names a check the driver holds, in lower-case letters,
  digits and hyphens, for what no selector can say.
- **`requires` may name what the driver needs before the steps,** not only what
  the bookmarklet reads: the product block of a shop's page, say, so a page
  that came up as a bot check is a skip naming that selector rather than a
  failure further on.

Each of these is a configuration error before anything runs.

**The driver.** `_TEST_BM_EVERYDAY_DRIVER` names it: an absolute path to an ES
module outside the repository, with a `run` function as its default export or a
named export. Set it only for the run that uses it:

```bat
set "_TEST_BM_EVERYDAY_DRIVER=C:\Users\<user>\AppData\Local\example-driver\everyday.mjs"
node test-bm.js siteSpecific_Example_HighlightRows
set "_TEST_BM_EVERYDAY_DRIVER="
```

```sh
_TEST_BM_EVERYDAY_DRIVER="$HOME/.local/share/example-driver/everyday.mjs" node test-bm.js siteSpecific_Example_HighlightRows
```

| | What it holds |
| --- | --- |
| **`run(job)` takes** | `{ name, file, code, url, requires, steps, dialogs, timeout, settle, personal, signedIn, bookmarklets }`: `file` is the formatted file, `code` the one line the harness checked, and `bookmarklets` the `{ file, code }` of each bookmarklet a `bookmarklet` step runs first. |
| **It returns** | `{ verdict, reason, inputs, realRuns }`: `pass`, `fail` or `skip`; a sentence of the driver's own, never anything a page said, up to 300 characters; which input each entry step sent, as `[{ "step": 4, "via": "cdp" }]`; and how many real runs it made. |

- **Nothing else it returns is kept**, so nothing a page showed reaches
  `report.json`, `summary.txt` or `failure.md`. A failure's section says only
  the driver's reason.
- **With the variable unset, every everyday entry is a skip** reading
  `no everyday driver`, so `npm test` and the scheduled run are unchanged on a
  machine without one. A variable that is set but wrong is exit 2 before any
  browser starts, under the same rules as the launcher's.
- **A driver that gives no verdict** inside three times the entry's `timeout`,
  plus two minutes, fails the entry, and so does one that throws.

**What a driver must keep to.** How it reaches the everyday browser is its own
business, and nothing in the repository knows it. Whatever it uses, it:

- acts only in a tab it opened for the entry, and closes that tab when the
  entry ends, whatever the page asks;
- never signs in or out, submits a form, posts, sends, buys, or changes a
  setting;
- on a `personal` page, reads selectors, counts and states only, and takes no
  screenshot;
- holds no secret, and is never committed.

One way to open the entry's page in a chosen Chrome profile is
[to-explorer](https://github.com/jhauga/to-explorer), a dev dependency that
`npm install` brings in:
`npx to-explorer --chrome [0-9]+ https://app.example.org/inbox`, where `[0-9]+`
is the profile's number. The driver then needs its own way to act in that one
tab.

## Scheduling a run

`node test-bm.js --scheduled` is the whole of what a scheduled job calls. It
waits for no input and needs no window. `test-bm.js` finds `JSFormatted/`,
`test-bm.json` and `test-results/` beside itself, so the job can start in any
folder as long as it names the script by its full path. `node` must be on the
`PATH` of the account the job runs as.

### Windows Task Scheduler

```bat
schtasks /Create /TN "test-bm scheduled" /SC DAILY /ST 06:00 /TR "node C:\path\to\bookmarklets\test-bm.js --scheduled"
```

`C:\path\to\bookmarklets` is the folder this repository is cloned into.
`schtasks /Query /TN "test-bm scheduled"` shows the task, and
`schtasks /Run /TN "test-bm scheduled"` runs it once to try it.

### cron

```sh
0 6 * * * cd /path/to/bookmarklets && node test-bm.js --scheduled
```

cron's `PATH` is short, so write `node`'s full path (`command -v node` prints
it) where cron does not find it.

### A notification keyed on the exit code

The exit code says what happened, so a notification needs nothing else:

| Code | Notify? | Why |
| --- | --- | --- |
| `0` | No | Nothing failed. Skips never fail a run. |
| `1` | Yes: a bookmarklet failed | A site changed or a bookmarklet broke. `summary.txt` and `failure.md` in the newest folder under `test-results/test-bm/` say which and why. |
| `2` | Yes: the run itself is broken | Playwright or Chromium is missing, `test-bm.json` was refused, or the harness itself stopped. The output says what to fix. |

On Windows, point the task at a small wrapper instead of `node` itself, kept
outside the clone, such as `C:\path\to\test-bm-scheduled.cmd`.
`C:\path\to\notify.cmd` stands for whatever reaches you: a mail client's
command line, a chat webhook, a toast.

```bat
@echo off
cd /d "C:\path\to\bookmarklets"
node test-bm.js --scheduled > "%TEMP%\test-bm-scheduled.txt" 2>&1
set "_testBmExit=%ERRORLEVEL%"
if %_testBmExit% EQU 1 call "C:\path\to\notify.cmd" "test-bm: a bookmarklet failed"
if %_testBmExit% GEQ 2 call "C:\path\to\notify.cmd" "test-bm: the run could not start"
exit /b %_testBmExit%
```

With cron, the same as a shell script, run by the cron line in place of
`node test-bm.js --scheduled`:

```sh
#!/bin/sh
cd /path/to/bookmarklets || exit 2
node test-bm.js --scheduled > /tmp/test-bm-scheduled.txt 2>&1
code=$?
if [ "$code" -eq 1 ]; then
  mail -s "test-bm: a bookmarklet failed" admin@example.com < /tmp/test-bm-scheduled.txt
elif [ "$code" -ne 0 ]; then
  mail -s "test-bm: the run could not start (exit $code)" admin@example.com < /tmp/test-bm-scheduled.txt
fi
exit "$code"
```

## What `npm test` runs

```sh
npm test
```

Four stages, in order, each run only when the one before it passed:

| Stage | Command | What it proves |
| --- | --- | --- |
| `test:harness` | `node --test test/harness.test.js` | That `test-bm.js` itself gives the right verdict. |
| `test:pages` | `node --test test/pages.test.js` | That the practice pages are fit to show a reader. |
| `test:gallery` | `node --test test/gallery.test.js` | That the deployed gallery and the pages it frames behave. |
| `test:bookmarklets` | `node test-bm.js --all` | That every bookmarklet still works where its entry says. |

### `test:harness`

Runs `test-bm.js` against the fourteen bookmarklets in
`test/fixtures/bookmarklets/`, each carrying one defect or none, with their own
configuration in `test/fixtures/test-bm.json`. `TEST_BM_JS_DIR` and
`TEST_BM_CONFIG` point the harness at them; nothing else sets those two. Each
test asserts the verdict and the reason the harness gives, so what is checked
is the harness rather than a copy of its reasoning.

It covers the one-line parse both ways, line comments, percent escapes,
missing semicolons,
the refusals of anything that could pass for malicious, the `network` rule,
fixture pages, signed-in entries, `--capture`, `--short` and its 15 second
cut, `failure.md`, `matches`, `clear`, urls held in a variable, `set`,
`answer`, `detach` and `attach`, `viewport`, both engines, the `bookmarklet`,
`hover`, `storage` and clipboard shape steps, everyday entries, and
`deprecated` and `byHand` entries, which no command runs.

No test here reaches a real sign-in or the everyday browser. Every run clears
`TEST_BM_AUTH_LAUNCHER` and `_TEST_BM_EVERYDAY_DRIVER` unless the test sets
one, and the tests that set them point them at stubs that sign in to nothing
and open nothing. The tests that need ffmpeg or Firefox skip themselves,
with a reason, where it is not installed.

The stills reading is the one test here that records real video and reads the
GIF back, so what it measures depends on how loaded the machine is: Chromium's
screencast hands over frames only as fast as it is let, and a page's own timer
can be starved past the end of the clip. It **records the run once more before
it fails**, and only a second disagreement is a failure. The failure then names
both attempts, so a reading that failed twice is told from one that failed once
and passed, and nothing about what it asserts is loosened to get there.

### `test:pages`

The pages under `test/fixtures/pages/` are two things at once: the fixtures
`test-bm.js` runs against, and the practice pages the deployed site links to.
`test-bm.js` proves the bookmarklets still work on them, and the harness tests
prove the harness reads them correctly. Neither says the pages are fit to show
anyone, and **`test/pages.test.js` is what keeps the practice pages fit to show
a reader.**

It renders the nine practice pages at 1280, 880 and 400 pixels wide and checks
that:

- every page is served, titled, and has exactly one `h1`, and no page skips a
  heading level;
- no page scrolls sideways, and nothing a page floats over itself covers the
  text under it;
- every table has a header row, and a caption where a reader reads it as
  content;
- every form control has a visible label tied to it;
- every page links back to the index, every page the index lists resolves, and every page the
  index lists carries the `Try these on this page` box the index promises it does;
- the pages' own scrolling boxes, captions, readouts and keyboard stops behave
  at each width.

### `test:gallery`

`index.html` and the five pages it frames from `examples/` are the whole of the
deployed site, and `test:pages` covers `test/fixtures/pages/` only, so until
11.20.2026 nothing opened either. **`test/gallery.test.js` is what keeps the
deployed site honest**, the way `pages.test.js` keeps the practice pages fit to
show a reader.

It serves the repository root on an origin of its own, so the frame shares the
origin of the page framing it as it does on the site, then leaves the gallery
alone for thirty seconds with one ordinary anchor appended to its navigation and
checks that:

- the slide show is still advancing, so the two guards below cannot pass by
  standing still;
- it adds no session history entry of its own, so Back leaves the page rather
  than rewinding the show;
- it steps the example links alone and never navigates the top level, so a link
  added anywhere on the page cannot send a reader off the site.

Then it opens each of the five examples directly, at 1280 and 390 pixels wide,
as a reader reaches one from a bookmark or a link, and checks that each is
served, renders in standards mode, names its language, skips no heading level,
names its own subject in its title and its one `h1`, does not scroll sideways,
and keeps any table inside a scrolling box of its own - a box that is a keyboard
stop, announced as a region, only where it has something left to scroll, so the
columns held out of view can be reached without a pointer.

Then it measures the ring that stop is drawn with, **as painted rather than as
declared**, on every example and width whose box is a stop, once in each colour
scheme. A clip of the box is shot focused and shot again with focus taken off it
at the same scroll position, and the two are differenced inside a page of its own,
where a canvas is the PNG decoder: only focus changed, so every changed pixel is
the ring and what the second shot holds under those pixels is the page behind it.
The contrast between the two has to reach the 3:1 WCAG 1.4.11 asks of a focus
indicator. A declared colour cannot say what surface it landed on, which is the
whole reason this reading exists: the saved page carries a background on its body
that propagates to the canvas, so it is painted near-white whatever a reader's
scheme asks for, and a dark branch that recoloured the ring alone read 2.42:1.
Its companion asserts the page is painted alike in both schemes, which is why one
`outline-color` serves both, and is the reading to change if the saved page is
ever given a real dark mode.

That ring is read a second time on the page as `index.html` frames it, which is
how the deployed site shows it, and that reading is split by side: a frame paints
nothing outside its own rect, so the frame edge is the one thing that could take a
side of the ring away, and a mean colour over the whole clip reads the same whether
four sides were painted or three. A side is held to the 3:1 only where the ring's
reach lands inside both the frame's rect and the shot.

The byline block in the corner of each saved page is read twice over, and on
both the standalone page and the framed one, because the block's own words are
the one thing on the page the overlay reading above cannot see: it skips every
run inside the block as the block's own text, which is what the block is for.
So the block's runs are measured against the block's painted box, where nothing
may end past its right or bottom edge, and against the `h1`'s runs, where
nothing may overlap at all. The framed reading is not the standalone one over
again: the frame is 330 pixels of a 390 pixel viewport and lays the example out
in 328, so a label that fits the block standalone can still leave it in the
frame, which is how the deployed site shows it.

A third reading answers a different edge: whether the label lands on the curve
the block is clipped by while still inside it. It steps the example's own layout
width from 320 to 1600 pixels, a pixel at a time, on all five pages, and solves
the corner at the lowest pixel of each glyph run. Three figures in that are easy
to take from the wrong place, and taking any of them from the wrong place reads a
label the clip is visibly biting into as clear of it:

- **the box.** `overflow: hidden` clips along the padding box, not the border
  box, so the block's 2 pixel border is 2 pixels the label may use;
- **the radius.** The curve the clip follows is the border-box radius less the
  border width, and its two axes part company where the borders differ;
- **the scaling.** CSS scales every radius on a box by one factor when a pair of
  them overruns the side they share, so the 80 pixels the style sheet asks for is
  not what a reader sees on a block narrower than that - which this one is, being
  a share of the page wide, below about 400 pixels of page.

Read against the border box and the declared radius instead, a label the clip was
taking the end of the final letter off came out 0.3 pixels clear.

A pixel at a time rather than at the widths already read, because the band is ten
widths wide: the label just fits on one line at 840 to 849 pixels and at 1191 to
1199 pixels of layout width, and nowhere else between 320 and 1600. The two
readings above are taken at 390 and 1280, and both bands sit between them. All
five pages rather than one, because the rule lives in the bookmarklet and is
copied inline into each page, so a copy left behind is what this catches - and it
would pass the two readings above, which stand outside either band. The whole
sweep is 1281 widths a page and reads in about a second each.

The keyboard readings press a key until the box has come to rest rather than a
fixed number of times. Chromium carries 40px a press and animates it, and a
press sent while the last one is still animating is coalesced rather than
queued, so a count of presses measures the machine as much as the box: twenty
five sent back to back carried the whole 474px on one run and 160px on the next,
with nothing changed between them.

Then it reads the gallery page as a page in its own right, which is what the
11.23.2026 batch of gallery work is guarded by. One load serves most of it,
because every reading is of the same unchanged page:

- the parts a validator and a phone need: `lang`, a `width=device-width`
  viewport, a description, the repository's own `favicon.png`, a `title` on the
  frame, no obsolete `frameborder`, no inline handler left anywhere, and a
  `<title>` and `<h1>` that read the same;
- the navigation against the frame at 1280, 1024 and 390 pixels: that the two
  are never laid over each other, that every example link is the thing under
  the pointer at its own middle, that no link's words are clipped, that the
  page never scrolls sideways, and that the navigation stacks above the frame
  on the phone width and sits beside it on the desktop one;
- that Tab reaches the five example links in the order the navigation lists
  them, each drawn with a ring `:focus-visible` says is there;
- that the frame is sized to the example it is showing rather than to the one
  before it, read as the tallest of the five and then the shortest, against the
  height of the page inside the frame plus the frame's own border - a border
  box takes those two pixels out of the viewport the example gets, and an
  example scrolling inside the frame by exactly that much is the defect;
- that the page says what the examples are: the bookmarklet that saved them by
  name, its gist, its short, and the repository;
- that it lists the eight practice pages with what to try on each;
- that the open example is marked with `aria-current`, and that nothing on the
  page still carries the `data-active` the style sheet alone used to read;
- that the address bar names the example a reader is looking at, that two
  choices add two history entries and no more, that one press of Back returns
  to the example chosen before, and that the gallery opened on an example's own
  address shows that example;
- that the page's script raises nothing over a run that opens it, resizes it
  three times, walks it with Tab and clicks through it.

The pause control and reduced motion are each read in a browser of their own,
because both are about what the show does over time rather than what the markup
says. The control is pressed: the frame is watched advancing, paused, watched
not advancing, played, and watched advancing again, with the button's own words
read at each step. Reduced motion is read in a context that asks for it, where
the frame's own `src` is one document request and the show never starting means
exactly that one request - and the control is pressed there too, because paused
by default is not the same as taken away.

The install animation gets a browser of its own for the same reason: what
settles it is the requests, not the markup. `loading="lazy"` on the image and
the image sitting inside a `<details>` are both read from the page above, and
neither of them says the 11 MB was never fetched - a `<details>` given an `open`
attribute reads the same in one and still costs a phone the download. So the
paths the page asks for are collected at the phone width: none of them the
animation while the page paints, exactly one of them once the disclosure is
opened, and the image arrived when it is.

### `test:bookmarklets`

`node test-bm.js --all`: every bookmarklet in `JSFormatted/`, run as its entry
says or with the default safe run. It is the stage that reaches live sites, so
it needs a network, and a site that changed fails it, which is the verdict it
exists to give. No entry here submits a form or sends a message, and on a
signed-in page the harness refuses any step that could. `test-bm.js` signs in
to nothing itself: an entry with `auth` runs on the browser the launcher gives
it, or is a skip, and an everyday entry runs through the driver, or is a skip.
A skip, such as an entry with `auth` on a machine with no launcher, an everyday
entry with no driver, or a url variable that is not set, never fails it. It writes its
report folder as any `--all` run does.

## Working with an AI assistant

[`AGENTS.md`](../AGENTS.md), at the repository root, is the procedure for any
coding assistant working here. It has been written for **Claude Code**,
**Codex** and **GitHub Copilot**, and all three read the same file:

- [Codex](https://learn.chatgpt.com/docs/agent-configuration/agents-md) reads
  `AGENTS.md` directly.
- [GitHub Copilot](https://docs.github.com/en/copilot/reference/custom-instructions-support)
  reads it directly too: its cloud agent (formerly its coding agent), Copilot
  CLI, and Copilot Chat in VS Code.
- [Claude Code](https://code.claude.com/docs/en/memory) reads `CLAUDE.md`,
  which here holds only `@AGENTS.md`, an import of the same file.

It holds:

- what a bookmarklet here may never do, which `node test-bm.js <name>`
  enforces;
- how to triage a failing test, starting from `failure.md`;
- the conventions for writing a bookmarklet;
- the hard limits an assistant keeps whatever a test says.

Read it there rather than here. The run stays the judge: an assistant proposes
an edit, and `node test-bm.js <name>` decides.

## Giving an assistant a browser

Step 2 of the triage in `AGENTS.md` opens the failing page in a browser. An
assistant gets one through the
[Playwright MCP server](https://github.com/microsoft/playwright-mcp),
[`@playwright/mcp`](https://www.npmjs.com/package/@playwright/mcp), which works
with Claude Code, GitHub Copilot in VS Code and Codex alike. Each registers it
with the same command and arguments:

```sh
npx @playwright/mcp@latest --isolated
```

**Always pass `--isolated`.** It keeps the browser's profile in memory and never
saves it to disk, so every session starts signed in to nothing, and everything
it stored is gone once the browser closes. Without it the server keeps a
persistent profile, which holds every sign-in made in it from then on. Never
sign in to anything in it either.

**Never connect it to the reader's own browser.** `--extension` and
`--cdp-endpoint` attach the server to a browser that is already running, with
every sign-in that browser carries, and a bookmarklet is not the only thing on
a page that can read them. `AGENTS.md` rules that out in its hard limits.

Each tool keeps its MCP servers in its own configuration, and where that lives
changes between releases, so follow the tool's own documentation for it:

| Assistant | Where it registers MCP servers |
| --- | --- |
| Claude Code | [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp) |
| GitHub Copilot in VS Code | [Add and use MCP servers in VS Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers) |
| Codex | [Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp), one configuration for the CLI and the IDE extension |

This repository commits no MCP configuration. Each reader registers the server
in their own tool, in the place its documentation names.
