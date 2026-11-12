# Changelog

All notable changes to the bookmarklets in this repository are documented in
this file.

> Release mode: dated - this project does not publish versions, tags, or
> releases. Entries are keyed by the date the work was applied.

## [11.12.2026]

### Fixed

- `siteSpecific_GitHub_ShowFileSize.js` tells GitHub's refusal apart from its
  answer. The API allows a reader who is not signed in sixty requests an hour,
  and past that it answers 403 with a JSON object carrying a message - valid
  JSON, which parsed as happily as the data did, so the column was written with
  its header in place and every one of its cells empty. The check that decided
  whether the column still needed writing read the header's presence as a
  column that was fine, so the sizes never arrived even after the limit reset.
  An answer now counts only when the request succeeded and the body is the
  array of entries the API documents, a refusal leaves the sizes already on the
  page exactly as they are, and the heading reads `Size (rate limited)` for as
  long as the refusal lasts - a reader could not otherwise tell a directory of
  empty files from a limit that had been reached. Asking again backs off, five
  seconds then fifteen, forty-five, a hundred and thirty-five and three hundred,
  and then stops until the address changes: the limit lasts until the hour turns
  over, and nothing about it is fixed by asking every second. A request that
  never arrived is now caught as well, where before it left a page that was
  never written to again. Only a page holding a listing is asked again, for the
  same reason: a GitHub page that is not a file listing - an issues page, say -
  derives an address the API has nothing at, and asking after a refusal there
  spent six of the reader's sixty an hour on an answer that writes nothing.
- `siteSpecific_GitHub_ShowFileSize.js` writes the column whatever state the
  listing was in when the data came back. The switch that let the recovery run
  was set from the DOM at the end of each pass, so a pass that wrote no header
  left it off and the second-by-second check never asked again for that page -
  which is how one walk in five reached a directory with no header, no size cell
  in any of its 54 rows, and nothing left that was going to write them. A pass
  can write no header: the rows of a table page came back as a live
  collection, and GitHub replaces the listing a moment after the address
  changes, so a loop reading that collection walked rows that were leaving the
  page. The recovery condition is now about the page rather than about the last
  pass - a listing whose rows hold no size cell wants the column, whether or not
  one was ever written, and so does a table that kept its cells and lost its
  header - each pass walks a static copy of the rows it decided to walk, skips
  any already taken off the page, and clears nothing until it has found a
  listing to write into, so a pass that arrives mid-replacement leaves the
  reader the column they already had. A page with no listing rows still wants
  nothing, and a write that leaves no column backs off the same way a refusal
  does rather than becoming a request a second.
- `siteSpecific_GitHub_ShowFileSize.js` leaves the running copy alone when it is
  pasted a second time. Each paste ended with its own check running and nothing
  stopped the one before it, so a directory change cost two requests to the API
  after one paste and three after two, bringing the hourly limit nearer for no
  gain. The copy that is running now marks the window with a key carrying the
  file's own `--__-unlikely_-_name-__--` infix, the way the other files here
  mark what they have put on a page, and a later paste finds it and leaves it
  to do the work for both.
- `--capture` takes the after screenshot once the entry's steps have run, rather
  than the instant the injection call returns. A bookmarklet that fetches, or
  waits, or needs a frame to paint has changed nothing by then: for
  `siteSpecific_GitHub_ShowFileSize`, which waits a second and then fetches,
  `before.png` and `after.png` were the same file byte for byte and neither
  showed the size column. The shot is named when the bookmarklet runs and taken
  at the next thing that ends its work - the entry's steps having run, or
  another run of the bookmarklet starting - so a bookmarklet an entry runs
  twice still gets a numbered pair for each run. An entry that fails keeps
  `failure.png` at that same moment under a name that says what it is, and
  drops the pending shot rather than writing the same picture twice.
- Measured against a faked 403 answered for `api.github.com`, so no real quota
  was spent: the heading reads `Size (rate limited)`, two requests go out in the
  twenty-two seconds the refusal lasts rather than one a second, and all 54
  sizes arrive on their own once the API answers again. Measured by replacing
  the listing with a copy that has neither size cells nor a header row, which is
  the state that used to latch the old switch off for good: the column returns
  as soon as the header row is back. Measured by pasting twice: a directory
  change costs one request, where it cost three. Measured against a 404 for a
  GitHub page holding no file listing: one request goes out, where three went
  out in the same thirty seconds and six over the whole back-off. The entry for
  this bookmarklet passes against the live site, and its gist goes up with the
  commit that carries the file.

