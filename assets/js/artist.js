const apiKey = '02778350a1msha229d8a0a38ebb9p1b524ejsn81bdca4a05f9'
const apiHost = 'deezerdevs-deezer.p.rapidapi.com'

const artistName = 'Eminem'

const searchUrl = `https://${apiHost}/search?q=${encodeURIComponent(artistName)}`


const fetchArtistData = async () => {
    try {
        const response = await fetch(searchUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost,
            },
        })

        if (!response.ok) {
            throw new Error('Network response for artist data was not ok')
        }

        const data = await response.json();
        artistId = data.data[0].artist.id;
        urlArtist = `https://${apiHost}/artist/${artistId}`

        return fetch(urlArtist, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost,
            },
        })
    } catch (error) {
        console.error('Fetch Error:', error)
        throw error
    }
}

fetchArtistData()
    .then(response => response.json())
    .then(artistData => {
    
        const artistName = artistData.name
        const artistFans = artistData.nb_fan
       
        const artistImageURL = artistData.picture

        const artistNameElement = document.getElementById('artist-name')
        const artistFansElement = document.getElementById('artist-fans')
        const artistImageElement = document.getElementById('artist-image')

        artistNameElement.textContent = artistName
        artistFansElement.textContent = `Follower: ${artistFans}`
        artistImageElement.src = artistImageURL

        const artistId = artistData.id;
        const albumLimit = 8;
        const albumsURL = `https://${apiHost}/artist/${artistId}/albums?limit=${albumLimit}`;

        return fetch(albumsURL, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': apiHost,
            },
        });

        console.log('Dati dell\'artista:', artistData)
    })
    .catch(error => {
        console.error('Error:', error)
    })