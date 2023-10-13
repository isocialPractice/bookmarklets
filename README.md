# Browser Bookmarklets

This is a running list of browser bookmarklets. Below each listed 
bookmarklet is a collapsible section with the bookmarklet ready 
to copy and paste. The root of the repo contains the bookmarklets
ready to use. In the folder JSFormatted are the bookmarklets as 
uncondensed JavaScript.

<em>ctrl + click</em> for more info on [Browser Bookmarklets](https://subsimple.com/bookmarklets/index.php). <br>
<em>ctrl + click</em> for more info on [Making Bookmarklets](https://gist.github.com/caseywatts/c0cec1f89ccdb8b469b1).

In short a bookmarklet is saved as a browser bookmark, but in 
lieu of URL is condensed JavaScript. When on a page select the
bookmark (<em>best to have bookmarklets on bookmark bar</em>) where
the bookmarklet was saved. This will then change the current page in
the browser according to the bookmarket's JavaScript. Below are two 
blank canvas bookmarklet ready to copy/paste: <br>
<strong>IMPORTANT</strong> - Ensure final JS is condensed (<em>one line little space</em>):

<strong>JS Formatted:</strong>
```markdown
javascript:(function(){ 
/*
 INSTURCTIONS:
  Copy paste 
  Add JavaScript
  When done condense the JavaScript
  Make new bookmark in browser
  Name then paste final condensed JS in lieu of URL
*/ })();
```
<br>

<strong>Condensed Ready:</strong>
```markdown
javascript:(function() {  })();
```

## Navigation Sidebar Bookmarklets
The below bookmarklets are for pages withe a side nav with many links.
Copy and paste (<em>making any needed adjustments</em>) to use.

### Highlight Current Page:
If a page has side navigation that doesn't hightlight the current page
then use this bookmarklet:
<details>

<summary>nav_Sidebar_HighlightCurrentPage.js</summary>
<br>

Gist page for [nav_Sidebar_HighlightCurrentPage.js](https://gist.github.com/jhauga/716cd39dc31ac9f607993f709cc48f60)

```markdown
javascript:(function(){var styleBackground="white";/*<<--CHANGE*/var styleColor="black";/*<<--CHANGE*/var pathName=location.pathname;var allATags=document.getElementsByTagName("a");for(i=0;i<allATags.length;i++){let currentATag=allATags[i];let currentHref=currentATag.href;if(currentHref.indexOf(pathName)>-1){currentATag.style.background=styleBackground;currentATag.style.color=styleColor;}}})();
```

</details>