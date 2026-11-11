javascript:(function() {
 /* A fixture that reads the page's cookies, which no bookmarklet may do, so the harness has the
    refusal to report before any browser starts. */
 var cookiesFixtureCookieReadsTheCookies = document.cookie;
 document.title = String(cookiesFixtureCookieReadsTheCookies.length);
})();
