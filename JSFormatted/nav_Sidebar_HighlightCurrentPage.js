javascript: (function () {
 var styleBackground = "white";/*<<-- CHANGE*/
 var styleColor = "black";/*<<-- CHANGE*/
 var pathName = location.pathname; 
 var allATags = document.getElementsByTagName("a");
 for (i = 0; i < allATags.length; i++) {
  let currentATag = allATags[i];
  let currentHref = currentATag.href;
  if (currentHref.indexOf(pathName) > -1) {
   currentATag.style.background = styleBackground;
   currentATag.style.color = styleColor;
  }
 }
}
)();