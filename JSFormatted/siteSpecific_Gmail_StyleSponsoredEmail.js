javascript:(function() {
 /* Define and declare globals in config variables. */
 var rowTextGmailSponsored = "Sponsored";
 var backgroundStyleGmailSponsoredEmail = "rgba(240,128,128,.1)";
 
 /* Keeps recursive styling going. */
 var switchVariableGmailSponsorStyle = 0;
 var sponsorsPositionedAtTopStyleGmailSponsoredEmail = 0;
 
 /* Will be used later. */
 var focalElementGmailSponsorStyle;
 var sponsorRowsMarkedStyleGmailSponsoredEmail;
 var checkRowsMarkedStyleGmailSponsoredEmail;
 
 /* Define table rows for potential styling. */
 var trGmailStyleSponsoredEmail = document.getElementsByTagName("tr");
 var trGmailStyleSponsoredEmailLen = trGmailStyleSponsoredEmail.length;
 
 /******************************************************************************** 
 *                                  MAIN FUNCTION                                *   
 *                    Styles the table row if marked "Sponsored".                *  
 *********************************************************************************/
 function styleSponsorRowsStyleSponsorEmail(recur) {
  if (recur == undefined) { recur = 0; } /* run as normal    */
  
  /* local nested function to recurse parent elements        */
  let toTop = (par) => { 
   if (par.tagName =="TBODY") { /* insert sponsors at top    */
    par.insertAdjacentElement("afterbegin", focalElementGmailSponsorStyle);
    
    /* mark top rows so recurse repeats when changed         */
    focalElementGmailSponsorStyle.dataset.markSponsor =
     1;
   } else { /*                     go to next parent element */   
    toTop(par.parentElement);
   }
  }; 
  /* running idel                                                                */
  if (recur == 1) {   
   checkRowsMarkedStyleGmailSponsoredEmail = /* select number of marked rows     */
    document.querySelectorAll("[data-mark-sponsor]").length;  
  } else { /* run marking rows and adding data attribute for recures toggling    */
   for (i = 0; i < trGmailStyleSponsoredEmailLen; i++) {
    if (trGmailStyleSponsoredEmail[i]  && /* enusre loaded correct               */
        trGmailStyleSponsoredEmail[i].innerText.indexOf(rowTextGmailSponsored) > -1) {
     trGmailStyleSponsoredEmail[i].style.background = /* use config var above     */
      backgroundStyleGmailSponsoredEmail; 

     focalElementGmailSponsorStyle =           /* define declared var above       */
      trGmailStyleSponsoredEmail[i]; 

     /* call local function to main function                                      */ 
     if ( /* if no data  marker                                                   */
          focalElementGmailSponsorStyle.hasAttribute("data-mark-sponsor") == false) { 
      toTop(focalElementGmailSponsorStyle.parentElement); /* place element at top */
     }
    } else {
     /* no need to do anything                                                    */
     let skip;
    }
    if (i >= Number(trGmailStyleSponsoredEmailLen-1)) { /* end recursion          */
     switchVariableGmailSponsorStyle = 1; 
     sponsorRowsMarkedStyleGmailSponsoredEmail = /* select number of marked rows  */
      document.querySelectorAll("[data-mark-sponsor]").length;
    }
   }
  }
 }
 
 /***** Support functions. *****/
 const toggleSwitchVarGmailStyleSponsoredEmail = () => {  
  let theTables = document.getElementsByTagName("table");
  let mailTable = theTables[Number(theTables.length-1)];
  let firstRow = mailTable.getElementsByTagName("tr");
  
  /* condition to toggle switches cand check for row changes */
  if (switchVariableGmailSponsorStyle == 0) {
   if (firstRow[0].hasAttribute("data-mark-sponsor")) {    
    sponsorsPositionedAtTopStyleGmailSponsoredEmail = 1;
   } else {
    sponsorsPositionedAtTopStyleGmailSponsoredEmail = 0; /* rows have changed */
    switchVariableGmailSponsorStyle = 0;      /* continues recurse */
   }
  }
 };
 
 /* repeats main or support functions */
 const recurseGmailStyleSponsoredEmail = (idle) => {
  if (idle == undefined) { idle = "no"; } /* runs doing something  */
  
  /* status check */
  console.log("running");
  if (sponsorsPositionedAtTopStyleGmailSponsoredEmail == 0) {
   if (idle == "no") {
    /* Call main function                                                */
    styleSponsorRowsStyleSponsorEmail();  

    /* Recurse to style if sponsors change.                              */ 
    toggleSwitchVarGmailStyleSponsoredEmail();   
   } else {
    /* keep recurse running */   
    if (checkRowsMarkedStyleGmailSponsoredEmail == sponsorRowsMarkedStyleGmailSponsoredEmail) {
     styleSponsorRowsStyleSponsorEmail(1);
     recurseGmailStyleSponsoredEmail(1);
    } else {
     recurseGmailStyleSponsoredEmail();
    }   
   }
  } else {
   if (switchVariableGmailSponsorStyle == 0 && /* both switches are off */
       sponsorsPositionedAtTopStyleGmailSponsoredEmail == 0
      ) {
    /* call recurse again                                               */
    recurseGmailStyleSponsoredEmail();
   } else {
    /* reset turning switches off                                       */
    switchVariableGmailSponsorStyle = 0;
    sponsorsPositionedAtTopStyleGmailSponsoredEmail = 0;
    /* and call recurse again                                           */
    recurseGmailStyleSponsoredEmail(1);
   }
  }
 };
 /*Make intitial call. */ 
 recurseGmailStyleSponsoredEmail();
 
 /* Recurse functions after initial call. */
 var recurseVarGmailStyleSponsoredEmail = setInterval(function() { recurseGmailStyleSponsoredEmail(); }, 5000);

})(); 