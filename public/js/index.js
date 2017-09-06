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

    // GET all clubs
	$.ajax({
        method: 'GET',
        url: '/api/clubs',
        dataType: 'json',
        success: function(data) {
            let clubs = data.clubs;
            console.log("clubs = ", clubs);
            for(let i = 0; i < clubs.length; ++i) {
                $('#clubs').append(`
                <div class="col-md-3">
                    <a href="/clubs/${clubs[i]._id}" class="no-underline">
                        <div class="thumbnail">
                            <img src="${clubs[i].logo}" alt="Club Logo" class="img-responsive">
                            <div class="caption">
                                <h4>${clubs[i].name}</h4>
                            </div>
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
    
});