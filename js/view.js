/*
  Team VI Intern Summer Challenge
  view.js
  Summer 2017
	Design logic for MS fabric is used here
*/

var comparisons = [];
var currentID;

// Dialog box
var DialogElements;
var DialogComponents;
var classToDialog;

// Large Pivot;
var PivotElements;

// Checkbox;
var CheckBoxElements;

// Table;
var TableElements;

// Button;
var ButtonElements;

// Dropdown;
var DropdownHTMLElements;

// MessageBanner;
var MessageBannerExample;
var MessageBanner;
var MessageBannerCloseButton;

var  myShow;

function initView() {
	
  changeDialogSize();

  // Dialog box
	DialogElements = document.querySelectorAll(".ms-Dialog");
	DialogComponents = [];
	classToDialog = {};
	for (var i = 0; i < DialogElements.length; i++) {
	  (function () {
		//console.log(DialogElements[i].parentElement.className);

		DialogComponents[i] = new fabric['Dialog'](DialogElements[i]);
		classToDialog[DialogElements[i].parentElement.className] = DialogComponents[i];
	  }());
	}

	// Large Pivot
	PivotElements = document.querySelectorAll(".ms-Pivot");
	for (var i = 0; i < PivotElements.length; i++) {
	  new fabric['Pivot'](PivotElements[i]);
	}

	// Checkbox
	CheckBoxElements = document.querySelectorAll(".ms-CheckBox");
	for (var i = 0; i < CheckBoxElements.length; i++) {
	  new fabric['CheckBox'](CheckBoxElements[i]);
	}

	// Table
	TableElements = document.querySelectorAll(".ms-Table");
	for (var i = 0; i < TableElements.length; i++) {
	  new fabric['Table'](TableElements[i]);
	}

	// Button
	ButtonElements = document.querySelectorAll(".ms-Button");
	for (var i = 0; i < ButtonElements.length; i++) {
		new fabric['Button'](ButtonElements[i], function() {
	  // Insert Event Here
		});
	}

	// Dropdown
	generateDropdowns();
	DropdownHTMLElements = document.querySelectorAll('.ms-Dropdown');
	for (var i = 0; i < DropdownHTMLElements.length; ++i) {
	  var Dropdown = new fabric['Dropdown'](DropdownHTMLElements[i]);
	}
	// MessageBanner
	MessageBannerExample = document.querySelector('.docs-MessageBannerExample');
	MessageBanner = new fabric['MessageBanner'](MessageBannerExample.querySelector('.ms-MessageBanner'));
	MessageBannerCloseButton = MessageBannerExample.querySelector('.ms-MessageBanner-close');
	
  myShow = w3.slideshow(".loc_pics", 0);
  //$("td").addClass("ms-fontSize-mPlus")
}

// Comparison
function addToComparison() {
	//alert("In addToComparison " + comparisons.length);
	var idLoc = comparisons.indexOf(currentID);
  if(idLoc == -1) {
    if (comparisons.length < 3) {
      comparisons.push(currentID);
    } else {
      sendError("You May Only Compare Up to 3 Different Locations");
    }
  } else {
    hideError();
    comparisons.splice(idLoc, 1);
  }

	// if element is on list -> means remove it
	// else add it to list as long as there are no more than 3 slot avaiable
}

