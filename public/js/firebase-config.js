// Firebase Configuration
// REPLACE THESE VALUES WITH YOUR OWN FIREBASE PROJECT CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyB7fLjjdNTljiwvtCGejcSPen7_p7jDELo",
    authDomain: "itliving-83a61.firebaseapp.com",
    projectId: "itliving-83a61",
    storageBucket: "itliving-83a61.firebasestorage.app",
    messagingSenderId: "34678146440",
    appId: "1:34678146440:web:6dc4f9df86f2d3998b263d",
    measurementId: "G-631E6CLYRZ"
};

// Initialize Firebase
let app, db, auth, storage;

try {
    app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();
    console.log("Firebase Initialized Successfully");
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}