### Changed

- `test/harness.test.js` can hand a run its own bookmarklet source rather than
  the passing fixture, which is how a test that needs a bookmarklet of a
  particular shape - one that works asynchronously, say - gets one without
  adding a fifteenth file to `test/fixtures/bookmarklets` for every other test
  to count. Two tests use it: the after shot differing from the before shot for
  a bookmarklet that paints late, and a failing entry of the same bookmarklet
  keeping `before` and `failure` and nothing else.

## [11.11.2026]

### Added

- `--capture`, and an entry's `"capture": true`, write a screenshot of the page
  either side of the bookmarklet and a video of the whole entry, into
  `test-results/test-bm/<run>/capture/<name>/`. The report lists every artifact
  path and the offset into the video at which each step started, so a clip can
  be cut to the moment the bookmarklet ran without anyone scrubbing through it;
  a single-name run prints the same lines. A bookmarklet an entry runs twice
  gets a numbered pair for the second run. Everything the harness decides is
  fixed so two captures of an unchanged bookmarklet match - the viewport, the
  steps and their order, and what reaches the page, which is the bookmarklet and
  nothing else - and a capturing run settles hinting, subpixel antialiasing and
  the colour profile, stops animations and hides the caret. On a page that holds
  still that is byte-for-byte; what is left over is Chromium rasterizing the
  page itself, a channel out by one either side of a glyph or a rounded border.
- A failure now keeps `failure.png`, the page as it stood when the entry failed,
  whether or not anything asked for a capture. An entry with `auth` captures
  nothing at all, refuses `"capture": true` as a configuration error, and says
  in its notes that nothing was captured, because a signed-in page shows the
  account and what it holds.
- `expect.matches` counts one selector's matches against another's, for one
  thing per row of something a page lists: the failure names both counts. It is
  what turns a partial write into a verdict, where the count a page would give
  changes whenever the page does and the relation does not.
- An entry's `url` may name an environment variable, as `"$OCTOPRINT_URL"`, for
  a page whose address does not belong in the repository. The address is read
  when the entry runs and reaches the browser only: every reason, `report.json`
  and `summary.txt` names the variable in its place, and the address is taken
  back out of anything the page itself said - its console, its errors, its
  dialogs, a popup address. An unset variable is a skip rather than a failure,
  and a `$name` that is not a variable's shape is a configuration error.
- Every bookmarklet in `JSFormatted` now has a `test-bm.json` entry. The five
  ChatGPT and three Gmail bookmarklets that read a signed-in page have one with
  `auth`, `signedIn` and `"scheduled": false`, so the three that used to fail
  against `https://example.com/` are a stated skip until a sign-in is there
  rather than a fault; `siteSpecific_chatGPT_BookmarkResponse` needs no sign-in,
  because it writes a bookmark page out of a response pasted into it, so its
  entry runs on a fixture page and checks what it wrote. The OctoPrint entry
  takes its address from the environment variable above.
- `test/harness.test.js` covers all three with thirteen more tests: the
  screenshots, the video, the step offsets, the numbered second pair, a failure
  keeping its screenshot with nothing asking for one, a quiet pass keeping
  nothing, a signed-in page capturing nothing, both sides of `matches`, and a
  url from the environment used without being written down.

### Fixed

- `siteSpecific_GitHub_ShowFileSize.js` sizes every file in a directory, and
  labels the column it adds, however the directory was reached. It read the
  listing by row number, so the second row was always treated as the row above
  the listing: on a tree page that row is the latest commit, but the repository
  root has no such row, so its first file was given no size cell and had its
  commit message widened into the size column instead. It also wrote a size
  into every folder row, because it looked for `(Directory)` in the row's text
  where GitHub now carries it in the name link's `aria-label`, and the API gives
  a folder a size of 0, so each folder read `0 B`. Rows are now told apart by
  what they hold rather than by their number, a folder is told from a file by
  the API's own `type`, and a row spanning the table has its `colspan` raised by
  one off its own value rather than set to a fixed four. The column header is
  written whenever it is missing, so a root reached by clicking the repository
  in the navigation path above the table gets one again - the listing holding
  the old header has been replaced by then - and the rows are counted again when
  the data comes back, because GitHub can finish rendering the table while the
  fetch is still out. A second paste clears the column it wrote before rather
  than leaving two side by side.
