import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import { CommentContextProvider } from "./src/providers/comment.context";
import PlayList from "./src/screens/Libarary.screen";
import PlayerScreen from "./src/screens/MusicPlayer/Player.screen";
import { PlaylistContextProvider } from "./src/providers/playlist.context";
export default function App() {
  return (
    <AuthenticationContextProvider>
      <AudioContextProvider>
        <CommentContextProvider>
          <PlaylistContextProvider>
            <Navigator></Navigator>
          </PlaylistContextProvider>
        </CommentContextProvider>
      </AudioContextProvider>
    </AuthenticationContextProvider>
  );
}
