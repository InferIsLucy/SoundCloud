import React, { useEffect, useState, createContext } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebase } from "../config/firebase";
import * as SecureStore from "expo-secure-store";

export const AuthenticationContext = createContext();

const USER_ID = "userId";
const imageStorage = firebase.storage().ref("images");
const usersRef = firebase.firestore().collection("users");
export const AuthenticationContextProvider = ({ children }) => {
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingLoggedin, setIsCheckingLoggedIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  // console.log("userObject", user);
  const createUser = async (user) => {
    await usersRef
      .add(user)
      .then(() => {
        console.log("user created!");
      })
      .catch((err) => {
        console.log("error when add comment", err);
        throw err;
      });
  };
  const getUserFromDb = async (userId) => {
    await usersRef
      .where("userId", "==", userId)
      .get()
      .then((querySnapshot) => {
        const user = querySnapshot.docs[0].data();
        console.log("user", user);
        setUser(user);
      })
      .catch((err) => {
        console.log("error when get user", err);
        throw err;
      });
  };
  const saveUserId = async (userId) => {
    try {
      const id = JSON.stringify(userId);
      await SecureStore.setItemAsync(USER_ID, id);
    } catch (err) {
      console.log("err", err);
    }
  };

  //check if user logged in
  useEffect(() => {
    // logout();
    getUserIdFromStorage();
  }, []);
  const getUserIdFromStorage = async () => {
    setIsCheckingLoggedIn(true);
    setIsLoading(true);
    try {
      const userId = await SecureStore.getItemAsync(USER_ID);
      if (userId) {
        const data = JSON.parse(userId);
        await getUserFromDb(data);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
      setIsCheckingLoggedIn(false);
    } catch (err) {
      console.log("err", err);
      setIsCheckingLoggedIn(false);
      setIsLoading(false);
    }
  };
  const updateUserInfor = async (newUserInfor) => {
    const { avatar } = newUserInfor;

    const response = await fetch(avatar); // URL hợp lệ hoặc đường dẫn tệp tin cục bộ
    const blob = await response.blob();
    const filename = avatar.substring(avatar.lastIndexOf("/") + 1);

    setIsLoading(true);
    const uploadTask = imageStorage.child(filename).put(blob); // Upload file
    try {
      await uploadTask;

      console.log("upload user avatar successfully");
      const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
      // Cập nhật trường "avatar" của user với URL mới
      await usersRef
        .where("userId", "==", user.userId)
        .get()
        .then((querySnapshot) => {
          const user = querySnapshot.docs[0];
          return user.ref.update({ avatar: downloadURL });
        })
        .then(() => {
          console.log("Avatar URL updated successfully");
          const updatedUser = { ...user, avatar: downloadURL };
          setUser(updatedUser);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("Error when updating avatar URL:", err);
          setIsLoading(false);
        });
      setIsLoading(false);
    } catch (error) {
      console.log("Error when uploading avatar:", error);
      setIsLoading(false);
    }
  };
  const onLoginWithEmail = (email, password) => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const firebaseUser = userCredentials.user;
        console.log("Sign in succeeded", firebaseUser);
        saveUserId(firebaseUser.uid);
        return getUserFromDb(firebaseUser.uid);
      })
      .then(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError("Thông tin đăng nhập không chính xác!");
        console.log("Error when sign in with email", error);
        setIsLoading(false);
      });
  };
  const createUserWithEmail = async (userInfor) => {
    setIsLoading(true);
    await createUserWithEmailAndPassword(
      auth,
      userInfor.email,
      userInfor.password
    )
      .then((userCredentials) => {
        const firebaseUser = userCredentials.user;
        const newUser = {
          userId: firebaseUser.uid,
          email: userInfor.email,
          displayName: userInfor.displayName,
          avatar: "",
        };
        return newUser;
      })
      .then((newUser) => {
        createUser(newUser);
      })
      .then(() => {
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError("Tạo tài khoản không thành công");
        console.log("Error when sign up with email", error);
        setIsLoading(false);
      });
  };
  const deleteUserExpoPushToken = () => {
    usersRef
      .where("userId", "==", user.userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          usersRef
            .doc(doc.id)
            .update({
              expoNotifyToken: null,
            })
            .then(() => {
              console.log("User updated!");
            })
            .catch((err) => {
              console.log("Error while updating user information:", err);
            });
        });
      })
      .catch((err) => {
        console.log("Error while querying users:", err);
      });
  };
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(USER_ID);
      const id = await SecureStore.getItemAsync(USER_ID);
      deleteUserExpoPushToken();
      signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      console.log("Sign out failed", err);
    }
  };
  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        error,
        auth,
        isCheckingLoggedin,
        setError,
        sendPasswordResetEmail,
        createUserWithEmail,
        updateUserInfor,
        onLoginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
