$(function() {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });

    $('#delete-button').click(function() {
        if (confirm("Are you sure you want to delete this TLV?")) {
            $.ajax({
                url: window.location,
                type: 'DELETE'
            }).then(() => {
                window.location.reload();
            });
        }
    });
});