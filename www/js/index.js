var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        app.startTracking();
    },
    // Update DOM on a Received Event
    //receivedEvent: function(id) {
    //    var parentElement = document.getElementById(id);
    //    var listeningElement = parentElement.querySelector('.listening');
    //    var receivedElement = parentElement.querySelector('.received');
    //
    //    listeningElement.setAttribute('style', 'display:none;');
    //    receivedElement.setAttribute('style', 'display:block;');
    //
    //    console.log('Received Event: ' + id);
    //}

    startTracking: function() {

        var socket = io.connect('http://localhost:8080');
        var latlon = {};

        while (!latlon.id) {
            latlon.id = prompt("Please enter your ID:", "");
        }

        var first = true;
        var intervalId;
        var watchId;

        socket.emit('trainConnect', latlon.id+" Train Connected");


    }
};
