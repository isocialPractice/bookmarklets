javascript: (function () {
 /* Define answers by getting class name. */
 var answers = document.getElementsByClassName("answer");
 var answersLen = answers.length;
 var votingContainer; /* define global var for future use */
 for (i = 0; i < answersLen; i++) {
  /* get the voiting container */
  votingContainer = answers[i].getElementsByClassName("js-voting-container")[0];
  /* create a clickable element */
  let anchorButton = document.createElement("a");
  anchorButton.innerHTML = "| # |";
  anchorButton.setAttribute("href", "#" + answers[i].id);
  /* style a bit */
  anchorButton.style.marginTop = "10px";
  anchorButton.style.marginLeft = "12px";
  anchorButton.style.color = "gray";
  /* add clickable element to page */
  votingContainer.insertAdjacentElement("beforeend", anchorButton);
 }
})();