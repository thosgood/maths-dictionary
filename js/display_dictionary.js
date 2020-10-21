const langs = ["CA","DE","EN","ES","FR","IT","JA","PT","RU","ZH"]
var visible_langs = ["EN"];
var dict = {};


// TODO: sorting (https://stackoverflow.com/a/19947532/2352867)

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

    var emptyEntryRow = true;
    var entryRow = "<tr class=\"noun\">";

    $.each(visible_langs, function(l, lang) {

      entryRow += "<td>";

      var entry = item["root"][lang];

      // skip to next item in data if this entry doesn't exist or has empty atom
      if (typeof entry === "undefined" || entry["atom"] === "") {
        entryRow += "</td>";
        return true;
      };
      
      // by here we know that we actually have an entry to work with
      emptyEntryRow = false;
      entryRow += `<span class="noun">${entry["atom"]}</span>`;
      if (typeof entry["gend"] !== "undefined") {
        entryRow += `<span class="gender">(${entry["gend"][0]})</span>`;
      };
      entryRow += "</td>";
    }); // end $.each(visible_langs)

    entryRow += "</tr>";

    if (!emptyEntryRow) {
      $(entryRow).appendTo("#table_body");
    };

    // skip to next item in data if this entry doesn't have any adjectives
    if (typeof item["adjs"] === "undefined" || item["adjs"] === "") {
      return true;
    };

    // TODO: move this out to a separate function that gets called when we click
    //       on a row: it will take the entry of that row as an argument
    // do the same as we're currently doing with nouns, but now with adjectives
    $.each(item["adjs"], function(a, adj) {
      var emptyAdjRow = true;
      var adjRow = "<tr class=\"adjective\">";
      $.each(visible_langs, function(l, lang) {
        adjRow += "<td>";
        var adjective = adj[lang]
        if (typeof adjective === "undefined" || adjective["atom"] === "") {
          adjRow += "</td>";
          return true;
        };
        emptyAdjRow = false;
        if (adjective["pstn"] === "after"){adjRow+="___ "};
        adjRow += adjective["atom"];
        if (adjective["pstn"] === "before"){adjRow+=" ___"};
        adjRow += "</td>";
      }); // end $.each(visible_langs)
      adjRow += "</tr>";
      if (!emptyAdjRow){$(adjRow).appendTo("#table_body");}
    }); // end $.each(item["adjs"])

  }); // end $.each(data)
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
