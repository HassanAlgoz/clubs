/*jslint browser:true*/
(async function() {
    
    $("#label-president").text(translate("President"))
    $("#h-create-club").text(translate("Create New Club"))
    $("#btn-submit").text(translate("Create Club"))
    $("#label-club-name").text(translate("Club Name"))

    // Fetch users data and populate presidentId options
    let response, json;
    try {
        response = await fetch(`/api/users`)
        if (!response.ok) {
            console.error("Coudln't fetch users")
            return;
        }
        json = await response.json()
    } catch (err) { console.error("ERROR:", err) }
    let { users } = json

    if (users) {
        for (let i = 0; i < users.length; ++i) {
            $('#presidentId').append(`<option value="${users[i]._id}">${users[i].username}</option>`)
        }
    }
    

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
    
})()

