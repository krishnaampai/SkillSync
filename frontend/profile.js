import {updateUserProfile} from "../backend/firestore.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";


document.addEventListener("DOMContentLoaded", () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        document.getElementById("saveProfile").addEventListener("click", async () => {//button id is saveProfile
            const bio = document.getElementById("bio-js").value;
            const skills = document.getElementById("skills-js").value.split(",").map(skill => skill.trim());
            const interests = document.getElementById("interests-js").value.split(",").map(interest => interest.trim());
            const experienceLevel = document.getElementById("experience-js").value;
            const availability = document.getElementById("availability-js").value;

            const result = await updateUserProfile(user.uid, bio, skills, interests, experienceLevel, availability);
            alert(result.message); 
        });
    } else {
        console.log("No user is logged in.");
    }
});
