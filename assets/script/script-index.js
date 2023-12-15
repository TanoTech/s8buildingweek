let arrayArtisti = [
	"fedez",
	"eminem",
	"queen",
	"yuna",
	"redwimps",
	"system of a down",
	"serj tankian",
];
let randomArtist = Math.floor(Math.random() * arrayArtisti.length);
let idbuoni = [108243, 115495, 104774, 102508, 119952, 107387];
let min = 100000; //id minimo playlist
let max = 120000; //id max playlist
let urlApi = "https://deezerdevs-deezer.p.rapidapi.com/";
let copiaHome = document.createElement("div"); //variabile che copia la homepage da richiamare ogni volta che si torna indietro
let container = document.getElementById("homepage");

let containerPlaylist = document.getElementById("albumplaylist");
let containerAlbum = document.getElementById("album")
let containerSearch = document.getElementById("search")
let containerArtist = document.getElementById("artist")
let player = document.getElementById("player")
let mp3pos = document.getElementById("mp3")
let immagineP = document.getElementById("immaginePlayer")
let titoloP = document.getElementById("titoloPlayer")
let artistaP = document.getElementById("artistaPlayer")
let albumListWrapper = document.getElementById("albumListWrapper")

async function renderApi(url) {
	const response = await fetch(urlApi + url, {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": "02778350a1msha229d8a0a38ebb9p1b524ejsn81bdca4a05f9",
			"X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
		},
	});
	let data = await response.json();
	return data;
}

//popola la canzone sponsorizzata in alto
async function popolaSection() {
	let songs = await renderApi("search?q=" + arrayArtisti[randomArtist]);
	let random = Math.floor(Math.random() * songs.data.length);
	let song = songs.data[random];
	let homesponsor = document.getElementById("sponsored")
	homesponsor.innerHTML = `<img class="img-fluid "src="${song.album.cover_medium}" alt="" srcset="">
	<div class="p-3 d-flex flex-column justify-content-between ">
		<h4>ALBUM</h4>
		<h1 onclick="cercaMp3(${song.id})">${song.title}</h1>
		<h4 onclick="cercaArtista(${song.artist.id})">${song.artist.name}</h4>
		<h4>Ascolta il nuovo singolo di: ${song.artist.name}</h4>
		<div>
			<input class=" text-white bottoneSponsored " onclick="cercaMp3(${song.id})" type="button" value="Play">
			<input class=" text-white bottoneSponsored" type="button" value="Salva">
			<img src="" alt="" srcset="">
		</div>
	</div>
	
	`
	console.log(song)

	//await playlistPopola();
}

//manca la funzione che rende maiuscola la prima lettera del titolo della playlist
async function playlistPopola() {
	let cardPlaylist = document.querySelectorAll("#playlistCard>div");
	let playlist;
	console.log(cardPlaylist.length);
	for (let i = 0; i < cardPlaylist.length; i++) {
		playlist = await renderApi("playlist/" + idbuoni[i]);
		console.log(playlist)
		cardPlaylist[i].innerHTML = `
        <div><img src="${playlist.picture_small}" alt="" srcset="">
		</div>
        <p>${playlist.title}</p>`;
		cardPlaylist[i].addEventListener("click", () => caricaPlaylist(idbuoni[i]));
	}
}

//crea il Visualizza Tutto
function viewMore(i, titolo) {
	let numrandom = Math.floor(Math.random() * 4);
	if (numrandom == i) {
		numrandom = Math.floor(Math.random() * 4);
	}
	console.log(numrandom);
	let divView = document.createElement("div");
	let divView2 = document.createElement("div");
	divView = document.getElementById("playlist" + i);
	divView2 = document.getElementById("playlist" + numrandom);
	console.log(divView2);
	let container = document.getElementsByClassName("container")[0];
	svuotaHome();
	let creaH3 = document.createElement("h3");
	creaH3.innerText = titolo;
	container.append(creaH3);
	container.appendChild(divView.cloneNode(true));
	container.appendChild(divView2.cloneNode(true));
	aggiungiClickPlaylist();
	//bisogna creare il tasto indietro nella navbar che chiama la funzione homePage()
}
//salve Hoomepage in variabile e la cancella
function svuotaHome() {
	copiaHome = container.cloneNode(true);

	container.innerHTML = "";
}

//ripristina Homepage
function homePage() {
	container.innerHTML = "";
	container = copiaHome.cloneNode(true);
}
function aggiungiClickPlaylist() {
	let trovaCards = document.querySelectorAll(".card");
	trovaCards.forEach((element) => {
		let numrandom = Math.floor(Math.random() * idbuoni.length);
		console.log(numrandom);
		element.addEventListener("click", () => caricaPlaylist(idbuoni[numrandom]));
	});
}
aggiungiClickPlaylist();
popolaSection();

