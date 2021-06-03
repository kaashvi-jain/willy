import firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyCL1isnr-Yi8I4OUK58fkAPlkrDPWdx0ng",
    authDomain: "willy-8a178.firebaseapp.com",
    projectId: "willy-8a178",
    storageBucket: "willy-8a178.appspot.com",
    messagingSenderId: "69279565574",
    appId: "1:69279565574:web:220d4435cddb9f4c7dc087"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();