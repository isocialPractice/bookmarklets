javascript: (function () {
 /* Configurable variables. */
 var incrementCountNavigateAnswers = "PageDown"; /* key for the next answer     */
 var decrementCountNavigateAnswers = "PageUp";   /* key for the previous answer */
 var alertWithInstructionsNavigateAnswers = 1;   /* 1 shows how to use it       */

 /* HOT-GLUE - how the conversation is read. The page marks each turn, the key */
 /* that names it, the question in it and the answer in it.                    */
 var turnSelectorNavigateAnswers     = "[data-virtualized-turn]";
 var turnKeyAttrNavigateAnswers      = "data-turn-key";
 var questionSelectorNavigateAnswers = "[data-user-message-bubble]";
 var answerSelectorNavigateAnswers   = "[data-response-body]";

 /* HOT-GLUE - the fallback, for a page without those marks. A question is    */
 /* written in a block that keeps its line breaks, and an answer in ordinary  */
 /* content blocks a reader can see.                                          */
 var fallbackQuestionSelectorNavigateAnswers = "[class*='whitespace-pre-wrap']";
 var fallbackContentSelectorNavigateAnswers  =
  "p, h1, h2, h3, h4, h5, h6, ol, ul, pre, table, blockquote";

 /* Names this bookmarklet adds to the page. */
 var keyNavigateAnswers         = "--__-unlikely_-_name-__--NavigateAnswers";
 var buttonIDNavigateAnswers    = "normal-chat" + keyNavigateAnswers;
 var unitAttrNavigateAnswers    = "data-navigate-answers";         /* question or answer */
 var currentAttrNavigateAnswers = "data-navigate-answers-current"; /* the answer shown   */
 var turnAttrNavigateAnswers    = "data-navigate-answers-turn";    /* a turn, fallback   */

 /* A second run reads the conversation again and reuses the first run's button. */
 if (window[keyNavigateAnswers]) {
  window[keyNavigateAnswers].rescan();
  return;
 }

 /* The state of this run, kept on the page so a second run can reuse it. */
 var stateNavigateAnswers = {
  on: 0,             /* 1 shows one answer at a time, 0 the whole page          */
  started: 0,        /* 1 after the first navigation key press                  */
  current: null,     /* the turn shown: { key } on the page's turns, or { index } */
  busy: 0,           /* 1 while a move waits for the page to draw a turn        */
  chatURI: location.href,
  button: null,
  sheet: null,       /* the one stylesheet this bookmarklet owns                */
  inline: [],        /* what was styled inline, when there is no such sheet     */
  remark: 0,         /* 1 while marking the turns the page just drew is queued  */
  hold: 0            /* counts holds; a newer move or the reader's own input ends one */
 };

 /********************** SUPPORT FUNCTIONS *********************/
 /* The key that names a turn, or null. */
 var keyOfNavigateAnswers = function (turn) {
  if (turn.hasAttribute(turnKeyAttrNavigateAnswers)) { return turn.getAttribute(turnKeyAttrNavigateAnswers); }
  var keyed = turn.querySelector("[" + turnKeyAttrNavigateAnswers + "]");
  return keyed ? keyed.getAttribute(turnKeyAttrNavigateAnswers) : null;
 };

 /* The turns the page has drawn, in order, each with its key and an answer. */
 /* The page draws only the turns near the scroll position.                 */
 var pageTurnsNavigateAnswers = function () {
  var main = document.querySelector("main") || document;
  return [].filter.call(main.querySelectorAll(turnSelectorNavigateAnswers), function (turn) {
   return keyOfNavigateAnswers(turn) !== null && turn.querySelector(answerSelectorNavigateAnswers);
  });
 };

 var indexOfKeyNavigateAnswers = function (turns, key) {
  for (var i = 0; i < turns.length; i++) {
   if (keyOfNavigateAnswers(turns[i]) === key) { return i; }
  }
  return -1;
 };

 /* The element the conversation scrolls in. */
 var scrollerNavigateAnswers = function () {
  var turns = pageTurnsNavigateAnswers();
  var el = turns.length ? turns[0].parentElement : null;
  while (el && el != document.documentElement) {
   var overflow = getComputedStyle(el).overflowY;
   if ((overflow == "auto" || overflow == "scroll") && el.scrollHeight > el.clientHeight) { return el; }
   el = el.parentElement;
  }
  return document.scrollingElement || document.documentElement;
 };

 /* Scroll the conversation, then wait until the turns drawn stop changing. */
 /* After a long scroll the page can show a turn before its answer, so a    */
 /* wait that finds no turn with an answer goes on, up to two seconds.      */
 var settleNavigateAnswers = function (scroller, top) {
  scroller.scrollTop = top;
  return new Promise(function (resolve) {
   var last = "";
   var same = 0;
   var tries = 0;
   var look = function () {
    var now = pageTurnsNavigateAnswers().map(keyOfNavigateAnswers).join("|");
    same = now == last ? same + 1 : 0;
    last = now;
    tries++;
    if ((same >= 3 && now !== "") || tries >= 40) { resolve(); } else { setTimeout(look, 50); }
   };
   setTimeout(look, 50);
  });
 };

 /* The next or the previous turn's key on the page's own turns. A turn not */
 /* drawn yet is reached by scrolling past the one shown; past either end,  */
 /* the move wraps to the other end.                                        */
 var stepPageNavigateAnswers = async function (forward) {
  var scroller = scrollerNavigateAnswers();
  shownTurnNavigateAnswers();
  var shown = stateNavigateAnswers.current && stateNavigateAnswers.current.key;
  var turns = pageTurnsNavigateAnswers();
  var at = shown ? indexOfKeyNavigateAnswers(turns, shown) : -1;
  var by = forward ? 1 : -1;
  if (!shown) {
   /* The first key starts at an end: the first answer forward, the last back. */
   await settleNavigateAnswers(scroller, forward ? 0 : scroller.scrollHeight);
   turns = pageTurnsNavigateAnswers();
   return turns.length ? keyOfNavigateAnswers(turns[forward ? 0 : turns.length - 1]) : null;
  }
  if (at < 0) {
   /* The reader scrolled away from the answer shown: the answer in view. */
   return inViewNavigateAnswers();
  }
  for (var tries = 0; tries < 4; tries++) {
   if (at >= 0 && turns[at + by]) { return keyOfNavigateAnswers(turns[at + by]); }
   var before = scroller.scrollTop;
   /* Already at that end of the conversation: there is nothing more to draw. */
   var atEnd = forward ? before + scroller.clientHeight >= scroller.scrollHeight - 2 : before <= 0;
   if (atEnd) { break; }
   var view = scroller.getBoundingClientRect();
   var box = at >= 0 ? turns[at].getBoundingClientRect() : view;
   var past = forward ? Math.max(40, box.bottom - view.top) : Math.max(40, view.bottom - box.top);
   await settleNavigateAnswers(scroller, before + by * past);
   if (Math.abs(scroller.scrollTop - before) < 2) { break; }
   turns = pageTurnsNavigateAnswers();
   at = indexOfKeyNavigateAnswers(turns, shown);
   if (at < 0 && turns.length) {
    /* The page dropped the shown turn on the way: the nearest one that way. */
    view = scroller.getBoundingClientRect();
    var near = forward
     ? turns.filter(function (t) { return t.getBoundingClientRect().top >= view.top - 2; })[0]
     : turns.filter(function (t) { return t.getBoundingClientRect().bottom <= view.bottom + 2; }).pop();
    if (near) { return keyOfNavigateAnswers(near); }
   }
  }
  await settleNavigateAnswers(scroller, forward ? 0 : scroller.scrollHeight);
  turns = pageTurnsNavigateAnswers();
  return turns.length ? keyOfNavigateAnswers(turns[forward ? 0 : turns.length - 1]) : null;
 };

 /* Where a turn sits in the conversation: its offset in the list the page */
 /* sized for every turn, or null when the page has no such list.          */
 var offsetNavigateAnswers = function (turn) {
  var list = turn.parentElement;
  while (list && list != document.body && !/px$/.test(list.style.height)) { list = list.parentElement; }
  if (!list || list == document.body) { return null; }
  return turn.getBoundingClientRect().top - list.getBoundingClientRect().top;
 };

 /* The shown turn as the page holds it now. The page can draw a turn again */
 /* under a new key; then the turn at the shown one's place is it, and the  */
 /* rules follow its new key. Null when it is not drawn.                    */
 var shownTurnNavigateAnswers = function () {
  var shown = stateNavigateAnswers.current;
  if (!shown || shown.key === undefined) { return null; }
  var turns = pageTurnsNavigateAnswers();
  var at = indexOfKeyNavigateAnswers(turns, shown.key);
  if (at >= 0) { return turns[at]; }
  if (shown.offset === null || shown.offset === undefined) { return null; }
  var same = turns.filter(function (t) {
   var offset = offsetNavigateAnswers(t);
   return offset !== null && Math.abs(offset - shown.offset) < 40;
  })[0];
  if (!same) { return null; }
  shown.key = keyOfNavigateAnswers(same);
  styleNavigateAnswers(rulesNavigateAnswers());
  markNavigateAnswers();
  return same;
 };

 /* The turn the reader is looking at: the first drawn one reaching into view. */
 var inViewNavigateAnswers = function () {
  var top = scrollerNavigateAnswers().getBoundingClientRect().top;
  var inView = pageTurnsNavigateAnswers().filter(function (t) { return t.getBoundingClientRect().bottom > top + 2; })[0];
  return inView ? keyOfNavigateAnswers(inView) : null;
 };

 /********************** THE FALLBACK READING *********************/
 /* The lowest element holding every node in a list. */
 var commonAncestorNavigateAnswers = function (nodes) {
  var ancestor = nodes[0];
  for (var i = 1; i < nodes.length; i++) {
   while (ancestor && !ancestor.contains(nodes[i])) {
    ancestor = ancestor.parentElement;
   }
  }
  return ancestor;
 };

 /* The child of parent that holds node. */
 var childHoldingNavigateAnswers = function (parent, node) {
  var child = node;
  while (child && child.parentElement != parent) {
   child = child.parentElement;
  }
  return child;
 };

 /* The first content block inside an element that a reader can see, outside */
 /* every question. A screen reader's heading is a pixel, and is passed over. */
 var firstBlockNavigateAnswers = function (within, questions) {
  var blocks = within.querySelectorAll(fallbackContentSelectorNavigateAnswers);
  for (var i = 0; i < blocks.length; i++) {
   var inQuestion = questions.some(function (q) { return q.contains(blocks[i]); });
   var box = blocks[i].getBoundingClientRect();
   if (!inQuestion && box.width > 1 && box.height > 1) { return blocks[i]; }
  }
  return null;
 };

 /* Each question and its answer, by the page's structure. Each pair has the */
 /* elements that make its turn, the question and the answer.               */
 var readFallbackNavigateAnswers = function () {
  var pairs = [];
  var main = document.querySelector("main");
  if (!main) { return pairs; }
  var form = main.querySelector("form");
  var questions = [].filter.call(main.querySelectorAll(fallbackQuestionSelectorNavigateAnswers), function (q) {
   var outerQuestion = !(q.parentElement && q.parentElement.closest(fallbackQuestionSelectorNavigateAnswers));
   return outerQuestion && !(form && form.contains(q));
  });
  if (questions.length == 0) { return pairs; }
  var firstAnswerBlock = firstBlockNavigateAnswers(main, questions);
  if (firstAnswerBlock && form && form.contains(firstAnswerBlock)) { firstAnswerBlock = null; }
  var thread = commonAncestorNavigateAnswers(
   firstAnswerBlock ? questions.concat([firstAnswerBlock]) : questions
  );
  if (!thread) { return pairs; }

  for (var i = 0; i < questions.length; i++) {
   var exchange = childHoldingNavigateAnswers(thread, questions[i]);
   if (!exchange) { continue; }
   var blockInExchange = firstBlockNavigateAnswers(exchange, questions);
   if (blockInExchange) {
    /* The question and its answer share one element: split it where they part. */
    var split = commonAncestorNavigateAnswers([questions[i], blockInExchange]);
    pairs.push({
     turn: [exchange],
     question: childHoldingNavigateAnswers(split, questions[i]),
     answer: childHoldingNavigateAnswers(split, blockInExchange)
    });
   } else {
    /* The answer is the element after the question, before the next one. */
    var next = exchange.nextElementSibling;
    var nextQuestion = questions[i + 1] ? childHoldingNavigateAnswers(thread, questions[i + 1]) : null;
    while (next && next != nextQuestion && !firstBlockNavigateAnswers(next, questions)) {
     next = next.nextElementSibling;
    }
    if (next && next != nextQuestion) {
     pairs.push({ turn: [exchange, next], question: exchange, answer: next });
    }
   }
  }
  return pairs;
 };

 /* The next or the previous pair by the fallback reading, wrapping at either end. */
 var stepFallbackNavigateAnswers = function (forward) {
  var total = readFallbackNavigateAnswers().length;
  if (total == 0) { return null; }
  var shown = stateNavigateAnswers.current;
  if (!shown || shown.index === undefined || shown.index >= total) { return forward ? 0 : total - 1; }
  var next = shown.index + (forward ? 1 : total - 1);
  return next >= total ? next - total : next;
 };

 /********************** SHOWING ONE ANSWER *********************/
 /* Which reading this page takes: its own turns, or the fallback. */
 var onPageTurnsNavigateAnswers = function () {
  return pageTurnsNavigateAnswers().length > 0;
 };

 /* Mark each question and answer, and the answer shown, as the page holds them now. */
 var markNavigateAnswers = function () {
  ["[" + unitAttrNavigateAnswers + "]", "[" + currentAttrNavigateAnswers + "]", "[" + turnAttrNavigateAnswers + "]"]
   .forEach(function (selector) {
    [].forEach.call(document.querySelectorAll(selector), function (el) {
     el.removeAttribute(unitAttrNavigateAnswers);
     el.removeAttribute(currentAttrNavigateAnswers);
     el.removeAttribute(turnAttrNavigateAnswers);
    });
   });
  var shown = stateNavigateAnswers.on == 1 ? stateNavigateAnswers.current : null;
  if (onPageTurnsNavigateAnswers()) {
   pageTurnsNavigateAnswers().forEach(function (turn) {
    var question = turn.querySelector(questionSelectorNavigateAnswers);
    var answer = turn.querySelector(answerSelectorNavigateAnswers);
    if (question) { question.setAttribute(unitAttrNavigateAnswers, "question"); }
    answer.setAttribute(unitAttrNavigateAnswers, "answer");
    if (shown && shown.key === keyOfNavigateAnswers(turn)) { answer.setAttribute(currentAttrNavigateAnswers, "1"); }
   });
   return;
  }
  readFallbackNavigateAnswers().forEach(function (pair, i) {
   pair.turn.forEach(function (el) { el.setAttribute(turnAttrNavigateAnswers, String(i)); });
   if (pair.question) { pair.question.setAttribute(unitAttrNavigateAnswers, "question"); }
   if (pair.answer) {
    pair.answer.setAttribute(unitAttrNavigateAnswers, "answer");
    if (shown && shown.index === i) { pair.answer.setAttribute(currentAttrNavigateAnswers, "1"); }
   }
  });
 };

 /* The rules that show one answer: what every other turn holds hidden, and in */
 /* the shown turn everything but its answer. Keyed on what the page itself    */
 /* marks, so a turn the page draws again later is hidden or shown by the same */
 /* rules. A turn's own element is never hidden: the page watches it, and      */
 /* draws a hidden one again under a new key.                                  */
 var rulesNavigateAnswers = function () {
  var shown = stateNavigateAnswers.current;
  var turn, isShown, answer;
  if (shown.key !== undefined) {
   var keyed = "[" + turnKeyAttrNavigateAnswers + "=\"" + CSS.escape(shown.key) + "\"]";
   turn = turnSelectorNavigateAnswers;
   isShown = ":is(" + keyed + ", :has(" + keyed + "))";
   answer = answerSelectorNavigateAnswers;
  } else {
   turn = "[" + turnAttrNavigateAnswers + "]";
   isShown = "[" + turnAttrNavigateAnswers + "=\"" + shown.index + "\"]";
   answer = "[" + unitAttrNavigateAnswers + "='answer']";
  }
  var other = turn + ":not(" + isShown + ")";
  var current = turn + isShown;
  return [
   { selector: other + " *", visibility: "hidden" },
   { selector: current + " *:not(" + answer + ", " + answer + " *)", visibility: "hidden" },
   { selector: current + " " + answer + ", " + current + answer, visibility: "visible" }
  ];
 };

 /* Put the rules in the bookmarklet's own stylesheet, or take them out. */
 /* Without one, each element is styled inline, which a re-drawn turn loses. */
 var styleNavigateAnswers = function (rules) {
  var sheet = stateNavigateAnswers.sheet;
  if (sheet) {
   while (sheet.cssRules.length) { sheet.deleteRule(0); }
  }
  stateNavigateAnswers.inline.forEach(function (el) { el.style.removeProperty("visibility"); });
  stateNavigateAnswers.inline = [];
  rules.forEach(function (rule) {
   if (sheet) {
    try {
     sheet.insertRule(rule.selector + " { visibility: " + rule.visibility + " !important; }", sheet.cssRules.length);
     return;
    } catch (err) {
     sheet = null;
    }
   }
   try {
    [].forEach.call(document.querySelectorAll(rule.selector), function (el) {
     el.style.setProperty("visibility", rule.visibility, "important");
     stateNavigateAnswers.inline.push(el);
    });
   } catch (err) {
    /* a selector this browser cannot read styles nothing */
   }
  });
 };

 /* For a moment after a move the page may scroll the conversation itself, */
 /* as a chat that follows its latest answer does when it was at the end.  */
 /* Until the reader scrolls, clicks or touches, or the next move starts,  */
 /* the answer is put back where the move left it.                         */
 var holdNavigateAnswers = function () {
  var scroller = scrollerNavigateAnswers();
  var held = scroller.scrollTop;
  var shown = stateNavigateAnswers.current;
  var mine = ++stateNavigateAnswers.hold;
  var until = Date.now() + 4000;
  var look = function () {
   if (mine != stateNavigateAnswers.hold || stateNavigateAnswers.on != 1 || Date.now() > until) { return; }
   var view = scroller.getBoundingClientRect();
   var turn = shown.key !== undefined ? shownTurnNavigateAnswers() : null;
   var answer = turn ? turn.querySelector(answerSelectorNavigateAnswers) : null;
   if (answer) {
    var box = answer.getBoundingClientRect();
    if (box.bottom < view.top + 20 || box.top > view.bottom - 20) { answer.scrollIntoView({ block: "start" }); }
   } else if (Math.abs(scroller.scrollTop - held) > 40) {
    scroller.scrollTop = held;
   }
   setTimeout(look, 100);
  };
  setTimeout(look, 100);
 };

 /* Show the whole page, or only the current answer, scrolled into view. */
 var showNavigateAnswers = function () {
  var one = stateNavigateAnswers.on == 1 && stateNavigateAnswers.current;
  styleNavigateAnswers(one ? rulesNavigateAnswers() : []);
  markNavigateAnswers();
  var answer = one ? document.querySelector("[" + currentAttrNavigateAnswers + "]") : null;
  if (answer) {
   answer.scrollIntoView({ block: "start" });
   var turn = stateNavigateAnswers.current.key !== undefined ? answer.closest(turnSelectorNavigateAnswers) : null;
   stateNavigateAnswers.current.offset = turn ? offsetNavigateAnswers(turn) : null;
   holdNavigateAnswers();
  }
 };

 /* Toggle between one answer at a time and the whole page. */
 var toggleNavigateAnswers = function () {
  if (stateNavigateAnswers.started == 0) { return; }
  stateNavigateAnswers.on = stateNavigateAnswers.on == 1 ? 0 : 1;
  stateNavigateAnswers.button.textContent = stateNavigateAnswers.on == 1 ? "X" : "O";
  showNavigateAnswers();
 };

 /* Move to the next or the previous answer. */
 var navigateAnswers = function (event) {
  var keyPress = event.key;
  if (keyPress != incrementCountNavigateAnswers && keyPress != decrementCountNavigateAnswers) {
   return;
  }
  if (location.href != stateNavigateAnswers.chatURI) {
   /* another chat: put this one back and hide the button */
   stateNavigateAnswers.on = 0;
   showNavigateAnswers();
   stateNavigateAnswers.button.style.setProperty("display", "none");
   return;
  }
  stateNavigateAnswers.button.style.setProperty("display", "inline-block");
  /* The whole page, after a toggle: the key scrolls as it always does. */
  if (stateNavigateAnswers.started == 1 && stateNavigateAnswers.on == 0) { return; }
  event.preventDefault();
  if (stateNavigateAnswers.busy) { return; }
  stateNavigateAnswers.busy = 1;
  stateNavigateAnswers.hold++;
  var forward = keyPress == incrementCountNavigateAnswers;
  var page = onPageTurnsNavigateAnswers();
  var step = page ? stepPageNavigateAnswers(forward) : Promise.resolve(stepFallbackNavigateAnswers(forward));
  step.then(function (next) {
   /* No turn found that way: rather than a blank page, the answer in view. */
   if (next === null && page) { next = inViewNavigateAnswers(); }
   if (next === null) { return; }
   stateNavigateAnswers.current = page ? { key: next } : { index: next };
   stateNavigateAnswers.started = 1;
   stateNavigateAnswers.on = 1;
   stateNavigateAnswers.button.textContent = "X";
   showNavigateAnswers();
  }).catch(function () {
   /* a page that changed mid-move leaves the page as it was */
  }).then(function () {
   stateNavigateAnswers.busy = 0;
  });
 };

 /* The button that toggles between one answer and the whole page. */
 var makeButtonNavigateAnswers = function () {
  var button = document.createElement("div");
  button.id = buttonIDNavigateAnswers;
  button.className = "normal-chat";
  button.textContent = "O";
  var css = {
   "display": "inline-block",
   "position": "fixed",
   "top": "70px",
   "margin-left": "5px",
   "margin-top": "5px",
   "background": "black",
   "color": "white",
   "padding": "1px 10px 5px 10px",
   "border-radius": "7px",
   "box-shadow": "0.5px 0.2px 1px 0.1px rgba(255, 255, 255, 0.15)",
   "border": "2px solid rgba(255, 255, 255, 0.5)",
   "z-index": "1000",
   "cursor": "pointer"
  };
  Object.keys(css).forEach(function (prop) { button.style.setProperty(prop, css[prop]); });
  button.addEventListener("click", toggleNavigateAnswers);
  /* At the top of the conversation, left of it as the sidebar allows: fixed, */
  /* with no left set, it stays where the conversation's own column starts.  */
  var conversation = document.querySelector("main") || document.body;
  conversation.insertAdjacentElement("afterbegin", button);
  return button;
 };

 /* The one stylesheet this bookmarklet owns, adopted by the page. */
 var makeSheetNavigateAnswers = function () {
  try {
   var sheet = new CSSStyleSheet();
   document.adoptedStyleSheets = [].slice.call(document.adoptedStyleSheets).concat([sheet]);
   return sheet;
  } catch (err) {
   return null;
  }
 };

 /**************************************************************/
 /*                         MAIN FUNCTION                      */
 /**************************************************************/
 stateNavigateAnswers.button = makeButtonNavigateAnswers();
 stateNavigateAnswers.sheet = makeSheetNavigateAnswers();
 markNavigateAnswers();

 /* Taken before the page's own keys, so the key moves the answer rather */
 /* than scrolling the conversation under it.                            */
 window.addEventListener("keydown", navigateAnswers, true);

 /* The reader's own scrolling, clicking or touching ends a hold at once. */
 ["wheel", "touchstart", "pointerdown"].forEach(function (type) {
  window.addEventListener(type, function (event) {
   if (event.isTrusted) { stateNavigateAnswers.hold++; }
  }, { capture: true, passive: true });
 });

 /* The page draws turns again as the conversation scrolls. The rules keep */
 /* each one hidden or shown; the marks are put on the new ones here.      */
 if (window.MutationObserver) {
  new MutationObserver(function (changes) {
   var drawn = changes.some(function (change) {
    return [].some.call(change.addedNodes, function (node) {
     return node.nodeType == 1
      && (node.matches(turnSelectorNavigateAnswers) || node.querySelector(turnSelectorNavigateAnswers));
    });
   });
   if (!drawn || stateNavigateAnswers.remark) { return; }
   stateNavigateAnswers.remark = 1;
   setTimeout(function () {
    stateNavigateAnswers.remark = 0;
    var one = stateNavigateAnswers.on == 1 && stateNavigateAnswers.current;
    if (one) { shownTurnNavigateAnswers(); }
    if (!stateNavigateAnswers.sheet && one) { styleNavigateAnswers(rulesNavigateAnswers()); }
    markNavigateAnswers();
   }, 100);
  }).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
 }

 window[keyNavigateAnswers] = {
  rescan: function () {
   if (location.href != stateNavigateAnswers.chatURI) {
    /* another chat: start it afresh */
    stateNavigateAnswers.chatURI = location.href;
    stateNavigateAnswers.current = null;
    stateNavigateAnswers.started = 0;
    stateNavigateAnswers.on = 0;
    stateNavigateAnswers.button.textContent = "O";
   }
   stateNavigateAnswers.button.style.setProperty("display", "inline-block");
   showNavigateAnswers();
  }
 };

 /* Say how to use it. */
 if (alertWithInstructionsNavigateAnswers == 1) {
  var alertText =
   "INSTRUCTIONS:\n" +
   "*************\n" +
   "Press '" + incrementCountNavigateAnswers + "' to go to the next answer in conversation.\n" +
   "Press '" + decrementCountNavigateAnswers + "' to go to the prior answer.\n\n" +
   "NOTE - use the button near the top left of page to toggle normal and nav mode.";
  alert(alertText);
 }
})();
