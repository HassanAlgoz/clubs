$(function() {

  var originalName = $('#input-name').val(); // Original name when the page loads
  var converter = new showdown.Converter();

  $("#btn-submit").on('click', function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    $.ajax({
      method: 'PUT',
      url: '/api/clubs/'+originalName,
      data: {
        name: $('#input-name').val(),
        description: $('#input-description').val(),
        logo: $('#input-logo').val()
      },
      success: function(data) {
        location.href = '/clubs/'+$('#input-name').val().replace(/\s/g, '-');
      },
      error: function(error) {
        console.log(error);
      }
    });

  });

  // $("#btn-delete").on('click', function(e) {
  //   e.preventDefault(); // avoid to execute the actual submit of the form.

  //   $.ajax({
  //     method: 'DELETE',
  //     url: '/api/clubs/'+originalName,
  //     success: function(data) {
  //       location.href = '/clubs';
  //     },
  //     error: function(error) {
  //       console.log(error);
  //     }
  //   });
  // });
  
  
  // Markdown
  let html;

  html = converter.makeHtml($('#input-description').val());
  $('#description').html(html);

  html = converter.makeHtml($('#input-name').val());
  $('#name').html(html);

  $('#input-description').on('keyup', function() {
    let html = converter.makeHtml($('#input-description').val());
    $('#description').html(html);
  });

  $('#input-name').on('keyup', function() {
    let html = converter.makeHtml($('#input-name').val());
    $('#name').html(html);
  });

});

