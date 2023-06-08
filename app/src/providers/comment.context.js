import React, { useEffect, useState, createContext, useContext } from "react";
import { firebase } from "../config/firebase";
import { AuthenticationContext } from "./authentication.context";
import { NotificationContext } from "./notification.context";
export const CommentContext = createContext();

const commentsRef = firebase.firestore().collection("comments");
const usersRef = firebase.firestore().collection("users");
export const CommentContextProvider = ({ children }) => {
  //lấy thông tin của user để đính kèm vào comment
  const { user } = useContext(AuthenticationContext);
  const { sendNotification } = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);
  const addComment = async (songId, commentContent, replyCommentId = null) => {
    const newComment = {
      content: commentContent,
      songId: songId,
      userId: user.userId,
      userName: user.displayName,
      userAvatar: user.avatar,
      createdAt: Date.now(),
      replyToId: replyCommentId,
    };
    try {
      const docRef = await commentsRef.add(newComment);
      console.log("Comment added!");
      sendNotificationToReplyCommentOwner(replyCommentId, commentContent);
      //send notification to replied comment user

      //return added comment
      return { id: docRef.id, ...newComment };
    } catch (err) {
      console.log("error when add comment", err);

      return null;
    }
  };

  const sendNotificationToReplyCommentOwner = async (
    replyCommentId,
    commentContent
  ) => {
    try {
      const replyCommentSnapshot = await commentsRef.doc(replyCommentId).get();
      const replyCommentDoc = replyCommentSnapshot.data();

      if (replyCommentDoc) {
        const userQuerySnapshot = await usersRef
          .where("userId", "==", replyCommentDoc.userId)
          .get();

        userQuerySnapshot.forEach((userDoc) => {
          const userReplied = userDoc.data();
          sendNotification(
            userReplied.expoNotifyToken,
            commentContent,
            `New message from ${user.displayName}`
          );
        });
      } else {
        console.log("Reply comment not found.");
      }
    } catch (err) {
      console.log("Error while querying:", err);
    }
  };
  const loadComments = async (songId) => {
    setIsLoading(true);
    try {
      const querySnapshot = await commentsRef
        .where("songId", "==", songId)
        .where("replyToId", "==", null)
        .get();
      const commentList = [];
      querySnapshot.forEach((documentSnapshot) => {
        commentList.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
          createdAt: new Date(documentSnapshot.data().createdAt),
        });
      });
      commentList.sort((a, b) => a.createdAt - b.createdAt);
      setIsLoading(false);
      return commentList;
    } catch (err) {
      console.log("error when get all comments", err);
      setIsLoading(false);
      return [];
    }
  };

  const loadReplyComments = async (commentId) => {
    try {
      const querySnapshot = await commentsRef
        .where("replyToId", "==", commentId)
        .get();
      const commentList = [];
      querySnapshot.forEach((documentSnapshot) => {
        commentList.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
          createdAt: new Date(documentSnapshot.data().createdAt),
        });
      });
      commentList.sort((a, b) => a.createdAt - b.createdAt);
      return commentList;
    } catch (err) {
      console.log("error when get all reply comments", err);
      return [];
    }
  };

  const replyComment = async () => {};
  return (
    <CommentContext.Provider
      value={{ isLoading, loadComments, addComment, loadReplyComments }}
    >
      {children}
    </CommentContext.Provider>
  );
};
