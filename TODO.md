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

- [ ] Check the deployed site in the scheduled run
  - Open the live site, open every example and practice page from its
    navigation, and fail on a broken link, a missing page, or a console error
    from the site's own script.
  - After a push that changes the site, wait for the Pages build to finish
    (`gh api repos/isocialPractice/bookmarklets/pages/builds/latest`) before
    checking.
  - From: Improve GitHub Pages Site
- [ ] Give the page `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` writes a
  real dark colour scheme, or take its dark rules out
  - Its `@media (prefers-color-scheme: dark)` block still darkens the code blocks
    on a page that never darkens. `body` carries `background: rgb(47 79 79 / 3%)`,
    which propagates to the canvas, so the saved page is painted near-white in both
    schemes. A dark code block on it is readable on its own terms, so this is a look
    rather than a break - but it is the same shape of problem the focus ring had,
    fixed on 11.22.2026 by dropping its dark branch. Either darken the canvas, the
    table, the headings and the body text together and keep the dark rules, giving
    the ring its `#58a6ff` back with them, or drop them. The reading in
    `test/gallery.test.js` that says the page is painted alike in both schemes is
    the one to change if the page is given a real dark mode, and it says so.
  - From: Existing Bookmarklets
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
  - From: Improve GitHub Pages Site

### Create and Deploy GitHub Pages Override

- No site

### UI/UX Override - gallery at a phone width

#### Found Issues

- [ ] The saved page's corner badge paints its own label off the badge at a
  phone width
  - **Issue**: In the gallery frame at 390px, the `ChatGPT Bookmark` label in
    `div[data-side='1']` is painted outside the black shape it is written on -
    white text on a near-white page - and what is left of it lands on the `h1`
    beside it, by 8x17px and 18x5px. The block is `width: 20%`, which is 70px
    in the 328px the frame lays the example out in, and the label needs about
    100px; `overflow` is `visible`, so the rest is painted rather than clipped.
    It shows on the example opened on its own too, smaller (2x5px over the
    `h1`), and not at all at 1280px. The rule is written by
    `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` and copied inline into
    all five `examples/chatGPT_Bookmark_*.html` pages, so both need the change.
    `test/gallery.test.js` passes here: its byline reading skips runs inside the
    block as the block's own text, so a label that leaves the block is invisible
    to it.
  - **Goal**: Resolve to [byline-label-narrow.prompt.md](.claude/prompts/byline-label-narrow.prompt.md)
  - From: UI/UX Override - gallery at a phone width

## Test Harness

A script that answers one question for any bookmarklet: does it still work on
the page it was written for? Playwright drives a real Chromium, which is the
nearest thing to a user clicking the bookmark: real layout, real content
security policies, real dialogs and clipboard. It records video when asked, and
it can reuse a signed-in session without the session ever entering the
repository. Puppeteer covers Chromium only, and Selenium needs a driver per
browser for the same result.

Every item in this section is finished and archived in `## Complete`, the last
of them on 11.23.2026. What they built is `test-bm.js` with its
`test-bm.json` schema, `docs/testing.md`, and the three `node --test` files
`npm test` runs ahead of the bookmarklets: `test/harness.test.js` (121),
`test/pages.test.js` (17) and `test/gallery.test.js` (32). New harness work is
queued here when there is some; the section stays as the record of what the
harness is and why it is Playwright.

## Test Configurations

Entries in `test-bm.json` for the bookmarklets already published. The default
safe run covers anything without an entry; these entries add the assertions
that show a bookmarklet did its job, rather than merely not crashing.

## User - Resolve Test Procedures

Tests the automated runs could not finish. Each item is the maintainer's to
resolve; a run never works one.

- [ ] **User todo**: Confirm that `siteSpecific_OctoPrint_ChangeGraphImage`, with `img` set, shows an image placed in OctoPrint's `webassets/img` folder as the graph's background
  - Not tested: whether the file is served and shown. The automated run checked only that the bookmarklet writes `/static/webassets/img/<img>` into the graph's style, and the test image's address answers 404 because no file is there.
  - Why: placing the file needs a shell on the OctoPrint host, which the automated run does not have.
  - On 11.18.2026 an automated shell session on the host typed the commands that place the test image, then stopped when one read-back of its output timed out, before the copy was checked. The test image's address still answered 404 signed out, so whether the file was written is not known, and this check waits for a later attempt.
  - Ways an AI-safe automated procedure could resolve it:
    - key-based SSH with a key restricted to one command and one folder (`authorized_keys` `restrict,command=`), which copies only the test image into `webassets/img`, so no password is ever handled;
    - a local fixture page with OctoPrint's `#temperature-graph` and a test image served at `/static/webassets/img/`, so the image path is checked end to end without the host.
  - Done when the test image's address answers 200 signed out, and the entry asserts the image is shown.
- [ ] **User todo**: `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` breaks on an answer
  holding a `\u` sequence
  - **Issue**: An answer containing `\u` is written out without the backslash
    being doubled, so the pasted bookmarklet carries a broken escape.
  - **Goal**: Escape the sequence where the answer is encoded. The file already
    turns a backslash into `&#x5c;` when it encodes a code block, so decide
    whether that path is the one missing the case, or whether the plain text
    path needs its own. The entry for this bookmarklet needs an answer holding
    `\u` to paste. Close the issue with `Fixes #4`.
  - <https://github.com/isocialPractice/bookmarklets/issues/4>
  - Tested on 11.16.2026 on a fixture page only, built from the markup the file reads (its turn, answer area, code block and copy button selectors) rather than read from the site, with a placeholder answer holding `\u` in plain text, in inline code and in a code block. The file as it stands passes: the bookmarklet it puts on the clipboard parses with its line breaks dropped and with each one replaced by a space, and shows every `\u` as written. A copy of the file without its first `RUNNING_FIX` item fails the same check with "Invalid Unicode escape sequence", the error this issue reports. So the backslash escapes added since the issue was filed (`&#92;` in plain text, `&#x5c;` in a code block) cover the case on that markup. The fixture page and its entry are not in the repository, because `test-bm.json` holds one entry per file and this file's entry is the signed-in run.
  - Not tested: the same answer on the site's own markup, and the signed-in entry.
  - Why: on 11.16.2026 the site was signed out for the automated run, which never signs in, and a guest run met the site's bot check before any page loaded. The automated run never answers a bot check, so no answer of the site's own was read, and no prompt was sent.
  - On 11.18.2026 the maintainer's everyday browser was signed in to the site, and this bookmarklet was not run there. Its live check needs an answer holding `\u`, which only a prompt would give, and no run sends a prompt; and its result is on the clipboard, which a run on a page that shows what the account holds never reads. The issue stays open.
  - Ways an AI-safe automated procedure could resolve it:
    - a dedicated test account whose login lives in the OS credential vault and is read only at sign-in, with a saved conversation that already holds such an answer, so the signed-in run copies it and no prompt is ever sent;
    - a recorded page state of such an answer, saved once with its text replaced by placeholders and replayed offline, so the fixture check runs on the site's own markup.
  - Done when an entry with an answer holding `\u` passes in both places, the signed-in entry still passes, and the issue is closed with `Fixes #4`.
- [ ] **User todo**: `siteSpecific_YouTube_ShowShortReleaseDate.js` breaks on a short behind a
  viewer discretion notice
  - **Issue**: A short that opens with an approval request has a different DOM,
    and the bookmarklet breaks on it rather than skipping it.
  - **Goal**: Read the DOM of a short behind the notice, and leave that short
    alone instead of breaking. Close the issue with `Fixes #11`.
  - <https://github.com/isocialPractice/bookmarklets/issues/11>
  - Not tested: the bookmarklet on a short behind a viewer discretion notice. One signed-out search on 11.16.2026 found no such short to read, so no fixture page holds the notice's structure.
  - Why: no short behind the notice could be reached signed out, and the automated run never signs in.
  - Since the first visit fix of 11.16.2026 the bookmarklet waits up to ten seconds for the short's description and action bar, and leaves the short alone when they never come rather than throwing. Whether that is enough behind the notice is what this test would show.
  - Ways an AI-safe automated procedure could resolve it:
    - a local fixture page that reproduces a notice short's structure, the description and action bar markup the bookmarklet reads, filled with placeholder text and graphics;
    - a recorded page state of a short behind the notice, saved once and replayed offline, with its content replaced by placeholders.
  - Done when an entry for the notice's structure passes and the issue is closed with `Fixes #11`.
