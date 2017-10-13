(async function(){  
    console.log('index.js loaded')

    console.log("user", user)
    // GET - List all clubs
    let response, json;
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