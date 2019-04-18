
// Grab the articles as a json
$.getJSON("/all", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='card bg-warning mb-3 text-center'><div class='card-body'><h5 class='card-title'>" + data[i].title
      + "</h5><a href='" + data[i].link + "' class='card-link' target='_blank'>Link to the Article</a><br><button id='noteBtn' data-id='" + data[i]._id 
      + "'>Add Note</button></div></div>");    }
  });
  
  //Scrape for articles
$("#scrape").on("click", function() {
    $.get("/scrape").then(loadArticles());
});

$("#clear").on("click", function(){
    $("#articles").empty();
});
  
  // Whenever someone clicks a p tag
  $(document).on("click", "#noteBtn", function() {
    // Empty the notes from the note section
    $("#articles").hide();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/all/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);


        var divCard = $("<div class='card bg-warning mb-3 text-center center'><div class='card-body'>");
        // The title of the article
        divCard.append("<h2 class='card-title'>" + data.title + "</h2>");
        // An input to enter a new title
        divCard.append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        divCard.append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        divCard.append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        $("#notes").append(divCard);
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
   

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
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
        $("#articles").show();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  function loadArticles() {
      alert("Scraping in progress...");
    $.getJSON("/all", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          $("#articles").append("<div class='card bg-warning mb-3 text-center'><div class='card-body'><h5 class='card-title'>" + data[i].title
      + "</h5><a href='" + data[i].link + "' class='card-link' target='_blank'>Link to the Article</a><br><button id='noteBtn' data-id='" + data[i]._id 
      + "'>Add Note</button></div></div>");    }
      });
  }
  