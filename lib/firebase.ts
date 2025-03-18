import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYG50HqsuYq_O4QjSXLdE-MjW78A_JdTM",
  authDomain: "luna-dd43a.firebaseapp.com",
  projectId: "luna-dd43a",
  storageBucket: "luna-dd43a.firebasestorage.app",
  messagingSenderId: "484758980308",
  appId: "1:484758980308:web:2cf260d43efc5d94b95d41",
  measurementId: "G-7W98RCPW8M",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export { app, auth, db, googleProvider }