// open comparison dialog
function launchComparison(){
  
  var begin = '<td class="main_column ms-fontSize-mPlus"><i class="ms-Icon ',
    middle = '><label></label></i> ', end = '</td><td class="loc_entry">';

  var costOfLiving = begin + 'ms-Icon--Money"' + middle + 'Cost of Living' + end,
    population = begin + 'ms-Icon--Family"' + middle + 'Population' + end,
    popularRestaurants = begin + 'ms-Icon--EatDrink"' + middle + 'Popular Restaurants' + end,
    majorRoadwaysNearby = begin + 'ms-Icon--Merge"' + middle + 'Nearby Highways' + end,
    transitOptions = begin + 'ms-Icon--Airplane"' + middle + 'Transportation Options' + end,
    collegesNearby = begin + 'ms-Icon--Ribbon"' + middle + 'Nearby Colleges' + end,
    demographics = begin + 'ms-Icon--PieDouble"' + middle + 'Demographics' + end,
    pointsOfInterest = begin + 'ms-Icon--POI"' + middle + 'Points of Interest' + end,
    availableERGs = begin + 'ms-Icon--CheckList"' + middle + 'Available ERGs' + end,
    PDPTestimonals = begin + 'ms-Icon--Chat"' + middle + 'PDP Testimonials' + end,
    apartmentsNearby = begin + 'ms-Icon--HomeSolid"' + middle + 'Nearby Apartment Complexes' + end,
    averageCommute = begin + 'ms-Icon--Clock"' + middle + 'Average Commute' + end,
    nightLife = begin + 'ms-Icon--Cocktails"' + middle + 'Night Life' + end,
    averageRent = begin + 'ms-Icon--Money"' + middle + 'Average Rent' + end;

  if(comparisons.length < 2) {
    sendError("Please Select Either 2 or 3 Locations to Compare");
  } else {
    hideError();
    var sections = ["comp_loc_info", "comp_detail", "comp_transport", 
        "comp_housing", "comp_activities"];
    var th = '<th class="ms-fontSize-mPlus ms-fontWeight-semibold">';
    var table_header = th + '</th>' + th;
    var data_end = '</td><td class="loc_entry">',
        header_end = "</th>" + th;

    for(i in comparisons) {
      var loc = listOfLocations[comparisons[i]];
      
      var city_state = loc.locationName + ", " + loc.state;
      
      if ((parseInt(i) + 1) == comparisons.length) {
        data_end = "";
        header_end = "";
      }

      table_header += (city_state + header_end);

      averageRent += formatRent(loc.averageRent) + data_end;
      costOfLiving += toP(loc.costOfLiving) + data_end;
      population += toP(loc.population.toLocaleString()) + data_end;
      averageCommute += toP(loc.averageCommute) + data_end;
      popularRestaurants += listToUL(loc.popularRestaurants) + data_end;
      majorRoadwaysNearby += listToUL(loc.majorRoadwaysNearby) + data_end;
      transitOptions += toP(loc.transitOptions) + data_end;
      collegesNearby += listToUL(loc.collegesNearby) + data_end;
      nightLife += listToUL(loc.nightLife) + data_end;
      demographics += listToUL(loc.demographics) + data_end;
      pointsOfInterest += formatPOI(loc.pointsOfInterest) + data_end;
      availableERGs += listToUL(loc.availableERGs) + data_end;
      PDPTestimonals += listToUL(loc.PDPTestimonals) + data_end;
      apartmentsNearby += listToUL(loc.apartmentsNearby) + data_end;
    }
    //console.log(costOfLiving);
    /* make the headers */
    for(j in sections) {
      document.getElementById(sections[j]).innerHTML = table_header;
    }

    /* Make the data */
    //averageRent;
    document.getElementById("comp_apartmentsNearby").innerHTML = apartmentsNearby;
    document.getElementById("comp_costOfLiving").innerHTML = costOfLiving;
    document.getElementById("comp_population").innerHTML = population;
    document.getElementById("comp_popularRestaurants").innerHTML = popularRestaurants;
    document.getElementById("comp_majorRoadwaysNearby").innerHTML = majorRoadwaysNearby;
    document.getElementById("comp_transitOptions").innerHTML = transitOptions;
    document.getElementById("comp_collegesNearby").innerHTML = collegesNearby;
    document.getElementById("comp_demographics").innerHTML = demographics;
    document.getElementById("comp_pointsOfInterest").innerHTML = pointsOfInterest;
    document.getElementById("comp_availableERGs").innerHTML = availableERGs;

    document.getElementById("comp_averageRent").innerHTML = averageRent;
    document.getElementById("comp_nightLife").innerHTML = nightLife;
    document.getElementById("comp_averageCommute").innerHTML = averageCommute;


    // Make pivot tab go to at a glance
    resetPivot("_comp");

    openDialog("compare-Dialog-lgHeader");
  }
}

