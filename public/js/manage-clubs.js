$(function () {

    console.log('manage-clubs.js loaded')

    $.ajax({
        method: 'GET',
        url: `/api/clubs`,
        success: function (data) {
            let clubs = data.clubs;
            for(let i = 0; i < clubs.length; ++i) {
                let club = clubs[i]

                // Format Date
                let date = moment(new Date(club.date)).locale('en-US').format('MM/D/YYYY')
               
                $('tbody').append(`
                    <tr>
                        <td class="col-md-2" align="center">
                            <button class="btn btn-danger btn-delete"><em class="fa fa-trash"></em></button>
                            <a class="btn btn-default btn-edit" href="/clubs/${club._id}"><em class="fa fa-eye"></em></a>
                        </td>
                        <td class="hidden">${club._id}</td>
                        <td class="col-md-4"> ${club.name}</td>
                        <td class="col-md-1">${club.members.length}</td>
                        <td class="col-md-1">${club.events.length}</td>
                        <td class="col-md-1">${club.posts.length}</td>
                        <td class="col-md-2">${date}</td>
                        <td class="last" class="col-md-2">
                            <select name="condition">
                                <option value="unapproved">Unapproved</option>
                                <option value="approved">Approved</option>
                            </select>
                        </td>
                    </tr>
                `)
                // Set selected option to actual condition
                $(`td.last select option[value="${club.condition}"]`).attr("selected", true)

                // Change condition selection
                $('td.last select').on('change', {i: i}, (e) => {
                    let clubId = clubs[e.data.i]._id
                    $.ajax({
                        url: `/api/clubs/${clubId}/condition`,
                        method: 'PUT',
                        data: {
                            condition: e.target.value
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

                    let clubId = clubs[e.data.i]._id
                    $.ajax({
                        url: `/api/clubs/${clubId}`,
                        method: 'DELETE',
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
        },
        error: function (error) {
            console.log(error);
        }
    });

});
