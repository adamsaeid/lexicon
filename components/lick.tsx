import { usePlayerDevice, useSpotifyPlayer } from "react-spotify-web-playback-sdk";

const Lick = ({token} : { token: string }) => {
  const device = usePlayerDevice()
  const player = useSpotifyPlayer();

  const onPlay = async () => {
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
          uris: ["spotify:track:6F76ic7c6au3QxG6jaso7N"],
          position_ms: 27000,
        })
      }
    );

    player?.resume();
  };

  return(
    <div>
      <button onClick={onPlay}>Play</button>
    </div>
  );
}

export default Lick;