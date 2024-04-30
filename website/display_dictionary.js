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
  $.getJSON("https://thosgood.com/maths-dictionary/data/languages.json", function(json) {
    langs = json;
    // TO-DO: set RTLLangs from json data
    RTLLangs = ["FA"];
    // Get all language codes
    languageCodes = Object.keys(langs);

    var i = 1;
    $.each(json, function(code, data){
      var html = `<li><input type="checkbox" id="${code}" name="${code}" data-column="${i}"`
      // EN, FA, and FR are checked by default
      if (code == "EN" || code == "FA" || code == "FR"){
        html += "checked"
      }
      html +=`><label for="${code}">${data["endonym"]}</label></li>`
      $("#language_selectors").append(html);
      i++;
    });
    updateVisibleLangs();
  });

  $.getJSON("https://thosgood.com/maths-dictionary/data/nouns.json", function(json) {
    // convert the dict as an array
    var data = Object.values(json);

    // For columns configuration see https://datatables.net/examples/ajax/deep.html
    var columnsConf = [];

    var refsCol = {
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
        "data": language,
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
      if (language == "EN" || language == "FA" || language == "FR") {
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
      "order": [[ 3, "asc" ]],
    })// closing DataTable


    // toggle table columns on click
    $("#language_selectors").on("click", 'input', function(){
      // Get the column API object
      var colId = $(this).attr('data-column')
      var column = table.column( colId );

      // Toggle the visibility
      column.visible( ! column.visible() );

      // set visibleLangs
      updateVisibleLangs()

      //this will toggle the column's searchability
      //https://datatables.net/forums/discussion/comment/167155/#Comment_167155
      let columnsettings = table.settings()[0].aoColumns[colId];
      columnsettings.bSearchable = column.visible();
      //reset the table's searchability settings to add or remove the toggled column
      table.rows().invalidate();
      table.draw();//this will rerun the last search with the visible fields only
    });// toggle table columns on click

  });// closing the getJSON



})
