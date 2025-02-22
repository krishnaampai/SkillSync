import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const script = document.createElement("script");
script.src = "/backend/env.js"; // Adjust the path if necessary
document.head.appendChild(script);

script.onload = () => {
  const firebaseConfig = {
    apiKey: window.env.FIREBASE_API_KEY,
    authDomain: window.env.FIREBASE_AUTH_DOMAIN,
    projectId: window.env.FIREBASE_PROJECT_ID,
    storageBucket: window.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: window.env.FIREBASE_APP_ID,
    measurementId: window.env.FIREBASE_MEASUREMENT_ID
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = 'en';
  const provider = new GoogleAuthProvider();
  const db = getFirestore(app);

  function showMessage(message, divID) {
    var messageDiv = document.getElementById(divID);
    if (!messageDiv) return; 
    
    messageDiv.style.display = "block";
    messageDiv.style.opacity = "1"; 
    messageDiv.innerHTML = message;
  
    setTimeout(function () {
      messageDiv.style.opacity = "0";
    }, 5000);
  }

  const googleLogin = document.getElementById('Google-signin');
  googleLogin.addEventListener("click", function(){
    const auth = getAuth();
signInWithPopup(auth, provider)
  .then((result) => {
    
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    window.location.href = 'frontend/dashboard.html';
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
   
    
  });

  })

  const signUp = document.getElementById('submitSignUp'); //id for sign up button - submitSignUp
  signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email-js').value;
    const password = document.getElementById('password-js').value;
    const name = document.getElementById('name-js').value;

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters!', 'signUpMessage');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          name: name,
        };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData) // Add user data to Firestore
          .then(() => {
            showMessage('Account created Successfully', 'signUpMessage');
          })
          .catch(() => {
            showMessage('Error storing user data!', 'signUpMessage');
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
          showMessage('Email already exists!', 'signUpMessage');
        } else {
          showMessage('Unable to create user :/', 'signUpMessage');
        }
      });
  });

  const signIn = document.getElementById('submitSignIn'); //id for sign in button - submitSignIn
  signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('semail-js').value;
    const password = document.getElementById('spassword-js').value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
        showMessage('Login Successful', 'signInMessage'); //signInMessage - id
        localStorage.setItem('LoggedInUserId', userCredential.user.uid);
        window.location.href = 'frontend/dashboard.html';
      },1000)
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == 'auth/invalid-credential') {
          console.log("Error signing in:", error.message);
          showMessage('Incorrect email or Password', 'signInMessage');
        } else {
          showMessage('Account does not exist', 'signInMessage');
        }
      });
  });
};
