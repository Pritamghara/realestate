// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ0GpKXOrCoZeg6AsAIHkiJYWnCEgg358",
  authDomain: "mern-realestate-c2079.firebaseapp.com",
  projectId: "mern-realestate-c2079",
  storageBucket: "mern-realestate-c2079.appspot.com",
  messagingSenderId: "1071832936992",
  appId: "1:1071832936992:web:d9e79ea02f6028d1510245"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app