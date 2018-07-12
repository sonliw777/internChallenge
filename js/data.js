/* 
Team VI Intern Summer Challenge
data.js
Summer 2017
*/

var pdpLocation = "Title";
var state = "State";
var costOfLiving = "Cost_of_Living";
var averageRent = "Average_Rent";
var population = "Population";
var averageCommuteTime = "Average_Commute_Time";
var popularRestaurants = "Popular_Restaurants";
var majorRoadwaysNearby = "Major_Roadways_Nearby";
var transitOptions = "Transit_Options";
var collegesNearby = "Colleges_Nearby";
var nightLife = "Night_Life";
var demographics = "Demographics";
var ergsAvailable = "ERGs_Available";
var latitude = "Latitude";
var longitude = "Longitdude";
var poi1_id = "_x0050_OI1";
var poi1_description_id = "POI1_Description";
var poi2_id = "_x0050_OI2";
var poi2_description_id = "POI2_Description";
var poi3_id = "_x0050_OI3";
var poi3_description_id = "POI3_Description";
var address = "Address";
var survey_q1 = "Favorite Thing";
var survey_q2 = "Commute and Location";
var survey_q3 = "Biggest Downside";
var survey_q4 = "Type of Person";
var survey_q5 = "Advice";
var survey_q1_id = "Favorite_x0020_thing_x002f_thing";
var survey_q2_id = "Commute_x0020_and_x0020_location";
var survey_q3_id = "Biggest_x0020_Downside";
var survey_q4_id = "Type_x0020_of_x0020_person";
var survey_q5_id = "Advice";
	
/* --------------------------------------------------------------------------- */
/* 
"Class" definition for PDP locations. 
The data stored in location objects is extracted from excel speradsheets.
The fields correlate to the columns of the excel spreadsheet.

Types:
- id - integer
- Location Name - string
- State - string
- Average Rent - array of {String - housingType : float - rent/price} pairs
- Cost of Living - integer
- Population - integer
- Average Commute - float (in minutes)
- Popular Restaurants - array of {String - name : String - description} pairs
- Major Roadways Nearby - array of strings
- Transit Options - string
- Colleges Nearby - array of strings
- Night Life - array of strings
- Demographics - array of floats
- Points of Interest - array of {String - name : String - description} pairs
- Available ERGs - array of strings
- PDP Testimonals - array of dictionaries containing {String - question : String - answer} pairs
- longitude - float
- latitude - float
- Apartments Nearby - array of strings consisting of URLS to various housing sites
- address - string
- imageList - array of strings
*/

function Location () {
		this.id = 0;
		this.locationName = "";
		this.state = "";
		this.averageRent = {}; 
		this.costOfLiving = 100;
		this.population = 0;
		this.averageCommute = 0.0;
		this.popularRestaurants = [];
		this.majorRoadwaysNearby = [];
		this.transitOptions = "";
		this.collegesNearby = [];
		this.nightLife = [];
		this.demographics = [];
		this.pointsOfInterest = {};
		this.availableERGs = [];
		this.PDPTestimonals = {};
		this.longitude = 0.0;
		this.latitude = 0.0;
		this.address = "";
		this.apartmentsNearby = [];
		this.imageList = [];
}

// list of {String - stateName : Integer - count} pairs 
var stateCount = []; 

/* List of PDP Locations */
var listOfLocations = [];
var locationMap = {}; 
 

// load all necessary sharepoint javascript libaries

$(document).ready(function () {
	if (typeof SP !== 'undefined') {
		SP.SOD.executeFunc('sp.js', 'SP.ClientContext',	loadSharepointList);
	} else {
		/* Use hardcode in case SP list does not work */
		loadHardCode();
	}
});

