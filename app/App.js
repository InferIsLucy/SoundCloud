import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import { CommentContextProvider } from "./src/providers/comment.context";
import PlayList from "./src/screens/Libarary.screen";
import PlayerScreen from "./src/screens/MusicPlayer/Player.screen";
import { PlaylistContextProvider } from "./src/providers/playlist.context";
import { NotificationContextProvider } from "./src/providers/notification.context";

import PlayList from "./src/Libarary.screen";
import { PlaylistContextProvider } from "./src/providers/playlist.context";
export default function App() {
  return (
    <AuthenticationContextProvider>
      <AudioContextProvider>
        <NotificationContextProvider>
<<<<<<< HEAD
          <CommentContextProvider>
            {/* <PlaylistContextProvider> */}
            <Navigator></Navigator>
            {/* </PlaylistContextProvider> */}
          </CommentContextProvider>
=======
          <PlaylistContextProvider>
            <PlaylistContextProvider>
              <Navigator></Navigator>
            </PlaylistContextProvider>
          </PlaylistContextProvider>
>>>>>>> 5ad3dd97329d96a85833ea35d51dd6e87512fa95
        </NotificationContextProvider>
      </AudioContextProvider>
    </AuthenticationContextProvider>
  );
}
