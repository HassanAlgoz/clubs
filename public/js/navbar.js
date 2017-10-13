/* jshint browser:true */
$(function(){
	console.log('navbar.js loaded')

	let clubId = getId('clubs')

	$('#nav-manage-users').attr('href', 	`/clubs/${clubId}/manage/users`);
	$('#nav-manage-posts').attr('href', 	`/clubs/${clubId}/manage/posts`);
	$('#nav-manage-events').attr('href', 	`/clubs/${clubId}/manage/events`);
	$('#nav-club').attr('href', 			`/clubs/${clubId}/edit`);
	$('#nav-new-post').attr('href', 		`/clubs/${clubId}/post-new`);
	$('#nav-new-event').attr('href', 		`/clubs/${clubId}/event-new`);
	$('#nav-edit-club').attr('href', 		`/clubs/${clubId}/edit`);
	$('#login').attr('href', 				`/auth/login?redirect=${location.href}`)
	
	// Home button to navigate to club page if the user is on any other page.
	// And To index page if on club page.
	if (!clubId) {
		$('#home').attr('href', `/`)
	} else {
		if (location.pathname.endsWith(clubId)) {
			$('#home').attr('href', `/`)
		} else {
			$('#home').attr('href', `/clubs/${clubId}`)
		}
	}
	

});