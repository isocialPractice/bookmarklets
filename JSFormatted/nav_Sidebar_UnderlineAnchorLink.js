javascript:(function(){ 
 var a = document.getElementsByTagName("a");
 var aLen = a.length;
 var oneCheck = 0; /* likely navlink will be first in DOM */
 for (i = 0; i < a.length; i++) {
  /* Check once on page load and underline if found. */
  if ( 
    a[i].href.indexOf(location.href.substr(location.href.lastIndexOf("#")+1)) > -1 &&
    oneCheck == 0
   ) {
   a[i].style.textDecoration = "underline";
   oneCheck = 1;
  }
  /* After underline onclick if anchor link. */
  a[i].addEventListener("click", function() {
   if (this.href.indexOf("#") > -1) {
    for (j = 0; j < aLen; j++) {
     if (a[j].href.indexOf("#") > -1) {
      a[j].style.textDecoration = "";
     }
    }
    this.style.textDecoration = "underline";
   }
  }); 
 }
})();