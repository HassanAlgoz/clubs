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




    events.forEach((event) => {
        $('#events').html($('#events').html() + Event(event));
    })

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

    let i = 0;
    for(i = 0; i < 2; i++) {
        let post = posts[i];
        $('#main-posts').html($('#main-posts').html() + `
            <div class="col-md-6 d-flex flex-column py-3">
                <div  class=""><img src="${post.image}" alt="" class="img-fluid" ></div>
                <div class="">
                    <p class="mt-2 title">${post.title}</p>
                    <p class=" text-justify body ">${post.content.substring(0, 200)}...</p>
                    <a class="read-more" href="/clubs/${post.club}/posts/${post._id}"> read more <i class="fa fa-arrow-right"></i></a>
                </div>
            </div>
        `)
    }
    while(i < posts.length) {
        let post = posts[i++];
        $('#posts-side').html($('#posts-side').html() + `
            <div class="row py-3 px-0 side-post">
                <div class="col-md-4 "><img src="${post.image}" alt="" class="img-fluid"> </div>
                <div class="col-md-8 overflow" >
                    <p class="title">${post.title}</p>
                    <p class="body text-justify">${post.content.substring(0, 100)}<a href="/clubs/${post.club}/posts/${post._id}" class="read-more">...read more <i class="fa fa-arrow-right"></i></a> </p>
                </div>
            </div>`
        )
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

    // GET - List all clubs
    response = null
    json = null;
    try {
        response = await fetch(`/api/clubs`)
        // (debugging)
        console.log("response:", response)
        if (!response.ok) {
            console.error("Coudln't fetch clubs")
            return;
        }
        json = await response.json()
    } catch(err){console.error("ERROR:", err)}
    let {clubs} = json
    // (debugging)
    console.log("returned JSON:", json)
    console.log("clubs:", clubs)

    let joinedClubs = []
    let otherClubs = []
    clubs = clubs.filter(club => club.condition == 'approved');
    if (user) {
        for(let i=0; i < clubs.length; i++) {
            for(let j=0; j < user.memberships.length; j++) {
                if (user.memberships[j].club == clubs[i]._id) {
                    joinedClubs.push(clubs[i])
                } else {
                    otherClubs.push(clubs[i])
                }
            }
        }
    } else {
        otherClubs = clubs;
    }
    
    if (joinedClubs.length >= 1) {
        joinedClubs.forEach(club => addClub(club, 'joinedClubs'))
    }
    otherClubs.forEach(club => addClub(club, 'otherClubs'))

    function addClub(club, section) {
        $('#' + section).append(`
            <div class="col-md-3 col-xs-6">
                <a href="/clubs/${club._id}" class="no-underline">
                    <div class="thumbnail">
                        <img src="${club.logo}" alt="${club.name}" class="img-responsive">
                        <div class="green"><small>${club.members.length} members</small></div>
                    </div>
                </a>
            </div>
        `)
    }

    function Event(event) {
        return `<div class="col-md-6 col-lg-4 p-3 text-center">
            <div class="position-relative">
                <a href="/clubs/${event.club}/events/${event._id}">
                    <img src="${event.image}" alt="" class="img-fluid">
                    <div class="overlay overflow py-3 d-none d-md-block">
                        <p class="title">${event.title}</p>
                        <p class="body">${event.brief.substring(0, 80)}...</p>
                    </div>
                </a>
            </div>
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