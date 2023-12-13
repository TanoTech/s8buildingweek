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

async function renderApi(url) {
	const response = await fetch(urlApi + url, {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": "8bcbc2b046msh3dcbb714409d7fep1e2e85jsn9003429acc6f",
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
	let h1sponsor = document.querySelector("#sponsored h1");
	let h4first = document.querySelectorAll("#sponsored h4")[0];
	let h4second = document.querySelectorAll("#sponsored h4")[1];
	h1sponsor.innerHTML = song.title;
	h4first.innerHTML = song.artist.name;
	h4second.innerHTML = "Ascolta il nuovo singolo di: " + song.artist.name;
	await playlistPopola();
}
//manca la funzione che rende maiuscola la prima lettera del titolo della playlist
async function playlistPopola() {
	let cardPlaylist = document.querySelectorAll("#playlistCard>div");
	let playlist;
	console.log(cardPlaylist.length);
	for (let i = 0; i < cardPlaylist.length; i++) {
		playlist = await renderApi("playlist/" + idbuoni[i]);
		cardPlaylist[i].innerHTML = `
        <div>`;
		for (let i2 = 0; i2 < 4; i2++) {
			let numImg = Math.floor(Math.random() * playlist.tracks.data.length);
			let immagine = playlist.tracks.data[numImg];
			cardPlaylist[
				i
			].innerHTML += `<img src="${immagine.album.cover_small}" alt="" srcset="">`;
		}
		cardPlaylist[i].innerHTML += `</div>
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

	displayTracks(playlist);
}

function displayTracks(playlist) {
	let playlistWrapper = document.getElementById("playlist");

	playlist.forEach((song) => {
		const playlist = document.createElement("div");

		console.log(song);
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
	}
	console.log(mp3.preview);
	let creaPlayer = document.createElement("div");
	creaPlayer.innerHTML = `<audio controls>
    <source id="mp3" src="${mp3.preview}" type="audio/mp3">
  </audio>`;
	container.appendChild(creaPlayer);
}
function avviaMp3() { }

async function getTopTracks(artistId) {
	try {
		const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=5`);
		const data = await response.json();
		console.log("Top Tracks Data:", data);
		return data.data;
	} catch (error) {
		console.error("Errore nel recupero delle canzoni più popolari dell'artista:", error);
	}
}

function formatDuration(durationInSeconds) {
	const minutes = Math.floor(durationInSeconds / 60);
	const seconds = durationInSeconds % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

async function cercaArtista(id) {
	svuotaHome();
	document.getElementById("albumplaylist").classList.add("d-none");
	document.getElementById("artist").classList.remove("d-none");

	let randomLikes = Math.round(Math.random() * 99) + 1;

	const artistData = await renderApi("artist/" + id);
	const artistName = artistData.name;
	const artistFans = artistData.nb_fan;
	const artistImageURL = artistData.picture;

	const artistNameElement = document.getElementById("artist-name");
	const artistFansElement = document.getElementById("artist-fans");
	const artistImageElement = document.getElementById("artist-image");
	const userLikedSongs = document.getElementById("randomLike");

	artistNameElement.textContent = artistName;
	artistFansElement.textContent = `${artistFans} ascoltatori mensili`;
	artistImageElement.src = artistImageURL;
	userLikedSongs.textContent = `Hai messo mi piace a ${randomLikes} canzoni`;

	const topTracks = await getTopTracks(id);
	const topTracksElement = document.getElementById("top-tracks");
	if (topTracksElement) {
		topTracksElement.innerHTML = "";
		topTracks.forEach(track => {
			let trackElement = document.createElement("div");
			trackElement.innerHTML = `
    <div class="track row align-items-center">
        <div class="col-auto">
            <img src="${track.album.cover_small}" alt="${track.title}" class="img-fluid">
        </div>
        <div class="col">
            <h4>${track.title}</h4>
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
		console.error("Elemento top-tracks non trovato nel DOM");
	}
}