/*let numPlaylist = 108243;
let urlApi = "https://deezerdevs-deezer.p.rapidapi.com/";*/

async function caricaPlaylist(numPlaylist) {
	svuotaHome();
	const items = await renderApi("playlist/" + numPlaylist);
	displayTitoli(items);
	document.getElementById("albumplaylist").classList.remove("d-none");
}


function displayTitoli(items) {
	let titoliWrapper = document.getElementById("titoli");

	let playlist = items.tracks.data;

	titoliWrapper.innerHTML = ` 
   		 <div class="ms-4 mx-4">
        <img src="${items.picture_medium}" alt="">
   		 </div>
    		<div>
    		 <div>
				<h3 class="fs-5">Playlist</h3>
				<h1 class="display-2">${items.title}</h1>
			</div>
    		<div>
			<p><span>Pippo</span> - ${items.creation_date} ${items.nb_tracks
		}Brani, ${minutaggio(items.duration)}  </p>
			</div>
    		</div>
     
    		`;

	displayTracks(playlist, "playlist");
}



async function cercaAlbum(Album) {
	let titoliWrapper = document.getElementById("titoliAlbum");
	containerAlbum.classList.remove("d-none")
	containerPlaylist.classList.add("d-none")
	containerArtist.classList.add("d-none")
	const id = await renderApi("album/" + Album)
	console.log(id)
	titoliWrapper.innerHTML = ` 
   		 <div class="ms-4 mx-4">
        <img src="${id.cover_medium}" alt="">
   		 </div>
    		<div>
    		 <div>
				<h3 class="fs-5">Album</h3>
				<h1 class="display-2">${id.title}</h1>
			</div>
    		<div>
			<p><span>${id.artist.name}</span> - ${id.relase_date} _ ${id.nb_tracks
		}Brani, ${minutaggio(id.duration)}  </p>
			</div>
    		</div>
     
    		`;

	displayTracks(id, "album");
}


function displayTracks(playlist, checkType) {
	let playlistWrapper = document.getElementById("playlist");
	let albumWrapper = document.getElementById("canzoniAlbum")
	let i = 0;
	console.log(checkType)
	if (checkType == "playlist") {
		playlist.forEach((song) => {
			let numeroAscoltoRandom = Math.floor(Math.random() * 1000000) + 100000

			playlistWrapper.innerHTML += `
             <div class="row my-3">
          <div class="col-1">
          <p>${i}</p>
          </div>
		  
            <div class="col-4">
              <h3 onclick="cercaMp3(${song.id})" class="fs-5 fw-bold">${song.title}</h3>
              <h3 onclick="cercaArtista(${song.artist.id})" class="fs-6 fw-light">${song.artist.name}</h3>
            </div>
            <div class="col-3">
              <p onclick="cercaAlbum(${song.album.id})" class="h5 text-center ">${song.album.title}</p>
            </div>
            <div class="col-3">
              <p class="h5 text-center">${numeroAscoltoRandom}</p>
            </div>

            <div class="col-1">
              <p class="h5 text-center">${minutaggio(song.duration)}</p>
           </div>
    	`;
			i++
		});

	} else if (checkType == "album") {
		playlist.tracks.data.forEach(song => {
			albumWrapper.innerHTML += `

				 <div class="d-flex justify-content-between row my-3">
				 <div class="col-4">
				  <h3 onclick="cercaMp3(${song.id})" class="fs-5 fw-bold">${song.title}</h3>
				  <h3 onclick="cercaArtista(${song.artist.id})" class="fs-6 fw-light">${song.artist.name}</h3>
				</div>
				
				<div class="col-3">
				  <p class="h5 text-center">${song.id}</p>
				</div>
				
				<div class="col-1">
				  <p class="h5 text-center">${minutaggio(song.duration)}</p>
			   </div>
			   </div>
			`;

		});
	}
}
async function cercaAlbum(Album) {
	let titoliWrapper = document.getElementById("titoliAlbum");
	containerAlbum.classList.remove("d-none")
	containerPlaylist.classList.add("d-none")
	container.classList.add("d-none")

	containerArtist.classList.add("d-none")

	containerSearch.classList.add("d-none")

	const id = await renderApi("album/" + Album)
	console.log(id)
	titoliWrapper.innerHTML = ` 
   		 <div class="ms-4 mx-4">
        <img src="${id.cover_medium}" alt="">
   		 </div>
    		<div>
    		 <div>
				<h3 class="fs-5">Album</h3>
				<h1 class="display-2">${id.title}</h1>
			</div>
    		<div>
			<p><span>${id.artist.name}</span> - ${id.release_date} _ ${id.nb_tracks
		}Brani, ${minutaggio(id.duration)}  </p>
			</div>
    		</div>
     
    		`;
	console.log(id.release_date)

	displayTracks(id, "album");
}

