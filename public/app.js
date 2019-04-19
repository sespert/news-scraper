$(document).ready(function() {
  $("#notes").hide();

//Call the route to scrape for articles when button is clicked
$("#scrape").on("click", function() {
    $.get("/scrape").then(loadArticles());
});

//Clear the articles list when the button is clicked
$("#clear").on("click", function(){
    $("#notes").empty();
    $("#articles").empty();
});
  
// Display the note window when the button is clicked
$(document).on("click", "#noteBtn", function() {
    // $("#notes").empty();
    $("#notes").show();

    // Hide the articles to show only the note
    $("#articles").hide();

    // Save the id from the link tag
    var thisId = $(this).attr("data-id");
    console.log("Id note butt" + thisId);
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/all/" + thisId
    })
        // With that done, add the note information to the page
        .then(function(data) {
        // console.log("this is the data from the note get" + data);
          $("#notes").empty();
          noteCreator(data);
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        // // If there's a note in the article
        // if (!("note" in data)) {
        //   console.log("empty");
        //   noteCreator(data);
          
        // } else {
        //   console.log("full");

        //   noteCreator(data);
        //   // Place the title of the note in the title input
        //   $("#titleinput").val(data.note.title);
        //   // Place the body of the note in the body textarea
        //   $("#bodyinput").val(data.note.body);
        // }

        });
});
  
// When you click the save note button
$(document).on("click", "#savenote", function() {
  $("#articles").show();
  $("#notes").hide();
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/all/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val(),
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log("Data from savenote:" + data);
        // Empty the notes section
        $("#notes").empty();
        $("#articles").show();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

//Helper function to call the get method to load the articles already saved to the database
function loadArticles() { 
    $.ajax({
    method: "GET",
    url: "/"
    }).then(function(data) {
        $("body").html(data);
    })
}

//Helper function to create the note
function noteCreator (data) {
  var divCard = $("<div class='card bg-warning text-center center'>");
  // The title of the article
  divCard.append("<h3 class='card-title'>" + data.title + "</h3>");
  // An input to enter a new title
  divCard.append("<input id='titleinput' name='title' >");
  // A textarea to add a new note body
  divCard.append("<textarea id='bodyinput' name='body'></textarea>");
  // A button to submit a new note, with the id of the article saved to it
  divCard.append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  return $("#notes").append(divCard);
}
});