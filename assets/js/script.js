let numPlaylist = 108243;
let urlApi = "https://deezerdevs-deezer.p.rapidapi.com/";

function caricaPlaylist() {
	console.log(urlApi + "playlist/" + numPlaylist);

	fetch(urlApi + "playlist/" + numPlaylist, {
		headers: {
			"X-RapidAPI-Key": "c93046165fmshe7abc1c7340997fp1b467djsn71ea54a2484d",
			"X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
		},
	})
		.then((resp) => resp.json())
		.then((items) => {
			console.log(items);
			displayTitoli(items);
		});
	// .catch((err) => console.error(err.message));
}

caricaPlaylist();

function displayTitoli(items) {
	let titoliWrapper = document.getElementById("titoli");
	let playlist = items.tracks.data;

	titoliWrapper.innerHTML = ` 
    <div class="ms-4 me-4">
        <img src="${items.picture_medium}" alt="">
    </div>
    <div>
     <div>
				<h3 class="fs-5">${items.type}</h3>
				<h1 class="display-2">${items.title}</h1>
			</div>
    <div>
			<p><span>${items.creator.name}</span> - ${items.creation_date} _ ${
		items.nb_tracks
	}, ${minutaggio(items.duration)}  </p>
		</div>
    </div>
     
    `;

	displayTracks(playlist);
}

function displayTracks(playlist) {
	let playlistWrapper = document.getElementById("playlist");

	playlist.forEach((song) => {
		const playlist = document.createElement("div");

		console.log(song);
		playlist.innerHTML = `
     <div class="row my-3">
            <div class="col-6">
              <h3 class="fs-5 fw-bold">${song.title}</h3>
              <h3 class="fs-6 fw-light">${song.artist.name}</h3>
            </div>
            <div class="col-4">
              <p class="h5">${song.id}</p>
            </div>
            <div class="col-2">
              <p class="h5">${minutaggio(song.duration)}</p>
           </div>
    `;
		playlistWrapper.appendChild(playlist);
	});
}

function minutaggio(duration) {
	let ore = Math.floor(duration / 60);
	let minutiRimanenti = duration % 60;

	let risultatoFormattato =
		ore + ":" + (minutiRimanenti < 10 ? "0" : "") + minutiRimanenti;

	return risultatoFormattato;
}
