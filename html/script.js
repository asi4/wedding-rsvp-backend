// Autofill guest phone number
document.getElementById("phone").value = formatPhoneNumber(getQueryParam("phone") || "");

function formatPhoneNumber(phone) {
    const updatedPhone = phone.replace(/\D/g, ""); // Remove everything that is not a digit
    if (updatedPhone.startsWith("972")) {
        return "0" + updatedPhone.slice(3); // Convert "972542..." → "0542..."
    } else {
        return updatedPhone; // If already correct, return as is
    }
}

// Convert Attendance Selection to Boolean
function getAttendanceValue() {
    return document.querySelector('input[name="attendance"]:checked').value === "כן";
}

// Update guests input field based on attendance choice
document.querySelectorAll('input[name="attendance"]').forEach((radio) => {
    radio.addEventListener("change", function () {
        const guestsInput = document.getElementById("guests");
        if (this.value === "לא") {
            guestsInput.value = 0;
            guestsInput.disabled = true;
        } else {
            guestsInput.value = 1;
            guestsInput.disabled = false;
        }
    });
});


// Wake up the backend when the page loads
window.onload = function() {
    fetch("https://wedding-rsvp-backend-4edo.onrender.com/wake-up") // Replace with your actual backend URL
        .then(response => console.info("✅ Backend is awake"))
        .catch(error => console.error("❌ Error waking up backend:", error));

    document.getElementById("name").addEventListener("input", checkForm);
    checkForm(); // Run once in case the field is already pre-filled
};

document.getElementById("guests").addEventListener("change", function() {
    if (this.value < 1) {
        this.value = 1; // Set to min value if too low
    } else if (this.value > 10) {
        this.value = 10; // Set to max value if too high
    }
});

// Enable the 'Send' button only when the name input is filled
function checkForm() {
    const nameInput = document.getElementById("name").value.trim();
    const sendButton = document.getElementById("sendButton");

    // Toggle disabled state based on input
    sendButton.disabled = nameInput === "";

    // Add or remove a CSS class for styling
    sendButton.classList.toggle("enabled", nameInput !== "");
}

// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function submitRSVP() {
    const sendButton = document.getElementById("sendButton");
    const buttonText = document.getElementById("buttonText");

    // Show spinner
    buttonText.innerHTML = '<span class="spinner"></span>';
    sendButton.disabled = true;

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const attendance = getAttendanceValue(); // Returns true or false
    const guests = attendance ? document.getElementById("guests").value : 0;
    const note = document.getElementById("note").value;
    let whereFrom;
    let guestsShouldBe;

    fetch("https://wedding-rsvp-backend-4edo.onrender.com/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whereFrom, name, phone, attendance, guestsShouldBe, guests, note })
    })
        .then(response => response.json())
        .then(data => {
            document.body.innerHTML = `
            <div style="text-align:center; margin-top:50px;">
                <h1 style="color: black;">תודה רבה!</h1>
                <p>האישור שלך התקבל בהצלחה.</p>
            </div>
        `;
        })
        .catch(error => {
            alert("שגיאה בשליחה, נסה שנית!");
            buttonText.innerText = "שלח";
            sendButton.disabled = false;
        });
}