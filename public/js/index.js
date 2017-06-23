$(function(){
    
	$.ajax({
        method: 'GET',
        url: '/api/clubs',
        dataType: 'json',
        success: function(data) {
            let clubs = data.clubs;
            console.log(clubs);
            for(let i = 0; i < clubs.length; ++i) {
                $('#clubs').append(`<div class = "col-md-6"><a href="/club/${clubs[i]._id}">${clubs[i].name}</a></div>`);
            }
        },
        error: function(error) {
            $('#body').html(`
            ERROR
            `); 
        }
    });
    
});