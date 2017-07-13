$(function(){
    
    console.log('index.js loaded')

	$.ajax({
        method: 'GET',
        url: '/api/clubs',
        dataType: 'json',
        success: function(data) {
            let clubs = data.clubs;
            console.log("clubs = ", clubs);
            for(let i = 0; i < clubs.length; ++i) {
                $('#clubs').append(`<div class = "col-xs-6 col-xs-offset-5"><a href="/clubs/${clubs[i]._id}">${clubs[i].name}</a></div>`);
            }
        },
        error: function(error) {
            $('#body').html(`
            ERROR
            `); 
        }
    });
    
});