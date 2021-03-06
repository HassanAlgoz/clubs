(async function() {
    console.log("post.js loaded")

    const clubId = getId('clubs')
    const postId = getId("posts")
    let response, json;
    try {
        response = await fetch(`/api/clubs/${clubId}/posts/${postId}`)
        if (!response.ok) {
            // redirect to homepage
            location = `/clubs/${clubId}`
            return;
        }
        json = await response.json()
    } catch(err){console.error("ERROR:", err)}
    let {post} = json

    document.title = post.title
    $('#title').text(post.title)
    document.querySelector('#image').src = post.image
    // Format Date
    let date = new Date(post.publishDate);
    $('#posted').text(`${translate("Published")} ${moment(date).format('MMMM Do YYYY')}`);
    // $('#date').text(`${moment(date).fromNow()} (${moment(date).format('Do MMMM')})`);
    // Markdown
    $('#content').html(converter.makeHtml(post.content));

    // Edit Post Button
    if (user && (user.role === 'president' || user.role === 'manager')) {
        $('#section1').append(`<a href="/clubs/${clubId}/posts/${postId}/edit" id="btn-edit" class="btn btn-success"><i class="glyphicon glyphicon-pencil"></i> Edit Post</a>`)
    }
})()
