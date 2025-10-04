// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoYOxtHjxcmQYcWN0RI4wtYH713Nrp7G0",
  authDomain: "ai-weather-forecast-590b4.firebaseapp.com",
  projectId: "ai-weather-forecast-590b4",
  storageBucket: "ai-weather-forecast-590b4.firebasestorage.app",
  messagingSenderId: "210377474603",
  appId: "1:210377474603:web:13a686f43f4302d1d2206e",
  measurementId: "G-7YN8ZYYQGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 監聽登入按鈕
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("登入成功！");
                window.location.href = "main.html"; // 成功後跳轉頁面
            })
            .catch((error) => {
                document.getElementById("loginError").textContent = "登入失敗：" + error.message;
            });
    });
}

// 監聽註冊按鈕
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorText = document.getElementById("registerError")

        if (password !== confirmPassword) {
            errorText.textContent = "密碼與確認密碼不一致，請重新輸入。";
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("註冊成功！");
                window.location.href = "index.html"; // 註冊成功後回到登入頁
            })
            .catch((error) => {
                errorText.textContent = "註冊失敗：" + error.message;
            });
    });
}