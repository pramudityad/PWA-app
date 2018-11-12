function findLocation(x,y) {
	// console.log(x,y);
	for (var i=0; i< places.length;i++) {
		if (places[i].lokasi[0]==x &&
			places[i].lokasi[1]==y) {
			return i;
			}
		}
	return -1;
   }
function showLocation(e) {
	//console.log("you clicked " + e.latlng.lat + " dan "+ e.latlng.lng);
	let ix= findLocation(e.latlng.lat,e.latlng.lng);
	if (ix >=0) {
		img.src= places[ix].gambar;
		par.textContent=places[ix].review;
		}
   }
(async function (){
	const URL="../data/map.json";
	try {
		let resp= await(fetch(URL));
		let resp2= await resp.json();
		localStorage.setItem('places', JSON.stringify(resp2.places));//
	}
	catch(err){
	console.log(err);
	}
})( ); // <--- IIFE

let gmb= document.getElementById("gmb");
let rev= document.getElementById("review");
let img= document.createElement('img');
let par= document.createElement('p');
gmb.appendChild(img);
rev.appendChild(par);

let places = JSON.parse(localStorage.getItem('places'));
for (var p of places) {
	var marker= L.marker(p.lokasi).addTo(mymap)
	.bindPopup(p.sponsor);
	marker.on('click', showLocation);
   }