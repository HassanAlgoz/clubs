$(function(){  
    console.log('index.js loaded')
    
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

    console.log("user", user)
    // GET all clubs
	$.ajax({
        method: 'GET',
        url: '/api/clubs',
        dataType: 'json',
        success: function(data) {
            let clubs = data.clubs;
            console.log("clubs = ", clubs);
            for(let i = 0; i < clubs.length; ++i) {
                if (clubs[i].condition !== 'approved') continue;
                
                let joined = false;
                if (user) {
                    for(let j=0; j<user.memberships.length; j++) {
                        console.log(`user.memberships[i].club = ${user.memberships[j].club} == ${clubs[i]._id} = clubs[i]._id`, user.memberships[j].club == clubs[i]._id)
                        if (user.memberships[j].club == clubs[i]._id) {
                            joined = true;
                            break;
                        }
                    }
                }

                let $section = $('#clubs');
                if (joined) {
                    $section = $('#clubs-joined')
                    console.log('clubs-joined')
                }
                $section.append(`
                <div class="col-md-3 col-xs-6">
                    <a href="/clubs/${clubs[i]._id}" class="no-underline">
                        <div class="thumbnail">
                            <img src="${clubs[i].logo}" alt="${clubs[i].name}" class="img-responsive">
                            <div class="green"><small>${clubs[i].members.length} members</small></div>
                        </div>
                    </a>
                </div>
                `);
            }
        },
        error: function(error) {
            $('#body').html(`
            ERROR
            `); 
        }
    });

    // Service Worker
    // navigator.serviceWorker.register('./sw.js', {scope: './'})
    // .then(reg => console.log('SW registered!', reg))
    // .catch(err => console.log('Boo!', err));
  
});