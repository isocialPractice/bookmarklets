# Bookmarklets TODO

Planned work for this repository. `## Current` holds the next items to
complete, in order. The level 2 sections below it are the roadmap those items
are drawn from, and each item pulled into `## Current` keeps a nested `From:`
line naming its section. Versions here are dated, as `CHANGELOG.md` declares:
nothing is bumped, tagged or released, so a section states its intent and names
no version update.

The testing sections come first on purpose. Once `test-bm.js` exists, every
bookmarklet a later section adds lands with a `test-bm.json` entry and a
passing run, rather than being tested after the fact.

A new bookmarklet is one item from file to gist: its file in `JSFormatted/`,
its entry in `test-bm.json`, a passing `node test-bm.js <name>`, its gist, and
its README entry linking that gist. Runs post and update gists with
`gitHubTask`:

- **New bookmarklet**: post its gist with
  `gitHubTask /gr "JSFormatted\<name>.js" "<description>"`, add the README
  entry with the new gist's id, then commit with
  `gitHubTask /rg -m "new bookmarklet: <name>.js"`.
- **Repaired bookmarklet**: commit the fix with
  `gitHubTask /rg -m "update: <what changed>"`, which updates the posted gist
  from the working copy before it commits. Leave the file unstaged until then,
  because the gist step reads only unstaged changes.

## Current

- [x] Support bookmarklets for signed-in sites without keeping any sign-in in
  the repository
  - `"auth": "<site>"` names the sign-in an entry needs, such as `"chatgpt"`.
    Entries that share a sign-in share the name.
  - `test-bm.js` never signs in and never starts a signed-in browser itself.
    It loads the launcher module named by `TEST_BM_AUTH_LAUNCHER`, which must
    be an absolute path outside the repository, and asks it for a Playwright
    `BrowserContext` with `launch({ chromium, site })`. From there the entry
    runs as any entry does: the 1280x720 viewport, `fixture:` routes,
    `requires`, `steps`, the same injection and the same verdicts, and the
    harness closes the context when the entry ends.
  - The launcher, and whatever it signs in to, stays on the maintainer's
    machine: out of the repository and out of its documentation.
  - `node test-bm.js --sign-in <site>` calls the launcher's `signIn({ site })`
    and exits.
  - After a run, the harness calls the launcher's `signInState(states)` once,
    with `true` for each site whose entry reached its page signed in and
    `false` for each that was sent to sign in, so the launcher can say which
    sign-ins are missing. The harness itself sends no message about it.
  - `TEST_BM_AUTH_LAUNCHER` unset, or a launcher with no sign-in for the site,
    makes the entry a skip with the reason, never a failure, so a scheduled
    run on a machine without one stays green.
  - An entry with `auth` also gives `signedIn`, a selector only a signed-in
    page has, because a site such as ChatGPT serves a signed-out page on its
    own origin rather than redirecting. A page without it, or one that lands
    off the entry's origin as a sign-in page does, is a skip reading
    `signed out of <site>`, never a `site changed` failure.
  - An entry with `auth` runs read-only. Before a `click`, `fill` or `press`
    acts, the harness checks its live target, or the focused element for a
    `press` with no selector, and refuses the entry if that is a submit
    control, a `textarea`, a `contenteditable` element or anything inside a
    `<form>`: the places a site sends a message or saves a change. A control
    the bookmarklet adds outside them, such as its own search box, stays
    usable.
  - An entry with `auth` writes down nothing the page shows. Its report holds
    the verdict, the reason, selectors and counts, never page text, HTML, an
    ARIA snapshot, a screenshot, video, the page's console messages or what
    the clipboard holds, and an `expect` on `text` or `clipboard` fails
    without quoting what it found.
  - Its `url` names no conversation, message, order or account: a site's
    landing page, or an address from an environment variable once `url` reads
    one.
  - Done when `test/harness.test.js` holds a fixture with `auth` that skips
    with `TEST_BM_AUTH_LAUNCHER` unset, passes through a stub launcher, is
    refused for a `fill` inside a `<form>`, is a `signed out` skip when its
    `signedIn` selector is missing, and hands the stub the right
    `signInState`.
  - **Goal**: Resolve the maintainer's own launcher to
    [signed-in-sites.prompt.md](.claude/prompts/signed-in-sites.prompt.md).
  - From: Test Harness
- [ ] Write entries for the ChatGPT and Gmail bookmarklets, each with `auth`,
  `signedIn` and `"scheduled": false`, and for the Amazon one as a guest
  - Three of the five failures the 11.08.2026 `--all` run reported are the
    ChatGPT and Gmail bookmarklets meeting `https://example.com/`, which is
    the absence of an entry rather than a fault.
  - `siteSpecific_Amazon_HideVideoPauseIcon.js` hides the
    `vjs-big-play-button` a guest meets on any product page with a video, so
    its entry has no `auth`, lists that class in `requires`, and is scheduled
    by the rule the other public site-specific entries follow.
  - For each signed-in site, record whether the run's browser stays signed
    in; it reports `navigator.webdriver` true. A site that challenges or signs
    it out is a skip with that reason, not a failure, and the missing sign-in
    reaches the maintainer through `signInState` alone.
  - From: Test Configurations
- [ ] Let `url` read an environment variable, as in `"url": "$OCTOPRINT_URL"`,
  and write the OctoPrint entry with it
  - OctoPrint runs on a printer on the maintainer's own network, so its address
    does not belong in the repository. An unset variable is a skip.
  - The address a variable holds never appears in a reason, `report.json`,
    `summary.txt` or `failure.md`; each names `$OCTOPRINT_URL` in its place,
    so a pasted log or an assistant reading the report never learns it.
  - From: Test Configurations
- [x] `siteSpecific_YouTube_WatchRandomVideo.js` finds no videos on the home
  feed, so it opens nothing
  - **Issue**: It reads the home feed through
    `.yt-lockup-view-model__content-image`, which YouTube no longer serves. The
    entry fails with `site changed: .yt-lockup-view-model__content-image not
    found on https://www.youtube.com/`, and the class carries a `HOT-GLUE - may
    change` comment in the source saying this was expected.
  - **Goal**: Read what the signed-out home feed serves now, take the link from
    that, and keep the entry's `requires` naming whatever replaces it so the next
    redesign is reported the same way rather than as a silent no-op.
  - **Short**: once the entry passes, make the bookmarklet's short and post it
    as `## Short Videos` describes, built with the
    `adobe-after-effects-scripting` skill from the After Effects project the
    run's constants name.
  - In its recording, every thumbnail on the home feed is swapped for a
    generic cover graphic, a plain card with a placeholder title such as
    `Sample Video 3`, before the bookmarklet runs, and the video it opens plays
    with the sound off, so the short shows no one else's thumbnails and plays
    no one else's audio.
  - From: Existing Bookmarklets

### Create and Deploy GitHub Pages Override

- No site

## Test Harness

A script that answers one question for any bookmarklet: does it still work on
the page it was written for? Playwright drives a real Chromium, which is the
nearest thing to a user clicking the bookmark: real layout, real content
security policies, real dialogs and clipboard. It records video when asked, and
it can reuse a signed-in session without the session ever entering the
repository. Puppeteer covers Chromium only, and Selenium needs a driver per
browser for the same result.

