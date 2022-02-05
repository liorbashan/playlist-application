import "./App.css";
import { useCallback, useEffect, useState } from "react";
import YouTube from "react-youtube";
import { globals } from "./globals.js";

const WS = new WebSocket("ws://localhost:6969");

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [hasPlaylistEnded, setHasPlaylistEnded] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState();
  const [videoData, setVideoData] = useState({ info: null, duration: null });
  const clientId = crypto.randomUUID();

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      origin: "http://localhost:3000",
      playsinline: 1,
      controls: 0,
      mute: 1,
      showinfo: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      autohide: 1,
      cc_load_policy: 0,
      fs: 0,
      allowautoplay: 1,
    },
  };

  const fetchPlaylist = () => {
    fetch(`${globals.SERVER_BASE_URL}/get-playlist`)
      .then((res) => res.json())
      .then((data) => {
        setPlaylist(data);
        if (data.length) setCurrentVideoIndex(0);
      });
  };

  const clearPlaylist = () => {
    fetch(`${globals.SERVER_BASE_URL}/reorder-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId, list: [] }),
    });
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  WS.onmessage = useCallback(
    ({ data }) => {
      console.log("WS on message");
      const parsedData = JSON.parse(data);
      if (parsedData.length === 0) {
        // List was cleared:
        setCurrentVideoIndex(undefined);
        return;
      }
      setPlaylist(parsedData);
      if (currentVideoIndex === undefined) setCurrentVideoIndex(0);
      if (hasPlaylistEnded) {
        setCurrentVideoIndex((currentVideoIndex) => currentVideoIndex + 1);
        setHasPlaylistEnded(false);
      }
    },
    [hasPlaylistEnded, currentVideoIndex]
  );

  const listItems = playlist
    .filter((vid, i) => {
      if (i >= currentVideoIndex) return true;
      return false;
    })
    .map((vid, i) => (
      <li className="listItem" key={i}>
        {vid}
      </li>
    ));

  const title = (
    <span className="videoData">
      Playing Now: {videoData?.info?.title} - Duration: {videoData?.duration} sec.
    </span>
  );

  const _onPlay = (e) => {
    setVideoData({ info: e.target.playerInfo.videoData, duration: e.target.getDuration() });
    listItems[currentVideoIndex] = videoData.title;
  };

  const _onPause = (e) => {
    console.log(e.target.playerInfo.videoData);
  };

  const _onReady = (where) => (e) => {
    console.log(`[${where}]`, " Target is", e.target);
    e.target.playVideo();
  };

  const _onEnd = (e) => {
    console.log("Video Ended", e.target);
    setVideoData({});
    const player = e.target;
    if (currentVideoIndex < playlist.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      console.log("Set video to index:", nextIndex);
      setCurrentVideoIndex(nextIndex);
      player.loadVideoById(playlist[nextIndex]);
      player.playVideo();
    } else {
      setHasPlaylistEnded(true);
    }
  };

  const _handleOnSubmit = (e) => {
    e.preventDefault();
    const songId = e.target["myInput"].value;
    e.target["myInput"].value = "";
    fetch(`${globals.SERVER_BASE_URL}/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId, songId }),
    });
  };

  return (
    <div>
      <div className="instructions">
        <h1>INSTRUCTIONS:</h1>
        <p>
          Type a YouTube ID in the text input and click Submit button to add it to the list.{" "}
          <strong>The input will except ID's and not a full URL</strong>.
          <br />
          <br />
          Here are some examples of some YouTube ID's of very short clips for testing:
          <br />
        </p>
        <ul>
          <li>TLwhqmf4Td4</li>
          <li>icPHcK_cCF4</li>
          <li>QohH89Eu5iM</li>
          <li>GCraGHx6gso</li>
          <li>9qA5kw8dcSU</li>
        </ul>
        <p>
          For Testing: Click the "Clear List" to remove all items from the playlist -{" "}
          <strong>* This will effect all subscribed clients</strong>
        </p>
      </div>
      <div className="App">
        <aside>
          <form onSubmit={_handleOnSubmit}>
            <input id="myInput" type="text" />
            <input type="submit" />
          </form>
          <ul>{!hasPlaylistEnded && listItems}</ul>
          <button type="button" onClick={clearPlaylist}>
            Clear List
          </button>
        </aside>
        <main>
          {videoData !== {} ? title : <></>}
          {currentVideoIndex !== undefined ? (
            <YouTube
              videoId={playlist[currentVideoIndex]}
              opts={opts}
              onPlay={_onPlay}
              onPause={_onPause}
              onReady={_onReady("render")}
              onEnd={_onEnd}
            />
          ) : (
            <div className="empty-player">
              <h3>Coming Soon</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
