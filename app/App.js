import Navigator from "./src/navigations/main.navigator";
import { AuthenticationContextProvider } from "./src/providers/authentication.context";
import { AudioContextProvider } from "./src/providers/audio.context";
import { CommentContextProvider } from "./src/providers/comment.context";

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
