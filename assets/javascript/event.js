$(document).ready(function(){
	//add results to itinerary
	var  itineraryArray=[];
	console.log(itineraryArray)
	//var LSArray=JSON.parse(localStorage.getItem("event"))||[];
	var recArray = [];
	addToLocalStorage();

	//get event id
	var eventfulURL = "http://eventful.com/events?";
	var eventfulID = (location.search).substring((location.search).indexOf("=")+1);
	var oArgs = {
		app_key:"sxjH4rQHGzt7d3v4",
		id:eventfulID
	};

	$(".icon").on("click", function(event) {	
		if ($(this).data("state") === "plus") {
			$(this).removeClass("fi-plus plus-icon");
			$(this).addClass("fi-check check-icon");
			$(this).data("state", "check");
			addToItinerary($(this).data("icon-id"));
		} else if ($(this).data("state") === "check") {
			$(this).removeClass("fi-check check-icon");
			$(this).addClass("fi-plus plus-icon");
			$(this).data("state", "plus");
			var itiRemoveData=$(this).data("icon-id");
			removeFromItinerary(itiRemoveData);
		}
	})

	$("#itineraryModal").on("click",".fi-minus",function(event){	
		//delete the item from the itineraryArray
		var itemIndex = itineraryArray.indexOf($(this).attr("data-id"));
		itineraryArray.splice(itemIndex, 1);
		// delete the itm from the modal
		var targetRow=$(this).parent();
		targetRow.remove();
		//revert the check and plus symbols on main page(ie. outside the modal)
		itiRemoveData=$("#add-event").data("icon-id");
		//$("#add-event").data("state","check");
		var itival = $(this).attr("data-id");
		if(itival===($("#add-event").data("icon-id"))){
			$("#add-event").removeClass("fi-check success");
			$("#add-event").addClass("fi-plus primary");
			$("#add-event").data("state", "plus");
		}
		if(itival === $(".icon").data("icon-id")){
			var resetCheck= $(".check-icon").data("icon-id");
			//resetCheck.removeClass("fi-check plus-icon");
			resetCheck.addClass("fi-plus");
			resetCheck.data("state", "plus");
		
			
		}
			console.log("Itival: "+itival);
			console.log('resetCheck: '+resetCheck)
		//removeFromItinerary(itiRemoveData);
		//update the local storage
		localStorage.setItem("event", JSON.stringify(itineraryArray));
	});

	$("#add-event").on("click", function(event) {
		if ($(this).data("state") === "plus") {
			$(this).removeClass("fi-plus");
			$(this).addClass("fi-check success successBtn");
			$(this).data("state", "check");
			var itiData= $(this).data("icon-id");
			addToItinerary(itiData);
			
		} else if ($(this).data("state") === "check") {
			$(this).removeClass("fi-check success successBtn");
			$(this).addClass("fi-plus primary");
			$(this).data("state", "plus");
			var itiRemoveData=$(this).data("icon-id");
			removeFromItinerary(itiRemoveData);	
			
		} 
	})
	
     // createArray(itineraryArray[i]);
     function addToLocalStorage(item){
     	/*if (LSArray.indexOf(item) > -1) {
     		console.log("already added");
     	}else{*/
     		
	 		LSArray= JSON.parse(localStorage.event);
	 		 $.each(LSArray, function(index, item) {
	 		 	addToItinerary(item);
	 		 })
     	//}
     }

     function addToItinerary(item) {
     	
     	if (itineraryArray.indexOf(item) > -1) {
     		console.log("already added");

     	}else{		
	 		itineraryArray.push(item);		
			localStorage.setItem("event", JSON.stringify(itineraryArray));
					var createRow = $("<tr>")
					var removeIcon = $("<td>").attr({"class":"fi-minus icon","data-state":"minus","data-id":item});
					var newItem = $("<td>").attr("data-id",item).text(item);
					var newInputBox = $("<input>").attr("type", "time");
					//var newTime = $("<td>").attr("data-id", item).append(newInputBox);
					var newRow = createRow.append(removeIcon).append(newItem).attr("data-id", item);
					$("#itineraryTable").append(newRow);
				
				}
			}	

		function removeFromItinerary(item) {

			var itemIndex = itineraryArray.indexOf(item);
			itineraryArray.splice(itemIndex, 1);
			$('#itineraryTable tr[data-id="' + item + '"]').remove();
			localStorage.setItem("event", JSON.stringify(itineraryArray));
			console.log(JSON.parse(localStorage.event));
		}


	//send the eventful api the id
	EVDB.API.call("/events/get", oArgs, function(oData) {
		//populate the event page
		var eventTime = oData.start_time;
		var formattedDate = moment(eventTime).format("MMMM Do YYYY, h:mm a");
		var formattedDateForSearch = moment(eventTime).format("YYYYMMDD00");

		$("#event-title").text(oData.title);
		$("#event-date").text(formattedDate);
		$("#event-venue").text(oData.venue_name);
		$("#event-address").text(oData.address);
		$("#event-URL").attr("href", oData.url);
		$("#event-description").html(oData.description);
		$("#add-event").data("icon-id", oData.title);
		//get the longituide & lattitude
		var lat=oData.latitude;
		var long=oData.longitude;
		console.log(lat);
		console.log(long);


		//call the zomato api
		$.ajax({
			method: "GET",
			url:"https://developers.zomato.com/api/v2.1/search?apikey=d05924ed72ee85e73cf712157d5cd73c&count=6&lat="+lat+"&lon="+long+"&sort=rating",
		}).done(function(results){
			console.log(results);
			var eateries=results.restaurants; 
			//populate the eats catagory
			for (var i = 0; i < eateries.length; i++) {
				recArray.push(eateries[i].restaurant.name);
				$("#food-rec-name"+i).text(eateries[i].restaurant.name);
				$("#food-rec-image"+i).attr("src", eateries[i].restaurant.featured_image).attr("target", "_blank");
				$("#food-rec-rating"+i).text((eateries[i].restaurant.user_rating.aggregate_rating)+"/5.0");
				$("#food-rec-URL"+i).attr("href", eateries[i].restaurant.url);
				$("#food-rec-category"+i).text(eateries[i].restaurant.cuisines);
				$("#food-rec-cost"+i).text("Cost for Two: $"+eateries[i].restaurant.average_cost_for_two);
				$("#food-rec-location"+i).text(eateries[i].restaurant.location.address);
				$("#food-rec-icon"+i).data("icon-id", eateries[i].restaurant.name);
			}

		});

		$.ajax({
			method: "GET",
			url:"https://developers.zomato.com/api/v2.1/search?apikey=d05924ed72ee85e73cf712157d5cd73c&count=6&q=pubs&bars&cuisines=drinks&lat="+lat+"&lon="+long+"&sort=rating&order=desc",
		}).done(function(results){
			console.log(results);
			var clubs=results.restaurants; 
			//populate the eats catagory
			for (var i = 0; i < clubs.length; i++) {
				recArray.push(clubs[i].restaurant.name);
				$("#post-rec-name"+i).text(clubs[i].restaurant.name);
				$("#post-rec-image"+i).attr("src", clubs[i].restaurant.featured_image).attr("target", "_blank");
				$("#post-rec-rating"+i).text((clubs[i].restaurant.user_rating.aggregate_rating)+"/5.0");
				$("#post-rec-URL"+i).attr("href", clubs[i].restaurant.url);
				$("#post-rec-category"+i).text(clubs[i].restaurant.cuisines);
				$("#post-rec-cost"+i).text("Cost for Two: $"+clubs[i].restaurant.average_cost_for_two);
				$("#post-rec-location"+i).text(clubs[i].restaurant.location.address);
				$("#post-rec-icon"+i).data("icon-id", clubs[i].restaurant.name);
			}

		});


		var newArgs = {
			app_key:"sxjH4rQHGzt7d3v4",
			where: 'austin',
			date: formattedDateForSearch + "-" + formattedDateForSearch,
			page_size:'6',
		};

		EVDB.API.call("/events/search", newArgs, function(newData) {
			var eventArray = newData.events.event;
			console.log(eventArray);
			for (var i = 0; i < eventArray.length; i++) {

				if (eventArray[i].image === null) {
					var thumbnailUrl = './assets/images/ATXperience.png';
				} else {
					var thumbnailUrl = eventArray[i].image.medium.url;
				};

				$("#pre-rec-name"+i).text(eventArray[i].title);
				$("#pre-rec-image"+i).attr("src", thumbnailUrl);
				$("#pre-rec-URL"+i).attr("href", "./event.html?q=" + eventArray[i].id);
				$("#pre-rec-location"+i).text(eventArray[i].venue_address);
				$("#pre-rec-icon"+i).data("icon-id", eventArray[i].title);

			}

		});



	});

});
