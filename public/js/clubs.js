(async function(){

    $('#h-clubs').text(translate("Clubs"))

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
    } catch (err) { console.error("ERROR:", err) }
    let { clubs } = json
    // (debugging)
    console.log("returned JSON:", json)
    console.log("clubs:", clubs)

    let joinedClubs = []
    let otherClubs = []
    clubs = clubs.filter(club => club.condition == 'approved');
    if (user) {
        for (let i = 0; i < clubs.length; i++) {
            let found = false;
            for (let j = 0; j < user.memberships.length; j++) {
                if (user.memberships[j].club == clubs[i]._id) {
                    found = true;
                    break;
                }
            }
            if (found) {
                joinedClubs.push(clubs[i])
            } else {
                otherClubs.push(clubs[i])
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
                            <div class="gray"><small>${club.members.length} ${translate("members")}</small></div>
                        </div>
                    </a>
                </div>
            `)
    }
})()