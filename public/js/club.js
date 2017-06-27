$(function(){
    
    console.log('club.js loaded')
    
    // Markdown
    $('#description').html(converter.makeHtml($('#description').text()));

    

    $('#btn-join').on('click', function() {
        
        if (user) {
            
            $.ajax({
                method: 'GET',
                url: `/api/clubs/${clubId}/join`,
                success: function(data) {
                    $('#btn-join').parent().html(`<span class="text-success">Thank you for joining.. talk to the admin for approval</span>`);
                },
                error: function(error) {
                    $('#btn-join').parent().html(`<span class="text-danger">Sorry.. something went wrong</span>`);
                }
            });
            
        } else {
            location.href = '/login';
        }
        
    });

});