- [x] Support bookmarklets for signed-in sites without keeping any sign-in in
  the repository
  - `"auth": "<site>"` names the sign-in an entry needs, such as `"chatgpt"`.
    Entries that share a sign-in share the name.
  - `test-bm.js` never signs in and never starts a signed-in browser itself.
    It loads the launcher module named by `TEST_BM_AUTH_LAUNCHER`, which must
    be an absolute path outside the repository, and asks it for a Playwright
    `BrowserContext` with `launch({ chromium, site })`. From there the entry
    runs as any entry does: the 1280x720 viewport, `fixture:` routes,
    `requires`, `steps`, the same injection and the same verdicts, and the
    harness closes the context when the entry ends.
  - The launcher, and whatever it signs in to, stays on the maintainer's
    machine: out of the repository and out of its documentation.
  - `node test-bm.js --sign-in <site>` calls the launcher's `signIn({ site })`
    and exits.
  - After a run, the harness calls the launcher's `signInState(states)` once,
    with `true` for each site whose entry reached its page signed in and
    `false` for each that was sent to sign in, so the launcher can say which
    sign-ins are missing. The harness itself sends no message about it.
  - `TEST_BM_AUTH_LAUNCHER` unset, or a launcher with no sign-in for the site,
    makes the entry a skip with the reason, never a failure, so a scheduled
    run on a machine without one stays green.
  - An entry with `auth` also gives `signedIn`, a selector only a signed-in
    page has, because a site such as ChatGPT serves a signed-out page on its
    own origin rather than redirecting. A page without it, or one that lands
    off the entry's origin as a sign-in page does, is a skip reading
    `signed out of <site>`, never a `site changed` failure.
  - An entry with `auth` runs read-only. Before a `click`, `fill` or `press`
    acts, the harness checks its live target, or the focused element for a
    `press` with no selector, and refuses the entry if that is a submit
    control, a `textarea`, a `contenteditable` element or anything inside a
    `<form>`: the places a site sends a message or saves a change. A control
    the bookmarklet adds outside them, such as its own search box, stays
    usable.
  - An entry with `auth` writes down nothing the page shows. Its report holds
    the verdict, the reason, selectors and counts, never page text, HTML, an
    ARIA snapshot, a screenshot, video, the page's console messages or what
    the clipboard holds, and an `expect` on `text` or `clipboard` fails
    without quoting what it found.
  - Its `url` names no conversation, message, order or account: a site's
    landing page, or an address from an environment variable once `url` reads
    one.
  - Done when `test/harness.test.js` holds a fixture with `auth` that skips
    with `TEST_BM_AUTH_LAUNCHER` unset, passes through a stub launcher, is
    refused for a `fill` inside a `<form>`, is a `signed out` skip when its
    `signedIn` selector is missing, and hands the stub the right
    `signInState`.
  - **Goal**: Resolve the maintainer's own launcher to
    [signed-in-sites.prompt.md](.claude/prompts/signed-in-sites.prompt.md).
- [ ] Add `--capture` and a `capture` property: a screenshot before and after
  the bookmarklet runs, and a video of the whole entry
  - Fixed viewport, fixed steps, and no clock or random value rendered into the
    page by the harness, so two captures of an unchanged bookmarklet match.
  - The report lists each artifact path and the time offset at which every step
    started, so a clip can be cut to the moment the bookmarklet ran without
    anyone scrubbing through it.
  - A failure always keeps its after screenshot, captured or not, except in an
    entry with `auth`, which captures nothing: a signed-in page shows the
    account and what it holds.
  - These captures are also the footage for `## Short Videos`.
- [ ] Add `--browser firefox` as a second engine
  - Bookmarklet handling differs between engines, and Firefox is the second
    most likely place a reader pastes one. Chromium stays the default and the
    only engine `--scheduled` uses unless an entry asks for more.

## Test Configurations

Entries in `test-bm.json` for the bookmarklets already published. The default
safe run covers anything without an entry; these entries add the assertions
that show a bookmarklet did its job, rather than merely not crashing.

- [ ] Write entries for the ChatGPT and Gmail bookmarklets, each with `auth`,
  `signedIn` and `"scheduled": false`, and for the Amazon one as a guest
  - `siteSpecific_Amazon_HideVideoPauseIcon.js` hides the
    `vjs-big-play-button` a guest meets on any product page with a video, so
    its entry has no `auth`, lists that class in `requires`, and is scheduled
    by the rule the other public site-specific entries follow.
  - For each signed-in site, record whether the run's browser stays signed
    in; it reports `navigator.webdriver` true. A site that challenges or signs
    it out is a skip with that reason, not a failure, and the missing sign-in
    reaches the maintainer through `signInState` alone.
- [ ] Let `url` read an environment variable, as in `"url": "$OCTOPRINT_URL"`,
  and write the OctoPrint entry with it
  - OctoPrint runs on a printer on the maintainer's own network, so its address
    does not belong in the repository. An unset variable is a skip.
  - The address a variable holds never appears in a reason, `report.json`,
    `summary.txt` or `failure.md`; each names `$OCTOPRINT_URL` in its place,
    so a pasted log or an assistant reading the report never learns it.

## Existing Bookmarklets

Fixes and changes to bookmarklets already published. The first full test run
files its failures here. A fix is finished when its posted gist carries it too.

- [ ] Add an `s, s` key sequence to `siteSpecific_chatGPT_NavigateAnswers.js`
  that returns the page to normal
- [x] `siteSpecific_YouTube_WatchRandomVideo.js` finds no videos on the home
  feed, so it opens nothing
  - **Issue**: It reads the home feed through
    `.yt-lockup-view-model__content-image`, which YouTube no longer serves. The
    entry fails with `site changed: .yt-lockup-view-model__content-image not
    found on https://www.youtube.com/`, and the class carries a `HOT-GLUE - may
    change` comment in the source saying this was expected.
  - **Goal**: Read what the signed-out home feed serves now, take the link from
    that, and keep the entry's `requires` naming whatever replaces it so the next
    redesign is reported the same way rather than as a silent no-op.
  - **Short**: once the entry passes, make the bookmarklet's short and post it
    as `## Short Videos` describes, built with the
    `adobe-after-effects-scripting` skill from the After Effects project the
    run's constants name.
  - In its recording, every thumbnail on the home feed is swapped for a
    generic cover graphic, a plain card with a placeholder title such as
    `Sample Video 3`, before the bookmarklet runs, and the video it opens plays
    with the sound off, so the short shows no one else's thumbnails and plays
    no one else's audio.

### From the Open Issues

The repository's open GitHub issues, each needing the live site to confirm.
`test-bm.js` reaches every one of these pages, so an entry under
`## Test Configurations` is what turns each into something a run can judge
rather than something a person has to reproduce by hand.

- [ ] `siteSpecific_GitHub_ShowFileSize.js` writes only part of the file sizes
  the first time a directory loads
  - **Issue**: File size data is sometimes partially written into the updated
    table, on the first load of a directory. The cause was never found.
  - **Goal**: Write a `test-bm.json` entry that loads a directory page cold and
    counts the size cells against the rows, so the partial write is a verdict
    rather than a sighting. Fix what the entry then shows, and close the issue
    with `Fixes #1`.
  - Measured on 11.08.2026, signed out and headless, on this repository's own
    root: the size column header is added and ten of the twelve rows get a size
    cell, so the partial write reproduces without a signed-in session.
  - <https://github.com/isocialPractice/bookmarklets/issues/1>
- [ ] `siteSpecific_GitHub_ShowFileSize.js` writes no file sizes when the repo
  root is reached from the navigation path
  - **Issue**: Viewing the repo root from the tree view and then clicking the
    repo root link in the navigation path above the table leaves the sizes
    unloaded. It appears to happen only on the first navigation to the root.
  - **Goal**: Give the entry a step that clicks the navigation path's root link
    from a tree view, then expects a size in every row. Fix what it shows, and
    close the issue with `Fixes #2`.
  - <https://github.com/isocialPractice/bookmarklets/issues/2>
- [ ] `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` breaks on an answer
  holding a `\u` sequence
  - **Issue**: An answer containing `\u` is written out without the backslash
    being doubled, so the pasted bookmarklet carries a broken escape.
  - **Goal**: Escape the sequence where the answer is encoded. The file already
    turns a backslash into `&#x5c;` when it encodes a code block, so decide
    whether that path is the one missing the case, or whether the plain text
    path needs its own. The entry for this bookmarklet needs an answer holding
    `\u` to paste. Close the issue with `Fixes #4`.
  - <https://github.com/isocialPractice/bookmarklets/issues/4>
