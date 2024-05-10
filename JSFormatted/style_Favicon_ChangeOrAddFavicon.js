javascript: (function () {
 var faviconImageURL = "CHANGE"; /* CHANGE - url where image is located. Locally hosted urls will work. */ 
 /******************************
 EXAMPLE - url that uses this repos favicon as the changed or added favicon for a website: 
 var faviconImageURL = "https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/favicon.png";
 *******************************/
 
 /* Append a link tag to head HTML tag and done. */
 document.getElementsByTagName("head")[0].innerHTML += 
  "<link rel='icon' href='" + 
   faviconImageURL + 
   "' type='image/x-icon'>"; 
})();