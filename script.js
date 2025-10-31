document.addEventListener("DOMContentLoaded", () => {
  initBackground();
  initBookingModal();
  initDatePickers();
  initCenterBox();
  initHoverPreview();
  initTabs();
  initAccordions();
});

function initBackground() {
  const images = [
    'images/IMG_0319.jpg',
    'images/IMG_0320.jpg',
    'images/IMG_5006.jpg'
  ];

  const bgContainer = document.getElementById('bg-container');
  images.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.classList.add('bg-slide');
    slide.style.backgroundImage = `url('${img}')`;
    if (i === 0) slide.classList.add('active');
    bgContainer.appendChild(slide);
  });

  let current = 0;
  const slides = document.querySelectorAll('.bg-slide');
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
}

function initBookingModal() {
  const modal = document.getElementById("bookingModal");
  const openBtn = document.querySelector(".button-group button:first-child");
  const closeBtn = modal.querySelector(".close");
  const form = modal.querySelector("form");
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwemvt_tfCHkRtBPFJND-TDwPdtQv3EW664feWfoVnxo0xULpYgd037mbAsESHj_JJZ9A/exec";

  openBtn.addEventListener("click", () => showModal(modal));
  closeBtn.addEventListener("click", () => hideModal(modal));
  window.addEventListener("click", e => { if (e.target === modal) hideModal(modal); });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.style.opacity = 0.6;
    document.body.style.cursor = "wait";

    const data = {
      name: form.name.value,
      email: form.email.value,
      people: form.people.value,
      date: form.date.value,
      time: form.time.value
    };

    const formData = new URLSearchParams();
    for (const key in data) formData.append(key, data[key]);

    fetch(GOOGLE_SHEET_URL, { method: "POST", body: formData })
      .then(res => res.json())
      .then(() => {
        alert("Booking submitted successfully!");
        form.reset();
        hideModal(modal);
      })
      .catch(() => alert("Error submitting"))
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = 1;
        document.body.style.cursor = "default";
      });
  });
}

function initDatePickers() {
  flatpickr("#time", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K",
    time_24hr: false,
    minuteIncrement: 15,
    minTime: "07:00",
    maxTime: "21:00",
    allowInput: true,
    onClose: (selectedDates, dateStr, instance) => {
      if (!dateStr) return;
      let time = instance.parseDate(dateStr, "h:i K");
      let minutes = time.getMinutes();
      let allowedMinutes = [0, 15, 30, 45];
      let closest = allowedMinutes.reduce((prev, curr) =>
        Math.abs(curr - minutes) < Math.abs(prev - minutes) ? curr : prev
      );
      if (minutes !== closest) {
        time.setMinutes(closest);
        instance.setDate(time, true);
      }
    }
  });

  flatpickr("#date", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disableMobile: true
  });
}

function initCenterBox() {
  const centerBox = document.querySelector('.center-box');
  const aboutBtn = document.getElementById('aboutBtn');
  const aboutModal = document.getElementById('aboutModal');
  const menuBtn = document.getElementById('menuBtn');
  const menuModal = document.getElementById('menuModal');
  const closeBtns = document.querySelectorAll('.modal .close');

  menuBtn.addEventListener('click', () => {
    centerBox.classList.add('fade-out');
    setTimeout(() => {
      centerBox.style.display = 'none';
      showModal(menuModal);
    }, 600);
  });

  aboutBtn.addEventListener('click', () => {
    centerBox.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    centerBox.style.opacity = 0;
    centerBox.style.transform = 'translate(-50%, -50%) scale(0.95)';
    setTimeout(() => {
      centerBox.style.display = 'none';
      showModal(aboutModal);
    }, 600);
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => hideModal(btn.closest('.modal')));
  });

  window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) hideModal(e.target);
  });

  function hideModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      if (modal === aboutModal || modal === menuModal) {
        centerBox.style.display = 'flex';
        centerBox.classList.remove('fade-out');
        setTimeout(() => {
          centerBox.style.opacity = 1;
          centerBox.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
      }
    }, 400);
  }
}

function showModal(modal) {
  modal.style.display = 'block';
  setTimeout(() => modal.classList.add('show'), 10);
}

function hideModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 400);
}

function initHoverPreview() {
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
      if (window.innerWidth > 600) showPreview(el);
    });
    el.addEventListener('mouseleave', () => {
      if (window.innerWidth > 600) hoverPreview.style.display = 'none';
    });
    el.addEventListener('click', () => {
      if (window.innerWidth <= 600) showPreview(el, true);
    });
  });

  hoverPreview.addEventListener('click', () => hoverPreview.style.display = 'none');

  function showPreview(el, mobile = false) {
    const imgSrc = el.getAttribute('data-img');
    hoverPreview.innerHTML = `<img src="${imgSrc}" alt="Profile Image" style="max-width:400px; max-height:400px;">`;
    hoverPreview.style.display = 'block';
    const img = hoverPreview.querySelector('img');
    img.onload = () => {
      const rect = el.getBoundingClientRect();
      let top = rect.top - hoverPreview.offsetHeight - 8;
      const left = rect.left;
      if (mobile) {
        hoverPreview.style.top = '50%';
        hoverPreview.style.left = '50%';
        hoverPreview.style.transform = 'translate(-50%, -50%)';
      } else {
        hoverPreview.style.transform = 'none';
        if (top < 0) top = rect.bottom + 8;
        hoverPreview.style.top = `${top + window.scrollY}px`;
        hoverPreview.style.left = `${left + window.scrollX}px`;
      }
    };
  }
}

function initTabs() {
  const buttons = document.querySelectorAll('#menuModal .tab-btn');
  const contents = document.querySelectorAll('#menuModal .tab-content');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(button.dataset.tab).classList.add('active');
    });
  });
}

function initAccordions() {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      parent.querySelectorAll('.accordion-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });
}