- `siteSpecific_GitHub_ShowFileSize.js` puts the column back when GitHub takes
  it away. The address changes first and the listing is replaced a moment later,
  so a column written in between is thrown out with the table that held it,
  which is why the second issue reported the sizes missing only on the first
  navigation to a directory. The second-by-second check that already watched the
  address now also notices a column that was written and is no longer there, and
  writes it again. A page with no listing to write one into is left alone, so
  nothing asks GitHub for the data every second on a page that was never going
  to carry a column.
- Measured on this repository's own root and on a directory in it: before the
  fix, 17 size cells against 13 file rows; after it, one size in every file row,
  folders blank, and the header present on a cold root, a cold directory, and
  the root reached from the navigation path. The entry walks all three, so the
  replacement showed up as one failing scheduled run out of several before the
  check above was added, and eight runs in a row pass after it. Its gist carries
  the fix. Fixes #1 and #2.

## [11.10.2026]

### Added

- `test-bm.js` runs bookmarklets for signed-in sites without holding any
  sign-in. An entry with `"auth": "<site>"` gets its browser from a launcher
  module named by `TEST_BM_AUTH_LAUNCHER`, which must sit outside the
  repository, and names a `signedIn` selector that tells a signed-in page from
  a signed-out one. Without a launcher the entry is a skip, and a signed-out
  page is a skip rather than a `site changed` failure. Such an entry is never
  scheduled, is refused before any click, fill or key press aimed at a form, a
  text area, an editable region or a submit control, and writes down nothing
  the page shows: the page's console and errors are counted, and dialog text,
  popup addresses and quoted page text are withheld. `--sign-in <site>` asks
  the launcher to open a site, and at the end of a run the launcher hears which
  sites were found signed in.
- `expect.popup` checks where a new tab the bookmarklet opened went. The
  fixture origin is now routed on the browser context, so a tab opened onto a
  fixture page is served too.
- `test/harness.test.js` covers both with eleven more tests, run against a
  stub launcher written into the temporary folder and a fixture bookmarklet
  that opens a new tab.
- `siteSpecific_Amazon_HideVideoPauseIcon` has an entry, as a skip: a headless
  browser is shown a bot check in place of the product page.
- No bookmarklet may do anything that could pass for malicious, and
  `test-bm.js` now refuses one that tries. Before any browser starts, a file
  that touches `document.cookie`, runs a string as code (`eval`,
  `new Function`, a string handed to a timer, `import()`), or loads a
  `<script>` by its `src` without an integrity hash fails. During the run,
  every request started from the bookmarklet's code is noted, and one to a
  host other than the page's own fails the entry unless the entry names that
  host, or `*.` and its domain, under the new `network` property with the
  reason. The whole synchronous stack is read, because a site that wraps
  `fetch` puts its own frame above the bookmarklet's call.
- The rule is stated in the README's new Safety block and in a new
  `AGENTS.md`. A bookmarklet's own notes and settings in `localStorage` stay
  fine; the README says the site's own scripts can read them.
- Seven harness tests cover it, with fixtures that read cookies, run `eval`
  and send to a `.invalid` host, so nothing leaves the machine.

### Security

- `dom_Clipboard_ConvertPageToMarkdown.js` loads `turndown` and its GFM plugin
  from unpkg pinned by Subresource Integrity hashes, so a changed file on the
  CDN is refused rather than run on the reader's page.
- The entries that reach another host say so and why: the three GitHub
  bookmarklets that read GitHub's own REST API, the Markdown converter's two
  pinned libraries, and YouTube's own video servers, which the player calls
  when `siteSpecific_YouTube_SyncAudio` changes the quality.

### Fixed

- `siteSpecific_YouTube_WatchRandomVideo.js` reads the lockup thumbnail class
  YouTube serves now, with the older class and the search results' thumbnail
  as fallbacks, and says with an alert when a page lists no videos rather than
  doing nothing. YouTube's signed-out home feed lists none at all, so its entry
  runs on a channel's video tab and expects a new tab at a watch address. Its
  gist carries the fix, and its README entry links its short.
