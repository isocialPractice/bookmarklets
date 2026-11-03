javascript:(function(){
 /* Declare global variables. */
 var hostClutterClickToHide, glassClutterClickToHide, boxClutterClickToHide, labelClutterClickToHide,
     countClutterClickToHide, statusClutterClickToHide; /* added elements */
 var targetClutterClickToHide = null, widerClutterClickToHide = [], lastXClutterClickToHide = -1, lastYClutterClickToHide = -1; /* current pick */

 /* Define global variables. */
 var hostIDClutterClickToHide = "clutterClickToHide--__-unlikely_-_name-__--clutterClickToHide";
 var stateKeyClutterClickToHide = "clutterClickToHideState--__-unlikely_-_name-__--clutterClickToHideState";
 var fontClutterClickToHide = "12px/1.45 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
 var skipStickyClutterClickToHide = ["TH", "TD", "TR", "THEAD", "TBODY", "TFOOT", "CAPTION"];

 /* Hidden elements stay hidden after exit, so undo still works when the bookmarklet runs again. */
 var stateClutterClickToHide = window[stateKeyClutterClickToHide] || (window[stateKeyClutterClickToHide] = { undo: [], exit: null });

 /************************************* SUPPORT FUNCTIONS *************************************/
 /** Called in main function. *****************************************************************/

 /* Style through CSSOM, which strict content security policies still allow. */
 const styleClutterClickToHide = (el, css) => {
  Object.keys(css).forEach(function(k) { el.style.setProperty(k, css[k], "important"); });
  return el;
 };
 const makeClutterClickToHide = (tag, css, text) => {
  let el = document.createElement(tag);
  styleClutterClickToHide(el, css);
  if (text) { el.textContent = text; }
  return el;
 };

 /* Short name for an element, like div#banner.cookie.notice */
 const describeClutterClickToHide = (el) => {
  let s = el.tagName.toLowerCase();
  if (el.id) { s += "#" + el.id; }
  let cls = typeof el.className == "string" ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 3) : [];
  if (cls.length) { s += "." + cls.join("."); }
  return s.length > 70 ? s.slice(0, 69) + "\u2026" : s;
 };

 /* Parent element, stepping out of shadow roots; never body or html. */
 const parentOfClutterClickToHide = (el) => {
  let p = el.parentElement || (el.getRootNode && el.getRootNode().host) || null;
  return (p && p !== document.body && p !== document.documentElement) ? p : null;
 };

 /* Topmost page element at a point, looking inside open shadow roots, never this bookmarklet. */
 const pickAtClutterClickToHide = (x, y) => {
  let scope = document, el = null;
  for (let d = 0; d < 10; d++) {
   let list = scope.elementsFromPoint(x, y), hit = null;
   for (let i = 0; i < list.length; i++) {
    if (list[i] !== hostClutterClickToHide) { hit = list[i]; break; }
   }
   if (!hit || hit === el) { break; }
   el = hit;
   if (!el.shadowRoot || !el.shadowRoot.elementsFromPoint) { break; }
   scope = el.shadowRoot;
  }
  return (el === document.body || el === document.documentElement) ? null : el;
 };

 /* Outline the current pick and name it. */
 const drawBoxClutterClickToHide = () => {
  let t = targetClutterClickToHide;
  if (!t || !t.isConnected) {
   styleClutterClickToHide(boxClutterClickToHide, { display: "none" });
   styleClutterClickToHide(labelClutterClickToHide, { display: "none" });
   return;
  }
  let r = t.getBoundingClientRect();
  styleClutterClickToHide(boxClutterClickToHide, {
   display: "block", left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px"
  });
  labelClutterClickToHide.textContent = describeClutterClickToHide(t) + "  " + Math.round(r.width) + " \u00d7 " + Math.round(r.height);
  let labelTop = r.top >= 24 ? r.top - 24 : Math.min(Math.max(r.bottom + 4, 0), window.innerHeight - 24);
  styleClutterClickToHide(labelClutterClickToHide, {
   display: "block", left: Math.min(Math.max(r.left, 0), Math.max(window.innerWidth - 220, 0)) + "px", top: labelTop + "px"
  });
 };

 /* Pick again at the last mouse position, keeping nothing of a bigger or smaller choice. */
 const repickClutterClickToHide = () => {
  widerClutterClickToHide = [];
  targetClutterClickToHide = lastXClutterClickToHide < 0 ? null : pickAtClutterClickToHide(lastXClutterClickToHide, lastYClutterClickToHide);
  drawBoxClutterClickToHide();
 };

 /* Count and the last thing done, in the panel. */
 const reportClutterClickToHide = (message) => {
  let n = 0;
  stateClutterClickToHide.undo.forEach(function(batch) {
   batch.forEach(function(c) { if (c.prop == "display") { n++; } });
  });
  countClutterClickToHide.textContent = "Hidden: " + n;
  if (message) { statusClutterClickToHide.textContent = message; }
 };

 /* Apply [element, property, value] changes as one undo step. */
 const applyClutterClickToHide = (changes) => {
  let batch = [];
  changes.forEach(function(c) {
   batch.push({ el: c[0], prop: c[1], value: c[0].style.getPropertyValue(c[1]), priority: c[0].style.getPropertyPriority(c[1]) });
   c[0].style.setProperty(c[1], c[2], "important");
  });
  if (batch.length) { stateClutterClickToHide.undo.push(batch); }
  return batch.length;
 };
 const undoClutterClickToHide = () => {
  let batch = stateClutterClickToHide.undo.pop();
  if (!batch) {
   reportClutterClickToHide("Nothing to undo");
   return;
  }
  batch.slice().reverse().forEach(function(c) {
   if (c.value) { c.el.style.setProperty(c.prop, c.value, c.priority); } else { c.el.style.removeProperty(c.prop); }
  });
  repickClutterClickToHide();
  reportClutterClickToHide("Undid " + batch.length + " change(s)");
 };

 /* Hide the current pick. */
 const hideTargetClutterClickToHide = () => {
  let t = targetClutterClickToHide;
  if (!t) { return; }
  applyClutterClickToHide([[t, "display", "none"]]);
  repickClutterClickToHide();
  reportClutterClickToHide("Hid " + describeClutterClickToHide(t));
 };

 /* Changes that let a page scroll again after a pop-up locked it. */
 const unlockChangesClutterClickToHide = () => {
  let changes = [];
  [document.documentElement, document.body].forEach(function(el) {
   if (!el) { return; }
   let cs = getComputedStyle(el);
   if (/hidden|clip/.test(cs.overflowY)) { changes.push([el, "overflow-y", "auto"]); }
   if (el === document.body && cs.position == "fixed") { changes.push([el, "position", "static"]); }
  });
  return changes;
 };
 const unlockClutterClickToHide = () => {
  let n = applyClutterClickToHide(unlockChangesClutterClickToHide());
  reportClutterClickToHide(n ? "Unlocked scrolling" : "Scrolling was not locked");
 };

 /* Hide every fixed or sticky element (headers, banners, chat bubbles) and unlock scrolling. */
 const hideFixedClutterClickToHide = () => {
  let found = [];
  let all = document.body ? document.body.getElementsByTagName("*") : [];
  for (let i = 0; i < all.length; i++) {
   let el = all[i];
   if (el === hostClutterClickToHide) { continue; }
   let cs = getComputedStyle(el);
   let pinned = cs.position == "fixed" || (cs.position == "sticky" && skipStickyClutterClickToHide.indexOf(el.tagName) < 0);
   if (!pinned || cs.display == "none" || cs.visibility == "hidden") { continue; }
   let r = el.getBoundingClientRect();
   if (r.width < 1 || r.height < 1) { continue; }
   if (found.some(function(f) { return f.contains(el); })) { continue; }
   found.push(el);
  }
  let changes = found.map(function(el) { return [el, "display", "none"]; }).concat(unlockChangesClutterClickToHide());
  applyClutterClickToHide(changes);
  repickClutterClickToHide();
  reportClutterClickToHide(found.length ? "Hid " + found.length + " fixed or sticky element(s)" : "No fixed or sticky elements found");
 };

 /* Bigger: the parent of the pick. Smaller: back down again. */
 const widerClutterClickToHideStep = () => {
  let p = targetClutterClickToHide ? parentOfClutterClickToHide(targetClutterClickToHide) : null;
  if (!p) { return; }
  widerClutterClickToHide.push(targetClutterClickToHide);
  targetClutterClickToHide = p;
  drawBoxClutterClickToHide();
 };
 const narrowerClutterClickToHideStep = () => {
  if (!widerClutterClickToHide.length) { return; }
  targetClutterClickToHide = widerClutterClickToHide.pop();
  drawBoxClutterClickToHide();
 };

 /* Mouse wheel: scroll the inner box under the pointer when there is one, else the page. */
 const onWheelClutterClickToHide = (e) => {
  let unit = e.deltaMode == 1 ? 16 : (e.deltaMode == 2 ? window.innerHeight : 1);
  let dx = e.deltaX * unit, dy = e.deltaY * unit;
  let el = pickAtClutterClickToHide(e.clientX, e.clientY);
  for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement || (el.getRootNode && el.getRootNode().host) || null) {
   let cs = getComputedStyle(el);
   if (!/(auto|scroll|overlay)/.test(cs.overflowY) || el.scrollHeight <= el.clientHeight + 1) { continue; }
   if ((dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) || (dy < 0 && el.scrollTop > 0)) {
    el.scrollBy(dx, dy);
    e.preventDefault();
    return;
   }
  }
 };

 /* Keys work only while the bookmarklet is on. */
 const onKeyClutterClickToHide = (e) => {
  let k = e.key, handled = true;
  if (k == "Escape") {
   stateClutterClickToHide.exit();
  } else if ((k == "z" || k == "Z") && (e.ctrlKey || e.metaKey) && !e.altKey) {
   undoClutterClickToHide();
  } else if (e.ctrlKey || e.metaKey || e.altKey) {
   handled = false;
  } else if (k == "u" || k == "U" || k == "Backspace") {
   undoClutterClickToHide();
  } else if (k == "ArrowUp" || k == "w" || k == "W") {
   widerClutterClickToHideStep();
  } else if (k == "ArrowDown" || k == "n" || k == "N") {
   narrowerClutterClickToHideStep();
  } else if (k == "Enter" || k == " ") {
   hideTargetClutterClickToHide();
  } else if (k == "f" || k == "F") {
   hideFixedClutterClickToHide();
  } else if (k == "s" || k == "S") {
   unlockClutterClickToHide();
  } else {
   handled = false;
  }
  if (handled) {
   e.preventDefault();
   e.stopImmediatePropagation();
  }
 };
 const onScrollClutterClickToHide = () => {
  if (widerClutterClickToHide.length) { drawBoxClutterClickToHide(); } else { repickClutterClickToHide(); }
 };

 /* One panel button. */
 const makeButtonClutterClickToHide = (label, run) => {
  let b = makeClutterClickToHide("button", {
   font: fontClutterClickToHide, color: "#f6f8fa", background: "#30363d", border: "1px solid #484f58",
   "border-radius": "6px", padding: "2px 8px", margin: "6px 6px 0 0", cursor: "pointer"
  }, label);
  b.type = "button";
  b.addEventListener("click", function(e) {
   e.preventDefault();
   e.stopPropagation();
   run();
  });
  return b;
 };

 /* Glass over the page to catch the mouse, the outline, its label, and the help panel. */
 const buildClutterClickToHide = () => {
  hostClutterClickToHide = makeClutterClickToHide("div", {
   all: "initial", display: "block", position: "fixed", top: "0", left: "0", width: "0", height: "0",
   "z-index": "2147483647", transform: "none", filter: "none"
  });
  hostClutterClickToHide.id = hostIDClutterClickToHide;
  let root = hostClutterClickToHide.attachShadow({ mode: "open" });
  glassClutterClickToHide = makeClutterClickToHide("div", {
   position: "fixed", top: "0", right: "0", bottom: "0", left: "0", cursor: "crosshair", background: "transparent", "pointer-events": "auto"
  });
  boxClutterClickToHide = makeClutterClickToHide("div", {
   position: "fixed", display: "none", "pointer-events": "none", "box-sizing": "border-box",
   border: "2px solid #e5484d", background: "rgba(229,72,77,.18)", "border-radius": "2px"
  });
  labelClutterClickToHide = makeClutterClickToHide("div", {
   position: "fixed", display: "none", "pointer-events": "none", font: fontClutterClickToHide, color: "#fff",
   background: "#e5484d", padding: "2px 6px", "border-radius": "4px", "white-space": "nowrap", "max-width": "60vw",
   overflow: "hidden", "text-overflow": "ellipsis"
  });
  let panel = makeClutterClickToHide("div", {
   position: "fixed", right: "12px", bottom: "12px", "max-width": "330px", font: fontClutterClickToHide, color: "#f6f8fa",
   background: "#161b22", border: "1px solid #30363d", "border-radius": "8px", padding: "8px 10px",
   "box-shadow": "0 4px 16px rgba(0,0,0,.4)", "pointer-events": "auto", cursor: "default", "user-select": "none", "text-align": "left"
  });
  panel.appendChild(makeClutterClickToHide("div", { "font-weight": "600", "margin-bottom": "4px" }, "Clutter - Click To Hide"));
  panel.appendChild(makeClutterClickToHide("div", {}, "Click: hide \u00b7 \u2191/\u2193: bigger/smaller \u00b7 U: undo"));
  panel.appendChild(makeClutterClickToHide("div", {}, "F: hide fixed bars \u00b7 S: unlock scroll \u00b7 Esc: done"));
  countClutterClickToHide = makeClutterClickToHide("div", { "margin-top": "4px", "font-weight": "600" }, "Hidden: 0");
  statusClutterClickToHide = makeClutterClickToHide("div", { opacity: ".8", "min-height": "17px" }, "Point at something to hide it");
  panel.appendChild(countClutterClickToHide);
  panel.appendChild(statusClutterClickToHide);
  panel.appendChild(makeButtonClutterClickToHide("Undo", undoClutterClickToHide));
  panel.appendChild(makeButtonClutterClickToHide("Hide fixed", hideFixedClutterClickToHide));
  panel.appendChild(makeButtonClutterClickToHide("Unlock scroll", unlockClutterClickToHide));
  panel.appendChild(makeButtonClutterClickToHide("Done", function() { stateClutterClickToHide.exit(); }));
  root.appendChild(glassClutterClickToHide);
  root.appendChild(boxClutterClickToHide);
  root.appendChild(labelClutterClickToHide);
  root.appendChild(panel);

  /* the page never sees the clicks */
  ["mousedown", "mouseup", "pointerdown", "pointerup", "dblclick", "auxclick", "contextmenu"].forEach(function(type) {
   glassClutterClickToHide.addEventListener(type, function(e) {
    e.preventDefault();
    e.stopPropagation();
   });
  });
  glassClutterClickToHide.addEventListener("mousemove", function(e) {
   lastXClutterClickToHide = e.clientX;
   lastYClutterClickToHide = e.clientY;
   repickClutterClickToHide();
  });
  glassClutterClickToHide.addEventListener("click", function(e) {
   e.preventDefault();
   e.stopPropagation();
   lastXClutterClickToHide = e.clientX;
   lastYClutterClickToHide = e.clientY;
   if (!targetClutterClickToHide) { repickClutterClickToHide(); }
   hideTargetClutterClickToHide();
  });
  glassClutterClickToHide.addEventListener("wheel", onWheelClutterClickToHide, { passive: false });
 };

 /* Turn off: the hidden elements stay hidden until the page reloads. */
 const exitClutterClickToHide = () => {
  window.removeEventListener("keydown", onKeyClutterClickToHide, true);
  window.removeEventListener("scroll", onScrollClutterClickToHide, true);
  window.removeEventListener("resize", drawBoxClutterClickToHide);
  if (hostClutterClickToHide && hostClutterClickToHide.parentNode) { hostClutterClickToHide.parentNode.removeChild(hostClutterClickToHide); }
  stateClutterClickToHide.exit = null;
  console.log("Bookmarklet stopped:");
 };

 /*********************************************************************************************
                                          MAIN FUNCTION
 *********************************************************************************************/
 function ClutterClickToHide() {
  /* running already: the second click turns it off */
  if (stateClutterClickToHide.exit) {
   stateClutterClickToHide.exit();
   return;
  }
  if (!document.body) {
   console.log("Bookmarklet did not run:");
   return;
  }
  buildClutterClickToHide();
  document.documentElement.appendChild(hostClutterClickToHide);
  window.addEventListener("keydown", onKeyClutterClickToHide, true);
  window.addEventListener("scroll", onScrollClutterClickToHide, true);
  window.addEventListener("resize", drawBoxClutterClickToHide);
  stateClutterClickToHide.exit = exitClutterClickToHide;
  reportClutterClickToHide("");
  console.log("Bookmarklet running:");
 }
 ClutterClickToHide();
})();
