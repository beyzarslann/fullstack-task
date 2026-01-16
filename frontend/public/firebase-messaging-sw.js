importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBIWgvSZwoM2QZ9q2xhWjzDx4f7Wa42d3U",
  authDomain: "fullstack-task-ustd.firebaseapp.com",
  projectId: "fullstack-task-ustd",
  storageBucket: "fullstack-task-ustd.firebasestorage.app",
  messagingSenderId: "725421358200",
  appId: "1:725421358200:web:7b0697af2195b84efbc18d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "USDT Alert";
  const options = { body: payload?.notification?.body || "" };
  self.registration.showNotification(title, options);
});
