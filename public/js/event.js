$(function(){

    console.log('event.js loaded')

    const eventId = event._id
    const clubId = getId('club')
    
    // Markdown
    $('#brief').html(converter.makeHtml(event.brief));
    // Format Dates
    let publishDate = new Date(event.publishDate);
    $('#published').text( moment(publishDate).fromNow() );
    let date = new Date(event.date);
    $('#date').text( moment(date).fromNow() +" on "+ moment(date).format('Do MMMM'));
    
    // Populate title, time and location
    populateText(event, ['title', 'time', 'location'])
    // Equivalent to:
    // $('#title').text(event.title)
    // $('#time').text(event.time)
    // $('#location').text(event.location)
    
    if (event.membersOnly) {
        $('#info').append(`<li id="membersOnly"><i class="text-danger">This event is for members only</i></li>`)
    }
    

    // Check if the user already promised to attend this event
    let promised = false;
    if (user) {
        for(let i = 0; i < event.promisers.length; ++i) {
            if (event.promisers[i].user === user._id) {
                promised = true
                break;
            }
        }
    }
    
    

    if (!promised) {
        // Show how many people are attending this event
        $('#section1').append(`<h4 class="promises text-success text-center">${event.promisers.length} people attending</h4>`)

        // Show "count me in" Button
        if (user) {
            if (event.condition === 'open') {
                if (!event.membersOnly || (event.membersOnly && (user.role === 'president' || user.role === 'manager' || user.role === 'member'))) {
                    $('#section1').append(`<button id="btn-promise" class="btn btn-success center-block"><i class="glyphicon glyphicon-plus"></i> Count me in</button>`)
                
                    $('#btn-promise').on('click', () => $.ajax({
                        url: `/api/events/${eventId}/promise?clubId=${clubId}`,
                        method: 'PUT',
                        success: () => { $('#btn-promise').replaceWith('<span>You promised to attend the events</span>') }
                    }))
                }
            }
        }
    } else {
        // Show how many people are attending this event
        $('#section1').append(`<h4 class="promises text-success text-center">You and ${event.promisers.length - 1} others are attending this event</h4>`)
    }
    
    
    // Managerial Buttons
    if (user && (user.role === 'president' || user.role === 'manager')) {
        if (event.condition === 'open') {
            // "Close Event" Button
            $('#section2').append(`<button id="btn-close" class="btn btn-warning"><i class="glyphicon glyphicon-remove"></i> Close Event</button>`)
            
            $('#btn-close').on('click', () => $.ajax({
                url: `/api/events/${eventId}/close?clubId=${clubId}`,
                method: 'PUT',
                success: () => { $('#btn-close').replaceWith('<span>Event Closed</span>') }
            }))

        } else {
            // "Open Event" Button
            $('#section2').append(`<button id="btn-open" class="btn btn-warning">Reopen Event</button>`)
            
            $('#btn-open').on('click', () => $.ajax({
                url:`/api/events/${eventId}/open?clubId=${clubId}`,
                method:'PUT',
                success: () => { $('#btn-open').replaceWith('<span>Event Opened</span>') }
            }))
            
        }
        // Link to Attendance Page
        $('#section2').append(`<a href="#" id="btn-attendance" class="btn btn-success">Attendance</a>`)
        $('#btn-attendance').attr('href', `/club/${clubId}/event/${eventId}/attendance`)
    }
    
})
