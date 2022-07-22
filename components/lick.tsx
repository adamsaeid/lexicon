import { usePlayerDevice, useSpotifyPlayer } from "react-spotify-web-playback-sdk";

export interface Props {
  token: string;
  name: string;
  spotifyUri: string;
  position: number;
  duration: number;
}

const Lick = ({token, name, spotifyUri, position, duration} : Props) => {
  const device = usePlayerDevice()
  const player = useSpotifyPlayer();

  const onPlay = async () => {
    player?.addListener('player_state_changed', () => {
      player.removeListener('player_state_changed');
      setTimeout(() => {
        player.pause();
      }, duration)
    });

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${device?.device_id}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [spotifyUri],
          position_ms: position,
        })
      }
    );

    player?.resume();
  };

  return(
    <div style={{ display: 'flex' }}>
      <p>{name}</p><button onClick={onPlay}>Play</button>
    </div>
  );
}

export default Lick;