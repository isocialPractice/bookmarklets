# Changelog

All notable changes to the bookmarklets in this repository are documented in
this file.

> Release mode: dated - this project does not publish versions, tags, or
> releases. Entries are keyed by the date the work was applied.

## [11.25.2026]

### Security

- `test-bm.js` keeps a sign-in out of `test-bm.json` by the two ways one could still be written
  there, beside the unknown keys it already refused. An entry whose `url` carries a user name or a
  password, as `https://name:secret@example.com/`, is a configuration error that exits 2 and reads
  `<entry>: url carries a sign-in`. A `fill` step aimed at a password field, one with
  `type="password"` or an `autocomplete` of `current-password` or `new-password`, or a label for
  one, fails the entry before it types and reads `step <n> fills a password field`. Neither
  message repeats the value, and the harness writes nothing back to the file. `--help` says so,
  and three tests in `test/harness.test.js` check both refusals, an address with an `@` only after
  its host still being let through, and the value appearing nowhere in the output or the run's
  folder.

### Fixed

- The corner badge on the page `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` writes keeps
  the end of its label off its own rounded corner. The 11.24.2026 change left two narrow bands
  where the label just fits on one line a few pixels before the block is wide enough for it, so
  the line's tail met the `border-bottom-right-radius` and the block's own clipping took the end
  of the final `k` off: at 840 to 847 pixels of the page's layout width, and at 1191 to 1197. Both
  words still read at both bands, so this was a look rather than a break. The label now reserves
  8 pixels at its right edge, which is the least reserve that is not the binding figure at any
  width from 320 pixels up, and it leaves 6 pixels between the label and the curve at the closest
  approach. Where the line no longer fits beside the reserve it wraps, as it did before
  11.24.2026. The five saved pages under `examples/` carry their own copy of the rule and each
  has the same change.

### Added

- `test/gallery.test.js` holds the reading that found it, beside the two byline readings: the
  example's own layout width is stepped from 320 to 1600 pixels, a pixel at a time, on all five
  pages, and no glyph run of the label may cross the corner the block is clipped by. The corner is
  taken where the clip actually runs, which is three figures the obvious reading gets wrong: the
  padding box rather than the border box, the radius less the border width rather than the radius
  the style sheet asks for, and that radius scaled the way CSS scales one wider than the box it
  sits in. Read the obvious way instead, a label the clip was biting into came out 0.3 pixels
  clear. A pixel at a time because each band is ten widths wide, and all five pages because the
  rule is copied into each of them, so a copy left behind is what this catches - the two readings
  beside it are taken at 390 and 1280 pixels, and both bands lie between them. It fails on each
  page as it stood and passes on each as it is. `docs/testing.md` describes it.

## [11.24.2026]

### Fixed

- The corner badge on the page `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` writes keeps
  its label inside itself at every width. The block is a share of the page wide and its label was
  a fixed 12pt, so the two parted company as the page narrowed: at a phone width the words
  `ChatGPT Bookmark` were painted outside the black shape they are written on, white on a page
  that is painted near-white, and what was left of them landed on the heading beside it - by 3x5
  pixels on the page opened on its own and by 8x17 and 18x5 in the gallery frame, which lays the
  example out in 328 pixels of a 390 pixel viewport. The label is now sized as a share of the
  page too, the block reserves the depth its rounded corner takes, and the block clips anything
  that still does not fit, so the words can no longer be painted on the page behind it. Read
  across widths from 320 to 1600 pixels the label left the badge's shape at fourteen of twenty
  three before and at none after. The five saved pages under `examples/` carry their own copy of
  the rule, written when they were saved, and each has the same change.

### Added

- `test/gallery.test.js` holds the two readings that would have caught it, over all five examples
  at both widths, on the page opened on its own and on the page as `index.html` frames it: the
  block's own text runs against the block's painted box, where nothing may end past its right or
  bottom edge, and the same runs against the `h1`'s runs, where nothing may overlap. The guard
  beside them, that the block covers none of the article's text, passes either way, because it
  skips every run inside the block as the block's own text. The two fail on the pages as they
  stood and pass on the pages as they are. `docs/testing.md` describes both.

## [11.23.2026]

### Added

