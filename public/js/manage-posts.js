$(function() {

    console.log('manage-posts.js loaded')
    let clubId = getId('clubs')

    $.ajax({
        method: 'GET',
        url: `/api/clubs/${clubId}/posts`,
        success: (data) => {
            console.log(data)
            let posts = data.posts
            console.log(posts)
            for(let i = 0; i < posts.length; ++i) {
                let date = moment(new Date(posts[i].publishDate)).locale('en-US').format('MM/D/YYYY')
                $('tbody').append(`
                    <tr>
                        <td class="col-md-1">
                            <a class="btn btn-default btn-edit" href="/clubs/${clubId}/posts/${posts[i]._id}/edit"><em class="fa fa-pencil"></em></a>
                            <a class="btn btn-default btn-edit" href="/clubs/${clubId}/posts/${posts[i]._id}"><em class="fa fa-eye"></em></a>
                        </td>
                        <td class="hidden">${posts[i]._id}</td>
                        <td class="col-md-6">${posts[i].title}</td>
                        <td class="col-md-1">${date}</td>
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

