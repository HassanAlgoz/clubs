$(function(){
    
    console.log('club.js loaded')
    const clubId = club._id

    console.log(club)
    
    // Markdown
    $('#description').html(converter.makeHtml(club.description));
    $('#name').html(`${club.name} <span id="members">${club.members.length} members</span>`)
    
    for(let i = club.events.length - 1; i >= 0; i--) {
        $('#events-list').append(`<li><a href="/club/${clubId}/event/${club.events[i]._id}">${club.events[i].title}</a></li>`)
    }

    for(let i = club.posts.length - 1; i >= 0; i--) {
		$('#posts-list').append(`<li><a href="/club/${clubId}/post/${club.posts[i]._id}">${club.posts[i].title}</a></li>`)
    }

    // Join Button
    if (!user || !user.role) {
        $('#section1').append(`<button id="btn-join" class="btn btn-lg btn-success"><i class="glyphicon glyphicon-check"></i>Join Club</button>`)
    }
    

    $('#btn-join').on('click', () => {
        if (user) {
            $.ajax({
                method: 'PUT',
                url: `/api/clubs/${clubId}/join`,
                success: (data) => {
                    $('#btn-join').replaceWith(`<span class="text-success">Thank you for joining.. talk to the admin for approval</span>`);
                },
                error: (error) => {
                    $('#btn-join').replaceWith(`<span class="text-danger">Sorry.. something went wrong</span>`);
                }
            });
        } else {
            location.href = '/login'
        }
    })

})
