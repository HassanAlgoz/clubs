/* jshint browser:true */
$(function(){
	console.log('navbar.js loaded')

	let clubId = getId('clubs')

	$('#nav-manage-users').attr('href', 	`/clubs/${clubId}/manage/users`);
	$('#nav-manage-posts').attr('href', 	`/clubs/${clubId}/manage/posts`);
	$('#nav-manage-events').attr('href', 	`/clubs/${clubId}/manage/events`);
	$('#nav-new-post').attr('href', 		`/clubs/${clubId}/post-new`);
	$('#nav-new-event').attr('href', 		`/clubs/${clubId}/event-new`);
	$('#nav-edit-club').attr('href', 		`/clubs/${clubId}/edit`);
	$('#login').attr('href', 				`/auth/login?redirect=${location.href}`)

	$('#nav-manage-users').text(translate("Manage Users"))
	$('#nav-manage-posts').text(translate("Manage Posts"))
	$('#nav-manage-events').text(translate("Manage Events"))
	$('#nav-manage-clubs').text(translate("Manage Clubs"))
	$('#nav-new-post').text(translate("New Post"))
	$('#nav-new-event').text(translate("New Event"))
	$('#nav-edit-club').text(translate("Edit Club"))
	$('#nav-new-club').text(translate("Create New Club"))
	$('#nav-login').text(translate("Login"))
	$('#nav-logout').text(translate("Logout"))
	$('#nav-signup').text(translate("Signup"))
	$('#nav-profile').text(translate("Profile"))
	$('#nav-clubs').text(translate("Clubs"))
	$('#nav-home').text(translate("Home"))
	$('#nav-create').text(translate("Create"))
	$('#nav-manage').text(translate("Manage"))

	if (locale == 'ar') {
		$('#nav-other-end').addClass('navbar-left')
	} else {
		$('#nav-other-end').addClass('navbar-right')
	}
	
	
	// Home button to navigate to club page if the user is on any other page.
	// And To index page if on club page.
	if (!clubId) {
		$('#nav-home').attr('href', `/`)
	} else {
		if (location.pathname.endsWith(clubId)) {
			$('#nav-home').attr('href', `/`)
		} else {
			$('#nav-home').attr('href', `/clubs/${clubId}`)
		}
	}
	

});