
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations();
  initializeScrollEffects();
  initializeFormValidation();
});

function toggleMobileMenu() {
  const navButtons = document.querySelector(".nav-buttons");
  const menuToggle = document.querySelector(".mobile-menu-toggle");

  navButtons.classList.toggle("show");
  menuToggle.classList.toggle("active");
}

function scrollToForm() {
  const form = document.querySelector(".consultation-form");
  if (form) {
    form.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

  
    setTimeout(() => {
      const firstInput = form.querySelector('input[type="text"]');
      if (firstInput) {
        firstInput.focus();
      }
    }, 500);
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const captcha = formData.get("captcha").trim();


  if (!validateForm(name, phone, captcha)) {
    return;
  }


  const submitBtn = form.querySelector(".btn-submit");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Booking...";
  submitBtn.disabled = true;


  setTimeout(() => {
    
    showNotification(
      "Success! Your appointment request has been submitted. We will contact you soon.",
      "success"
    );

   
    form.reset();


    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    console.log("Appointment booked:", { name, phone });
  }, 2000);
}

// Form validation
function validateForm(name, phone, captcha) {
  if (name.length < 2) {
    showNotification(
      "Please enter a valid name (at least 2 characters)",
      "error"
    );
    return false;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
    showNotification("Please enter a valid 10-digit mobile number", "error");
    return false;
  }

  if (captcha !== "8") {
    showNotification("Incorrect captcha. The answer is 8 (5 + 3 = 8)", "error");
    return false;
  }

  return true;
}

function showNotification(message, type = "info") {

  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }


  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "#4CAF50"
            : type === "error"
            ? "#f44336"
            : "#2196F3"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

  notification.querySelector(".notification-content").style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;

  notification.querySelector(".notification-close").style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

  document.body.appendChild(notification);

 
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}


function initializeAnimations() {

  const treatmentCards = document.querySelectorAll(".treatment-card");
  const testimonialCards = document.querySelectorAll(".testimonial-card");

  treatmentCards.forEach((card, index) => {
    card.classList.add("fade-in");
    if (index % 2 === 0) {
      card.classList.add("slide-in-left");
    } else {
      card.classList.add("slide-in-right");
    }
  });

  testimonialCards.forEach((card) => {
    card.classList.add("fade-in");
  });
}

function initializeScrollEffects() {

  const backToTopBtn = document.querySelector(".back-to-top");


  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
    .forEach((el) => {
      observer.observe(el);
    });

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });
}


function initializeFormValidation() {
  const form = document.querySelector(".consultation-form");
  const inputs = form.querySelectorAll('input[type="text"], input[type="tel"]');

  inputs.forEach((input) => {
  
    input.addEventListener("blur", function () {
      validateInput(this);
    });

    input.addEventListener("input", function () {

      this.style.borderColor = "";
    });
  });
}

function validateInput(input) {
  const value = input.value.trim();
  let isValid = true;
  let message = "";

  switch (input.name) {
    case "name":
      if (value.length < 2) {
        isValid = false;
        message = "Name must be at least 2 characters";
      }
      break;
    case "phone":
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value.replace(/\D/g, ""))) {
        isValid = false;
        message = "Enter a valid 10-digit mobile number";
      }
      break;
    case "captcha":
      if (value !== "8") {
        isValid = false;
        message = "Incorrect answer. 5 + 3 = ?";
      }
      break;
  }

  if (!isValid) {
    input.style.borderColor = "#f44336";
    input.title = message;
  } else {
    input.style.borderColor = "#4CAF50";
    input.title = "";
  }

  return isValid;
}


const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

window.addEventListener("resize", () => {
  const navButtons = document.querySelector(".nav-buttons");
  const menuToggle = document.querySelector(".mobile-menu-toggle");

  if (window.innerWidth > 768) {
    navButtons.classList.remove("show");
    menuToggle.classList.remove("active");
  }
});

if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

function handleBookingSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);


  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const captcha = formData.get("captcha").trim();

  if (!validateBookingForm(name, phone, captcha)) {
    return;
  }

  const submitBtn = form.querySelector(".btn-book-consultation");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Booking...";
  submitBtn.disabled = true;


  setTimeout(() => {
    showNotification(
      "Success! Your appointment has been booked. We will contact you shortly to confirm the details.",
      "success"
    );

    form.reset();


    submitBtn.textContent = originalText;
    submitBtn.disabled = false;


    console.log("Booking submitted:", { name, phone });
  }, 2000);
}

// Validate booking form
function validateBookingForm(name, phone, captcha) {

  if (name.length < 2) {
    showNotification(
      "Please enter a valid name (at least 2 characters)",
      "error"
    );
    return false;
  }

  // Phone validation
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
    showNotification("Please enter a valid 10-digit mobile number", "error");
    return false;
  }

  // Captcha validation (1514)
  if (captcha !== "1514") {
    showNotification(
      "Incorrect captcha. Please enter the code shown: 1514",
      "error"
    );
    return false;
  }

  return true;
}

// Toggle FAQ items
function toggleFAQ(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains("active");

  // Close all other FAQ items in the same column
  const column = faqItem.closest(".faq-column");
  const allItems = column.querySelectorAll(".faq-item");

  allItems.forEach((item) => {
    if (item !== faqItem) {
      item.classList.remove("active");
    }
  });

  // Toggle current item
  if (isActive) {
    faqItem.classList.remove("active");
  } else {
    faqItem.classList.add("active");
  }
// Smooth scroll
  if (!isActive) {
    setTimeout(() => {
      const rect = faqItem.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (!isVisible) {
        faqItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 150);
  }
}

// Initialize FAQ animations on page load
document.addEventListener("DOMContentLoaded", () => {
  // Add click event listeners to all FAQ questions
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("keydown", function (e) {
      // Allow keyboard navigation (Enter and Space)
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFAQ(this);
      }
    });
  });

  // Add ARIA attributes for accessibility
  faqQuestions.forEach((question, index) => {
    question.setAttribute("aria-expanded", "false");
    question.setAttribute("aria-controls", `faq-answer-${index}`);

    const answer = question.nextElementSibling;
    answer.setAttribute("id", `faq-answer-${index}`);
    answer.setAttribute("aria-labelledby", `faq-question-${index}`);
    question.setAttribute("id", `faq-question-${index}`);
  });
});

// Update FAQ ARIA attributes when toggled
const originalToggleFAQ = toggleFAQ;
toggleFAQ = (button) => {
  const wasActive = button.parentElement.classList.contains("active");

  originalToggleFAQ(button);

  // Update ARIA attribute
  button.setAttribute("aria-expanded", !wasActive ? "true" : "false");
};
