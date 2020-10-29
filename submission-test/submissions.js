var sourceLangs = [];
var targetLang = "";
var dict = {};
var needingTranslation = [];

$(document).ready(function() {
  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    dict = json;
  });
});

$(document).on("click", "#start", function(obj) {
  sourceLangs = [];
  $("#from_language_selectors input:checked").each( function(i, item){
    sourceLangs.push(item.name);
  });
  targetLang = $("#to_language").val();
  $.each(dict, function(i, item) {
    $.each(sourceLangs, function(l, lang) {
      if (typeof item["root"][lang] !== undefined) {
        var sourceAtom = item["root"][lang]["atom"];
        var targetAtom = item["root"][targetLang]["atom"]
        if (sourceAtom !== "" && targetAtom === "") {
          // TODO: if the atom exists in ALL source languages then this should
          //       only make ONE entry in needingTranslation
          var entry = { "id": i, "language": lang, "atom": sourceAtom }
          needingTranslation.push(entry);
        };
      };
    });
  });
  console.log(needingTranslation);
});
