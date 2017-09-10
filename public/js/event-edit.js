$(function(){
       
    const eventId = (event) ? event._id : null
    const clubId = getId('clubs')

    console.log('eventId', eventId)
    console.log('clubId', clubId)

    // Bind input to output preview
    markdownBind($('#brief'), $('#preview-brief'))
    textBind($('#title'), $('#preview-title'))


    // Fill in event organizers (they are ids)
    let organizers = members.map(member => `${member.username} (${member._id})`)
    if (event) {
        // Format Date
        let date = new Date(event.date);
        $('#date').val(moment(date).format('YYYY-MM-DD'));
    }
    $('#organizers').tokenfield({
		autocomplete: {
			source: organizers,
			delay: 100
		},
		showAutocompleteOnFocus: true
	});
    
    if (!eventId) {
        $("#btn-create").on('click', function(e) {
            e.preventDefault();
            
            let organizers = commaSeparatedStringToArray($('#organizers').val()).map(organizer => organizer.match(/\((\w+)\)/)[1])

            $.ajax({
                method: 'POST',
                url: `/api/events?clubId=${clubId}`,
                data: {
                    title: $('#title').val(),
                    image: $('#image').val(),
                    brief: $('#brief').val(),
                    date: $('#date').val(),
                    time: $('#time').val(),
                    location: $('#location').val(),
                    membersOnly: document.getElementById('membersOnly').checked,
                    sentAsEmail: document.getElementById('sentAsEmail').checked,
                    organizers: organizers
                },
                success: function(data) {
                    location.href = `/clubs/${clubId}/events/${data._id}`
                },
                error: function(error) {
                    console.log(error);
                }
            })
        })

    } else {
        $("#btn-submit-edit").on('click', function(e) {
            e.preventDefault();

            let organizers = commaSeparatedStringToArray($('#organizers').val()).map(organizer => organizer.match(/\((\w+)\)/)[1])
            $.ajax({
                method: 'PUT',
                url: `/api/events/${eventId}?clubId=${clubId}`,
                data: {
                    title: $('#title').val(),
                    image: $('#image').val(),
                    brief: $('#brief').val(),
                    date: $('#date').val(),
                    time: $('#time').val(),
                    location: $('#location').val(),
                    membersOnly: document.getElementById('membersOnly').checked,
                    sentAsEmail: document.getElementById('sentAsEmail').checked,
                    organizers: organizers
                },
                success: function(data) {
                    location.href = `/clubs/${clubId}/events/${data._id}`
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