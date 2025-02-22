import { getFirestore, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const db = getFirestore();

export async function updateUserProfile(userId, bio, skills, interests, experienceLevel, availability) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            bio,
            skills,
            interests,
            experienceLevel,
            availability,
            updatedAt: serverTimestamp()
        });
        return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
        return { success: false, message: "Error updating profile: " + error.message };
    }
}
