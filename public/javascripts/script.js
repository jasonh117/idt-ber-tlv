$(function() {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });

    $('#delete-button').click(function() {
        $.ajax({
            url: window.location,
            type: 'DELETE'
        });
    });
});