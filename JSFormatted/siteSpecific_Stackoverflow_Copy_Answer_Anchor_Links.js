javascript: (function () {
 var answers = document.getElementsByClassName("answer");
 var answersLen = answers.length;
 var votingContainer;
 for (i = 0; i < answersLen; i++) {
  votingContainer = answers[i].getElementsByClassName("js-voting-container")[0];
  let anchorButton = document.createElement("a");
  anchorButton.innerHTML = "| # |";
  anchorButton.setAttribute("href", "#" + answers[i].id);
  anchorButton.style.marginTop = "10px";
  anchorButton.style.marginLeft = "12px";
  anchorButton.style.color = "gray";
  votingContainer.insertAdjacentElement("beforeend", anchorButton);
  anchorButton.addEventListener("click", function() {
   setTimeout(function() {
    /* copy href value to clipboard */
    navigator.clipboard.writeText(anchorButton.href);   
   }, 100); 
  });
 }
})();
