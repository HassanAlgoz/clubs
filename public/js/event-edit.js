$(function(){
    
    var converter = new showdown.Converter();
    
    const eventId = $('#eventId').val()
    const clubId = getId('club')

    console.log('eventId', eventId)
    console.log('clubId', clubId)

    // Bind input to output preview
    markdownBind($('#brief'), $('#preview-brief'))
    textBind($('#title'), $('#preview-title'))
    

    if (eventId == "") {
            $("#btn-create-event").on('click', function(e) {
            e.preventDefault();
            
            $.ajax({
                method: 'POST',
                url: `/api/events?clubId=${clubId}`,
                data: {
                    title: $('#title').val(),
                    brief: $('#brief').val(),
                    date: $('#date').val(),
                    time: $('#time').val(),
                    location: $('#location').val(),
                    membersOnly: document.getElementById('membersOnly').checked,
                    sentAsEmail: document.getElementById('sentAsEmail').checked
                },
                success: function(data) {
                    // location.href = '/clubs/'+clubName.replace(/\s/g, '-');
                },
                error: function(error) {
                    console.log(error);
                }
            })
        })

    } else {
        $("#btn-submit-edit").on('click', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'PUT',
                url: `/api/events/${eventId}?clubId=${clubId}`,
                data: {
                    title: $('#title').val(),
                    brief: $('#brief').val(),
                    date: $('#date').val(),
                    time: $('#time').val(),
                    location: $('#location').val(),
                    membersOnly: document.getElementById('membersOnly').checked,
                    sentAsEmail: document.getElementById('sentAsEmail').checked
                },
                success: function(data) {
                    // location.href = '/clubs/'+clubName.replace(/\s/g, '-');
                },
                error: function(error) {
                    console.log(error);
                }
            })
        })

        $("#btn-delete").on('click', function(e) {
            e.preventDefault();
            
            $.ajax({
                method: 'DELETE',
                url: `/api/events/${eventId}?clubId=${clubId}`,
                success: function(data) {
                    // location.href = '/clubs/'+clubName.replace(/\s/g, '-');;
                },
                error: function(error) {
                    console.log(error);
                }
            })
        })
    }
});

