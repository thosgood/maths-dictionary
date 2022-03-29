var langs = {};
var dict = {};
var languageCodes = [];
var visibleLangs = [];
var RTLLangs = [];

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
    // TO-DO: set RTLLangs from json data
    RTLLangs = ["FA"];
    // Get all language codes
    languageCodes = Object.keys(langs);

    var i = 1;
    $.each(json, function(code, data){
      var html = `<li><input type="checkbox" id="${code}" name="${code}" data-column="${i}"`
      // EN and FR are checked by default
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
            ref += `<a class="ref mathworld" href="https://mathworld.wolfram.com/${data["mathworld"]}.html">[MathWorld]</a>`;
          };
          if (data["eom"]) {
            ref += `<a class="ref eom" href="https://encyclopediaofmath.org/wiki/${data["eom"]}">[EoM]</a>`;
          };
          if (data["nlab"]) {
            ref += `<a class="ref nlab" href="https://ncatlab.org/nlab/show/${data["nlab"]}">[nLab]</a>`;
          };
          if (data["pm"]) {
            ref += `<a class="ref pm" href="https://planetmath.org/${data["pm"]}">[PlanetMath]</a>`;
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
        "render": function( data, type, row ) {
          var string = ""
          string += data["atom"];
          if (data["gend"] != "") {
            string += `<span class="gender">(${data["gend"][0]})</span>`;
          };
          if (data["vrfd"] == false) {
            string = `<span class="unverified">${string}</span>`;
          };
          return string;
        },
        "createdCell": function (td, cellData, rowData, row, col) {
          if ( RTLLangs.includes(language) ) {
            $(td).addClass('RTL')
          }
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
    // TO-DO: adjectives should be sorted if the current column is sorted
    var adjRows = [];

    if (typeof data["adjs"] === "undefined" || data["adjs"] === {}) {
      return false;
    };

    $.each(data["adjs"], function(a, adj) {
      var adjRow = document.createElement("tr");
      adjRow.classList.add('adjective');
      var adjRowRef = document.createElement("td");
      var adjRef = "";
      if (typeof adj["refs"] !== "undefined" || adj["refs"] !== {}) {
        var ref = "";
        if (adj["refs"]["wikidata"]) {
          ref += `<a class="ref wikidata" href="https://www.wikidata.org/wiki/${adj["refs"]["wikidata"]}">${adj["refs"]["wikidata"]}</a>`;
        };
        if (adj["refs"]["mathworld"]) {
          ref += `<a class="ref mathworld" href="https://mathworld.wolfram.com/${adj["refs"]["mathworld"]}.html">[MathWorld]</a>`;
        };
        if (adj["refs"]["eom"]) {
          ref += `<a class="ref eom" href="https://encyclopediaofmath.org/wiki/${adj["refs"]["eom"]}">[EoM]</a>`;
        };
        if (adj["refs"]["nlab"]) {
          ref += `<a class="ref nlab" href="https://ncatlab.org/nlab/show/${adj["refs"]["nlab"]}">[nLab]</a>`;
        };
        if (adj["refs"]["pm"]) {
          ref += `<a class="ref pm" href="https://planetmath.org/${adj["refs"]["pm"]}">[PlanetMath]</a>`;
        };
        adjRef = ref;
      } else {
        adjRef = "n/a";
      };
      adjRowRef.innerHTML = adjRef;
      adjRow.appendChild(adjRowRef);
      var emptyAdjRow = true;

      $.each(visibleLangs, function(i, lang) {
        var content = ""
        var adjective = adj["root"][lang]
        // if (typeof adjective === "undefined" || adjective["atom"] === "") {
        //   return true;
        // };
        emptyAdjRow = false;
        var dir = langs[lang]["direction"];
        var pstn = adjective["pstn"]
        if ((pstn === "after" && dir === "LTR") || (pstn === "before" && dir === "RTL")) {
          content += "___ "
        };
        content += adjective["atom"];
        if ((pstn === "before" && dir === "LTR") || (pstn === "after" && dir === "RTL")) {
          content += " ___"
        };
        // if (content.length === 0) {
        //   content = "n/a"
        // };
        var adjRowEntry = document.createElement("td");
        if (dir === "RTL") {
          adjRowEntry.classList.add('RTL');
        };
        adjRowEntry.appendChild(document.createTextNode(content));
        adjRow.appendChild(adjRowEntry);
      });

      if (!emptyAdjRow) {
        adjRows.push(adjRow);
      }
    });

    adjRows.forEach((row, index) => {
      (index % 2 == 0) ? row.classList.add('even') : row.classList.add('odd')
    });

    return adjRows;
  };

})
