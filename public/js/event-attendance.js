/*jslint browser:true*/
$(function () {

    const eventId = event._id
    const clubId = getId('club')

    // Format Dates
    let publishDate = new Date(event.publishDate);
    $('#published').text( moment(publishDate).fromNow() );
    let date = new Date(event.date);
    $('#date').text( moment(date).fromNow() +" on "+ moment(date).format('Do MMMM'));
    
    // Populate title, time and location
    populateText(event, ['title', 'time', 'location'])
    
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
                <td>${event.promisers[i].user.enrollment}</td>
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
            success: function (data) {
                // location.href= `/club/${clubId}/event/${eventId}`;
                // location.reload();
                $('#btn-submit').replaceWith(`<span class="text-success">Successfully Updated Attendance!</span>`);
                console.log("sucessfully updated attendance!");
            },
            error: function (error) {
                $('#btn-submit').replaceWith(`<span class="text-danger">Error: ${error.message}</span>`);
                console.log("something went wrong");
                console.log(error);
            }
        });


    })

});
