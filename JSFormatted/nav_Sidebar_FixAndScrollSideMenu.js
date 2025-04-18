javascript:(function() {  
 /* HTML DOM variables. */ 
 var headSidebarFixAndScrollSideMenu  = /* select head element */
  document.getElementsByTagName("head");
 
 /* Create HTML variables. */
 var styleSidebarFixAndScrollSideMenu = /* create style tag    */
  document.createElement("style");
 
 /* CSS to be inserted in created style element. */
 var cssSidebarFixAndScrollSideMenu   = /* side nav css style  */
`
 nav, aside:first-of-type {
  height: 80%;
  position: sticky !important;
  top: 0 !important;
  overflow-y: auto;
  max-height: 800px !important;
  left: 10px !important;
  margin-left: 0 !important;
  z-index: 1
 }
 nav a.active,
 aside:first-of-type a.active {
  top: 0 !important
 }

 /* 
  Designing for scroll-bar thanks to:
  https://www.geeksforgeeks.org/how-to-change-the-position-of-scrollbar-using-css/ 
 */
 ::-webkit-scrollbar {
   width: 5px;
 }

 /* Track */
 ::-webkit-scrollbar-track {
   border-radius: 5px; 
 }

 /* Handle */
 ::-webkit-scrollbar-thumb {
   background: white;
   border-radius: 5px;
 }

 /* Handle on hover */
 ::-webkit-scrollbar-thumb:hover {
   background: #555;
 } 
`;

 /* Add CSS to style tag to be inserted. */
 styleSidebarFixAndScrollSideMenu.innerText = /* use css from above */
  cssSidebarFixAndScrollSideMenu;
 
 /* Insert the style tag to end of head element. */
 headSidebarFixAndScrollSideMenu[0]
 .appendChild(styleSidebarFixAndScrollSideMenu);
})(); 