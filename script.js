// Background Carousel
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

// Modal Handling 
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

// Form Submission save to Google Sheets 
// https://docs.google.com/spreadsheets/d/1vS3JFNWtcQlc1z0u5aUblIBjFpf99x4tv9hszookQqY/edit?gid=0#gid=0
const form = document.querySelector(".modal-content form");

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby6oKtWAL-LL8ChPie4oRKP3Y33cioO-cJwuoGjHESkvbay34tXcXEsdnrualDVwSHJ/exec";

form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    email: form.email.value,
    people: form.people.value,
    date: form.date.value,
    time: form.time.value
  };

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
    alert("Error submitting");
    console.error(err);
  });
});
