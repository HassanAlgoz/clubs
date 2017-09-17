$(function() {

  const clubId = getId('clubs')

  $("#form").on('submit', (evt) => {
    evt.preventDefault(); // avoid to execute the actual submit of the form.
    
    $.ajax({
      method: "PUT",
      url: `/api/clubs/${clubId}`,
      data: $(evt.target).serialize(),

      success: (data) => {
        location.href = `/clubs/${clubId}`
      },

      error: (response) => {
        let {errors} = response.responseJSON
        console.error("Errors:", errors)
        $('#errors').html(``)
        errors.forEach(err => {
          $('#errors').append(`<div class="alert alert-danger">${err}</div>`)
        })
      }

    })

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

  if ($('#logo').val().length > 0) {
    previewLogo()
  }
  

});