// loads the sharepoint list
function loadSharepointList() {
	getItemsWithCaml('Team VI Location Information',
		function (collListItem) {
			// loop through the items.
	        var listEnumerator = collListItem.getEnumerator();
			var i = 0;
			
	        while (listEnumerator.moveNext()) {
	       		
	        	// get the current list item.
    			var location = new Location();
	        	var listItem = listEnumerator.get_current();
	        	
	        	// get the field values
				location.id = i++;
				location.locationName = listItem.get_item(replaceAmpersand(pdpLocation));
				location.state = listItem.get_item(state);
				location.costOfLiving = listItem.get_item(costOfLiving);
				location.averageRent = parseAverageRent(listItem.get_item(averageRent));
				location.population = listItem.get_item(population);
				location.averageCommute = listItem.get_item(averageCommuteTime);
				location.popularRestaurants = parseListField(replaceAmpersand(listItem.get_item(popularRestaurants)));
				location.majorRoadwaysNearby = parseListField(replaceAmpersand(listItem.get_item(majorRoadwaysNearby)));
				location.transitOptions = listItem.get_item(replaceAmpersand(transitOptions));
				location.collegesNearby = parseListField(replaceAmpersand(listItem.get_item(collegesNearby)));
				location.nightLife = parseListField(replaceAmpersand(listItem.get_item(nightLife)));
				location.demographics = parseListField(listItem.get_item(demographics));
				location.availableERGs = parseListField(replaceAmpersand(listItem.get_item(ergsAvailable)));
				location.latitude = listItem.get_item(latitude);
				location.longitude = listItem.get_item(longitude);
				location.address = listItem.get_item(replaceAmpersand(address));
				var poi1 = listItem.get_item(replaceAmpersand(poi1_id)).toString();
				var poi2 = listItem.get_item(replaceAmpersand(poi2_id)).toString();
				var poi3 = listItem.get_item(replaceAmpersand(poi3_id)).toString();
				location.pointsOfInterest[poi1] = listItem.get_item(replaceAmpersand(poi1_description_id));
				location.pointsOfInterest[poi2] = listItem.get_item(replaceAmpersand(poi2_description_id));
				location.pointsOfInterest[poi3] = listItem.get_item(replaceAmpersand(poi3_description_id));
				loadLinks(location);
				var image1 = 'https://oursites.myngc.com/ENT/PDPOnline/TechnicalServices/Interns/Team%20VI%20Files/PhotoAlbum/' + location.locationName + ', ' + location.state + '/1.jpg';
				var image2 = 'https://oursites.myngc.com/ENT/PDPOnline/TechnicalServices/Interns/Team%20VI%20Files/PhotoAlbum/' + location.locationName + ', ' + location.state + '/2.jpg';
				var image3 = 'https://oursites.myngc.com/ENT/PDPOnline/TechnicalServices/Interns/Team%20VI%20Files/PhotoAlbum/' + location.locationName + ', ' + location.state + '/3.jpg';		
				location.imageList.push(image1);
				location.imageList.push(image2);
				location.imageList.push(image3);				
				listOfLocations.push(location);
				locationMap[location] = location.locationName;
	        }
			loadSharepointList2();
	        initMap();
	        initView();
		},
		function (sender, args) {
	        console.log('An error occured while retrieving PDP list items:' + args.get_message());
	        loadHardCode();
	});
}

function loadSharepointList2() {
	getItemsWithCaml('Team VI Survey Data',
		function (collListItem) {
			// loop through the items.
	        var listEnumerator = collListItem.getEnumerator();
			var i = 0;
			
	        while (listEnumerator.moveNext()) {
	       		
				var survey_entry = {};
				var listItem = listEnumerator.get_current();
				
				// x => x.locationName==listItem.get_item(pdpLocation)
				function getLocIndex(x) {
					return x.locationName==listItem.get_item(pdpLocation);
				}
	        	// get the current list item.
				for (var j = 0; j < listOfLocations.length; j++) {
					if (listOfLocations[j].locationName==listItem.get_item(pdpLocation)) {
						i = j;
						break;
					}
				}
				// push all survey answers to PDPTestimonial Dictionary (key = question : value = answer)
				listOfLocations[i].PDPTestimonals[survey_q1] = listItem.get_item(replaceAmpersand(survey_q1_id));
				listOfLocations[i].PDPTestimonals[survey_q2] = listItem.get_item(replaceAmpersand(survey_q2_id));
				listOfLocations[i].PDPTestimonals[survey_q3] = listItem.get_item(replaceAmpersand(survey_q3_id));
				listOfLocations[i].PDPTestimonals[survey_q4] = listItem.get_item(replaceAmpersand(survey_q4_id));
				listOfLocations[i].PDPTestimonals[survey_q5] = listItem.get_item(replaceAmpersand(survey_q5_id));
	        }
		},
		function (sender, args) {
	        console.log('An error occured while retrieving Survey list items:' + args.get_message());
	        loadHardCode();
	});
}

