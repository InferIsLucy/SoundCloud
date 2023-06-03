import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import { CommentContextProvider } from "./src/providers/comment.context";
import { useAppState } from "@react-native-community/hooks";
import BottomPlayer from "./src/screens/MusicPlayer/BottomPlayerBar.screen";
import { useEffect } from "react";
import PlayList from "./src/screens/MusicPlayer/PlayList.screen";
export default function App() {
  return (
    <AuthenticationContextProvider>
      <AudioContextProvider>
        <CommentContextProvider>
          <PlayList></PlayList>
        </CommentContextProvider>
      </AudioContextProvider>
    </AuthenticationContextProvider>
  );
}
