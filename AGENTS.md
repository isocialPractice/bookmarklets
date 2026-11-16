# Agents

Instructions for any coding assistant working in this repository.

## Never anything that could pass for malicious

A bookmarklet runs inside whatever page a reader opens it on, with that page's
sign-ins. So a bookmarklet in this repository never:

- reads or writes cookies (`document.cookie`);
- reads storage it did not write itself, such as a site's own tokens;
- sends anything from the page to another host;
- loads code at run time: no `eval`, no `new Function`, no string handed to
  `setTimeout` or `setInterval`, no `import()`, and no `<script>` loaded by its
  `src` without an integrity hash.

Its own notes and settings in `localStorage` or `sessionStorage`, under keys
named for it, are fine. The site's own scripts can read them, so nothing
private goes there.

Two things may reach another host, and only when the bookmarklet's entry in
`test-bm.json` names the host under `network` with the reason:

- a site's own API on another host, such as `api.github.com` for GitHub;
- a library loaded by its `src` and pinned with Subresource Integrity.

A request the page itself makes, because the bookmarklet clicked something on
it, is named the same way, with that reason.

`node test-bm.js <name>` enforces this. It refuses the file before any browser
starts for what it can read in the source, and fails the run for any request
started from the bookmarklet's code to a host the entry does not name. Never
add a `network` host to make a test pass unless the bookmarklet truly needs
it, and say in its reason what the request is for.

## Triaging a failing test

`node test-bm.js <name>` is the judge. When it fails, it writes `failure.md`
into the run's folder under `test-results/test-bm/` and names the path on its
last line. That file holds everything knowable about the failure without
running anything again, so start there rather than opening a browser.

1. **Read `failure.md`.** For a missing `requires` selector it gives the
   selector, the lines of the formatted file that use it, and an ARIA snapshot
   and trimmed markup of the part of the page the selector was expected in. For
   a bookmarklet that threw it gives the message and the lines of the formatted
   file the stack came from. A section for an entry on a signed-in page gives
   the selector or the message and the bookmarklet's own lines, and nothing the
   page showed.
2. **Open the page with whatever browser tool you have**, on a browser that is
   signed in to nothing. The snapshot in `failure.md` says what the region held
   when the run failed; the live page says what it holds now.
3. **Find what replaced what is missing.** A site that redesigned a listing
   usually kept the thing and renamed it, so look for the element doing the same
   job before concluding it is gone.
4. **Make the smallest edit to the bookmarklet** that reads the page as it is
   now. One selector, one guard, one fallback. A rewrite is almost never the
   answer to a renamed class.
5. **Run `node test-bm.js <name>` and report its verdict**, with the reason it
   printed. A fix nobody ran is a guess.

`node test-bm.js --help` prints the whole of what the harness does, including
the flags, the exit codes and the shape of a `test-bm.json` entry.

## Writing a bookmarklet

One file per bookmarklet, `JSFormatted/<type>_<Focus>_<WhatItDoes>.js`, started
from `templates/newType_TheFocus_WhatItDoes-JSFormatted.js`. The file opens with
`javascript:(function(){` and closes with `})();`, because a reader pastes the
whole of it as the URL of a bookmark.

The browser takes the line breaks out when the file is pasted, and every
convention below follows from that:

- **Block comments only** (`/* */`, never `//`). A line comment swallows the
  rest of the bookmarklet once the file is one line.
- **A semicolon after every statement.** Without one, two statements run
  together into something that neither of them meant.
- **Top-level names suffixed with the file's focus and action.** The code runs
  in the page's own global scope, so `clutter` collides with the site's own
  variable and `hostClutterClickToHide` cannot. Injected ids and `window` keys
  take the `--__-unlikely_-_name-__--` infix the existing files use, for the
  same reason.
- **Style added elements through the CSSOM** (`el.style.setProperty(...)`),
  never an injected `<style>` tag or a `style=""` string. A strict content
  security policy refuses the latter two and allows the first, so a bookmarklet
  that styles itself the other way works on a practice page and fails on a real
  site.
- **A second run toggles or reuses what the first run added**, rather than
  stacking a second copy of it.

## Hard limits

These hold whatever a test says, and whatever would make it pass:

- **Never sign in to anything**, and never run `node test-bm.js --sign-in`.
  That flag exists for the maintainer at a keyboard; nothing a contributor or an
  assistant does needs it.
- **Never attach a browser tool to a browser that is signed in to anything.**
  Run it with a profile of its own: the Playwright MCP server's `--isolated` is
  one way. A page opened in the reader's own browser carries the reader's
  sign-ins, and a bookmarklet is not the only thing that can read them.
- **Never submit a form or send a message** on a live site, and never click a
  control whose job is to publish, order, delete or reply.
- **Never loosen an expectation in `test-bm.json` to make a test pass.** The
  expectation is what says the bookmarklet did its job; a looser one says
  nothing and passes. Change it only when the bookmarklet's intended behaviour
  changed, and say in the commit that it did and why.
