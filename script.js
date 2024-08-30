const clientId = '749e0756e9894be89167e802e71affa8';
const clientSecret = 'f7111d776dbf47e0a15b10ddd726049e';

async function getSpotifyAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}

async function getTrackInfo(spotifyUrl, token) {
    const trackId = spotifyUrl.split('/').pop().split('?')[0];
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const trackData = await response.json();
    return {
        name: trackData.name,
        albumCover: trackData.album.images[0].url // Get the largest image
    };
}

async function loadLinks() {
    const response = await fetch('links.txt');
    const text = await response.text();
    return text.split('\n').filter(link => link.trim() !== '');
}

function createAlbumElement(link, trackInfo) {
    const albumDiv = document.createElement('div');
    albumDiv.className = 'album';
    albumDiv.innerHTML = `
        <a href="${link}" target="_blank">
            <img src="${trackInfo.albumCover}" alt="Album Cover for ${trackInfo.name}">
        </a>
        <h3>${trackInfo.name}</h3>
    `;
    return albumDiv;
}

function createAlbumElement(link, trackInfo) {
    const albumDiv = document.createElement('div');
    albumDiv.className = 'album';
    albumDiv.innerHTML = `
        <a href="${link}" target="_blank">
            <img src="${trackInfo.albumCover}" alt="Album Cover for ${trackInfo.name}">
            <div class="play-button">
                <i class="fas fa-play"></i>
            </div>
        </a>
        <h3>${trackInfo.name}</h3>
    `;
    return albumDiv;
}

async function initializeAlbums() {
    const links = await loadLinks();
    const token = await getSpotifyAccessToken();
    const albumsContainer = document.getElementById('albumsContainer');

    for (let i = 0; i < links.length && i < 9; i++) {
        try {
            const trackInfo = await getTrackInfo(links[i], token);
            const albumElement = createAlbumElement(links[i], trackInfo);
            albumsContainer.appendChild(albumElement);
        } catch (error) {
            console.error(`Error fetching info for track ${i + 1}:`, error);
        }
    }
}

window.addEventListener('load', initializeAlbums);