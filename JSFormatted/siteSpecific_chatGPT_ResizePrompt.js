javascript: (function () {
 /******************** SET CUSTOM RESIZE VALUES *********************************/
 var setMaxHeightChatGPTResizePrompt = "600px"; /* tallest the prompt box can grow or be dragged to */
 var setMinHeightChatGPTResizePrompt = "40px";  /* shortest it can be dragged to                   */

 /* HOT-GLUE - how the prompt box is found: the editable element in the prompt form. */
 var editorSelectorChatGPTResizePrompt = "[contenteditable='true'], textarea";

 /* Names this bookmarklet adds to the page. */
 var keyChatGPTResizePrompt      = "--__-unlikely_-_name-__--ChatGPTResizePrompt";
 var markAttrChatGPTResizePrompt = "data-resize-prompt";

 /* A second run puts the prompt box back as it was. */
 if (window[keyChatGPTResizePrompt]) {
  window[keyChatGPTResizePrompt].restore();
  delete window[keyChatGPTResizePrompt];
  return;
 }

 /* The prompt form and the editor in it. */
 var formChatGPTResizePrompt =
  document.querySelector("main form") || document.querySelector("form");
 if (!formChatGPTResizePrompt) { return; }
 var editorChatGPTResizePrompt =
  formChatGPTResizePrompt.querySelector(editorSelectorChatGPTResizePrompt);
 if (!editorChatGPTResizePrompt) { return; }

 /* The box the prompt scrolls in: the nearest element around the editor, */
 /* inside the form, that scrolls. Without one, the editor's own parent.  */
 var boxChatGPTResizePrompt = null;
 var aroundChatGPTResizePrompt = editorChatGPTResizePrompt.parentElement;
 while (aroundChatGPTResizePrompt && aroundChatGPTResizePrompt != formChatGPTResizePrompt) {
  var overflowChatGPTResizePrompt = getComputedStyle(aroundChatGPTResizePrompt).overflowY;
  if (overflowChatGPTResizePrompt == "auto" || overflowChatGPTResizePrompt == "scroll") {
   boxChatGPTResizePrompt = aroundChatGPTResizePrompt;
   break;
  }
  aroundChatGPTResizePrompt = aroundChatGPTResizePrompt.parentElement;
 }
 if (!boxChatGPTResizePrompt) {
  boxChatGPTResizePrompt = editorChatGPTResizePrompt.parentElement;
 }

 /* Keep the box's own inline style, to put back on the second run. */
 var savedStyleChatGPTResizePrompt = boxChatGPTResizePrompt.getAttribute("style");

 /* Make the box resizable from its corner, growing to the set height. */
 var resizeStyleChatGPTResizePrompt = {
  "resize": "vertical",
  "overflow-y": "auto",
  "min-height": setMinHeightChatGPTResizePrompt,
  "max-height": setMaxHeightChatGPTResizePrompt
 };
 Object.keys(resizeStyleChatGPTResizePrompt).forEach(function (prop) {
  boxChatGPTResizePrompt.style.setProperty(prop, resizeStyleChatGPTResizePrompt[prop], "important");
 });
 boxChatGPTResizePrompt.setAttribute(markAttrChatGPTResizePrompt, "box");

 /* Kept on the page so the second run can find what to put back. */
 window[keyChatGPTResizePrompt] = {
  restore: function () {
   if (savedStyleChatGPTResizePrompt === null) {
    boxChatGPTResizePrompt.removeAttribute("style");
   } else {
    boxChatGPTResizePrompt.setAttribute("style", savedStyleChatGPTResizePrompt);
   }
   boxChatGPTResizePrompt.removeAttribute(markAttrChatGPTResizePrompt);
  }
 };
})();
