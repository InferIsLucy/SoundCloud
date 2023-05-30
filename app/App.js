import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import { CommentContextProvider } from "./src/providers/comment.context";
import FollowingItem from "./src/screens/UserProfile/components/FollowingItem.component";
import FollowingDetail from "./src/screens/UserProfile/FollowingDetail.screen";
import UserProfile from "./src/screens/UserProfile/UserProfile.screen";
import PlayerScreen from "./src/screens/MusicPlayer/Player.screen";
import PlayList from "./src/screens/MusicPlayer/PlayList.screen";
import CommentScreen from "./src/screens/commentScreen/Comment.screen";
import AuthScreen from "./src/screens/Authentication/Authentication.screen";

export default function App() {
  return (
    <AuthenticationContextProvider>
      <AudioContextProvider>
        <CommentContextProvider>
          <Navigator></Navigator>
        </CommentContextProvider>
      </AudioContextProvider>
    </AuthenticationContextProvider>
  );
}
