$(function() {

	console.log('manage-events.js loaded')
	let clubId = getId('clubs')

	$.ajax({
		method: 'GET',
		url: `/api/clubs/${clubId}/events`,
		success: (data) => {
			console.log(data)
			let events = data.events
			console.log(events)
			for(let i = 0; i < events.length; ++i) {
				let date = moment(new Date(events[i].publishDate)).locale('en-US').format("DD/MM/YYYY")
				$('tbody').append(`
					<tr>
						<td class="col-md-1" align="center">
							<a href="/clubs/${clubId}/events/${events[i]._id}/edit" class="btn btn-default btn-edit"><em class="fa fa-pencil"></em></a>
							<a href="/clubs/${clubId}/events/${events[i]._id}" class="btn btn-default btn-edit"><em class="fa fa-eye"></em></a>
						</td>
						<td class="col-md-3">${events[i].title}</td>
						<td class="col-md-1">${date}</td>
						<td class="col-md-1">${events[i].promisers.length}</td>
						<td class="col-md-1">${translate(events[i].condition)}</td>
						<td class="col-md-3">${events[i].organizers.map(organizer => "<span>"+organizer.username+"</span>").join(" و")}</td>
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

