# Bookmarklets TODO

Planned work for this repository. `## Current` holds the next items to
complete, in order. The level 2 sections below it are the roadmap those items
are drawn from, and each item pulled into `## Current` keeps a nested `From:`
line naming its section.

The testing sections come first on purpose. Once `test-bm.js` exists, every
bookmarklet a later section adds lands with a `test-bm.json` entry and a
passing run, rather than being tested after the fact.

A new bookmarklet is three things in one item: its file in `JSFormatted/`, its
entry in `test-bm.json`, and a passing `node test-bm.js <name>`. Its gist and
README entry come afterwards and are published by the maintainer, which is
what `## User Use Only` at the bottom of this file is for.

## Current

- [ ] Add a `package.json` with Playwright as its one dependency, and ignore
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
- [ ] Write `test-bm.js`, so `node test-bm.js <name>` runs one bookmarklet in a
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
- [ ] Add `test-bm.json`, the per-bookmarklet test configuration, with a JSON
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
- [ ] Add `--all`, `--scheduled` and `--list`, with a report a scheduled task
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

Next version: minor.

- [ ] Support bookmarklets for signed-in sites without keeping any sign-in in
  the repository
  - An `auth` property names a Playwright storage-state file in the folder
    given by a `TEST_BM_AUTH_DIR` environment variable, which must resolve
    outside the repository. `node test-bm.js --save-auth <file> <url>` opens a
    headed browser, waits while the maintainer signs in, then saves the state.
  - A missing state file makes the entry a skip with the reason, never a
    failure, so a scheduled run on a machine without it stays green.
  - An entry with `auth` runs read-only: no step may submit a form or send a
    message, and the runner refuses to start if one would.
- [ ] Add `--capture` and a `capture` property: a screenshot before and after
  the bookmarklet runs, and a video of the whole entry
  - Fixed viewport, fixed steps, and no clock or random value rendered into the
    page by the harness, so two captures of an unchanged bookmarklet match.
  - The report lists each artifact path and the time offset at which every step
    started, so a clip can be cut to the moment the bookmarklet ran without
    anyone scrubbing through it.
  - A failure always keeps its after screenshot, captured or not.
  - These captures are also the footage for the README's
    `<!-- PASTE VIDEO HERE -->` slots.
- [ ] Self-test the harness with fixture bookmarklets in `test/fixtures/`,
  run by `node --test`
  - One that passes; one that throws; one with a `//` comment; one with an
    `i%16` modulo; one with a missing semicolon between two lines; one whose
    page logs its own console error while the bookmarklet succeeds. Each
    asserts the verdict and the reason `test-bm.js` gives.
  - `npm test` runs these before the bookmarklets themselves.
- [ ] Serve local fixture pages from a fake origin instead of `file://`
  - `page.route("https://fixtures.test/**", ...)` fulfilled from
    `test/fixtures/pages/` gives each fixture a real origin, so
    `localStorage`, the clipboard and `location` behave as they do on a site.
    It also needs no network and never changes.
  - `url` accepts `fixture:<file>.html` as shorthand for that origin.
- [ ] Add `--browser firefox` as a second engine
  - Bookmarklet handling differs between engines, and Firefox is the second
    most likely place a reader pastes one. Chromium stays the default and the
    only engine `--scheduled` uses unless an entry asks for more.

## Test Configurations

Entries in `test-bm.json` for the bookmarklets already published. The default
safe run covers anything without an entry; these entries add the assertions
that show a bookmarklet did its job, rather than merely not crashing.

Next version: patch.

- [ ] Run `node test-bm.js --all` once and file every failure as its own item
  under `## Existing Bookmarklets`, with `**Issue**` and `**Goal**` nested
  - The README's status line already says some existing bookmarklets may not
    work. This run is what turns that into a list of which ones.
- [ ] Write entries for the bookmarklets that work on any page: `dom_`, `nav_`,
  `style_` and `window_`
  - Use `fixture:` pages where `https://example.com/` lacks what the
    bookmarklet needs, such as tables, headings, a sidebar, a video or a form.
  - Assert the effect: an element hidden, text wrapped in `<b>`, a panel added,
    a clipboard value written. Mark each `"scheduled": true`; these never
    depend on a third-party site.
- [ ] Write entries for the public site-specific bookmarklets: GitHub, Stack
  Overflow, w3Schools, YouTube, Google and Google Maps
  - Each lists in `requires` every selector the bookmarklet reads, taken from
    its source rather than from memory.
  - Pick pages that load signed out and are unlikely to move, such as this
    repository's own GitHub page.
  - Mark `"scheduled": true` only where the page loads headless without a
    consent wall or bot check from this machine. YouTube and Google serve
    consent pages in some regions; an entry that cannot get past one is
    `scheduled: false` with the reason in `skip`.
- [ ] Write entries for the signed-in site-specific bookmarklets: ChatGPT,
  Gmail and Amazon, each with `auth` and `"scheduled": false`
- [ ] Let `url` read an environment variable, as in `"url": "$OCTOPRINT_URL"`,
  and write the OctoPrint entry with it
  - OctoPrint runs on a printer on the maintainer's own network, so its address
    does not belong in the repository. An unset variable is a skip.

## Existing Bookmarklets

Fixes and changes to bookmarklets already published. The first full test run
files its failures here.

Next version: patch.

- [ ] Add an `s, s` key sequence to `siteSpecific_chatGPT_NavigateAnswers.js`
  that returns the page to normal

## AI-Assisted Verification

