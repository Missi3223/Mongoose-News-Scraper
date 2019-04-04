/* eslint-disable no-undef */
/* eslint-disable no-console */
$(document).on("click", ".post", function () {
    console.log("post");

    var thisId = $(this).attr("data-id");
    console.log(thisId);
    if ($("#new-username").val() != "" && $("#new-comment").val() != "") {
        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from title input
                    username: $("#new-username").val(),
                    // Value taken from note textarea
                    text: $("#new-comment").val()
                }
            })
            // With that done
            .then(function (data) {
                // Log the response
                console.log(data);
                location.reload();
                // Empty the notes section
                //$("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#new-username").val("");
        $("#new-comment").val("");
    }
});

$(document).on("click", ".delete", function () {
    console.log("delete");
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "DELETE",
            url: "/delete/" + thisId
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            location.reload();
            // Empty the notes section
            //$("#notes").empty();
        });

});