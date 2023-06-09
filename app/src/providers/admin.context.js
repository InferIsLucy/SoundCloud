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
    // addField("comments", "deletedAt", null);
  }, []);
  const addField = async (collectionName, fieldName, value) => {
    setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding field:", error);
      throw error;
      setIsLoading(false);
    }
  };
  const updateField = async (collectionName, docId, fieldName, newValue) => {
    setIsLoading(true);

    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      const docRef = collectionRef.doc(docId);
      await docRef.update({ [fieldName]: newValue });
      console.log(
        `Field "${fieldName}" in document with ID "${docId}" in collection "${collectionName}" has been updated to "${newValue}".`
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.error("Error updating field:", error);
      throw error;
    }
  };
  const deleteDocument = async (collectionName, docId) => {
    setIsLoading(true);

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
  const addDocument = async (collectionName, doc) => {
    setIsLoading(true);

    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      await collectionRef.add(doc);
      console.log(`Document added to collection "${collectionName}".`);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding document:", error);
      setIsLoading(false);

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
    setIsLoading(true);

    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      const querySnapshot = await collectionRef
        .where("deletedAt", "!=", null)
        .get();

      const deleteDocs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setIsLoading(false);

      return deleteDocs;
    } catch (error) {
      setIsLoading(false);

      console.error("Error retrieving documents:", error);
      throw error;
    }
  };
  const getDocs = async (collectionName, field, condition, value) => {
    setIsLoading(true);

    try {
      const collectionRef = firebase.firestore().collection(collectionName);
      const querySnapshot = await collectionRef
        .where(field, condition, value)
        .get();

      const deleteDocs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIsLoading(false);

      return deleteDocs;
    } catch (error) {
      setIsLoading(false);

      console.error("Error retrieving documents:", error);
      throw error;
    }
  };
  // path = "mp3/" for example
  const uploadFile = async (fileURL, path) => {
    const response = await fetch(fileURL);
    const blob = await response.blob();
    const fileName = fileURL.substring(fileURL.lastIndexOf("/") + 1);

    const storageRef = firebase.storage().ref().child(`${path}/${fileName}`);
    const uploadTask = storageRef.put(blob);

    try {
      await uploadTask;
      console.log(`${path} upload successful`);
      const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
      console.log(`${path} URL:`, downloadURL);

      return downloadURL;
    } catch (error) {
      console.log(`Error uploading ${path}:`, error);
      return null;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isLoading,
        refreshFlatlist,
        setRefreshFlatList,
        addField,
        deleteDocument,
        getDeleteDocs,
        getDocs,
        addDocument,
        uploadFile,
        updateField,
        restoreDocument,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
