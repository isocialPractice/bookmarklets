javascript:(function(){
 /* Declare global variables. */
 var checkPage, docBodyStackUserPlaylist, stackUserPlaylistFeed,
 stackUserPlaylistFeedParClass, stackUserPlaylistFeedTitleClass,
 stackUserPlaylistFeedImageClass, resetMarker;
 /* SUPPORT - DEFINE GLOBALS */
 function defineVarStackUserPlaylist() {
  /* Used to ensure that the page is the user playlist feed. */
  checkPage = location.href;

  /* Used later to add event listener. */
  docBodyStackUserPlaylist = 
   document.getElementsByTagName("body");

  /* To check, insert, remove, or do nothing if alread inserted */
  stackUserPlaylistFeed = 
   document.getElementById("stackUserPlaylistFeed");

  /* Put class names in variables for easier updating. */
  /* Class of parent holding major elements. */
  stackUserPlaylistFeedParClass = 
   "yt-lockup-view-model-wiz yt-lockup-view-model-wiz--vertical yt-lockup-view-model-wiz--collection-stack-2 yt-lockup-view-model-wiz--compact";

  /* Class of parent holding title elements. */
  stackUserPlaylistFeedTitleClass = 
   "yt-lockup-view-model-wiz__metadata";

  /* Class of parent holding the image elements. */
  stackUserPlaylistFeedImageClass =
   "yt-lockup-view-model-wiz__content-image";

  /* Used to reset duplicated title class as to not break loop. */
  resetMarker = 
   "reset--to--title--class"; 
 }
 
 /*****************************************************************
 MAIN FUNCTION
 *****************************************************************/
 /* Select playlist elements by class using variables defined at top. */
 function titleToTopStackUserPlaylistFeed() {
  /* main holding title and image */
  let playlistStack = 
   document.getElementsByClassName(stackUserPlaylistFeedParClass);

  /* title elements */
  let playlistTitle = 
   document.getElementsByClassName(stackUserPlaylistFeedTitleClass);

  /* image elements */
  let contentImage = 
   document.getElementsByClassName(stackUserPlaylistFeedImageClass);

  /* ensure the parent class is same as title class */
  if (playlistTitle.length == playlistStack.length) {
   /* if so loop, select title, copy to top, and remove original */
   for (i = 0; i < playlistStack.length; i++) {
    let curTitle = playlistTitle[i]; /* title */
    let curImage = contentImage[i];  /* image */
    /* move title to top */
    curImage.insertAdjacentElement("beforebegin", curTitle);  

    /* mark for resetting */
    playlistStack[i].children[0].className += " " + resetMarker;
    /* remove original title */
    playlistStack[i].children[2].remove();
   }
  }
  /* select titles with reset mark */
  let resetClassTitle = document.getElementsByClassName(resetMarker);

  /* loop through them */
  for (i = 0; i < resetClassTitle.length; i++) { 
   /* set class name to original class nameof title */
   resetClassTitle[i]
   .setAttribute("class", stackUserPlaylistFeedTitleClass);
  }  
 }
 
 /* Define style elements in tag to insert and make playlist block display. */
 {
 var pageStyle = `
 /* additional styling to match */
 tp-yt-app-drawer {
  border-right: 1px solid lightgray;
  padding-left: 10px;  
 }
 
 div#contents,
 div#contents ytd-rich-item-renderer,
 div#contents div.style-scope.ytd-rich-item-renderer
 {
  display: block !important;
 }
 
 
 div#contents div#content,
 yt-lockup-view-model.ytd-rich-item-renderer.lockup,
 yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz,
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__content-image,
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata,
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div h3 a span,
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata button.yt-spec-button-shape-next,
 div.yt-lockup-metadata-view-model-wiz__text-container,
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div
 {
  display: inline-block !important;
  position: relative;
  margin-bottom: 5px;
 }
 
 div#contents div#content {
   width: auto;
   margin-left: 10px;
 }
 
 ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer {
  margin: 0px;
}
 
 yt-lockup-view-model.ytd-rich-item-renderer.lockup {  
  padding: 15px 5px 10px 15px;
  border-top: 1px solid lightslategray;
  border-bottom: 2px solid lightslategray;
 }
 
 yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz {
  display: inline-block !important;
  width: 1500px;!i;!;
 }
yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz {
 position: relative;
}
yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz a.yt-lockup-view-model-wiz__content-image:first-of-type {
 display: flex;
 position: relative;
 width: 300px;
}
 
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__content-image {   
  padding-bottom: 10px;
  padding-right: 50px;
  border-right: 3px solid lightslategray;
 }
 
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata {
  position: relative !important;
  margin-left: 50px;
  width: 100%;  
  top: 0px;
  display: inline !important;!i;!;
 }
 
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div h3 a span {
  margin-top: 10px;
  padding: 0px;
  font-size: 24pt !important;
  width: 100%;!i;!;
 }
 
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata button.yt-spec-button-shape-next {
   top: 5px;
   left: 35px;
   padding-top: 1px;
   padding-bottom: 38px !important;
   border: 2px solid lightslategray;
 }
 
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div div.yt-content-metadata-view-model-wiz__metadata-row:first-of-type {
  margin-left: 0px !important;
  margin-top: 10px;
 }
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div div.yt-content-metadata-view-model-wiz__metadata-row {   
   padding: 5px 0px;
 }
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div div.yt-content-metadata-view-model-wiz__metadata-row span.yt-core-attributed-string {
   font-size: 15pt;
 }

yt-lockup-metadata-view-model.yt-lockup-metadata-view-model-wiz--vertical.yt-lockup-metadata-view-model-wiz--compact.yt-lockup-metadata-view-model-wiz {
 width: 100%;
}

.yt-lockup-metadata-view-model-wiz__text-container {
    width: 100%;
}

a.yt-lockup-metadata-view-model-wiz__title {
    width: 200%;
}
 }
`;
}
 
 /****** SUPPORT FUNCTION ******/
 /* Check if page is not playlist. */
 function checkForRemoveStackUserPlaylist() {
  if (location.href.indexOf("youtube.com/feed/playlists") == -1) {
   stackUserPlaylistFeed = /* redefine to remove */
    document.getElementById("stackUserPlaylistFeed");
   if (stackUserPlaylistFeed) {
    stackUserPlaylistFeed.remove();
    docBodyStackUserPlaylist[0]
    .removeEventListener("mouseover", removeStackUserPlaylistFeed);
   } else {
    let skip;
   }  
  }
 }

/* Add element to style. */
 function addStackUserPlaylistFeed() {
  /* if user playlist feed */ 
  if (checkPage.indexOf("youtube.com/feed/playlists") > -1) { 
   if (!stackUserPlaylistFeed) {
    /* Insert style element in HTML head if on the right page. */
    let docHead = document.getElementsByTagName("head"); 
 
    /* Creat style element to insert. */
    let styleElement = document.createElement("style");
 
    /* Give id to not duplicate */
    styleElement.id = "stackUserPlaylistFeed";
 
    /* Fill style element with contents form pageStyle variable. */
    styleElement.innerText = pageStyle;  

   
    /* Insert the style needed to stack playlist. */
    docHead[0].insertAdjacentElement("beforeend", styleElement); 

    /* Lastly call function to rearrange elements. */
    titleToTopStackUserPlaylistFeed();
   } else {
    /* Do nothing if alread inserted */
    let skip;
   }
  } else {
   checkForRemoveStackUserPlaylist();
  } 
 }
 /* Call function functions to initiate bookmarklet. */
 defineVarStackUserPlaylist();
 addStackUserPlaylistFeed();
 
 /* Remove on mouseover */
 function removeStackUserPlaylistFeed() {
  defineVarStackUserPlaylist();
  setTimeout(function() { 
   if (location.href.indexOf("youtube.com/feed/playlists") > -1) {
    stackUserPlaylistFeed = /* redefine to remove */
     document.getElementById("stackUserPlaylistFeed");
    if (stackUserPlaylistFeed) {
     let skip;
    } else {
     addStackUserPlaylistFeed();
    }
   } else {
    checkForRemoveStackUserPlaylist();
   }
  }, 100);
 }
 
 /* Add event to remove if not on playlist page. */
 docBodyStackUserPlaylist[0]
 .addEventListener("mouseover", removeStackUserPlaylistFeed);
})();