// === Background Carousel ===
const images = [
  'images/IMG_0319.jpg',
  'images/IMG_0320.jpg',
  'images/IMG_5006.jpg'
];

let currentIndex = 0;
function changeBackground() {
  document.body.style.backgroundImage = `url('${images[currentIndex]}')`;
  currentIndex = (currentIndex + 1) % images.length;
}
changeBackground();
setInterval(changeBackground, 5000);

// === Modal Handling ===
const modal = document.getElementById("bookingModal");
const openBtn = document.querySelector(".button-group button:first-child");
const closeBtn = document.querySelector(".modal .close");

openBtn.addEventListener("click", () => {
  modal.style.display = "block";
  setTimeout(() => modal.classList.add("show"), 10);
});

function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => {
    if (!modal.classList.contains("show")) {
      modal.style.display = "none";
    }
  }, 400);
}

closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// === Form Submission to Google Sheets ===
const form = document.querySelector(".modal-content form");

// Updated Google Apps Script Web App URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwdGk3aNsYWpYSbAUADvSRdCUdU5m7RwSpg3yxJOP2RHgPhc7X3OijYFHxlHWJCSRO_fA/exec";

form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    email: form.email.value,
    people: form.people.value,
    date: form.date.value,
    time: form.time.value
  };

  // Use URLSearchParams for a URL-encoded POST (avoids CORS issues)
  const formData = new URLSearchParams();
  for (const key in data) formData.append(key, data[key]);

  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(response => {
    alert("Booking submitted successfully!");
    form.reset();
    closeModal();
  })
  .catch(err => {
    alert("Error submitting. Make sure the Web App is deployed as 'Anyone, even anonymous'.");
    console.error(err);
  });
});
