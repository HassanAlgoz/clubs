$(function () {


    const clubId = getId('clubs')

    $.ajax({
        method: 'GET',
        url: `/api/users?clubId=${clubId}`,
        success: function (data) {
            console.log(data);
            let users = data.users;
            let html = ``;
            for(let i = 0; i < users.length; ++i) {
                let user = users[i]
                let role = "unapproved";
                
                for (let i = 0; i < user.memberships.length; i++) {
                    if (String(user.memberships[i].club) === String(clubId)) {
                        role = user.memberships[i].role;
                        break;
                    }
                }

                let html = ``
                html += `
                    <tr>
                        <td align="center">
                `
                if (role !== 'president') {
                    html += `<button class="btn btn-danger btn-delete"><em class="fa fa-trash"></em></button>`
                }
                html += `
                    </td>
                    <td class="hidden-x">${user._id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.major}</td>
                    <td>${user.enrollment}</td>
                `
                console.log(user.username)
                if (role !== 'president') {
                    html += `
                        <td class="last">
                            <select name="role">
                            <option value="manager">Manager</option>
                            <option value="member">Member</option>
                            <option value="unapproved">Unapproved</option>
                            <option value="kicked">Kicked</option>
                            </select>
                        </td>
                    `
                } else {
                    html += `
                        <td>
                            <span>President</span>
                        </td>
                    `
                }
                html += `</tr>`
                $('tbody').append(html)

                if (role !== 'president') {
                    console.log(user);
                    // Set selected option to actual role
                    $(`td.last select option[value="${role}"]`).attr("selected", true)

                    // Change role selection
                    $('td.last select').on('change', {i: i}, (e) => {
                        let userId = users[e.data.i]._id
                        $.ajax({
                            url: `/api/users/${userId}?clubId=${clubId}`,
                            method: 'PUT',
                            data: {
                                role: e.target.value
                            },
                            success: () => {
                                console.log('success');
                            },
                            error: () => {
                                console.log('error');
                            }
                        });
                    })

                    
                    $($('.btn-delete')[$('.btn-delete').length - 1]).on('click', {i: i}, (e) => {

                        let userId = users[e.data.i]._id
                        $.ajax({
                            url: `/api/clubs/${clubId}/kick/${userId}`,
                            method: 'PUT',
                            success: () => {
                                console.log('success');
                            },
                            error: () => {
                                console.log('error');
                            }
                        });

                    })
                    $('td.last').removeClass('last')
                }
            }    

        },
        error: function (error) {
            console.log(error);
            html = error;
        }
    });

});
