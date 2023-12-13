document.getElementById("artistForm");
document.addEventListener("submit", async function (event) {
	event.preventDefault();
	let artistName = document.getElementById("artistName").value;
	let data = await renderApi("search?q=" + artistName);
	console.log(data.artist);
	let dataArtist = await renderApi("artist/" + artistName);
	getArtistInfo(dataArtist, data);
});

function getArtistInfo(data, data2) {
	const artistNameDisplay = document.getElementById("artistNameDisplay");
	console.log(data);

	artistNameDisplay.innerHTML = `
  <div>
  <img src="${data.picture}" id="artistImage" alt="Immagine dell'artista">
  <h2>${data.name}</h2>
  </div>
  `;

	const songsList = document.getElementById("songsList");

	console.log(data2.data);

	data2.data.forEach((song) => {
		let songName = document.createElement("div");
		songName.innerHTML = `
    <div>
        <p>${song.title}</p>
        <img src="${song.album.cover_small}" alt="">
      </div>`;

		songsList.appendChild(songName);
	});

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
