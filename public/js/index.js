(async function(){  
    console.log('index.js loaded')

    console.log("user", user)
    // Fetch Events and Display Them
    let response, json;
    try {
        let startDate = moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD');
        response = await fetch(`/api/events?startDate=${startDate}&limit=8`)
        // (debugging)
        console.log("response:", response)
        if (!response.ok) {
            console.error("Coudln't fetch events")
            return;
        }
        json = await response.json()
    } catch (err) { console.error("ERROR:", err) }
    let { events } = json



    for(let i = 0; i < events.length; i++) {
        let event = events[i];
        let html = Event(event);
        $('#events').append(html)
    }

    // Fetch Posts and Display Them
    response = null
    json = null;
    try {
        response = await fetch(`/api/posts?limit=7`)
        // (debugging)
        console.log("response:", response)
        if (!response.ok) {
            console.error("Coudln't fetch posts")
            return;
        }
        json = await response.json()
    } catch (err) { console.error("ERROR:", err) }
    let { posts } = json

    for(let i = 0; i < posts.length; i++) {
        let post = posts[i];
        $('#posts').html($('#posts').html() + `
            <div class="col-md-6">
                <div  class=""><img src="${post.image}" alt="" class="img-fluid" ></div>
                <div class="">
                    <h4>${post.title}</h4>
                    <p>${post.content.substring(0, 200)}...<a class="read-more" href="/clubs/${post.club}/posts/${post._id}">read more</a></p>
                </div>
            </div>
        `)
    }
    // $('#posts-side').html($('#posts-side').html() + `
    //     <div class="row py-3 px-0 ">
    //         <div class="col">Show More <i class="fa fa-arrow-circle-right"></i></div>
    //     </div>`
    // )


    // Show Only Future Events
    $('#btn-future').on('click', (e) => {
        e.preventDefault()
        $('#btn-future').addClass('active');
        $('#btn-past').removeClass('active');
        $('#events').html('');
        events.forEach((event) => {
            $('#events').html($('#events').html() + Event(event))
        })
    })

    let oldEvents = [];
    $('#btn-past').on('click', async (e) => {
        e.preventDefault()
        $('#btn-future').removeClass('active');
        $('#btn-past').addClass('active');
        if (oldEvents.length === 0) {
            let response, json;
            try {
                let startDate = moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD');
                let endDate = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');
                response = await fetch(`/api/events?startDate=${startDate}&endDate=${endDate}&limit=8`)
                // (debugging)
                console.log("response:", response)
                if (!response.ok) {
                    console.error("Coudln't fetch events")
                    return;
                }
                json = await response.json()
            } catch (err) { console.error("ERROR:", err) }
            oldEvents = json.events
        }
        
        if (oldEvents.length !== 0) {
            $('#events').html('');
            oldEvents.forEach((event) => {
                $('#events').html($('#events').html() + Event(event))
            })
        }
    })

    function Event(event) {
        // Show different labels based on conditions
        let membersOnlyMessage = event.membersOnly ? "members only" : "open for all";
        let membersOnlyClass = "green";
        let numPromises = event.promisers ? event.promisers.length : 0
        let past = (moment(new Date()).isAfter(moment(new Date(event.date)))) ? true : false;

        // Show NO. people attending
        let attendanceMessage = "";
        let attendanceClass = "green";
        if (event.seatLimit > 0) {
            attendanceMessage = `${numPromises}/${event.seatLimit} seats reserved`;
            if (numPromises >= event.seatLimit) {
                attendanceClass = "red";
            }
        } else {
            let subject = (event.membersOnly) ? "members" : "people"
            let verb = (past) ? "attended" : "attending"
            attendanceMessage = `${numPromises} ${subject} ${verb}`;
        }

        if (event.condition === "closed") {
            membersOnlyMessage = "closed";
            membersOnlyClass = "red";
        }

        // Format Date (using moment): refer to http://momentjs.com/docs/#/displaying/format/
        let date = new Date(event.date);
        let formattedDate = `${moment(date).format('MMM Do, dddd')}`

        let organizersDiv = "";
        if (event.organizers && event.organizers.length >= 1) {
            let organizers = event.organizers.map(organizer => organizer.username);
            console.log("organizers", organizers);
            if (organizers.length > 1) {
                organizers = [organizers[0], organizers[1]].join(" و");
            } else {
                organizers = organizers[0]
            }
            organizersDiv = `<div class="gold"><small>${organizers}</small></div>`;
        }

        return `
        <div class="col-sm-6 col-md-6">
            <a href="/clubs/${event.club}/events/${event._id}" class="no-underline">
                <div class="thumbnail shadow">
                    <img src="${event.image}" alt="Image" class="center-block img-responsive">
                    <div class="gray"><small>${formattedDate}</small></div>
                    <div class="gray"><small>${attendanceMessage}</small></div>
                    <div class="gray"><small>${membersOnlyMessage}</small></div>
                    ${organizersDiv}
                </div>
            </a>
        </div>`;
    }

    // Register Service Worker
    // if (!('serviceWorker' in navigator)) {
    //     console.log("Error: your browser doesn't support Service Workers!")
    // } else {
    //     navigator.serviceWorker.register('/js/service-worker.js').then((registration) => {
    //         console.log('SW registered! Scope is: ' + registration.scope)
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })
    // }

    // Service Worker
    // navigator.serviceWorker.register('./sw.js', {scope: './'})
    // .then(reg => console.log('SW registered!', reg))
    // .catch(err => console.log('Boo!', err));
  
})()