- [ ] `siteSpecific_YouTube_ShowShortReleaseDate.js` breaks on a short behind a
  viewer discretion notice
  - **Issue**: A short that opens with an approval request has a different DOM,
    and the bookmarklet breaks on it rather than skipping it.
  - **Goal**: Read the DOM of a short behind the notice, and leave that short
    alone instead of breaking. Close the issue with `Fixes #11`.
  - <https://github.com/isocialPractice/bookmarklets/issues/11>
- [ ] `siteSpecific_YouTube_ShowShortReleaseDate.js` renders nothing on the
  first visit to YouTube
  - **Issue**: Running it on a first visit to the site renders no data, because
    the markup it reads is not the markup a first visit serves.
  - **Goal**: Wait for, or read, whatever the first visit does serve. An entry
    with a fresh context is a first visit every time, so this one is testable
    without any sign-in. Close the issue with `Fixes #14`.
  - <https://github.com/isocialPractice/bookmarklets/issues/14>

## AI-Assisted Verification

A failing test says that something changed. Finding what changed on a
redesigned site, and the smallest edit that fixes the bookmarklet, is work an
agent with a browser does well. The deterministic run stays the judge: an agent
proposes, and `test-bm.js` decides.

Everything here is tool-neutral. The procedure is written once, in a tracked
file every assistant reads, rather than once per assistant.

- [ ] Make a failure report an agent can act on without re-running anything
  - For a `requires` failure: the missing selector, the lines of the
    bookmarklet that use it, and an ARIA snapshot (`locator.ariaSnapshot()`)
    plus trimmed outer HTML of the region where it was expected.
  - For a thrown error: the message, the stack mapped back to lines in the
    formatted file, and the after screenshot.
  - Write it as `failure.md` beside `report.json`, so any assistant reads it as
    plain text.
  - For an entry with `auth`, only the selector or the message and the
    bookmarklet's own lines: no ARIA snapshot, HTML, stack frames from the page
    or screenshot, because those would hand a signed-in page's content to an
    assistant.
- [ ] Write the triage procedure in a tracked `AGENTS.md` at the repository
  root
  - Codex and GitHub Copilot's coding agent read `AGENTS.md` directly. Claude
    Code reads `CLAUDE.md`, so add one whose only content is `@AGENTS.md`.
    `.github/` and `.claude/` are hidden by the ignore rules here, so neither
    is a place for anything another contributor's assistant needs.
  - The procedure: read `failure.md`; open the page with the browser tool the
    assistant has; find what replaced the missing selector; make the smallest
    edit to the bookmarklet; run `node test-bm.js <name>` and report its
    verdict.
  - Restate the authoring conventions in the file as well: block comments
    only, a semicolon after every statement, top-level names suffixed with the
    file's focus and action, and styling through the CSSOM. The automation's
    copy of them is in an untracked file, so a contributor's assistant would
    otherwise never see them.
  - Hard limits, stated in the file: never sign in, never run
    `node test-bm.js --sign-in`, never attach a browser tool to a browser that
    is signed in to anything, never submit a form or send a message, and never
    loosen a `test-bm.json` expectation to make a test pass unless the
    bookmarklet's intended behaviour changed, saying so when it did.
- [ ] Document how each assistant gets a browser
  - The Playwright MCP server (`@playwright/mcp`) works with Claude Code,
    GitHub Copilot in VS Code, and Codex. Each tool registers MCP servers in its
    own config file, and those locations change between releases, so link each
    tool's documentation rather than restating a path.
  - Run it with an isolated profile (`--isolated`), never in a mode that
    connects it to the reader's own browser, which carries their sign-ins.
  - Config files such as `.mcp.json` start with a dot and are hidden by the
    ignore rules here, so this is documentation, not a committed config.

## Testing Documentation

How to install, run, configure and schedule `test-bm.js`, written in
`docs/testing.md` and linked from the README. Documentation only: items pulled
from here carry `From: version.control = null`.

- [ ] Write `docs/testing.md`: install (`npm install`, then
  `npx playwright install chromium`), run one, run all, run the scheduled set,
  the flags, the exit codes, and where the report is written
- [ ] Add a configuration reference to `docs/testing.md`: every property with
  an example, what the default safe run does and does not prove, fixture
  pages, and `auth`
  - Describe `auth`, `signedIn` and `TEST_BM_AUTH_LAUNCHER` by contract alone:
    what a launcher's three functions take and return, that an entry without
    one is a skip, and that no sign-in or session is ever in the repository.
    No launcher, browser profile or account is described.
  - Examples use `example.com`, `example.org` and placeholder bookmarklet
    names only.
- [ ] Add a scheduling section to `docs/testing.md`: a Windows Task Scheduler
  example (`schtasks /Create ... /TR "node test-bm.js --scheduled"` with a
  placeholder path), a cron line for the same, and how to key a notification on
  the exit code
- [ ] Add an AI-assisted section to `docs/testing.md` that points at
  `AGENTS.md`, and name Claude Code, Codex and GitHub Copilot as the
  assistants it has been written for
- [ ] Document the three stages `npm test` runs in `docs/testing.md`:
  `test:harness`, `test:pages` and `test:bookmarklets`, what each one proves,
  and that `test/pages.test.js` is what keeps the practice pages fit to show
  a reader
- [ ] Add a short Testing paragraph to the README intro linking
  `docs/testing.md`

## Improve GitHub Pages Site

The site at `https://isocialpractice.github.io/bookmarklets/` stays the
repository's one site. It is `index.html`, a gallery that shows the pages in
`examples/` in a frame, served by a legacy GitHub Pages build from `main` at
`/`, and the README's intro links to it. The README is past the automation's
documentation-site thresholds, so `- No site` under
`### Create and Deploy GitHub Pages Override` stays. Every item here improves
the deployed site's own files; none changes the Pages source or build type or
adds a second site. Pages publishes what is committed to `main`, so a page
committed here is a page on the site.

- [ ] Make `index.html` work on a phone and pass the W3C validator
  - Add `lang="en"`, `<meta name="viewport">`, a description, and the
    repository's `favicon.png`. Give the frame a `title`.
  - Replace the absolutely positioned 15% side navigation and the floated 80%
    frame with a grid that stacks the navigation above the frame on narrow
    screens.
  - Style the frame's border with CSS in place of the deprecated
    `frameborder` attribute, which also lacks a space before it today.
  - Make the `<title>` and the `<h1>` agree. They read "Bookmarklet Examples"
    and "Bookmarklets Examples" today.
- [ ] Let a reader control the slideshow
  - It advances every three seconds until something is clicked, cycles every
    `<a>` on the page, and treats a hover as a click. Scope it to the example
    links and give it a visible pause and play button.
  - Stop it on any click, focus or key press, and never start it when the
    reader's system asks for reduced motion (`prefers-reduced-motion`).
    Content that moves on its own needs a way to pause it (WCAG 2.2.2).
- [ ] Give each example its own address
  - Choosing an example sets `#<example-file-name>` in the address bar,
    opening the page with that hash shows that example, and Back returns to
    the previous one. The README can then link straight to an example.
  - Mark the open example's link with `aria-current="page"` in place of
    `data-active`, with a visible focus style.
  - Size the frame from the example's `load` event and a `ResizeObserver` on
    its body. The examples share the site's origin, so this replaces the
    polling loop that runs every 100 ms and stops after 300.
- [ ] Explain the page above the gallery
  - Say what the examples are: pages that
    `ChatGPT - Paste Ready Bookmark Response` saved as bookmarks, each shown
    as a reader would see it on opening the bookmark. Link the bookmarklet's
    README entry, raw file, gist and short.
  - Add a short how-to-install with `support/Demo-ReadyToUse.gif`, and a link
    to the README for the full list.
- [ ] Add examples from the other two bookmarklets that save an answer as a
  bookmark: `ChatGPT - Bookmark a specific response` and
  `Google - Paste Ready Bookmark AI Response`
  - Two or three each, made by running the bookmarklet on a real answer and
    saving the page the bookmark opens, in the same form as the existing five.
  - Name each after its site, bookmarklet and topic, extending the
    `chatGPT_Bookmark_<Topic>.html` pattern so the two ChatGPT bookmarklets'
    files stay apart.
  - Group the side navigation by bookmarklet, one heading each, as the `<h3>`
    above the existing five does now.
