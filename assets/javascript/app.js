// // API for weather, need to get key and set search
// var queryURL = "https://crazygentleman-knmi-weather.p.mashape.com/"
// $.ajax({
//     url: queryURL,
//     method: "GET"
//   }).then(function (response) {
//       console.log(response);
//   });

// ========================Firebase======================

var config = {
    apiKey: "AIzaSyASvpSDmKvhzUPaXM5XStpIYgXc5hqtSZ0",
    authDomain: "train-schedule-cbaf7.firebaseapp.com",
    databaseURL: "https://train-schedule-cbaf7.firebaseio.com",
    projectId: "train-schedule-cbaf7",
    storageBucket: "train-schedule-cbaf7.appspot.com",
    messagingSenderId: "178531430295"
};
firebase.initializeApp(config);

//   ==================Initial Values===================

var database = firebase.database();
// var initialTrain = "";
// var initialDest = "";
// var initialMin;
// var initialFreq;
// var initialNext;
var trainName = "";
var trainDest = "";
var trainMin = 0;
var trainFreq = 0;
var trainStart = 0;
var timeLeft 
var nextTrain
// var now = moment().format("h:mm A");


// ========================Setting up first case values==========================

database.ref().on("value", function (snapshot) {

    // console.log(snapshot);
    // If Firebase has all variable stored
    if (snapshot.child("trainName").exists() && snapshot.child("trainDest").exists() && snapshot.child("trainMin").exists()
        && snapshot.child("trainFreq").exists() && snapshot.child("trainStart").exists()) {

        // Set the variables for variables equal to the stored values in firebase.
        trainName = snapshot.val().trainName;
        trainDest = snapshot.val().trainDest;
        trainMin = snapshot.val().trainMin;
        trainFreq = snapshot.val().trainFreq;
        trainStart = snapshot.val().trainStart;

        // var answer = timeBandits()

        // Change the HTML to reflect the stored values
        // $("#train-table").append("<tr>");
        // $("#train-table").append("<td>" + trainName + "</td>");
        // $("#train-table").append("<td>" + trainDest + "</td>");
        // $("#train-table").append("<td>" + trainFreq + "</td>");
        // $("#train-table").append("<td>" + trainStart + "</td>");
        // $("#train-table").append("<td>" + trainMin + "</td></tr>");
        $("#train-table").append("<tr>");
        $("#train-table").append("<td>" + trainName + "</td>");
        $("#train-table").append("<td>" + trainDest + "</td>");
        $("#train-table").append("<td>" + trainFreq + " minutes" + "</td>");
        $("#train-table").append("<td>" + answer.timeLeft + " minutes" + "</td>");
        $("#train-table").append("<td>" + answer.nextTrain + "</td>");
        $("#train-table").append("</tr");

        console.log(trainName);
        console.log(trainDest);
        console.log(trainMin);
        console.log(trainFreq);
        console.log(trainStart);

    }

    // Else Firebase doesn't have anything for the variables, so use the initial local values.
    else {

        // Change the HTML to reflect the initial values
        // $("#train-table").append("<tr>");
        // $("#train-table").append("<td>" + initialTrain + "</td>");
        // $("#train-table").append("<td>" + initialDest + "</td>");
        // $("#train-table").append("<td>" + initialFreq + "</td>");
        // $("#train-table").append("<td>" + initialNext + "</td>");
        // $("#train-table").append("<td>" + initialMin + "</td></tr>");
    }

    // If any errors are experienced, log them to console.
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// ================= Adding new trains ==============================

$("#newTrainButton").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();
    // Create new variable to get new name added.
    var newTrainName = $("#train-name").val().trim();
    var newTrainArrive = $("#arrival-from").val().trim();
    var newTrainFreq = parseInt($("#frequency").val().trim());
    var newTrainStart = $("#train-arrival").val().trim();
    
    // Sets the new name in the database.
    database.ref().set({
        trainName: newTrainName,
        trainDest: newTrainArrive,
        trainFreq: newTrainFreq,
        trainStart: newTrainStart
    });

    trainName = newTrainName;
    trainDest = newTrainArrive;
    trainFreq = newTrainFreq;
    trainStart = newTrainStart;


    var answer = timeBandits(trainStart, trainFreq);
    console.log(answer);

    $("#train-table").append("<tr>");
    $("#train-table").append("<td>" + trainName + "</td>");
    $("#train-table").append("<td>" + trainDest + "</td>");
    $("#train-table").append("<td>" + trainFreq + " minutes" + "</td>");
    $("#train-table").append("<td>" + answer.timeLeft + " minutes" + "</td>");
    $("#train-table").append("<td>" + answer.nextTrain + "</td>");
    $("#train-table").append("</tr");
});

function timeBandits(trainStart, trainFreq) {

    // var timeData = $("#time-arrival").val().trim();
    // Time returned in 00:00 format
    var timeArray = trainStart.split("");
    // Pulls the string and splits it into each value
    // Also puts values into an array
    timeArray.splice(2, 1);
    // Gets the : out of the array and deletes it
    timeData = timeArray.join("");
    // Turns back into string
    var hours = timeData[0] + timeData[1];
    var minutes = timeData[2] + timeData[3];
    // Sets hours and minutes

    // ============================ Moment.js ===========================

    var now = moment();
    // Gets the time at the moment
    var nowButLater = moment().set({ "hours": hours, "minutes": minutes, "seconds": 0 });
    // Sets the hours and minutes
    var difference = now.diff(nowButLater, "minutes");
    // Sets the variable to the difference in minutes
    var remainder = difference % trainFreq;
    // Remainder of time left over until the next freq of the train
    var timeLeft = trainFreq - remainder;
    // Subtract freq from remainder, when equal train is arrived
    var nextTrain = now.add(timeLeft, "minutes");

    var answer = {
        timeLeft: timeLeft,
        nextTrain: nextTrain.format("LT"),
    }
    return answer

}

