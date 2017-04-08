/*jslint browser:true*/
$(function(){

  // Markdown
  let converter = new showdown.Converter();
  let html = converter.makeHtml($('#description').text());
  $('#description').html(html);

  let loggedIn = ($('#user').val().length > 0);
  let clubName = $('#clubName').val().replace(/\s/g, '-');

  if (!loggedIn) {
  	$('#btn-join').html(`<i class="glyphicon glyphicon-check"></i> Login to join`);
  }


  $('#btn-join').on('click', function() {

  	if (loggedIn) {

  		$.ajax({
        method: 'GET',
        url: `/api/clubs/${clubName}/users/join`,
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



});
