/* **********************************************************************************
 * Main Program - 
 ********************************************************************************** */
// Use strict to keep things sane and not crapp code
"use strict";
/*global $:false, jQuery:false */
/*global document:false */
/*global console:false */
/*global alert:false */

// Firebase
let config = {
    apiKey: "AIzaSyAGv1ljyFxCUDvh3nm4uVV1-eO4R2A_cZc",
    authDomain: "paulsclassdb.firebaseapp.com",
    databaseURL: "https://paulsclassdb.firebaseio.com",
    projectId: "paulsclassdb",
    storageBucket: "paulsclassdb.appspot.com",
    messagingSenderId: "823304786936"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
let database = firebase.database();

// --------------------------------------------------------------
// Reference where all employees are stored
let trainsRef = database.ref("/train_schedules");

// Helper functiion for AJAX calls
function httpGet(requestURL, aCallback) {

    // I had to use the JSONP method since the one used in class caused CORS issues
    $.ajax({
        url: requestURL,
        method: 'GET',
        dataType: 'JSON',
        success: function (result) {
            console.log(result);
            aCallback(result.data);
        },
        error: function (err) {
            console.log('error:' + err);
            errorRender(err);
        }
    });
}

// Get all trains on schedule
function getTrains() {

}

// handle errors when retrieving GIFs
function errorRender(err) {
    console.log(`Error: ${err.statusText}`);
    alert(`Error: ${err.statusText}`);

    $("#errorMessage").html(`${err.statusText}`);
}

// Wait for doc to be ready
$(document).ready(function () {
    getTrains();

    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        // Grabs user input
        // var trainTime = moment($("#first-train-time").val().trim(), "MM/DD/YYYY").format("X");
        var trainObj = {
            name: $("#train-name").val().trim(),
            destination: $("#train-destination").val().trim(),
            firstTime: $("#train-first-time").val().trim(),
            frequency: $("#frequency").val().trim()
        };

        // Add employee object to firebase to the database
        trainsRef.push(trainObj);

        // Clear text-boxes
        $("#train-name").val("");
        $("#train-destination").val("");
        $("#train-first-time").val("");
        $("#frequency").val("");

    });

    // Each time a train is added, put a new row in the table
    trainsRef.on("child_added", function (snap) {
        console.log(snap.val());
        let trainObj = snap.val();

        // Employee Info
        console.log(trainObj);

        // calc the next arrival time using moment.js
        let nextTime = trainObj.firstTime;
        // let nextTime = moment.unix(trainObj.firstTime).format("HH:MM");

        // Calculate the time in minutes for next train worked using moments.js
        let minutesAway = 5;

        // Create the new row
        let newRow = $("<tr>").append(
            $("<td>").text(trainObj.name),
            $("<td>").text(trainObj.destination),
            $("<td>").text(trainObj.frequency),
            $("<td>").text(nextTime),
            $("<td>").text(minutesAway)
        );

        // Append the new row to the table
        $("#train-table-data").append(newRow);
    });


}); // (document).ready