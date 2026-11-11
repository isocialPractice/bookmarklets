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
