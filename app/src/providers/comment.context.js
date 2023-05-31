import React, { useEffect, useState, createContext, useContext } from "react";
export const CommentContext = createContext();
import { firebase } from "../config/firebase";
import { AuthenticationContext } from "./authentication.context";

const commentsRef = firebase.firestore().collection("comments");
export const CommentContextProvider = ({ children }) => {
  //lấy thông tin của user để đính kèm vào comment
  const { user } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const addComment = async (songId, commentContent) => {
    setIsLoading(true);
    const newComment = {
      content: commentContent,
      songId: songId,
      userId: user.userId,
      userName: user.displayName,
      userAvatar: user.avatar,
      createdAt: Date.now(),
    };
    await commentsRef
      .add(newComment)
      .then(() => {
        console.log("Comment added!");
      })
      .catch((err) => {
        console.log("error when add comment", err);
      })
      .finally(() => setIsLoading(false));
  };
  const loadComments = async (songId, setComments) => {
    setIsLoading(true);
    await commentsRef
      .where("songId", "==", songId)

      .get()
      .then((querySnapshot) => {
        const newComments = [];
        querySnapshot.forEach((documentSnapshot) => {
          newComments.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
            createdAt: new Date(documentSnapshot.data().createdAt),
          });
        });
        newComments.sort((a, b) => a.createdAt - b.createdAt);
        setComments(newComments);
      })
      .catch((err) => {
        console.log("error when get all comments", err);
        setComments([]);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <CommentContext.Provider value={{ isLoading, loadComments, addComment }}>
      {children}
    </CommentContext.Provider>
  );
};
