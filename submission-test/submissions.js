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

  var questions = generateQuestions(needingTranslation);
  $.each(questions, function(q, question) {
    $(question).appendTo("#questions");
  });
  $("#questions").append(`<input type="submit" id="submit" value="Submit">`)
});



var generateQuestions = function(toTranslate) {
  var questions = [];
  var foreign = "";
  $.each(toTranslate, function(e, entry) {
    var sources = [];
    $.each(entry["existing"], function(s, source) {
      foreign = `
<div class="foreign">
  <span class="unknown">${source}</span>
  <span class="tooltip">${s}</span>
</div>`;
      sources.push(foreign);
    });

    var question = `<label for="${entry["id"]}">`;
    switch(targetLang) {
      case "CA":
        question += `Com es diu ${sources.join("/")} en català?`;
        break;
      case "DE":
        question += `Wie sagt man auf  Deutsch ${sources.join("/")}?`;
        break;
      case "EN":
        question += `How do you say ${sources.join("/")} in English?`;
        break;
      case "ES":
        question += `¿Cómo se dice ${sources.join("/")} en español?`;
        break;
      case "FA":
        // TODO: .reverse.join(" "), but before .join("/")
        question += `چگونه به فارسی ${sources.join("/")} می گویید؟`;
        break;
      case "FI":
        question += `Kuinka sanot ${sources.join("/")} suomeksi?`;
        break;
      case "FR":
        question += `Comment dit-on ${sources.join("/")} en français?`;
        break;
      case "IT":
        question += `Come se dice ${sources.join("/")} in italiano?`;
        break;
      case "JA":
        question += `日本語で ${sources.join("/")} は何と言いますか?`;
        break;
      case "KO":
        question += `한국어로 ${sources.join("/")}이 뭐야?`;
        break;
      case "PL":
        question += `Jak powiedzieć ${sources.join("/")} po polsku?`;
        break;
      case "PT":
        question += `Como se diz ${sources.join("/")} em português?`;
        break;
      case "RU":
        question += `Как сказать ${sources.join("/")} по-русски?`;
        break;
      case "TR":
        question += `Türkçe'de ${sources.join("/")} nasıl denir?`;
        break;
      case "ZH":
        question += `${sources.join("/")} 中文怎么说?`;
        break;
      default:
        question = `How do you say ${sources.join("/")} in English?`;
        break;
    }
    question += "</label>";
    question += `\n<input type="text" id="${entry["id"]}" name="${entry["id"]}"></br>`;
    questions.push(question);
  });

  return questions;
};



$("form#questions").submit(function(event) {
  var submissionData = $("form#questions").serializeArray();
  // submissionData["language"] = targetLang;
  event.preventDefault();
});
