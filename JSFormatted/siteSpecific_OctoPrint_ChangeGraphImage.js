javascript:(function(){ 
 var img = "CHANGE_IMAGE"; /* NAME and EXTENSION i.e. pic.jpg */ 
 var graph = document.getElementById("temperature-graph"); 
 if (img == 0 || img == "CHANGE_IMAGE" || img == "" || img == "0") {
  graph.style.background = "none";
 } else {
  graph.style.background = "url(/static/webassets/img/" + img + ") no-repeat center";
 }
 })();