A failing test says that something changed. Finding what changed on a
redesigned site, and the smallest edit that fixes the bookmarklet, is work an
agent with a browser does well. The deterministic run stays the judge: an agent
proposes, and `test-bm.js` decides.

Everything here is tool-neutral. The procedure is written once, in a tracked
file every assistant reads, rather than once per assistant.

Next version: minor.

- [ ] Make a failure report an agent can act on without re-running anything
  - For a `requires` failure: the missing selector, the lines of the
    bookmarklet that use it, and an ARIA snapshot (`locator.ariaSnapshot()`)
    plus trimmed outer HTML of the region where it was expected.
  - For a thrown error: the message, the stack mapped back to lines in the
    formatted file, and the after screenshot.
  - Write it as `failure.md` beside `report.json`, so any assistant reads it as
    plain text.
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
  - Hard limits, stated in the file: never sign in, never submit a form or
    send a message, and never loosen a `test-bm.json` expectation to make a
    test pass unless the bookmarklet's intended behaviour changed, saying so
    when it did.
- [ ] Document how each assistant gets a browser
  - The Playwright MCP server (`@playwright/mcp`) works with Claude Code,
    GitHub Copilot in VS Code, and Codex. Each tool registers MCP servers in its
    own config file, and those locations change between releases, so link each
    tool's documentation rather than restating a path.
  - Config files such as `.mcp.json` start with a dot and are hidden by the
    ignore rules here, so this is documentation, not a committed config.

## Testing Documentation

How to install, run, configure and schedule `test-bm.js`, written in
`docs/testing.md` and linked from the README. Documentation only: items pulled
from here carry `From: version.control = null`.

Next version: patch.

- [ ] Write `docs/testing.md`: install (`npm install`, then
  `npx playwright install chromium`), run one, run all, run the scheduled set,
  the flags, the exit codes, and where the report is written
- [ ] Add a configuration reference to `docs/testing.md`: every property with
  an example, what the default safe run does and does not prove, fixture
  pages, and `auth` with `TEST_BM_AUTH_DIR`
  - Examples use `example.com`, `example.org` and placeholder bookmarklet
    names only.
- [ ] Add a scheduling section to `docs/testing.md`: a Windows Task Scheduler
  example (`schtasks /Create ... /TR "node test-bm.js --scheduled"` with a
  placeholder path), a cron line for the same, and how to key a notification on
  the exit code
- [ ] Add an AI-assisted section to `docs/testing.md` that points at
  `AGENTS.md`, and name Claude Code, Codex and GitHub Copilot as the
  assistants it has been written for
- [ ] Add a short Testing paragraph to the README intro linking
  `docs/testing.md`

## Documentation Site

The README is past both of the automation's documentation-site thresholds
(1,164 lines and 48,668 characters on 2026-11-04). The
`### Create and Deploy GitHub Pages Override` under `## Current` holds `No site`
so that the queue is worked first. This section hands the decision back.

What the site needs, beyond splitting the README:

- **One page per bookmarklet**: description, status ("ready to use" or
  "requires N changes"), raw link, gist link, a demo video or GIF slot, and the
  result of the last `--scheduled` run.
- **A drag-to-install link for each bookmarklet.** A site can render
  `<a href="javascript:...">` for a reader to drag onto the bookmarks bar,
  which a GitHub README cannot. Build the `href` from the same join `test-bm.js`
  checks, percent-encoded, so what gets installed is exactly what was tested.
- **The current address keeps working.** GitHub Pages serves this repository
  at `https://isocialpractice.github.io/bookmarklets/` today, from `main` at
  `/`, and the page there is `index.html`'s example page. That page becomes
  part of the site rather than disappearing.
- **The README stays the front door**, with its headings linked to the site.

Next version: minor.

- [ ] Hand the site decision back to the run: under
  `### Create and Deploy GitHub Pages Override`, replace `- No site` with
  `- Build the documentation site described in ## Documentation Site`
  - Only once the build-type item under `## User Use Only` is checked. A deploy
    workflow is ignored while Pages builds from a branch, so the site cannot be
    built until that is decided.
  - The run after this one builds the site rather than working the queue. That
    is expected.

## New Bookmarklets - DOM

Bookmarklets for working with a page's content and structure, filed under
`# DOM Bookmarklets` in the README.

Next version: minor.

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
  survives a crash or an expired session; password fields are never stored
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
- [ ] `dom_Note_PersistentHighlights.js` - highlights that are saved per URL
  and reapplied the next time the bookmarklet runs on that page
- [ ] `dom_Text_WordCount.js` - words, characters and reading time for the
  selection, or for the main content when nothing is selected

## New Bookmarklets - Navigation

Bookmarklets for moving around a page or between pages, filed under
`# Navigation Bookmarklets` in the README.

Next version: minor.

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

## New Bookmarklets - Style

Bookmarklets that change how a page looks, filed under `# Style Bookmarklets`
in the README.

Next version: minor.

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

Next version: minor.

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
    rather than failing silently at the limit.
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

Next version: minor.

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

Next version: minor.

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

Next version: minor.

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
this section, but they do add to it: a run that adds a bookmarklet appends
`- [ ] Publish <name>.js - gist and README entry` here, because both need a
gist id that only exists once the maintainer has published it.

- [ ] Decide whether GitHub Pages keeps building from the `main` branch or
  moves to a GitHub Actions workflow. Pages reports `build_type: legacy` with
  `source: main /`, so a deploy workflow is ignored until the source changes,
  and changing it on a live site can take the site down. Not a change to make
  unattended.

## Complete

Finished items, archived from `## Current` with the `From:` line recording the
roadmap section each one came from.
