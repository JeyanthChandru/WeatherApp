var username = "Jeyanth_Chandru";
var request = new XMLHttpRequest();
var DEFAULT_ZOOM_LEVEL = 17,
    DEFAULT_COORDINATE = {lat: 32.75, lng: -97.13};
var map,geocoder,infowindow,data,addr;
var markers=[];

function scrollDocument() {
    window.scrollTo(0,document.body.scrollHeight);
}
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: DEFAULT_ZOOM_LEVEL,
    center: DEFAULT_COORDINATE,
  });
  geocoder = new google.maps.Geocoder;
  infowindow = new google.maps.InfoWindow;
  document.getElementById('getWeatherInfo').addEventListener('click', function() {
    reversegeocode(geocoder, map, infowindow);
    sendRequest();
  });
  addMarker(DEFAULT_COORDINATE);
  google.maps.event.addListener(map,'click',function(event) {
    document.getElementById('latlongclicked').value = event.latLng.lat()
    document.getElementById('lotlongclicked').value =  event.latLng.lng()
  });
  google.maps.event.addListener(map,'mousemove',function(event) {
    document.getElementById('latspan').value = event.latLng.lat()
    document.getElementById('lngspan').value = event.latLng.lng()
  });
}

function clearFn(){
  document.getElementById("output").innerHTML = "";
}

function reversegeocode(geocoder, map, infowindow) {
  var lat = geoCalc.get('latlongclicked', "lat");
  var lng = geoCalc.get('lotlongclicked', "lng");
  var latlng = {lat,lng};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        addr = results[0].formatted_address;
        addMarker(latlng);
        infowindow.setContent(addr);
        infowindow.open(map, markers[0]);
        } 
      else {
        window.alert('No results found');
      }
    } 
    else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

function addMarker(location) {
  deleteMarkers();
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function deleteMarkers() {
  setMapOnAll(null);
  markers = [];
}

var geoCalc = function() {
  var formatNumber = function(value) {
    if(!value) {
      value = "0";
    }
    return Number(parseFloat(value));
  };
  var getInputValue = function(param, coordinate) {
    var $dom = document.getElementById(param);
    if ($dom.value === "") {
      $dom.value = (coordinate === 'lat') ? DEFAULT_COORDINATE.lat : DEFAULT_COORDINATE.lng;
    }
  return $dom.value;
  };
  var getFormattedInputValue = function(param, coordinate) {
    var inputValue = getInputValue(param, coordinate);
    return formatNumber(inputValue);
  };
  return {
    get: getFormattedInputValue
  }
}();

function compileHandlebars(data){
    var source   = $("#weatherOutput").html();
    var template = Handlebars.compile(source);
    console.log(source, template);
    return template(data);
}

function displayResult () {
  if (request.readyState == 4) {
    var xml = request.responseXML.documentElement;
    var lat = geoCalc.get('latlongclicked', "lat");
    var lng = geoCalc.get('lotlongclicked', "lng");
    var $out = document.getElementById("output");
    temperature = xml.getElementsByTagName("temperature")[0].childNodes[0].nodeValue;
    windSpeed = xml.getElementsByTagName("windSpeed")[0].childNodes[0].nodeValue;
    clouds = xml.getElementsByTagName("clouds")[0].childNodes[0].nodeValue;
    if(clouds.toLowerCase() === "n/a")
    {
        clouds = "clear sky";
    }
    data = {"format_addr" : addr, "temperature" : temperature,"windSpeed" : windSpeed, "clouds" : clouds};
    $out.innerHTML = $out.innerHTML + compileHandlebars(data);
    scrollDocument();
  }
}

function sendRequest () {
  request.onreadystatechange = displayResult;
  var lat = geoCalc.get('latlongclicked', "lat");
  var lng = geoCalc.get('lotlongclicked', "lng");
  request.open("GET"," http://api.geonames.org/findNearByWeatherXML?lat="+lat+"&lng="+lng+"&username="+username);
  request.send(null);
}