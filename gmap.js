//<![CDATA[
var mapa = null;
var geocoder = null;
var marker = null;
var markers = [];

// Busca una dirección a partir del texto ingresado en un textbox que tenga id='address'
// Luego llama a mostrarDir(). Que le pone un marker donde corresponde.
function searchDir(){
		direccion = window.opener.document.getElementById( "address" ).value + " " +
			( ( window.opener.document.getElementById("localidad").value ).split( "," ) )[1] +
			" buenos aires";
		mapa.addControl( new GSmallMapControl() );
		mapa.addControl( new GMapTypeControl() );
		geocoder = new GClientGeocoder();
		mostrarDir( direccion, 16 );	
}

// Pone un marker en una direccion, borra primero el existente
function mostrarDir( direccion, zoom ) {
	clearMarker();
	if (geocoder) {
		geocoder.getLatLng( direccion,
			function( point ) {
				if ( !point ) {
					alert( " NO SE ENCONTRO LA DIRECCIÓN " );
				} else {
					mapa.setCenter( point, zoom );
					var marcador = new GMarker( point );
					mapa.addOverlay(marcador);
					document.form_mapa.coordenadas.value = point.y + "," + point.x;
				}
			}
		);
	}
}

function cerrar() {
	window.opener.document.getElementById( "coordenadas" ).value = document.form_mapa.coordenadas.value;
	window.opener.document.getElementById( "ok" ).value = 1;
	window.opener.document.getElementById( "validar" ).value = "Propiedad Validada";
	window.close();
}
//]]>


function initialize() {
	var mapOptions = {
	  center: new google.maps.LatLng(-34.6051217,-58.4218648),
	  zoom: 8,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	mapa = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);
	google.maps.event.addDomListener(mapa, 'click', function(event) {
		placeMarker(event.latLng);
		document.getElementById('MarkerLat').value = event.latLng.lat();
		document.getElementById('MarkerLng').value = event.latLng.lng();
	});
	// Create the search box and link it to the UI element.
	var input = /** @type {HTMLInputElement} */(
		document.getElementById('pac-input'));
	mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	var searchBox = new google.maps.places.SearchBox(
	/** @type {HTMLInputElement} */(input));
	// Listen for the event fired when the user selects an item from the
	// pick list. Retrieve the matching places for that item.
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		var places = searchBox.getPlaces();
		clearMarker();
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++) {
			var image = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};
			// Create a marker for each place.
			marker = new google.maps.Marker({
				map: mapa,
				icon: image,
				title: place.name,
				position: place.geometry.location
			});
			bounds.extend(place.geometry.location);
		}

		mapa.fitBounds(bounds);
	});
	// Bias the SearchBox results towards places that are within the bounds of the
	// current map's viewport.
	google.maps.event.addListener(mapa, 'bounds_changed', function() {
		var bounds = mapa.getBounds();
		searchBox.setBounds(bounds);
	});
}

function setCenter2CurrentPosition(){
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			clearMarker();
			placeMarker(myLatLng);
			mapa.setCenter(myLatLng);
			mapa.setZoom(14);
		});	
	} else {
	  /* geolocation IS NOT available */
	  alert('feature NO soportado');
	}
}

// Borra el marker del mapa y deja la variable limpia para usarla como nuevo marker
function clearMarker(){
	if (marker != null){
		marker.setMap(null);
		marker = null;
	}	
}

function placeMarker(location){
	clearMarker();
	marker = new google.maps.Marker({
		position: location,
		map: mapa
	});
}

function showMarker(location){
	clearMarker();
	marker = new google.maps.Marker({
		position: location,
		map: mapa
	});
}

google.maps.event.addDomListener(window, 'load', initialize);
