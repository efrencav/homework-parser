//Handle Scraping button click  

 //Create variables to keep track of the number of articles in our database every time we do a new scrape.
    //previous is the number of articles before doing a new scrape.
    //current is the number of articles after during a new scrape.
    var previous = 0;
    var current = null;

    //Click event for scraping new articles.
    $("#scrape").on("click", function(event) {
        //Empty out the modal that shows the number of articles found after each scrape.
        //$("#number-articles-found").empty();
        //Before we do a new scrape, run a GET request to get the total number of articles currently in our database.
        $.ajax({
            method: "GET",
            url: "/articles",
        })
        //With that done
        .then(function(data) {
            //Log the response
            console.log(data);
            //Set the current variable to data.length, which is the current number of articles in our database.
            current = data.length;
            console.log(current);
            console.log(previous);
            //Set the previous variable to match current. 
            previous = current;
            //Run a GET request to scrape new articles (if any) from the site we are scraping from.
            $.ajax({
                method:"GET",
                url: "/scrape"
            })
            //With that scraping done...
            .then(function(data) {
                //After scraping is done, do another get request to get the updated number of articles in our database.
                //If this number did not change, we did not scrape any new articles from the site.
                $.ajax({
                    method: "GET",
                    url: "/articles"
                })
                .then(function(data){
                    //Set current to the new number of articles in the database.
                    current = data.length;
                    console.log(current);
                    console.log(previous);
                    //If the current number of articles in the database is greater than the previous number of articles, 
                    //then, we did scrape at least one new article from the website.
                    if (previous !== current) {
                             alert((current - previous) + " new article/s found");
			
                        //Set previous to the current number of articles.
                             previous = current;
                             console.log(previous);
                    }
    
                    //If there are no new articles to scrape, tell the user no new articles were found.
                    else {
                        console.log("No new articles found.")
                        alert("No new articles found!");
                    }
                    location.reload();
                })
            })
        });
    });


//Set clicked nav option to active
$(".navbar-nav li").click(function() {
 $(".navbar-nav li").removeClass("active");
 $(this).addClass("active");
});

//Handle Save Article button
$(".save").on("click", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/articles/save/" + thisId
  }).done(function(data) {
   //   window.location = "/"
   window.location.assign("/");
  })
});

//Handle Delete Article button
$(".delete").on("click", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/articles/delete/" + thisId
  }).done(function(data) {
      window.location = "/saved"
  })
});

//Handle Save Note button
$(".saveNote").on("click", function() {
  var thisId = $(this).attr("data-id");
  if (!$("#noteText" + thisId).val()) {
      alert("please enter a note to save")
  }else {
    $.ajax({
          method: "POST",
          //url:"/articles/"+ thisId,
          url: "/notes/save/" + thisId,
          data: {
            text: $("#noteText" + thisId).val()
          }
        }).done(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#noteText" + thisId).val("");
            $(".modalNote").modal("hide");
            window.location = "/saved"
        });
  }
});

//Handle Delete Note button
$(".deleteNote").on("click", function() {
    var noteId = $(this).attr("data-note-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + noteId + "/" + articleId
    }).done(function(data) {
        console.log(data)
        $(".modalNote").modal("hide");
        window.location = "/saved"
    })
});