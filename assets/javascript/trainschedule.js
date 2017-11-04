/* Train schedule using Firebase storage */
// Pseudocode:
// Firebase is initialized.
// A form is set up to accept train information.
// Information from the form input is stored in a database on Firebase, using a submit button.
// The information stored in Firebase populates a table on the page, when the submit button is clicked.
// The "Next Arrival" value for a train is calculated by using the First Train Time input number, the frequency of the train,
//   and the current time. 

//This initializes Firebase.
var config = {
  apiKey: "AIzaSyBgdTvGeOHmt61pqYh-Y2d57GVAJYFu3VQ",
  authDomain: "train-schedule-31f63.firebaseapp.com",
  databaseURL: "https://train-schedule-31f63.firebaseio.com",
  projectId: "train-schedule-31f63",
  storageBucket: "train-schedule-31f63.appspot.com",
  messagingSenderId: "476621333718"
};

firebase.initializeApp(config);
console.log(firebase);

var database = firebase.database();

// This dynamically adds a train when the button is clicked.
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // This pulls in the input from the form the user fills out about the train.
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#first-train-input").val().trim();
  var trainFreq = $("#frequency-input").val().trim();

  // Creates an object to hold data temporarily.
  var newTrain = {
    tName: trainName,
    tDestination: trainDestination,
    tStart: trainStart,
    tFreq: trainFreq
  };

  // This pushes the train data to the database.
  database.ref().push(newTrain);

  // Alert to notify that a train was successfully added.
  alert("Train successfully added");

  // This then clears out the inputs.
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// This creates a Firebase event (when new data appears) that adds a train to the database
//   and a row in the html is created when the user adds an entry.
database.ref().on("child_added", function (childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  // This stores the input in individual variables.
  var trainName = childSnapshot.val().tName;
  var trainDestination = childSnapshot.val().tDestination;
  var trainStart = childSnapshot.val().tStart;
  var trainFreq = childSnapshot.val().tFreq;
  var currentTime = moment();

  var firstTrainConverted = moment(trainStart, "HH:mm").subtract(1, "years");

  var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");

  var remainder = timeDiff % trainFreq;

  var minutesAway = trainFreq - remainder;

  //This creates a variable for the addition of the number of minutes until the next train plus the current time,
  //  which shows when the next train should arrive.
  var nextTrain = moment().add(minutesAway, "minutes").format('HH:mm');

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
    trainFreq + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");

});
