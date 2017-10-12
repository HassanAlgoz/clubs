(async function(){
    console.log('club.js loaded') // <-- I like to do this to make sure the script is loaded.

    // Take your time to read this through.
    // 1. We always use `fetch` to make a `GET` request to the API. (we could also use AJAX)
    // 2. If the resource is `Not Found`, that is, if !response.ok then, redirect the user.
    // 3. We filter and process the returned data and display it to the user.
    // 4. Showing data and buttons is different for each user role, and whether the user is logged in or not.
    // 5. Clicking a button usually makes an AJAX `PUT` or `POST` request to the API, and then the user is redirected to some other page.

    // This will get the id of the club from the URL
    let clubId = getId("clubs") // getId is a helper function that can be found in `/public/js/utils.js`
    // Fetch data of club from API (data includes club.events and club.posts)
    let response, json;
    try {
        response = await fetch(`/api/clubs/${clubId}`)
        // (debugging)
        console.log("response:", response)
        if (!response.ok) {
            // redirect to homepage
            location = '/'
            return;
        }
        json = await response.json()
    } catch(err){console.error("ERROR:", err)}
    let {club} = json
    // (debugging)
    console.log("returned JSON:", json)
    console.log("club:", club)

    // Set Browser Tab Name
    document.title = club.name
    // Fill in Club details
    $('#name').text(club.name)
    $('#members-count').text(club.members.length)
    document.querySelector('#logo').src = club.logo
    // Description is written in Markdown which we have to convert to HTML
    $('#description').html(converter.makeHtml(club.description));
    
    // List all events
    for(let i = club.events.length - 1; i >= 0; i--) {
        // Show different labels based on conditions
        let membersOnlyMessage = club.events[i].membersOnly ? "members only" : "open for all"
        let membersOnlyClass = club.events[i].membersOnly ? "red" : "green"
        let numPromises = club.events[i].promisers? club.events[i].promisers.length : 0
        // Format Date (using moment): refer to http://momentjs.com/
        let date = new Date(club.events[i].date);
        let formattedDate = `${moment(date).format('Do MMMM')} (${moment(date).fromNow()})`
        // Append HTML
        $('#events').append(`
            <div class="col-sm-6 col-md-4">
                <a href="/clubs/${clubId}/events/${club.events[i]._id}" class="no-underline">
                    <div class="thumbnail">
                        <img src="${club.events[i].image}" alt="Image" class="center-block img-responsive">
                        <div class="green"><small>${formattedDate}</small></div>
                        <div class="green"><small>${numPromises} attending</small></div>
                        <div class="${membersOnlyClass}"><small>${membersOnlyMessage}</small></div>
                    </div>
                </a>
            </div>
        `)
    }

    // List all posts
    for(let i = club.posts.length - 1; i >= 0; i--) {
		$('#posts').append(`<div class="list-item"><a href="/clubs/${clubId}/posts/${club.posts[i]._id}">${club.posts[i].title}</a></div>`)
    }


    // Join Button
    // If the user has a role, it means he has a role in this club. i.e., he is already a member in this club.
    if (user && user.role) {
        $('#btn-join').hide()
    }
    // Join button logic
    $('#btn-join').on('click', () => {
        let successMessage = `Thank you for joining.. please wait for the president's approval`
        let failMessage = `Sorry.. something went wrong. Make sure you are logged in and have confirmed registration through email.`
        // if user is logged in
        if (user) {
            $.ajax({
                method: 'PUT',
                url: `/api/clubs/${clubId}/join`
            })
            .done((data) => {
                // Maybe we should use a notification instead of this
                $('#btn-join').replaceWith(`<span class="text-success">${successMessage}</span>`);
            })
            .fail((err) => {
                // Maybe we should use a notification instead of this
                $('#btn-join').replaceWith(`<span class="text-danger">${failMessage}</span>`);
            })
        } else {
            // redirect to login page
            location = `/auth/login?redirect=${location.href}`
        }
    })

})()
