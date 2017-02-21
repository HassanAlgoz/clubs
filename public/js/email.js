$(function(){

  var converter = new showdown.Converter();
  
  // Markdown
  let html;

  html = converter.makeHtml($('#input-body').val());
  $('#body').html(html);

  html = converter.makeHtml($('#input-subject').val());
  $('#subject').html(html);

  $('#input-body').on('keyup', function() {
    let html = converter.makeHtml($('#input-body').val());
    $('#body').html(html);
  });

  $('#input-subject').on('keyup', function() {
    let html = converter.makeHtml($('#input-subject').val());
    $('#subject').html(html);
  });

});

