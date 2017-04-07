$(function(){

  var id = $('#id').val();
  var clubName = $('#clubName').val();
  var converter = new showdown.Converter();

  let method = 'PUT';
  if (id === '') {
    method = 'POST';
    $('#btn-delete').remove();
  }

  $("#btn-submit").on('click', function(e) {
    e.preventDefault();

    $.ajax({
      method: method,
      url: '/api/events/'+id,
      data: {
        title: $('#input-title').val(),
        brief: $('#input-brief').val(),
        date: $('#input-date').val(),
        time: $('#input-time').val(),
        location: $('#input-location').val(),
        membersOnly: document.getElementById('input-membersOnly').checked,
        clubName: clubName
      },
      success: function(data) {
        location.href = '/clubs/'+clubName.replace(/\s/g, '-');
      },
      error: function(error) {
        console.log(error);
      }
    });

  });


  $("#btn-delete").on('click', function(e) {
    e.preventDefault();

    $.ajax({
      method: 'DELETE',
      url: '/api/events/'+id,
      data: {
        clubName: clubName
      },
      success: function(data) {
        location.href = '/clubs/'+clubName.replace(/\s/g, '-');;
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  
  // Markdown
  let html;

  html = converter.makeHtml($('#input-brief').val());
  $('#brief').html(html);

  html = converter.makeHtml($('#input-title').val());
  $('#title').html(html);

  $('#input-brief').on('keyup', function() {
    let html = converter.makeHtml($('#input-brief').val());
    $('#brief').html(html);
  });

  $('#input-title').on('keyup', function() {
    let html = converter.makeHtml($('#input-title').val());
    $('#title').html(html);
  });

});