- [ ] Add more `ChatGPT - Paste Ready Bookmark Response` examples, including
  one answer with several code blocks and one with a table, the content a
  saved bookmark has to keep intact
  - Topics stay ordinary subjects, as the existing ones are (a schedule, a
    musical, marketing, computer science). No personal details or private
    conversations go into an example.
- [ ] Add practice pages, where a reader can try the bookmarklets that work on
  any page (`dom_`, `nav_`, `style_` and `window_`): an article with headings
  and long text, a table, a form, a page with a sidebar, and one with a video
  - Link them from the gallery under their own heading, each listing the
    bookmarklets to try on it.
  - Make them the same pages as the test fixtures under `## Test Harness`, so
    one set serves both the site and the tests. They are in
    `test/fixtures/pages/` as of 11.08.2026 - an article, a table, a form, a
    sidebar, a video, a page whose loader never finishes, a long page, a small
    page holding one of each thing a converter handles, and an index listing
    them. Pages already serves them; this item is the gallery link.
- [ ] Add an install page with a drag-to-install link for each bookmarklet
  - A site can render `<a href="javascript:...">` for a reader to drag onto
    the bookmarks bar, which a GitHub README cannot. Build each `href` from the
    same join `test-bm.js` checks, percent-encoded, so what installs is what
    was tested.
  - One row per bookmarklet: name, one-line description, status ("ready to
    use" or "requires N changes"), the link to drag, and links to its README
    entry, gist and short.
  - Pages runs no build here, so a script generates the page and the result is
    committed. Regenerate it whenever a bookmarklet is added or repaired.
- [ ] Check the deployed site in the scheduled run
  - Open the live site, open every example and practice page from its
    navigation, and fail on a broken link, a missing page, or a console error
    from the site's own script.
  - After a push that changes the site, wait for the Pages build to finish
    (`gh api repos/isocialPractice/bookmarklets/pages/builds/latest`) before
    checking.

## Short Videos

One short per bookmarklet: its essential use in under ten seconds, framed with
the repository's stamp border, posted to YouTube and linked from its README
entry. Shorts are made in the maintainer's After Effects project on this
machine. The project, its folders and the accounts posted to are local, and the
run's constants keep them under `## Social Media Posting`.

Each README entry links its videos from a block that takes the place of its
`<!-- PASTE VIDEO HERE -->` comment, below the gist paragraph:

```html
<details>

<summary>Show Details</summary>

<br>

<b>Video Demonstration for Use:</b>

- `Ctrl + click` link to view short on YouTube [Short - <Focus> - <What It Does>](https://www.youtube.com/shorts/<id>)
<!-- - `Ctrl + click` link to view demo on YouTube [Demo - <Focus> - <What It Does>](https://www.youtube.com/watch?v=<id>) -->

</details>
```

`<Focus>` and `<What It Does>` are the second and third parts of the file name,
spelled the way the entry's heading spells them: `dom_Note_TakePageNotes` links
as `Short - Note - Take Page Notes`. The demo line stays commented out until
the bookmarklet has a demo.

- [ ] Move `OctoPrint - Change Graph Image`'s older demo link, which sits above
  its gist paragraph, into a video block's demo line in place of its comment,
  with the short line commented out until its short exists
  - The README keeps its CRLF line endings.
- [x] Write two general-use After Effects skills at user level, outside this
  repository: `adobe-after-effects-scripting` and
  `adobe-after-effects-integrations`
  - `adobe-after-effects-scripting` is for automating After Effects and
    writing or editing its scripts: ExtendScript (`.jsx`, `.jsxbin`) and its
    ES3 limits, the `app` object model from projects and folders down to
    layers, properties and keyframes, undo groups, the render queue and
    `queueInAME`, running a script from outside (`AfterFX.exe -s` and `-r`),
    `aerender`, and expressions.
  - `adobe-after-effects-integrations` is for what runs beside or inside After
    Effects: CEP panels, and UXP where the installed version has it; C++
    effect and AEGP plugins built on the After Effects SDK; and MCP servers or
    other bridges that let an outside program drive it.
  - Each description says where the other begins, so a request loads one of
    them: code After Effects runs is scripting, and a component that loads
    into After Effects or drives it from outside is integrations. An MCP
    server's tools are integrations; the ExtendScript they send is scripting.
  - General use means nothing from this repository or the maintainer's
    project in either skill: no frame sizes, folders, compositions, paths or
    accounts. The short script below and `## Social Media Posting` keep those,
    and the examples use placeholder names.
  - Written before the short script below, the scripting skill's first use.
    The After Effects MCP server under `## Demo Videos - paused` is the
    integrations skill's.
  - Done when each loads in a session opened outside this repository, is
    chosen for a request in its own area and not for one in the other's, and
    states nothing about After Effects that the scripting guide or the SDK
    documentation does not.
- [x] Write the short script: an ExtendScript (`.jsx`) file kept beside the
  After Effects project, outside version control, that builds one
  bookmarklet's short and queues its renders
  - It takes the bookmarklet's name. `AfterFX.exe -s` runs a script string, so
    a run can set the name and then `$.evalFile` the script.
  - A new composition named after the bookmarklet: 648x648, 10 fps, duration
    `0:00:10:00`. A square frame is what makes YouTube file the upload as a
    Short.
  - Import the recording into the project's folder for source GIFs.
  - Add the project's stamp border composition as a layer: anchor point
    centered, uniform scale 25%, aligned to the composition's top right.
  - Add the recording as a layer: anchor point centered, aligned to the
    composition's center both ways, and moved to the bottom of the layer
    stack, below the stamp border.
  - The length follows the recording. One shorter than ten seconds sets the
    work area to the recording layer, so the render ends with it. A longer one
    is time-stretched (`layer.stretch`) to end at `0:00:10:00`.
  - Render an H.264 MP4 through After Effects' own output module, at its
    highest-bitrate H.264 template, then make the animated GIF from that MP4
    outside After Effects; both are named after the bookmarklet. Save the
    project. `queueInAME` was the first plan, but Media Encoder gives every
    item it queues its most recently used preset, so one call cannot make
    both formats.
  - The script reports what it did as JSON, which needs After Effects'
    **Allow Scripts To Write Files And Access Network** preference.
  - Running it again for the same bookmarklet replaces that composition rather
    than adding a second one.
  - Check it against the two shorts already made: `dom_Note_TakePageNotes`, a
    9.7-second recording kept at its length, and
    `siteSpecific_chatGPT_PasteReadyBookmarkResponse`, 26.5 seconds played in
    10. The script's renders match them in size, frame rate and length.
  - Post a short with its `https://www.youtube.com/shorts/<id>` link, and
    confirm that link opens as a Short rather than redirecting to the watch
    page.
- [ ] Let `gitHubTask` (on `PATH`, outside this repository) post a short
  without prompts
  - `gitHubTask /v` uploads unattended when it is given the title,
    description, tags and privacy, but its only playlist is the demo playlist,
    picked by a `_Demo` file-name prefix. Give it the shorts playlist.
  - Passing its tags argument through to the upload is already planned on the
    `gitHubTask` side.
  - Add the GIF posting the run's constants describe. The key is read from the
    local note at run time and never written into the script.
  - Leave each new video's URL where a run can read it, for the README.
  - Found posting the first short on 11.10.2026, each worked around for that
    run only:
    - The upload takes the video's path with everything up to its first
      backslash removed, so only a path one folder deep reaches the upload
      script; a deeper one fails with "Please specify a valid file".
    - The upload script's error handler is written in Python 2 form, so an
      API error surfaces as a `NameError` and its real message is lost.
    - The Python it runs had none of its libraries (`httplib2`,
      `google-api-python-client`, `oauth2client`), and its saved sign-in had
      expired. Google ends a refresh token for an app in testing status after
      seven days, so publishing the app in its Google Cloud project is what
      keeps the sign-in alive.
    - A failed upload still reports that the run completed and copies a
      snippet with an empty link to the clipboard.
- [ ] Add `--short` to `test-bm.js`: run an entry's steps at a 648x648 viewport
  and save a 10 fps GIF of under ten seconds as the bookmarklet's recording
  - Builds on `--capture` under `## Test Harness`. Start just before the
    bookmarklet runs and stop once its result is on screen.
  - Write to the folder named by a `TEST_BM_SHORTS_DIR` environment variable,
    defaulting to `test-results/shorts/`.
  - Never overwrite a recording that is already there. The maintainer's hand
    recordings come first.
  - An entry with `auth` records through its launcher, as its test runs, and
    its recording stays on the machine until the maintainer has reviewed it.
- [ ] Make and post the shorts for the bookmarklets that work on any page:
  `dom_`, `nav_`, `style_` and `window_`
  - For each: the recording, the short script, the posts the run's constants
    describe, then the video block in place of the entry's comment.
- [ ] Make and post the shorts for the public site-specific bookmarklets
  - The same steps. A site that blocks a headless recording is listed for a
    hand recording rather than skipped without a word. OctoPrint needs the
    printer's address, as its test does.
- [ ] Make and post the shorts for the signed-in site-specific bookmarklets:
  ChatGPT and Gmail
  - From the launcher's sign-in where it has one, otherwise from the
    maintainer's hand recordings. List the ones still without a recording.
  - A run renders these and stops before posting. The maintainer checks each
    for an account name, address, avatar, conversation or message in view,
    and posts it.
- [ ] Make a short part of every new bookmarklet: extend the paragraph at the
  top of this file so a new bookmarklet's item ends with its short posted and
  its video block in the README

## Demo Videos - paused

A full walkthrough per bookmarklet, made in After Effects through an MCP server
built for the job. This repository is where the server is proven: every demo is
made through it, and any step that still needs a hand in After Effects becomes
a change to the server.

- [ ] Build an After Effects MCP server, in a repository of its own, with a
  tool for every step the short script takes
  - Open and save a project; create a composition; import footage into a
    project folder; add a layer from footage or a composition; set its anchor
    point, scale and alignment; set the work area or time-stretch a layer;
    reorder layers; queue renders in Media Encoder and report when they finish.
  - Its first test is the short script: a short made through the server
    matches one made by the script.
- [ ] Settle the demo format before the first demo: length, frame size, how
  installing the bookmarklet is shown, and the opening and closing cards
- [ ] Remake the bookmarklet demos already on the channel through the server
  - List the channel's bookmarklet uploads first. The shorts made in the
    current format stay; every other bookmarklet upload is remade.
  - Each new demo replaces the old link in the README.
    `ChatGPT - Paste Ready Bookmark Response` and
    `OctoPrint - Change Graph Image` link old demos today.
- [ ] Make and post demos for the bookmarklets without one, a type at a time
  - Public, in the demos playlist, titled with the entry's heading. The
    description starts from the entry's and is rewritten for someone watching:
    what the bookmarklet is for, how to install it, and what to look for.
  - Uncomment the demo line in the entry's video block, with the new link.

## New Bookmarklets - DOM

Bookmarklets for working with a page's content and structure, filed under
`# DOM Bookmarklets` in the README.

- [ ] `dom_Clipboard_CopyTableAsCsv.js` - click any table to copy it as CSV,
  or as TSV for pasting straight into a spreadsheet; `colspan` cells repeat
  their value
- [ ] `dom_Clipboard_CopyTableAsMarkdown.js` - the same pick, copied as a
  GitHub-flavored Markdown table; a companion to
  `dom_Clipboard_ConvertPageToMarkdown.js`
- [ ] `dom_Clipboard_CopyCodeBlocks.js` - add a copy button to every `<pre>`
  block that lacks one
- [ ] `dom_Clipboard_QuoteSelectionWithSource.js` - copy the selection as a
  Markdown blockquote followed by `[Page title](url)`, linked with the same
  `#:~:text=` fragment `window_URI_AnchorHighlightedText.js` builds
- [ ] `dom_Form_SaveFormDraft.js` - save every field on the page to
  `localStorage` for this URL and restore it on the next click, so a long form
  survives a crash or an expired session
  - Never stores password, hidden, payment (`autocomplete="cc-*"`) or
    one-time-code fields, and says on first use that the site's own scripts
    can read what it saves.
- [ ] `dom_Form_AllowPaste.js` - restore paste, copy and the context menu on
  pages that block them, using capture-phase listeners that stop the page's
  handlers
- [ ] `dom_Inspect_CopyElementSelector.js` - click an element to copy the
  shortest CSS selector that matches only it; this is how `requires` entries in
  `test-bm.json` get written
- [ ] `dom_Edit_ToggleDesignMode.js` - toggle `document.designMode` so any text
  on the page can be edited in place, with a corner badge while it is on
- [ ] `dom_Clutter_RemoveStickyElements.js` - un-fix every fixed and sticky
  header, footer and banner in one click, with undo; the bulk companion to
  `dom_Clutter_ClickToHide.js`
- [ ] `dom_Clutter_ReaderView.js` - keep only the main content in a readable
  column, chosen by text density rather than a site's class names
- [ ] `dom_Search_FindAndReplaceText.js` - find and replace in text nodes only,
  with a regular-expression option and undo; for mock-ups and screenshots
- [ ] `dom_Parse_PrettyPrintJson.js` - turn a raw JSON response page into a
  collapsible, searchable tree
  - Build the tree with `textContent` only, so a string in the JSON never runs
    as markup on the page's origin.
- [ ] `dom_Note_PersistentHighlights.js` - highlights that are saved per URL
  and reapplied the next time the bookmarklet runs on that page
- [ ] `dom_Text_WordCount.js` - words, characters and reading time for the
  selection, or for the main content when nothing is selected

## New Bookmarklets - Navigation

Bookmarklets for moving around a page or between pages, filed under
`# Navigation Bookmarklets` in the README.

- [ ] `nav_Toc_FloatingTableOfContents.js` - a floating table of contents
  built from the page's headings, highlighting the section in view
- [ ] `nav_Anchor_ShowHeadingLinks.js` - a `#` link beside every heading that
  has an `id`; clicking it copies the deep link
- [ ] `nav_Pagination_NextPrevKeys.js` - find the page's next and previous
  links (`rel="next"`, then link text such as "Next" or "Older") and bind them
  to the `[` and `]` keys
- [ ] `nav_Scroll_AutoScroll.js` - teleprompter-style scrolling with speed
  keys and space to pause
- [ ] `nav_Scroll_RememberPosition.js` - save the scroll position for this URL
  on one click and restore it on the next
- [ ] `nav_Links_ListPageLinks.js` - a filterable panel of every link on the
  page, external links marked, click to jump to where each one sits
  - Link text goes in with `textContent`, and a `javascript:` link is listed
    and marked, never followed.

## New Bookmarklets - Style

Bookmarklets that change how a page looks, filed under `# Style Bookmarklets`
in the README.

- [ ] `style_Theme_ForceDarkMode.js` - invert the page and re-invert images and
  video, toggled, remembered per host in `localStorage`
- [ ] `style_Font_ReadableText.js` - cap the line length near 70 characters,
  raise the line height and font size; toggled
- [ ] `style_Debug_OutlineElements.js` - outline every element, colored by
  depth, to see the box structure of a layout
- [ ] `style_Font_IdentifyFont.js` - hover any text for the font actually
  rendered, plus size, weight, line height and color
- [ ] `style_Color_PagePalette.js` - every color the page uses, as swatches
  sorted by how often each appears; click to copy the hex value
- [ ] `style_Grid_LayoutGridOverlay.js` - an 8px baseline and 12-column grid
  over the page, with the column count adjustable

## New Bookmarklets - Site Specific

Bookmarklets for one site each, filed under `# Site Specific Bookmarklets` in
the README. A site's markup is the part most likely to change, so every item
here lists its selectors in `requires`.

- [ ] `siteSpecific_chatGPT_ResizeSidebar.js` - drag to resize the chat
  history sidebar, with the width remembered
- [ ] `siteSpecific_chatGPT_AnswerAnchorLinks.js` - add an anchor link to each
  answer and show them, following the pattern of the two Stack Overflow anchor
  link bookmarklets
- [ ] `siteSpecific_chatGPT_PinAnswerToSide.js` - pin an answer to a side panel
  that stays put while the conversation scrolls, with the pinned answers
  bookmarkable in the format `siteSpecific_chatGPT_BookmarkResponse.js` uses
- [ ] `siteSpecific_chatGPT_BookmarkMultipleResponses.js` - collect several
  copied responses in `sessionStorage`, then build one bookmark from all of them
  with an inserted button
- [ ] `siteSpecific_GitHub_SortRepoTableColumns.js` - click a column header in
  a repository's file table to sort by it; a companion to
  `siteSpecific_GitHub_ResizeRepoTableColumns.js`
- [ ] `siteSpecific_GitHub_AddApiColumns.js` - add columns to the file table
  from the REST API, as `siteSpecific_GitHub_ShowFileSize.js` does for size
  - Signed-out requests are limited to 60 an hour; show the remaining count
    rather than failing silently at the limit. It never asks for or stores a
    token to raise that limit.
- [ ] `siteSpecific_GitHub_MarkdownLivePreview.js` - a live preview beside the
  editor when editing a `.md` file on GitHub
- [ ] `siteSpecific_GitHub_ExpandAllConversation.js` - keep clicking "Load
  more" and the hidden-items buttons on a long issue or pull request until the
  whole conversation is on the page
- [ ] `siteSpecific_Gmail_SaveSettingsButtonAtTop.js` - copy the Save Changes
  button to the top of Gmail's settings pages
- [ ] `siteSpecific_OctoPrint_FileManagerTable.js` - a sortable, file manager
  style table of uploaded files; the maintainer's local
  `_BASE - OctoPrint Add File Manager Like Table.txt` is the starting point
- [ ] `siteSpecific_YouTube_CopyTimestampLink.js` - copy a link to the video at
  the current playback time, with its title, as Markdown
- [ ] `siteSpecific_YouTube_TranscriptToMarkdown.js` - open the transcript
  panel and copy it as Markdown, each line linked to its timestamp
- [ ] `siteSpecific_Stackoverflow_CopyAnswerAsMarkdown.js` - copy one answer as
  Markdown with its code blocks intact, plus the author, a link and the CC BY-SA
  attribution the license requires
- [ ] `siteSpecific_GoogleMaps_CopyCoordinates.js` - copy the map center from
  the URL's `@lat,lng,zoom` as decimal degrees and as degrees, minutes and
  seconds
- [ ] `siteSpecific_Wikipedia_CopyCitation.js` - copy a citation for the
  article in Markdown and APA, linked to the permanent revision (`oldid`)
  rather than the live page

## New Bookmarklets - Window

Bookmarklets for the window, the URL and the selection, filed under
`# Window Bookmarklets` in the README.

- [ ] `window_URI_CleanTrackingParams.js` - remove `utm_*`, `fbclid`, `gclid`
  and similar parameters from the address bar with `history.replaceState`, and
  copy the clean URL
- [ ] `window_URI_CopyMarkdownLink.js` - copy `[Page title](url)` for the
  current page
- [ ] `window_URI_ShowQrCode.js` - a QR code for the current URL, to open it on
  a phone
  - Encode it in the bookmarklet. Sending the URL to a QR service would hand
    every page it is used on to a third party.
- [ ] `window_style_strikethroughSelectedText.js` - the fifth of the
  `window_style_` family, beside bold, italic, underline and highlight
- [ ] `window_style_clearSelectedTextStyle.js` - remove whatever the
  `window_style_` bookmarklets added inside the selection
- [ ] `window_PageOffset_ScrollToPercent.js` - prompt for a percentage and jump
  there; a companion to `window_PageOffset_CustomPageDown.js`
- [ ] `window_Timer_FocusTimer.js` - a countdown overlay for timed work
  - A reload clears it, so it should say so when started rather than vanish
    unannounced.

## New Category - Accessibility

A new `accessibility_` type for checking a page the way an accessibility
review would. Bookmarklets are an established tool in that field because they
run on any page, signed in or not, without installing anything.

The type is spelled out on purpose. The maintainer's README tooling finds a
type's section by turning the prefix into words, so `accessibility_` lands in
`# Accessibility Bookmarklets` with no change to that tooling, where `a11y_`
would land in `# A11y Bookmarklets`.

- [ ] Add the `# Accessibility Bookmarklets` section to the README, worded like
  the other sections' introductions, with an empty group in the navigation
  list, and add `templates/accessibility_TEMPLATE.js`
  - The heading must read exactly `# Accessibility Bookmarklets`.
- [ ] `accessibility_Headings_ShowOutline.js` - the page's heading outline in a
  panel, with skipped levels and missing or multiple `h1`s flagged
- [ ] `accessibility_Images_ShowAltText.js` - label every image with its alt
  text, flagging missing alt, empty alt on an image that carries content, and
  alt text that is only a file name
- [ ] `accessibility_Focus_ShowTabOrder.js` - number every focusable element in
  tab order and flag positive `tabindex` values
- [ ] `accessibility_Text_TestTextSpacing.js` - apply the WCAG 1.4.12 text
  spacing (line height 1.5, paragraph spacing 2x, letter spacing 0.12em, word
  spacing 0.16em) and outline anything that clips or overlaps
- [ ] `accessibility_Color_CheckContrast.js` - click text to get its contrast
  ratio against its effective background, with AA and AAA results for its size
- [ ] `accessibility_Color_SimulateColorBlindness.js` - cycle protanopia,
  deuteranopia, tritanopia and achromatopsia with SVG color-matrix filters
- [ ] `accessibility_Landmarks_ShowLandmarks.js` - outline and label every
  landmark (`header`, `nav`, `main`, `aside`, `footer` and their `role`
  equivalents)
- [ ] `accessibility_Forms_ShowLabels.js` - show each form control's
  accessible name and flag the ones that have none
- [ ] `accessibility_Motion_StopAnimations.js` - stop CSS animations and
  transitions, freeze animated GIFs on their current frame, and pause
  autoplaying video
- [ ] `accessibility_Links_FlagVagueLinkText.js` - flag links whose text is
  "click here", "read more" and the like, and identical link text that points
  to different places

## New Category - Media

A new `media_` type for finding, controlling and capturing the media on any
page. The README's `# DOM Bookmarklets` section is about a page's content and
structure; these are about its images, video and audio as things to keep,
reuse or record, which makes them a category of their own.

- [ ] Add the `# Media Bookmarklets` section to the README, worded like the
  other sections' introductions, with an empty group in the navigation list,
  and add `templates/media_TEMPLATE.js`
  - The heading must read exactly `# Media Bookmarklets`.
- [ ] `media_Image_ImageGallery.js` - every image on the page, including CSS
  backgrounds and the largest `srcset` candidate, in a grid with natural size,
  alt text and an open link
- [ ] `media_Image_CopyImageList.js` - copy every image URL on the page as a
  plain list or Markdown, ready for a download tool
- [ ] `media_Video_PlaybackSpeed.js` - set any HTML5 video from 0.25x to 4x
  with keys, beyond what a site's own menu offers
- [ ] `media_Video_ForcePictureInPicture.js` - open the largest video on the
  page in picture-in-picture, including where the site sets
  `disablePictureInPicture`
- [ ] `media_Video_LoopSection.js` - set A and B points on a video and loop
  between them
- [ ] `media_Video_FrameStep.js` - pause and step one frame at a time, with the
  current time shown to the millisecond
- [ ] `media_Video_GrabFrame.js` - save the current video frame as a PNG
  - A cross-origin video taints the canvas; say so plainly rather than
    downloading a blank image.
- [ ] `media_Capture_ElementBounds.js` - click an element to copy its page
  position, size and device pixel ratio as JSON, for cropping a screen
  recording to exactly that element
- [ ] `media_Capture_RecordingFrame.js` - overlay a frame at a social video
  size (1280x720, 1080x1080 or 1080x1920) and hide the scrollbars, to stage a
  screen recording
- [ ] `media_Audio_ListMediaSources.js` - list every audio and video element's
  current source and `<source>` list, flagging `blob:` streams that cannot be
  saved directly
- [ ] `media_Svg_ExportSvgs.js` - list every inline SVG with a preview, to copy
  or download as a standalone file

## User Use Only

Work the maintainer does by hand. Runs never work, check or queue anything in
this section.

## Complete

Finished items, archived from `## Current` with the `From:` line recording the
roadmap section each one came from.

<details>
<summary>Show Details</summary>

- [x] Put every README entry's `<!-- PASTE VIDEO HERE -->` comment below its
  gist paragraph, adding one where an entry had none
  - From: Short Videos
- [x] Add a `package.json` with Playwright as its one dependency, and ignore
  rules that a clone inherits
  - `"private": true`, and `playwright` (the library, not `@playwright/test`)
    under `devDependencies`, pinned to an exact version. Lockfiles are excluded
    by a global ignore rule on the maintainer's machine, so the pin in
    `package.json` is the only one a clone gets.
  - Scripts: `"test": "node test-bm.js --all"` and
    `"test:scheduled": "node test-bm.js --scheduled"`. The browser installs
    with `npx playwright install chromium`; nothing downloads one implicitly.
  - Ignore `node_modules/` and `test-results/`. The repository's `.gitignore`
    is not tracked today, because a global `.*` rule hides it. A `!.gitignore`
    line inside the file un-ignores it (measured: `git status` then lists it as
    `??`, so the ordinary commit picks it up and no `git add -f` is needed).
    Review the lines already in it first: they name local working files, and
    tracking the file publishes those names.
  - From: Test Harness
- [x] Write `test-bm.js`, so `node test-bm.js <name>` runs one bookmarklet in a
  real browser and reports pass or fail
  - Resolve `<name>` the way `bookmarklet.js copy` does: `name`, `name.js` or
    `JSFormatted/name.js`.
  - Check the file before any browser starts. Join it two ways: the space join
    `bookmarklet.js` uses (`/\s*\r?\n\s*/g` to one space), and a strict join
    that drops CR and LF with nothing in their place, which is what newline
    stripping in a URL field does. Parse both with `vm.Script` once the
    `javascript:` prefix is removed. A file that parses one way and not the
    other has a line that only works by accident; fail it and give the line
    number in the formatted file.
  - Percent-decode the joined code before running it, the way a `javascript:`
    URL is decoded. A modulo such as `i%16` decodes to a control character on a
    real bookmarks bar, and this is where that should surface.
  - Run it the way a browser runs a bookmarklet. The page's content security
    policy does not block the bookmarklet itself but does apply to what it
    adds, and `page.evaluate` matches that. Leave `bypassCSP` off, so a refused
    inline style or script is reported exactly as a user on that site would
    meet it.
  - Name the injected source with a `//# sourceURL=bookmarklet/<name>.js` tag,
    so an error's stack says whether it came from the bookmarklet or from the
    page. Only the bookmarklet's errors fail the test; the page's own console
    errors are recorded, not judged. Confirm the tag survives however the code
    ends up injected, with CDP `Runtime.evaluate` as the Chromium fallback.
  - Fresh browser context with no profile, a fixed 1280x720 viewport, dialogs
    dismissed unless configured, and popups closed and recorded.
  - Default safe run, for any bookmarklet with no `test-bm.json` entry: open
    `https://example.com/` (reserved for documentation, so there is nothing to
    break), run the bookmarklet once, wait a settle period, and pass when it
    parsed, ran and threw nothing.
  - Exit codes: `0` pass, `1` fail, `2` usage or configuration error. `--headed`
    and `--slow-mo <ms>` are for watching a run; neither is ever needed.
  - From: Test Harness
- [x] Add `test-bm.json`, the per-bookmarklet test configuration, with a JSON
  schema beside it
  - Keyed by bookmarklet name (the file name without `.js`). A
    `"$schema": "./test-bm.schema.json"` line gives editors completion and
    validation.
  - Properties: `url` (default `https://example.com/`); `scheduled` (boolean,
    default `false`); `requires`, the CSS selectors the bookmarklet depends on,
    checked before it runs; `steps`; `dialogs`, the answers to `alert`,
    `confirm` and `prompt` in the order they appear; `permissions`, such as
    `["clipboard-read", "clipboard-write"]`; `skip`, a reason string that lists
    the entry as skipped without running it; and `timeout` and `settle` in
    milliseconds.
  - `steps` run in order: `{ "run": true }` runs the bookmarklet (once, after
    load, when no step names it), plus `click`, `fill`, `press`, `wait` (ms or
    a selector) and `expect` (a selector that is `visible`, `hidden`, has a
    `count` or `text`, or a `clipboard` value).
  - A missing `requires` selector fails with
    `site changed: <selector> not found on <url>`. That message is what this
    whole harness exists to produce when a site redesigns underneath a
    bookmarklet.
  - Illustrative shape; the real entries are written under
    `## Test Configurations`:

    ```json
    {
      "$schema": "./test-bm.schema.json",
      "dom_Clutter_ClickToHide": {
        "url": "https://example.com/",
        "scheduled": true,
        "steps": [
          { "run": true },
          { "click": "h1" },
          { "expect": { "selector": "h1", "hidden": true } }
        ]
      },
      "siteSpecific_Example_DoSomething": {
        "url": "https://example.org/page",
        "requires": ["#selector-the-bookmarklet-reads"],
        "dialogs": [{ "accept": true, "text": "42" }],
        "scheduled": false
      }
    }
    ```

  - From: Test Harness
- [x] Add `--all`, `--scheduled` and `--list`, with a report a scheduled task
  can act on
  - `--all` runs every file in `JSFormatted/`, configured or not.
    `--scheduled` runs only entries with `"scheduled": true`, which is all a
    cron job or Windows scheduled task has to call: `node test-bm.js
    --scheduled`. `--list` prints each bookmarklet and what a run would do with
    it (configured, default safe run, skip) without opening a browser.
  - One browser for the batch and a fresh context per bookmarklet, run one at a
    time.
  - Write `test-results/test-bm/<YYYY-MM-DD_HHMMSS>/report.json` and
    `summary.txt`, one line per bookmarklet with verdict, reason and duration.
    The last line sums the run up for anyone reading a log:
    `test-bm: 54 run, 51 passed, 2 failed, 1 skipped`.
  - Exit `0` when nothing failed (skips never fail a run), `1` when anything
    failed, `2` on a configuration error. Nothing in the scheduled path prompts
    or waits for input.
  - From: Test Harness
- [x] Decide the short's frame. YouTube files an upload as a Short only when it
  is square or taller than it is wide.
  - Square, 648x648. Both existing shorts were re-rendered at that size and
    posted again as Shorts on 2026-11-06.
  - From: User Use Only
- [x] Self-test the harness with fixture bookmarklets in `test/fixtures/`,
  run by `node --test`
  - One that passes; one that throws; one with a `//` comment; one with an
    `i%16` modulo; one with a missing semicolon between two lines; one whose
    page logs its own console error while the bookmarklet succeeds. Each
    asserts the verdict and the reason `test-bm.js` gives.
  - `npm test` runs these before the bookmarklets themselves.
  - From: Test Harness
- [x] **Practice Page Presentation**: Serve local fixture pages from a fake
  origin instead of `file://`
  - `page.route("https://fixtures.test/**", ...)` fulfilled from
    `test/fixtures/pages/` gives each fixture a real origin, so
    `localStorage`, the clipboard and `location` behave as they do on a site.
    It also needs no network and never changes.
  - `url` accepts `fixture:<file>.html` as shorthand for that origin.
  - The same pages are the deployed site's practice pages
    (`## Improve GitHub Pages Site`), so they stay presentable to a reader.
  - From: Test Harness
- [x] Write entries for the bookmarklets that work on any page: `dom_`, `nav_`,
  `style_` and `window_`
  - Use `fixture:` pages where `https://example.com/` lacks what the
    bookmarklet needs, such as tables, headings, a sidebar, a video or a form.
    It no longer serves an `h1` either, so a heading is one of them.
  - Assert the effect: an element hidden, text wrapped in `<b>`, a panel added,
    a clipboard value written. Mark each `"scheduled": true`; these never
    depend on a third-party site.
  - From: Test Configurations
- [x] Write entries for the public site-specific bookmarklets: GitHub, Stack
  Overflow, w3Schools, YouTube, Google and Google Maps
  - Each lists in `requires` every selector the bookmarklet reads, taken from
    its source rather than from memory.
  - Pick pages that load signed out and are unlikely to move, such as this
    repository's own GitHub page.
  - Mark `"scheduled": true` only where the page loads headless without a
    consent wall or bot check from this machine. YouTube and Google serve
    consent pages in some regions; an entry that cannot get past one is
    `scheduled: false` with the reason in `skip`.
  - From: Test Configurations
- [x] Run `node test-bm.js --all` once and file every failure as its own item
  under `## Existing Bookmarklets`, with `**Issue**` and `**Goal**` nested
  - The README's status line already says some existing bookmarklets may not
    work. This run is what turns that into a list of which ones.
  - Worked last of this batch on purpose. The run on 11.07.2026 failed 13 of
    54, and every one was a site-specific bookmarklet meeting a bare page
    rather than a defect, so the entries above come first and this run reports
    what is left.
  - From: Test Configurations
- [x] Practice Page Presentation 1
  - Three things a reader meets on the practice pages before they meet a
    bookmarklet: a heading level skipped on six of the nine, a table that
    scrolls the document sideways on a phone, and a readout that sits on top
    of the text it is reporting on.
  - **Issue**: Measured headlessly on 11.08.2026 at 1280x720 and 400x720, from
    `https://fixtures.test`. (1) The "Try these on this page" box is an `<h3>`
    above the page's first `<h2>`, so the outline runs h1 then h3 then h2 on
    `article.html`, `table.html`, `form.html`, `video.html`, `lazy.html` and
    `scroll.html`; `sidebar.html` escapes it only because `nav.side` carries
    its own `<h2>Contents</h2>` earlier. (2) `table.html` at 400px reports
    `scrollWidth` 446 against `clientWidth` 400, giving the document a
    horizontal scrollbar and clipping the Notes column mid-word. (3)
    `scroll.html` at 400px, scrolled to 900, has the opaque fixed `.readout`
    covering "Week 7: 1859 boardings, a market week." and "Week 8: 1996
    boardings, an ordinary week." outright; at 1280px `main` is narrow enough
    to clear it, so it is the narrow viewport only.
  - **Goal**: Resolve to [practice-page-presentation.prompt.md](.claude/prompts/practice-page-presentation.prompt.md)
  - From: Test Harness
- [x] No test pins the practice pages' presentation
  - **Issue**: `node test-bm.js --scheduled` proves the bookmarklets still work
    on these pages, and `test/harness.test.js` proves the harness reads them
    correctly, but nothing asserts the pages are fit to show a reader. All
    three defects above were present the moment the pages were committed and
    the suite stayed green. They are also the pages the deployed site will link
    to once `## Improve GitHub Pages Site` adds the gallery, so a regression
    here is public.
  - **Goal**: Add `test/pages.test.js` in the `node --test` style
    `test/harness.test.js` already uses, driving `playwright` directly and
    serving `test/fixtures/pages/` from `https://fixtures.test` the way
    `serveFixtures` in `test-bm.js` does. Load all nine pages at 1280x720 and
    400x720 and assert: one `h1` per page; the heading outline never skips a
    level going down; `documentElement.scrollWidth <= clientWidth`; the "All
    practice pages" link returns 200 and reaches the index; every link the
    index lists resolves; every form control has a visible label tied by
    `for`/`id`; each table has a caption and a header row; and no text run
    intersects a fixed overlay, measured with `Range.getClientRects()` per text
    node rather than element boxes. Add it to the `test` script in
    `package.json` beside `test:harness`, since `node --test` is pointed at one
    named file on purpose. The verification run's throwaway script did exactly
    this and its assertions are listed in
    `test-results/ui-ux-tester.agent/ui-ux-tester.log`; it was not promoted
    because it fails until the item above is fixed.
  - From: UI/UX Override - practice pages
- [x] `table.html`'s caption scrolls away with the table it titles
  - **Issue**: The `<caption>` sits inside the `<table>`, which sits inside the
    `.table_scroll` wrapper, so it is as wide as the table and scrolls with it.
    At 400x720, scrolling the eastern loop wrapper to its end leaves the title
    reading "y stop, an ordinary Tuesday" - it slides out of its own box exactly
    when a reader does the thing the wrapper exists to allow. The same string is
    also the wrapper's `aria-label`, so a screen reader announces it twice, once
    entering the region and once for the table.
  - **Goal**: Give the title one home. Either lift it out of the table into the
    wrapper and drop the `<caption>`, or keep the `<caption>`, drop the
    duplicate `aria-label` for `aria-labelledby` naming it, and hold it still
    with `position: sticky; left: 0` so it stays readable as the table scrolls
    under it.
  - From: UI/UX Override - practice pages read-through
- [x] The table wrapper is a keyboard stop at widths where nothing scrolls
  - **Issue**: `.table_scroll` carries `tabindex="0"` on every viewport. At
    1280x720 both wrappers measure `scrollWidth === clientWidth` at 696px, so
    the first Tab on `table.html` lands on a region that cannot scroll and rings
    the whole table before any link is reached. The ring itself is correct at
    both widths - 1px `outline-style: auto` hugging the box, not clipped by the
    wrapper's own overflow - so this is the stop existing, not how it looks.
  - **Goal**: Make the wrapper focusable only when it overflows, which is what
    the scrollable-region pattern asks for: set `tabindex` from
    `scrollWidth > clientWidth` on load and on resize, and drop `role="region"`
    with it so an unscrollable box is not announced as a landmark either.
  - From: UI/UX Override - practice pages read-through
- [x] The readout's 140px inset is applied far wider than it does any work
  - **Issue**: The `@media (max-width: 909px)` block does two things - narrows
    the readout to 124px and 13px, and insets `header.page`, `main` and
    `footer.page` 140px on the right. Sweeping `scroll.html` at offset 1234 from
    909px down to 380px in 10px steps, with the inset dropped and the narrowed
    readout kept, the first width at which any text run meets the readout is
    509px. From 519px to 909px the inset prevents nothing and costs the text
    column 108px, 696px becoming 588px in one 1px step at the breakpoint. The
    narrowing itself is placed correctly: at 910px the unnarrowed readout's left
    edge is 728px, exactly the text column's box edge.
  - **Goal**: Split the query. Keep the readout narrowing at 909px, where it is
    measured to belong, and move the 140px inset to its own `max-width` near
    520px, where the sweep shows it starts doing work. Re-run the sweep after,
    and confirm the first covered width sits below the new breakpoint.
  - From: UI/UX Override - practice pages read-through
- [x] No test measures the band the readout breakpoint was moved for
  - **Issue**: `test/pages.test.js` measures 1280x720 and 400x720 only, so
    nothing exercises 820-909px - the band the breakpoint was moved to cover,
    and the band the item's own prompt would have left broken. A change to the
    breakpoint, to the readout's width, or to its text would not be caught.
  - **Goal**: Add a third viewport to `VIEWPORTS` in `test/pages.test.js`, a
    tablet width inside the band such as 880x720, and update the comment above
    it that currently names a desktop width and a phone width. Every existing
    test then runs across the band, the covered-text check at its scroll stops
    included. Do this after the item above, so the width pinned is the one the
    split query settles on.
  - From: UI/UX Override - practice pages read-through

</details>
