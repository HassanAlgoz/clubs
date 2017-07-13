$(function() {
    
    const postId = post._id
    const clubId = getId('clubs')
  
    // Format Date
    let date = new Date($('#posted').text());
    $('#posted').text( moment(date).format('MMMM Do YYYY') );

    // Markdown
    $('#content').html(converter.makeHtml(post.content));

    $('#post').text(post.title) // populate other fields



    // Managerial Buttons
    if (user && (user.role === 'president' || user.role === 'manager')) {
        $('#section1').append(`<a href="/clubs/${clubId}/posts/${postId}/edit" id="btn-edit" class="btn btn-success"><i class="glyphicon glyphicon-pencil"></i> Edit Post</a>`)
    }
})
