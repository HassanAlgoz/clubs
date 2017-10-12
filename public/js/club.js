(function(){
    
    console.log('club.js loaded')
    const clubId = club._id
    
    // Markdown
    $('#description').html(converter.makeHtml(club.description));
    $('#name').html(`${club.name} <span id="members">${club.members.length} members</span>`)
    
    // List all events
    for(let i = club.events.length - 1; i >= 0; i--) {
        let membersOnlyMessage = club.events[i].membersOnly ? "members only" : "open for all"
        let membersOnlyClass = club.events[i].membersOnly ? "red" : "green"
        let numPromises = club.events[i].promisers? club.events[i].promisers.length : 0       
        let date = new Date(club.events[i].date);
        let formattedDate = `${moment(date).format('Do MMMM')} (${moment(date).fromNow()})`
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
		$('#posts').append(`<li><a href="/clubs/${clubId}/posts/${club.posts[i]._id}">${club.posts[i].title}</a></li>`)
    }

    // Join Button
    if (!user || !user.role) {
        $('#section1').append(`<button id="btn-join" class="btn btn-lg btn-success"><i class="glyphicon glyphicon-check"></i>Join Club</button>`)
    }
    
    // Join button logic
    $('#btn-join').on('click', () => {
        if (user) {
            $.ajax({
                method: 'PUT',
                url: `/api/clubs/${clubId}/join`,
                success: (data) => {
                    $('#btn-join').replaceWith(`<span class="text-success">Thank you for joining.. please wait for the president's approval</span>`);
                },
                error: (error) => {
                    $('#btn-join').replaceWith(`<span class="text-danger">Sorry.. something went wrong. Make sure you are logged in and have confirmed registration through email.</span>`);
                }
            });
        } else {
            location = `/auth/login?redirect=${location.href}`
        }
    })

})()
