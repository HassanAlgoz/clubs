/*jslint browser:true*/
$(function () {

    var id = $('#id').val();

    let date = new Date($('#date').text());
    $('#date').text(moment(date).fromNow() + " on " + moment(date).format('Do MMMM'));

    date = new Date($('#posted').text());
    $('#posted').text(moment(date).fromNow());

    // let loggedIn = ($('#user').val().length > 0);
    // let userRole = $('#userRole').val();
    // let isMember = userRole.length > 0;
    let clubName = $('#clubName').val();
    // let membersOnly = ($("#membersOnly").val() === 'true')?true:false;

    let usersIDs = $('.usersIDs').map((i, a) => $(a).val());
    let attendance = $('.attendance').map((i, a) => $(a).prop('checked'));


    // if (!loggedIn) {
    //   userRole = '';
    //   isMember = false;
    // }

    $('#btn-submit').on('click', function (e) {
        e.preventDefault();

        let updatedAttendance = [];
        updatedAttendance = $('.attendance').map((i, a) => $(a).prop('checked'));

        let tmp1 = [];
        let tmp2 = [];
        for (let i = 0; i < usersIDs.length; ++i) {
            if (updatedAttendance[i] !== attendance[i]) {
                tmp1.push(usersIDs[i]);
                tmp2.push(updatedAttendance[i]);
            }   
        }
        let updatedUsers = tmp1;
        updatedAttendance = tmp2;
        

        console.log(updatedUsers, updatedAttendance);

        $.ajax({
          method: 'PUT',
          url: '/api/events/'+id+'/attendance',
          data: {
            clubName: clubName,
            updatedUsers: updatedUsers.join(','),
            updatedAttendance: updatedAttendance.join(',')
          },
          success: function(data) {
            // location.reload();
            console.log("PUT sucessful")
          },
          error: function(error) {
            console.log(error);
          }
        });


    })

});
