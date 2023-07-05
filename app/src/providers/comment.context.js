import React, { useEffect, useState, createContext, useContext } from "react";
import { firebase } from "../config/firebase";
import { UserContext } from "./user.context";
import { NotificationContext } from "./notification.context";
export const CommentContext = createContext();

const commentsRef = firebase.firestore().collection("comments");
const usersRef = firebase.firestore().collection("users");

//TODO: move comment collection into user field "comments" on firestore database
export const CommentContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const { sendNotification } = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);

  const addComment = async (songId, commentContent, replyCommentId = null) => {
    const newComment = {
      content: commentContent,
      songId: songId,
      userId: user.userId,
      userName: user.displayName,
      userAvatar: user.avatar,
      deletedAt: null,
      createdAt: Date.now(),
      replyToId: replyCommentId,
    };
    try {
      const docRef = await commentsRef.add(newComment);
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
      console.log("replytoId", replyCommentId);
      if (replyCommentDoc) {
        const userQuerySnapshot = await usersRef
          .where("userId", "==", replyCommentDoc.userId)
          .get();
        userQuerySnapshot.forEach((userDoc) => {
          const userReplied = userDoc.data();
          console.log("notifytoken", userReplied.expoNotifyToken);

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
    console.log("SongId", songId);
    setIsLoading(true);
    try {
      const querySnapshot = await commentsRef
        .where("songId", "==", songId)
        .where("replyToId", "==", null)
        .where("deletedAt", "==", null)
        .get();
      const commentList = [];
      querySnapshot.forEach((documentSnapshot) => {
        commentList.push({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
          createdAt: new Date(documentSnapshot.data().createdAt),
        });
      });
      console.log("commentsList", commentList.length);
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
        .where("deletedAt", "==", null)
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
  const deleteComment = async (commentId) => {
    try {
      await commentsRef.doc(commentId).update({ deletedAt: new Date() });
      console.log("Comment marked as deleted successfully");
    } catch (err) {
      console.log("Error while marking comment as deleted:", err);
    }
  };

  const replyComment = async () => {};
  return (
    <CommentContext.Provider
      value={{
        isLoading,
        loadComments,
        addComment,
        loadReplyComments,
        deleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
