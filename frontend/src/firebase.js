import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const config = {
  apiKey: "AIzaSyBIWgvSZwoM2QZ9q2xhWjzDx4f7Wa42d3U",
  authDomain: "fullstack-task-ustd.firebaseapp.com",
  projectId: "fullstack-task-ustd",
  storageBucket: "fullstack-task-ustd.firebasestorage.app",
  messagingSenderId: "725421358200",
  appId: "1:725421358200:web:7b0697af2195b84efbc18d",
};

const app = initializeApp(config);
export const messaging = getMessaging(app);
