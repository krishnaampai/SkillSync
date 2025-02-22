import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import {getAuth,createUserWithEmailAndPasssword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import{getFirestore, setDoc,doc} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSCJwX9e92JFyRWlOkMxCfyJfE15oSgJU",
  authDomain: "skillsync-67adc.firebaseapp.com",
  projectId: "skillsync-67adc",
  storageBucket: "skillsync-67adc.firebasestorage.app",
  messagingSenderId: "646697456816",
  appId: "1:646697456816:web:c09c78851964844a085775",
  measurementId: "G-H7TNCMZPJ0"
};

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
