javascript:(function() {
 /* Configuration Variable - set final quality of video. */
 var finalQualityYouTubeSyncAudio = "720p";
 
 /* Select video settings by class name.     */
 var settingsYouTubeSyncAudio = 
  document.getElementsByClassName("ytp-button ytp-settings-button");

 /* Select menu for quality using class name. */
 var menuItemYouTubeSyncAudio = 
  document.getElementsByClassName("ytp-menuitem");

 /************************************************
  MAIN FUNCTION
  ************************************************/
 /* Click by argument being found in loop. */ 
 function changeQualityYouTubeSyncAudio(clickWhat) { 
  /* loop all menu items found by class name */
  for (i = 0; i < menuItemYouTubeSyncAudio.length; i++) {

   /* if text in menu item found matching argument, click */
   if (
    menuItemYouTubeSyncAudio[i]
    .textContent
    .indexOf(clickWhat) > -1
   ) {
    /* menu item matches argument, click and end loop */
    menuItemYouTubeSyncAudio[i].click();
    break;
   }
  }
 }

 /* Start process to sync video to audio. */
 const syncVideoToAudioYouTubeSyncAudio = (step) => {    
  /* conditional steps for process                             */
  if (step == "Quality") {
   /* allow a bit of delay for menu dynamics                   */
   setTimeout(function() {
    /* click video settings gear icon                          */
    settingsYouTubeSyncAudio[0].click(); 
   }, 100);
  }
  /* run main function to sync audio, resetting video quality, */   
  /* allowing a bit of delay for menu dynamics                 */
  setTimeout(function() {
   changeQualityYouTubeSyncAudio(step);  
  }, 300);
 };

 /* Select video settings icon at bottom of video.                  **/
 syncVideoToAudioYouTubeSyncAudio("Quality");
 
 /* Set video to 144p.                                              **/
 syncVideoToAudioYouTubeSyncAudio("144p");
 
 /* Additional delay to ensure menu dynamics.                       **/
 setTimeout(function() {
  /* Again select video settings icon at bottom of video.           **/
  syncVideoToAudioYouTubeSyncAudio("Quality");
 
  /* Set final video to config var. finalQualityYouTubeSyncAudio.    */
  syncVideoToAudioYouTubeSyncAudio(finalQualityYouTubeSyncAudio);
 }, 1000);
})(); 