function minutaggio(duration) {
	let ore = Math.floor(duration / 60);
	let minutiRimanenti = duration % 60;

	let risultatoFormattato =
		ore + ":" + (minutiRimanenti < 10 ? "0" : "") + minutiRimanenti;

	return risultatoFormattato;
}

function minutaggio(duration) {
	let ore = Math.floor(duration / 60);
	let minutiRimanenti = duration % 60;

	let risultatoFormattato =
		ore + ":" + (minutiRimanenti < 10 ? "0" : "") + minutiRimanenti;

	return risultatoFormattato;
}


async function cercaMp3(url) {
	const mp3 = await renderApi("track/" + url);
	if (mp3.preview == "") {
		alert("Canzone non presente nel database");
		return
	}
	mp3pos.src = mp3.preview
	console.log(mp3.title)
	immagineP.src = mp3.album.cover_small
	titoloP.innerHTML = `${mp3.title}`
	artistaP.innerHTML = `${mp3.artist.name}`
	player.load()
	player.play()
	let volumeSlider = document.getElementById('volume');
	let progressBar = document.getElementById('progressBar');
	volumeSlider.addEventListener('input', function () {
		// Imposta il volume dell'elemento audio in base al valore del range
		player.volume = parseFloat(volumeSlider.value);
	});
	player.addEventListener('timeupdate', function () {
		// Calcola il progresso in percentuale e aggiorna la barra di avanzamento
		if (isFinite(player.duration)) {
			let progress = (player.currentTime / player.duration) * 100;

			document.getElementById("inizio").innerText = parseInt(player.currentTime)
			document.getElementById("fine").innerText = parseInt(player.duration)
			progressBar.value = progress;
		}
	});
	document.getElementById("playButton").classList.remove("fa-circle-play")
	document.getElementById("playButton").classList.add("fa-circle-pause")

}
function playPause() {
	let pause = document.getElementById("playButton")

	console.log(player)
	console.log(player.paused)
	if (player.paused) {
		player.play()
		pause.classList.remove("fa-circle-play")
		pause.classList.add("fa-circle-pause")
	}
	else {
		player.pause()
		pause.classList.remove("fa-circle-pause")
		pause.classList.add("fa-circle-play")
	}
}
//questa funzione prende le tracce dell'artista cappate a 5 ^_^
async function getTopTracks(artistId) {
	try {
		const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=5`)
		const data = await response.json()
		console.log("Top Tracks Data:", data)
		return data.data
	} catch (error) {
		console.error("Errore nel recupero delle canzoni più popolari dell'artista:", error)
	}
}

//questa funzione formatta la durate delle canzoni in display nella pagina artista cosi da sembrare umane ^_^
function formatDuration(durationInSeconds) {
	const minutes = Math.floor(durationInSeconds / 60)
	const seconds = durationInSeconds % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

//questa funzione è molto bella è prende l'album dell'artista ^_^
async function getAlbumsByArtist(artistId) {
	try {
		const url = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/albums`
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Errore HTTP: ${response.status}`)
		}
		const data = await response.json()
		return data.data
	} catch (error) {
		console.error("Errore nel recupero degli album dell'artista:", error)
	}
}

//questa è la funzione che prende l'id artista e lo popola con le 5 canzoni e gli album
async function cercaArtista(id) {
	svuotaHome()
	document.getElementById("artist").classList.remove("d-none")

	container.classList.add("d-none")
	containerAlbum.classList.add("d-none")
	containerPlaylist.classList.add("d-none")
	containerSearch.classList.add("d-none")



	let randomLikes = Math.round(Math.random() * 99) + 1

	const artistData = await renderApi("artist/" + id)
	const artistName = artistData.name
	const artistFans = artistData.nb_fan
	const artistImageURL = artistData.picture
	const imageBg = artistData.picture_big

	console.log(artistData)

	const artistNameElement = document.getElementById("artist-name")
	const artistFansElement = document.getElementById("artist-fans")
	const artistImageElement = document.getElementById("artist-image")
	const userLikedSongs = document.getElementById("randomLike")
	const bgVerified = document.getElementById('verifiedArtist')

	artistNameElement.textContent = artistName;
	artistFansElement.textContent = `${artistFans} ascoltatori mensili`
	artistImageElement.src = artistImageURL;
	userLikedSongs.textContent = `Hai messo mi piace a ${randomLikes} canzoni`
	bgVerified.style.backgroundImage = `url("${imageBg}")`

	const topTracks = await getTopTracks(id)
	const topTracksElement = document.getElementById("top-tracks")

	if (topTracksElement) {
		topTracksElement.innerHTML = ""
		topTracks.forEach(track => {
			let trackElement = document.createElement("div")
			trackElement.innerHTML = `
                <div onclick="cercaMp3(${track.id})" class="track row align-items-center">
                    <div class="col-auto">
                        <img  src="${track.album.cover_small}" alt="${track.title}" class="img-fluid">
                    </div>
                    <div class="col">
                        <p onclick="cercaMp3(${track.id})">${track.title}</p>
                    </div>
                    <div class="col-auto">
                        <p>${track.rank}</p>
                    </div>
                    <div class="col-auto">
                        <p>Durata: ${formatDuration(track.duration)}</p>
                    </div>
                </div>
            `;
			topTracksElement.appendChild(trackElement);
		})
	} else {
		console.error("Elemento top-tracks non trovato nel DOM")
	}

	const albums = await getAlbumsByArtist(id)
	const albumsElement = document.getElementById("albums-container")
	if (albumsElement) {
		albumsElement.innerHTML = ""
		albums.slice(0, 4).forEach(album => {
			let albumYear = album.release_date.split("-")[0]
			let albumDiv = document.createElement("div")
			albumDiv.classList.add("col-sm-6", "col-md-4", "col-lg-3")

			albumDiv.innerHTML = `

            <div onclick="cercaAlbum(${album.id})" class="card">

                <img src="${album.cover}" class="card-img-top img-fluid" alt="${album.title}">
                <div>
                    <h5>${album.title}</h5>
                    <p>${albumYear} ${album.record_type}</p>
                </div>
            </div>
        `;
			albumsElement.appendChild(albumDiv)
		})
	} else {
		console.error("Elemento albums-container non trovato nel DOM")
	}
}

function formCerca() {
	container.classList.add("d-none")
	containerAlbum.classList.add("d-none")
	containerArtist.classList.add("d-none")
	containerPlaylist.classList.add("d-none")
	containerSearch.classList.remove("d-none")
	document.getElementById("artistForm").addEventListener("submit", async function (event) {



		event.preventDefault();
		let artistName = cleanArtistName();
		let data = await renderApi("search?q=" + artistName);
		let dataArtist = data.data[0].artist
		getArtistInfo(dataArtist, data);
		document.getElementById("artistName").value = ""
	});
}

function cleanArtistName() {
	let artistName = document.getElementById("artistName").value;
	let nameEdited = artistName.replaceAll(" ", "_").toLowerCase();
	return nameEdited;
}

function getArtistInfo(data, data2) {
	const artistNameDisplay = document.getElementById("artistNameDisplay");
	const songsList = document.getElementById("songsList");
	artistNameDisplay.innerHTML = "";
	songsList.innerHTML = "";
	albumListWrapper.innerHTML = "";

	if (data.name != undefined) {
		artistNameDisplay.innerHTML = `
  <div onclick="cercaArtista(${data.id})">
  <img class="w-25" src="${data.picture}" id="artistImage" alt="Immagine dell'artista">
  <h2>${data.name}</h2>
  <p>${data.type}</p>
  </div>
  `;
	}

	console.log(data2.data);

	let albums = [];
	let artista = data2.data[0].artist.name;

	let cap = 4;

	for (let i = 0; i < cap; i++) {
		let element = data2.data[i];



		if (artista == element.artist.name) {
			let songName = document.createElement("div");
			songName.innerHTML = `
		<div onclick="cercaMp3(${element.id})" class="mb-2  d-flex ">
		<img src="${element.album.cover_small}" alt="">
		    <div class="w-100">
		    	<p class="m-0">${element.title}</p>
			    <p class="m-0">${element.artist.name}</p>
		    </div >
		    
		  </div>`;

			songsList.appendChild(songName);
		}
	}
	let i2 = 0
	let contatore = 0
	do {

		let element2 = data2.data[i2];
		if (checkAlbum(albums, element2)) {

			albumListWrapper.innerHTML += `
		  <div onclick="cercaAlbum(${element2.album.id})" class="col">
		  <div class="card">
			<img class="card-img-top" src="${element2.album.cover_medium}" alt="Title" />
			<div class="card-body">
			  <h4 class="card-title">${element2.album.title}</h4>
			  <p class="card-text">${element2.album.type}</p>
			</div>
		  </div>
		  `;

			contatore++
		}
		i2++
	}
	while (contatore < 5)
}

function checkAlbum(albums, element) {
	if (albums.indexOf(element.album.title) < 0) {
		albums.push(element.album.title);
		return true;
	}
}