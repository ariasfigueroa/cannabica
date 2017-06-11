import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDMliuQXmEXkNmV5eacQsHdQKlFPLm_6j0",
  authDomain: "cannabicameds.firebaseapp.com",
  databaseURL: "https://cannabicameds.firebaseio.com",
  projectId: "cannabicameds",
  storageBucket: "cannabicameds.appspot.com",
  messagingSenderId: "815291967714"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
