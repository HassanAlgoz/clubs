/*jslint browser:true*/
$(function(){

  var id = $('#id').val();

  // Markdown
  var converter = new showdown.Converter();
  let html = converter.makeHtml($('#brief').text());
  $('#brief').html(html);

  let userRole = $('#userRole').val();
  let isMember = userRole.length > 0;
  let clubName = $('#clubName').val();
  let membersOnly = ($("#membersOnly").val() === 'true')?true:false;

  console.log('membersOnly', membersOnly);

  $('#btn-promise').on('click', function(e) {
    e.preventDefault();

    if (!membersOnly || membersOnly && isMember) {
      $.ajax({
        method: 'POST',
        url: '/api/events/'+id+'/promise',
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

    if (!membersOnly || membersOnly && isMember && (userRole === 'manager' || userRole === 'president')) {
      $.ajax({
        method: 'GET',
        url: '/api/events/'+id+'/close',
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

    if (!membersOnly || membersOnly && isMember && (userRole === 'manager' || userRole === 'president')) {
      $.ajax({
        method: 'GET',
        url: '/api/events/'+id+'/open',
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
