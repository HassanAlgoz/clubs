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
      url: '/api/news/'+id,
      data: {
        title: $('#input-title').val(),
        body: $('#input-body').val(),
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
      url: '/api/news/'+id,
      data: {
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

  
  // Markdown
  let html;

  html = converter.makeHtml($('#input-body').val());
  $('#body').html(html);

  html = converter.makeHtml($('#input-title').val());
  $('#title').html(html);

  $('#input-body').on('keyup', function() {
    let html = converter.makeHtml($('#input-body').val());
    $('#body').html(html);
  });

  $('#input-title').on('keyup', function() {
    let html = converter.makeHtml($('#input-title').val());
    $('#title').html(html);
  });

});

