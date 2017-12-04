$(function(){
       
    const eventId = (event) ? event._id : null
    const clubId = getId('clubs')

    console.log('eventId', eventId)
    console.log('clubId', clubId)

    $('#btn-submit-edit').text(translate("Submit Edit"))
    $('#btn-delete').text(translate("Delete"))
    $('#members-only').text(translate("Members Only"))
    $('#also-send-email').text(translate("Also Send an Email to all members"))
    $('#label-organizers').text(translate("Organizers"))
    $('#btn-create').text(translate("Create Event"))

    // Bind input to output preview
    markdownBind($('#brief'), $('#preview-brief'))
    textBind($('#title'), $('#preview-title'))


    $('#organizers').on('change', (evt) => {
        let selected = $('#organizers').val();
        // console.log(selected);
        // for(let i = 0; i < selected.length; i++) {
        //     console.log(selected[i]);
        // }
        let organizers = members.filter(member => selected.indexOf(member._id) !== -1)
            .map(organizer => organizer.username);
        $('#organizers-summary').val(organizers.join(" و"))
    })

    // Fill in event organizers (they are ids)
    for(let i = 0; i < members.length; i++) {
        if (event.organizers && event.organizers.indexOf(members[i]._id) != -1) {
            console.log("org", i);
            $('#organizers').append(`<option value="${members[i]._id}" selected="selected">${members[i].username}</option>`)
        } else {
            $('#organizers').append(`<option value="${members[i]._id}">${members[i].username}</option>`)
        }
    }
    $('#organizers').trigger('change')

    if (event) {
        // Format Date
        let date = new Date(event.date);
        $('#date').val(moment(date).locale('en-US').format('YYYY-MM-DD'));
    }
    
    if (!eventId) {
        $("#btn-create").on('click', function(e) {
            e.preventDefault();
            
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
                    organizers: $('#organizers').val(),
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
                    organizers: $('#organizers').val(),
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