/* eslint-disable no-undef */
/* eslint-disable no-console */
$(document).on("click", ".scrape", function () {
    $.ajax({
            method: "GET",
            url: "/scrape"
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            location.reload();
        });
})