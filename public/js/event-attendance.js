/*jslint browser:true*/
$(function () {

    const eventId = event._id
    const clubId = getId('clubs')

    // Format Dates
    let past = (moment(new Date()).isAfter(moment(new Date(event.date))))? true : false;
    console.log("past", past)
    let publishDate = new Date(event.publishDate);
    $('#published').text( moment(publishDate).fromNow() );
    let date = new Date(event.date);
    $('#date').text(`${moment(date).fromNow()} (${moment(date).format('Do MMMM')})`);
    
    // Populate title, time and location
    populateText(event, ['title', 'time', 'location'])
    
    if (event.seatLimit > 0) {
        $('#attendees').text(`${event.promisers.length}/${event.seatLimit} seats reserved`)
        if (event.promisers.length >= event.seatLimit) {
            $('#attendees').addClass("text-danger")
        }
    } else {
        let subject = (event.membersOnly)? "members" : "people"
        let verb = (past)? "attended" : "attending"
        $('#attendees').text(`${event.promisers.length} ${subject} ${verb}`)
    }

    if (event.membersOnly) {
        $('#info').append(`<li id="membersOnly"><i class="text-danger">This event is for members only</i></li>`)
    }


    let usersIds = []
    let attendance = []
    for(let i = 0; i < event.promisers.length; ++i) {
        usersIds.push(event.promisers[i].user._id)
        attendance.push(event.promisers[i].attended === true)

        let checked = (event.promisers[i].attended === true) ? "checked" : ""
        $('tbody').append(`
            <tr>
                <td align="center">
                  <div class="input-group">
                    <input type="checkbox" class="attendance" ${checked}>
                  </div>
                </td>
                <td>${event.promisers[i].user.username}</td>
                <td>${event.promisers[i].user.major}</td>
                <td>${event.promisers[i].user.KFUPMID}</td>
            </tr>
        `)

    }

    $('#btn-submit').on('click', function (e) {
        e.preventDefault();

        let updatedAttendance = [];
        updatedAttendance = $('.attendance').map((i, a) => $(a).prop('checked'));

        let tmp1 = [];
        let tmp2 = [];
        for (let i = 0; i < usersIds.length; ++i) {
            if (updatedAttendance[i] !== attendance[i]) {
                tmp1.push(usersIds[i]);
                tmp2.push(updatedAttendance[i]);
            }
        }
        let updatedUsers = tmp1;
        updatedAttendance = tmp2;


        console.log(updatedUsers, updatedAttendance);

        $.ajax({
            method: 'PUT',
            url: `/api/events/${eventId}/attendance?clubId=${clubId}`,
            data: {
                updatedUsers: updatedUsers.join(','),
                updatedAttendance: updatedAttendance.join(',')
            },
            success: () => {
                let message = "Successfully updated attendance"
                $('#btn-submit').replaceWith(`<span class="text-success">${message}</span>`);
                // location.reload();
            },
            error: (response) => {
                let {errors} = response.responseJSON;
                $('#btn-submit').replaceWith(`<span class="text-danger">Errors: ${errors}</span>`);
                console.log("Errors:", errors);
            }
        });


    })

});