// With id locating Location object, display it's properties in dialog
function launchDialog(id) {
	//alert("In launchDialog " + listOfLocations[id].population);
  
  if(id == null || id >= listOfLocations.length || id < 0) {
    return;
  }

  var loc = listOfLocations[id];
  currentID = id;

  // Make pivot tab go to at a glance
  resetPivot("");
  // Make compare check box unchecked
  /*alert("ID: " + id + " | comparisons: " + comparisons);*/
  if(comparisons.indexOf(id) != -1) {
    /*alert("will show checkbox");*/
    $('#comp_box').attr('class', 'ms-CheckBox-field in-focus');
    $('#comp_box').attr('class', 'ms-CheckBox-field is-checked');
    $('#comp_box').attr('aria-checked', 'true');
  } else {
    /*alert("will hide checkbox");*/
    $('#comp_box').attr('class', 'ms-CheckBox-field in-focus');
    $('#comp_box').attr('class', 'ms-CheckBox-field');
    $('#comp_box').attr('aria-checked', 'false');
  }

  document.getElementById("locationName").innerHTML = loc.locationName + ", " + loc.state;
  document.getElementById("apartmentsNearby").innerHTML = listToUL(loc.apartmentsNearby);
  document.getElementById("costOfLiving").innerHTML = toP(loc.costOfLiving);
  document.getElementById("population").innerHTML = toP(loc.population.toLocaleString());
  document.getElementById("popularRestaurants").innerHTML = listToUL(loc.popularRestaurants);
  document.getElementById("majorRoadwaysNearby").innerHTML = listToUL(loc.majorRoadwaysNearby);
  document.getElementById("transitOptions").innerHTML = toP(loc.transitOptions);
  document.getElementById("collegesNearby").innerHTML = listToUL(loc.collegesNearby);
  document.getElementById("demographics").innerHTML = listToUL(loc.demographics);
  document.getElementById("pointsOfInterest").innerHTML = formatPOI(loc.pointsOfInterest);
  document.getElementById("availableERGs").innerHTML = listToUL(loc.availableERGs);
  
  document.getElementById("averageRent").innerHTML = formatRent(loc.averageRent);
  document.getElementById("nightLife").innerHTML = listToUL(loc.nightLife);
  document.getElementById("address").innerHTML = 
  	toP(link("https://www.google.com/maps/place/" + loc.address.replace(/ /g, "+"), loc.address));
  document.getElementById("PDPTestimonals").innerHTML = formatTest(loc.PDPTestimonals);
  document.getElementById("averageCommute").innerHTML = toP(loc.averageCommute);
  formatImages(loc.imageList);

  openDialog("docs-DialogExample-lgHeader");
  resetDropdown();
}

// 
function helpDialog() {
  openDialog("help-DialogExample-lgHeader");
}

function openDialog(name) {
  getDialogComponent(name).open();
  $("." + name).find(".ms-Overlay").addClass("ms-Overlay--dark"); // paint it black
  $("." + name).find(".ms-Overlay").attr("style","z-index: 10001;");
}

function closeDialog(name) {
  getDialogComponent(name).close();
}

function getDialogComponent(name) {
  return classToDialog[name];
}

function listToUL(list) {
  var res = '<ul>';

  for (i in list) { res += '<li class="ms-fontSize-mPlus">' + list[i] + '</li>'; }  
  res += '</ul>';

  return res;
}

function sendError(message) {
  document.getElementById("comp_err_megs").innerHTML = message;
  MessageBanner.showBanner();
}

function hideError() {
  MessageBanner._hideBanner();
}

