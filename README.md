### Status:

  - **Existing bookmarklets**: Low Maintenance (*some may not work*)
  - **New bookmarklets**: Active

# Browser Bookmarklets ![repo icon](favicon.png)
<!-- Navigation -->
<details>

<summary>Document Navigation: </summary>

- [DOM Bookmarklets](#dom-bookmarklets)
  - [Clipboard - Convert Page To Markdown](#clipboard-convert-page-to-markdown) - ready to use
  - [Clipboard - Log Make Md Link List](#clipboard-make-md-link-list) - ready to use
  - [Clutter - Click To Hide](#clutter---click-to-hide) - ready to use
  - [Note - Take Page Notes](#note-take-page-notes) - ready to use
  - [Parse - Dom Stop Page Parsing](#parse---dom-stop-page-parsing) - ready to use
  - [Parse - Dom Stop Page Parsed Height](#parse---dom-stop-page-parsed-height) - ready to use
  - [Search - Search Page](#search---search-page) - ready to use
  - [Video - Dom Take Video Notes](#video---dom-take-video-notes) - ready to use
- [Navigation Bookmarklets](#navigation-bookmarklets)
  - [Sidebar - Fix And Scroll Side Menu](#sidebar---fix-and-scroll-side-menu) - ready to use
  - [Sidebar - Highlight Current Page](#sidebar---highlight-current-page) - ready to use
  - [Sidebar - Underline Anchor Linke](#sidebar---underline-anchor-link) - ready to use
- [Style Bookmarklets](#style-bookmarklets)
  - [Favicon - Change or Add Favicon](#favicon---change-or-add-favicon) - requires 1 change(s)
- [Site Specific Bookmarklets](#site-specific-bookmarklets)
  - [Amazon Hide Video Pause Icon](#amazon-hide-video-pause-icon) - ready to use
  - [ChatGPT - Bookmark a specific response](#chatgpt---bookmark-a-specific-response) - requires 1 change
  - [ChatGPT - Navigate Answers](#chatgpt--navigate-answers) - ready to use
  - [ChatGPT - Paste Ready Bookmark Response](#chatgpt---paste-ready-bookmark-response) - ready to use
  - [ChatGPT - Resize Prompt](#chatgpt---resize-prompt) - ready to use
  - [ChatGPT - Search Chat History](#chatgpt---search-chat-history) - ready to use
  - [GitHub - Alternate Row Color](#github---alternate-row-color) - ready to use
  - [GitHub - Commit Date Timestamp](#github---commit-date-timestamp) - ready to use
  - [GitHub - List Old Newest Commits](#github---list-old-newest-commits) - ready to use
  - [GitHub - Navigate Commits Sequentially](#github---navigate-commits-sequentially) - ready to use
  - [GitHub - Resize Repo Table Columns](#github---resize-repo-table-columns) - ready to use
  - [GitHub - Show File Size](#github---show-file-size) - ready to use
  - [Gmail - Expand Label Folder Mouse Move Email](#gmail---expand-label-folder-mouse-move-email) - ready to use 
  - [Gmail - Resize Side Bar](#gmail---resize-side-bar) - ready to use
  - [Gmail - Style Sponsored Email](#gmail---style-sponsored-email) - ready to use
  - [Google - Paste Ready Bookmark AI Response](#google---paste-ready-bookmark-ai-response) - ready to use
  - [Google Maps Custom Mearsure Distance](#google-maps---custom-mearsure-distance) - ready to use
  - [OctoPrint - Change Graph Image](#octoprint---change-graph-image) - ready to use - <em>1 optional change</em>
  - [Stackoverflow - Add Answer Anchor Links](#stackoverflow---add-answer-anchor-links) - ready to use
  - [Stackoverflow - Copy Answer Anchor Links](#stackoverflow---copy-answer-anchor-links) - ready to use
  - [w3Schools - Example Line Numbers](#w3schools---example-line-numbers) - ready to use
  - [w3Schools - hide Side Bar](#w3schools---hide-side-bar) - ready to use
  - [YouTube - Add Time Marks](#youtube---add-time-marks) - ready to use
  - [YouTube - Darken Bottom Controls](#youtube---darken-bottom-controls) - ready to use
  - [YouTube - Dynamic History Search](#youtube---dynamic-history-search) - ready to use
  - [YouTube - Hide Short History](#youtube---hide-short-history) - ready to use
  - [YouTube - Save Page Notes to Local Storage](#youtube---save-page-notes-to-local-storage) - ready to use
  - [YouTube - Saved Page Notes to Notebox](#youtube---saved-page-notes-to-notebox) - ready to use
  - [YouTube - Short Hover Title](#youtube---short-hover-title) - ready to use
  - [YouTube - Show Short Release Date](#youtube---show-short-release-date) - ready to use
  - [YouTube - Stack User Playlist Feed](#youtube---stack-user-playlist-feed) - ready to use
  - [YouTube - Sync Audio](#youtube---sync-audio) - ready to use
  - [YouTube - Take Notes and Add Removable Time Marks](#youtube---take-notes-and-add-removable-time-marks) - ready to use
  - [YouTube - Take Video Notes](#youtube---take-video-notes) - ready to use
  - [YouTube - Top Subscription Toggle Btn](#youtube---top-subscription-toggle-btn) - ready to use
  - [YouTube - Watch Random Video](#youtube---watch-random-video) - ready to use
- [Window Bookmarklets](#window-bookmarklets)
  - [Page Offset - Custom Page Down](#page-offset---custom-page-down) - ready to use
  - [Style - Bold Selected Text](#style---bold-selected-text) - ready to use
  - [Style- Highlight Selected Text](#style--highlight-selected-text) - ready to use
  - [Style - Italic Selected Text](#style---italic-selected-text) - ready to use
  - [Style - Underline Selected Text](#style---underline-selected-text) - ready to use
  - [URI - Anchor Higlighted Text](#uri---anchor-higlighted-text) - ready to use
</details>

<!-- Ready to Use Demo -->
<div>
<details>
<summary>Video Demonstration for Ready to Use Bookmarklets</summary>

![ready to use demo](support/Demo-ReadyToUse.gif)
</details>
</div>
<!-- Description -->
<div>

`Ctrl + click` to see example of some [bookmarklets](https://isocialpractice.github.io/bookmarklets/)

This is a running list of browser bookmarklets. Each bookmarklet lives
in the folder JSFormatted as readable JavaScript, and each entry below
links to its raw file.

- `Ctrl + click` for more info on [Browser Bookmarklets](https://en.wikipedia.org/wiki/Bookmarklet)
- `Ctrl + click` for more info on [Making Bookmarklets](https://gist.github.com/caseywatts/c0cec1f89ccdb8b469b1)

In short a bookmarklet is saved as a browser bookmark, but in
lieu of URL is JavaScript. When on a page select the bookmark
(<em>best to have bookmarklets on bookmark bar</em>) where the
bookmarklet was saved. This will then change the current page in
the browser according to the bookmarklet's JavaScript.

<strong>To use one:</strong> open its raw file link, press `Ctrl + A` then
`Ctrl + C`, make a new bookmark, and paste in lieu of URL. Line breaks are
fine; there is no need to condense the code.

<strong>NOTE</strong> - if modifying, use only block comments
(<code>/* */</code>, never <code>//</code>) and end statements with
semicolons, so the code still works once the browser removes the line
breaks. Below is a blank canvas bookmarklet ready to copy/paste:

```js
javascript:(function(){
/*
 INSTRUCTIONS:
  Copy paste
  Add JavaScript
  Make new bookmark in browser
  Name then paste the JavaScript in lieu of URL
*/ })();
```
</div>
<hr><br>
<!-- START BOOKMARKLETS -->

# DOM Bookmarklets:

<div>
The below bookmarklets are for pages with parsed DOM content,
or when editing the structure and/or adjusting HTML DOM.

Clipboard Convert Page To Markdown:
----
<dl><dd><dl><dd>

Convert a web page to Markdown. If the page is not very simple, post edits will probably be need; but this bookmarklet is good enough to get started <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [dom_Clipboard_ConvertPageToMarkdown.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/dom_Clipboard_ConvertPageToMarkdown.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [dom_Clipboard_ConvertPageToMarkdown.js](https://gist.github.com/jhauga/46e9f1ad5626d49de81754f0307452e9)

</dd></dl></dd></dl>

Clipboard Make Md Link List:
----
<dl><dd><dl><dd>

Getting documentation links as a markdown list, with sections applied <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [dom_Clipboard_MakeMdLinkList.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/dom_Clipboard_MakeMdLinkList.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [dom_Clipboard_MakeMdLinkList.js](https://gist.github.com/jhauga/7d0f3aa4e78e29a8309dbfea7cfb366a)

</dd></dl></dd></dl>

Clutter - Click To Hide:
----
<dl><dd><dl><dd>

Hiding pop-ups, banners, ads, and other clutter on any page by clicking them, with undo. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [dom_Clutter_ClickToHide.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/dom_Clutter_ClickToHide.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [dom_Clutter_ClickToHide.js](https://gist.github.com/jhauga/95d74982e82a5a825bc3ccd65542a835)

</dd></dl></dd></dl>

Note Take Page Notes:
----
<dl><dd><dl><dd>

When learning something new, and want to take notes on it. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [dom_Note_TakePageNotes.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/dom_Note_TakePageNotes.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [dom_Note_TakePageNotes.js](https://gist.github.com/jhauga/52661cda4f5340a8023ffee94ece792b)

</dd></dl></dd></dl>

Parse - Dom Stop Page Parsing:
----
<dl><dd><dl><dd>

Page usese lazy loading and prevnet parsed content as scrolling down, making it hard to ready last few posts or footer from being viewed <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [dom_Parse_DomStopPageParsing.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/dom_Parse_DomStopPageParsing.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

Loosely Teste on [taxnotes.com](https://www.taxnotes.com/). <br>
Page tested - **[Featured News](https://www.taxnotes.com/featured-news)**.

<!-- PASTE VIDEO HERE -->

Gist page for [dom_Parse_DomStopPageParsing.js](https://gist.github.com/jhauga/bd8d1598d8731d242e0f18100b27edd9)

</dd></dl></dd></dl>

Parse - Dom Stop Page Parsed Height:
----
<dl><dd><dl><dd>

Page loads parsed content as scrolling down, making it hard to ready last few posts and preventing footer from being viewed <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [dom_Parse_DomStopPageParsedHeight.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/dom_Parse_DomStopPageParsedHeight.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

Loosely Teste on [taxnotes.com](https://www.taxnotes.com/). <br>
Page tested - **[Featured News](https://www.taxnotes.com/featured-news)**.

<!-- PASTE VIDEO HERE -->

Gist page for [dom_Parse_DomStopPageParsedHeight.js](https://gist.github.com/jhauga/e150dbfc1471cfd4d62367ea3084aa19)

</dd></dl></dd></dl>

Search - Search Page:
----
<dl><dd><dl><dd>

Search long documentation pages by headings (*default*), showing following elements that are not headings.
If no default elements are found, select the are to be searched manually (*a prompt will appear*).
Click and drag to adjust top position (*range of 40px to 150px*).<br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [dom_search_page.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/dom_search_page.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [dom_search_page.js](https://gist.github.com/jhauga/7e3af6f91cc931f492d0615367612627)

</dd></dl></dd></dl>

Video - Dom Take Video Notes:
----
<dl><dd><dl><dd>

Take notes on a html page with video tag or iframe playing video or videos. <br><br>
<strong>NOTE</strong> - best to use `Shift` key to activate note box.

### <ins>Keyboard Shortcuts</ins>

<strong>Play/pause</strong> - `Ctrl, Shift` (*one at a time*). <br>
<strong>Copy Notes to Clipboard</strong> - ` Alt + a ` .<br>
<strong>Scroll to Video</strong> - `f, v` or `s, v` (*one at a time*). <br>

<strong>USE - ready to use</strong>

Copy/paste: open [dom_Video_DomTakeVideoNotes.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/dom_Video_DomTakeVideoNotes.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

Page tested - **[Chrome for Developers](https://developer.chrome.com/docs/devtools/overrides)**.

<!-- PASTE VIDEO HERE -->

Gist page for [dom_Video_DomTakeVideoNotes.js](https://gist.github.com/jhauga/5a246efafe3dd894c93d6725978651a1)

</dd></dl></dd></dl>

</div>
<hr><br>

# Navigation Bookmarklets:

<div>
The below bookmarklets are for pages with a side nav with many links.
Copy and paste (<em>making any needed adjustments</em>) to use.

Sidebar - Fix And Scroll Side Menu:
----
<dl><dd><dl><dd>

Fix side navigation and aside to position of page, and make it scrollable. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [nav_Sidebar_FixAndScrollSideMenu.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/nav_Sidebar_FixAndScrollSideMenu.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [nav_Sidebar_FixAndScrollSideMenu.js](https://gist.github.com/jhauga/68d76f72d3adfebfb99cc34b459e2cc6)

</dd></dl></dd></dl>

Sidebar - Highlight Current Page:
----
<dl><dd><dl><dd>

If a page has side navigation that doesn't hightlight the current page
then use this bookmarklet: <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [nav_Sidebar_HighlightCurrentPage.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/nav_Sidebar_HighlightCurrentPage.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [nav_Sidebar_HighlightCurrentPage.js](https://gist.github.com/jhauga/716cd39dc31ac9f607993f709cc48f60)

</dd></dl></dd></dl>

Sidebar - Underline Anchor Link:
----
<dl><dd><dl><dd>

If a page has a side navigation with many anchor links, which do not underline
when clicked use this bookmarklet: <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [nav_Sidebar_UnderlineAnchorLink.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/nav_Sidebar_UnderlineAnchorLink.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [nav_Sidebar_UnderlineAnchorLink.js](https://gist.github.com/jhauga/34b965a0e2a49fdf075fdf44d15306d0)

</dd></dl></dd></dl>
</div>
<hr><br>

# Style Bookmarklets

<div>
The below bookmarklets are to change style elements (<em>images, background, text, etc.</em>) of a web page.
Copy and paste (<em>making any needed adjustments</em>) to use.

Favicon - Change or Add Favicon:
----
<dl><dd><dl><dd>

Change or add a website favicon. For fun or to help identify sites by tab or bookmark icons; e.g. add an icon to appear in bookmarks when bookmarking a site without a favicon. Works with:

1. Remote URL - website or application
2. Local URL - locally hosted website or application

<strong>USE - requires 1 change</strong>

Copy/paste: open [style_Favicon_ChangeOrAddFavicon.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/style_Favicon_ChangeOrAddFavicon.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

<strong>Required \(x1\)</strong>
 1. Change value of `faviconImageURL` variable to image's url.

Gist page for [style_Favicon_ChangeOrAddFavicon.js](https://gist.github.com/jhauga/82ddb109ee790c2a3670457a8cbbff73)

</dd></dl></dd></dl>
</div>
<hr><br>

# Site Specific Bookmarklets:

<div>
The below bookmarklets will only work when used on the website specified.

Amazon Hide Video Pause Icon:
----
<dl><dd><dl><dd>

Hide Amazon product video pause icon when video is instructional, and you want to take screenshots; but pause icon obscures image <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_Amazon_HideVideoPauseIcon.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_Amazon_HideVideoPauseIcon.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_Amazon_HideVideoPauseIcon.js](https://gist.github.com/jhauga/298d732bea258a5948c984535895511d)

</dd></dl></dd></dl>

ChatGPT - Bookmark a specific response
----
<dl><dd><dl><dd>

Bookmark ChatGPT response as basic text or HTML. Change variable textOut to 1 for text and 0 for HTML.
If any error, escape quotes and special characters in text and repaste. <br><br>

<strong>USE - requires 1 change </strong>

Copy/paste: open [siteSpecific_chatGPT_BookmarkResponse.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_chatGPT_BookmarkResponse.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

<strong>Required \(x1\)</strong>
 1. Paste response from clipboard in lieu of "PASTE_RESPONSE".

<strong>Optional \(x2\)</strong>
 1. Change "DEFAULT_TITLE"
 2. Change ``textOut`` variable \(<em>i.e. HTML not parsing right</em>\).

<strong>NOTE</strong> - two spaces in pasted text will add line break.<br>

Gist page for [siteSpecific_chatGPT_BookmarkResponse.js](https://gist.github.com/jhauga/328eccd84d072664c68bf2079fd11bab)

</dd></dl></dd></dl>

ChatGPT- Navigate Answers:
----
<dl><dd><dl><dd>

Navigate through long chatGPT conversations one answer at a time. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_chatGPT_NavigateAnswers.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_chatGPT_NavigateAnswers.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_chatGPT_NavigateAnswers.js](https://gist.github.com/jhauga/ada256a97a9725a7ba117de31909b4cd)

</dd></dl></dd></dl>

ChatGPT - Paste Ready Bookmark Response:
----
<dl><dd><dl><dd>

Copy a ready bookmarklet to the clipboard. Once run all copied answers will be copied and ready to paste as new bookmarklet. Works with:

1. ChatGPT - Resize Prompt

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_chatGPT_PasteReadyBookmarkResponse.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_chatGPT_PasteReadyBookmarkResponse.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<strong>Video Demonstration for Use:</strong>

`Ctrl + click` link to view demo on YouTube [ChatGPT - Paste Ready Bookmark Response](https://youtu.be/0aGQyrg7vo0)

Gist page for [siteSpecific_chatGPT_PasteReadyBookmarkResponse.js](https://gist.github.com/jhauga/d8c3b593e6a7d38d2338b8092e86e3e2)

</dd></dl></dd></dl>

ChatGPT - Resize Prompt
----
<dl><dd><dl><dd>

Resize the ChatGPT text prompt. Works with:

1. ChatGPT - Paste Ready Bookmark Response

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_chatGPT_ResizePrompt.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_chatGPT_ResizePrompt.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_chatGPT_ResizePrompt.js](https://gist.github.com/jhauga/edf8e8a842ebe8b00e1a5ff3ec24892c)

</dd></dl></dd></dl>

ChatGPT - Search Chat History:
----
<dl><dd><dl><dd>

Search titles of chat history when chat history gets long. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_chatGPT_SearchChatHistory.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_chatGPT_SearchChatHistory.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_chatGPT_SearchChatHistory.js](https://gist.github.com/jhauga/90ccd5e537c2bd08e5a9427c82d437ae)

</dd></dl></dd></dl>

GitHub - Alternate Row Color:
----
<dl><dd><dl><dd>

Alternate the row colors of repo directory. Activate in repo root and file viewing. Works with:

1. GitHub - Commit Date Timestamp
2. GitHub - Resize Repo Table Columns
3. GitHub - Show File Size

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_GitHub_AlternateRowColor.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_GitHub_AlternateRowColor.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_GitHub_AlternateRowColor.js](https://gist.github.com/jhauga/bb175713e395ac4135f21e7de11245a3)

</dd></dl></dd></dl>

GitHub - Commit Date Timestamp:
----
<dl><dd><dl><dd>

Show the last commit using the time stamp and not a relative date calculation. Works with: <br><br>

1. GitHub - Alternate Row Color
2. GitHub - Resize Repo Table Columns
3. GitHub - Show File Size

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_GitHub_CommitDateTimestamp.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_GitHub_CommitDateTimestamp.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!--
<strong>Video Demonstration for Use:</strong>

`Ctrl + click` link to view demo on YouTube [TEXT_NAME_MATCHING_FILE](YOU_TUBE_LINK)
-->

Gist page for [siteSpecific_GitHub_CommitDateTimestamp.js](https://gist.github.com/jhauga/042103e01e2c89e400a9b416b480801c)

</dd></dl></dd></dl>

GitHub - List Old Newest Commits:
----
<dl><dd><dl><dd>

Navigate commit history to instantly get to the newest or oldest list of commits for the repo <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_GitHub_ListOldNewestCommits.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_GitHub_ListOldNewestCommits.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_GitHub_ListOldNewestCommits.js](https://gist.github.com/jhauga/ef2c574d2e678f58b6792c2c859e2e6b)

</dd></dl></dd></dl>

GitHub - Navigate Commits Sequentially:
----
<dl><dd><dl><dd>

Stepping through commits one at a time, with Previous and Next buttons added beside Browse files on a commit page. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_GitHub_NavigateCommitsSequentially.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_GitHub_NavigateCommitsSequentially.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_GitHub_NavigateCommitsSequentially.js](https://gist.github.com/jhauga/c65f32a69fa07ae47d8b8700444a09ce)

</dd></dl></dd></dl>

GitHub - Resize Repo Table Columns:
----
<dl><dd><dl><dd>

Resize repository directory table columns.Works with: <br><br>

1. GitHub - Alternate Row Color
2. GitHub - Commit Date Timestamp
3. GitHub - Show File Size

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_GitHub_ResizeRepoTableColumns.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_GitHub_ResizeRepoTableColumns.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_GitHub_ResizeRepoTableColumns.js](https://gist.github.com/jhauga/367eddf6a916c505051cfc4a7df8dfef)

</dd></dl></dd></dl>

GitHub - Show File Size:
----
<dl><dd><dl><dd>

When viewing files in repo add a column showing file size. Activate in repo root and file viewing. Works with:

1. GitHub - Alternate Row Color
2. GitHub - Commit Date Timestamp
3. GitHub - Resize Repo Table Columns

Loosely based on [stackoverflow answer](https://stackoverflow.com/questions/38675428/list-file-sizes-in-github#answer-75526865)

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_GitHub_ShowFileSize.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_GitHub_ShowFileSize.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_GitHub_ShowFileSize.js](https://gist.github.com/jhauga/247e43f74af2f196309d5746710899ae)

</dd></dl></dd></dl>

Gmail - Expand Label Folder Mouse Move Email: 
----
<dl><dd><dl><dd>

Often Move Gmail emails to nested label folders, but forget to expand label before moving. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_gmail_ExpandLabelFolderMouseMoveEmail.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_gmail_ExpandLabelFolderMouseMoveEmail.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_gmail_ExpandLabelFolderMouseMoveEmail.js](https://gist.github.com/jhauga/80970130b90bf6e32438a77aed8cc1ec)

</dd></dl></dd></dl>

Gmail - Resize Side Bar:
----
<dl><dd><dl><dd>

Resize the Gmail sidebar when labels have long and similar names <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_Gmail_ResizeSideBar.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_Gmail_ResizeSideBar.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_Gmail_ResizeSideBar.js](https://gist.github.com/jhauga/6ed0d7b27e2214fb3444a0757129d9c6)

</dd></dl></dd></dl>

Gmail - Style Sponsored Email:
----
<dl><dd><dl><dd>

Use this bookmarklet to get contrast between regular emails and sponsored emails in gmail <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_Gmail_StyleSponsoredEmail.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_Gmail_StyleSponsoredEmail.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_Gmail_StyleSponsoredEmail.js](https://gist.github.com/jhauga/98f86d2bab59a2a9618644cf598077ce)

</dd></dl></dd></dl>

Google - Paste Ready Bookmark AI Response:
----
<dl><dd><dl><dd>

Bookmark the contents of a Generative AI response from Google search. Run bookmarklet, and then paste contents into new bookmark. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_Google_PasteReadyBookmarkAIResponse.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_Google_PasteReadyBookmarkAIResponse.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_Google_PasteReadyBookmarkAIResponse.js](https://gist.github.com/jhauga/0910c78eef852fc381464db7cfae49ab)

</dd></dl></dd></dl>

Google Maps - Custom Mearsure Distance:
----
<dl><dd><dl><dd>

Draw multiple measurements using scale of Google Maps.

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_GoogleMaps_CustomMearsureDistance.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_GoogleMaps_CustomMearsureDistance.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_GoogleMaps_CustomMearsureDistance.js](https://gist.github.com/jhauga/c16243b10c2cd74e4dd7a2259109f575)

</dd></dl></dd></dl>

OctoPrint - Change Graph Image:
----
<dl><dd><dl><dd>

Change or remove the main image displayed in the graph when using [OctoPrint](https://github.com/OctoPrint/OctoPrint). If uses as is then image is removed.

<strong>IMPORTANT NOTE</strong> - this has only been tested via Unix like OS (Raspberry Pi)
and has not been tested using OctoPrint via OctoPi OS.

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_OctoPrint_ChangeGraphImage.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_OctoPrint_ChangeGraphImage.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<strong>USE - optional 1 change(s)</strong>

<strong>Optional \(x1\)</strong>

<strong>NOTE</strong> - this assumes you have access to the OS OctoPrint is installed on via ssh or a GUI.

 1. Change the ``img`` variable to the image name put in "img" folder \(<em>see text/video below for details</em>\).
    - Starting at the user's folder navigate to ".octoprint/generated/webassets".
    - Make a new directory called "img".
    - Store images to use for background here.

<strong>Video Demonstration for Optional Use:</strong>

`Ctrl + click` link to view demo on YouTube [OctoPrint - Change Graph Image Demo](https://youtu.be/Fb8SSQmgs4Y)

Gist page for [siteSpecific_OctoPrint_ChangeGraphImage.js](https://gist.github.com/jhauga/f853e5427458c9e065695e32e4a8ed4f)

</dd></dl></dd></dl>

Stackoverflow - Add Answer Anchor Links:
----
<dl><dd><dl><dd>

Add a button to extract an answers id and add to address bar as if clicking an anchor link. Adds button to bottom of voting area for all answers. Use to easily bookmark a StackOverflow answer. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_Stackoverflow_Add_Answer_Anchor_Links.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_Stackoverflow_Add_Answer_Anchor_Links.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_Stackoverflow_Add_Answer_Anchor_Links.js](https://gist.github.com/jhauga/4cb77c8ca7966c63e23f6f13db316ea1)

</dd></dl></dd></dl>

Stackoverflow - Copy Answer Anchor Links:
----
<dl><dd><dl><dd>

Add a button to extract an answers id, adding it to address bar as anchor link, and copy full url to the clipboard. dds button to bottom of voting area for all answers. Use to easily bookmark and reference a StackOverflow answer.  <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_Stackoverflow_Copy_Answer_Anchor_Links.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_Stackoverflow_Copy_Answer_Anchor_Links.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_Stackoverflow_Copy_Answer_Anchor_Links.js](https://gist.github.com/jhauga/80fa99670b2d27c373e11e485ba451bd)

</dd></dl></dd></dl>

w3Schools - Example Line Numbers:
----
<dl><dd><dl><dd>

Show the line numbers for code examples on w3schools.com. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_w3Schools_exampleLineNumbers.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_w3Schools_exampleLineNumbers.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_w3Schools_exampleLineNumbers.js](https://gist.github.com/jhauga/65647ae028eac8156902c88e1d7db776)

</dd></dl></dd></dl>

w3Schools - Hide Side Bar:
----
<dl><dd><dl><dd>

When reading a w3shcools.com tutorial, and sidebar is distracting. Works with:

1. DOM - Take Page Notes

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_w3Schools_hideSideBar.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_w3Schools_hideSideBar.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_w3Schools_hideSideBar.js](https://gist.github.com/jhauga/2a610c4b8b6a1e5116d69b87099376f4)

</dd></dl></dd></dl>

YouTube - Add Time Marks
----
<dl><dd><dl><dd>

Add time marks to current video, creating links with value of marked time. When click video will open in new tab at tim indicated in link. Works with:

1. YouTube - Take Video Notes

### <ins>Keyboard Shortcuts</ins>

<strong>Add Time Mark</strong> - ` Ctrl + m `.<br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_AddTimeMarks.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_AddTimeMarks.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_AddTimeMarks.js](https://gist.github.com/jhauga/98fa9a1b56811c1d65751de76fce2f02)

</dd></dl></dd></dl>

YouTube - Darken Bottom Controls:
----
<dl><dd><dl><dd>

Darken the bottom controls of a YouTube video when the video has a constant light background. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_DarkenBottomControls.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_DarkenBottomControls.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_DarkenBottomControls.js](https://gist.github.com/jhauga/b0405d62454e073d9512cbb20d1399ef)

</dd></dl></dd></dl>

YouTube - Dynamic History Search:
----
<dl><dd><dl><dd>

search YouTube video watch history dynamically <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_dynamicHistorySearch.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_dynamicHistorySearch.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_dynamicHistorySearch.js](https://gist.github.com/jhauga/e88d4b75abc28d0d10dfa065e970a775)

</dd></dl></dd></dl>

YouTube - Hide Short History:
----
<dl><dd><dl><dd>

Hide short watch history on YouTube history feed. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_HideShortHistory.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_HideShortHistory.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_HideShortHistory.js](https://gist.github.com/jhauga/f7be2360de10033c2bccfc8cec76b23c)

</dd></dl></dd></dl>

YouTube - Save Page Notes to Local Storage:
----
<dl><dd><dl><dd>

Saving notes taken of a YouTube video for later referencing or to continue notes later on unfinished video. Works with:

1. YouTube - Take Notes - **Saves notes taken**
2. YouTube - Take Notes and Add Removable Time Mark - **Extracts and parses to notebox**
3. YouTube - Saved Page Notes to Notebox - **Extracts and parses to notebox**

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_SavePageNotesToLocalStorage.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_SavePageNotesToLocalStorage.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_SavePageNotesToLocalStorage.js](https://gist.github.com/jhauga/1a1ab0a105b5ba616de1f2c46816a0a4)

</dd></dl></dd></dl>

YouTube - Saved Page Notes to Notebox:
----
<dl><dd><dl><dd>

Extract saved notes taken of a YouTube video for later referencing or to continue notes later on unfinished video. Press `Ctrl + m` to add removable time marks. Works with:

1. YouTube - Save Page Notes to Local Storage - **Save Notes Taken for Video**
2. YouTube - Take Notes and Add Removable Time Marks - **Add Notes to Note Box**

<strong>NOTE</strong> - best to use `Shift` key to activate note box.

### <ins>Keyboard Shortcuts</ins>

<strong>Play/pause</strong> - `Ctrl, Shift, Space` (*one at a time*). <br>
<strong>Add Time Mark</strong> - ` Ctrl + m `.<br>
<strong>Copy Notes to Clipboard</strong> - ` Alt + a `.<br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_SavedPageNotesToNotebox.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_SavedPageNotesToNotebox.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_SavedPageNotesToNotebox.js](https://gist.github.com/jhauga/5dfca4820e20b57b9bf97647519c2dc6)

</dd></dl></dd></dl>

YouTube - Short Hover Title:
----
<dl><dd><dl><dd>

Show short full title on mouseover.<br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_ShortHoverTitle.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_ShortHoverTitle.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_ShortHoverTitle.js](https://gist.github.com/jhauga/ddb02303082c8912e208b30bd3bc0db9)

</dd></dl></dd></dl>

YouTube - Show Short Release Date:
----
<dl><dd><dl><dd>

Quickly getting the release of a YouTube short. NOTE - after 1st scroll down and back up to get short date. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_ShowShortReleaseDate.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_ShowShortReleaseDate.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<strong>NOTE</strong> - after 1st short has loaded, scroll down and back up, then click in white space to get release date.

<strong>NOTE</strong> - delay of 1/2 second before release date is added to top of right-most action widgets.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_ShowShortReleaseDate.js](https://gist.github.com/jhauga/6924dfc7556ae2c9e2a9c6ea57231d45)

</dd></dl></dd></dl>

YouTube - Stack User Playlist Feed:
----
<dl><dd><dl><dd>

Stack the playlists in the user playlist feed as if dispaly were  block, increasing the font size a bit. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_StackUserPlaylistFeed.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_StackUserPlaylistFeed.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_StackUserPlaylistFeed.js](https://gist.github.com/jhauga/b2da5b4b5d639eb7d309231c4038a6a5)

</dd></dl></dd></dl>

YouTube - Sync Audio:
----
<dl><dd><dl><dd>

Quickly resync video and audio are out of sync to resynchronize audio to video <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_SyncAudio.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_SyncAudio.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_SyncAudio.js](https://gist.github.com/jhauga/4e4b1e29e97aa5dd4383cac435331bcf)

</dd></dl></dd></dl>

YouTube - Take Notes and Add Removable Time Marks:
----
<dl><dd><dl><dd>

Add note box to YouTube video and take notes on it. Just start typing. Press `Ctrl + m` to add removable time marks. Works with:

1. YouTube - Save Page Notes to Local Storage - **Save Notes Taken for Video**

<strong>NOTE</strong> - best to use `Shift` key to activate note box.

### <ins>Keyboard Shortcuts</ins>

<strong>Play/pause</strong> - `Ctrl, Shift, Space` (*one at a time*). <br>
<strong>Add Time Mark</strong> - ` Ctrl + m `.<br>
<strong>Copy Notes to Clipboard</strong> - ` Alt + a `.<br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_takeNotesAndAddRemovableTimeMarks.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_takeNotesAndAddRemovableTimeMarks.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_takeNotesAndAddRemovableTimeMarks.js](https://gist.github.com/jhauga/a2011b5dd50336546f8f91ee2d051de5)

</dd></dl></dd></dl>

YouTube - Take Video Notes:
----
<dl><dd><dl><dd>

Take notes on a YouTube video. Press ctrl+Shift to quickly move focus out of note box. Start typing to begin taking notes. Works with: <br>

1. YouTube - Save Page Notes to Local Storage - **Save Notes Taken for Video**
2. YouTube - Add Time Marks - **Add Time Marks for Video**

<strong>NOTE</strong> - best to use `Shift` key to activate note box.

### <ins>Keyboard Shortcuts</ins>

<strong>Play/pause</strong> - `Ctrl, Shift, Space` (*one at a time*). <br>
<strong>Copy Notes to Clipboard</strong> - ` Alt + a `.<br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_TakeVideoNotes.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_TakeVideoNotes.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_TakeVideoNotes.js](https://gist.github.com/jhauga/d3b4f0442de3d1b72da26ae0c9cbe499)

</dd></dl></dd></dl>

YouTube - Top Subscription Toggle Btn:
----
<dl><dd><dl><dd>

When toggling subscription list, and tired of scrolling way up to show less <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_TopSubscriptionToggleBtn.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_TopSubscriptionToggleBtn.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_TopSubscriptionToggleBtn.js](https://gist.github.com/jhauga/57f0fe041128b93c13e161587e94e19f)

</dd></dl></dd></dl>

YouTube - Watch Random Video:
----
<dl><dd><dl><dd>

Bookmarklet for when you want to watch all videos in home feed at once, and can't pick one to watch. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [siteSpecific_YouTube_WatchRandomVideo.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/siteSpecific_YouTube_WatchRandomVideo.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [siteSpecific_YouTube_WatchRandomVideo.js](https://gist.github.com/jhauga/c21475673dee3816b6ce3f9ed7fe35ec)

</dd></dl></dd></dl>

</div>

<hr><br>

# Window Bookmarklets

<div>
The below bookmarklets pertain to the browser window object, enabling user experience (<em>UX</em>) customization.

Page Offset - Custom Page Down:
----
<dl><dd><dl><dd>

Click anywhere on a webpage with a customized page down value. Good for reading certain pages. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [window_PageOffset_CustomPageDown.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/window_PageOffset_CustomPageDown.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [window_PageOffset_CustomPageDown.js](https://gist.github.com/jhauga/5b5bf9e7ae170f1f412085b1005114d8)

</dd></dl></dd></dl>


Style - Bold Selected Text:
----
<dl><dd><dl><dd>

Run this bookmarklet when you want to bold selected text on a webpage. Press `ctrl + b` to make the selected text bold. Works with:

1. Style - **\*\[ALL\]** Selected Text -\> *Window Bookmarklets*

<strong>USE - ready to use</strong>

Copy/paste: open [window_style_boldSelectedText.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/window_style_boldSelectedText.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [window_style_boldSelectedText.js](https://gist.github.com/jhauga/b8e11ddaf7f0fdf9e5c31dddc23b6794)

</dd></dl></dd></dl>

Style- Highlight Selected Text:
----
<dl><dd><dl><dd>

Run this bookmarklet when you want to highlight selected text on a webpage. Press `ctrl + Shift + h` to make the selected text highlighted. Works with:

1. Style - **\*\[ALL\]** Selected Text -\> *Window Bookmarklets*

<strong>USE - ready to use</strong>

Copy/paste: open [window_style_highlightSelectedText.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/window_style_highlightSelectedText.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [window_style_highlightSelectedText.js](https://gist.github.com/jhauga/3bd193b98a84a0ac048c607d6d2a804d)

</dd></dl></dd></dl>

Style - Italic Selected Text:
----
<dl><dd><dl><dd>

Run this bookmarklet when you want to italicize selected text on a webpage. Press `ctrl + i` to make the selected text italic. Works with:

1. Style - **\*\[ALL\]** Selected Text -\> *Window Bookmarklets*

<strong>USE - ready to use</strong>

Copy/paste: open [window_style_italicSelectedText.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/window_style_italicSelectedText.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [window_style_italicSelectedText.js](https://gist.github.com/jhauga/f5dbf303496f6db838794c4464591afb)

</dd></dl></dd></dl>

Style - Underline Selected Text:
----
<dl><dd><dl><dd>

Run this bookmarklet when you want to underline selected text on a webpage. Press `Control + Shift + u` to make the selected text underlined. Works with:

1. Style - **\*\[ALL\]** Selected Text -\> *Window Bookmarklets*

<strong>USE - ready to use</strong>

Copy/paste: open [window_style_underlineSelectedText.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/window_style_underlineSelectedText.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [window_style_underlineSelectedText.js](https://gist.github.com/jhauga/645e97a7af14a14965d040d3bb2aa45f)

</dd></dl></dd></dl>

URI - Anchor Higlighted Text:
----
<dl><dd><dl><dd>

Select text and add it to URI as anchor link. NOTE - for best results limit selection to one line, avoiding special characters. <br><br>

<strong>USE - ready to use</strong>

Copy/paste: open [window_URI_AnchorHighlightedText.js](https://raw.githubusercontent.com/isocialPractice/bookmarklets/main/JSFormatted/window_URI_AnchorHighlightedText.js), press `Ctrl + A` then `Ctrl + C`, and paste it as the URL of a new bookmark.

<!-- PASTE VIDEO HERE -->

Gist page for [window_URI_AnchorHighlightedText.js](https://gist.github.com/jhauga/861f74e65191714ecbd2d0eee7712754)

</dd></dl></dd></dl>

</div>

<hr><br>

<!---------------------------------------- END OF FILE ----------------------------------------->
