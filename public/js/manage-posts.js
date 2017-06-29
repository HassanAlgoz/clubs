$(function() {

    console.log('manage-posts.js loaded')
    let clubId = getId('club')

    $.ajax({
        method: 'GET',
        url: `/api/posts?clubId=${clubId}`,
        success: (data) => {
            console.log(data)
            let posts = data.posts
            console.log(posts)
            for(let i = 0; i < posts.length; ++i) {
                $('tbody').append(`
                    <tr>
                        <td align="center"><a href="/club/${clubId}/post/${posts[i]._id}/edit" class="btn btn-default btn-edit"><em class="fa fa-pencil"></em></td>
                        <td class="hidden-xs">${posts[i]._id}</td>
                        <td>${posts[i].title}</td>
                        <td>${posts[i].publishDate}</td>
                        </tr>
                    </tr>
                `)
            }
            
        },
        error: (err) => {
            console.log(err)
        }
    })

})

