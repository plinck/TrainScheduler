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
// Reference where all train schedules are stored
let trainsRef = database.ref("/train_schedules");
let trainSchedules = []; // array of objects for all the train schedules
const updateInterval = 60000; // Amount of time between each update interval in milliseconds (so 1 minute)


// Helper functiion for AJAX calls
function httpGet(requestURL, aCallback) {
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

// handle errors when retrieving GIFs
function errorRender(err) {
    console.log(`Error: ${err.statusText}`);
    alert(`Error: ${err.statusText}`);

    $("#errorMessage").html(`${err.statusText}`);
}

// render the HTML for the array of train schedules
function schedulesRender(schedules) {

    $("#train-table-data").empty();

    for (let schedule in schedules) {
        let trainObj = schedules[schedule];
        let nextTrain = calcNextTrainTime(trainObj.firstTime, trainObj.frequency);

        let newRow = $(`<tr id="${trainObj.ref}" data-key="${trainObj.ref}">`).append(
            $("<td>").text(trainObj.name),
            $("<td>").text(trainObj.destination),
            $("<td>").text(trainObj.frequency),
            $("<td>").text(nextTrain.arrivalTime),
            $("<td>").text(nextTrain.minutesAway),
            $("<td>").html(`<button class="delete" data-key="${trainObj.ref}">Delete</button>`),
            $("<td>").html(`<button class="update" data-key="${trainObj.ref}">Edit</button>`)
        );

        // Append the new row to the table
        $("#train-table-data").append(newRow);
    }
}

// remove a schedule from the array based on key
function removeSchedule(schedules, ref) {
    for (let i in schedules) {
        if (schedules[i].ref === ref) {
            let removed = schedules.splice(i,1);
        }
    }
}

// Calculate the next train time
function calcNextTrainTime(firstTime, frequency) {
    let nextTrainTime; // Next train time
    let minutesToNextTrain; // number of minutes to next train

    // convert entered time into moment time in hours, minutes        
    let firstTimeArray = firstTime.split(":");
    let firstTrainTime = moment().hours(firstTimeArray[0]).minutes(firstTimeArray[1]);

    // If the first train is later than the current time, arrival is first train time
    if (firstTrainTime > moment()) {
        nextTrainTime = firstTrainTime.format("hh:mm A");
        minutesToNextTrain = firstTrainTime.diff(moment(), "minutes");
    } else {
        // The next train in minutes is calculated by:
        // 1) Get minutes past first time
        // 2) Get the remainder of those minutes divided by the frequency in minutes
        // ---> This gives you how many minutes have passed since the last time it came
        // 3) Subtracting that from the frequenct gives you how much time is left to the next train
        // Then just add those minutes to current time to get next arrival time
        let minutesFromFirstTime = moment().diff(firstTrainTime, "minutes");
        let minutesFromLatestArrival = minutesFromFirstTime % frequency;

        minutesToNextTrain = frequency - minutesFromLatestArrival;

        // To calculate the arrival time, add the tMinutes to the current time
        nextTrainTime = moment().add(minutesToNextTrain, "m").format("hh:mm A");
    }

    let nextTrain = {};
    nextTrain.minutesAway = minutesToNextTrain;
    nextTrain.arrivalTime = nextTrainTime;

    return nextTrain;
}

// Wait for doc to be ready
$(document).ready(function () {

    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        // Grab user input

        // Validate user Input


        let trainObj = {
            name: $("#train-name").val().trim(),
            destination: $("#train-destination").val().trim(),
            firstTime: $("#train-first-time").val(),
            frequency: $("#frequency").val().trim()
        };

        // Add train object to firebase to the database
        trainsRef.push(trainObj);

        // Clear text-boxes
        $("#train-name").val("");
        $("#train-destination").val("");
        $("#train-first-time").val("");
        $("#frequency").val("");

    });

    // Delete train schedule
    $(document.body).on("click", ".delete", function () {
        var key = $(this).attr("data-key");

        // Remove from DOM
        $(`#${key}`).empty();

        // Delete train object from firebase
        let trainRef = trainsRef.child(key);
        trainRef.remove();

        // Remove this schedule from the array of schedules
        removeSchedule(trainSchedules, trainRef);

    });

    // Each time a train is added, put a new row in the table
    trainsRef.on("child_added", function (snap) {
        let trainObj = snap.val();
        trainObj.ref = snap.key;

        let nextTrain = calcNextTrainTime(trainObj.firstTime, trainObj.frequency);

        // Create the new row
        let newRow = $(`<tr id="${trainObj.ref}" data-key="${trainObj.ref}">`).append(
            $("<td>").text(trainObj.name),
            $("<td>").text(trainObj.destination),
            $("<td>").text(trainObj.frequency),
            $("<td>").text(nextTrain.arrivalTime),
            $("<td>").text(nextTrain.minutesAway),
            $("<td>").html(`<button class="delete" data-key="${trainObj.ref}">Delete</button>`),
            $("<td>").html(`<button class="update" data-key="${trainObj.ref}">Edit</button>`)
        );

        // Append the new row to the table
        $("#train-table-data").append(newRow);

        // Add this schedule to the array of schedules
        trainSchedules.push(trainObj);
    });

    // This updates the train scheduler on an interval
    function updateSchedules() {
        schedulesRender(trainSchedules);
    }

    // Update the next train time every minute
    let updateIntervalTimer = setInterval(updateSchedules, updateInterval);


}); // (document).ready