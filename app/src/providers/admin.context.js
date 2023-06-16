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

export const AdminContext = createContext();

const imageStorage = firebase.storage().ref("images");
const usersRef = firebase.firestore().collection("users");
export const AdminContextProvider = ({ children }) => {
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  useEffect(() => {
    // addField("artists", "dateOfBirth", new Date(1998, 7, 16));
  }, []);
  const addField = async (collectionName, fieldName, value) => {
    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      const querySnapshot = await collectionRef.get();
      const batch = firebase.firestore().batch();

      querySnapshot.forEach((documentSnapshot) => {
        const docRef = collectionRef.doc(documentSnapshot.id);
        batch.update(docRef, { [fieldName]: value });
      });
      await batch.commit();
      console.log(
        `Field "${fieldName}" added to all documents in collection "${collectionName}" with the value "${value}".`
      );
    } catch (error) {
      console.error("Error adding field:", error);
      throw error;
    }
  };
  const deleteDocument = async (collectionName, docId) => {
    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      const docRef = collectionRef.doc(docId);

      await docRef.update({ deletedAt: new Date() });

      console.log(
        `Document with ID "${docId}" in collection "${collectionName}" has been marked as deleted.`
      );
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  };
  const restoreDocument = async (collectionName, docId) => {
    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      const docRef = collectionRef.doc(docId);

      await docRef.update({ deletedAt: null });

      console.log(
        `Document with ID "${docId}" in collection "${collectionName}" has been restored.`
      );
    } catch (error) {
      console.error("Error restoring document:", error);
      throw error;
    }
  };
  const getDeleteDocs = async (collectionName) => {
    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      const querySnapshot = await collectionRef
        .where("deletedAt", "!=", null)
        .get();

      const deleteDocs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Retrieving documents successfully ", deleteDocs.length);
      return deleteDocs;
    } catch (error) {
      console.error("Error retrieving documents:", error);
      throw error;
    }
  };
  const getDocs = async (collectionName, field, condition, value) => {
    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      const querySnapshot = await collectionRef
        .where(field, condition, value)
        .get();

      const deleteDocs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return deleteDocs;
    } catch (error) {
      console.error("Error retrieving documents:", error);
      throw error;
    }
  };
  return (
    <AdminContext.Provider
      value={{
        refreshFlatlist,
        setRefreshFlatList,
        addField,
        deleteDocument,
        getDeleteDocs,
        getDocs,
        restoreDocument,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};