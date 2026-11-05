// *********************************************************************************************** //
// bookmarklet                                                                                     //
// Copy a bookmarklet to the clipboard, ready to paste as the URL of a new bookmark.               //
// *********************************************************************************************** //
// Needs Node.js only - no packages to install.
//
//   node bookmarklet.js copy <name>
//
// <name>  A bookmarklet in JSFormatted, as "name", "name.js", or "JSFormatted/name.js".
//
// The file is joined onto one line and checked that it still parses, then copied with the
// clipboard command that comes with the system:
//   Windows  PowerShell Set-Clipboard
//   macOS    pbcopy
//   Linux    wl-copy, xclip, or xsel (whichever is installed), or clip.exe under WSL

var fs = require("fs");
var path = require("path");
var vm = require("vm");
var childProcess = require("child_process");

var jsDir = path.join(__dirname, "JSFormatted");

function fail(message) {
 console.error("bookmarklet: " + message);
 process.exit(1);
}

function usage() {
 var lines = fs.readFileSync(__filename, "utf8").split(/\r?\n/);
 var out = [];
 for (var i = 4; i < lines.length && /^\/\//.test(lines[i]); i++) { out.push(lines[i].replace(/^\/\/ ?/, "")); }
 return out.join("\n");
}

// "name", "name.js", or "JSFormatted/name.js" -> JSFormatted/name.js
function bookmarkletFile(arg) {
 var name = path.basename(String(arg).trim()).replace(/\.js$/i, "");
 return path.join(jsDir, name + ".js");
}

// The bookmarklet with its line breaks removed, as a bookmark URL holds it.
function oneLine(file) {
 var text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
 var line = text.replace(/\s*\r?\n\s*/g, " ").trim();
 try {
  new vm.Script(line.replace(/^\s*javascript:/i, ""), { filename: path.basename(file) });
 } catch (err) {
  fail(path.basename(file) + " does not parse on one line: " + err.message);
 }
 return line;
}

// Clipboard commands to try, in order, for this system.
function clipboardCommands() {
 if (process.platform == "win32") {
  return [{
   cmd: "powershell.exe",
   args: ["-NoProfile", "-NonInteractive", "-Command",
    "[Console]::InputEncoding = [Text.UTF8Encoding]::new($false); " +
    "Set-Clipboard -Value ([Console]::In.ReadToEnd())"]
  }];
 }
 if (process.platform == "darwin") {
  return [{ cmd: "pbcopy", args: [], env: { LANG: "en_US.UTF-8" } }];
 }
 var list = [];
 if (process.env.WAYLAND_DISPLAY) { list.push({ cmd: "wl-copy", args: [] }); }
 list.push({ cmd: "xclip", args: ["-selection", "clipboard"] });
 list.push({ cmd: "xsel", args: ["--clipboard", "--input"] });
 list.push({ cmd: "clip.exe", args: [], utf16: true }); // WSL
 return list;
}

// Name of the command that copied the text, or null when none could.
function copyToClipboard(text) {
 var list = clipboardCommands();
 for (var i = 0; i < list.length; i++) {
  var c = list[i];
  var input = c.utf16 ? Buffer.concat([Buffer.from([0xFF, 0xFE]), Buffer.from(text, "utf16le")]) : text;
  var result = childProcess.spawnSync(c.cmd, c.args, {
   input: input,
   env: Object.assign({}, process.env, c.env || {}),
   stdio: ["pipe", "ignore", "ignore"],
   windowsHide: true
  });
  if (!result.error && result.status == 0) { return c.cmd; }
 }
 return null;
}

function main() {
 var args = process.argv.slice(2);
 if (!args.length || args[0] == "--help" || args[0] == "-h" || args[0] == "/?") {
  console.log(usage());
  process.exit(args.length ? 0 : 1);
 }
 if (args[0] != "copy") { fail("unknown command " + args[0] + " - try: node bookmarklet.js copy <name>"); }
 if (!args[1]) { fail("missing bookmarklet name - try: node bookmarklet.js copy <name>"); }

 var file = bookmarkletFile(args[1]);
 if (!fs.existsSync(file)) { fail("not found: " + path.relative(process.cwd(), file)); }

 var line = oneLine(file);
 var used = copyToClipboard(line);
 if (!used) {
  fail("no clipboard command worked (" + clipboardCommands().map(function(c) { return c.cmd; }).join(", ") +
   "). Install one, or open the file, select all, and copy it by hand.");
 }
 console.log("copied " + path.basename(file) + " to the clipboard (" + line.length + " characters)");
}

main();
