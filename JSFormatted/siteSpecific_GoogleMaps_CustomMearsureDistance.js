javascript:(function(){
  /* Style values */
  const googleMapsCustomMeasureDistanceStyle = `
   /*all * { cursor: crosshair; } */

   button#custom-measure-btn {
    position: fixed;
    bottom: 150px;
    right: 20px;
    z-index: 20000;
    padding: 12px;
    background: #4285f4;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
   }
  `;

 /************************************* SUPPORT FUNCTIONS *************************************/
 /* Add draw events to map canvas */
 const googleMapsCustomMeasureDistanceDraw = () => {
  /* global variables for inserted script    */
  const googleMapsCustomMeasureDistanceLabelEl = /* select current scale */
   document.getElementById('U5ELMd');
  const googleMapsCustomMeasureDistanceBarEl =   /* get scal in pixels */
   document.querySelector('.Ty7QWe');

  /* notify update not found */
  if (!googleMapsCustomMeasureDistanceLabelEl || !googleMapsCustomMeasureDistanceBarEl)
   return alert('Scale bar not found!');

  let getRatio = () => /* get the ration of pixels to scale */
   parseInt(googleMapsCustomMeasureDistanceLabelEl.innerText.match(/\d+/)[0]) / parseInt(googleMapsCustomMeasureDistanceBarEl.style.width);

  let getUnit = () =>  /* get the digit value of scale      */
   googleMapsCustomMeasureDistanceLabelEl.innerText.replace(/[0-9]|\s/g, '');

  if (document.getElementById('custom-measure-btn')) return; /* no duplicates */

  let btn = /* button to start */
   document.createElement('button');

  /* prepare button */
  btn.id = 'custom-measure-btn'; /* unique identifier */
  btn.innerText = '📏 Custom Measure'; /* data */
  document.body.appendChild(btn); /* add to page */

  /* prepare svg */
  let svg = /* create svg */
   document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = /* style inline*/
  'position:fixed; top:0; left:0; width:100%; height:100%; z-index:19999; pointer-events:none; display:none;';
  document.body.appendChild(svg); /* add to page */

  /* set switches */
  let isDrawingMode = false, activeNode = null, startPt = null;

  /* add click event to button */
  btn.onclick = (e) => {
   e.stopPropagation(); /* toggle */

   /* select inserted style tag */
   let s = document.getElementById("googleMapsCustomMeasureDistanceStyle");

   /* update global cursor style */
   s.innerText = /* determine status */
    isDrawingMode ?
     s.innerText.replace("/*all*/ * { cursor: crosshair; }", "/*all * { cursor: crosshair; } */"):  /* comment out */
     s.innerText.replace("/*all * { cursor: crosshair; } */", "/*all*/ * { cursor: crosshair; }");  /* uncomment   */

   isDrawingMode = /* determine status */
    !isDrawingMode;

   /* config button per status                */
   btn.style.background = /* toggle draw mode */
    isDrawingMode ? '#db4437' : '#4285f4';

   btn.innerText = /* button text */
    isDrawingMode ? '🛑 Stop' : '📏 Draggable Measure';

   svg.style.display = /* show or hide svg */
    isDrawingMode ? 'block' : 'none';

   svg.style.pointerEvents = /* toggle pointer events */
    isDrawingMode ? 'all' : 'none';
  };

  /* line functionality */
  var updateLine = (group) => {
   /* draw line and annotations */
   let p1   = group.childNodes[0]; /* start vector  */
   let p2   = group.childNodes[1]; /* end vector    */
   let line = group.childNodes[2]; /* line & dimen. */
   let txt  = group.childNodes[3]; /* measurement   */

   /* listen for current mouse position */
   let x1 = +p1.getAttribute('cx'); /* current x position */
   let y1 = +p1.getAttribute('cy'); /* current y position */
   let x2 = +p2.getAttribute('cx'); /* end x position     */
   let y2 = +p2.getAttribute('cy'); /* end y position     */

   /* draw the custom line */
   line.setAttribute('x1', x1);
   line.setAttribute('y1', y1);
   line.setAttribute('x2', x2);
   line.setAttribute('y2', y2);

   /* get value of current scale */
   let dist = (Math.sqrt((x2-x1)**2 + (y2-y1)**2) * getRatio()).toFixed(2);

   /* add annotations */
   txt.setAttribute('x', (x1+x2)/2 + 10);
   txt.setAttribute('y', (y1+y2)/2);
   txt.textContent = dist + ' ' + getUnit();
  };

  /* update position for lines */
  svg.onmousedown = (e) => {
   if (e.target.tagName === 'circle') {
    activeNode = e.target;
   } else if (isDrawingMode) {
    if (!startPt) {
     startPt = { /* set starting point */
      x: e.clientX,
      y: e.clientY
    };
    } else {
     let g = /* add svg g element */
      document.createElementNS('http://www.w3.org/2000/svg', 'g');

      /* start and end vectors */
     let c1 = /* add start vector circle indicator */
      createCircle(startPt.x, startPt.y);
     let c2 = /* add end vector circle indicator */
      createCircle(e.clientX, e.clientY);

     /* draw line betwwen vectors */
     let l = /* add svg line element */
      document.createElementNS('http://www.w3.org/2000/svg', 'line');

      /* prepare line */
     l.setAttribute('stroke', '#4285f4');
     l.setAttribute('stroke-width', '4');

     /* distance of line */
     let t = /* add svg text element */
      document.createElementNS('http://www.w3.org/2000/svg', 'text');
     /* inline style text */
     t.style.cssText = 'font:bold 16px sans-serif; paint-order:stroke; stroke:white; stroke-width:4px; pointer-events:none;';

     /* create vector representative circles */
     g.append(c1, c2, l, t);
     svg.appendChild(g);

     /* add  circles at end of line*/
     updateLine(g);

     /* toggle switch */
     startPt = null;
    }
}
  };

  svg.onmousemove = (e) => {
   /* check if moving vector circle */
   if (activeNode) {
    activeNode.setAttribute('cx', e.clientX);
    activeNode.setAttribute('cy', e.clientY);
    updateLine(activeNode.parentNode);
   }
  };

  /* toggle switch */
  window.onmouseup = () => activeNode = null;


  var createCircle = (x, y) => {
   let c = /* create the vector representative circle */
    document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    /* prepare circle */
   c.setAttribute('cx', x);
   c.setAttribute('cy', y);
   c.setAttribute('r', 8);
   c.setAttribute('fill', '#db4437');
   c.style.cursor = 'move';
   return c;
  };
 };

 function googleMapsCustomMearsureDistance() {
  let style = document.createElement("style");
  let script = document.createElement('script');

  /* no duplicates */
  if (document.getElementById("googleMapsCustomMeasureDistanceStyle")) return;

  /* else */
  /* prepare style and script */
  style.setAttribute("id", "googleMapsCustomMeasureDistanceStyle");
  style.innerText = /* use global variable */
   googleMapsCustomMeasureDistanceStyle;

  script.textContent = /* make self calling function */
   '(' + googleMapsCustomMeasureDistanceDraw + ')();';

  /* add style and script to page */
  document.documentElement.prepend(style);
  document.documentElement.appendChild(script);

  /* no need for script after it calls itself */
  script.remove();
 }
 googleMapsCustomMearsureDistance();
})();