var dict = {};
var languages
var sourceLangs = [];
var targetLang = "";
var targetLangHasGend = false;
var needingTranslation = [];
var questions = [];
var submission = [];


// TODO: adjectives!


$(document).ready(function() {
  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    dict = json;
  });
  $.getJSON("https://thosgood.com/maths-dictionary/languages.json", function(json) {
    languages = json;
  });
});



$(document).on("click", "#start", function() {
  needingTranslation = [];
  sourceLangs = [];
  targetLang = "";
  $("#questions").empty();

  $("#from_language_selectors input:checked").each( function(i, item){
    sourceLangs.push(item.name);
  });

  targetLang = $("#to_language").val();

  targetLangHasGend = (languages[targetLang]["genders"] === undefined) ? false : true;

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

  var questionCard = generateQuestionCard(targetLang, needingTranslation.length);

  // TODO: give some message in the case where question is empty!
  $("#initial_options").css("display", "none");
  $(questionCard).appendTo("#questions");

  updateQuestionCard(1);
});



$(document).on("click", "#previous", function() {
  // TODO
});



$(document).on("click", "#skip", function() {
  submission.push({});
  updateQuestionCard();
});



$(document).on("click", "#next", function() {
  // TODO
  // TODO: disable this button unless the input is non-empty
  //       AND gender selected (IF gender exists!)
  var input = $(this).closest("div#question_card").find("input");
  var answer = {};
  answer["id"] = input.attr("name");
  answer["atom"] = input.val();
  // TODO: only set answer["gend"] if targetLangHasGend
  answer["gend"] = $("input[name=gender]:checked").val();
  submission.push(answer);
  updateQuestionCard(submission.length+1);
});



$(document).on("click", "#finished", function() {
  // TODO
});



var updateQuestionCard = function(number) {
  // TODO: disable "next" button if on final question
  //       (use `typeof needingTranslation[number]` ?)
  var question = needingTranslation[number-1];
  var id = question["id"];

  var foreignContent = [];
  $.each(question["existing"], function(u, unknown) {
    var foreignWord =`<span class="unknown">${unknown}<span class="tooltip">${u}</span></span>`;
    foreignContent.push(foreignWord);
  });
  
  $("#foreign").html(foreignContent.join(' /'));
  $("#question_input").attr("name", id);
  $("#question_input").val("");
  $('input[name="gender"]').prop('checked', false);
  $("#current_question_number").html(`${number}`);
};



var generateQuestionCard = function(targetLang, totalNum) {
  var foreign = `<div id="foreign"></div>`;
  var questionLabel = "";

  switch(targetLang) {
    case "CA":
      questionLabel = `Com es diu ${foreign} en català?`;
      break;
    case "DE":
      questionLabel = `Wie sagt man auf  Deutsch ${foreign}?`;
      break;
    case "EN":
      questionLabel = `How do you say ${foreign} in English?`;
      break;
    case "ES":
      questionLabel = `¿Cómo se dice ${foreign} en español?`;
      break;
    case "FA":
      // TODO: .reverse.join(" "), but before .join(" /")
      questionLabel = `چگونه به فارسی ${foreign} می گویید؟`;
      break;
    case "FI":
      questionLabel = `Kuinka sanot ${foreign} suomeksi?`;
      break;
    case "FR":
      questionLabel = `Comment dit-on ${foreign} en français?`;
      break;
    case "IT":
      questionLabel = `Come se dice ${foreign} in italiano?`;
      break;
    case "JA":
      questionLabel = `日本語で ${foreign} は何と言いますか?`;
      break;
    case "KO":
      questionLabel = `한국어로 ${foreign}이 뭐야?`;
      break;
    case "PL":
      questionLabel = `Jak powiedzieć ${foreign} po polsku?`;
      break;
    case "PT":
      questionLabel = `Como se diz ${foreign} em português?`;
      break;
    case "RU":
      questionLabel = `Как сказать ${foreign} по-русски?`;
      break;
    case "TR":
      questionLabel = `Türkçe'de ${foreign} nasıl denir?`;
      break;
    case "ZH":
      questionLabel = `${foreign} 中文怎么说?`;
      break;
    default:
      questionLabel = `How do you say ${foreign} in English?`;
      break;
  }

  if (targetLangHasGend) {
    var genders = languages[targetLang]["genders"];
    var genderSelect = `<div id="gender_selection">\n`;
    $.each(genders, function(g, gender) {
      genderSelect += `<input type="radio" name="gender" value="${gender}" id="${gender}">\n`;
      genderSelect += `<label for="${gender}">${gender}</label>\n`;
    });
    genderSelect += `</div>\n`;
  } else { genderSelect = "" };

  questionCard = `
<div id="question_card">
  <label id="question_label" for="question_input">
    ${questionLabel}
  </label>
  <input type="text" id="question_input" name="">
  ${genderSelect}
  <ul id="question_card_buttons_list">
    <li><button name="skip" id="previous" class="question_card_button">Previous</button></li>
    <li><button name="skip" id="skip" class="question_card_button">Skip</button></li>
    <li><button name="next" id="next" class="question_card_button">Next</button></li>
  </ul>
  <button name="finished" id="finished" class="question_card_button">Finish now</button>
  <span id="question_number"><span id="current_question_number">1</span>/${totalNum}</span>
</div>`

  return questionCard;
};
