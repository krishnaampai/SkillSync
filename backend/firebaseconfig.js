import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import {getAuth,createUserWithEmailAndPasssword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import{getFirestore, setDoc,doc} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js"
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
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
function showMessage(message,divID){
  var messsageDiv = document.getElementById(divID);
  messsageDiv.style.display = "block";
  messsageDiv.innerHTML = message;
  setTimeout(function(){
    messsageDiv.style.opacity = 0;
  },5000);
}
const signUp = document.getElementById('submitSignUp');//id for sign up button - submitSignUp
signUp.addEventListener('click', (event) =>{
  event.preventDefault();
  const email = document.getElementById('email-js').value;
  const password = document.getElementById('password-js').value;
  const name  = document.getElementById('name-js').value;

  const auth = getAuth();
  const db = getFirestore();
  createUserWithEmailAndPasssword(auth,email,password)
  .then((userCredential)=>{
    const user = userCredential.user;
    const userData = {
      email: email,
      name : name,

    };

    showMessage('Account created Successfully' ,'signUpMessage');//signUpMessage - id
    const docRef = doc(db, "users" , user.uid);
    
  })
  .catch((error)=>{
    const errorCode = error.code;
    if (errorCode =='auth/email-already-in-use'){
      showMessage('Email already exists!', 'signUpMessage');
    }
    else {
      showMessage('Unable to create user :/', 'signUpMessage');
    }
  })
});

const signIn = document.getElementById('submitSignIn');//id for sign in button - submitSignIn
signIn.addEventListener('click', (event) =>{
  event.preventDefault();
  const email = document.getElementById('email-js').value;
  const password = document.getElementById('password-js').value;
  const auth = getAuth();
  
  signInWithEmailAndPassword(auth,email,password)
  .then((userCredential)=>{
  
    showMessage('Login Successfull' ,'signInMessage');//signInMessage - id
    const user = userCredential.user;
    localStorage.setItem('LoggedInUserId',user.uid);
    windows.location.href = 'frontend/dashboard.html';
  })

  .catch((error)=>{
    const errorCode = error.code;
    if (errorCode =='auth/invalid-credential'){
      showMessage('Incorrect email or Password', 'signInMessage');
    }
    else {
      showMessage('Account does not exist', 'signInMessage');
    }
  })
});



//div message for signup and signin
