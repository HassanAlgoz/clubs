$(function(){
    
    console.log('club.js loaded')
    
    // Markdown
    $('#description').html(converter.makeHtml($('#description').text()));
    
    let arr = location.pathname.split('/')
    let clubId = arr[arr.length - 1]
    
    if (hasRole()) {
        $('#btn-join').remove()
    } else {
        if (!user) {
            $('#btn-join').html(`<i class="glyphicon glyphicon-check"></i> Login to join`);
        }
        
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
    }
});
