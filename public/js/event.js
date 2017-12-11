(async function(){

    console.log('event.js loaded')

    const clubId = getId('clubs')
    const eventId = getId("events")


    let response, json;
    try {
        response = await fetch(`/api/clubs/${clubId}/events/${eventId}`)
        // (debugging)
        console.log("response:", response)
        if (!response.ok) {
            // redirect to homepage
            location = `/clubs/${clubId}`
            return;
        }
        json = await response.json()
    } catch(err){console.error("ERROR:", err)}
    let {event} = json
    // (debugging)
    console.log("returned JSON:", json)
    console.log("event:", event)

    document.title = event.title
    // Fill in Event details
    document.querySelector('#image').src = event.image
    
    // Markdown
    $('#brief').html(converter.makeHtml(event.brief));
    // Format Dates
    let past = (moment(new Date()).isAfter(moment(new Date(event.date))))? true : false;
    let publishDate = new Date(event.publishDate);
    $('#published').text(`${translate("Published")} ${moment(publishDate).fromNow()}` );
    let date = new Date(event.date);
    $('#date').text(`${moment(date).fromNow()} (${moment(date).format('Do MMMM')})`);
    
    event.time = getAMPM(event.time);
    console.log("event.time", event.time);
    event.organizers = event.organizers.map(organizer => organizer.username).join(" و");
    // Populate title, time and location
    populateText(event, ['title', 'time', 'location', 'organizers'])
    // Equivalent to:
    // $('#title').text(event.title)
    // $('#time').text(event.time)
    // $('#location').text(event.location)


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

    // Show NO. people attending
    if (event.seatLimit > 0) {
        $('#attendees').text(`${translate("seats")}: ${event.promisers.length}/${event.seatLimit}`)
        if (event.promisers.length >= event.seatLimit) {
            $('#attendees').addClass("text-danger")
        }
    } else {
        let subject = (event.membersOnly)? "members" : "people"
        let verb = (past)? "attended" : "attending"
        $('#attendees').text(`${event.promisers.length} ${translate(subject)} ${translate(verb)}`)
    }

    // Additional information
    if (promised) {
        $('#info').append(`<li id="promised" class="text-success">${translate("You promised to attend this event")}</li>`)
    }
    if (event.membersOnly) {
        $('#info').append(`<li id="membersOnly"><i class="text-danger">${translate("This event is for members only")}</i></li>`)
    }

    if (!promised) {
        // The "count me in" Button
        if (event.condition === 'open' && !past) {
            if (user) {
                if (!event.membersOnly || (event.membersOnly && (user.role === 'president' || user.role === 'manager' || user.role === 'member'))) {
                    $('#section1').append(`<button id="btn-promise" class="btn btn-success center-block"><i class="glyphicon glyphicon-plus"></i> ${translate("Count me in")}</button>`)
                
                    if (event.seatLimit == 0 || event.promisers.length < event.seatLimit) {
                        $('#btn-promise').on('click', () => $.ajax({
                            url: `/api/clubs/${clubId}/events/${eventId}/promise`,
                            method: 'PUT',
                            success: () => { $('#btn-promise').replaceWith('<span class="text-success text-center">You promised to attend the event</span>') }
                        }))
                    } else {
                        $('#btn-promise').attr('disabled', 'true')
                    }
                }
            } else {
                $('#section1').append(`<button id="btn-promise" class="btn btn-success center-block"><i class="glyphicon glyphicon-plus"></i> ${translate("Count me in")}</button>`)
                $('#btn-promise').on('click', () => location = `/auth/login?redirect=${location.href}`)
            }
        }
    }
    
    
    // Managers Buttons
    if (user && (user.role === 'president' || user.role === 'manager')) {
        if (event.condition === 'open') {
            // "Close Event" Button
            $('#section2').append(`<button id="btn-close" class="btn btn-warning"><i class="glyphicon glyphicon-remove"></i> ${translate("Close Event")}</button>`)
            
            $('#btn-close').on('click', () => $.ajax({
                url: `/api/clubs/${clubId}/events/${eventId}/close`,
                method: 'PUT',
                success: () => { $('#btn-close').replaceWith(`<span>${translate("Event Closed")}</span>`) }
            }))

        } else {
            // "Open Event" Button
            $('#section2').append(`<button id="btn-open" class="btn btn-warning">${translate("Reopen Event")}</button>`)
            
            $('#btn-open').on('click', () => $.ajax({
                url:`/api/clubs/${clubId}/events/${eventId}/open`,
                method:'PUT',
                success: () => {$('#btn-open').replaceWith(`<span>${translate("Event Opened")}</span>`) }
            }))
            
        }
        // Edit Button
        $('#section3').append(`<a href="/clubs/${clubId}/events/${eventId}/edit" id="btn-edit" class="btn btn-success"><i class="glyphicon glyphicon-pencil"></i> ${translate("Edit Event")}</a>`)
        // Link to Attendance Page
        $('#section2').append(`<a href="/clubs/${clubId}/events/${eventId}/attendance" id="btn-attendance" class="btn btn-success">${translate("Attendance")}</a>`)
    }
    
})()
