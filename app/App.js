import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import FollowingItem from "./src/screens/UserProfile/components/FollowingItem.component";
import FollowingDetail from "./src/screens/UserProfile/FollowingDetail.screen";
import UserProfile from "./src/screens/UserProfile/UserProfile.screen";
export default function App() {
  return (
    <AuthenticationContextProvider>
      <AudioContextProvider>
        <UserProfile></UserProfile>
      </AudioContextProvider>
    </AuthenticationContextProvider>
  );
}