- [x] **User todo**: Confirm that `siteSpecific_chatGPT_NavigateAnswers.js` still works on the site
  - Resolved 11.23.2026, at the maintainer's request, by the first way below: the bookmarklet was
    rewritten for the conversation as it is now, worked out from selector counts alone, and its
    entry passes signed in, in the maintainer's everyday browser, on the most recent conversation.
    It finds each question by the block that keeps its line breaks and each answer where the two
    divide, so it no longer depends on `article` or `#main`. Its gist carries the fix; its short
    is owed under `## Short Videos`.
  - Fixed again later on 11.23.2026, after the maintainer's check by hand: the rewrite marked
    the user's screen-reader heading as each answer, read only the turns the page had drawn,
    and lost its hiding when the page drew a turn again. It now reads the page's own turn,
    question and answer attributes, hides through a stylesheet of its own keyed on them,
    scrolls to reach the turns the page has not drawn yet, and holds the answer in view while
    the page settles. Its entry checks that each marked answer is a reply, that no heading is
    marked, and that every other turn's reply stays hidden after moving both ways, and passes
    in the maintainer's everyday browser. Its gist carries the fix; its short stays owed.
  - Not tested: the entry's run, which checks that the bookmarklet adds its toggle button to the conversation (`#main .normal-chat`).
  - Why: on 11.16.2026 the site was signed out for the automated run, which never signs in, and a guest run met the site's bot check before any page loaded. The automated run never answers a bot check.
  - On 11.18.2026, in the maintainer's everyday browser, signed in: the chat page has no `#main`, where the bookmarklet adds its button, and a conversation opened from the sidebar showed no `article` within ten seconds. The run read nothing else from the page, so whether the conversation's markup changed or the click did not open it is not known. Its entry keeps a skip with that reason.
  - Later on 11.18.2026, three probes in the everyday browser counted candidate selectors only, reading no text: the click does open the most recent conversation, whose page has a `main` element without the id `main`, and no `article`. Its turns carry no `article`, `data-testid` or `data-turn` marker, only class names, some nested inside others, and counts could not tie them to one element per turn, which the bookmarklet needs to show one answer at a time. So the bookmarklet stays as it is.
  - Ways an AI-safe automated procedure could resolve it:
    - a fix to the bookmarklet that reads the conversation as it is now, worked out from the site's markup with placeholder content, with the push, gist update and short a bookmarklet change brings; its entry already opens the most recent conversation by selector in the maintainer's everyday browser, opened by [to-explorer](https://github.com/jhauga/to-explorer), and reads nothing from it;
    - a dedicated test account whose login lives in the OS credential vault and is read only at sign-in, so the entry's signed-in run goes ahead;
    - a local fixture page with the conversation markup the page has now (its `main`, and the elements that hold each turn), filled with placeholder text, so the fix can be built and checked on it.
  - Done when the entry passes signed in, or on a fixture page with that markup.
- [x] **User todo**: Confirm that `siteSpecific_chatGPT_ResizePrompt.js` still works on the site
  - Resolved 11.23.2026, at the maintainer's request, by the first way below: the bookmarklet was
    rewritten to find the editable element in the prompt form and the box it scrolls in, and to
    make that box resizable from its corner, up to 600px. Its entry passes signed in, in the
    maintainer's everyday browser, on the chat page. The look was checked by numbers rather than a
    picture: set to 400px, the box and the whole prompt grow with it and stay on screen. Its gist
    carries the fix; its short is owed under `## Short Videos`.
  - Not tested: the entry's run, which checks that the bookmarklet makes the prompt box resizable (its style element first in the body), on a page with the prompt `form` and `#prompt-textarea`.
  - Why: on 11.16.2026 the site was signed out for the automated run, which never signs in, and a guest run met the site's bot check before any page loaded. The automated run never answers a bot check.
  - On 11.18.2026, in the maintainer's everyday browser, signed in: the chat page has a `form` but no `#prompt-textarea`, the prompt box the bookmarklet reads by its id, so the run went no further. Nothing was typed into the prompt box. Its entry keeps a skip with that reason.
  - Later on 11.18.2026, two probes in the everyday browser counted candidate selectors only, reading no text and typing nothing: the prompt box is now an editable element with no id, more than ten levels inside the prompt `form`, and the page has no `textarea`. The form's first two children, which the bookmarklet reads by position, are a hidden element and an empty one, so its fixed chain of parents and child positions no longer fits, and a reworked layout could not be checked to look right on a page that is checked by selectors and counts alone. So the bookmarklet stays as it is.
  - Ways an AI-safe automated procedure could resolve it:
    - a fix to the bookmarklet that finds the prompt box as it is now, with the push, gist update and short a bookmarklet change brings, then its entry run again in the maintainer's everyday browser, opened by [to-explorer](https://github.com/jhauga/to-explorer);
    - a dedicated test account whose login lives in the OS credential vault and is read only at sign-in, so the entry's signed-in run goes ahead;
    - a local fixture page with the prompt form markup the page has now (the `form`, its editable prompt box and the parents the bookmarklet styles), with an empty prompt, so the fix can be built and checked on it.
  - Done when the entry passes signed in, or on a fixture page with that markup.
- [ ] **User todo**: Confirm that `siteSpecific_Gmail_StyleSponsoredEmail.js` still works on the site
  - Not tested: the bookmarklet on an inbox listing (`table` and `tr`), where it marks and styles the sponsored rows. Its entry runs only the default safe run, with no assertion of its own.
  - Why: on 11.16.2026 the site was signed out for the automated run, which never signs in, and the site has no guest mode.
  - On 11.18.2026, in the maintainer's everyday browser, signed in: the run held its mail tab and closed it, but no row was marked within ten seconds of the bookmarklet's run. The run reads no mail, so whether the inbox showed a sponsored row at that moment is not known, and its entry keeps a skip with that reason. Its entry there waits for one row the bookmarklet marks, then checks that every marked row is also styled. A run opens only the inbox, and never clicks to another tab of it.
  - Ways an AI-safe automated procedure could resolve it:
    - the same run in the maintainer's everyday browser, opened by [to-explorer](https://github.com/jhauga/to-explorer), at a time the inbox shows a sponsored row;
    - a dedicated test account whose login lives in the OS credential vault and is read only at sign-in;
    - a local fixture page with an inbox table of placeholder rows, one of them sponsored, so an entry can assert the row is marked.
  - Done when the entry passes signed in with an assertion that a sponsored row is marked, or on a fixture page with that markup.

## Existing Bookmarklets

Fixes and changes to bookmarklets already published. The first full test run
files its failures here. A fix is finished when its posted gist carries it too.

- [ ] Add an `s, s` key sequence to `siteSpecific_chatGPT_NavigateAnswers.js`
  that returns the page to normal

### From the Open Issues

The repository's open GitHub issues, each needing the live site to confirm.
`test-bm.js` reaches every one of these pages, so an entry under
`## Test Configurations` is what turns each into something a run can judge
rather than something a person has to reproduce by hand. The `\u` item (#4)
and the viewer discretion item (#11) moved to
`## User - Resolve Test Procedures` on 11.16.2026.

## AI-Assisted Verification

A failing test says that something changed. Finding what changed on a
redesigned site, and the smallest edit that fixes the bookmarklet, is work an
agent with a browser does well. The deterministic run stays the judge: an agent
proposes, and `test-bm.js` decides.

Everything here is tool-neutral. The procedure is written once, in a tracked
file every assistant reads, rather than once per assistant.

## Testing Documentation

How to install, run, configure and schedule `test-bm.js`, written in
`docs/testing.md` and linked from the README. Documentation only: items pulled
from here carry `From: version.control = null`.

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
  - Set the bookmarklet's `pageTitle` and `pageHead` to the example's own
    subject before saving it, as its lines 8 and 9 invite. The five existing
    pages all shared one title and one heading until 11.20.2026, so they could
    not be told apart in a tab, in history or in a bookmark; a new example set
    this way arrives named.
  - Escape the closing tag of the written page's own script (`<\/script>`)
    when the clipboard's contents are wrapped in a `<script>` element to make
    the file. The five existing pages predate that script and needed no
    escaping; a page saved from the bookmarklet as it stands does, or the
    wrapper closes early and the page writes nothing.

## Short Videos

One short per bookmarklet: its essential use in up to thirty seconds, with a 15
second cut when it runs longer, framed with the repository's stamp border,
posted to YouTube and linked from its README entry. Shorts are made in the
maintainer's After Effects project on this machine. The project, its folders
and the accounts posted to are local, and the skill
`.claude/skills/bookmarklets-social-media-manager/SKILL.md` keeps them, with
how a short is made and posted.

Each README entry links its videos from a block that takes the place of its
`<!-- PASTE VIDEO HERE -->` comment, below the gist paragraph:

```html
<b>Video Demonstration for Use:</b>

- `Ctrl + click` link to view short on YouTube [Short - <Focus> - <What It Does>](https://www.youtube.com/shorts/<id>)
<!-- - `Ctrl + click` link to view demo on YouTube [Demo - <Focus> - <What It Does>](https://www.youtube.com/watch?v=<id>) -->
```

The block carries no `<details>` and no `<summary>`. The README entry splitter
reads a `<summary>` as the name of the file an entry is for, so a block holding
one reported the entry as naming a missing file and the file as having no entry
at all, two `verify` errors per entry carrying a video. `._bookmarklet.js` took
the `<details>` wrapper out of every entry in an earlier migration and still
rejects one left behind, so the block reads inline, as the gist paragraph above
it does.

`<Focus>` and `<What It Does>` are the second and third parts of the file name,
spelled the way the entry's heading spells them: `dom_Note_TakePageNotes` links
as `Short - Note - Take Page Notes`. The demo line stays commented out until
the bookmarklet has a demo.

- [ ] Make and post the shorts for the bookmarklets that work on any page:
  `dom_`, `nav_`, `style_` and `window_`
  - For each: the recording, the short script, the posts the run's constants
    describe, then the video block in place of the entry's comment.
- [ ] Make and post the shorts for the public site-specific bookmarklets
  - The same steps. A site that blocks a headless recording is listed for a
    hand recording rather than skipped without a word. OctoPrint needs the
    printer's address, as its test does.
  - `siteSpecific_GitHub_ShowFileSize` is posted, 11.15.2026:
    [Short - GitHub - Show File Size](https://www.youtube.com/shorts/cTCOnRGBT-0),
    public, in the `Bookmarklet Shorts` playlist, and its README entry links
    it in place of the comment. `.videos/support/record-show-file-size.mjs`
    dresses the page per `## Video Masking` (since 11.14.2026) and shot the
    recording again on 11.15.2026; `make-short.jsx` then built and rendered
    the MP4 from it, replacing the undressed 11.12.2026 render, and every beat
    was checked against the masking table before the upload. Its GIF is
    posted to Giphy, 11.15.2026, with the short as its source, and is in the
    `Bookmarklets` collection, 11.15.2026.
  - `siteSpecific_YouTube_ShowShortReleaseDate` is posted, remade 11.16.2026:
    [Short - YouTube - Show Short Release Date](https://www.youtube.com/shorts/mMW_1TJUJa0),
    public, in the `Bookmarklet Shorts` playlist, and its README entry links
    it. It replaces the first short of the same day, `wSBBxlRVyKs`, which was
    recorded on a page showing another bookmarklet's short, so its frames
    named and showed that bookmarklet and only the date belonged to this one.
    Every short matches the bookmarklet it is named for, so it was remade.
    - The remake is recorded by `.videos/support/record-show-short-release-date.mjs`
      on the same page, signed out, dressed before the page draws: the
      playing video is under a placeholder graphic, the title and channel
      read `Sample Short` and `Sample Channel`, the avatars are plain, and
      the sign-in button is not drawn. Its guard refuses a recording it could
      not dress.
    - It runs 9.4 seconds, so it is one video, with the date on screen for 67
      of its 94 frames. Every frame of the recording, the MP4 and the GIF was
      checked against the masking table, for a login screen and for another
      bookmarklet's name before the upload.
    - Its GIF is a new post for the new short, so the rule against posting a
      GIF twice does not apply. It is posted to Giphy, 11.16.2026, with the
      new short as its source, and is in the `Bookmarklets` collection,
      11.16.2026.
    - The first short and its GIF stay up until the maintainer deletes them
      by hand, which also takes the old GIF out of the collection.
  - `siteSpecific_GoogleMaps_CustomMearsureDistance` is posted, remade
    11.19.2026:
    [Short - Google Maps - Custom Mearsure Distance](https://www.youtube.com/shorts/snJ8bXCJS6w),
    public, in the `Bookmarklet Shorts` playlist, and its README entry links
    it. It replaces the first short, `hDZ6-BE33no` (11.18.2026), which drew
    one line and then held its last frame for over three seconds.
    - The remake is the maintainer's: the Grand Canyon in the map's satellite
      view, the canyon measured rim to rim at its widest, then a triangle
      area with each side measured, then a path down the river, seven lines
      in all.
    - It is recorded by `test-bm.js --short` in the harness's own browser,
      signed in to nothing. The site's sign-in button, its area card and its
      search chips are taken off the page before the recording, and checked
      absent after it.
    - It runs 14.5 seconds, so it is one video. Something new is drawn every
      second and a half, and it ends on a second and a half of the finished
      map, with no still of two seconds anywhere. Every frame of the
      recording, the MP4 and the GIF was checked for a login screen and for
      another bookmarklet's name before the upload.
    - Its GIF is a new post for the new short, posted to Giphy, 11.19.2026,
      with the new short as its source, and is in the `Bookmarklets`
      collection, 11.19.2026.
    - The first short and its GIF stay up until the maintainer deletes them
      by hand, which also takes the old GIF out of the collection.
- [ ] Make and post the shorts for the signed-in site-specific bookmarklets:
  ChatGPT and Gmail
  - From the launcher's sign-in where it has one, otherwise from the
    maintainer's hand recordings. List the ones still without a recording.
  - A run renders these and stops before posting. The maintainer checks each
    for an account name, address, avatar, conversation or message in view,
    and posts it.
  - `siteSpecific_chatGPT_NavigateAnswers.js` and
    `siteSpecific_chatGPT_ResizePrompt.js` were rewritten on 11.23.2026, so
    record them as they are now.
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
- [ ] `siteSpecific_YouTube_AddTimeMarkAnchors.js` - similar to
  [`siteSpecific_YouTube_AddTimeMarks.js`](JSFormatted/siteSpecific_YouTube_AddTimeMarks.js)
  but instead of `href` links for each time mark; use **as if** anchors links, where
  if clicked video goes to where the time mark label points without refreshing
  the page
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

## Browser Extensions

Some bookmarklets do more as a browser extension: an extension can run on
every page load rather than on a click, keep settings in its own storage
rather than the site's, take keyboard shortcuts the browser registers, and
inject styles a strict content security policy refuses a bookmarklet.
Browser plugins in the old sense (NPAPI) are gone from every current browser,
so a port means a WebExtension: Manifest V3 for Chrome and Edge, and
Firefox's WebExtensions.

- [ ] Document which bookmarklets, alone or as a set, are worth porting to a
  browser extension, in `docs/extensions.md` linked from the README
  - One row per bookmarklet or set: what the port would gain, the permissions
    it would ask for (`activeTab` rather than broad host permissions wherever
    it can), what would block it, and whether a userscript is the lighter
    route.
  - Sets that belong together, such as the `window_style_` family, the
    YouTube notes and time-mark bookmarklets, the GitHub repository-table
    bookmarklets, and the ChatGPT answer bookmarklets.
  - A port keeps the safety rule under `## Test Harness`, and asks for no
    permission it does not use.
  - Nothing is built here; the document decides what would be.

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
  - From: Short Videos
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
  - From: Short Videos
- [x] **Important**: never ship a bookmarklet that does anything that could
  pass for malicious, and make the harness refuse one that tries
  - The rule, stated in the README and in `AGENTS.md`: a bookmarklet never
    reads or writes cookies, never reads storage it did not write itself,
    never sends anything from the page to another host, and never loads code
    from anywhere at run time.
  - Keeping its own data in the page's `localStorage` or `sessionStorage`
    (notes, settings, column widths) is fine, and 14 bookmarklets do it
    today. The README says once that the site's own scripts can read that
    storage, so nothing private belongs in it.
  - `test-bm.js` fails a bookmarklet that touches `document.cookie`, calls
    `eval` or `new Function`, adds a `<script>` with a `src`, or makes a
    request to a host other than the page's own, unless its entry names that
    host in a new `network` list with the reason. The three GitHub
    bookmarklets that call `api.github.com` declare it. The source is checked
    before any browser starts, and the run records every request whose stack
    passes through the bookmarklet's `sourceURL`, the way its errors are told
    apart from the page's.
  - `dom_Clipboard_ConvertPageToMarkdown.js` loads `turndown` and its GFM
    plugin from unpkg each time it runs. Bundle them into the bookmarklet, or
    pin them with Subresource Integrity hashes, so what runs is what was
    reviewed.
  - From: Test Harness
- [x] Add `--capture` and a `capture` property: a screenshot before and after
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
  - From: Test Harness
- [x] **Size Column Drop**: `siteSpecific_GitHub_ShowFileSize.js` writes only
  part of the file sizes the first time a directory loads
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
  - From: Existing Bookmarklets `->` From the Open Issues
- [x] `siteSpecific_GitHub_ShowFileSize.js` writes no file sizes when the repo
  root is reached from the navigation path
  - **Issue**: Viewing the repo root from the tree view and then clicking the
    repo root link in the navigation path above the table leaves the sizes
    unloaded. It appears to happen only on the first navigation to the root.
  - **Goal**: Give the entry a step that clicks the navigation path's root link
    from a tree view, then expects a size in every row. Fix what it shows, and
    close the issue with `Fixes #2`.
  - <https://github.com/isocialPractice/bookmarklets/issues/2>
  - From: Existing Bookmarklets `->` From the Open Issues
- [x] Write entries for the ChatGPT and Gmail bookmarklets, each with `auth`,
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
  - **Goal**: Resolve the sign-ins through
    [signed-in-sites.prompt.md](.claude/prompts/signed-in-sites.prompt.md).
  - From: Test Configurations
- [x] Let `url` read an environment variable, as in `"url": "$OCTOPRINT_URL"`,
  and write the OctoPrint entry with it
  - OctoPrint runs on a printer on the maintainer's own network, so its address
    does not belong in the repository. An unset variable is a skip.
  - The address a variable holds never appears in a reason, `report.json`,
    `summary.txt` or `failure.md`; each names `$OCTOPRINT_URL` in its place,
    so a pasted log or an assistant reading the report never learns it.
  - From: Test Configurations
- [x] Size Column Drop 1
  - **Issue**: On one walk in five, clicking into `JSFormatted` from the
    repository root left the tree listing with no `Size` header, no
    `[data-file-size]` cell in any of its 54 file rows, and the
    `parent directory ..` row still at `colspan="3"` with no
    `data-file-size-widened` marker. It stayed that way for the thirty seconds
    the page was watched, and the address never changed again, so nothing was
    going to write the column. The other four walks of the same three states
    were correct in every respect, and the poll does put the column back when
    the listing is replaced under it, so this is the narrower case where the
    pass that was meant to write it found the listing mid-replacement.
  - **Goal**: Resolve to
    [size-column-drop.prompt.md](.claude/prompts/size-column-drop.prompt.md)
  - From: Existing Bookmarklets `->` From the Open Issues
- [x] `siteSpecific_GitHub_ShowFileSize.js` writes an empty Size column once
  GitHub's API refuses, and keeps it
  - **Issue**: The API allows a signed-out reader sixty requests an hour and
    this bookmarklet spends two per directory. Past the limit it answers 403
    with a JSON object, which `getAPIJSON` parses happily, so `addSizeCol`
    writes the header and a cell in every row with nothing in any of them.
    `columnWasDropped` then reads the header's presence as a column that is
    fine, so the sizes never arrive even after the limit resets. Measured
    against a faked 403: header present, 54 cells, 0 of 54 filled, unchanged
    once the API answered again.
  - **Goal**: Resolve to
    [size-column-blank-when-api-refuses.prompt.md](.claude/prompts/size-column-blank-when-api-refuses.prompt.md)
  - From: UI/UX Override - ShowFileSize size column
- [x] `siteSpecific_GitHub_ShowFileSize.js` leaves a second poll running when
  it is pasted twice
  - **Issue**: Each paste ends with its own `checkForChangeDir()` and nothing
    stops the one before it. Measured: a directory change costs two requests
    to `api.github.com` after one paste and three after two. The column itself
    stays single, which is what this run checked, but the repository's rule is
    that a second run reuses what the first added rather than stacking a copy,
    and the extra request brings the hourly limit nearer.
  - **Goal**: Mark the running poll with a `window` key carrying the file's
    `--__-unlikely_-_name-__--` infix, the way the other files here mark what
    they have put on a page, and have a later paste leave it alone. Stated as
    the last point of
    [size-column-blank-when-api-refuses.prompt.md](.claude/prompts/size-column-blank-when-api-refuses.prompt.md).
  - From: UI/UX Override - ShowFileSize size column
- [x] `--capture` writes an "after" screenshot taken before the bookmarklet has
  done anything
  - **Issue**: `runBookmarklet` in `test-bm.js` takes the after shot the
    instant the injection call returns. A bookmarklet that works
    asynchronously has changed nothing by then. For
    `siteSpecific_GitHub_ShowFileSize`, which waits a second and then fetches,
    `before.png` and `after.png` are the same file byte for byte, and neither
    shows the size column. The video of the entry does show it.
  - **Goal**: Take the after shot once the entry's steps have run rather than
    when the injection returns, so the pair is worth the bytes it costs. The
    shots are also what `## Short Videos` draws on, so the one that shows the
    result is the one worth keeping.
  - From: UI/UX Override - ShowFileSize size column
- [x] A table listing with no header row gets size cells and no heading
  - **Issue**: `addSizeCol` gives every listing row a size cell whether or not
    the rows it was handed include a header row, so a table listing whose
    header row is missing ends up with a column and nothing naming it. With
    `api.github.com` answered 403, `refused()` writes 54 empty cells and no
    heading - measured `{"headings":0,"cells":54,"filled":0}`, unchanged over
    44 seconds - which is the unexplained blank column the `Size (rate limited)`
    heading was added to remove, back in the one state with no heading to put it
    in. With the API answering, the sizes are written and
    `columnNeedsWriting()` keeps reading the missing heading as a listing that
    needs fetching again: 7 requests to `api.github.com` in 92 seconds for a
    directory already on the page and already written into it. `writeWaits`
    then runs out and `nextTryAt` becomes `Infinity`, so putting the header row
    back never brings the heading back - measured 0 headings for a further 60
    seconds, until the address changed. Put the header row back inside those 92
    seconds and the column does return on its own, which is the case this run's
    repair was raised about and which passes.
  - **Goal**: Resolve to [size-column-headerless-listing.prompt.md](.claude/prompts/size-column-headerless-listing.prompt.md)
  - From: UI/UX Override - ShowFileSize headerless listing
- [x] Let an entry answer a host with a chosen status and body, and edit the
  page mid-run, so these states stop needing a person
  - **Issue**: none of what this run verified is reachable by
    `node test-bm.js`. The harness cannot make `api.github.com` refuse and
    cannot replace a listing while an entry runs, so the refusal heading, the
    wait schedule, the replaced listing and the double paste were all checked
    with a scratch Playwright driver that no suite runs. The entry passes
    either side of the defect above.
  - **Goal**: the mechanism is already in the tree - `page.route` fulfilled
    from local files serves the `fixture:` pages under `## Test Harness`. Aim it
    at a named host from a step that takes the status, the content type and the
    body, and add a step that evaluates a page edit so a listing can be
    replaced. The host stays named in the entry's `network` with its reason, as
    now. With both, the entry asserts: the heading reads `Size (rate limited)`
    while the answer is 403 and `Size` once it is good again, with the sizes
    filling in and no further paste; the column returns within two seconds of a
    listing replaced without it; no size cells are written into a listing with
    no header row; and a directory change costs one request to `api.github.com`
    whether the bookmarklet was pasted once or twice.
  - From: UI/UX Override - ShowFileSize headerless listing
- [x] **Size Heading Type**: The `Size` heading renders at zero height, so the
  rate limit reason reaches no one looking at the page
  - **Issue**: The heading the bookmarklet inserts carries its text in the DOM
    and in the accessibility tree, but it is 90x0 on screen: GitHub's header
    row sets `font-size: 0` and `line-height: 0`, and the inserted `th`
    inherits both, as GitHub's own `Name`, `Last commit message` and
    `Last commit date` headings do at 271x0, 405x0 and 136x0. With the API
    refusing and the header row present, a reader meets 18 empty cells in an
    unnamed gutter between the file name and the commit message and no reason
    anywhere on the page, which is the unexplained blank column the heading was
    written to remove. Measured signed out at 1280x720; the committed copy and
    the working copy measure identically, so it is not new with the headerless
    repair. Everything else about the column is right: 90px, 10% of the table,
    directly after the name cell, its band `304..394` over the centre of all 18
    cells, inside the viewport.
  - **Goal**: Resolve to
    [size-heading-never-shows.prompt.md](.claude/prompts/size-heading-never-shows.prompt.md)
  - From: UI/UX Override - ShowFileSize heading visibility
- [x] Let `gitHubTask` (on `PATH`, outside this repository) post a short
  without prompts
  - **Done 11.13.2026, in `gitHubTask` itself.** Called with all five
    arguments, `gitHubTask /V "<path>" "<title>" "<description>" "<tags>"
    "public"` uploads with no prompt, from any path however deep, and a video
    without `_Demo` in its name goes to the `Bookmarklet Shorts` playlist,
    found on the channel by its title. It prints `Video:` and `Short:` links
    and writes `VIDEO_ID`, `URL`, `SHORT` and `PLAYLIST` lines to
    `.tmp/youtube-last-upload.txt` in this folder, which is where the README's
    video block takes its link from. A failed upload prints `YouTube upload
    FAILED`, writes no file and copies nothing - `gitHubTask` still exits 0
    either way, so read the words and the file, not the exit code.
  - **One sign-in, by the maintainer, at a desktop:** `gitHubTask /V
    --sign-in`. Without it an upload stops at once with `YouTube sign-in
    needed` rather than waiting on a browser; that is the correct end of a run,
    and the short stays owed.
  - `gitHubTask /v` uploads unattended when it is given the title,
    description, tags and privacy, but its only playlist is the demo playlist,
    picked by a `_Demo` file-name prefix. Give it the shorts playlist.
  - Passing its tags argument through to the upload is already planned on the
    `gitHubTask` side.
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
  - From: Short Videos
- [x] `node ._bookmarklet.js verify` fails on every entry that has a video
  block, and each short posted adds two more failures
  - **Issue**: The video block `## Short Videos` prescribes opens with
    `<details>` and `<summary>Show Details</summary>`, and the README entry
    splitter reads that summary as the start of an entry. The three entries
    that carry one today - `dom_Note_TakePageNotes`,
    `siteSpecific_YouTube_WatchRandomVideo` and
    `siteSpecific_chatGPT_PasteReadyBookmarkResponse` - each report both
    `has 0 entries, expected 1` and `entry names a missing file: Show
    Details`, so `verify` ends `54 entries, 6 error(s)`. `._bookmarklet.js`
    also carries a `drop-details` command and errors on `<details> left in
    the entry`, so the element the block reintroduces is the one an earlier
    migration was written to take out. Found by running `verify` on an
    unchanged `README.md`; it is not new with any one run, and it grows by
    two errors per short posted.
  - **Goal**: Settle which of the two is wrong and change that one. Either
    give the video block a shape that carries no `<details>`, updating the
    template in `## Short Videos` and the three entries already using it, or
    teach the entry splitter and `drop-details` to pass over a video block
    while still rejecting a stray `<details>`. `verify` ending with no errors
    on an unchanged README is what finishes it.
  - From: Found Issue - the README video block breaks `verify`
- [x] Size Heading Type 1: the heading is now set `nowrap`, and on a folder
  page it runs out of its cell and over GitHub's own `Last commit message`
  - **Issue**: The four properties the heading sets are right for the
    repository root, where GitHub serves the header row at `font-size: 0` and
    nothing in it is drawn. A folder page is served at `font-size: 12px;
    line-height: 18px`, its three headings paint real text, and the heading was
    already visible there before this change. `white-space: nowrap` stops it
    wrapping inside its own cell, so on
    `/tree/main/JSFormatted` with the API refusing, `Size (rate limited)`
    paints 99.98px of text in a 92.5px cell and covers the first 7.48px of
    `Last commit message` at 1280 wide, 20.30px at 1152 and 33.09px at 1024;
    `elementFromPoint` at the tail of the heading returns GitHub's own `span`.
    It comes clear at 1366 and wider. The committed copy wrapped inside its own
    cell at every width below 1600 - three lines at 1024, two from 1152 to
    1440 - and covered nothing at any width. The root
    is unaffected and keeps what it gained - 90.19x0 to 90.19x32, hidden to
    visible, one line, nothing else moved - and the comment in the file and the
    `## [11.14.2026]` changelog entry both state the never-visible premise as
    though it held everywhere, which is why the folder page went unconsidered.
    Measured signed out at 1280x720 and five other widths, committed copy and
    working copy on the same page.
  - **Goal**: Resolve to
    [size-heading-covers-commit-heading.prompt.md](.claude/prompts/size-heading-covers-commit-heading.prompt.md)
  - From: UI/UX Override - ShowFileSize heading visibility
- [x] An entry cannot assert that an element's text stays inside its own box,
  so nothing in the suite can pin the collision above
  - **Issue**: `expect` takes `selector`, `visible`, `hidden`, `count`,
    `matches`, `text`, `clipboard`, `location`, `popup`, `requests` and
    `atMost`. Every one of them is satisfied by a heading that paints its text
    straight over the heading beside it, which is how the
    `siteSpecific_GitHub_ShowFileSize` entry passes at 1280 today with the two
    `visible` assertions in place. The same gap let the zero-height heading
    pass for as long as it did: `visible` was the answer that time, and there
    is no equivalent answer for overflow.
  - **Goal**: Give `expect` a geometry answer - an element's painted text
    staying within its own border box. `scrollWidth` against `clientWidth` is
    enough to see it, and reports 26px of overflow at the root and 23px on the
    folder page; a `Range` over the text nodes is the stronger form, because it
    also says whether the cell the text runs into paints anything, which is the
    difference between the root and a folder page. Then add a step to the
    `siteSpecific_GitHub_ShowFileSize` entry that reaches
    `/tree/main/JSFormatted` with the API refusing and asserts it, at the 1280
    viewport the harness already runs.
  - From: UI/UX Override - ShowFileSize heading on folder pages
- [x] Post each short's GIF to Giphy, as `## Social Media Posting` in the
  constants describes, after its YouTube upload
  - Split from the `gitHubTask` item above, which no longer waits on it. The
    key is read from the local note at run time and never written into a
    script, a log or a commit.
  - Done 11.15.2026. The poster is `.videos/support/post-giphy.mjs`, local
    and never committed: it reads the key itself, posts the GIF with the
    short's URL as its source, and confirms it on Giphy. The ShowFileSize
    short's GIF is posted with it, and the run's constants now make a Giphy
    post part of every short, right after its YouTube upload. Adding each GIF
    to the `Bookmarklets` collection stays with the maintainer, since the
    upload API cannot.
  - **User Note**: Adding each GIF to the `Bookmarklets` collection has been
    marked to handle autonomously, and no longer handled by the maintainer.
- [x] Add `--short` to `test-bm.js`: run an entry's steps at a 648x648 viewport
  and save a 10 fps GIF of under ten seconds as the bookmarklet's recording
  - Builds on `--capture` under `## Test Harness`. Start just before the
    bookmarklet runs and stop once its result is on screen.
  - Write to the folder named by a `TEST_BM_SHORTS_DIR` environment variable,
    defaulting to `test-results/shorts/`.
  - Never overwrite a recording that is already there. The maintainer's hand
    recordings come first.
  - An entry with `auth` records through its launcher, as its test runs, and
    its recording stays on the machine until the maintainer has reviewed it.
  - From: Short Videos
- [x] Make a failure report an agent can act on without re-running anything
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
  - From: AI-Assisted Verification
- [x] Write the triage procedure in a tracked `AGENTS.md` at the repository
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
  - From: AI-Assisted Verification
- [x] Move `OctoPrint - Change Graph Image`'s older demo link, which sits above
  its gist paragraph, into a video block's demo line in place of its comment,
  with the short line commented out until its short exists
  - The README keeps its CRLF line endings.
  - From: Short Videos
- [x] Write `docs/testing.md`: install (`npm install`, then
  `npx playwright install chromium`), run one, run all, run the scheduled set,
  the flags, the exit codes, and where the report is written
  - From: Testing Documentation
- [x] Add a configuration reference to `docs/testing.md`: every property with
  an example, what the default safe run does and does not prove, fixture
  pages, and `auth`
  - Describe `auth`, `signedIn` and `TEST_BM_AUTH_LAUNCHER` by contract alone:
    what a launcher's three functions take and return, that an entry without
    one is a skip, and that no sign-in or session is ever in the repository.
    No launcher, browser profile or account is described.
  - Examples use `example.com`, `example.org` and placeholder bookmarklet
    names only.
  - From: Testing Documentation
- [x] Add a scheduling section to `docs/testing.md`: a Windows Task Scheduler
  example (`schtasks /Create ... /TR "node test-bm.js --scheduled"` with a
  placeholder path), a cron line for the same, and how to key a notification on
  the exit code
  - From: Testing Documentation
- [x] Document the three stages `npm test` runs in `docs/testing.md`:
  `test:harness`, `test:pages` and `test:bookmarklets`, what each one proves,
  and that `test/pages.test.js` is what keeps the practice pages fit to show
  a reader
  - From: Testing Documentation
- [x] Add an AI-assisted section to `docs/testing.md` that points at
  `AGENTS.md`, and name Claude Code, Codex and GitHub Copilot as the
  assistants it has been written for
  - From: Testing Documentation
- [x] Add `--browser firefox` as a second engine
  - Bookmarklet handling differs between engines, and Firefox is the second
    most likely place a reader pastes one. Chromium stays the default and the
    only engine `--scheduled` uses unless an entry asks for more.
  - Done 11.16.2026: `--browser firefox` runs every entry in Firefox, and an
    entry's `"browsers": ["chromium", "firefox"]` asks for both when the run
    names no engine. No entry asks for Firefox yet, so `--scheduled` still runs
    Chromium alone.
  - Firefox does not say which code started a request, so there every request
    to another host after the bookmarklet first ran is judged as its own, and
    an entry that counts requests, or has `auth`, is a skip.
  - Firefox is a local install step, `npx playwright install firefox`, which
    the scheduled set never runs. The harness names it when Firefox is
    missing, and `--help` says so; the install section of `docs/testing.md`
    is where it belongs once that page exists.
  - From: Test Harness
- [x] Add a `viewport` step to `test-bm.json`, so an entry can assert at a
  width other than the 1280x720 every run uses
  - `clear` is the one expectation that reads geometry, and the defect it was
    written for was width-dependent. Measured on 11.15.2026 against the copy
    of `siteSpecific_GitHub_ShowFileSize` this run replaced, `clear` fails it
    on the folder page at 1024, 1152 and 1280 and passes it at 1366, 1440 and
    1600. The default width does catch it, but by a 7x16px overlap, the
    narrowest of the three: one notch wider and the entry would have passed a
    heading that covered GitHub's own `Last commit message` for every reader
    at a smaller window.
  - `{ "viewport": { "width": 1024, "height": 720 } }` as a step, holding for
    the steps after it, with the default restored when the entry ends.
  - `siteSpecific_GitHub_ShowFileSize` then asserts `clear` at 1024 as well as
    at the default, on the folder page with the API refusing, which is the
    state and the width the collision lived at.
  - Done 11.16.2026: the step holds for the steps after it, and the entry's
    own size comes back when it ends. `siteSpecific_GitHub_ShowFileSize`
    passes `clear` at 1024 on that page in that state, and the copy from
    before the 11.15.2026 fix fails the same check, its heading painting past
    its box over `Last commit message`.
  - From: UI/UX verification, 11.15.2026
- [x] Run `siteSpecific_OctoPrint_ChangeGraphImage`'s entry against a live OctoPrint, signed in through `auth`, on both paths: as published, which removes the graph's image, and with `img` set to a file served from `webassets/img`
  - No printer needs to be connected: the entry asserts the graph element and its style only.
  - The published path passes as of 11.16.2026: signed in through `"auth": "octoprint"`, with `"signedIn": "#tabs"`, the graph's image is removed.
  - The path with `img` set passes as of 11.16.2026, through a second `run` step with `"set": { "img": "test-bm-graph.png" }`: the graph's style holds `/static/webassets/img/test-bm-graph.png`. That proves the address the bookmarklet writes, not that the file is on the host.
  - Whether a file placed in `webassets/img` is served and shown moved to `## User - Resolve Test Procedures`.
  - From: Test Configurations
- [x] `siteSpecific_YouTube_ShowShortReleaseDate.js` renders nothing on the
  first visit to YouTube
  - **Issue**: Running it on a first visit to the site renders no data, because
    the markup it reads is not the markup a first visit serves.
  - **Goal**: Wait for, or read, whatever the first visit does serve. An entry
    with a fresh context is a first visit every time, so this one is testable
    without any sign-in. Close the issue with `Fixes #14`.
  - <https://github.com/isocialPractice/bookmarklets/issues/14>
  - Done 11.16.2026: a first visit does serve the short's description, a
    moment after the page. The first run no longer alerts that it is not
    initialized and reloads the page; it waits for the description and the
    action bar, checking every half second for up to ten seconds, and leaves
    the short alone if they never come. In a narrow window, where the action
    bar sits on the video, the date is lifted above the bar instead of being
    drawn under its first button. The entry runs on one of the maintainer's
    own shorts and passes; on the unchanged file it failed, the page reloading
    before any date was drawn.
  - From: Existing Bookmarklets `->` From the Open Issues
- [x] Document how each assistant gets a browser
  - The Playwright MCP server (`@playwright/mcp`) works with Claude Code,
    GitHub Copilot in VS Code, and Codex. Each tool registers MCP servers in its
    own config file, and those locations change between releases, so link each
    tool's documentation rather than restating a path.
  - Run it with an isolated profile (`--isolated`), never in a mode that
    connects it to the reader's own browser, which carries their sign-ins.
  - Config files such as `.mcp.json` start with a dot and are hidden by the
    ignore rules here, so this is documentation, not a committed config.
  - Done 11.16.2026: `docs/testing.md` `## Giving an assistant a browser`,
    beside the AI-assisted section, gives the server's command with
    `--isolated`, rules out `--extension` and `--cdp-endpoint`, and links each
    tool's own MCP documentation. The AI-assisted section now says which
    Copilot surfaces read `AGENTS.md`, with each tool's documentation linked.
  - From: AI-Assisted Verification
- [x] Add a short Testing paragraph to the README intro linking
  `docs/testing.md`
  - Done 11.16.2026: the paragraph closes the README's intro, after the blank
    canvas bookmarklet. The README keeps its CRLF line endings.
  - From: Testing Documentation
- [x] Stop the gallery's slideshow adding a session history entry every three
  seconds, so Back can leave the page
  - **Issue**: each slideshow tick calls `.click()` on a link whose `target` is
    the frame, and a frame navigation is a session history entry. Measured
    signed out in Chromium: `history.length` is 2 on load and **10 after 26
    seconds** of nobody touching the page, growing without bound. Back
    therefore rewinds the slideshow instead of leaving the gallery - after half
    a minute a reader needs eight presses to get off the page, after five
    minutes a hundred. The three queued slideshow and address items do not name
    this: "Let a reader control the slideshow" scopes which anchors are
    clicked, and "Give each example its own address" asks that "Back returns to
    the previous one", which is the deliberate choice, not the automatic tick.
  - **Goal**: an automatic advance replaces the current history entry rather
    than adding one - `history.replaceState` with the example's hash, or a
    frame navigation made with `location.replace` - and only a reader's own
    click or key press pushes an entry. Check it by reading `history.length`
    after 30 seconds of leaving the page alone: it should not have moved.
  - From: UI/UX Override - the deployed gallery, its examples and the practice pages
- [x] Land "Let a reader control the slideshow" before "Explain the page above
  the gallery", or the gallery throws readers off the site
  - **Issue**: the slideshow clicks every `<a>` on the page, and an anchor
    without `target="examples"` navigates the top level rather than the frame.
    Proved by appending one ordinary link to the side navigation and leaving
    the page alone: within one cycle the address bar had left the gallery for
    the appended link's own page. Today nothing triggers it, because the five
    example links are the only anchors on the page - but "Explain the page
    above the gallery" adds links to the README entry, the raw file, the gist,
    the short and the README. Shipped in that order, with the slideshow still
    cycling every anchor, the gallery sends a reader off the site on its own
    within fifteen seconds of their arriving.
  - **Goal**: work the slideshow item first, or work the two together. Either
    way the slideshow steps a named list of the example links, never
    `document.getElementsByTagName("a")`. A regression guard is cheap: append
    an anchor to the navigation, wait a cycle, and assert the top-level
    document has not navigated.
  - From: UI/UX Override - the deployed gallery, its examples and the practice pages
- [x] Repair the five `examples/` pages, and the bookmarklet that writes them
  - **Issue**: the deployed site is `index.html` and the pages it frames, and
    every queued item names `index.html` or the gallery, so the five framed
    pages have no item and no test. Measured: `chatGPT_Bookmark_Schedule.html`
    pushes the document to **766px in a 390px viewport** on its one table, the
    same defect `test/pages.test.js` exists to catch on the practice pages;
    three of the five render in quirks mode on a bare `<!DOCTYPE>`; none of the
    five carries `lang`; every one of them skips h1 to h3; and all five share
    one `<title>` ("ChatGPT Bookmark") and one `<h1>` ("ChatGPT Response"), so
    the five examples cannot be told apart in a tab, in history or in a
    bookmark. The table style, the missing `lang` and the skipped level are
    written by
    `JSFormatted/siteSpecific_chatGPT_PasteReadyBookmarkResponse.js`, so the
    queued "Add more examples" item would reproduce them.
  - **Goal**: Resolve to [example-pages-markup.prompt.md](.claude/prompts/example-pages-markup.prompt.md)
  - From: UI/UX Override - the deployed gallery, its examples and the practice pages
- [x] Give `snippet.html` a `Try these on this page` box, or stop the practice
  index promising one
  - **Issue**: `test/fixtures/pages/index.html` tells a reader "Each page lists
    what to try on it", and `snippet.html` carries no such box. It is the one
    page of the eight the index links that does not. `test/pages.test.js`
    cannot catch it: its "the Try these on this page box does not skip a
    level" test returns early on a page without a box (`if (!box) { return; }`)
    and then asserts only that at least one page carries one, so the suite is
    green with eight boxes or with one.
  - **Goal**: give `snippet.html` a box naming the converter bookmarklets it
    exists for - `Clipboard - convert page to markdown` is the one it was built
    as a fixture for - and change that `pages.test.js` test to require a box on
    every page the index links, so the next page added without one fails.
  - From: UI/UX Override - the deployed gallery, its examples and the practice pages
- [x] Take `GitHub - resize repo table columns` out of `table.html`'s try box,
  or say it needs GitHub
  - **Issue**: `table.html` names it among the three bookmarklets to try, and
    it does nothing there. Run on `table.html`, signed out, it added 0 resize
    handles, 0 fixed-layout tables, 0 style tags and 0 flagged tables, and
    threw nothing - `setGlobals` tests `location.host` for `github.com` and
    returns before touching a table anywhere else. Both of the page's tables do
    carry the `Name` header the bookmarklet's own fallback looks for, so the
    host gate is the only thing stopping it. A reader follows the instruction,
    sees nothing happen, and gets no message saying why. No test disagrees: the
    bookmarklet's `test-bm.json` entry runs it against
    `https://github.com/isocialPractice/bookmarklets`, never against a practice
    page.
  - **Goal**: drop the line from `table.html`'s box, since the page cannot
    exercise it. If it is kept, word it as `scroll.html` words its own
    unexercised entry ("nothing to fix here, which is also worth seeing") so
    the reader is told nothing will happen and why.
  - From: UI/UX Override - the deployed gallery, its examples and the practice pages
- [x] **Table Box Ring**: The examples' scrolling table box cannot be reached
  without a mouse
  - **Issue**: the box
    `JSFormatted/siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` started
    wrapping each table in on 11.20.2026, `div.tableScrollPasteReady`, scrolls
    on `overflow-x: auto` but carries no `tabindex` and no `role`. Measured
    signed out, each example opened directly rather than inside the gallery's
    frame: at 390px `chatGPT_Bookmark_Schedule.html` holds **474px of its table
    out of view** and `chatGPT_Bookmark_SocialMediaMarketing.html` 55px, and at
    1280px `Schedule` holds 29px; on all of them `tabIndex` is `-1` and `role`
    is absent, so Tab never lands on the box and the hidden columns cannot be
    reached without a pointer. The repository already settled this the other
    way on the practice pages: `test/fixtures/pages/table.html` sets
    `role="region"` and `tabindex="0"` while `scrollWidth > clientWidth`, drops
    both when the table fits, re-reads on resize, and `test/pages.test.js`
    asserts it in three tests. The completed "Repair the five `examples/`
    pages" item is not reopened by this: its goal was the document not dragging
    sideways at 390px, which it reached, and `test/gallery.test.js` guards it.
    The box it added to get there is what no item covers.
  - **Goal**: Resolve to [example-table-box-keyboard.prompt.md](.claude/prompts/example-table-box-keyboard.prompt.md)
  - Applied 11.21.2026. The page the bookmarklet writes marks each
    `div.tableScrollPasteReady` `role="region"` with `tabindex="0"` while
    `scrollWidth` is over `clientWidth`, drops both when the table fits, names the
    region from the nearest heading above it, and re-reads on resize; the box takes
    a `:focus-visible` outline from `bookmarkPageStyle` in both colour schemes. The
    prompt's step 3 was wrong about the five `examples/` pages: none of them carries
    the `pageScript` at all, and only `chatGPT_Bookmark_Schedule.html` and
    `chatGPT_Bookmark_SocialMediaMarketing.html` hold a table, so the marking and the
    outline went into those two and the other three were left as they are. The guard
    keys on the box's own measure, `scrollWidth` over `clientWidth`, rather than the
    table against the box: the two can differ by a pixel, and the box decides its own
    marking from the first.
  - From: UI/UX Override - the examples' new table box
- [x] Table Box Ring 1: the dark colour scheme draws the ring in the colour
  meant for a dark page, on a page that stays light
  - **Issue**: the stop itself works. Signed out, Chromium, each example opened
    directly and again inside `index.html`'s frame, at 1280x800 and 390x844:
    Tab lands on the box (first press opened directly, sixth inside the frame,
    after the five navigation links), `:focus-visible` matches, a 3px ring is
    painted on every side the viewport holds, the frame's edge clips none of
    it, the arrow keys carry all 474px, 519px, 163px, 100px, 55px and 29px held
    out of view into view and back out, and the region is named
    "A Monthly Schedule" and "How It Works" from the heading above it.
    `SocialMediaMarketing` at 1280 holds 0px out of view and is correctly no
    stop at all: twenty presses of Tab pass it by. The ring's **colour** is
    what fails. Read as painted pixels - the focused box shot, focus taken off
    it at the same scroll position, the two differenced, so every changed pixel
    is the ring and what it covered is the page behind it - the light scheme
    gives `rgb(9,105,218)` over `rgb(249,250,250)` at **4.97:1**, and the dark
    scheme gives `rgb(88,166,255)` over `rgb(249,250,250)` at **2.42:1**, under
    the 3:1 WCAG 1.4.11 asks of a focus indicator. All six dark readings fail,
    2.42:1 opened directly and 2.39:1 inside the frame. The cause is that the
    page never darkens: `body` carries `background: rgb(47 79 79 / 3%)`, which
    propagates to the canvas, so the pixels behind the box measure the same
    near-white in both schemes to within a point per channel, while the
    `@media (prefers-color-scheme: dark)` block changes the ring alone. The
    dark branch makes the ring harder to see, not easier.
  - **Goal**: Resolve to [example-table-box-dark-ring.prompt.md](.claude/prompts/example-table-box-dark-ring.prompt.md)
  - From: UI/UX Override - the examples' new table box
- [x] `test:harness` fails intermittently on the short that holds still
  - **Issue**: "a short never holds still for two seconds" failed once and
    passed on an immediate re-run, nothing changed between them. It reported
    `the wait between the blocks and the end on the result each held still:
    [[1.5,8.532]]` - one still spanning eight and a half seconds where the test
    asks for two, so the recorder saw the fixture's second block as part of the
    same motionless run. The test records real video and reads the GIF back
    through ffmpeg, so it is timing sensitive, and a busy machine is enough to
    move it. Nothing in this run's diff touches `test-bm.js` or
    `test/harness.test.js`.
  - **Goal**: make the reading survive a slow recorder rather than loosening
    what it asserts - drive the fixture's second block from something the
    recorder cannot miss, or record the run again once before failing, and say
    in the failure which of the two it was. A suite that goes red on a loaded
    machine costs the next run a false alarm and teaches it to ignore the
    harness.
  - From: UI/UX Override - the table box's focus ring in the dark scheme
- [x] The gallery's keyboard readings count presses, which measures the machine
  as much as the box
  - **Issue**: "the arrow keys bring the hidden columns into view, and take them
    back out" went red on this run's first pass and green on the next, with
    nothing changed between them: 25 presses of ArrowRight carried the whole 474px
    on one run and 160px on the other, and on a third a single ArrowLeft after them
    moved nothing at all. Chromium carries 40px a press and animates it, and a
    press sent while the last one is still animating is coalesced rather than
    queued, so a fixed count of presses carries a distance that depends on how
    loaded the machine is. The same defect as the item above, read from the other
    side, and found while adding the ring reading for the item above that.
  - **Goal**: take the reading from where the box comes to rest rather than from a
    count of presses - press until it has got there, on a budget past the widest
    run either example hides, so what is asserted is still that the arrow keys
    reach the end of what is out of view and bring it back.
  - From: UI/UX Override - the table box's focus ring in the dark scheme
- [x] Make `index.html` work on a phone and pass the W3C validator
  - Add `lang="en"`, `<meta name="viewport">`, a description, and the
    repository's `favicon.png`. Give the frame a `title`.
  - Replace the absolutely positioned 15% side navigation and the floated 80%
    frame with a grid that stacks the navigation above the frame on narrow
    screens.
  - Style the frame's border with CSS in place of the deprecated
    `frameborder` attribute, which also lacks a space before it today.
  - Make the `<title>` and the `<h1>` agree. They read "Bookmarklet Examples"
    and "Bookmarklets Examples" today.
  - Checked on 11.23.2026 against the W3C Nu validator, which reported nothing
    at all: no error, no warning, no informational message. The page before it
    reported two errors - no space between attributes, where
    `src="..."frameborder="0"` parsed as one, and a heading level skipped from
    `h1` to `h3` - and two warnings, the obsolete `frameborder` and the missing
    `lang`. `test/gallery.test.js` reads each of those from the rendered page,
    so they are guarded without the service.
  - From: Improve GitHub Pages Site
- [x] Give each example its own address
  - Choosing an example sets `#<example-file-name>` in the address bar,
    opening the page with that hash shows that example, and Back returns to
    the previous one. The README can then link straight to an example.
  - Mark the open example's link with `aria-current="page"` in place of
    `data-active`, with a visible focus style.
  - Size the frame from the example's `load` event and a `ResizeObserver` on
    its body. The examples share the site's origin, so this replaces the
    polling loop that runs every 100 ms and stops after 300.
  - From: Improve GitHub Pages Site
- [x] Let a reader control the slideshow
  - It advances every three seconds until something is clicked, and treats a
    hover as a click. Give it a visible pause and play button.
  - Stop it on any click, focus or key press, and never start it when the
    reader's system asks for reduced motion (`prefers-reduced-motion`).
    Content that moves on its own needs a way to pause it (WCAG 2.2.2).
  - Two parts of this landed on 11.20.2026 with the UI/UX override's found
    issues, because the gallery was sending readers off the site without them:
    it now steps the five example links rather than every `<a>` on the page,
    and an automatic advance replaces the frame's location rather than clicking
    a link, so it adds no session history entry. `test/gallery.test.js` guards
    both. The control and `prefers-reduced-motion` are what is left.
  - From: Improve GitHub Pages Site
- [x] Explain the page above the gallery
  - Say what the examples are: pages that
    `ChatGPT - Paste Ready Bookmark Response` saved as bookmarks, each shown
    as a reader would see it on opening the bookmark. Link the bookmarklet's
    README entry, raw file, gist and short.
  - Add a short how-to-install with `support/Demo-ReadyToUse.gif`, and a link
    to the README for the full list.
  - From: Improve GitHub Pages Site
- [x] Add practice pages, where a reader can try the bookmarklets that work on
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
  - From: Improve GitHub Pages Site
- [x] Promote a `test/gallery.test.js` that opens `index.html` and the five
  `examples/` pages, the parts of the deployed site no test opens
  - `test/pages.test.js` covers `test/fixtures/pages/` only, so the gallery's
    script has never been read by a test: not the sizing interval that runs
    every 100 ms and is cleared after 300, not the slideshow that clicks every
    `<a>` every three seconds, and not `data-active`. A working driver is in
    `.tmp/ui-ux-gallery/` (ignored): `gallery.test.js`, 34 assertions, and
    `read.test.js`, 49 across the examples and the practice pages. Both follow
    `pages.test.js`: `node --test`, `playwright.chromium.launch()`, the files
    served by `page.route` on an origin of its own so the framed pages are
    same-origin, collectors evaluated whole inside the page, and one measuring
    pass shared by many small assertions.
  - It asserts what the `## Current` gallery batch is for, so it is that
    batch's regression guard and should land with it: the slideshow stops and
    can be paused, it steps only the example links, it adds no history entry on
    its own, it does not run under `prefers-reduced-motion`, the navigation and
    the frame do not overlap at 1280, 1024 and 390, no nav link is covered or
    clipped, the frame is sized to the example it is showing rather than the one
    before it, Tab reaches the five links in order and each is visibly marked,
    the `<title>` and the `<h1>` agree, and the page says what the examples are.
  - 17 of the gallery driver's 34 assertions fail against the page as it
    stands, by design - that is the batch's work list. Wire it into
    `package.json` as its own `test:gallery` script once it is green, so
    `npm test` is not red in the meantime.
  - `test/gallery.test.js` and `test:gallery` landed on 11.20.2026 with the
    UI/UX override's found issues, in the same shape the driver uses, and held
    15 green tests by 11.22.2026: the three that guard the slide show's history
    entries and the links it steps, and twelve that read the five examples at
    1280 and 390, their table box's stop and the ring it is drawn with.
  - Finished on 11.23.2026, with the `## Current` gallery batch it is the
    regression guard for, as this item said it should be. Sixteen readings
    were added for the rest of the list above, taking the file to 31 green
    tests: the markup a validator and a phone need, the navigation against the
    frame at 1280, 1024 and 390, Tab order through the five links with a ring
    on each, the frame's height against the page inside it, the page saying
    what the examples are, the practice list, `aria-current` in place of
    `data-active`, the address bar and Back through it, the pause control
    pressed, reduced motion, and that the page's script raises nothing over a
    run that opens it, resizes it three times, walks it with Tab and clicks
    through it. The sizing interval is gone rather than guarded: the frame is
    sized from a `load` event and a `ResizeObserver`, and the frame-height
    reading is what holds that. `docs/testing.md` describes each one.
  - From: Test Harness

</details>
