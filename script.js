// ═══════════════════════════════════════════════════════
//  Advanced Homeo Care – Dr. Baishali Bhattacharjee
//  Main Script
// ═══════════════════════════════════════════════════════

// ─── Mobile Hamburger Menu ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ─── Scroll Reveal ──────────────────────────────────────
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
  observer.observe(el);
});

// ─── Custom Date & Time Pickers ─────────────────────────
const dateTrigger = document.getElementById('date-trigger');
const calModal = document.getElementById('cal-modal');
const timeTrigger = document.getElementById('time-trigger');
const timeModal = document.getElementById('time-modal');
const displayDate = document.getElementById('display-date');
const inputDate = document.getElementById('input-date');
const displayTime = document.getElementById('display-time');
const inputTime = document.getElementById('input-time');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Toggle Modals
dateTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  calModal.classList.toggle('active');
  dateTrigger.classList.toggle('active');
  timeModal.classList.remove('active');
  timeTrigger.classList.remove('active');
});

timeTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  timeModal.classList.toggle('active');
  timeTrigger.classList.toggle('active');
  calModal.classList.remove('active');
  dateTrigger.classList.remove('active');
});

document.addEventListener('click', () => {
  calModal.classList.remove('active');
  dateTrigger.classList.remove('active');
  timeModal.classList.remove('active');
  timeTrigger.classList.remove('active');
});

[calModal, timeModal].forEach(m => m.addEventListener('click', e => e.stopPropagation()));

// ─── Calendar Generation ────────────────────────────────
function generateCalendar(month, year) {
  const calGrid = document.getElementById('cal-grid');
  const monthYearTitle = document.getElementById('cal-month-year');
  calGrid.innerHTML = '';

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthYearTitle.innerText = `${months[month]} ${year}`;

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  days.forEach(d => {
    const dLabel = document.createElement('div');
    dLabel.className = 'cal-day-label';
    dLabel.innerText = d;
    calGrid.appendChild(dLabel);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-date empty';
    calGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateEl = document.createElement('div');
    dateEl.className = 'cal-date';
    dateEl.innerText = d;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, d);

    if (checkDate < today) {
      dateEl.classList.add('disabled');
    } else {
      if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dateEl.classList.add('today');
      }

      dateEl.addEventListener('click', () => {
        const selected = `${d} ${months[month]} ${year}`;
        displayDate.innerText = selected;
        inputDate.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        calModal.classList.remove('active');
        dateTrigger.classList.remove('active');

        document.querySelectorAll('.cal-date').forEach(el => el.classList.remove('selected'));
        dateEl.classList.add('selected');
      });
    }

    calGrid.appendChild(dateEl);
  }
}

document.getElementById('cal-prev').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  generateCalendar(currentMonth, currentYear);
});

document.getElementById('cal-next').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  generateCalendar(currentMonth, currentYear);
});

generateCalendar(currentMonth, currentYear);

// ─── Time Slot Generation ───────────────────────────────
function generateTimeSlots() {
  const container = document.getElementById('time-slots');
  container.innerHTML = '';

  const slots = [
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM"
  ];

  slots.forEach((s, idx) => {
    if (idx === slots.length - 1) return; // End range slot skip
    const nextS = slots[idx + 1];
    const slotEl = document.createElement('div');
    slotEl.className = 'time-slot';

    const timeVal = s.split(' ')[0];
    const ampm = s.split(' ')[1];

    slotEl.innerHTML = `<span>${timeVal} - ${nextS.split(' ')[0]}</span> <span class="ampm">${ampm}</span>`;

    slotEl.addEventListener('click', () => {
      const fullSlot = `${s} - ${nextS}`;
      displayTime.innerText = fullSlot;
      inputTime.value = fullSlot;
      timeModal.classList.remove('active');
      timeTrigger.classList.remove('active');

      document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
      slotEl.classList.add('selected');
    });

    container.appendChild(slotEl);
  });
}

generateTimeSlots();

// ─── Form Submission & Success State ────────────────────
const appointmentForm = document.getElementById('appointment-form');
const bookingSuccess = document.getElementById('booking-success');
const resetBtn = document.getElementById('btn-reset-form');

appointmentForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const submitBtn = appointmentForm.querySelector('.btn-submit');
  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = "Processing...";
  submitBtn.disabled = true;

  const formData = new FormData(appointmentForm);
  const data = Object.fromEntries(formData.entries());

  fetch('https://formsubmit.co/ajax/advancedhomeocare25@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      appointmentForm.style.display = 'none';
      bookingSuccess.style.display = 'block';
      window.scrollTo({
        top: document.getElementById('booking').offsetTop - 100,
        behavior: 'smooth'
      });
    })
    .catch(error => {
      alert("There was an error submitting your request. Please try again.");
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    });
});

// Reset Logic
resetBtn.addEventListener('click', () => {
  appointmentForm.reset();
  displayDate.innerText = "Select a day";
  inputDate.value = "";
  displayTime.innerText = "Choose time";
  inputTime.value = "";
  document.querySelectorAll('.cal-date, .time-slot').forEach(el => el.classList.remove('selected'));

  const submitBtn = appointmentForm.querySelector('.btn-submit');
  submitBtn.innerText = "BOOK APPOINTMENT";
  submitBtn.disabled = false;
  submitBtn.style.background = 'var(--sage)';

  bookingSuccess.style.display = 'none';
  appointmentForm.style.display = 'block';

  window.scrollTo({
    top: document.getElementById('booking').offsetTop - 100,
    behavior: 'smooth'
  });
});

// ─── Hero Carousel ──────────────────────────────────────
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

setInterval(nextSlide, 5000);
