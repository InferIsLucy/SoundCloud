import React, { useEffect, useState, createContext, useContext } from "react";
export const CommentContext = createContext();
import { firebase } from "../config/firebase";
import { AuthenticationContext } from "./authentication.context";

const commentsRef = firebase.firestore().collection("comments");
export const CommentContextProvider = ({ children }) => {
  //lấy thông tin của user để đính kèm vào comment
  const { user } = useContext(AuthenticationContext);
  const [comments, setComments] = useState([]);
  //Tạm thời set cứng songid
  const [songId, setSongId] = useState("NGWUhheMYyhxK3RJ1hMj");
  const addComment = (songId, commentContent) => {
    console.log("songId", songId);
    console.log("commentContent", commentContent);
    const newComment = {
      content: commentContent,
      songId: songId,
    };
    commentsRef
      .add(newComment)
      .then(() => {
        console.log("Comment added!");
        const newComments = [...comments, newComment];
        setComments(newComments);
      })
      .catch((err) => {
        console.log("error when add comment", err);
      });
  };
  //get song comments
  useEffect(() => {
    commentsRef
      .where("songId", "==", songId)
      .get()
      .then((querySnapshot) => {
        const newComments = [];
        querySnapshot.forEach((documentSnapshot) => {
          newComments.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setComments(newComments);
      })
      .catch((err) => {
        console.log("error when get all comments", err);
      });
    // Stop listening for updates when no longer required
    // return () => subscriber();
  }, [songId]);
  return (
    <CommentContext.Provider value={{ comments, addComment }}>
      {children}
    </CommentContext.Provider>
  );
};
