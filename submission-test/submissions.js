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
  $("#questions").empty();

  $("#from_language_selectors input:checked").each( function(i, item){
    sourceLangs.push(item.name);
  });

  targetLang = $("#to_language").val();
  // targetLangName = $("#to_language option:selected").text();

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
    var sources = []
    $.each(entry["existing"], function(s, source) {
      sources.push(`<span class="foreign ${s}">${source}</span>`);
    });

    var question = "";
    switch(targetLang) {
      case "CA":
        question = `Com es diu ${sources.join("/")} en català?`;
        break;
      case "DE":
        question = `Wie sagt man auf  Deutsch ${sources.join("/")}?`;
        break;
      case "EN":
        question = `How do you say ${sources.join("/")} in English?`;
        break;
      case "ES":
        question = `¿Cómo se dice ${sources.join("/")} en español?`;
        break;
      case "FA":
        // TODO: .reverse.join(" "), but before .join("/")
        question = `چگونه به فارسی ${sources.join("/")} می گویید؟`;
        break;
      case "FI":
        question = `Kuinka sanot ${sources.join("/")} suomeksi?`;
        break;
      case "FR":
        question = `Comment dit-on ${sources.join("/")} en français?`;
        break;
      case "IT":
        question = `Come se dice ${sources.join("/")} in italiano?`;
        break;
      case "JA":
        question = `日本語で ${sources.join("/")} は何と言いますか?`;
        break;
      case "KO":
        question = `한국어로 ${sources.join("/")}이 뭐야?`;
        break;
      case "PL":
        question = `Jak powiedzieć ${sources.join("/")} po polsku?`;
        break;
      case "PT":
        question = `Como se diz ${sources.join("/")} em português?`;
        break;
      case "RU":
        question = `Как сказать ${sources.join("/")} по-русски?`;
        break;
      case "TR":
        question = `Türkçe'de ${sources.join("/")} nasıl denir?`;
        break;
      case "ZH":
        question = `${sources.join("/")} 中文怎么说?`;
        break;
      default:
        question = `How do you say ${sources.join("/")} in English?`;
        break;
    }
    $(`<li>${question}</li>`).appendTo("#questions");
  });
});
