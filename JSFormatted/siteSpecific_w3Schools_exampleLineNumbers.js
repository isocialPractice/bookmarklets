javascript:(function() { 
 var textareawrapperW3ExLnNum = document.getElementById("textareawrapper");
 var codeParentW3ExLnNum = document.querySelectorAll("#textareawrapper div.CodeMirror-code");
 var codeLinesW3ExLnNum = document.querySelectorAll("#textareawrapper div.CodeMirror-code pre.CodeMirror-line");
 var codeLinesW3ExLnNumLen = codeLinesW3ExLnNum.length;
 
 /* Style for line numbers.  */
 var styleLineNumbersW3ExLnNum = `
  #lineNumberColW3ExLnNum {
   background-color: #f1f1f1;
   border-right: 2px solid #ccc;
   padding-right: 8px;
   padding-left: 8px;
   padding-top: 28px;
   font-family: Consolas, 'Courier New', monospace;
   font-size: 13px;
   user-select: none;
   transition: all 0.3s ease;
   position: relative;
   min-width: 45px;
   text-align: right;
  }
  
  #lineNumberColW3ExLnNum.collapsed {
   min-width: 20px;
   padding-left: 4px;
   padding-right: 4px;
   overflow: hidden;
  }
  
  #lineNumberColW3ExLnNum.collapsed .lineNumW3ExLnNum {
   opacity: 0;
   font-size: 0;
  }
  
  .lineNumW3ExLnNum {
   color: #666;
   text-align: right;
   height: 19px;
   cursor: default;
   transition: all 0.3s ease;
   padding: 0px;
   font-size: 12px;
   line-height: .75;
  }
  
  .lineNumW3ExLnNum:hover {
   color: #000;
   background-color: #e0e0e0;
  }
  
  #toggleBtnW3ExLnNum {
   position: absolute;
   top: 2px;
   left: 2px;
   right: 2px;
   background-color: #4CAF50;
   color: white;
   border: none;
   padding: 3px 6px;
   cursor: pointer;
   font-size: 11px;
   border-radius: 3px;
   z-index: 10;
  }
  
  #toggleBtnW3ExLnNum:hover {
   background-color: #45a049;
  }
  
  #textareawrapper {
   display: flex !important;
  }
  
  #textareawrapper .CodeMirror-scroll {
   margin-left: 0 !important;
   top: 20px !important;
  }
 `;

 /************************************* SUPPORT FUNCTIONS *************************************/
 /* Insert before div.CodeMirror-code column with line number. */
 const insertLineNumberColW3ExLnNum = () => {
  /* create container for line numbers */
  let lineNumberCol = document.createElement("div");
  lineNumberCol.id = "lineNumberColW3ExLnNum";
  
  /* create toggle button */
  let toggleBtn = document.createElement("button");
  toggleBtn.id = "toggleBtnW3ExLnNum";
  toggleBtn.textContent = "−";
  lineNumberCol.appendChild(toggleBtn);
  
  /* add line number for each code line */
  for (let i = 0; i < codeLinesW3ExLnNumLen; i++) {
   let lineNum = document.createElement("div");
   lineNum.className = "lineNumW3ExLnNum";
   lineNum.textContent = i + 1;
   lineNumberCol.appendChild(lineNum);
  }
  
  /* insert line number column as first child of textareawrapper */
  textareawrapperW3ExLnNum.insertBefore(lineNumberCol, textareawrapperW3ExLnNum.firstChild);
 };

 /* Add style tag, and insert styleLineNumbersW3ExLnNum */
 const addStyleW3ExLnNum = () => {
  let styleTag = document.createElement("style");
  styleTag.innerHTML = styleLineNumbersW3ExLnNum;
  textareawrapperW3ExLnNum.insertAdjacentElement("beforebegin", styleTag);
 };

 /* Allow line number column to expand and collapse */
 const toggleLineNumbersW3ExLnNum = () => {
  let lineNumberCol = document.getElementById("lineNumberColW3ExLnNum");
  let toggleBtn = document.getElementById("toggleBtnW3ExLnNum");
  
  toggleBtn.addEventListener("click", () => {
   /* toggle collapsed class */
   lineNumberCol.classList.toggle("collapsed");
   
   /* update button text */
   if (lineNumberCol.classList.contains("collapsed")) {
    toggleBtn.textContent = "+";
   } else {
    toggleBtn.textContent = "−";
   }
  });
 };

 /* Update line numbers when code lines change */
 const updateLineNumbersW3ExLnNum = () => {
  let lineNumberCol = document.getElementById("lineNumberColW3ExLnNum");
  let toggleBtn = document.getElementById("toggleBtnW3ExLnNum");
  
  /* get current code lines */
  let currentCodeLines = document.querySelectorAll("#textareawrapper div.CodeMirror-code pre.CodeMirror-line");
  let currentLineCount = currentCodeLines.length;
  
  /* get existing line number elements (excluding toggle button) */
  let existingLineNums = lineNumberCol.querySelectorAll(".lineNumW3ExLnNum");
  let existingLineCount = existingLineNums.length;
  
  /* if line count increased, add new line numbers */
  if (currentLineCount > existingLineCount) {
   for (let i = existingLineCount; i < currentLineCount; i++) {
    let lineNum = document.createElement("div");
    lineNum.className = "lineNumW3ExLnNum";
    lineNum.textContent = i + 1;
    lineNumberCol.appendChild(lineNum);
   }
  }
  /* if line count decreased, remove extra line numbers */
  else if (currentLineCount < existingLineCount) {
   for (let i = existingLineCount - 1; i >= currentLineCount; i--) {
    existingLineNums[i].remove();
   }
  }
 };

 /* Watch for changes in code lines and update line numbers */
 const observeCodeChangesW3ExLnNum = () => {
  let codeParent = codeParentW3ExLnNum[0];
  
  /* create mutation observer */
  let observer = new MutationObserver((mutations) => {
   /* check if childList changed (lines added/removed) */
   let shouldUpdate = mutations.some(mutation => mutation.type === 'childList');
   
   if (shouldUpdate) {
    updateLineNumbersW3ExLnNum();
   }
  });
  
  /* start observing code parent for child changes */
  observer.observe(codeParent, {
   childList: true,
   subtree: true
  });
 };

 /*********************************************************************************************
                                          MAIN FUNCTION
 *********************************************************************************************/
 function runW3ExampleLineNumbers() {
  /* add html line number column */
  insertLineNumberColW3ExLnNum();

  /* add style tag */
  addStyleW3ExLnNum();

  /* enable toggle functionality */
  toggleLineNumbersW3ExLnNum();

  /* watch for code changes and update line numbers */
  observeCodeChangesW3ExLnNum();
 }
 
 /* Run the main function. */
 runW3ExampleLineNumbers();
 })(); 
