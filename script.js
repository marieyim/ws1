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

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwemvt_tfCHkRtBPFJND-TDwPdtQv3EW664feWfoVnxo0xULpYgd037mbAsESHj_JJZ9A/exec";

form.addEventListener("submit", e => {
  e.preventDefault();

  const submitBtn = form.querySelector("button[type='submit']");
  
  // Disable button immediately to prevent double clicks
  submitBtn.disabled = true;
  submitBtn.style.opacity = 0.6;

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

    // Re-enable button after submission
    submitBtn.disabled = false;
    submitBtn.style.opacity = 1;
  })
  .catch(err => {
    alert("Error submitting");
    console.error(err);

    // Re-enable button if there was an error
    submitBtn.disabled = false;
    submitBtn.style.opacity = 1;
  });
});



document.addEventListener("DOMContentLoaded", () => {
flatpickr("#time", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K",
    time_24hr: false,
    minuteIncrement: 15,
    minTime: "07:00",
    maxTime: "21:00",
    allowInput: true, // allows typing
    onClose: function(selectedDates, dateStr, instance) {
        if (!dateStr) return; // no input
        
        let time = instance.parseDate(dateStr, "h:i K");
        let minutes = time.getMinutes();

        // Round to nearest allowed minute: 0, 15, 30, 45
        let allowedMinutes = [0, 15, 30, 45];
        let closest = allowedMinutes.reduce((prev, curr) => 
            Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev
        );

        if (minutes !== closest) {
            time.setMinutes(closest);
            instance.setDate(time, true); // update input
        }
    }
});



    flatpickr("#date", {
        dateFormat: "Y-m-d", // YYYY-MM-DD format
        minDate: "today",     // disable all past dates
        disableMobile: true   // optional: always use Flatpickr UI
    });

});

// Get elements
const centerBox = document.querySelector('.center-box');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeBtns = document.querySelectorAll('.modal .close');

// Show modal with fade-in and slide
function showModal(modal) {
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10); // trigger CSS transition
}

// Hide modal with fade-out
function hideModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        // Restore center-box if About modal closed
        if (modal === aboutModal) {
            centerBox.style.display = 'flex';
            setTimeout(() => {
                centerBox.style.opacity = 1;
                centerBox.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 10);
        }
    }, 400); // match modal fade duration
}

// Close buttons functionality
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hideModal(btn.closest('.modal'));
    });
});

// Click outside modal to close
window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        hideModal(e.target);
    }
});

// About Us button click
aboutBtn.addEventListener('click', () => {
    // Fade out center-box
    centerBox.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    centerBox.style.opacity = 0;
    centerBox.style.transform = 'translate(-50%, -50%) scale(0.95)';

    // Wait for fade-out, then hide center-box and show modal
    setTimeout(() => {
        centerBox.style.display = 'none';
        showModal(aboutModal);
    }, 600);
});

const hoverPreview = document.createElement('div');
hoverPreview.style.position = 'absolute';
hoverPreview.style.display = 'none';
hoverPreview.style.border = '1px solid #ccc';
hoverPreview.style.background = '#fff';
hoverPreview.style.padding = '5px';
hoverPreview.style.zIndex = '1000';
document.body.appendChild(hoverPreview);

document.querySelectorAll('.hover-image').forEach(el => {
    el.addEventListener('mouseenter', () => {
        const imgSrc = el.getAttribute('data-img');
        hoverPreview.innerHTML = `<img src="${imgSrc}" alt="Profile Image" style="max-width:400px; max-height:400px;">`;
        hoverPreview.style.display = 'block';

        const img = hoverPreview.querySelector('img');
        img.onload = () => {
            const rect = el.getBoundingClientRect();
            let top = rect.top - hoverPreview.offsetHeight - 8; // default above
            const left = rect.left;

            // If there's no space above, show below
            if (top < 0) {
                top = rect.bottom + 8;
            }

            hoverPreview.style.top = `${top + window.scrollY}px`;
            hoverPreview.style.left = `${left + window.scrollX}px`;
        };
    });

    el.addEventListener('mouseleave', () => {
        hoverPreview.style.display = 'none';
    });
});
