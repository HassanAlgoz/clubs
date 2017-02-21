$(function(){

	$.ajax({
    method: 'GET',
    url: '/api/clubs',
    dataType: 'json',
    success: function(clubs) {
    	console.log(clubs);
    	var html = ``;
    	clubs.forEach(function(club) {
    		html += `
          <h3>
            <a href="/clubs/${club.name.replace(/\s/g, '-')}">${club.name}</a>
          </h3>
        `;
      });
      $('.clubs-list').html(html);
    },
    error: function(error) {
      $('#body').html(`
        ERROR
      `); 
    }
  });

});