var api_key = "6af8a467321d0e841c8b0b825afeba9e";
function displayWeatherInfo(data) {
    data.wind.speed = processWindSpeed(data.wind.speed);
    data.wind.deg = processWindDirection(data.wind.deg);
    data.clouds.all = processClouds(data.clouds.all);
    data.weather[0].main = processVisibility(data.weather[0].main);
    var date = new Date(1e3 * data.dt);
    data.dt = date.toLocaleString().replace(/,/, "").replace(/:\w+$/, "");
    data.sys.sunrise = toTime(data.sys.sunrise);
    data.sys.sunset = toTime(data.sys.sunset);
    data.main.temp = (data.main.temp - 273.15).toFixed(1);
    data.main.temp_min = (data.main.temp_min - 273.15).toFixed(1);
    data.main.temp_max = (data.main.temp_max - 273.15).toFixed(1);
    var source   = $("#weatherOutput").html();
    var template = Handlebars.compile(source);
    console.log(source, template);
    $('#output').html(template(data));
}
function processWindSpeed(speed){
    if(speed >= 0 && speed < 1.6) {
        speed = "Calm " + speed + " m/s";
    }
    else if (speed >= 1.6 && speed <= 3.3) {
        speed = "Light Breeze " + speed + " m/s";
    }
    else if (speed >= 3.4 && speed < 5.5) {
        speed = "Gentle Breeze " + speed + " m/s";
    }
    else if (speed >= 5.5 && speed < 8) {
        speed = "Moderate Breeze " + speed + " m/s";
    }
    else if (speed >= 8 && speed < 10.8) {
        speed = "Fresh Breeze " + speed + " m/s";
    }
    else if (speed >= 10.8 && speed < 13.9) {
        speed = "Strong Breeze " + speed + " m/s";
    }
    else if (speed >= 13.9&& speed < 17.2) {
        speed = "High Wind, Near Gale " + speed + " m/s";
    }
    else if (speed >= 17.2 && speed < 20.7) {
        speed = "Gale " + speed + " m/s";
    }
    else if (speed >= 20.8 && speed < 24.5) {
        speed = "Severe Gale " + speed + " m/s";
    }
    else if (speed >= 24.5 && speed < 28.5) {
        speed = "Storm " + speed + " m/s";
    }
    else if (speed >= 28.5 && speed < 32.7) {
        speed = "Violent Storm " + speed + " m/s";
    }
    else if (speed >= 32.7 && speed < 64) {
        speed = "Hurricane " + speed + " m/s";
    }
    return speed;
}
function processWindDirection(deg){
    if(deg >= -11.25 && deg < 11.25) {
        deg = "North (" + deg + ")";
    }
    else if (deg >= 11.25 && deg <= 33.75) {
        deg = "North-northeast (" + deg + ")";
    }
    else if (deg >= 33.75 && deg < 56.25) {
        deg = "NorthEast (" + deg + ")";
    }
    else if (deg >= 56.25 && deg < 78.75) {
        deg = "East-northeast (" + deg + ")";
    }
    else if (deg >= 78.75 && deg < 101.25) {
        deg = "East (" + deg + ")";
    }
    else if (deg >= 101.25 && deg < 123.75) {
        deg = "East-southeast (" + deg + ")";
    }
    else if (deg >= 123.75&& deg < 146.25) {
        deg = "SouthEast (" + deg + ")";
    }
    else if (deg >= 146.25 && deg < 168.75) {
        deg = "South-southeast (" + deg + ")";
    }
    else if (deg >= 168.75 && deg < 191.25) {
        deg = "South (" + deg + ")";
    }
    else if (deg >= 191.25 && deg < 213.75) {
        deg = "South-southwest (" + deg + ")";
    }
    else if (deg >= 213.75 && deg < 236.25) {
        deg = "Southwest (" + deg + ")";
    }
    else if (deg >= 236.25 && deg < 238.75) {
        deg = "West-southwest (" + deg + ")";
    }
    else if (deg >= 258.75 && deg < 281.25) {
        deg = "West (" + deg + ")";
    }
    else if (deg >= 281.25 && deg < 303.75) {
        deg = "West-southwest (" + deg + ")";
    }
    else if (deg >= 303.75 && deg < 326.25) {
        deg = "Northwest (" + deg + ")";
    }
    else if (deg >= 326.25 && deg < 348.75) {
        deg = "West-southwest (" + deg + ")";
    }
    return deg;
}
function processClouds(clouds){
    if(clouds >= 0 && clouds < 10) {
        clouds = "Sky is Clear";
    }
    else if (clouds >= 10 && clouds <= 25) {
        clouds = "Few Clouds";
    }
    else if (clouds >= 25 && clouds < 50) {
        clouds = "Scattered Clouds";
    }
    else if (clouds >= 50 && clouds < 85) {
        clouds = "Broken Clouds";
    }
    else if (clouds >= 85 && clouds < 1000) {
        clouds = "Overcast Clouds";
    }
    return clouds;
}
function toTime(time){
    var t = new Date(1e3 * time), i = t.getHours(), n = t.getMinutes();
    return (i < 10 ? "0" + i : i) + ":" + (n < 10 ? "0" + n : n) + " "
}
function processVisibility(vis){
    var v = (vis)?vis.toLowerCase():"";
    if(v == "clouds")
    {
        vis = "Take an Umbrella with you, It may rain!!!";
    }
    else if(v == "rain")
    {
        vis = "Its Raining outside, Take an Umbrella!!!";
    }
    else if(v == "snow")
    {
        vis = "Wear a Jacket, you may feel cold!!!";
    }
    else if(v == "sunny")
    {
        vis = "Apply Sunscreen, Its hot outside!!!";
    }
    else
    {
        vis = "The Weather is Clear, Plan for any trip!!!";
    }
    return vis;
}

function sendRequest () {
    var xhr = new XMLHttpRequest();
   // var method = "artist.getinfo";
    var city = encodeURI(document.getElementById("form-input").value);
    xhr.open("GET", "proxy.php?q="+city+"&appid="+api_key+"&format=json", true);
    xhr.setRequestHeader("Accept","application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            /*
            var str = JSON.stringify(json,undefined,2);
            document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
            */
            //$("output").html = json;
            displayWeatherInfo(json);
        }
    };
    xhr.send(null);
}
document.getElementById("weatherInfo").addEventListener("submit", function(event){
    event.preventDefault();
    sendRequest();
});

/*
function displayWeatherInfo(data) {
    var source   = $("#weatherOutput").html();
    var template = Handlebars.compile(source);
    console.log(source, template);
    $('#output').html(template(data));
}

function sendRequest(city) {
    $.getJSON("proxy.php?q="+city+"&appid="+api_key+"&format=json", displayWeatherInfo);
}



$(document).ready(function() {
    $('#weatherInfo').submit(function(event) {
        event.preventDefault();     // To stop the form submission and letting the js to execute.
        sendRequest($('#form-input').val());
    });
});
*/