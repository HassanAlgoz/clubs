/*jslint browser:true*/
$(function() {

  $("#btn-submit").on('click', function(e) {
    e.preventDefault(); // avoid execution of the actual submit of the form

    $.ajax({
      method: 'POST',
      url: '/api/clubs',
      data: {
        name: $('#input-name').val(),
        clubPresidentId: $('#input-clubPresidentId').val()
      },
      success: function(data) {
        location.href = '/clubs/'+$('#input-name').val().replace(/\s/g, '-');
      },
      error: function(error) {
        console.log(error);
      }
    });

  });

});

