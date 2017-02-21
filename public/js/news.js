$(function(){

  let date = new Date($('#posted').text());
  $('#posted').text( moment(date).format('MMMM Do YYYY') );

  // Markdown
  var converter = new showdown.Converter();
  let html = converter.makeHtml($('#description').text());
  $('#description').html(html);

});
