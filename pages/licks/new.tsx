import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { Autocomplete, Container, Stack, TextField } from '@mui/material';
import Cookies from 'js-cookie';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import 'react-spotify-auth/dist/index.css'
import { WebPlaybackSDK } from 'react-spotify-web-playback-sdk';
import Kitsu from 'kitsu';

import Lick from '../../components/lick';

const Home: NextPage = () => {
  const [token, setToken] = useState(Cookies.get('spotifyAuthToken'));
  const getToken = useCallback((callback: any) => callback(token), [token]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [name, setName] = useState<string>('');
  const [spotifyUri, setSpotifyUri] = useState<string>('');
  const [position, setPosition] = useState<string>('0');
  const [duration, setDuration] = useState<string>('');

  const router = useRouter();

  const lick={
    name,
    'spotify-uri': spotifyUri,
    position: parseInt(position),
    duration: parseInt(duration)
  }

  const createLick = async () => {
    await api.create('licks', {
      name,
      'spotify-uri': spotifyUri,
      position,
      duration
    })

    router.push('/')
  };

  useEffect(() => {
    if(!searchQuery) {
      setSearchResults([]);
    } else {
      search();
    }
  }, [searchQuery]);

  const onQueryChange = (event: any, value: any) => {
    if(value) {
      setSearchQuery(value)
    }
  };

  const onSelectResult = (event: any, value: any) => {
    setSearchQuery("");
    setSpotifyUri(value?.uri);
  }

  const search = async () => {
    const searchResp = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${searchQuery}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    const results = await searchResp.json();

    const newOptions = results.tracks.items.map((track: any) => {
      const artists = track.artists.map((artist: any) => artist.name).join(", ")
      return {
        label: `${track.name} - ${artists}`,
        uri: track.uri,
      }
    });

    setSearchResults(newOptions)
  }
  
  const api = new Kitsu({
    baseURL: process.env.NEXT_PUBLIC_API_HOST
  })
  
  return (
    /* types provided by package are incorrect */
    /* @ts-ignore */
    <WebPlaybackSDK
      initialDeviceName='lexicon'
      getOAuthToken={getToken}
      connectOnInitialized={true}
    >
      <Container 
        className='app'
        maxWidth='xs'
        >
        <Stack spacing={2} alignItems='center'>
          <h1>New lick</h1>
          <Autocomplete
            options={searchResults}
            filterOptions={(x) => x} 
            inputValue={searchQuery}
            onChange={onSelectResult}
            onInputChange={onQueryChange}
            renderInput={(params) => {
              return (
                <TextField 
                  {...params}
                  id='search'
                  label='Search'
                  variant='outlined'
                />
              );
            }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.uri}>
                  {option.label}
                </li>
              );
            }}
            fullWidth
            selectOnFocus
            clearOnBlur
          />

          {spotifyUri && 
            <>
              <TextField
                id='name'
                label='Name'
                variant='outlined'
                onChange={(event) => setName(event.target.value)}
                fullWidth
              />
              <TextField
                id='position'
                label='Position'
                variant='outlined'
                onChange={(event) => setPosition(event.target.value)}
                fullWidth
              />
              <TextField
                id='duration'
                label='Duration'
                variant='outlined'
                onChange={(event) => setDuration(event.target.value)}
                fullWidth
              />
              <Lick token={token} lick={lick} />
              <button onClick={createLick}>Save</button>
            </>
          }
          
          <SpotifyAuth
            redirectUri={`${process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI}/licks/new`}
            clientID={process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}
            scopes={[Scopes.userReadPrivate, 'user-read-email', 'user-modify-playback-state', 'streaming']}
            onAccessToken={(token: string) => setToken(token)}
          />
        </Stack>
      </Container>
    </WebPlaybackSDK>
  )
}

export default Home
