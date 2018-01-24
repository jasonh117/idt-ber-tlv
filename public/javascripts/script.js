$(function() {
    const clickableRow = $(".clickable-row");
    clickableRow.click(function() {
        window.location = $(this).data("href");
    });

    const form = $('#tlv-form');
    form.submit(false);

    const deleteButton = $('#delete-button');
    deleteButton.click(function() {
        if (confirm("Are you sure you want to delete this TLV?")) {
            $.ajax({
                url: `/api/tlv/${window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)}`,
                type: 'DELETE'
            }).then(() => {
                window.location = '/request';
            });
        }
    });

    const cancelButton = $('#cancel-button');
    cancelButton.click(function() {
        window.location.reload();
    });

    const approveButton = $('#approve-button');
    approveButton.click(function() {
        const data = form.serialize();
        $.ajax({
            url: `/api/tlv/${window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)}`,
            type: 'POST',
            data
        }).then(() => {
            window.location = `/tlv/${window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)}`;
        });
    });

    const requestButton = $('#request-button');
    requestButton.click(function() {
        const data = form.serialize();
        $.ajax({
            url: `/api/request/tlv/${window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)}`,
            type: 'POST',
            data
        }).then(() => {
            window.location = '/request';
        });
    });
});