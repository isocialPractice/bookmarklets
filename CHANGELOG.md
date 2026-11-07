# Changelog

All notable changes to the bookmarklets in this repository are documented in
this file.

> Release mode: dated - this project does not publish versions, tags, or
> releases. Entries are keyed by the date the work was applied.

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
