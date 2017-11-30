(async function() {
    
    let clubId = getId("clubs") // getId is a helper function that can be found in `/public/js/utils.js`
    // Fetch data of club from API (data includes club.events and club.posts)
    let response, json;
    try {
        response = await fetch(`/api/clubs/${clubId}`)
        // (debugging)
        console.log("response:", response)
        if (!response.ok) {
            // redirect to homepage
            location = `/`
            return;
        }
        json = await response.json()
    } catch(err){console.error("ERROR:", err)}
    let {club} = json
    // (debugging)
    console.log("returned JSON:", json)
    console.log("club:", club)

    populateInputFields(club, ["name", "logo", "description"])
    document.querySelector('#logo').src = club.logo
    
    // Bind input to output preview
    textBind($('#name'), $('#preview-name'))
    markdownBind($('#description'), $('#preview-description'))
    
    let logoElement = document.querySelector('#logo-image')
    $('#logo').on('input', previewLogo)
    
    function previewLogo(event) {
        setTimeout(()=> {
            logoElement.src = $('#logo').val()
        }, 0)
    }
    
    if ($('#logo').val().length > 0) {
        previewLogo()
    }

    $("#form").on('submit', (evt) => {
        evt.preventDefault(); // avoid to execute the actual submit of the form.
        let formData = new FormData(evt.target)
        $.ajax({
            method: "PUT",
            url: `/api/clubs/${clubId}`,
            data: getJSON(formData),
        })
        .done((data) => location = `/clubs/${clubId}`)
        .fail((response) => {
            let {errors} = response.responseJSON
            console.error("Form Submission Error:", errors)
            $('#errors').html(``)
            errors.forEach(err => {
                $('#errors').append(`<div class="alert alert-danger">${err}</div>`)
            })
        })
    });

    // Social Media Input Fields
    let socialList = ["twitter", "youtube", "periscope", "instagram", "snapchat", "telegram", "whatsapp", "slack"];
    let socialIcon = ["fa fa-twitter", "fa fa-youtube", "fa fa-periscop", "fa fa-instagram", "fa fa-snapchat-square", "fa fa-telegram", "fa fa-whatsapp", "fa fa-slack"];
    for(let i = 0; i < socialList.length; i++) {
        let media = socialList[i];
        let icon = socialIcon[i];
        $('#social').append(`
            <div class="input-group" title="${media}">
                <span class="input-group-addon"><i class="${icon} social-label"></i></span>
                <input id="${media}" name="${media}" class="form-control" type="url" placeholder="${media}" value="${club[media] || ''}" autocomplete="off">
            </div>
            
        `);
    }
})()

