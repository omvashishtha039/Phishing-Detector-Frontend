const backendUrl = "https://phishing-detector-backend.onrender.com"; // Replace with actual backend URL

window.addEventListener("DOMContentLoaded", function () {
    // ✅ Handle Signup
    document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            alert("⚠️ All fields are required!");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup Successful! Please log in.");
                window.location.href = "login.html";
            } else {
                alert("❌ Signup failed! " + (data.error || "Please try again."));
            }
        } catch (error) {
            alert("🚨 Network error! Check your connection.");
            console.error("Signup Error:", error);
        }
    });

    // ✅ Handle Login
    document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            alert("⚠️ Email and Password are required!");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Login successful!");
                window.location.href = "dashboard.html";
            } else {
                alert("❌ Login failed! " + (data.error || "Invalid credentials."));
            }
        } catch (error) {
            alert("🚨 Network error! Try again later.");
            console.error("Login Error:", error);
        }
    });

    // ✅ Handle Logout
    document.getElementById("logout")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        alert("👋 Logged out successfully!");
        window.location.href = "index.html";
    });

    // ✅ Handle URL Scan
    document.getElementById("scanForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const url = document.getElementById("url")?.value;
        const token = localStorage.getItem("token");

        if (!url) {
            alert("⚠️ Please enter a URL!");
            return;
        }

        if (!token) {
            alert("🔑 You must be logged in to scan URLs!");
            return;
        }

        document.getElementById("scanResult").innerHTML = `<p style="color: blue;">🔍 Scanning URL...</p>`;

        try {
            const response = await fetch(`${backendUrl}/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();
            if (response.ok) {
                document.getElementById("scanResult").innerHTML = `
                    <p style="color: ${data.status === "dangerous" ? "red" : "green"};">
                        ${data.message}
                    </p>
                `;
            } else {
                document.getElementById("scanResult").innerHTML = `<p style="color: red;">⚠️ ${data.error || "Scan failed!"}</p>`;
            }
        } catch (error) {
            document.getElementById("scanResult").innerHTML = `<p style="color: red;">🚨 Error scanning URL. Try again later.</p>`;
            console.error("Scan Error:", error);
        }
    });
});
