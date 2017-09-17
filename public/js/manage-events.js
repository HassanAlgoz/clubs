$(function() {

	console.log('manage-events.js loaded')
	let clubId = getId('clubs')

	$.ajax({
		method: 'GET',
		url: `/api/events?clubId=${clubId}`,
		success: (data) => {
			console.log(data)
			let events = data.events
			console.log(events)
			for(let i = 0; i < events.length; ++i) {
				$('tbody').append(`
					<tr>
						<td align="center"><a href="/clubs/${clubId}/events/${events[i]._id}/edit" class="btn btn-default btn-edit"><em class="fa fa-pencil"></em></td>
						<td>${events[i].title}</td>
						<td>${events[i].publishDate}</td>
						<td align="center">${events[i].promisers.length}</td>
						<td align="center">${events[i].condition}</td>
						<td align="center">${events[i].organizers.map(organizer => "<span>"+organizer.username+"</span>").join(", ")}</td>
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