- The scrolling table boxes on `test/fixtures/pages/table.html` answer three
  things a read-through of the practice pages raised.
  - A scrolling table's title stays readable while the table scrolls under it.
    The `<caption>` is as wide as the table it titles, so it used to slide out
    of its own box at the end of a scroll, leaving the title cut off at
    whatever letter the scroll had reached. A caption cannot be held still
    itself - a sticky box cannot shift past its own containing block, and here
    the two are the same width - so the caption's text is held instead, by a
    span inside it that is narrower than the box it sits in.
  - Each scrolling table box names itself with `aria-labelledby` pointing at
    its caption, rather than repeating the caption as an `aria-label`. The
    sentence was written out twice, so the title a reader saw and the name a
    screen reader read could drift apart; now there is one copy and they
    cannot. A box that fits is no longer a region at all, so it is not named
    twice there either. Where a box does scroll, the region and the table it
    holds still take their name from the same caption, and a screen reader
    reads it on entering the region and again for the table.
  - A scrolling table box is a keyboard stop only while it has something to
    scroll. `tabindex="0"` and `role="region"` were on the wrapper at every
    width, so at a desktop width the first Tab landed on a box that could not
    move and rang the whole table before reaching a link. Both attributes are
    now set from `scrollWidth > clientWidth`, on load and on resize, which is
    what the scrollable-region pattern asks for.
- The long page's two demands on the layout are two breakpoints rather than
  one. Narrowing the fixed readout still happens at 909px, which is where the
  text column stops reaching it. Insetting the page's three full-width bands by
  140px now happens at 879px, because that is where the inset starts doing
  work. Between those widths the page keeps the 108px the inset had been taking
  from a column that did not need it.

### Changed

- The README's status, and the repository's description, say maintenance is
  automated and some bookmarklets may still not work.
- `test/pages.test.js` measures a third viewport, a tablet width of 880x720,
  between the desktop and phone widths it already took. It sits in the band
  between the readout's two breakpoints and is the first width at which the
  inset is off, so a breakpoint moved by a pixel now reads as a failure.
- Five tests were added with it, each named for the defect it catches. Three
  read the pages at rest: the caption staying inside its box at the end of a
  scroll, a table box being a keyboard stop only where it can scroll, and the
  page insetting its text only at the widths the narrowed readout cannot clear
  on its own. Two more press keys and resize, which a snapshot of a page at
  rest cannot answer: that the first Tab reaches a table box only where the box
  scrolls, and that the stop is added and dropped on resize with no reload.
  Each was confirmed to fail with its fix removed.

### Notes

- The breakpoint for the inset is 879px rather than the ~520px the read-through
  proposed. The read-through swept the page at a single scroll offset, deep
  enough into the log that only the 760px text column was beside the readout.
  Swept at every width from 1280px to 380px and every 50px of scroll, the first
  width at which any text run meets the readout with the inset dropped is
  866px, and the text it meets is the header paragraph: the header spans the
  full width, so it reaches the readout long before the column does. 879px
  keeps a margin over that measurement and sits one pixel under the new 880px
  test viewport.

## [11.09.2026]

### Fixed

- The practice pages under `test/fixtures/pages/` now read properly at a phone
  width as well as a desktop one. All three defects were present from the day
  the pages were committed, and the suite stayed green through them.
  - The "Try these on this page" box is an `<h2>` rather than an `<h3>`. It
    sits above the page's first `<h2>`, so the outline ran h1 then h3 then h2
    on six of the nine pages. It is a sibling section of the page's other
    sections, not a subsection of anything. `fixture.css` gives the `h2` back
    the look the `h3` had, including suppressing the rule line the bare `h2`
    rule draws, so the rendered page is unchanged but for the 3px the h2's
    smaller default bottom margin tightens above the list.
  - Each table in `table.html` sits in a `.table_scroll` wrapper that scrolls
    on its own axis, so the table no longer pushes the document sideways. At
    400px the document reported a `scrollWidth` of 446 against a `clientWidth`
    of 400, which gave the whole page a horizontal scrollbar and clipped the
    Notes column mid-word. The wrapper is a keyboard-reachable
    `role="region"` named after each table's caption, and the table stays a
    real table, which is what the markdown converters need from the page.
  - The fixed readout on `scroll.html` keeps clear of the log it reports on.
    Below 910px the page insets its own text on the right and the readout
    narrows to fit the band reserved for it; above that width `main` stops at
    760px and the readout already lands in the gutter beside it. Measured at
    400px, the opaque readout had been covering two rows of the log outright
    once the page was scrolled.
  - The readout breakpoint is 910px rather than a rounder figure because that
    is where the text column stops reaching it: `main` is 760px wide with a
    32px right padding, and the readout needs the 182px to the right of that.
    A narrower breakpoint leaves a band of widths where the readout still sits
    on the text.

### Added

