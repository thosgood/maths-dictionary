const langs = ["CA","DE","EN","ES","FR","IT","JA","PT","RU","ZH"]
var visible_langs = ["EN"];
var dict = {};

var update_table = function(data = dict) {
  $("#table_body").empty();
  $("<tr id=\"table_headers\"></tr>").appendTo("#table_body")

  var table_headers = "";
  $.each(visible_langs, function(l, lang) {
    table_headers += "<th>";
    table_headers += lang;
    table_headers += "</th>";
  });
  $(table_headers).appendTo("#table_headers")

  $.each(data, function(i, item) {
    var row = "<tr>";
    $.each(visible_langs, function(l, lang) {
      row += "<td>";
      if (typeof item["root"][lang] !== 'undefined') {
        row += item["root"][lang]["atom"];
      };
      row += "</td>";
    });
    row += "</tr>";
    $(row).appendTo("#table_body");
  });
};

$(document).ready(function() {
  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    dict = json;
    update_table(dict);
  })
});

$("input").on("click", function() {
  visible_langs = [];
  var checked = $("input:checked");
  $.each(checked, function(i, item){
    visible_langs.push(item.name);
  });
  update_table();
});
