var langs = {};
var dict = {};
var languageCodes = [];
var visibleLangs = [];

var updateVisibleLangs = function(){
  visibleLangs = [];
  $("input:checked").each( function(i, item){
    visibleLangs.push(item.name);
  });

}

$(document).ready(function() {

  // generate language_selectors from languages
  $.getJSON("https://thosgood.com/maths-dictionary/languages.json", function(json) {
    langs = json;
    // Get all language codes
    languageCodes = Object.keys(langs);

    var i = 1;
    $.each(json, function(code, data){
      var html = `<li><input type="checkbox" id="${code}" name="${code}" data-column="${i}"`
      // EN is checked by default
      if (code == "EN" || code == "FR"){
        html += "checked"
      }
      html +=`><label for="${code}">${data["endonym"]}</label></li>`
      $("#language_selectors").append(html);
      i++;
    });
    updateVisibleLangs();
  });

  $.getJSON("https://thosgood.com/maths-dictionary/nouns.json", function(json) {
    // convert the dict as an array
    var data = Object.values(json);

    // For columns configuration see https://datatables.net/examples/ajax/deep.html
    var columnsConf = [];

    var refsCol = {
      // TOOD: fix adjective rows; remove width from `style.css`
      "width": "100px",
      "title": "Reference",
      "data": "refs",
      "render": function( data, type, row ) {
        if (typeof data !== "undefined" || data !== {}) {
          var ref = "";
          if (data["wikidata"]) {
            ref += `<a class="ref wikidata" href="https://www.wikidata.org/wiki/${data["wikidata"]}">${data["wikidata"]}</a>`;
          };
          if (data["mathworld"]) {
            ref += `<a class="ref mathworld" href="https://mathworld.wolfram.com/${data["mathworld"]}.html">MathWorld</a>`;
          };
          if (data["eom"]) {
            ref += `<a class="ref eom" href="https://encyclopediaofmath.org/wiki/${data["eom"]}">EoM</a>`;
          };
          return ref;
        } else {
          return "n/a";
        };
      },
      "visible": true,
      "searchable": true
    }
    columnsConf.push(refsCol);

    languageCodes.forEach((language) => {
      var conf = {
        "width": "210px",
        "visible": false,
        "searchable": false,
        "title": language,
        "data": "root." + language,
        "render": function( data, type, row) {
          var string = ""
          string += data["atom"];
          if (data["gend"] != "") {
            string += `<span class="gender">(${data["gend"][0]})</span>`;
          };
          return string;
        }
      }
      // At first, only show English and French
      if (language == "EN" || language == "FR") {
        conf["visible"] = true;
        conf["searchable"] = true;
      }
      columnsConf.push(conf);
    });

    // Create the table with datatable
    var table = $('#table').DataTable( {
      data: data,
      "columns": columnsConf,
      "autoWidth": false,
      "paging": true,
      "pageLength": 10,
      "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
      // "pagingType": "numbers",
      "order": [[ 0, "asc" ]],
      // add expandable class if adjs
      "createdRow": function( row, data, dataIndex ) {
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
        // TODO: switch to using `row.add`
        //      (https://datatables.net/reference/api/row.add())
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
      table.draw();//this will rerun the last search with the visible fields only
    });// toggle table columns on click

  });// closing the getJSON


  // add rows for adjectives
  var showAdjectives = function (data) {
    var adjRows = [];

    // TODO: adjectives should be sorted if the current column is sorted
    if (typeof data["adjs"] === "undefined" || data["adjs"] === {}) {
      return false;
    };

    $.each(data["adjs"], function(a, adj) {
      var adjRow = `<tr class="adjective">`;
      adjRow += "<td>";
      var adjRef = "";
      if (typeof adj["refs"] !== "undefined" || adj["refs"] !== {}) {
        var ref = "";
        if (adj["refs"]["wikidata"]) {
          ref += `<a class="ref wikidata" href="https://www.wikidata.org/wiki/${data["wikidata"]}">${data["wikidata"]}</a>`;
        };
        if (adj["refs"]["mathworld"]) {
          ref += `<a class="ref mathworld" href="https://mathworld.wolfram.com/${data["mathworld"]}.html">MathWorld</a>`;
        };
        if (adj["refs"]["eom"]) {
          ref += `<a class="ref eom" href="https://encyclopediaofmath.org/wiki/${data["eom"]}">EoM</a>`;
        };
        adjRef = ref;
      } else {
        adjRef = "n/a";
      };
      adjRow += adjRef;
      adjRow += "</td>";
      var emptyAdjRow = true;

      $.each(visibleLangs, function(i, lang) {
        adjRow += "<td>";
        var adjective = adj["root"][lang]
        if (typeof adjective === "undefined" || adjective["atom"] === "") {
          adjRow += "</td>";
          return true;
        };
        emptyAdjRow = false;
        var dir = langs[lang]["direction"];
        var pstn = adjective["pstn"]
        if ((pstn === "after" && dir === "LTR") || (pstn === "before" && dir === "RTL")) {
          adjRow+="___ "
        };
        adjRow += adjective["atom"];
        if ((pstn === "before" && dir === "LTR") || (pstn === "after" && dir === "RTL")) {
          adjRow+=" ___"
        };
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
