import { useState } from 'react';
import type { NextPage } from 'next';
import Cookies from 'js-cookie';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'

const Home: NextPage = () => {
  const [token, setToken] = useState(Cookies.get("spotifyAuthToken"));

  return (
    <div className='app'>
      {token ? (
        <p>{token}</p>
      ) : (
        <SpotifyAuth
          redirectUri='http://localhost:3001'
          clientID={process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}
          scopes={[Scopes.userReadPrivate, 'user-read-email', 'user-modify-playback-state']}
          onAccessToken={(token: string) => setToken(token)}
        />
      )}
    </div>
  )
}

export default Home
