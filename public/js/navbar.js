/* jshint browser:true */
$(function(){

	let clubId = getId('clubs')

	$('#nav-users').attr('href', `/clubs/${clubId}/manage/users`);
	$('#nav-posts').attr('href', `/clubs/${clubId}/manage/posts`);
	$('#nav-events').attr('href', `/clubs/${clubId}/manage/events`);
	$('#nav-club').attr('href', `/clubs/${clubId}/edit`);
	$('#nav-post-posts').attr('href', `/clubs/${clubId}/post-new`);
	$('#nav-post-event').attr('href', `/clubs/${clubId}/event-new`);

});