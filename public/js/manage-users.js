$(function () {


    let clubName = $('#clubName').val().replace(/\s/g, '-');

    $.ajax({
        method: 'GET',
        url: `/api/clubs/${clubName}/users`,
        success: function (data) {

            let clubID = data.clubID;
            let users = data.users;

            console.log(data);

            let html = ``;
            users.forEach(function (user)  {

                let role = "unapproved";
                for (var i = 0; i < user.memberships.length; i++) {
                    if (String(user.memberships[i].club) === String(clubID)) {
                        role = user.memberships[i].role;
                        break;
                    }
                }

                html += `
                    <tr>
                    <td align="center">
                    `;
                if (role !== 'president') {
                    html += `<button class="btn btn-danger btn-delete"><em class="fa fa-trash"></em></button>`;
                }
                html += `
                    </td>
                    <td class="hidden-xs">${user._id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.major}</td>
                    <td>${user.enrollment}</td>
                    `;
                if (role !== 'president') {
                    html += `
                    <td class="last">
                        <select name="role">
                        <option value="manager">Manager</option>
                        <option value="member">Member</option>
                        <option value="unapproved">Unapproved</option>
                        </select>
                    </td>
                    </tr>
                    `;
                } else {
                    html += `
                    <td>
                        <span>President</span>
                    </td>
                    </tr>
                    `;
                }

                $('tbody').html(html);

                if (role !== 'president') {
                    console.log(user);
                    $('td.last select').children().each(function () {
                        if ($(this).val().toLowerCase() === role.toLowerCase()) {
                            $(this).attr('selected', 'selected');
                        }

                    });

                    $('td.last').removeClass('last');
                }


            });

            // bind events
            $('select').on('change', function () {

                var id = $(this).parent().prev().prev().prev().prev().prev().text();
                var clubName = $('#clubName').val();
                var role = $(this).val();

                $.ajax({
                    url: `/api/${clubName}/users-roles/${id}`,
                    method: 'PUT',
                    data: {
                        role: role
                    },
                    success: function () {
                        console.log('success');
                    },
                    error: function () {
                        console.log('error');
                    }
                });

            });

            $('.btn-delete').on('click', function () {

                var id = $(this).parent().next().first().text();
                var clubName = $('#clubName').val();

                $.ajax({
                    url: `/api/clubs/${clubName}/users/${id}/kick`,
                    method: 'DELETE',
                    success: function () {
                        console.log('success');
                    },
                    error: function () {
                        console.log('error');
                    }
                });

            });

        },
        error: function (error) {
            console.log(error);
            html = error;
        }
    });

});
