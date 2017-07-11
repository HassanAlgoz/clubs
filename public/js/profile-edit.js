$(function(){

    console.log('profile-edit.js loaded')

    userId = (user) ? user._id : null

    let form = document.forms[0];

    $('form').on('submit', (event) => {
        event.preventDefault();
        $.ajax({
            method: "PUT",
            url: `/api/users/profile/${userId}`,
            data: $(form).serialize()
        })
        // console.log($(form).serialize())
    })

    $('#btn-show-password').on('click', (event) => {
        event.preventDefault();
        $(event.target).parent().toggleClass('hidden')
        $('#password-change').toggleClass('hidden')

    })

})