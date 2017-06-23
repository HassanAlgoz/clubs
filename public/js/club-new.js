/*jslint browser:true*/
$(function() {
    
    // Fetch users data and populate presidentId options
    $.ajax({
        method: 'GET',
        url: '/api/users',
        success: (data) => {
            for(let i = 0; i < data.users.length; ++i) {
                $('#presidentId').append(`<option value="${data.users[i]._id}">${data.users[i].username}</option>`)
            }
        },
        error: (err) => {
            console.log(err)
        }
    })
    

    // Create new club
    $("#btn-submit").on('click', (event) => {
        event.preventDefault(); // avoid execution of the actual 'submit' of the form
        
        $.ajax({
            method: 'POST',
            url: '/api/clubs',
            data: {
                name: $('#name').val(),
                clubPresidentId: $('#presidentId').val()
            },
            success: (data) => {
                location.href = '/'
            },
            error: (error) => {
                console.log(error);
            }
        });
        
    });
    
});

