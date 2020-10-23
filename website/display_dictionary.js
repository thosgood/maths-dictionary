var langs = [];
var visible_langs = [];
var dict = {};


// TODO: searching

$(document).ready(function() {
  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    dict = json;
    updateTable(dict);
    // TODO: sort on loading!
  });
  $("input").each(function(i, item) {
    langs.push(item.name);
  });
  $("input:checked").each( function(i, item){
    visible_langs.push(item.name);
  });
});



// build the html table
var updateTable = function(data = dict) {

  $("#table_body").empty();
  $("#table_body").append(`<tr id="table_headers"></tr>`);

  var tableHeaders = "";
  $.each(visible_langs, function(l, lang) {
    tableHeaders += `<th class="sortable">`;
    tableHeaders += lang;
    tableHeaders += "</th>";
  });
  $(tableHeaders).appendTo("#table_headers")

  $.each(data, function(i, item) {
    var emptyEntryRow = true;
    // TODO: this should check that adjs exist IN visible_langs!!!
          // maybe by using showAdjectives ?
    var hasAdjs = false;
    if (typeof item["adjs"] === "undefined" || item["adjs"] === "") {
      var entryRow = `<tr class="noun" id=${i}>`;
    } else {
      var entryRow = `<tr class="noun expandable" id=${i}>`;
    };

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
    });

    entryRow += "</tr>";

    if (!emptyEntryRow) {
      $(entryRow).appendTo("#table_body");
    };
  }); // end $.each(data)
};



// add rows for adjectives
var showAdjectives = function (nounID) {
  var item = dict[nounID];
  var adjRows = [];

  // TODO: adjectives should be sorted if the current column is sorted

  if (typeof item["adjs"] === "undefined" || item["adjs"] === "") {
    return false;
  };

  $.each(item["adjs"], function(a, adj) {
    var adjRow = `<tr class="adjective ${nounID}">`;
    var emptyAdjRow = true;

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
    });

    adjRow += "</tr>";
    if (!emptyAdjRow) {
      adjRows.push(adjRow);
    }
  });

  return adjRows;
};



// language selector checkboxes
$("input").on("click", function() {
  visible_langs = [];
  $("input:checked").each( function(i, item){
    visible_langs.push(item.name);
  });
  updateTable();
});



// expand expandable nouns (i.e. those with adjectives)
$(document).on("click", "tr.expandable", function(obj) {
  row = obj.currentTarget
  nounID = row.id;
  adjs = showAdjectives(nounID);
  if ($(row).hasClass("expanded")) {
    $(`.${nounID}`).remove();
  } else {
    $.each(adjs, function(a, adj) {
      $(adj).insertAfter(row);
    }); 
  }
  $(row).toggleClass("expanded");
});



// sort columns by clicking on table headers
$(document).on("click", "th", function(){
  $(".adjective").remove();
  $(".expanded").removeClass("expanded");
  $("th").removeClass("sorted sorted-descending");
  $(this).addClass("sorted");

  function comparer(index) {
    return function(a, b) {
      var valA = $(a).children("td").eq(index).text();
      var valB = $(b).children("td").eq(index).text();
      return valA.localeCompare(valB);
    }
  }

  var column = $(this).index();
  // TODO: rewrite "table" and "rows" so you understand them...
        // namely, what are eq(0) and :gt(0)?
  var table = $(this).parents("table").eq(0);
  var rows = table.find("tr:gt(0)").toArray().sort(comparer(column));
  var emptyRows = [];

  // TODO: if we sort one column then another and then the first again, the
        // first should sort ASCENDING every time... (please)
  // (also what is this weird behaviour where if you keep on sorting a column
  //  which has empty rows then every it flips all the others every third and
  //  fourth time?)
  this.asc = !this.asc;
  if (!this.asc){
    rows = rows.reverse();
  };
  $(this).toggleClass("sorted-descending", !this.asc);

  $.each(rows, function(r, row) {
    if (row.cells[column].innerText === "") {
      emptyRows.push(row);
    } else {
      $(row).appendTo(table);
    }
  });
  $.each(emptyRows, function(r, row) {
    $(row).appendTo(table);
  });
})
