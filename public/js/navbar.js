/* jshint browser:true */
$(function(){

	console.log('navbar.js loaded')

	let clubId = getId('club')

	$('#nav-manage-users').attr('href', `/club/${clubId}/manage/users`);
	$('#nav-manage-posts').attr('href', `/club/${clubId}/manage/posts`);
	$('#nav-manage-events').attr('href', `/club/${clubId}/manage/events`);
	$('#nav-club').attr('href', `/club/${clubId}/edit`);
	$('#nav-new-post').attr('href', `/club/${clubId}/post-new`);
	$('#nav-new-event').attr('href', `/club/${clubId}/event-new`);

});