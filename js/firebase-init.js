// Initialize Firebase using Global compat v8
const firebaseConfig = {
  apiKey: "AIzaSyBrrAVIqBjJhQF6B-KsOzEbe6y-_MzFWZI",
  authDomain: "lentenipaul.firebaseapp.com",
  projectId: "lentenipaul",
  storageBucket: "lentenipaul.firebasestorage.app",
  messagingSenderId: "897075727409",
  appId: "1:897075727409:web:86e4171e84ee4753365910",
  measurementId: "G-0F9K71GQS3"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