- `test/pages.test.js`, a `node --test` suite that pins how the practice pages
  read, so a presentation regression fails a run rather than reaching the
  deployed site.
  - It drives Playwright directly and serves the pages from
    `https://fixtures.test` the way `test-bm.js` does, so links, anchors and
    the embedded frame resolve as they would on a site.
  - All nine pages at 1280x720 and 400x720: one `h1` each, an outline that
    never skips a level going down, no horizontal overflow, a header row on
    every table and a caption on every table a reader reads as content, a
    visible label tied by `for` and `id` to every form control, an "All
    practice pages" link that answers 200 and reaches the index, and every
    link the index lists resolving.
  - Nothing the page floats over itself may cover its text. That is measured
    as glyph runs, by taking `getClientRects()` of a `Range` over every
    non-empty text node and intersecting each with the overlay's own rect: an
    element box is too coarse, because a wide list item whose words stop short
    of an overlay is not a defect. The check is taken at rest and at offsets
    down the page, since the readout only covered anything once the page had
    moved.
  - Three of the eleven checks name the defects above directly, so a
    regression reads as itself rather than as a general assertion failing.
  - One browser launch and one pass fill a report the assertions share, the
    way `harness.test.js` shares a single harness run, which is why eleven
    checks take about a second.
  - `npm test` runs it between the harness and the bookmarklets, as
    `npm run test:pages`.
- `snippet.html` is exempt from the table-caption check, named in the suite
  with the reason: it is a converter fixture holding one of each construct, and
  `dom_Clipboard_ConvertPageToMarkdown` pins its whole markdown output, which a
  caption would change.

## [11.08.2026]

### Added

- `test/harness.test.js`, a `node --test` suite that runs `test-bm.js` against
  nine fixture bookmarklets whose verdict is known before the run starts, so
  the harness is checked rather than trusted.
  - One fixture per thing the harness can say: a bookmarklet that works and
    turns itself off on a second run, one that throws, one carrying a `//`
    comment, one holding an `i%16` modulo, one missing the semicolon between
    two statements, one whose line runs into the line below it, one that works
    on a page raising errors of its own, one that needs a real origin, and one
    that reads a selection.
  - Each assertion is the verdict and the part of the reason `test-bm.js`
    writes, never the part V8 writes, so a Chromium that rewords a syntax
    error does not fail the suite.
  - The suite spends one browser launch on one `--all` run and reads the
    report, which is why thirteen checks take three seconds.
  - `npm test` runs it ahead of the bookmarklets themselves, as
    `npm run test:harness` and `npm run test:bookmarklets`.
- Fixture pages in `test/fixtures/pages/`, served from `https://fixtures.test/`
  by `page.route` rather than opened as `file://`.
  - An entry's `url` takes the form `fixture:<file>.html`, with a hash after
    the file name where one is wanted. A fixture naming a page that is not
    there, or one that climbs out of the folder, is a configuration error
    before any browser opens.
  - A real origin is the point of it: `file://` gives an opaque origin, which
    refuses local storage, the clipboard and a same-document navigation, so a
    bookmarklet using any of those would fail on the fixture and work on a
    site.
  - Nine pages, each self-contained: an article, a table, a form, a sidebar, a
    video, a page whose loader never finishes, a long page with a scroll
    offset readout, a small page holding one of each thing a converter has to
    handle, and an index listing them. Nothing on any of them reaches the
    network.
- A `select` step, which selects an element's text the way a reader drags
  across it. The range is set inside the element's text node, because that is
  the shape a drag leaves and the shape the bookmarklets that style selected
  text refuse to work without.
- An `expect` taking a `location`, for a bookmarklet that navigates.
- `TEST_BM_JS_DIR` and `TEST_BM_CONFIG`, which move the bookmarklet folder and
  the configuration file. Only the self-test sets them.
- `test-bm.json` entries for forty four bookmarklets, up from one.
  - Every bookmarklet that works on any page: the effect is asserted, not
    merely the absence of a crash. An element hidden, a panel added, a
    notebox that collapses when its button is clicked, text wrapped in
    `<strong>`, a clipboard holding the exact markdown produced, a page that
    moved five hundred pixels.
  - The public site-specific bookmarklets for GitHub, Stack Overflow,
    w3Schools, YouTube, Google and Google Maps. Each `requires` lists the
    selectors its bookmarklet reads, so a redesign is reported as
    `site changed: <selector> not found` rather than as a crash.
  - Thirty three are `scheduled: true`. Ten are skipped with the reason:
    Stack Overflow answers a headless load with a Cloudflare challenge,
    Google answers a headless search with its bot check, Google Maps renders
    no scale bar, and six YouTube bookmarklets need a signed-in session, a
    shorts shelf, or a notebox another bookmarklet adds.
  - The forty fourth, the markdown converter, runs and passes but is
    `scheduled: false` with no skip: it loads turndown and the GFM plugin from
    unpkg.com, so a scheduled run of it would depend on a third party.

