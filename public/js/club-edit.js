$(function() {

  const clubId = getId('clubs')

  $("#btn-submit").on('click', function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    $.ajax({
      method: 'PUT',
      url: `/api/clubs/${clubId}`,
      data: {
        name: $('#name').val(),
        description: $('#description').val(),
        logo: $('#logo').val()
      },
      success: function(data) {
        location.href = `/clubs/${clubId}`
      },
      error: function(error) {
        console.log(error);
      }
    });

  });

  // Bind input to output preview
  textBind($('#name'), $('#preview-name'))
  markdownBind($('#description'), $('#preview-description'))

  let logoElement = document.querySelector('#logo-image')
  $('#logo').on('keypress', previewLogo)
  $('#logo').on('paste', previewLogo)

  function previewLogo(event) {
    setTimeout(()=>{
      logoElement.src = $('#logo').val()
    }, 0)
    
  }
  

});

