import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import { CommentContextProvider } from "./src/providers/comment.context";
import { PlaylistContextProvider } from "./src/providers/playlist.context";
import NotificationContextProvider from "./src/providers/notification.context";
import { ArtistContextProvider } from "./src/providers/artist.context";

export default function App() {
  return (
    <AuthenticationContextProvider>
      <ArtistContextProvider>
        <AudioContextProvider>
          <NotificationContextProvider>
            <CommentContextProvider>
              <PlaylistContextProvider>
                <Navigator></Navigator>
              </PlaylistContextProvider>
            </CommentContextProvider>
          </NotificationContextProvider>
        </AudioContextProvider>
      </ArtistContextProvider>
    </AuthenticationContextProvider>
  );
}