### Changed

- A path in a `test-bm.js` message is now written from the repository root
  through one helper, so moving the bookmarklet folder or the configuration
  file does not leave `JSFormatted/` or `test-bm.json` in the text of an error
  about a different one.
- A missing bookmarklet folder is reported as a configuration error instead of
  a stack trace.

## [11.07.2026]

### Added

- `test-bm.js`, a Playwright harness that runs one bookmarklet, or every
  bookmarklet, in a real Chromium and says whether it still works.
  - `node test-bm.js <name>` resolves a name the way `bookmarklet.js copy`
    does, as `name`, `name.js` or `JSFormatted/name.js`.
  - Before any browser starts, the file is joined onto one line both ways a
    browser could join it - every line break replaced by a space, and both
    characters of the break dropped with nothing in their place - and parsed
    both ways. A file that parses one way and not the other is failed with the
    line in the formatted file whose end runs into the line below it.
  - The joined code is then percent-decoded, because a URL field decodes it. A
    modulo written as `i%16` becomes a control character, and the failure names
    the line it is on.
  - The code goes into the page in its own global scope under a
    `//# sourceURL=bookmarklet/<name>.js` tag, which is what tells the
    bookmarklet's errors apart from the page's own. Only the bookmarklet's
    errors fail an entry; the page's errors and console output are recorded.
    An error's column is mapped back to a line in the formatted file.
  - Content security policies are left in force, so a `<style>` tag the
    bookmarklet injects is refused on a strict site exactly as it is for a
    reader, while the CSSOM still works.
  - A fresh context per bookmarklet at a fixed 1280x720 viewport, dialogs
    dismissed unless an entry answers them, and popups closed and recorded.
  - Exit `0` nothing failed, `1` something failed, `2` usage or configuration
    error. A skip never fails a run. `--headed` and `--slow-mo <ms>` are for
    watching one.
- `--all`, `--scheduled` and `--list`.
  - `--all` runs every file in `JSFormatted/`, configured or not. `--scheduled`
    runs only the entries marked `"scheduled": true`, which is all a cron job
    or a scheduled task has to call. `--list` says what a run would do with
    each bookmarklet without opening a browser.
  - One browser for the batch, a fresh context per bookmarklet, one at a time.
  - A batch writes `test-results/test-bm/<YYYY-MM-DD_HHMMSS>/report.json` and
    `summary.txt`, one line per bookmarklet with its verdict, reason and
    duration, closing with a line that sums the run up.
  - An entry the browser will not open a context for fails on its own, so one
    bad entry costs its own verdict rather than the rest of the batch and the
    report that would have recorded it.
- `test-bm.json`, the per-bookmarklet test configuration, with
  `test-bm.schema.json` beside it for editor completion and validation.
  - `url`, `scheduled`, `requires`, `steps`, `dialogs`, `permissions`, `skip`,
    `timeout` and `settle`. A bookmarklet with no entry gets the default safe
    run: `https://example.com/`, one run, a settle period, and a pass when it
    parsed, ran and threw nothing.
  - `steps` run in order: `run`, `click`, `fill`, `press`, `wait` and `expect`.
    A second `run` step runs the bookmarklet again, which is how one that turns
    itself off on the second run is checked.
  - A missing `requires` selector fails with
    `site changed: <selector> not found on <url>`, which is the message the
    harness exists to produce when a site redesigns underneath a bookmarklet.
  - Shapes are checked before anything opens, so a typo in the configuration is
    a usage error rather than a confusing failure.
- `package.json`, holding Playwright as its one dependency at an exact version,
  with `npm test` and `npm run test:scheduled`.
- Ignore rules for `node_modules/` and `test-results/`, and a `!.gitignore`
  line so a clone inherits them.

### Fixed

- Nothing. The first full run reports 41 of 54 bookmarklets passing the default
  safe run; the 13 that fail are site-specific bookmarklets meeting a page they
  were not written for, which is what `## Test Configurations` in `TODO.md`
  exists to settle.
