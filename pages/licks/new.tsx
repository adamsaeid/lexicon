import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { Autocomplete, Container, Stack, TextField } from '@mui/material';
import Kitsu from 'kitsu';

import Lick from '../../components/lick';
import { useAccessToken } from '../../contexts/spotify';

const Home: NextPage = () => {
  const token = useAccessToken();

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
            <Lick lick={lick} />
            <button onClick={createLick}>Save</button>
          </>
        }
      </Stack>
    </Container>
  )
}

export default Home