- [to-explorer](https://github.com/jhauga/to-explorer) is a dev dependency, pinned at 1.1.0 as
  Playwright is pinned, so `npm install` brings it in. `docs/testing.md` names it, as
  `npx to-explorer --chrome [0-9]+ <address>`, where it tells a reader to open a page in a chosen
  Chrome profile. No test calls it.
- `docs/testing.md` lists what the repository uses, under `## Install`: each dev dependency,
  browser build and program, what uses it, and what happens without it. `gitHubTask`, which
  posts and updates the gists, is named there and in `TODO.md` as a local tool of the
  maintainer's, not part of this repository.
- `test-bm.json` can keep a bookmarklet out of every run, in one of two ways.
  `"deprecated": { "why": ... }` or `{ "see": ... }` is a bookmarklet its site or a better tool
  has overtaken: kept in `JSFormatted/` as it is, no longer tested or updated, and its entry holds
  nothing else. `"byHand": "<reason>"` is one whose page is unsafe to automate: still maintained,
  by a person, with its entry's page and steps kept as the record of how a person checks it. No
  command runs either one, whether by a name, `--all`, `--scheduled`, `--short` or the everyday
  driver: the file is not checked, no browser starts for it, and neither the sign-in launcher nor
  the everyday driver is loaded for it. Each is reported under its own verdict, `deprecated` or
  `by-hand`, with its reason, counted in `report.json`, on the tally and on `--list`'s last line,
  and never fails a run. The schema takes both keys, and each way of writing one wrong is a
  configuration error. No entry uses either yet.
- `test/harness.test.js` holds four tests for them: neither kind is run by `--all`, a name,
  `--short` or `--scheduled`, against a launcher and a driver that are not there and a Playwright
  with no browser to start; `--list` names and counts them; and twelve ways of writing one wrong
  each give their own configuration error. `docs/testing.md` describes both keys beside `skip`,
  with placeholder entries.
- The gallery says what it is showing. Above the frame, `index.html` now names
  `ChatGPT - Paste Ready Bookmark Response` as the bookmarklet that saved every example as a
  bookmark, says that the frame shows what a reader sees on opening one of those bookmarks, and
  links the raw file to paste, the gist, the short and the repository README. Under it is a
  how-to-install: the three keystrokes, and `support/Demo-ReadyToUse.gif` showing them. The
  animation is 11 MB, which is a page nobody on a phone asked to download, so it sits behind a
  disclosure and carries `loading="lazy"`: it is fetched when a reader opens it and not before.
- The gallery lists the eight practice pages, each with the bookmarklets to try on it, and links
  their index. They are the same pages the harness runs against, so a page a reader can try is a
  page a test has already checked.
- Each example has an address of its own. Choosing one sets `#<example file name>`, opening the
  page on that address shows that example, and the link can be shared or bookmarked. A reader's
  own choice pushes one history entry, so Back returns to the example chosen before it; an
  automatic advance replaces the entry it is already on, so the slide show still adds none.
- A reader can stop the slide show. A pause and play button sits above the gallery, and any click,
  any key press and any focus elsewhere on the page stops the show as well, because each of them is
  a reader doing something the show would interrupt. A reader whose system asks for
  `prefers-reduced-motion: reduce` gets the show paused from the start, with the page saying why,
  and the button still starts it: content that moves on its own needs a way to pause it
  (WCAG 2.2.2), and paused by default is not the same as taken away.
- `test/gallery.test.js` holds seventeen more readings, which are what the work above is guarded by:
  the markup a validator and a phone need, the navigation against the frame at 1280, 1024 and 390
  pixels, Tab order through the five links with a ring on each, the frame's height against the page
  inside it, the page saying what the examples are, the practice list, `aria-current` in place of
  `data-active`, the address bar and Back through it, the pause control pressed, reduced motion, the
  install animation fetched only once a reader opens its disclosure, and that the page's own script
  raises nothing over a run that opens it, resizes it three times, walks it with Tab and clicks
  through it. The suite is 32 tests, all green. `docs/testing.md` describes each reading.

### Changed

- Two bookmarklets are deprecated and three are tested by hand. Each README entry says so on a
  line of its own above its `USE` line, the contents list carries the same word, and each
  `test-bm.json` entry holds the key, so no run reaches any of them.
  - `siteSpecific_OctoPrint_ChangeGraphImage` is deprecated: the
    [OctoPrint-CustomBackground](https://github.com/jneilliii/OctoPrint-CustomBackground) plugin
    does its job from OctoPrint itself. `docs/testing.md`'s worked example of a signed-in page on
    the reader's own network is now a placeholder entry of the same shape.
  - `siteSpecific_chatGPT_ResizePrompt` is deprecated: the site now has an expand control for the
    prompt box itself.
  - `siteSpecific_Gmail_ResizeSideBar`, `siteSpecific_Gmail_StyleSponsoredEmail` and
    `siteSpecific_gmail_ExpandLabelFolderMouseMoveEmail` are tested by hand: they work on a
    signed-in mailbox, so a person tests and updates them. Their entries keep their pages and
    steps as the record of how; Style Sponsored Email's skip is gone, as a by-hand entry takes
    none.
  - `TODO.md` closes the OctoPrint image check and the Style Sponsored Email check, takes the two
    deprecated bookmarklets out of the shorts and demo work, and leaves the Gmail shorts to the
    maintainer's own recordings.
- `index.html` is laid out with a grid, so the navigation and the frame can never be laid over each
  other. It was an absolutely positioned 15% navigation beside a floated 80% frame, which at 390
  pixels painted the frame over the right 29px of every 49px-wide navigation link and took any
  press aimed there. Below 760 pixels the navigation now stacks above the frame.
- The frame is sized from a `load` event and a `ResizeObserver` on the example's own root box, in
  place of an interval that ran every 100 ms and was cleared after 300 whether or not the example
  had arrived. The example's root box is content height and does not grow with the frame it sits
  in, which is what makes observing it safe: `documentElement.scrollHeight` does grow with the
  frame, so sizing from that and observing the result is a loop - 578px of content in a 1400px
  frame reports 1400. The height set includes the frame's own two pixels of border, since the frame
  is a border box and those two pixels otherwise come out of the viewport the example gets.
- The open example is marked with `aria-current="page"`, which a screen reader announces, in place
  of the `data-active` attribute that nothing but the style sheet ever read. Every link, and the
  pause button and the frame, draw a `:focus-visible` ring at 3:1 against both surfaces it can land
  on.
- The hover that the slide show read as a click is gone, with the inline handlers it lived in. A
  hover now does nothing, and the show is stopped by the things a reader actually does.

### Fixed

- `siteSpecific_chatGPT_NavigateAnswers.js` shows the reply. The rewrite below marked each turn's
  screen-reader heading, a one-pixel `h4` before the question, as its answer, so the page showed no
  answer at all; and it read only the turns the page had drawn and hid them with inline styles,
  which a turn the page draws again loses. It now reads the page's own marks for each turn, its
  question and its answer, with the structure reading kept as the fallback. It shows one answer
  through a stylesheet of its own keyed on those marks, so a turn drawn again is hidden or shown
  as before, and it never hides a turn's own element, which the page watches. It scrolls to reach
  the turns the page has not drawn yet, wraps at either end, holds the answer in view while the
  page settles, and follows a turn the page draws again under a new key by where it sits. The
  key it moves by no longer scrolls the conversation underneath. Its entry asserts that each
  answer is a reply, that no heading is marked, and that every other turn's reply stays hidden
  after a move each way; the waits after a key are three seconds, since a move now scrolls and
  waits for the page to draw. It passes in the maintainer's everyday browser.
- `siteSpecific_chatGPT_NavigateAnswers.js` works on ChatGPT's conversation as it is now. The page
  no longer has an `article` for each turn or an element with the id `main`, which is what the
  bookmarklet read, so it found nothing to show. It now finds each question by the block that keeps
  its line breaks, and its answer where the question's part of the conversation and the answer's
  part divide, whether the two share one element or sit side by side, and it reads the conversation
  again on every key press, so an answer that arrives later is included. One answer shows at a
  time, with its question hidden, as before; `PageDown`, `PageUp`, the toggle button and the
  instructions are unchanged. The button is styled through the CSSOM and sits at the top of the
  conversation, and a second run reuses the first run's button and key listener rather than adding
  another of each. Its entry opens the most recent conversation in the everyday browser and passes.
- `siteSpecific_chatGPT_ResizePrompt.js` works on the prompt box as it is now. The box has no id
  and sits more than ten levels inside the prompt form, so the fixed chain of parents and child
  positions the bookmarklet walked no longer reached it. It now finds the editable element in the
  prompt form, takes the nearest element around it that scrolls, and makes that box resizable from
  its corner, growing to 600px; a second run puts the box back exactly as it was. The flipped
  layout that put the drag handle on top is gone, because it also turned the scroll direction
  around, and so is the width resizing, because the prompt's width now follows its column. Checked
  in the everyday browser by setting the box to 400px: the box and the whole prompt grow with it and
  stay on screen. Its entry runs it on the chat page and passes.
- `index.html` carries the parts it was missing: `lang="en"`, a `width=device-width` viewport, a
  description, the repository's own `favicon.png`, and a `title` on the frame. The obsolete
  `frameborder` attribute is gone, which was also written with no space in front of it, so the
  parser read `src="..."frameborder="0"` as one attribute; the frame's border is CSS. The `<title>`
  and the `<h1>` read the same, "Bookmarklet Examples", where they read "Bookmarklet Examples" and
  "Bookmarklets Examples".

## [11.22.2026]

### Fixed

- The focus ring on the saved pages' table box is coloured for the surface it is actually drawn
  on. `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` carried a
  `@media (prefers-color-scheme: dark)` branch that recoloured the ring to `#58a6ff`, the blue
  meant for a dark page - but the page it writes never darkens: `body` carries
  `background: rgb(47 79 79 / 3%)`, which propagates to the canvas, so the pixels behind the box
  measure the same near-white in both schemes to within a point per channel. Read as painted
  pixels, the dark branch gave `rgb(88,166,255)` over `rgb(249,250,250)` at 2.42:1, under the 3:1
  WCAG 1.4.11 asks of a focus indicator, where the light reading gave `rgb(9,105,218)` at 4.97:1.
  The dark branch made the ring harder to see rather than easier, so it is gone and `#0969da`
  serves both schemes. A dark override belongs back only once the page itself darkens, so that the
  two move together, and the comment above the style says so.
- The same branch is out of the two `examples/` pages that carry the style,
  `chatGPT_Bookmark_Schedule.html` and `chatGPT_Bookmark_SocialMediaMarketing.html`. They hold
  their own copy of what the bookmarklet writes, so the repaired bookmarklet alone would have left
  the deployed site as it was. The other three hold no table and carry no box.
- `test:harness` no longer goes red on a loaded machine for the one test that records real video.
  "a short never holds still for two seconds" failed once and passed on an immediate re-run with
  nothing changed between them, reporting one still of 8.5 seconds where the fixture draws a second
  block five seconds in: Chromium's screencast hands over frames only as fast as it is let, and the
  page's own timer can be starved past the end of the clip, so the second block never reached the
  recording. The reading now **records the run once more before it fails**, unchanged, and only a
  second disagreement is a failure; the failure names both attempts, with the second one's own
  stack, so a reading that failed twice is told from one that failed once and passed. Nothing it
  asserts was loosened.
- The gallery's keyboard readings press a key until the box has come to rest rather than a fixed
  number of times. Chromium carries 40px a press and animates it, and a press sent while the last
  one is still animating is coalesced rather than queued: the same twenty five presses carried the
  whole 474px on one run and 160px on the next, and a single `ArrowLeft` after them moved nothing
  at all, with nothing changed between the runs. Found while adding the ring reading below, and the
  same defect as the one above read from the other side.

### Added

- Three tests in `test/gallery.test.js`, its tenth, eleventh and twelfth, which read the focus ring
  **as painted rather than as declared**: a clip of the box is shot focused and shot again with
  focus taken off it at the same scroll position, and the two are differenced inside a page of its
  own, where a canvas is the PNG decoder, so no image library joins the manifest. Only focus
  changed, so every changed pixel is the ring and what the second shot holds under those pixels is
  the page behind it, and the contrast between them has to reach 3:1. Both of the ring readings run
  on every example and width whose box is a stop, once in each colour scheme. The tenth opens the
  example on its own, with the scheme emulated on the one page, so a width costs one browser
  context however many schemes are read in it; the eleventh reads the same ring inside
  `index.html`'s frame, which is how the deployed site shows it, and splits its reading by side,
  because the frame edge is the one thing that could take a side of the ring away and a mean colour
  over the whole clip reads the same whether four sides were painted or three. Put the dark branch
  back and both fail with the measurement that found this: the ring is rgb(88,166,255) over
  rgb(249,250,250), 2.42:1. The twelfth asserts the page is painted alike in both schemes, which is
  why one `outline-color` serves both, and names itself as the reading to change if the saved page
  is ever given a real dark mode.

### Changed

- `docs/testing.md` says what each of those readings proves, and that each of the two timing-bound
  readings takes its answer from where the page comes to rest rather than from a count of presses
  or a single recording.

## [11.21.2026]

### Fixed

- The scrolling box each saved page puts a table in is a keyboard stop while it has something
  left to scroll. `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` began wrapping every
  table in `div.tableScrollPasteReady` on 11.20.2026, which stopped the article dragging
  sideways, but the box carried no `tabindex` and no `role`: Tab never landed on it, so the
  columns it held out of view could not be reached without a pointer, and nothing told a screen
  reader the box scrolls. Measured signed out, `chatGPT_Bookmark_Schedule.html` held 474px of
  its table out of view at 390px and 29px at 1280px, and
  `chatGPT_Bookmark_SocialMediaMarketing.html` 55px at 390px. The page the bookmarklet writes
  now marks each box `role="region"` with `tabindex="0"` while `scrollWidth` is over
  `clientWidth`, drops both when the table fits, names the region from the nearest heading above
  it, and re-reads on resize - the answer `test/fixtures/pages/table.html` already settled for
  the practice pages. The box takes a `:focus-visible` outline from the page's own stylesheet,
  3px of `#0969da`, which reads 4.97:1 against the page and shows the stop where Tab reaches
  it. The `prefers-color-scheme: dark` branch changes that colour alone and the page itself
  never darkens, so the dark reading is 2.42:1 - under the 3:1 WCAG 1.4.11 asks of a focus
  indicator. That branch is queued in `TODO.md`, not fixed here.
- The two `examples/` pages that hold a table, `chatGPT_Bookmark_Schedule.html` and
  `chatGPT_Bookmark_SocialMediaMarketing.html`, carry the same marking and the same focus
  outline. They hold their own copy of the style the bookmarklet writes, so the repaired
  bookmarklet alone would have left the deployed site as it was. The other three hold no table.

### Added

- Four tests in `test/gallery.test.js`, its ninth through its twelfth: a table box on an example
  is a keyboard stop only where it scrolls, Tab lands on one that scrolls and passes one whose
  table fits, the arrow keys carry the hidden columns into view and take them back out, and a
  box that scrolls is named from the nearest heading above it. The first reads the box's
  `tabIndex` and `role` from the rendered page in the pass that already measures each example
  at 1280 and 390, and asserts what `test/pages.test.js` asserts for the fixture; the other
  three press the keys, because the markup and the behaviour can part company - a box carrying
  both attributes that the page scrolls past, or that the arrow keys do not move, reads as
  repaired and is not. They fail on the page as it stood on 11.20.2026 - on `Schedule` at both
  widths and on `SocialMediaMarketing` at 390 - and pass on the repair:
  `node --test test/gallery.test.js` reads 12 of 12.

## [11.20.2026]

### Added

- `npm run test:gallery` (`test/gallery.test.js`), a fourth stage of `npm test`. `index.html` and
  the five pages it frames from `examples/` are the whole of the deployed site, and `test:pages`
  covers `test/fixtures/pages/` only, so nothing had opened either. It leaves the gallery alone
  for thirty seconds with one ordinary anchor appended to its navigation, then opens each example
  directly at 1280 and 390 pixels wide. `docs/testing.md` describes what it checks.
- A `Try these on this page` box on `test/fixtures/pages/snippet.html`, naming the two converter
  bookmarklets the page exists for. It was the one page the practice index links without a box,
  while the index tells a reader that each page it lists says what to try on it.

### Fixed

- The gallery's slide show adds no session history entry of its own. Each tick clicked a link
  whose target is the frame, and a frame navigation is an entry, so the page grew one every three
  seconds: left alone for thirty seconds it went from 2 entries to 7, and Back rewound the slide
  show instead of leaving the page. An automatic advance now replaces the frame's own location,
  and only a reader's own click pushes an entry.
- The slide show steps the five example links rather than every anchor on the page. An anchor
  without the frame as its target navigates the top level, so a link added anywhere on the page -
  a README link, a raw file link, a gist link, a short - sent a reader off the site within one
  cycle. Nothing triggered it yet, because those five links were the only anchors there.
- The five `examples/` pages each name their own subject in their title and their heading. All
  five read `ChatGPT Bookmark` and `ChatGPT Response`, so in a tab, in history and in a bookmark
  the examples could not be told apart.
- Three of the five opened on a bare `<!DOCTYPE>`, which has no name and is not a doctype, so
  they rendered in quirks mode and their box sizing was not the one their style was written
  against. All five now open on `<!DOCTYPE HTML>` and name their language.
- A table in a saved page scrolls in a box of its own instead of dragging the article sideways.
  `chatGPT_Bookmark_Schedule.html` pushed the document to 766px in a 390px viewport on its one
  table. The box is the shape `test/fixtures/pages/table.html` already uses.
- Every saved page's outline goes h1, h2, h3 with no level skipped. The sidebar byline that says
  which bookmarklet wrote the page was an `<h3>` directly below the `<h1>`.

### Changed

- `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` writes those repairs into every page it
  saves from now on: `lang` on the written `html` element, the byline as an `h2`, and each table in
  a scrolling box of its own. The box is what keeps a wide table out of the document's width; the
  `max-width: none !important` dropped from the `table` rule beside it was the property's own
  initial value restated, with nothing in that stylesheet setting a table's `max-width` for it to
  override, so it held a table at no width at all. Its gist carries the change.
- `test/fixtures/pages/table.html` no longer names `GitHub - resize repo table columns` among the
  bookmarklets to try. That one reads `location.host` for `github.com` and returns before touching
  a table anywhere else, so a reader followed the line, saw nothing happen, and was told nothing.
- `test/pages.test.js` requires the `Try these on this page` box on every page the index lists,
  read off the index rather than from a list of its own. It used to return early on a page with no
  box and then assert only that at least one page carried one, so it was green with eight boxes or
  with one.
- The pinned markdown in `test-bm.json` for `dom_Clipboard_ConvertPageToMarkdown` now holds
  `snippet.html` with its new box. The fixture changed; the expectation is as exact as it was.

### Notes

- `index.html` and the five `examples/` pages were written back with the LF line endings the
  repository holds them in. Each arrived CRLF in the working tree while its committed blob is LF,
  so keeping the working copy's endings would have reported all 164 lines of `index.html` as
  changed for the 30 that did.
- The two open issues, #4 and #11, were read against the code again and both still stand. Neither
  is touched by what changed here: #4 is about a `\u` sequence in a copied answer, and the paste
  ready bookmarklet's encoding of one did not change.
- `npm test` is green on its first three stages - harness 121 of 121, pages 17 of 17, gallery 8 of
  8 - and `test-bm.js --all` ran 54, passed 38, skipped 15 and failed 1. The failure is
  `siteSpecific_GitHub_NavigateCommitsSequentially`, and it is not a break: GitHub answers 503 for
  that entry's one commit page and serves its own error page in place of the commit, so the
  `relative-time[datetime]` the entry requires is not there to find. The repository's own page
  answers 200 at the same moment and the five other GitHub entries pass, so nothing is queued for
  it and nothing about the entry or the bookmarklet changed. It wants running again when that page
  answers.

## [11.19.2026]

### Changed

- `test-bm.js --short` never leaves a still of two seconds in a short. Where nothing on the page
  moves for longer than a second and a half, in a wait or on the result at the end, the clip
  keeps that second and a half and cuts the rest, before the 15 second cut is chosen and in both
  GIFs of a long clip. ffmpeg's `mpdecimate` tells a still from a change, so a dot or a line
  drawn on the page counts as moving and a blinking caret does not. The report names the parts
  cut as `stills`, and the printed result shows them. Demos are not made by the harness and keep
  their own ending. `docs/testing.md` and `--help` say so.

### Fixed

- A short recorded through a sign-in launcher is the entry's own page again. A launcher's
  persistent context opens a blank page of its own before the harness opens the entry's, and
  records both; the harness took whichever video file came first by name, so the short could be
  the blank page. It now takes the file Playwright named for the entry's page, and failing that
  the largest.

### Notes

- `siteSpecific_GoogleMaps_CustomMearsureDistance` has a new short, recorded on the Grand Canyon:
  the canyon measured rim to rim at its widest, a triangle area, and a path down the river. The
  README links it in place of the first short. The bookmarklet did not change.
- A second run the same day built nothing: the queue was empty but for the standing `- No site`
  directive, so it tested what exists and planned the next batch instead. `npm test` is green on
  all three stages - harness 121 of 121, pages 16 of 16, and `test-bm.js --all` 54 run, 39
  passed, 0 failed, 15 skipped, every skip a missing sign-in or the everyday driver rather than a
  fault. Gists are 54 OK with no drift, and `verify` reports 54 entries and 0 errors. The two
  open issues, #4 and #11, were read against the code again and both still stand. No bookmarklet,
  test or document changed; `## Current` now holds the five `index.html` gallery items from
  `## Improve GitHub Pages Site`.

## [11.18.2026]

### Fixed

- Two `test-bm.js` runs that start in the same second no longer share a results folder. A run's
  folder is named for the second it started, and two runs often start inside one second, as the
  harness's own suite does, so the second run wrote into the first one's folder and a passing run
  could be read as holding the other run's `failure.md`. The folder is now claimed when it is
  made: the first run keeps `<YYYY-MM-DD_HHMMSS>`, and a later run in that second takes `-2`,
  then `-3` and so on. `docs/testing.md` and `--help` say so.
- `siteSpecific_GoogleMaps_CustomMearsureDistance` finds the map's scale label again. The label
  is now a `label` with the class `U5ELMd` rather than an element with that id, so the
  bookmarklet reported no scale bar and added nothing. It now reads the label by its class when
  no element has the id. Its entry passes in the maintainer's everyday browser, on the map at
  `-34.397, 150.644`, zoom 8: a right-click, "Measure distance" and a second point by the
  computer's own mouse, then the bookmarklet's button, its own two points, and a line whose
  distance is within ten percent of the map's own. The entry's `requires` names the label by its
  class, as the bookmarklet now reads it, and its `skip` and its item in
  `## User - Resolve Test Procedures` are gone.

### Added

- `test-bm.js` runs an entry with `"drive": "everyday"` in the maintainer's everyday browser, for
  a site that answers an automated browser with a bot check or a page only the maintainer's own
  profile shows. The harness never reaches that browser itself: it hands the entry to the driver
  module `_TEST_BM_EVERYDAY_DRIVER` names, an absolute path outside the repository, the way an
  entry with `auth` reaches its sign-in through the launcher. Without a driver the entry is a
  skip, so `npm test` and the scheduled run are unchanged. The report keeps only the driver's
  verdict, its own reason, which input each step sent and how many real runs it made, so nothing
  a page showed reaches it. An everyday entry is never scheduled, takes no auth, captures nothing,
  grants no permissions, names no network, opens a site's own https page, answers no prompt, and
  presses no key that submits. `"personal": true` keeps a page that shows what the account holds
  to selectors, counts and states, and `signedIn` names what only the signed-in page has.
- Step kinds for any entry: a `bookmarklet` step runs another bookmarklet first in the same page,
  checked and judged as the entry's own; `hover`; a click's `button`, and `withText` and `at` on a
  click or a hover; an expect on `storage`, counting the keys a bookmarklet added, matching their
  values and removing them, without a key's name or value leaving the page; and a clipboard
  expect against an element's own value, or by how the value reads. `--help` and
  `test-bm.schema.json` say so.

### Testing

- Eight entries that skipped now pass, and their items left `## User - Resolve Test Procedures`.
  No bookmarklet changed.
  - `siteSpecific_YouTube_ShortHoverTitle` runs in the harness's own browser, on a public short's
    own page, which serves the shorts overlay signed out: a hover over the title shows the
    tooltip and empties the title's `title`, and moving away takes both back.
  - Seven run in the maintainer's everyday browser, `"drive": "everyday"`. The four that met a
    bot check in the automated browser: Amazon's video player gets every big play button hidden
    by the bookmarklet's own inline style, and a second run changes nothing, with a hover that
    scrolls the video into view as the only pointer step; both Stack Overflow anchor link
    bookmarklets give every answer one link and none two, and the Copy one puts the clicked
    link's own address on the clipboard; and the Google AI answer bookmarklet's alert is
    accepted, after which the clipboard holds a bookmarklet that starts `javascript:`. The three
    on signed-in YouTube pages are checked by selectors, counts and states only, never by what
    the page holds: the history's shorts shelves are hidden; the history search hides every row
    for a placeholder word typed into its box, never submitted, and hides none once the box is
    cleared; and the subscriptions toggle adds one button at the top of the guide's section,
    turns it on and off, and adds no second button on a second run.
- `siteSpecific_YouTube_SavePageNotesToLocalStorage` passes in the harness's own browser and is
  scheduled again, on the video YouTube's IFrame Player API documentation uses. A bookmarklet
  step runs `siteSpecific_YouTube_TakeVideoNotes` first, `Sample Note: a placeholder for the
  test` goes into its notebox, and this one saves it: its alert is accepted, one new
  `localStorage` key holds the note, and the key is removed again. Its item left
  `## User - Resolve Test Procedures`.
- `siteSpecific_GoogleMaps_CustomMearsureDistance` keeps its `skip` and its item, with the reason
  brought up to date. The map does show its scale bar, in the maintainer's everyday browser and
  in an automated one, but the scale label is now a `label` with the class `U5ELMd` rather than
  the element with that id the bookmarklet reads, so the bookmarklet reports no scale bar. The
  page does run its inline script. The entry already holds the whole everyday run for when the
  bookmarklet reads the class: the map at `-34.397, 150.644`, zoom 8, the right-click,
  "Measure distance" and a second point by the computer's own mouse, the bookmarklet's own two
  points, and its distance checked against the map's.
- `siteSpecific_chatGPT_SearchChatHistory` passes in the maintainer's everyday browser, on a page
  that shows what the account holds, checked by selectors, counts and states only: its search
  bar, box and clear button are added once, a placeholder word typed into its box, never
  submitted, hides every chat link, and clearing the box hides none. Its item left
  `## User - Resolve Test Procedures`.
- Five more ChatGPT and Gmail entries now name the everyday browser, and keep a `skip` and their
  items with the reason brought up to date. The chat page no longer has the `#main` and
  `#prompt-textarea` that `siteSpecific_chatGPT_NavigateAnswers` and
  `siteSpecific_chatGPT_ResizePrompt` read. `siteSpecific_Gmail_ResizeSideBar` held every check,
  but the everyday route could not close its mail tab afterwards, so the two other mail
  bookmarklets were not run after it. `siteSpecific_chatGPT_PasteReadyBookmarkResponse` keeps its
  signed-in entry: its result is on the clipboard, which a run on such a page never reads, and
  its check needs a prompt, which no run sends. No bookmarklet changed.
- The three Gmail entries keep their `skip` and their items, with the reason brought up to date.
  A second run of `siteSpecific_Gmail_ResizeSideBar` in the everyday browser stopped before any
  step: the mail tab it opened never reached the everyday route, which finds its tab by a mark at
  the end of the page's address, the part the mail page uses for its own views. Nothing was done
  in that tab, and the two other mail bookmarklets were not run after it. No bookmarklet changed.
- Two Gmail entries now pass in the maintainer's everyday browser, checked by selectors, counts
  and states only, and their `skip` and their items are gone. The everyday route held each mail
  tab it opened and closed it through the page. `siteSpecific_Gmail_ResizeSideBar` adds its
  resize handle to the label sidebar, the handle takes its hover colour under a hover, and a
  second run adds no second handle. `siteSpecific_gmail_ExpandLabelFolderMouseMoveEmail` turns on
  with its notice, and a second run turns it off without adding a second notice.
  `siteSpecific_Gmail_StyleSponsoredEmail` keeps its `skip` and its item: no row was marked
  within ten seconds of its run, and the run reads no mail, so whether the inbox showed a
  sponsored row then is not known. The OctoPrint item records that the test image's address still
  answers 404. No bookmarklet changed.
- `siteSpecific_chatGPT_NavigateAnswers` and `siteSpecific_chatGPT_ResizePrompt` keep their
  `skip` and their items, with the reason brought up to date from probes in the maintainer's
  everyday browser that counted candidate selectors only, read no text and typed nothing. A
  conversation's page has a `main` element without the id `main`, and its turns carry no
  `article` or other turn marker, only class names that counts could not tie to one element per
  turn. The prompt box is an editable element with no id, deep inside the prompt form, whose
  first two children, which `ResizePrompt` reads by position, are a hidden element and an empty
  one. Neither bookmarklet changed: a fix for either needs markup that selector counts alone do
  not pin down.
- Sixteen tests in `test/harness.test.js`, which now runs 120, for the everyday contract and the
  new step kinds, on a stub driver that opens nothing. Every run there clears
  `_TEST_BM_EVERYDAY_DRIVER`, as it does `TEST_BM_AUTH_LAUNCHER`.
- One test in `test/harness.test.js` for the results folder. Two runs start at once, one failing
  and one passing, with every second they could start in already holding a folder. Each writes a
  numbered folder of its own, holding only its own report; the passing run's holds no
  `failure.md`; and the folders that were there first are left as they were.

### Notes

- The ten bookmarklets whose entries skip moved to `## User - Resolve Test Procedures`, one item
  each, and no bookmarklet or entry changed. Four meet a bot check in the automated browser
  (Amazon, both Stack Overflow anchor link bookmarklets and the Google AI answer bookmarklet),
  four need a signed-in YouTube page (the history, the history search, the subscriptions toggle
  and the shorts hover title), one saves notes from a notebox another bookmarklet adds, and the
  Google Maps one measures against a scale bar the automated browser is not shown. Each item
  names the maintainer's everyday browser, opened by
  [to-explorer](https://github.com/jhauga/to-explorer), as the first way to resolve it, and each
  entry keeps its `skip` until it passes.

## [11.16.2026]

### Fixed

- `siteSpecific_YouTube_ShowShortReleaseDate.js` shows the release date on a first visit to
  YouTube (#14). Its first run alerted that it was not initialized and reloaded the page, so a
  first visit drew nothing until the bookmarklet was run again. A first visit does serve the
  short's description, a moment after the page, so the bookmarklet now waits for the description
  and the action bar, checking every half second for up to ten seconds, and leaves the short
  alone if they never come rather than throwing on a description that is not there. In a narrow
  window, where the action bar sits on the video, the date was drawn under the bar's first
  button; it is now lifted above the bar. A second run reuses the one interval that follows the
  shorts scrolled to rather than starting another, and turning the instructions alert off no
  longer turns the rest of the bookmarklet off with it. The README entry's notes say so, and it
  links the bookmarklet's first short.

### Added

- `test-bm.js --short` records every entry it reaches as the bookmarklet's own recording. The
  viewport is 648x648, so the page itself lays out square rather than a wide page being squeezed
  into the frame afterwards, and the clip is cut from a little before the bookmarklet ran through
  to its result being on screen, written as a 10 fps GIF of under ten seconds. It goes to the
  folder `TEST_BM_SHORTS_DIR` names, `test-results/shorts/` without one, as `<name>.gif`. A
  recording already there is kept and the entry is not recorded again for it, because the hand
  recordings come first. Only an entry that passed gets one: a recording of a bookmarklet that
  did not work is not the bookmarklet's recording, and the note on the result says so when that
  is why there is none. ffmpeg on the `PATH` writes the GIF, with the same palette filter the
  video work here already uses, so a recording made this way matches one made by hand; a machine
  without ffmpeg leaves every short owed rather than failing the run. A GIF ffmpeg did not write
  is taken away again, and the note carries ffmpeg's own reason: ffmpeg opens the output before it
  encodes, and a clip starting past the end of the recording writes no bytes at all without
  exiting on it, so an attempt left where it fell would be read by every run after it as the
  recording that is already there and the short would be owed for good.
- An entry with `auth` records its short through the sign-in launcher, which is handed
  `recordVideo` with the same `{ dir, size }` a context takes. A launcher is free to ignore it,
  and then it records nothing and the short is left to be made by hand. The recording stays on
  the machine until it has been reviewed, and nothing about the page goes into the report with
  it: the entry still captures nothing at all, and the timeline the clip is cut by stays in
  memory. Picking the file up needed a second route as well, because `video.saveAs` asks the
  browser for it and a launcher's persistent context closes its browser with itself, so the
  folder it recorded into is read when the ask comes back closed.
- A run that failed writes `failure.md` beside `report.json`, holding what an agent needs to act
  on each failure without running anything again. For a missing `requires` selector that is the
  selector, the lines of the formatted file that use it, and an ARIA snapshot and trimmed markup
  of the longest part of the selector still on the page, which is where the missing thing was
  expected. For a bookmarklet that threw it is the message and the lines of the formatted file
  its stack came from, innermost first, read back through the one line the browser ran. A file
  holding a percent escape says that instead, because the URL field changed the code before it
  ran and the columns no longer name lines. A run of a single bookmarklet writes the file too,
  since a run of one is how an agent checks the fix it has just made.
- An entry with `auth` gives that report the selector or the message and the bookmarklet's own
  lines, and nothing else: no ARIA snapshot, no markup, no frames from the page, no screenshot.
  Everything left out is the signed-in page's content, which is the one thing this harness never
  writes down.
- `AGENTS.md` carries the triage procedure for a failing test: read `failure.md`, open the page
  with whatever browser tool the assistant has and a browser signed in to nothing, find what
  replaced what is missing, make the smallest edit to the bookmarklet, and run
  `node test-bm.js <name>` for the verdict. It restates the authoring conventions, which until
  now were only in a file the ignore rules hide, and states the hard limits: never sign in, never
  run `--sign-in`, never attach a browser tool to a browser that is signed in to anything, never
  submit a form or send a message, and never loosen a `test-bm.json` expectation to make a test
  pass. Codex and GitHub Copilot's coding agent read `AGENTS.md` directly, and the new
  `CLAUDE.md`, whose only content is `@AGENTS.md`, points Claude Code at the same file.
- A `run` step can set variables first: `{ "run": { "set": { "img": "pic.png" } } }` runs the
  bookmarklet with the one `var img = "..."` its file declares holding the entry's value instead,
  which is the edit a reader makes to a bookmarklet that asks to be changed before it is saved.
  The value goes in as a string literal, written with `JSON.stringify`, so a quote or a backslash
  in it stays inside the string, and the file so changed is checked again the way the file itself
  is: both joins, the URL field's decoding, and nothing that could pass for malicious. A name the
  file does not declare exactly once as `var <name> = "<string>"`, a value that is not a string,
  `set` anywhere but inside `run`, or a value that fails that check is a configuration error
  before any browser starts. The report notes each variable set and its value, and a line an
  error is read back to is a line of the file with the value in, however much longer the value
  made its line. `{ "run": true }` still runs the file as it is, nothing is ever written back to
  the file, and `test-bm.schema.json` takes either form.
- `TODO.md` has a `## User - Resolve Test Procedures` section, after `## Test Configurations`, for
  tests the automated runs could not finish. Each item opens with `**User todo**:`, so no run
  works it, says in general terms what was not tested and why, and proposes one to three ways an
  automated procedure could resolve it without handling a password.
- A `viewport` step sizes the page for the steps after it:
  `{ "viewport": { "width": 1024, "height": 720 } }` lays the page out at 1024x720 from there on,
  until another viewport step, and the entry's own size, 1280x720 or 648x648 for a short, comes
  back when the entry ends, which the timeline records. It is how `clear`, the one expectation
  that reads geometry, is asked at a width a reader's window has and the default does not. Width
  and height are whole pixels from 100 to 4000, and anything else is a configuration error before
  any browser starts. `test-bm.schema.json` takes the step.
- `test-bm.js --browser firefox` runs the same checks in Firefox, the second most likely place a
  reader pastes a bookmarklet. Chromium stays the default, and the only engine `--scheduled`
  uses unless an entry asks for more with `"browsers": ["chromium", "firefox"]`; `--browser`
  names one engine for every entry, whatever an entry asks for. Firefox keeps the `sourceURL` tag,
  so the bookmarklet's errors are told apart from the page's and read back to their line as in
  Chromium. It does not say which code started a request, so there every request to another host
  after the bookmarklet first ran is judged as the bookmarklet's, which judges more than Chromium
  does and never less; an entry that counts requests is a skip in Firefox for the same reason, and
  so is an entry with `auth`, whose launcher gives a Chromium browser and is never loaded for a
  Firefox run. Firefox has no `clipboard-read` or `clipboard-write` permission, its clipboard
  being open to the page already, so those two are left out with a note and the rest are granted.
  A short is recorded in Chromium only, so `--short` takes no other engine. Firefox is a local
  install step, `npx playwright install firefox`, which the scheduled set never runs, and a run
  that needs it where it is missing stops with exit 2 naming that step.
- `docs/testing.md`, how to install, run, configure and schedule `test-bm.js`. It covers the
  install (`npm install`, then `npx playwright install chromium`, with Firefox and ffmpeg as the
  two optional steps), running one bookmarklet, all of them and the scheduled set, every flag,
  the exit codes, and where `report.json`, `summary.txt`, `failure.md`, captures and shorts are
  written. Its configuration reference gives every entry property, step and expectation with an
  example, what the default safe run does and does not prove, fixture pages, a url held in an
  environment variable, and `auth`, `signedIn` and `TEST_BM_AUTH_LAUNCHER` by contract alone:
  what a launcher's `launch`, `signIn` and `signInState` take and return, that an entry with no
  sign-in is a skip, and that no sign-in or session is ever in the repository. A scheduling
  section gives a Windows Task Scheduler command and a cron line for `--scheduled`, with a
  wrapper for each that sends a notification keyed on the exit code. It then says what each of
  the three stages `npm test` runs proves, including that `test/pages.test.js` is what keeps the
  practice pages fit to show a reader, and ends with a section pointing at `AGENTS.md` for
  Claude Code, Codex and GitHub Copilot. Every example uses placeholder names and `example.com`
  or `example.org`.
- `docs/testing.md` says how an assistant gets a browser, and the README links the file. Its
  new last section registers the Playwright MCP server (`@playwright/mcp`) with `--isolated`, so
  the browser an assistant opens keeps its profile in memory and starts signed in to nothing. It
  rules out the two modes that attach the server to a browser already running, and links Claude
  Code's, VS Code's and Codex's own documentation for where each registers MCP servers rather
  than restating a path that changes between releases. The configuration reference gains a
  signed-in page on the reader's own network, with the OctoPrint entry as its example: the
  address comes from `OCTOPRINT_URL`, the sign-in from `auth`, and no printer needs to be
  connected. The AI-assisted section now says which GitHub Copilot surfaces read `AGENTS.md`
  directly (its cloud agent, formerly its coding agent, Copilot CLI and Copilot Chat in VS
  Code), with each tool's documentation linked. The README's intro ends with a Testing
  paragraph linking `docs/testing.md`.

### Changed

- `test-bm.js --short` records up to thirty seconds rather than under ten, because a short may now
  run that long. A clip over fifteen seconds is written twice: `<name>_Full.gif`, the whole clip,
  and `<name>.gif`, its 15 second cut, which is the short posted with its GIF, since a GIF runs
  fifteen seconds at most where it is posted. The cut keeps only the moments that show the
  bookmarklet's use: each time it runs, and each `click`, `fill`, `press` or `select` step a
  reader would make. Each moment keeps the clip's lead before it and an even share of fifteen
  seconds after it, never less than two, and the clip's end keeps the same share before it,
  because that is the result on screen. Parts that overlap are joined, and the waits, checks and
  set-up steps between them are dropped; a cut still over fifteen seconds is left for the render
  to time-stretch. The result's `short` names both files and their lengths, the parts the cut
  keeps as `keep`, in seconds of the whole clip, and what each was kept for as `moments`, except
  for an entry with `auth`, whose steps stay in memory as its timeline does. A cut that could not
  be written takes the whole clip away with it, so the next run records both. A clip of fifteen
  seconds or less is one GIF, as before.
- `TODO.md` `## Short Videos` describes a short as its essential use in up to thirty seconds, with
  a 15 second cut when it runs longer, and points to the maintainer's local notes for how a short
  is made and posted.
- `OctoPrint - Change Graph Image` carries its demo in a video block, in place of the
  `<!-- PASTE VIDEO HERE -->` comment below its gist paragraph, rather than in a paragraph of its
  own above it. The link is the one that was already there. Its short line sits commented out
  until the short exists, which is how the entry waits for one.
- An entry's timeline ends with `the result is on screen`, the moment its steps are done and the
  page has settled. It is what a short's clip is cut to, and it is also the offset a capture was
  missing: the timeline said where every step started and nothing said where the entry's work
  ended.
- The `siteSpecific_OctoPrint_ChangeGraphImage` entry signs in through `"auth": "octoprint"`,
  with `"signedIn": "#tabs"`, the tab bar of OctoPrint's main page. OctoPrint with access control
  on sends a signed-out browser to its separate `/login/` page, which has no `#tabs`, so the
  selector tells the two apart without leaning on `#temperature-graph`, which stays the entry's
  `requires`. Run against a live OctoPrint at the address `OCTOPRINT_URL` names, the published
  path passes: the graph's image is removed and the `expect` on its style holds as it was. The
  entry stays `scheduled: false`, and no printer needs to be connected.
- The same entry runs the optional path as well: a second `run` sets `img` to
  `test-bm-graph.png`, and an `expect` finds `/static/webassets/img/test-bm-graph.png` in the
  graph's style. That proves the address the bookmarklet writes, and not that the image is on the
  host, where no file has been placed and its address answers 404. Whether a placed file is
  served and shown is the first item under `## User - Resolve Test Procedures`.
- The README's `OctoPrint - Change Graph Image` entry says it was tested on OctoPrint 1.11.5 via
  OctoPi OS, what each path showed, that no printer needs to be connected, and how to open the
  page, in place of saying it had not been tested on OctoPi OS.
- The `siteSpecific_GitHub_ShowFileSize` entry asserts `clear` at 1024 as well as at the default,
  on the folder page with the API refusing, which is the state and the width the heading
  collision of 11.15.2026 lived at. The bookmarklet passes it. The copy from before that day's
  fix fails the same check, its heading painting 49px of text past its own box over GitHub's
  `Last commit message`, so the check is one that would have caught it.
- Each result in `report.json` names the engine it ran in, `browser` is the engine the run was
  asked for, and `browsers` lists every engine an entry ran in. `summary.txt`, the printed lines
  and `failure.md` mark a result from an engine other than Chromium with the engine's name.
- The README's `YouTube - Show Short Release Date` entry links a new short. The first one was
  recorded on a page that showed another bookmarklet's short, so its frames named that
  bookmarklet and only the date belonged to this one. Every short now matches the bookmarklet it
  is named for: the new one is recorded on the same page dressed with placeholders, its title,
  channel and playing video included, so nothing in it names another bookmarklet, and the date is
  on screen for most of the clip. Its GIF is posted with the new short as its source.

### Testing

- Two tests in the `--short` section of `test/harness.test.js`, which now runs 103. An entry
  that runs past thirty seconds stops at thirty; its whole clip and its cut are both GIFs; the cut
  keeps the run, the click and the end and drops both waits; and ffmpeg's own count of each GIF's
  frames agrees with the length the report gives it. A signed-in entry's cut is reported as
  seconds only, with no moments. The test that checked a short under ten seconds checks thirty at
  most, and that a clip of fifteen seconds or less is one GIF and no cut.

- Twelve tests in two new sections of `test/harness.test.js`, which now runs 101. Four cover the
  `viewport` step, through a bookmarklet that writes the size of the window it ran in onto the
  page: a step holds for every step after it until another one changes it; the entry's own size
  comes back when it ends, and the next entry meets the default; a column sized by the window
  passes `clear` at 1280 and fails it after a step to 1024; and a size that is not a width and a
  height of whole pixels is refused. Eight cover the engines: `--browser` takes only `chromium`
  or `firefox`, and neither `--sign-in` nor `--short` takes another engine; `browsers` takes
  known engines once each, and only `chromium` for an entry with `auth`; an engine Playwright
  has no build of stops the run before any entry, naming the install step; and, where Firefox is
  installed, a run in Firefox passes, reads a throw back to its line and says so in every report,
  an entry asking for both engines runs in both while the rest run in Chromium alone, a request
  to a host the entry does not name fails while a named one passes and a count of requests is a
  skip, an entry with `auth` is a skip that never loads the launcher, and the clipboard works
  with its two permissions left out. The five that need Firefox skip themselves with a reason
  where it is not installed.

- Ten tests in a new section of `test/harness.test.js`, which now runs 89, cover a `run` that
  sets variables, each through a bookmarklet of its own that asks to be edited. A set value is
  what the run uses, and a plain run before and after it still runs the file as it is; a value
  holding quotes, a backslash and a comment's end stays one string; and a bookmarklet that throws
  with a long value set is read back to the line it threw at, which the columns of the file as
  it stands would place a line too low. Seven are refused before any browser starts: a name the
  file never declares, one it declares twice, one it declares as something other than a string,
  a value that is not a string, `set` outside a `run`, a `run` that is neither `true` nor an
  object holding `set`, and a value that would make the file unsafe.

- Eleven tests in `test/harness.test.js`, which now runs 79. Five cover `--short`: a passing entry
  writes a GIF at 648x648 and reports it under ten seconds at 10 fps, asserted against a
  bookmarklet that writes the viewport it ran in onto the page rather than against the flag's
  word for it; a recording already on disk comes back byte for byte unchanged; a failing entry
  writes nothing at all; an entry with `auth` records through the stub launcher, which passes
  `recordVideo` on as a real launcher would, and comes back marked as waiting to be reviewed; and
  a GIF ffmpeg did not write leaves the folder empty, run against a launcher that plants a one
  second recording the clip starts past the end of. The three that need a GIF skip themselves with
  a reason where ffmpeg is not on the `PATH`, because a tool the harness is right not to require
  should not fail a suite.
- Six cover `failure.md`: a failing run writes one section per failing bookmarklet; a thrown error
  is written up with its message and the line of the formatted file it threw at; a missing
  `requires` selector is written up with the line that uses it, the region it was expected in and
  that region's markup; an entry with `auth` gives the selector and its own lines and neither a
  region nor a screenshot; a run of one failing bookmarklet writes the file as well; and a run
  that fails nothing writes none.
- `siteSpecific_YouTube_ShowShortReleaseDate`'s entry runs on one of the maintainer's own shorts,
  rather than skipping on an ordinary video the shorts player sends to the watch page. A fresh
  browser is a first visit every time, so the entry is the first visit check: it requires the
  action bar and the description, runs the bookmarklet, waits for the date and expects it, then
  runs it again and expects one date, not two. It failed on the unchanged file, which reloaded
  the page, and passes on the fixed one.

### Notes

- The three open GitHub issues were read against the code again and all three still stand. The
  backslash is doubled on one encoding path only, and the short-date bookmarklet still has
  nothing that reads a viewer discretion notice. Each is filed under `### From the Open Issues`
  in `TODO.md` with its issue link, so none was closed.
- A line of the bookmarklet that merely names a tag from the selector is not reported as using
  it. `div.listing` would otherwise point at every `createElement("div")` in the file and say
  nothing about the listing, so a tag name is read only where the selector names nothing else.
- Two of the open issues moved to `## User - Resolve Test Procedures` in `TODO.md`, each with
  ways an automated run could resolve it, and neither was closed. No short behind a viewer
  discretion notice could be reached signed out (#11), and the `\u` case (#4) is confirmed by a
  signed-in run, which found the site signed out.
- Six more bookmarklets moved to `## User - Resolve Test Procedures`, one item each, and no
  bookmarklet or entry changed. Run without a sign-in, the ChatGPT entries met the site's bot
  check before any page loaded, and a guest has no chat history for
  `siteSpecific_chatGPT_SearchChatHistory` to search. The Gmail site has no guest mode. A fixture
  page built from the markup `siteSpecific_chatGPT_PasteReadyBookmarkResponse.js` reads, with
  placeholder answers holding `\u` in plain text, inline code and a code block, shows that the
  file as it stands escapes the backslash on both of its encoding paths. The bookmarklet it
  copies parses and shows each `\u` as written, and a copy of the file without its plain-text
  escape fails with the error #4 reports. #4 stays open until the site's own markup is checked.

## [11.15.2026]

### Fixed

- `siteSpecific_GitHub_ShowFileSize.js` types its `Size` heading only where GitHub left the
  header row untyped. The four properties the heading took on 11.14.2026 are right for the
  repository root, where the row is served at `font-size: 0` and nothing in it is drawn, and wrong
  everywhere else: a folder page is served at `font-size: 12px; line-height: 18px`, its own three
  headings paint real text, and the heading was already visible there. The `white-space: nowrap`
  stopped it wrapping inside its own cell, so with the API refusing `Size (rate limited)` ran out
  of a 92.50px cell and over `Last commit message` by 7.48px at 1280 wide, 20.30px at 1152 and
  33.09px at 1024, coming clear only at 1366 and wider. The heading now reads the computed
  `font-size` of the row it is going into and sets its own type when that reads `0px`, and not
  otherwise. The root keeps exactly what it gained; a folder page keeps the wrapped two-line
  heading it had before, which covered nothing at any width.
- The README's video blocks carry no `<details>` and no `<summary>`. The entry splitter reads a
  `<summary>` as the name of the file an entry is for, so each of the three entries with a video
  reported both `has 0 entries, expected 1` and `entry names a missing file: Show Details`, and
  `verify` ended `54 entries, 6 error(s)` on a README nobody had touched, with two more errors due
  for every short posted. The `<details>` wrapper was taken out of every entry in an earlier
  migration, which still rejects one left behind, so the block now reads inline the way the gist
  paragraph above it does. `verify` ends with no errors.

### Added

- An `expect` in `test-bm.json` takes `clear`, the first expectation here that reads geometry: the
  element's painted text stays inside its own border box, and where it runs past, nothing under
  the overflow paints text of its own. Every other expectation is satisfied by an element painting
  its text straight over the element beside it, which is how the heading above passed for a day
  while covering GitHub's own. Text is measured as glyph runs through `Range.getClientRects`
  rather than as element boxes, and what an overflow lands on is read with `elementFromPoint`,
  because the overflow alone cannot tell the two pages apart: the 26px at the repository root
  falls on a cell painting nothing and is no defect at all. A pixel of overlap is a rounding edge,
  as it already is for the overlays `test/pages.test.js` measures. The failure names what is
  covered, by how much, and how much of its width the box holds.

### Testing

- The `siteSpecific_GitHub_ShowFileSize` entry reaches a folder page with the API refusing and
  asserts the heading is `clear` there, at the 1280 viewport the harness runs. The assertion fails
  on the file as it stood - `paints 23.48px of text past its own box, over span by 7x16 ("Last
  commit message")` - and passes on the fix, checked both ways before it was kept. A second
  `clear` pins the repository root in the same state, where the heading runs past its own cell by
  more and covers nothing, which is the distinction the expectation exists to draw.
- `test/fixtures/pages/self-test-overflow.html` holds one heading per state `clear` has to tell
  apart: text that fits its cell, text that runs out of it over a heading painting its own words,
  the same overflow over a heading served at `font-size: 0`, and a heading with no text at all.
  The two overflowing cases are identical but for what they land on. It is a page for the harness
  rather than one a reader is shown, as `self-test-noisy.html` is, so the nine practice pages
  `test/pages.test.js` measures are unchanged.

### Notes

- The three open GitHub issues were read against the code again and all three still stand: the
  backslash is doubled on one encoding path only, and the short-date bookmarklet has nothing that
  reads the viewer discretion notice. Each is already filed under `### From the Open Issues` in
  `TODO.md` with its issue link, so none was closed.

## [11.14.2026]

### Fixed

- `siteSpecific_GitHub_ShowFileSize.js` puts its `Size` heading on screen at the repository
  root. The heading has carried its text in the DOM and in the accessibility tree since it was
  added, and at the root has never been visible to anyone looking at the page: the header row
  GitHub serves there sets `font-size: 0` and `line-height: 0`, and the inserted `th` inherited
  both, measuring 90x0 exactly as GitHub's own `Name`, `Last commit message` and `Last commit
  date` headings do on that page. GitHub keeps that row for assistive technology and draws the
  commit bar where a visible header would go, so nothing in it was ever drawn. The cost was the
  one state where the heading is the only explanation on the page: with the API refusing, a
  reader met empty cells in an unnamed gutter and no reason anywhere, which is the unexplained
  blank column the heading was written to remove, reached by a different road. The heading now
  sets its own `font-size`, `line-height` and `color` through the CSSOM, and holds to one line -
  `Size (rate limited)` is wider than the tenth of the table the column takes, and left to wrap
  it broke in two and read as two things. Held to one line it runs over the headings either side
  of it, which at the root are the blank ones GitHub draws nothing in. The row is as tall as its
  tallest cell, so the heading brings the row with it at the height GitHub's own listings use,
  and the cells beside it are untouched. A screen reader announced the column correctly
  throughout; only the visual side was missing.

### Testing

- The `siteSpecific_GitHub_ShowFileSize` entry asserts the heading is `visible`, in both of the
  header's text states at the repository root, rather than only that its text is right. `wait`
  and `expect ... text` both run against an attached node, and a zero-height node is attached,
  which is why the entry passed for as long as the heading was invisible. Playwright's visible
  state counts a zero-height box as hidden, so the new assertion fails on the file as it stood
  and passes on the fix - checked both ways before it was kept. The entry's later steps reach a
  folder page and the root again, and assert the heading is there without asserting it is
  visible; no expectation the harness has reads geometry, so nothing in the suite pins where the
  heading's text lands.

### Notes

- A folder page is not served the way the root is, and the entry above describes the root only.
  There GitHub draws its own header row at `font-size: 12px; line-height: 18px`, its three
  headings paint real text, and the heading was already visible before this change. The
  `white-space: nowrap` that holds the heading to one line stops it wrapping inside its own
  cell, so with the API refusing `Size (rate limited)` runs over `Last commit message` at every
  width under 1366px. Found by the same verification, with its measurements, and queued under
  `### UI/UX Override - ShowFileSize heading on folder pages` in `TODO.md`.

## [11.13.2026]

### Fixed

- `siteSpecific_GitHub_ShowFileSize.js` writes nothing into a table listing that has no header
  row. The column was decided by whether there was a listing to write into, and a listing with
  rows is not the same thing as a listing with somewhere to put the heading - GitHub serves the
  difference for a moment every time it replaces a listing after a soft navigation. With the API
  refusing, that wrote 54 empty cells under no heading at all, which is the unexplained blank
  column the `Size (rate limited)` heading was added to remove, back in the one state with no
  heading to put it in. With the API answering, the sizes went in and the heading did not, so the
  check that decides whether the column still wants writing kept returning yes and the whole
  backing-off budget was spent re-fetching a directory already on the page and already written
  into: seven requests in ninety-two seconds, out of the sixty an hour a reader who is not signed
  in has. Both now read the header row as well as the rows, and neither writes nor asks where
  there is nothing an answer could be written into.
- The heading comes back on its own when the header row returns, which it did not before. Running
  out of waits set the next attempt to never, so a header row put back after that left the sizes
  on the page under no heading until the address changed. The listing the API last gave is now
  kept until the address changes, and the poll writes the column from it the moment there is a
  header row to write into - ahead of asking for anything, so it is reached however long the waits
  have run on, and without a request, because the heading is the one thing no answer carries. A
  refusal puts its reason back the same way.

### Added

- `test-bm.js` takes an `answer` step, which answers every request to a host from the entry
  itself, with a status, a content type and a body, until a later step hands the host back with
  `pass`. A state only a site's own server produces - the 403 an API gives past its hourly limit -
  is now something a run can put a page in, rather than something a person has to wait for. The
  answer carries `access-control-allow-origin`, as a site's own API does, so it reaches the
  bookmarklet's own code instead of being refused by the browser first, which would leave every
  status reading to the bookmarklet as a request that never arrived.
- `test-bm.js` takes `detach` and `attach` steps, which take the elements a selector matches off
  the page and put them back where they came from, so a listing a site replaces for a moment is
  held in that state long enough to assert against. The nodes are held in a handle rather than
  anywhere on the page, so nothing the harness does reaches the page's own scope: the bookmarklet
  meets a page that lost something, which is what it meets on a site. `as` names what was taken,
  for an entry that detaches more than one thing.
- `test-bm.js` takes `expect` on `requests`, a count of what the bookmarklet sent to a host since
  the last count of the same host, with `atMost` for a bound rather than an exact number. A
  directory change costing one request rather than seven is a thing no selector on the page can
  show, and it was the half of the defect above that nothing could have failed on. A name standing
  for subdomains counts every host it stands for, as the entry's `network` and an `answer` step
  both read one.
- Nothing in any of that loosens what a bookmarklet may reach. A host an entry answers is still
  named in its `network` with the reason, and answering one the entry does not name is a
  configuration error before any browser starts. The requests are still watched, still counted and
  still judged by where they went.
- The entry for `siteSpecific_GitHub_ShowFileSize` asserts the four states the fix is about: no
  cells and no heading written into a listing with no header row; the heading reading
  `Size (rate limited)` once the header row is back, with no request for it; the sizes surviving a
  header row taken away while the API is answering, with no request while it is missing; and the
  column returning from the answer already in hand when the row comes back. It also pastes the
  bookmarklet twice, which is how one request rather than two polls' worth is held to.

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
