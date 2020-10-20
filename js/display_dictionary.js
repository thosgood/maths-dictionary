const langs = ["CA","DE","EN","ES","FR","IT","JA","PT","RU","ZH"]

$(document).ready(function() {
  var table_headers = "";
  $.each(langs, function(l, lang) {
    table_headers += "<th>";
    table_headers += lang;
    table_headers += "</th>";
  });
  $(table_headers).appendTo("#table_headers");

  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    $.each(json, function(i, item) {
      var row = "<tr>";
      $.each(langs, function(l, lang) {
        row += "<td>";
        if (item["root"][lang]["atom"]) {
          row += item["root"][lang]["atom"];
        }
        row += "</td>";
      });
      row += "</tr>";
      $(row).appendTo("#table_body");
    });
  });
});