import Navigator from "./src/navigations/main.navigator";
import { UserContextProvider } from "./src/providers/user.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import { CommentContextProvider } from "./src/providers/comment.context";
import { PlaylistContextProvider } from "./src/providers/playlist.context";
import NotificationContextProvider from "./src/providers/notification.context";
import { ArtistContextProvider } from "./src/providers/artist.context";
import StatisticContextProvider from "./src/providers/statistic.context";

export default function App() {
  return (
    <UserContextProvider>
      <ArtistContextProvider>
        <AudioContextProvider>
          <NotificationContextProvider>
            <CommentContextProvider>
              <PlaylistContextProvider>
                <StatisticContextProvider>
                  <Navigator></Navigator>
                </StatisticContextProvider>
              </PlaylistContextProvider>
            </CommentContextProvider>
          </NotificationContextProvider>
        </AudioContextProvider>
      </ArtistContextProvider>
    </UserContextProvider>
  );
}
