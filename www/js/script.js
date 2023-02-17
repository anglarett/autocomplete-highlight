let map, marker, geocoder, selector, styler, selection;


function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.75861023974578, lng: -73.99025568339954 },
    zoom: 11,
    // In the cloud console, configure this Map ID with a style that enables the
    // "US Locality" Data Driven Styling type.
    mapId:'3ab4e8320f376d2f', //'6334f44ab2b94ec4',//e232e4235837d39f,'250fbb79f55f5dd5',//'ad1c830ccb09a01d',//'ef7b21852e0ec9b5', //'adb0f7235f906e9',  
    disableDefaultUI: false,
    //clickableIcons: false
});
document.getElementById('map').style.visibility='hidden'  

// Wait for the tiles to load before restyling.
google.maps.event.addListenerOnce(map, 'tilesloaded',() => {
    // restyleInvisible(["true"]);
    map.addListener('idle', zoomLevel);
    document.getElementById('map').style.visibility='visible';  
});

var options = {
types:['geocode'],//['(regions)']
componentRestrictions: {country: "us"}
};


geocoder = new google.maps.Geocoder();

// Create the search box and link it to the UI element.
var input = document.getElementById('my-input-searchbox');
var autocomplete = new google.maps.places.Autocomplete(input, options);
map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

marker = new google.maps.Marker({
      map: map
});
    
// Bias the SearchBox results towards current map's viewport.
autocomplete.bindTo('bounds', map);
// Set the data fields to return when the user selects a place.
//autocomplete.setFields(['place_id','address_components', 'geometry', 'name'])

autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    console.log(place)
    console.log("place id : " + place.place_id)

  if (!place.geometry) {
    console.log("Returned place contains no geometry");
    return;
  }
  var bounds = new google.maps.LatLngBounds();
  marker.setPosition(place.geometry.location);

  if (place.geometry.viewport) {
    // Only geocodes have viewport.
    bounds.union(place.geometry.viewport);
  } 
  else {
    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
  console.log("place types: " + place.types)
    for (var i=0; i < place.types.length ; i++){ 
        if(place.types[i] == "sublocality"){
          //fix zoom at sublocality level to make sure bounds are visible
            map.setZoom(13)
        }else if(place.types[i] == "postal_code"){
          //fix zoom at postal_code level to make sure bounds are visible
            map.setZoom(14)
        }
    }

  // autocomplete setLocalityStyle
  restyleMap(place.place_id, "autocomplete");
    selection = place.place_id;
});

}


function restyleMap(val, type) {
switch(type){
  case "autocomplete": 
      restyleInvisible(["true"]);
      selector = (metadata) => {
        return metadata.getProperty('placeid') === val;
      };
      // Style it to transparent pink with an opaque stroke.
       styler = /** @type {!google.maps.StyleOptions} */({
          fillColor: "#FFFFFF",//'#C70039',
          fillOpacity: 0.01,
          strokeColor: '#C70039',
          strokeOpacity: 1.0,
          strokeWeight: 1.0,
      });
    break;
}
map.restyle(selector, styler);
}

// adjust zoom    
function zoomLevel(){
var currentZoom = map.getZoom();
restyleMap(currentZoom, "zoom");
}
  
// Restyle Invisible
function restyleInvisible(selectorArray) {

// Select all locality features.
for (var i=0; i <= selectorArray.length ; i++){
  //console.log(selectorArray[0])
const selectionInvisible = selectorArray[i];
if(selectionInvisible == "true"){
  selector = (metadata) => selectionInvisible
} else{
    selector = (metadata) => {
    return metadata.hasProperty(selectionInvisible);
    }
}      

  // Style them invisible.
  styler = /** @type {!google.maps.StyleOptions} */({
      fillColor: 'white',
      fillOpacity: 0.01,
      strokeColor: 'white',
      strokeOpacity: 0.0,
      strokeWeight: 0.0,
  });
  map.restyle(selector, styler);
}
}    
// Restyle Invisible
function restyleVisible(selectorArray) {
console.log('style visible');

// Select all locality features.
for (var i=0; i <= selectorArray.length ; i++){
  //console.log(selectorArray[0])
const selectionVisible = selectorArray[i];
if(selectionVisible == "true"){
  selector = (metadata) => selectionVisible
} else{
    selector = (metadata) => {
    return metadata.hasProperty(selectionVisible);
    }
}      

  // Style them invisible.
  styler = /** @type {!google.maps.StyleOptions} */({
      fillColor: 'white',
      fillOpacity: 0.3,
      strokeColor: 'grey',
      strokeOpacity: 1.0,
      strokeWeight: 3.0,
  });
  map.restyle(selector, styler);
}        
}

 