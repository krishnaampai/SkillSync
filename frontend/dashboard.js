import { db, auth } from '../backend/env.js';
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User logged in:", user.uid);
    } else {
        console.log("No user is signed in.");
    }
});

window.findProjectsBySkills = async function() {
    console.log("Find Projects button clicked!"); // Debugging log

    const user = auth.currentUser;
    if (!user) {
        console.error("User is not logged in.");
        return;
    }

    const userId = user.uid;
    const userRef = doc(db, "users", userId);

    try {
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            console.log("User data not found");
            return;
        }

        const userSkills = userDoc.data().skills || [];

        const projectsRef = collection(db, "projects");
        const projectsSnapshot = await getDocs(projectsRef);

        let matchingProjects = [];

        projectsSnapshot.forEach((doc) => {
            let projectData = doc.data();
            let requiredSkills = projectData.requiredSkills || [];

            if (userSkills.some(skill => requiredSkills.includes(skill))) {
                matchingProjects.push({ id: doc.id, ...projectData });
            }
        });

        displayMatchingProjects(matchingProjects);
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
};


function displayMatchingProjects(projects) {
    const projectsListDiv = document.getElementById("matching-projects-list");
    projectsListDiv.innerHTML = "";

    if (!projectsListDiv) {
        console.error("Error: matching-projects-list div not found.");
        return;
    }

    if (projects.length === 0) {
        projectsListDiv.innerHTML = "<p>No matching projects found.</p>";
        return;
    }

    projects.forEach(project => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project-card");
        projectDiv.innerHTML = `
            <h3>${project.name}</h3>
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>Required Skills:</strong> ${project.requiredSkills.join(", ")}</p>
            <button onclick="sendCollabRequest('${project.id}')">Request to Join</button>
        `;
        projectsListDiv.appendChild(projectDiv);
    });
}


window.sendCollabRequest = function(projectId) {
    console.log("Collab request sent for project:", projectId);
   
};
