"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import Cookies from "universal-cookie";
const cookies = new Cookies();

import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getAnalytics,
  logEvent,
  isSupported,
  Analytics,
  setUserProperties,
  setUserId,
} from "firebase/analytics";

import { isDevelopement } from "./helper";
import { logout } from "./login";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAB94JC_Q19Sk0OOvDCaWM7os-RveXVhUc",
  authDomain: "llmminds.firebaseapp.com",
  projectId: "llmminds",
  storageBucket: "llmminds.appspot.com",
  messagingSenderId: "861279198038",
  appId: "1:861279198038:web:54a886eedf8877825fd4f7",
  measurementId: "G-25SMKS8RTZ",
};

let analytics: Analytics;
export let auth: Auth;

let messageBeforeInit: Payload[] = [];

const initializeFirebase = async () => {
  const supported = await isSupported();
  if (!supported) {
    console.log("Not supported");
    return;
  }
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);

  auth = getAuth(app);
  await auth.authStateReady();
  await updateUserDetails();

  if (messageBeforeInit.length > 0) {
    messageBeforeInit.forEach((payload) => {
      emitEvent(payload);
    });
    messageBeforeInit = [];
  }
};

initializeFirebase();

type Payload = {
  event: string;
  data?: any;
};

export const emitEvent = async (payload: Payload) => {
  if (!auth) {
    messageBeforeInit.push(payload);
    return;
  }

  // if (isDevelopement) {
  //   console.log("EVENT", payload);
  //   return;
  // }

  logEvent(analytics, payload.event, payload.data);
};

export const updateUserDetails = async () => {
  if (!auth) {
    return;
  }
  await auth.authStateReady();
  const user = auth.currentUser;

  console.log("user", user);
  if (!user) return;
  setUserId(analytics, user.uid);
  setUserProperties(analytics, {
    email: user.email,
    name: user.displayName,
    id: user.uid,
  });
};

export const googleAuth = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const token = await result.user.getIdToken();
      await updateUserDetails();

      cookies.set("token", token, { path: "/" });
      window.location.reload();
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log("error in login", errorCode, errorMessage, email, credential);

      // ...
    });
};
