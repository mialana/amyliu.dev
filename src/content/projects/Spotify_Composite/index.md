---
title: Spotify Composite
slug: Spotify_Composite
startDate: 2021-12-23
endDate: 2022-01-14
type: individual
category: personal
demoVideoLink: https://youtu.be/6VYXeNswZCE
techStack:
    - React
    - HTML
    - CSS
tags:
    - "2021"
    - "2022"
    - web
    - frontend
description: Easily blend Spotify playlists through the Spotify Developer's API using this React-based web application.
code: https://github.com/mialana/spotify-composite
---

## Summary

Spotify Composite is a frontend web application that allows users to blend multiple Spotify playlists using the Spotify Developer API. Built with React, HTML, and CSS, the tool provides an interactive interface for visualizing and merging track data across playlists. It leverages client-side authorization and API calls to fetch current user's playlists and generate new composite lists with only account login required. The project explores lightweight API integration and playlist curation in a browser environment.

## Motivation

Spotify makes it easy to follow and save playlists, but offers no built-in way to combine them. This project was created to explore how the Spotify API could be used to streamline playlist merging through a lightweight web interface.

### Achievements

1. Built a full-stack web application using React and Spotify’s Web API to enable authenticated playlist merging.
2. Implemented the OAuth 2.0 Authorization Code Flow with PKCE to securely authenticate users and access account data.
3. Developed a multi-step UI that supports playlist selection, field customization (e.g. title, visibility), and confirmation before playlist creation.
4. Integrated client-side filtering of duplicate tracks and used RESTful endpoints to fetch user profile, playlist metadata, and to create/save the final playlist.
5. Structured the application around Axios-based API calls, handling access token refresh and error states gracefully.
6. Deployed a complete working demo with reusable login via a shared Spotify developer account to comply with Spotify's API usage policies.

## Next Steps

- [ ] Add alternative “Compositify” modes that incorporate Spotify metadata such as audio features, genre classifications, and popularity scores.
- [ ] Explore new playlist generation logic that leverages track-level analytics to shape output mood, tempo, or similarity.
- [ ] Extend the UI to allow users to select among merging strategies based on musical characteristics.

## Method

The application is divided into four primary React components: `LoginPage`, `Main`, `PlaylistMenu`, and `Compositify`, located under `src/components`. Each handles a distinct phase of the playlist merging workflow and contributes to the overall single-page application structure.

![](assets/playlist_creation_preview.gif)

### Authentication (`LoginPage.js` and `Main.js`)

`LoginPage.js` initiates the OAuth 2.0 Authorization Code Flow with PKCE. It:

- Generates a code verifier and challenge using `sha256` and `base64url`.

```js
// src/components/LoginPage.js/
// function that creates the required code challenge for User Authorization Request API call
async function createCodeChallenge() {
    localStorage.setItem("code_verifier", generateRandomString(128));

    const hexDigest = sha256(localStorage.getItem("code_verifier"));
    const base64Digest = Buffer.from(hexDigest, "hex").toString("base64");
    const CODE_CHALLENGE = base64url.fromBase64(base64Digest);

    return CODE_CHALLENGE;
}
```

- Redirects users to the Spotify authorization endpoint with the appropriate query parameters.
- Stores temporary credentials in `localStorage` for token exchange on redirect.

```js
// src/components/LoginPage.js/
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = "2576cea43cb54b30809d0dd85c936e6f";
const RESPONSE_TYPE = "code";
const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/main";
const SCOPES =
    "user-read-currently-playing user-read-playback-state playlist-read-private playlist-modify-private playlist-modify-public";
const CODE_CHALLENGE_METHOD = "S256";
```

`Main.js` handles the authorization callback. It:

- Extracts the authorization `code` from the redirected URL using `useSearchParams`.
- Sends a POST request to the Spotify token endpoint to retrieve the access token.
- Stores the access token in local storage and transitions to the main playlist interface.

This two-stage flow ensures compliance with Spotify’s secure token management practices while avoiding the need for a backend server.

### Playlist Selection (`PlaylistMenu.js`)

`PlaylistMenu.js` loads once the user is authenticated and serves as the main hub for playlist curation. It:

- Sends a GET request to the Spotify `/me` and `/me/playlists` endpoints to populate the UI with the user's profile and playlists.

```js
// src/components/PlaylistMenu.js/
const [playlistsEndpoint, setPlaylistsEndpoint] = useState(
    "https://api.spotify.com/v1/me/playlists",
);
// uses axios.get to get the current user's playlists
function handleGetPlaylists() {
    axios.get(playlistsEndpoint, {
        headers: { Authorization: "Bearer " + token },
        params: { limit: 5, offset: 0 },
    });
}
```

- Maintains selection state using `useState` for both playlists and individual tracks.
- Passes control and selected data to the `Compositify` component for final playlist creation.

This component is central to the application logic, as it governs data retrieval, track filtering, and overall composition input.

### Playlist Creation (`Compositify.js`)

`Compositify.js` handles final playlist generation. It:

- Collects user input (playlist name, description, visibility settings).
- Creates a new playlist using a POST request to `/users/{user_id}/playlists`.

```js
// src/components/Compositify.js/
// called by compositifyCalled()
// axios post request to create a new playlist
// sets the playlistID so that tracks can be added
// sets the playlistURL so user can be directed via button
function createNewPlaylist() {
    // console.log(props.playlists);
    const userID = localStorage.getItem("user_id");
    const NEW_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/users/${userID}/playlists`;

    const postBody = {
        name: playlistName,
        public: isPublic,
        collaborative: collaboration,
        description: description,
    };

    axios.post(NEW_PLAYLIST_ENDPOINT, JSON.stringify(postBody), {
        headers: { Authorization: "Bearer " + token },
    });
}
```

- Sends a series of batched POST requests to `/playlists/{playlist_id}/tracks` to populate it with the selected tracks.

```js
// src/components/Compositify.js/
const ADD_TO_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

const postBody = { position: 0, uris: modifiedArray };

axios.post(ADD_TO_PLAYLIST_ENDPOINT, JSON.stringify(postBody), {
    headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
    },
});
```

- Displays the resulting playlist URL and confirmation buttons after a successful operation.

It uses local state to manage form input and feedback and ensures all necessary fields are provided before issuing requests.

### Component Relationships

- `LoginPage → Main` (triggered on login redirect)
- `Main → PlaylistMenu` (on successful token exchange)
- `PlaylistMenu → Compositify` (via import and conditional rendering)

Together, the components form a clear linear flow: login → token exchange → playlist selection → playlist creation. Axios is used consistently for all HTTP requests, and error handling is done via console logging and conditional rendering.
