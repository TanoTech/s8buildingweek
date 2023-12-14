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
let containerAlbum=document.getElementById("album")
let containerPlaylist = document.getElementById("albumplaylist");
let containerArtist = document.getElementById("artist")

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
	homesponsor.innerHTML=`<h1 onclick="cercaMp3(${song.id})">${song.title}</h1>
	<h4 onclick="cercaArtista(${song.artist.id})">${song.artist.name}</h4>
	<h4>Ascolta il nuovo singolo di: ${song.artist.name}</h4>
	<input onclick="cercaMp3(${song.id})" type="button" value="PLAY">
	<input type="button" value="SALVA">
	<img class='img-fluid' src="${song.album.cover_medium}" alt="${song.album}" srcset="">
	`
	await playlistPopola();
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
				<h3 class="fs-5">${items.type}</h3>
				<h1 class="display-2">${items.title}</h1>
			</div>
    <div>
			<p><span>${items.creator.name}</span> - ${items.creation_date} _ ${items.nb_tracks
		}, ${minutaggio(items.duration)}  </p>
		</div>
    </div>
     
    `;

	displayTracks(playlist, 'playlist');
}

async function cercaAlbum(Album){
	let titoliWrapper = document.getElementById("titoliAlbum");
	containerAlbum.classList.remove("d-none")
	containerPlaylist.classList.add("d-none")
	containerArtist.classList.add("d-none")
		const id= await renderApi("album/"+Album)
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

		displayTracks(id,"album");
}


function displayTracks(playlist,checkType) {
	let playlistWrapper = document.getElementById("playlist");
	let albumWrapper=document.getElementById("canzoniAlbum")
	console.log(checkType)
	if(checkType=="playlist")
	{
	playlist.forEach((song) => {
		const playlist = document.createElement("div");
		playlist.innerHTML = `
     		<div class="row my-3">
            <div class="col-4">
              <h3 onclick="cercaMp3(${song.id})" class="fs-5 fw-bold">${song.title
			}</h3>
              <h3 onclick="cercaArtista(${song.artist.id
			})" class="fs-6 fw-light">${song.artist.name}</h3>
            </div>
            <div class="col-4">
              <p onclick="cercaAlbum(${song.album.id
			})" class="h5 text-center ">${song.album.title}</p>
            </div>
            <div class="col-3">
              <p class="h5 text-center">${song.id}</p>
            </div>
            
            <div class="col-1">
              <p class="h5 text-center">${minutaggio(song.duration)}</p>
           </div>
    	`;
		playlistWrapper.appendChild(playlist);
	});
	}else if(checkType=="album"){
		playlist.tracks.data.forEach(song => {
			const playlist = document.createElement("div");
			playlist.innerHTML = `
				 <div class="row my-3">
				<div class="col-4">
				  <h3 onclick="cercaMp3(${song.id})" class="fs-5 fw-bold">${song.title
				}</h3>
				  <h3 onclick="cercaArtista(${song.artist.id
				})" class="fs-6 fw-light">${song.artist.name}</h3>
				</div>
				
				<div class="col-3">
				  <p class="h5 text-center">${song.id}</p>
				</div>
				
				<div class="col-1">
				  <p class="h5 text-center">${minutaggio(song.duration)}</p>
			   </div>
			`;
			albumWrapper.appendChild(playlist);
		});
	}
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

let player=document.getElementById("player")
let mp3pos=document.getElementById("mp3")
let immagineP=document.getElementById("immaginePlayer")
let titoloP=document.getElementById("titoloPlayer")
let artistaP=document.getElementById("artistaPlayer")

async function cercaMp3(url) {
	const mp3 = await renderApi("track/" + url);
	if (mp3.preview == "") {
		alert("Canzone non presente nel database");
		return
	}
	mp3pos.src=mp3.preview
	console.log(mp3.title)
	immagineP.src=mp3.album.cover_small
	titoloP.innerHTML=`${mp3.title}`
	artistaP.innerHTML=`${mp3.artist.name}`
	player.load()
	player.play()
    let volumeSlider = document.getElementById('volume');
	let progressBar = document.getElementById('progressBar');
	volumeSlider.addEventListener('input', function() {
		// Imposta il volume dell'elemento audio in base al valore del range
		player.volume = parseFloat(volumeSlider.value);
	});
	player.addEventListener('timeupdate', function() {
		// Calcola il progresso in percentuale e aggiorna la barra di avanzamento
		if(isFinite(player.duration)){
		let progress = (player.currentTime / player.duration) * 100;

		document.getElementById("inizio").innerText=parseInt(player.currentTime)
		document.getElementById("fine").innerText=parseInt(player.duration)
		progressBar.value = progress;
		}
	});
	document.getElementById("playButton").classList.remove("fa-circle-play")
	document.getElementById("playButton").classList.add("fa-circle-pause")
}

function playPause(){
	let pause=document.getElementById("playButton")
	console.log(player)
	console.log(player.paused)
	if(player.paused)
	{
		player.play()
		pause.classList.remove("fa-circle-play")
		pause.classList.add("fa-circle-pause")
	}
	else{
		player.pause()
		pause.classList.remove("fa-circle-pause")
		pause.classList.add("fa-circle-play")
	}
}

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

function formatDuration(durationInSeconds) {
	const minutes = Math.floor(durationInSeconds / 60)
	const seconds = durationInSeconds % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

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

async function cercaArtista(id) {
	svuotaHome()
	document.getElementById("albumplaylist").classList.add("d-none")
	document.getElementById("artist").classList.remove("d-none")
	containerAlbum.classList.add('d-none')

	let randomLikes = Math.round(Math.random() * 99) + 1

	const artistData = await renderApi("artist/" + id)
	const artistName = artistData.name
	const artistFans = artistData.nb_fan
	const artistImageURL = artistData.picture
	const imageBg = artistData.picture

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
	bgVerified.style.backgroundColor = 'rgba(0, 0, 0, 1.5)'

	const topTracks = await getTopTracks(id)
	const topTracksElement = document.getElementById("top-tracks")

	if (topTracksElement) {
		topTracksElement.innerHTML = ""
		topTracks.forEach(track => {
			let trackElement = document.createElement("div")
			trackElement.innerHTML = `
                <div class="track row align-items-center">
                    <div class="col-auto">
                        <img src="${track.album.cover_small}" alt="${track.title}" class="img-fluid">
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
		});
	} else {
		console.error("Elemento top-tracks non trovato nel DOM")
	}

	const albums = await getAlbumsByArtist(id)
	const albumsElement = document.getElementById("albums-container")
	if (albumsElement) {
		albumsElement.innerHTML = ""
		albums.slice(0, 8).forEach(album => {
			let albumYear = album.release_date.split("-")[0]
			let albumDiv = document.createElement("div")
			albumDiv.classList.add("col-sm-6", "col-md-4", "col-lg-2")

			albumDiv.innerHTML = `
            <div onclick="cercaAlbum(${album.id})" class='albumCover'>
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