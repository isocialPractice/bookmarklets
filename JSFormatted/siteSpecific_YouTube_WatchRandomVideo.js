javascript:(function() {
 /* Config variable - 1 to oepn in new tab, 0 to not.     */
 var openInNewTabWatchRandomVideo = 1;

 /* Thumbnail links of the videos listed on the page. The lockup class comes first, which is what
    the home feed, a channel's videos and the related videos all use; the older lockup class and
    the search results' thumbnail follow. Only watch links count, so a short is never picked.   */
 var videoFeedWatchRandomVideo = /* HOT-GLUE - may change */
  document.querySelectorAll(
   "a.ytLockupViewModelContentImage[href*='/watch?v='], " +
   "a.yt-lockup-view-model__content-image[href*='/watch?v='], " +
   "a#thumbnail[href*='/watch?v=']"
  );

 /* Length of all videos in home feed. */
 var videoFeedWatchRandomVideoLen = videoFeedWatchRandomVideo.length;

 /* Generate random value using length. */
 var randomValWatchRandomVideo = 
  Math.floor(Math.random() * videoFeedWatchRandomVideoLen);

 /******************************************************************************************
  MAIN FUNCTION
  ******************************************************************************************/
 function watchRandomVideo(target) {
  /* Make sure video links are loaded.                                               */
  if (videoFeedWatchRandomVideo.length >= 1 && /* at least one loaded                */
      videoFeedWatchRandomVideo[0].hasAttribute("href") /* good guess load correctly */
     ) {
   /* get video link                                                                 */
   let videoURL = 
     videoFeedWatchRandomVideo[randomValWatchRandomVideo].href;

   /* watch random video                                                             */
   window.open(videoURL, target);
  } else {
   /* say why nothing opened: a signed-out home feed lists no videos at all          */
   alert("Watch Random Video: there are no videos on this page to choose from.");
  }
 }

 /* Check if configured to open in new tab.                                          */
 if (openInNewTabWatchRandomVideo == 1) {
  /* if so, open in new tab                                                          */
  watchRandomVideo("_blank");
 } else {
  /* if not, open in current window                                                  */ 
  watchRandomVideo("_self");
 }
})(); 