var dict = {};
var languages = {};
var sourceLangs = [];
var targetLang = "";
var targetLangHasGend = false;
var targetLangDirection = "";
var needingTranslation = [];
var questions = [];
var submission = {};



$(document).ready(function() {
  $.getJSON("https://thosgood.net/maths-dictionary/data/nouns.json", function(json) {
    dict = json;
  });
  $.getJSON("https://thosgood.net/maths-dictionary/data/languages.json", function(json) {
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

  targetLangHasGend = (languages[targetLang]["genders"].length === 0) ? false : true;
  targetLangDirection = languages[targetLang]["direction"]

  $.each(dict, function(i, item) {
    var entry = { "type": "noun", "id": i, "existing": {} };
    var targetAtom = item[targetLang]["atom"]
    if (targetAtom === "") {
      $.each(sourceLangs, function(l, lang) {
        if (typeof item[lang] !== undefined) {
          var sourceAtom = item[lang]["atom"];
          if (sourceAtom !== "") {
            entry["existing"][lang] = sourceAtom;
          };
        };
      });
    };

    if (!jQuery.isEmptyObject(entry["existing"])) {
      needingTranslation.push(entry);  
    };
  });

  if (needingTranslation.length == 0) {
    alert("Sorry, but there are no translations needed at the moment for this combination of languages!");
  } else {
    var questionCard = generateQuestionCard(targetLang, needingTranslation.length);
    $("#initial_options").css("display", "none");
    $(questionCard).appendTo("#questions");
    updateQuestionCard(1);
  };
});



$(document).on("click", "#previous", function() {
  var currentQuestionNumber = parseInt($("#current_question_number").text());
  updateQuestionCard(currentQuestionNumber-1);
});



$(document).on("click", "#skip", function() {
  var currentQuestionNumber = parseInt($("#current_question_number").text());
  updateQuestionCard(currentQuestionNumber+1);
});



$(document).on("click", "#next", function() {
  var currentQuestionNumber = parseInt($("#current_question_number").text());
  var currentQuestionType = $("#current_question_type").text();
  var input = $(this).closest("div#question_card").find("input");
  if (saveCurrentAnswer(input,currentQuestionType)) {
    updateQuestionCard(currentQuestionNumber+1);
  } else {
    alert(`Please either ensure that all fields are filled, or press "Skip" or "Finish now".`);
  };
});



$(document).on("click", "#finished", function() {
  var currentQuestionNumber = parseInt($("#current_question_number").text());
  var currentQuestionType = $("#current_question_type").text();
  var input = $(this).closest("div#question_card").find("input");
  if (saveCurrentAnswer(input,currentQuestionType) || input.val() === "") {
    $("body").empty()
    var emailButton = `<input type="button" id="email_button" value="click here" onclick="automatedEmail()">`;
    var final_message = `<p>The submissions process is still slightly manual.
    Please either email the code below to <code>tim.hosgood@gmail.com</code> or ${emailButton} to open up your email client with a pre-generated message.</p>`
    $("body").append(final_message);
    $("body").append(`<p style="border: 1px solid black; padding: 1em;"><code>{"${targetLang}": ${JSON.stringify(submission)}}</code></p>`);
    $("body").append(`<p>Thank you for your time and effort!</p>`);
  } else {
    alert(`Please either ensure that all fields are filled, or press "Skip".`);
  };
});



$(document).on("click", "#leftarrow", function() {
  // $("#corresponding_noun").css("left", "");
  // $("#corresponding_noun").css("right", "0");
  $("#corresponding_noun").before($("#question_input"));
  $("#question_input").css("display", "inline");
});

$(document).on("click", "#rightarrow", function() {
  // $("#corresponding_noun").css("left", "0");
  // $("#corresponding_noun").css("right", "");
  $("#corresponding_noun").after($("#question_input"));
  $("#question_input").css("display", "inline");
});



var saveCurrentAnswer = function(input,type) {
  var answer = {};
  var success = false;
  answer["atom"] = input.val();
  console.log(targetLangHasGend);
  if (targetLangHasGend) {
    answer["gend"] = $("input[name=gender]:checked").val();
    if (answer["atom"] !== "" && answer["gend"] !== undefined) {
      submission[input.attr("name")] = answer;
      success = true;
    }
  } else { 
    if (answer["atom"] !== "") {
      submission[input.attr("name")] = answer;
      success = true;
    }
  };
  console.log(input)
  console.log(submission[input.attr("name")]);
  return success;
};



var automatedEmail = function() {
  window.open(`mailto:tim.hosgood@gmail.com?subject=MDS_${targetLang}&body=${JSON.stringify(submission)}`, '_self');
}



var updateQuestionCard = function(number) {
  var question = needingTranslation[number-1];
  var id = question["id"];
  $("#current_question_type").html(`${question["type"]}`)

  if (question["type"] === "noun") {
    var foreignContent = [];
    $.each(question["existing"], function(u, unknown) {
      var ref = dict[id]["refs"]["wikidata"];
      var link = "";
      if (typeof ref !== undefined) {
        link = `</br>(<a href="https://www.wikidata.org/wiki/${ref}" target="_blank">${ref}</a>)`
      }
      var foreignWord =`<span class="unknown">${unknown}<span class="tooltip">${u}${link}</span></span>`;
      foreignContent.push(foreignWord);
    });
    
    $("#foreign").html(foreignContent.join(" / "));
    $("#question_input").attr("name", id);
    $("#corresponding_noun").empty();

    if (submission[id] !== undefined) {
      $("#question_input").val(submission[id]["atom"]);
      if (targetLangHasGend) {
        $(`input#${submission[id]["gend"]}`).prop("checked", true);
      };
    } else {
      $("#question_input").val("");
      $("input[name='gender']").prop("checked", false);
    };

    $("#question_input").css("display", "inline");
    $("#gender_selection").css("display", "block");
    $("#position_selection").css("display", "none");
    $("#corresponding_noun").css("display", "none");
    
    $("#current_question_number").html(`${number}`);

    if (number == 1) {
      $("button#previous").prop("disabled", true);
    } else {
      $("button#previous").prop("disabled", false);
    };
    var totalQuestionNumber = parseInt($("#total_question_number").text());
    if (number == totalQuestionNumber) {
      $("button#next").prop("disabled", true);
    } else {
      $("button#next").prop("disabled", false);
    };
  };
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
    case "EU":
      questionLabel = `Nola esaten da ${foreign} euskaraz?`;
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
      questionLabel = `Come si dice ${foreign} in italiano?`;
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
      questionLabel = `How do you say ${foreign} in ${targetLang}?`;
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
  } else { var genderSelect = "" };

  var positionSelect = `<div id="position_selection">\n`;
  positionSelect += `<input type="radio" name="position" value="leftarrow" id="leftarrow">\n`;
  positionSelect += `<label for="leftarrow">←</label>\n`;
  positionSelect += `<input type="radio" name="position" value="rightarrow" id="rightarrow">\n`;
  positionSelect += `<label for="rightarrow">→</label>\n`;
  positionSelect += `</div>\n`

  questionCard = `
<div id="question_card">
  <p>(Hover over the underlined word to see more information and context)</p>
  <label id="question_label" for="question_input">
    ${questionLabel}
  </label>
  <div id="input_row">
    <input type="text" id="question_input" name="">
    <span id="corresponding_noun"></span>
  </div>
  ${genderSelect}
  ${positionSelect}
  <ul id="question_card_buttons_list">
    <li><button name="skip" id="previous" class="question_card_button">Previous</button></li>
    <li><button name="skip" id="skip" class="question_card_button">Skip</button></li>
    <li><button name="next" id="next" class="question_card_button">Next</button></li>
  </ul>
  <button name="finished" id="finished" class="question_card_button">Finish now</button>
  <span id="current_question_type"></span>
  <span id="question_number"><span id="current_question_number">1</span>/<span id="total_question_number">${totalNum}</span></span>
</div>`

  return questionCard;
};
