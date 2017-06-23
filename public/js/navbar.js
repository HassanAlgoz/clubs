/* jshint browser:true */
$(function(){

	let url = document.URL;
	let clubName = url.split('/')[4];

	if (clubName) {
		if (clubName.charAt(clubName.length - 1) === "#") {
			clubName = clubName.substring(0, clubName.length - 1);
		}	
	}
	

	$('ul.nav li.dropdown').hover(function() {
		$(this).addClass('open');
	}, function() {
		$(this).removeClass('open');
	});

	if (clubName){
		$('#nav-home').attr('href', `/clubs/${clubName}`);
	} else {
		$('#nav-home').attr('href', `/clubs`);
	}

	$('#nav-users').attr('href', `/clubs/${clubName}/manage/users`);
	$('#nav-posts').attr('href', `/clubs/${clubName}/manage/posts`);
	$('#nav-events').attr('href', `/clubs/${clubName}/manage/events`);
	$('#nav-club').attr('href', `/clubs/${clubName}/edit`);

	$('#nav-post-posts').attr('href', `/clubs/${clubName}/posts/x/edit`);
	$('#nav-post-event').attr('href', `/clubs/${clubName}/events/x/edit`);
	$('#nav-email').attr('href', `/clubs/${clubName}/email`);

});