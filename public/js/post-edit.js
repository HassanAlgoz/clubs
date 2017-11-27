$(function(){
    
    const postId = (post) ? post._id : null
    const clubId = getId('clubs')

    console.log('postId', postId)
    console.log('clubId', clubId)

    // Bind input to output preview
    setTimeout(() => {
        markdownBind($('#content'), $('#preview-content'))
        textBind($('#title'), $('#preview-title'))
    }, 0)

    if (!postId) {
            $("#btn-create").on('click', function(e) {
            e.preventDefault();
            
            $.ajax({
                method: 'POST',
                url: `/api/clubs/${clubId}/posts`,
                data: {
                    title: $('#title').val(),
                    content: $('#content').val(),
                    image: $('#image').val(),
                    sentAsEmail: document.getElementById('sentAsEmail').checked
                },
                success: function(data) {
                    location = `/clubs/${clubId}/posts/${data._id}`
                },
                error: function(response) {
                    let {errors} = response.responseJSON
                    console.error("Errors:", errors)
                    $('#errors').html(``)
                    errors.forEach(err => {
                      $('#errors').append(`<div class="alert alert-danger">${err}</div>`)
                    })
                }
            })
        })

    } else {
        
        populateInputFields(post, ['title', 'content'])

        $("#btn-submit-edit").on('click', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'PUT',
                url: `/api/clubs/${clubId}/posts/${postId}`,
                data: {
                    title: $('#title').val(),
                    content: $('#content').val(),
                    image: $('#image').val(),
                    sentAsEmail: document.getElementById('sentAsEmail').checked
                },
                success: function(data) {
                    location = `/clubs/${clubId}/posts/${data._id}`
                },
                error: function(error) {
                    console.log(error);
                }
            })
        })

        $("#btn-delete").on('click', function(e) {
            e.preventDefault();
            
            $.ajax({
                method: 'DELETE',
                url: `/api/clubs/${clubId}/posts/${postId}`,
                success: function(data) {
                    location = `/clubs/${clubId}`
                },
                error: function(error) {
                    console.log(error);
                }
            })
        })
    }

    let imageElement = document.querySelector('#preview-image')
    $('#image').on('keyup', previewImage)
    $('#image').on('paste', previewImage)

    function previewImage(event) {
        setTimeout(() => {
            imageElement.src = $('#image').val()
        }, 0)
    }

    if ($('#image').val().length > 0) {
        previewImage()
    }
});

