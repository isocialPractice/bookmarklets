javascript:(function(){
/* Used to ensure that the page is the user playlist feed. */
 var checkPage = location.href;
 
 /* Define style elements in tag to insert and make playlist block display. */
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
 }
 
 div#contents div#content {
   width: 850%;
   margin-left: 10px;
 }
 
 ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer {
   margin: 0px;
}
 
 yt-lockup-view-model.ytd-rich-item-renderer.lockup {
   width: 100% !important;
   padding: 15px 5px 10px 15px;
   border-top: 1px solid lightslategray;
   border-bottom: 2px solid lightslategray;
 }
 
 yt-lockup-view-model.ytd-rich-item-renderer.lockup div.yt-lockup-view-model-wiz {
   width: 100%;
 }
 
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__content-image {
   width: 10%;
   padding-bottom: 10px;
   padding-right: 50px;
   border-right: 3px solid lightslategray;
 }
 
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata {
   position: absolute !important;
   margin-left: 50px;
 }
 
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div h3 a span {
   width: 150% !important;
   margin-top: 10px;
   padding: 0px;
   font-size: 24pt !important;
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
   display: block !important;
   padding: 5px 0px;
 }
 div.yt-lockup-view-model-wiz div.yt-lockup-view-model-wiz__metadata div div div.yt-content-metadata-view-model-wiz__metadata-row span.yt-core-attributed-string {
   font-size: 15pt;
 }
`;
 
 if (checkPage.indexOf("youtube.com/feed/playlists") > -1) { /* if user playlist feed */
  /* Insert style element in HTML head if on the right page. */
  let docHead = document.getElementsByTagName("head"); 
 
  /* Creat style element to insert. */
  let styleElement = document.createElement("style");
  
  /* Fill style element with contents form pageStyle variable. */
  styleElement.innerText = pageStyle;
  

  docHead[0].insertAdjacentElement("beforeend", styleElement); 
 }
 /* Complete - page should be updated. */ })();