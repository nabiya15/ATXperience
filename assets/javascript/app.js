$(document).ready(function(){

// Getting the users IP address	
/*	var ipAddress;
	var ipify='https://api.ipify.org?format=jsonp&callback=?';

	var getIP = $.getJSON( ipify, function( json ) {
		ipAddress= json.ip;
		console.log('You IP Address is:'+ ipAddress);

// Getting the users Geolocation
		var geoIp='https://freegeoip.net/json/'+ipAddress;
		console.log(geoIp);
		var lat;
		var long;
		$.ajax({
			url:geoIp,
			method:'GET',
			dataType:'json',	
		})
		.done(function(response){
			lat=response.latitude;
			long=response.longitude;
			console.log('latitude is '+lat);
			console.log('longitude is '+long);

		})*/
 

	// Click function for categories
	$(".back").on("click", function(event) {
		console.log("click worked!");
		console.log($(this).data("topic"));
		var categoryTopic=$(this).data("topic");
		location.assign("results.html?q="+encodeURI(categoryTopic));
	})

	// Click function for Search
	$("#searchBtn").on("click", function(event) {
		event.preventDefault();
		console.log(encodeURI(" "));
		var searchInput = $("#searchInput").val().trim();
		if (searchInput==='')
		{
			return;
		}
		console.log(encodeURI(searchInput));
		location.assign("results.html?q="+encodeURI(searchInput));
		$("form input").val("");
	})

})




// Passing the user's location to Google API
		/*var googleApiURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2QtFLDPl4gg-fPzzgUGpcUeiKcOAblwE&libraries=places"

			$.ajax({
				url:googleApiURL,
				method: 'GET',
				crossDomain:true,
				headers:{
					'X-Requested-With':'XMLHttpRequest'
				},
				Origin:'*',
				'Access-Control-Allow-Origin':'*'
			})
			.done(function(response){
				console.log('successful '+ response);
			})
			

		})
	})	*/

