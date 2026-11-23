javascript: (function () {
 /* Configurable variables. */
 var incrementCountNavigateAnswers = "PageDown"; /* key for the next answer     */
 var decrementCountNavigateAnswers = "PageUp";   /* key for the previous answer */
 var alertWithInstructionsNavigateAnswers = 1;   /* 1 shows how to use it       */

 /* HOT-GLUE - how the conversation is read. A question is written in a block */
 /* that keeps its line breaks, and an answer in ordinary content blocks.     */
 var questionSelectorNavigateAnswers = "[class*='whitespace-pre-wrap']";
 var contentSelectorNavigateAnswers  =
  "p, h1, h2, h3, h4, h5, h6, ol, ul, pre, table, blockquote";

 /* Names this bookmarklet adds to the page. */
 var keyNavigateAnswers         = "--__-unlikely_-_name-__--NavigateAnswers";
 var buttonIDNavigateAnswers    = "normal-chat" + keyNavigateAnswers;
 var unitAttrNavigateAnswers    = "data-navigate-answers";         /* question or answer */
 var currentAttrNavigateAnswers = "data-navigate-answers-current"; /* the answer shown   */

 /* A second run reads the conversation again and reuses the first run's button. */
 if (window[keyNavigateAnswers]) {
  window[keyNavigateAnswers].rescan();
  return;
 }

 /********************** SUPPORT FUNCTIONS *********************/
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

 /* The first content block inside an element, outside every question. */
 var firstBlockNavigateAnswers = function (within, questions) {
  var blocks = within.querySelectorAll(contentSelectorNavigateAnswers);
  for (var i = 0; i < blocks.length; i++) {
   var inQuestion = questions.some(function (q) { return q.contains(blocks[i]); });
   if (!inQuestion) { return blocks[i]; }
  }
  return null;
 };

 /* Each question and its answer, as the page holds them now. Each pair has */
 /* the elements hidden while another answer is shown, the question hidden  */
 /* while its own answer is shown, and the answer.                          */
 var readConversationNavigateAnswers = function () {
  var pairs = [];
  var main = document.querySelector("main");
  if (!main) { return pairs; }
  var form = main.querySelector("form");
  var questions = [].filter.call(main.querySelectorAll(questionSelectorNavigateAnswers), function (q) {
   var outerQuestion = !(q.parentElement && q.parentElement.closest(questionSelectorNavigateAnswers));
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
     hide: [exchange],
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
     pairs.push({ hide: [exchange, next], question: exchange, answer: next });
    }
   }
  }
  return pairs;
 };

 /* Hide an element, or show it again. */
 var displayNavigateAnswers = function (el, show) {
  if (!el) { return; }
  if (show) {
   el.style.removeProperty("display");
  } else {
   el.style.setProperty("display", "none");
  }
 };

 /* The state of this run, kept on the page so a second run can reuse it. */
 var stateNavigateAnswers = {
  pairs: [],
  count: -1,         /* index of the answer shown, -1 before the first key */
  on: 0,             /* 1 shows one answer at a time, 0 the whole page     */
  started: 0,        /* 1 after the first navigation key press             */
  chatURI: location.href,
  button: null
 };

 /* Mark each question and answer, and forget elements no longer on the page. */
 var markNavigateAnswers = function () {
  var old = document.querySelectorAll("[" + unitAttrNavigateAnswers + "]");
  for (var i = 0; i < old.length; i++) {
   old[i].removeAttribute(unitAttrNavigateAnswers);
   old[i].removeAttribute(currentAttrNavigateAnswers);
  }
  stateNavigateAnswers.pairs = readConversationNavigateAnswers();
  stateNavigateAnswers.pairs.forEach(function (pair) {
   if (pair.question) { pair.question.setAttribute(unitAttrNavigateAnswers, "question"); }
   if (pair.answer) { pair.answer.setAttribute(unitAttrNavigateAnswers, "answer"); }
  });
 };

 /* Show the whole page, or only the current answer. */
 var showNavigateAnswers = function () {
  var pairs = stateNavigateAnswers.pairs;
  for (var i = 0; i < pairs.length; i++) {
   var shown = stateNavigateAnswers.on == 0 || i == stateNavigateAnswers.count;
   pairs[i].hide.forEach(function (el) { displayNavigateAnswers(el, shown); });
   displayNavigateAnswers(pairs[i].question, stateNavigateAnswers.on == 0);
   if (stateNavigateAnswers.on == 1 && i == stateNavigateAnswers.count) {
    pairs[i].answer.setAttribute(currentAttrNavigateAnswers, "1");
   } else {
    pairs[i].answer.removeAttribute(currentAttrNavigateAnswers);
   }
  }
 };

 /* Toggle between one answer at a time and the whole page. */
 var toggleNavigateAnswers = function () {
  if (stateNavigateAnswers.started == 0) { return; }
  stateNavigateAnswers.on = stateNavigateAnswers.on == 1 ? 0 : 1;
  stateNavigateAnswers.button.textContent = stateNavigateAnswers.on == 1 ? "X" : "O";
  showNavigateAnswers();
 };

 /* Move to the next or the previous answer, wrapping at either end. */
 var navigateAnswers = function (keyPress) {
  if (keyPress != incrementCountNavigateAnswers && keyPress != decrementCountNavigateAnswers) {
   return;
  }
  if (location.href != stateNavigateAnswers.chatURI) {
   /* another chat: put this one back and hide the button */
   stateNavigateAnswers.on = 0;
   showNavigateAnswers();
   displayNavigateAnswers(stateNavigateAnswers.button, false);
   return;
  }
  displayNavigateAnswers(stateNavigateAnswers.button, true);
  markNavigateAnswers();
  var total = stateNavigateAnswers.pairs.length;
  if (total == 0) { return; }
  if (stateNavigateAnswers.started == 0) {
   stateNavigateAnswers.started = 1;
   stateNavigateAnswers.on = 1;
  }
  if (stateNavigateAnswers.on == 0) { return; }
  if (stateNavigateAnswers.count < 0 || stateNavigateAnswers.count >= total) {
   stateNavigateAnswers.count = keyPress == incrementCountNavigateAnswers ? 0 : total - 1;
  } else if (keyPress == incrementCountNavigateAnswers) {
   stateNavigateAnswers.count = (stateNavigateAnswers.count + 1) % total;
  } else {
   stateNavigateAnswers.count = (stateNavigateAnswers.count - 1 + total) % total;
  }
  stateNavigateAnswers.button.textContent = "X";
  showNavigateAnswers();
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

 /**************************************************************/
 /*                         MAIN FUNCTION                      */
 /**************************************************************/
 stateNavigateAnswers.button = makeButtonNavigateAnswers();
 markNavigateAnswers();

 document.addEventListener("keydown", function (event) {
  navigateAnswers(event.key);
 });

 window[keyNavigateAnswers] = {
  rescan: function () {
   stateNavigateAnswers.chatURI = location.href;
   displayNavigateAnswers(stateNavigateAnswers.button, true);
   markNavigateAnswers();
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