function getItemsWithCaml(listTitle, success, error) {
	// create the sharepoint content.
	var context = SP.ClientContext.get_current();
	
	// get the list by the title.
	var list = context.get_web().get_lists().getByTitle(listTitle);
	
	var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml('<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' + 
        '<Value Type=\'Number\'>1</Value></Geq></Where></Query></View>');
    this.collListItem = list.getItems(camlQuery);

	context.load(collListItem);

	context.executeQueryAsync(
        function () {
            success(collListItem);
        },
        error
    );
}

function parseAverageRent(averageRent) {
	var list = [];
	averageRent = averageRent.replace(/<strong>/g, '');
	averageRent = averageRent.replace(/<\/strong>/g, '');
	list = averageRent.split('<br>');
	var ret = {};
	ret[list[0]] = list[1];
	ret[list[2]] = list[3];
	return ret;
}

function parseListField(listField) {
	return listField.split('<br>');
}

function replaceAmpersand(string) {
	return string.replace(/&amp;/g, '&');
}

/* Function is called ONLY IF either Sharepoint List for Survey
	or PDP locations fail to load */
function loadHardCode() {
	
	initHardCode();
	initMap();
	initView();
}

function loadLinks(location) {
	
	var collegeGoogle, apartments, airbnb, zillow, rent, homes, 
		restaurantsGoogle, restaurantsYelp, allMenus, nightLifeYelp, groupon;

	var city = location.locationName, state = location.state;

	// Nearby Colleges
	collegeGoogle = ["Find More Colleges", "https://www.google.com/maps/search/Colleges+near+" + city + ",+" + state];

	// Nearby Apartment Complexes
	apartments = ['Apartments.com', 'https://www.apartments.com/' + city.toLowerCase() + '-' + state.toLowerCase() + '/'];
	walkscore = ['Walk Score' , 'https://www.walkscore.com/' + location.state + '/' + location.locationName];
	airbnb = ["Airbnb", "https://www.airbnb.com/s/" + city + "--" + state + "--United-States/"];
	zillow = ['Zillow', 'https://www.zillow.com/' + city.toLowerCase() + '-' + state.toLowerCase() + '/'];
	rent = ['Rent.com', 'http://www.rent.com/' + abbrState(state, "name").toLowerCase() + '/' + city.toLowerCase() + '-apartments'];
	homes = ['Homes.com', 'http://www.homes.com/rentals/' + city.toLowerCase() + '-' + state.toLowerCase() + '/'];

	// Popular Restaurants
	restaurantsYelp = ["Yelp", "https://www.yelp.com/search?find_desc=Restaurants&find_loc=" + city + "+" + state];
	allMenus = ["Allmenus", "https://www.allmenus.com/"+ state.toLowerCase() + "/" + city.toLowerCase() +"/"];
	restaurantsGoogle = ["Find More Restaurants", "https://www.google.com/maps/search/Restaurants+near+" + city + ",+" + state];

	// Night life
	nightLifeYelp = ["Yelp", "https://www.yelp.com/search?cflt=nightlife&find_loc=" + city + "+" + state];

	var collegesNearby = [collegeGoogle], 
		apartmentsNearby = [airbnb, apartments, homes, rent, zillow],
		popularRestaurants = [allMenus, restaurantsYelp, restaurantsGoogle],
		nightLife = [nightLifeYelp];

	var locRefs = [[location.collegesNearby, collegesNearby], 
		[location.apartmentsNearby, apartmentsNearby], 
		[location.popularRestaurants, popularRestaurants]];

	for (var ref in locRefs) {
		var field = locRefs[ref][0];
		var sites = locRefs[ref][1];

		for (var site in sites) {
			var site_name = sites[site][0];
			var site_url = sites[site][1];
			/*console.log(site_url)*/

			field.push(link(site_url, site_name)); 
		}
	}
}