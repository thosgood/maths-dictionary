var sourceLangs = [];
var targetLang = "";
var targetLangName = "";
var dict = {};
var needingTranslation = [];



$(document).ready(function() {
  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    dict = json;
  });
});



$(document).on("click", "#start", function(obj) {
  needingTranslation = [];
  sourceLangs = [];
  targetLang = "";

  $("#from_language_selectors input:checked").each( function(i, item){
    sourceLangs.push(item.name);
  });

  targetLang = $("#to_language").val();
  targetLangName = $("#to_language option:selected").text();

  $.each(dict, function(i, item) {
    var entry = { "id": i, "existing": {} };
    $.each(sourceLangs, function(l, lang) {
      if (typeof item["root"][lang] !== undefined) {
        var sourceAtom = item["root"][lang]["atom"];
        var targetAtom = item["root"][targetLang]["atom"]
        if (sourceAtom !== "" && targetAtom === "") {
          entry["existing"][lang] = sourceAtom;
        };
      };
    });
    if (!jQuery.isEmptyObject(entry["existing"])) {
      needingTranslation.push(entry);  
    };
  });

  $.each(needingTranslation, function(e, entry) {
    // TODO: ideally this question should be in the target language...
    var sources = []
    $.each(entry["existing"], function(s, source) {
      sources.push(`${source} (${s})`);
    });

    var question = "";
    switch(targetLang) {
      case "EN":
        question += `How do you say ${sources.join('/')} in ${targetLangName}?`;
        break;
      case "FR":
        question += `Comment dit-on ${sources.join('/')} en ${targetLangName}?`;
        break;
      default:
        question += `How do you say ${sources.join('/')} in ${targetLangName}?`;
        break;
    }
    console.log(question);
  });
});
