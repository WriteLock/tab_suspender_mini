let lastActivityTime = Date.now();
let isActive = true;

function reportActivity() {
    console.log("Activity detected"); // Add this line
    lastActivityTime = Date.now();
    if (!isActive) {
        isActive = true;
        console.log("Sending active status to background"); // Add this line
        browser.runtime.sendMessage({ action: "reportActivity", status: "active" })
            .then(() => console.log("Active status sent successfully")) // Add this line
            .catch(error => console.error("Error sending active status:", error)); // Add this line
    }
}

['scroll', 'mousemove', 'keydown', 'click', 'touchstart', 'focus'].forEach(eventType => {
    window.addEventListener(eventType, reportActivity, { passive: true });
});

// Check for inactivity every 5 seconds
setInterval(() => {
    if (Date.now() - lastActivityTime > 5000) {
        if (isActive) {
            isActive = false;
            console.log("Sending inactive status to background"); // Add this line
            browser.runtime.sendMessage({ action: "reportActivity", status: "inactive" })
                .then(() => console.log("Inactive status sent successfully")) // Add this line
                .catch(error => console.error("Error sending inactive status:", error)); // Add this line
        }
    } else if (!isActive) {
        isActive = true;
        console.log("Sending active status to background (from interval)"); // Add this line
        browser.runtime.sendMessage({ action: "reportActivity", status: "active" })
            .then(() => console.log("Active status sent successfully (from interval)")) // Add this line
            .catch(error => console.error("Error sending active status (from interval):", error)); // Add this line
    }
}, 5000);

// Report activity when the page loads
reportActivity();

// Log when the content script is loaded
console.log("Activity tracking content script loaded");