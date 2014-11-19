//document.addEventListener("deviceready", function () {
$(document).ready(function () {
    var map, marker;
    var socket = io.connect('http://nipuna.me:8080');

    var latlon = {};

    while (!latlon.id) {
        //latlon.id = prompt("Please enter your ID:", "");
        latlon.id = 'E101';
            localStorage.setItem("trainID", latlon.id);
        //latlon.id = "test";
    }

    var mapoptions = {
        zoom: 12,
        //center: currentposition,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"), mapoptions);

    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoSuccess, {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: false
    });

    function onGeoSuccess(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        var currentposition = new google.maps.LatLng(lat, lon);
        map.setCenter(currentposition);

        marker = new google.maps.Marker({
            position: currentposition,
            //icon: "http://maps.google.com/mapfiles/kml/shapes/rail.png",
            map: map
        });
    }

    var first = true;
    var intervalId;
    var watchId;

    socket.emit('trainConnect', latlon.id + " Train Connected");

    function startTrack() {
        if (navigator.geolocation) {
            console.log('trying to find a fix');
            watchId = navigator.geolocation.watchPosition(geo_success, errorHandler,
                {enableHighAccuracy: true, maximumAge: 30000, timeout: 60000});
        }
        else {
            alert("Sorry, device does not support geolocation! Update your browser.");
        }
    }

    function geo_success(position) {
        console.log("position changed");
        $("#status p").text("Tracking active");
        $('#status').removeClass("stopped").addClass("active");

        $('#startstop').text("Stop tracking");

        latlon.lat = position.coords.latitude;
        latlon.lon = position.coords.longitude;

        var newPostition = new google.maps.LatLng(latlon.lat, latlon.lon);
        map.setCenter(newPostition);
        marker.setPosition(newPostition);

        if (!position.coords.speed) {
            latlon.speed = 0;
        }
        else {
            latlon.speed = position.coords.speed
        }

        if (first) {
            intervalId = setInterval(send, 5000);
        }
        first = false;
    }

    function addTime() {
        // insert time in formData-object
        var d = new Date();
        var d_utc = ISODateString(d);
        latlon.time = d_utc;

        // date to ISO 8601,
        // developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Example.3a_ISO_8601_formatted_dates
        function ISODateString(d) {
            function pad(n) {
                return n < 10 ? '0' + n : n
            }

            return d.getUTCFullYear() + '-'
            + pad(d.getUTCMonth() + 1) + '-'
            + pad(d.getUTCDate()) + 'T'
            + pad(d.getUTCHours()) + ':'
            + pad(d.getUTCMinutes()) + ':'
            + pad(d.getUTCSeconds()) + 'Z'
        }
    }

    function send() {
        addTime();
        socket.emit('sendevent', latlon);
    }

    function sendAlert(msg) {
        socket.emit('sendalert', msg)
    }

    function toggleTimer() {
        if (intervalId) {
            $('#startstop').buttonMarkup({theme: 'g'});

            console.log('stopping');
            clearInterval(intervalId);
            intervalId = null;
            navigator.geolocation.clearWatch(watchId);
            $("#status p").text("Not tracking");
            $('#status').removeClass("active").addClass("stopped");
            $('#startstop').text("Start tracking");
            first = true;
        }
        else {
            $('#startstop').buttonMarkup({theme: 'd'});

            console.log('starting');
            startTrack();
        }
    }

    function errorHandler(err) {
        if (err.code == 1) {
            alert("Error: Access was denied");
        }
        else if (err.code == 2) {
            alert("Error: Position is unavailable");
        }
    }

    function testfunction() {
        alert("function triggered");
    }

    $('#startstop').on("tap", toggleTimer);

    $('#alert').on("click", sendAlert("Some Alert"));


});
