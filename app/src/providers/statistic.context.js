import React, {
  useEffect,
  useState,
  createContext,
  useRef,
  useContext,
} from "react";
import { UserContext } from "./user.context";
import { AudioContext } from "./audio.context";
import { firebase } from "../config/firebase";
export const StatisticContext = createContext();
const listenRef = firebase.firestore().collection("listen");

const StatisticContextProvider = ({ children }) => {
  const getAllListenDoc = async () => {
    try {
      const snapshot = await listenRef.get();
      const listenDocs = [];
      snapshot.forEach((doc) => {
        listenDocs.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return listenDocs;
    } catch (error) {
      console.log("Error getting all listen documents:", error);
      return [];
    }
  };
  const addListen = async (userId, artistIds, songId) => {
    try {
      const newListen = {
        userId,
        createdAt: new Date(),
        artistIds,
        songId,
      };

      await listenRef.add(newListen);

      console.log("Add listen successfully");
    } catch (error) {
      console.log("Error adding listen:", error);
    }
  };

  const calculateTotalListens = async (userId, artistIds) => {
    try {
      // Tạo một biến để lưu tổng số lượt nghe
      let totalListens = 0;

      // Lặp qua từng id của nhạc sĩ trong mảng artistIds
      for (const artistId of artistIds) {
        // Thực hiện truy vấn để đếm số lượng document có trường userId và artistId phù hợp
        const count = await listenRef
          .where("userId", "==", userId)
          .where("artistId", "==", artistId)
          .get()
          .then((querySnapshot) => querySnapshot.size);

        // Cộng số lượng document tìm được vào biến totalListens
        totalListens += count;
      }
      // Trả về kết quả
      return totalListens;
    } catch (error) {
      console.log("Error calculating total listens:", error);
      return 0;
    }
  };

  return (
    <StatisticContext.Provider
      value={{
        getAllListenDoc,
        addListen,
      }}
    >
      {children}
    </StatisticContext.Provider>
  );
};

export default StatisticContextProvider;
