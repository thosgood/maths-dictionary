var sourceLangs = [];
var targetLangs = [];
var dict = {};

$(document).ready(function() {
  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    dict = json;
  });
});

$(document).on("click", "#start", function(obj) {
  $("#from_language_selectors input:checked").each( function(i, item){
    sourceLangs.push(item.name);
  });
  $("#to_language_selectors input:checked").each( function(i, item){
    targetLangs.push(item.name);
  });
});