function resetPivot(comp) {

  var loc_content = "#loc_content" + comp;

  if (!$("#glance" + comp).hasClass("is-selected")) {
    $("#transportation" + comp).removeClass("is-selected");
    $("#housing" + comp).removeClass("is-selected");
    $("#activities" + comp).removeClass("is-selected");
    $("#testimonials" + comp).removeClass("is-selected");
    $("#glance" + comp).addClass("is-selected");

    var dataContents = $(loc_content).find(".ms-Pivot-content");
    $.each(dataContents, function (i, item) {
       //console.log($(item).attr("data-content") == "glance")
      if($(item).attr("data-content") == "glance")
        $(item).attr('style', 'display: block;');
      else
        $(item).attr('style', 'display: none;');
    });
  }
}

function generateDropdowns() {
  var id = "#locations_dropdown";
  var name = id;

  $.each(listOfLocations, function (i, item) {
    $(id).append($('<option>', { 
        value: item.id,
        text : item.locationName + ", " + item.state 
    }));
  });
}

// keyboard
$(document).keyup(function(e) {
  if (e.keyCode === 27) {   // esc
    $.each(classToDialog, function (dialog, dontcare) {
      if ($("." + dialog).find("div.ms-Dialog").hasClass("is-open")) {
        //console.log(dialog);
        closeDialog(dialog);
      }
    });
  }
});

function abbrState(input, to){
    
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
}

function formatTest(testimonials) {

  var result = "";


  Object.keys(testimonials).forEach(function(question) {
    if(testimonials[question] != null && testimonials[question] != "") {
      result += '<p class="ms-font-l ms-fontWeight-semibold">'+ question +'</p>';
      result += '<p class="ms-fontSize-mPlus">'+ testimonials[question] +'</p>';
      result += '<br>';
    }
  });

  return result == "" ? '<p class="ms-font-l">There are no testimonials available for this location at this time.</p>': result;
}

function formatRent(rents) {
  
  var result = [];

  Object.keys(rents).forEach(function(houseType) {
    result.push("<b>" + houseType + "</b>: " + rents[houseType].toLocaleString());
  });

  return listToUL(result);
}

function formatPOI(title) {
  
  var result = [];

  Object.keys(title).forEach(function(description) {
    result.push("<b>" + description + "</b>: " + title[description]);
  });

  return listToUL(result);
}

function formatImages(images) {
  if (images.length > 0) {
    $("#imageList").css("display", "inline");
  } else {
    $("#imageList").css("display", "none");
  }

  for(var i in images) {
    $("#pic" + (parseInt(i) + 1)).attr("src", images[i]);
  }
}

function toP(text) {
  return '<p class="ms-fontSize-mPlus">' + text + '</p>';
}

// disable body scroll when dialog is open
function hideScroll() {
    // console.log("hiding");
    $('#s4-workspace').css('overflow','hidden');
}

function showScroll() {
    // console.log("unhiding");
    $('#s4-workspace').css('overflow','scroll');
}

function resetDropdown() {
  var selectedItem = $(".ms-Dropdown-items").find(".is-selected");
  var message = $("#locations_dropdown")[0][0].text;

  $("#locations_dropdown").val(-1);
  $(".ms-Dropdown").find(".ms-Dropdown-title")[0].innerText = message;
  $(selectedItem).removeClass("is-selected");

}

/*$(window).resize(function(){
    changeDialogSize();
});*/


function changeDialogSize() {
  
  if($("#s4-workspace").height() <= 600) {
    /*console.log("Changing size");*/
    $(".ms-Dialog").css("max-height", 550);
    $(".ms-Dialog").css("min-height", 550);
    $(".jc-dialog").css("max-height", 350);
    $(".jc-dialog").css("min-height", 350);
    $(".nocomp-dialog").css("max-height", 440);
    $(".nocomp-dialog").css("min-height", 440);
  }
}

function link(site, text) {
	return '<a href="'+ site +'" target="_blank">' + text + "</a>";
}