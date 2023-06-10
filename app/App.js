import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import { CommentContextProvider } from "./src/providers/comment.context";
import { NotificationContextProvider } from "./src/providers/notification.context";

import PlayList from "./src/Libarary.screen";
import { PlaylistContextProvider } from "./src/providers/playlist.context";
export default function App() {
  return (
    <AuthenticationContextProvider>
      <AudioContextProvider>
        <NotificationContextProvider>
          <CommentContextProvider>
            {/* <PlaylistContextProvider> */}
            <Navigator></Navigator>
            {/* </PlaylistContextProvider> */}
          </CommentContextProvider>
        </NotificationContextProvider>
      </AudioContextProvider>
    </AuthenticationContextProvider>
  );
}
