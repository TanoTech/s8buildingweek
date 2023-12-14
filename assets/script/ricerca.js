document.getElementById("artistForm");
document.addEventListener("submit", async function (event) {
	event.preventDefault();
	let artistName = document.getElementById("artistName").value;
	let data = await renderApi("search?q=" + artistName);
	let dataArtist = await renderApi("artist/" + artistName);
	getArtistInfo(dataArtist, data, artistName);
});

function getArtistInfo(data, data2, data3) {
	const artistNameDisplay = document.getElementById("artistNameDisplay");
	const songsList = document.getElementById("songsList");
	artistNameDisplay.innerHTML = "";
	songsList.innerHTML = "";
	albumListWrapper.innerHTML = "";

	console.log(data);
	if (data.name != undefined) {
		artistNameDisplay.innerHTML = `
  <div>
  <img src="${data.picture}" id="artistImage" alt="Immagine dell'artista">
  <h2>${data.name}</h2>
  </div>
  `;
	}

	console.log(data2.data);

	let album = "";
	let artista = data2.data[0].artist.name;

	for (let i = 0; i < data2.data.length; i++) {
		const element = data2.data[i];

		console.log(element.album.title);

		if (album != element.album.title) {
			album = data2.data[0].album.title;
			let albumList = document.createElement("div");
			albumList.innerHTML = `
		<div>
		    <p>${element.album.title}</p>
        <p>${element.album.type}</p>
		    <img src="${element.album.cover_small}" alt="">
		  </div>`;

			albumListWrapper.appendChild(albumList);
		}

		if (artista == element.artist.name) {
			let songName = document.createElement("div");
			songName.innerHTML = `
		<div>
		    <p>${element.title}</p>
        <p>${element.type}</p>
		    <img src="${element.album.cover_small}" alt="">
		  </div>`;

			songsList.appendChild(songName);
		}
	}
	document.getElementById("artistInfo").style.display = "block";
}

async function renderApi(url) {
	let urlApi = "https://deezerdevs-deezer.p.rapidapi.com/";
	const response = await fetch(urlApi + url, {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": "c93046165fmshe7abc1c7340997fp1b467djsn71ea54a2484d",
			"X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
		},
	});
	let data = await response.json();
	return data;
}