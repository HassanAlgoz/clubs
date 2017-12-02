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
        response = await fetch(`/api/clubs/${clubId}?events=true&posts=true`)
        // (debugging)
        console.log("response:", response)
        if (!response.ok) {
            // redirect to homepage
            location = `/`
            return;
        }
        json = await response.json()
    } catch(err){console.error("ERROR:", err)}
    let {club} = json
    // (debugging)
    console.log("returned JSON:", json)
    console.log("club:", club)

    $('#h-events').text(translate('Events'))
    $('#h-posts').text(translate('Posts'))
    if (locale == 'ar') {
        $('#social').addClass('text-left')
        $('#join-text').text(`انضم إلى الأعضاء الـ ${club.members.length}`)
    } else {
        $('#social').addClass('text-right')
        $('#join-text').text(`Join the ${club.members.length} members`)
    }

    // Set Browser Tab Name
    document.title = club.name
    // Fill in Club details
    $('#logo').attr('alt', club.name)
    document.querySelector('#logo').src = club.logo
    // Social Media Buttons
    let socialHTML = ``;
    if (club.twitter) socialHTML +=   `<a class="social-link" href="${club.twitter}"><i class="fa fa-twitter" aria-hidden="true"></i></a>`;
    if (club.youtube) socialHTML +=   `<a class="social-link" href="${club.youtube}"><i class="fa fa-youtube" aria-hidden="true"></i></a>`;
    if (club.periscope) socialHTML += `<a class="social-link" href="${club.periscope}"><i class="fa fa-periscope" aria-hidden="true"></i>p</a>`;
    if (club.instagram) socialHTML += `<a class="social-link" href="${club.instagram}"><i class="fa fa-instagram" aria-hidden="true"></i></a>`;
    if (club.snapchat) socialHTML += `<a class="social-link" href="${club.snapchat}"><i class="fa fa-snapchat-square" aria-hidden="true"></i></a>`;
    if (club.telegram) socialHTML += `<a class="social-link" href="${club.telegram}"><i class="fa fa-telegram" aria-hidden="true"></i></a>`;
    if (club.whatsapp) socialHTML += `<a class="social-link" href="${club.whatsapp}"><i class="fa fa-whatsapp" aria-hidden="true"></i></a>`;
    if (club.slack) socialHTML += `<a class="social-link" href="${club.slack}"><i class="fa fa-slack" aria-hidden="true"></i></a>`;
    $('#social').append(socialHTML);
    
    // Description is written in Markdown which we have to convert to HTML
    $('#description').html(converter.makeHtml(club.description));

    // List all events
    let html = ``;
    for (let i = 0; i < club.events.length; i++) {
        // Append HTML
        html += Event(club.events[i])
        if ((i+1) % 2 == 0) {
            html = `<div class="row">${html}</div>`
            $('#events').append(html)
            html = ``;
        } else {
            if (i == club.events.length - 1) {
                $('#events').append(html)
            }
        }
    }

    // List all posts
    for(let i = club.posts.length - 1; i >= 0; i--) {
        $('#posts').append(`
            <a href="/clubs/${clubId}/posts/${club.posts[i]._id}">
                <img class="img-responsive" src="${club.posts[i].image}">
                ${club.posts[i].title}
            </a>
            <hr>
        `)
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

    function Event(event) {
        // Show different labels based on conditions
        let membersOnlyMessage = event.membersOnly ? translate("members only") : translate("open for all");
        let membersOnlyClass = "green";
        let numPromises = event.promisers ? event.promisers.length : 0
        let past = (moment(new Date()).isAfter(moment(new Date(event.date)))) ? true : false;

        // Show NO. people attending
        let attendanceMessage = "";
        let attendanceClass = "green";
        if (event.seatLimit > 0) {
            attendanceMessage = `${translate("seats")}: ${numPromises}/${event.seatLimit}`;
            if (numPromises >= event.seatLimit) {
                attendanceClass = "red";
            }
        }
        
        if (!(event.seatLimit > 0) || event.condition === "closed") {
            let subject = (event.membersOnly) ? translate("members") : translate("people")
            let verb = (past) ? translate("attended") : translate("attending")
            attendanceMessage = `${numPromises} ${subject} ${verb}`;
        }

        if (event.condition === "closed") {
            membersOnlyMessage = translate("closed");
            membersOnlyClass = "red";
        }
        
        // Format Date (using moment): refer to http://momentjs.com/docs/#/displaying/format/
        let date = new Date(event.date);
        let formattedDate = `${moment(date).format('MMM Do, dddd')}`

        let organizersDiv = "";
        if (event.organizers && event.organizers.length >= 1) {
            let organizers = event.organizers.map(organizer => organizer.username);

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

})()
