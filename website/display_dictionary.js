var langs = [];
var visibleLangs = [];
var dict = {};

var updateVisibleLangs = function(){
  visibleLangs = [];
  $("input:checked").each( function(i, item){
    visibleLangs.push(item.name);
  });

}

$(document).ready(function() {

  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    // convert the dict as an array
    var data = Object.values(json);
    // Get all language codes
    var languageCodes = Object.keys(data[0].root);

    // For columns configuration see https://datatables.net/examples/ajax/deep.html
    var columnsConf = [];
    languageCodes.forEach((language) => {
      var conf = {
        "title": language,
        "data": "root." + language + ".atom"
      }
      // At first, only show English
      if (language != "EN"){
        conf["visible"] = false;
        conf["searchable"] = false;
      }
      columnsConf.push(conf);
    });

    // Create the table with datatable
    var table = $('#table').DataTable( {
      data: data,
      "columns": columnsConf,
      "paging": false,
      "autoWidth": false,
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

    // toggle table columns on click
    $("#language_selectors").on("click", 'input', function(){
      // Get the column API object
      var colId = $(this).attr('data-column')
      var column = table.column( colId );

      // Toggle the visibility
      column.visible( ! column.visible() );

      // set visibleLangs
      updateVisibleLangs()

      // unexpand expanded rows
      table.rows().every( function () {
        this.child.hide()
      });
      $('.expanded').removeClass('expanded').addClass('expandable');

      //this will toggle the column's searchability
      //https://datatables.net/forums/discussion/comment/167155/#Comment_167155
      let columnsettings = table.settings()[0].aoColumns[colId];
      columnsettings.bSearchable = column.visible();
      //reset the table's searchability settings to add or remove the toggled column
      table.rows().invalidate();
      table.draw();//this will rerun the last search with the visible fileds only
    });// toggle table columns on click

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
    updateVisibleLangs();
  });

  // add rows for adjectives
  var showAdjectives = function (data) {
    var adjRows = [];

    // TODO: adjectives should be sorted if the current column is sorted
    if (typeof data["adjs"] === "undefined" || data["adjs"] === {}) {
      return false;
    };

    $.each(data["adjs"], function(a, adj) {
      var adjRow = `<tr class="adjective">`;
      var emptyAdjRow = true;

      $.each(visibleLangs, function(i, lang) {
        adjRow += "<td>";
        console.log(adj);
        var adjective = adj["root"][lang]
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
