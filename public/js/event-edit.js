$(function(){
       
    const eventId = (event) ? event._id : null
    const clubId = getId('clubs')

    console.log('eventId', eventId)
    console.log('clubId', clubId)

    $('#btn-submit-edit').text(translate("Submit Edit"))
    $('#btn-delete').text(translate("Delete"))

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
                url: `/api/clubs/${clubId}/events`,
                data: {
                    title: $('#title').val(),
                    image: $('#image').val(),
                    brief: $('#brief').val(),
                    date: $('#date').val(),
                    time: $('#time').val(),
                    location: $('#location').val(),
                    membersOnly: document.getElementById('membersOnly').checked,
                    sentAsEmail: document.getElementById('sentAsEmail').checked,
                    organizers: organizers,
                    seatLimit: $('#seatLimit').val()
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
                url: `/api/clubs/${clubId}/events/${eventId}`,
                data: {
                    title: $('#title').val(),
                    image: $('#image').val(),
                    brief: $('#brief').val(),
                    date: $('#date').val(),
                    time: $('#time').val(),
                    location: $('#location').val(),
                    membersOnly: document.getElementById('membersOnly').checked,
                    sentAsEmail: document.getElementById('sentAsEmail').checked,
                    organizers: organizers,
                    seatLimit: $('#seatLimit').val()
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
                url: `/api/clubs/${clubId}/events/${eventId}`,
                success: function(data) {
                    // location.href = '/clubs/'+clubName.replace(/\s/g, '-');;
                },
                error: function(error) {
                    console.log(error);
                }
            })
        })
    }

    let imageElement = document.querySelector('#preview-image')
    $('#image').on('keyup', previewImage)
    $('#image').on('paste', previewImage)
  
    function previewImage(event) {
      setTimeout(()=>{
        imageElement.src = $('#image').val()
      }, 0)
    }
  
    if ($('#image').val().length > 0) {
      previewImage()
    }
});