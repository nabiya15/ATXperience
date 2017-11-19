$(document).ready(function(){
	
	// Grab query parameter from URL
	var urlQueryString = location.search;
	var encodedWords = urlQueryString.split('=');
	var keywords = decodeURI(encodedWords[1]);

	if (keywords === "undefined") {
		$("#searchInput").empty();
	} else {
		$("#searchInput").val(keywords);
	};


	// Click function for Search
	$("#searchBtn").on("click", function(event) {
		event.preventDefault();
		console.log("search click worked!");
		var searchInput = $("#searchInput").val().trim();
		console.log(encodeURI(searchInput));
		location.assign("results.html?q="+encodeURI(searchInput));
	})

	// Click function for event img and title
	$(document).on("click", ".thumbnail, .event-title",function(event) {
		console.log("click worked!");
		console.log($(this).data("eventID"));
		var eventID = $(this).data("eventID");
		location.assign("event.html?q="+encodeURI(eventID));
	})


	// Pagging location to Event brite API


	function show_alert(){
		var oArgs = {
			app_key:"sxjH4rQHGzt7d3v4",
			keywords: ((keywords === "undefined") ? "" : keywords),
			where: 'austin',
			page_size:'30',
			sort_order:'popularity',
		};
		EVDB.API.call("/events/search", oArgs, function(oData) {
	      // Note: this relies on the custom toString() methods below
	      console.log(oData);
	      if (oData.events===null)
	      {
	      	var alert=$("<div>");
	      	$(alert).addClass("alert callout");
	      	$(alert).html("<p>We're sorry but the keywords you have searched do not have any results. Please try new keywords</p>")
	      	$(alert).prependTo("#googleMap");
	      	return;
	      }
	      var eventArray = oData.events.event;
	      var mapMarkers = [];
        //sorting the event array by ascending date
        eventArray.sort(function(a,b){
        	return new Date(a.start_time).getTime() - new Date(b.start_time).getTime() 
        });
        
        console.log(eventArray);

        for (var i=0 ; i < eventArray.length;  i++) {
        	
        	if (eventArray[i].image === null) {
        		var thumbnailUrl = './assets/images/ATXperience.png';
        	} else {
        		var thumbnailUrl = eventArray[i].image.medium.url;
        	};

        	if (eventArray[i].description === null || eventArray[i].description === "null" || eventArray[i].description === "" || eventArray[i].description === " ") {
        		continue;
        	};

        	var marker  = {
        		lng: eventArray[i].longitude,
        		lat: eventArray[i].latitude,
        		title: eventArray[i].title,
        		id: eventArray[i].id,
        	}

        	mapMarkers.push(marker);


        	var eventCard = $('<div>');
        	eventCard.addClass('media-object event-results');

        	var imgSection = $('<div>');
        	imgSection.addClass('media-object-section');

        	var eventImg = $('<img>');
        	eventImg.addClass('thumbnail event-img');
        	eventImg.attr('src',thumbnailUrl);
        	eventImg.data('eventID', eventArray[i].id);

        	var detailSection = $('<div>');
        	detailSection.addClass('media-object-section');

        	var eventTitleLink = $('<a>');
        	eventTitleLink.data('eventID', eventArray[i].id);
        	eventTitleLink.addClass('event-title');

        	var eventTitle=$('<h4>');
        	eventTitle.html(eventArray[i].title);

        	//set the venue details
        	var momentStartDate=moment(eventArray[i].start_time).format('dddd, MMMM Do YYYY,h:mm A');

        	var zip= eventArray[i].postal_code;
        	if(zip===null || zip==='null'){
        		zip='';
        	}else{
        		zip=' - '+ eventArray[i].postal_code;
        	}

        	var venue=$('<p>');
        	venue.html('<i> <b>Starts on:</b> '+momentStartDate+'<br><b>Venue name: </b>'+eventArray[i].venue_name+'<br><b>Location:</b> '+eventArray[i].venue_address+', '+
        		eventArray[i].city_name+'  '+eventArray[i].region_abbr+' '+zip+'</i>');

        	var eventDescription=$('<p>');
        	eventDescription.html(eventArray[i].description);

        	eventDescription.shorten({
        		"showChars" : 50,
        		"moreText"	: "<br>Read more...",
        		"lessText"	: "<br>Read less",
        	});

        	

        	imgSection.append(eventImg);
        	eventTitleLink.append(eventTitle);
        	detailSection.append(eventTitleLink);
        	detailSection.append(venue);
        	detailSection.append(eventDescription);
        	eventCard.append(imgSection);
        	eventCard.append(detailSection);
        	$('#eventList').append(eventCard);

        };

	// Google Maps
	function myMap() {
		var mapProp = {
			center:new google.maps.LatLng(30.2672,-97.7431),
			zoom: 8,
		};

		var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

		var infowindow = new google.maps.InfoWindow({
					content:{
						'title':'marker.title',
					}

				});
		for (var i = 0; i < mapMarkers.length; i++) {

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(mapMarkers[i].lat,mapMarkers[i].lng),
				map: map,
				title: mapMarkers[i].title,
				url: 'event.html?q=' + mapMarkers[i].id,
				animation:google.maps.Animation.bounce,
			});
			

			google.maps.event.addDomListener(marker, 'click', function() {
				window.location.href = this.url;
			});

		};

	};

	myMap();

	

});
}
show_alert();


})

