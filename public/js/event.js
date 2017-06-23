/*jslint browser:true*/
$(function(){

  var eventId = $('#eventId').val();

  // Markdown
  $('#brief').html(converter.makeHtml($('#brief').text()));

  let loggedIn = ($('#user').val().length > 0);
  let userRole = $('#userRole').val();
  let isMember = userRole.length > 0;
  let clubName = $('#clubName').val();
  let membersOnly = ($("#membersOnly").val() === 'true')?true:false;

  if (!loggedIn) {
    userRole = '';
    isMember = false;
  }

  console.log('membersOnly', membersOnly);
  console.log("loggedIn", loggedIn);

  $('#btn-promise').on('click', function(e) {
    e.preventDefault();

    if (loggedIn && (!membersOnly || membersOnly && isMember)) {
      $.ajax({
        method: 'POST',
        url: '/api/events/'+eventId+'/promise',
        data: {
          clubName: clubName
        },
        success: function(data) {
          location.reload();
        },
        error: function(error) {
          console.log(error);
        }
      });
    } else {
      location.href = '/login';
    }

  });

  let date = new Date($('#date').text());
  $('#date').text( moment(date).fromNow() +" on "+ moment(date).format('Do MMMM'));

  date = new Date($('#posted').text());
  $('#posted').text( moment(date).fromNow() );

  $('#btn-close').on('click', function() {

    if (loggedIn && (isMember && (userRole === 'manager' || userRole === 'president'))) {
      $.ajax({
        method: 'POST',
        url: '/api/events/'+eventId+'/close',
        data: {
          clubName: clubName
        },
        success: function(data) {
          location.reload();
        },
        error: function(error) {
          console.log(error);
        }
      });
    } else {
      location.href = '/login';
    }

  });

  $('#btn-open').on('click', function() {

    if (loggedIn && (isMember && (userRole === 'manager' || userRole === 'president'))) {
      $.ajax({
        method: 'POST',
        url: '/api/events/'+eventId+'/open',
        data: {
          clubName: clubName
        },
        success: function(data) {
          location.reload();
        },
        error: function(error) {
          console.log(error);
        }
      });
    } else {
      location.href = '/login';
    }

  });


});
