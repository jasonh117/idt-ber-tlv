$(function() {
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });

    $('#delete-button').click(function() {
        if (confirm("Are you sure you want to delete this TLV?")) {
            $.ajax({
                url: `/api${window.location.pathname}`,
                type: 'DELETE'
            }).then(() => {
                window.location.reload();
            });
        }
    });

    $('#cancel-button').click(function() {
        window.location.reload();
    });
});