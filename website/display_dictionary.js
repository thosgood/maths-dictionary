var langs = [];
var visibleLangs = [];
var dict = {};

// TODO: searching

$(document).ready(function() {
  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    // convert the dict as an array
    var data = Object.values(json);
    // Get all language codes
    var languageCodes = Object.keys(data[0].root);

    // For columns configuration see https://datatables.net/examples/ajax/deep.html
    var columnsConf = [];
    languageCodes.forEach((language) => {
      columnsConf.push({
          "title": language,
          "data": "root." + language + ".atom"
      });
    });

    var table = $('#table').DataTable( {
      data: data,
      "columns": columnsConf,
      // add expandable class if adjs
      // https://datatables.net/reference/option/createdRow
      "createdRow": function( row, data, dataIndex ) {
        // We could deal with gender here later.
        if (!($.isEmptyObject(data.adjs))){
          $(row).addClass("expandable")
        }
      }
    })// closing DataTable

    $('#table').on("click", "tr.expandable", function() {
      // see https://datatables.net/examples/api/row_details.html
      var tr = $(this).closest('tr');
      var row = table.row( tr );
      if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('expanded');
        }
        else {
            // Open this row
            row.child( showAdjectives(row.data()) ).show();
            tr.addClass('expanded');
        }
    });// closing on click
  });// closing the getJSON

  // generate language_selectors from languages
  $.getJSON("https://thosgood.com/maths-dictionary/languages.json", function(json) {
    var i = 0;
    $.each(json, function(code, data){
      var html = `<li><input type="checkbox" id="${code}" name="${code}" data-column="${i}"`
      // EN is checked by default
      if (code =="EN"){
        html += "checked"
      }
      html +=`><label for="${code}">${data["endonym"]}</label></li>`
      $("#language_selectors").append(html);
      i++;
    });
  });





// add rows for adjectives
var showAdjectives = function (data) {
  var adjRows = [];

  // TODO: adjectives should be sorted if the current column is sorted
  // TODO; item["adjs"] === "") is wrong it's {}
  if (typeof data["adjs"] === "undefined" || data["adjs"] === "") {
    return false;
  };

  $.each(data["adjs"], function(a, adj) {
    var adjRow = `<tr class="adjective">`;
    var emptyAdjRow = true;

    $.each(adj, function(lang) {
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

})
