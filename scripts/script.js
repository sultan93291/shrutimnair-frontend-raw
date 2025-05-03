const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");
const redirectBtn = document.querySelector(".redirect");
const redirectBtnTwo = document.querySelector(".redirect-two");

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 700,
    easing: "ease-in-out",
    once: true,
    offset: 100,
  });
});

tailwind.config = {
  theme: {
    extend: {
      colors: {
        LightGreen: "#80FFE84D",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        TabShadow: "0px 3.456px 9.217px 0px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      screens: {
        xs: "360px",
        sm: "480px",
        md: "576px",
        lg: "768px",
        xl: "992px",
        "2xl": "1200px",
        "3xl": "1500px",
        "4xl": "1920px",
      },
    },
  },
};

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("-translate-x-full");
  overlay.classList.toggle("opacity-0");
  overlay.classList.toggle("pointer-events-none");
  document.body.classList.toggle("overflow-hidden");
});

overlay.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("opacity-0", "pointer-events-none");
  document.body.classList.remove("overflow-hidden");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("opacity-0", "pointer-events-none");
  document.body.classList.remove("overflow-hidden");
});

redirectBtn.addEventListener("click", () => {
  window.location.href = "../select-option.html";
});

redirectBtnTwo.addEventListener("click", () => {
  window.location.href = "../select-option.html";
});
document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");
  const stepContents = document.querySelectorAll(".step-content");
  const progressLine = document.getElementById("progress-line");
  const nextButtons = document.querySelectorAll(".next-step");
  const prevButtons = document.querySelectorAll(".prev-step");
  const submitButton = document.getElementById("submit-form");

  let currentStep = 2; // Start at Rental Details (step 2)

  // Load saved data if it exists
  loadFormData();

  // Next button click handler
  nextButtons.forEach(button => {
    button.addEventListener("click", function () {
      if (validateCurrentStep()) {
        saveFormData();
        currentStep++;
        updateProgress();
        showCurrentStep();
      }
    });
  });

  // Previous button click handler
  prevButtons.forEach(button => {
    button.addEventListener("click", function () {
      currentStep--;
      updateProgress();
      showCurrentStep();
    });
  });

  // Submit button click handler
  if (submitButton) {
    submitButton.addEventListener("click", function () {
      if (validateCurrentStep()) {
        saveFormData();
        alert("Form submitted successfully!");
        // Here you would typically send data to server
        localStorage.removeItem("rentFormData"); // Clear saved data
      }
    });
  }

  // Update progress visualization
  function updateProgress() {
    // Update progress line
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
    progressLine.style.width = `${progressPercentage}%`;

    // Update step indicators
    steps.forEach(step => {
      const stepNumber = parseInt(step.getAttribute("data-step"));
      const stepCircle = step.querySelector("div");

      stepCircle.classList.remove(
        "bg-blue-600",
        "bg-green-500",
        "text-white",
        "bg-white",
        "border-gray-300",
        "text-gray-600",
        "border-2"
      );

      if (stepNumber < currentStep) {
        stepCircle.classList.add("bg-green-500", "text-white");
      } else if (stepNumber === currentStep) {
        stepCircle.classList.add("bg-blue-600", "text-white");
      } else {
        stepCircle.classList.add(
          "bg-white",
          "border-2",
          "border-gray-300",
          "text-gray-600"
        );
      }
    });
  }

  // Show the current step content
  function showCurrentStep() {
    stepContents.forEach(content => {
      content.classList.add("hidden");
      content.classList.remove("active");
    });

    const currentContent = document.querySelector(
      `.step-content[data-step="${currentStep}"]`
    );
    if (currentContent) {
      currentContent.classList.remove("hidden");
      currentContent.classList.add("active");

      // Special handling for summary step
      if (currentStep === 6) {
        displaySummaryData();
      }
    }

    // Disable previous button on first step
    const prevButtons = document.querySelectorAll(".prev-step");
    prevButtons.forEach(button => {
      button.disabled = currentStep === 1;
    });
  }

  // Validate current step
  function validateCurrentStep() {
    let isValid = true;

    // Hide all error messages first
    document.querySelectorAll('[id$="_error"]').forEach(el => {
      el.classList.add("hidden");
    });

    // Validate fields in current step
    const currentContent = document.querySelector(
      `.step-content[data-step="${currentStep}"]`
    );
    if (currentContent) {
      const requiredFields =
        currentContent.querySelectorAll("[required], [name]");

      requiredFields.forEach(field => {
        if (!field.value && field.hasAttribute("required")) {
          const errorId = `${field.name}_error`;
          const errorElement = document.getElementById(errorId);
          if (errorElement) {
            errorElement.classList.remove("hidden");
          }
          isValid = false;

          // Highlight the field
          field.classList.add("border-red-500");
          field.classList.remove("border-gray-300");
          field.addEventListener("input", function () {
            field.classList.remove("border-red-500");
            field.classList.add("border-gray-300");
          });
        }
      });
    }

    return isValid;
  }

  // Save form data to localStorage
  function saveFormData() {
    const formData = {};

    // Collect all form data
    document.querySelectorAll("input, select").forEach(field => {
      if (field.name) {
        formData[field.name] = field.value;
      }
    });

    localStorage.setItem("rentFormData", JSON.stringify(formData));
  }

  // Load form data from localStorage
  function loadFormData() {
    const savedData = localStorage.getItem("rentFormData");
    if (savedData) {
      const formData = JSON.parse(savedData);

      // Populate form fields
      Object.keys(formData).forEach(key => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) {
          field.value = formData[key];
        }
      });
    }
  }

  // Display summary data
  function displaySummaryData() {
    const summaryContainer = document.getElementById("summary-data");
    summaryContainer.innerHTML = "";

    const savedData = localStorage.getItem("rentFormData");
    if (savedData) {
      const formData = JSON.parse(savedData);

      for (const [key, value] of Object.entries(formData)) {
        if (value) {
          const formattedKey = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase());
          const item = document.createElement("div");
          item.className = "border-b border-gray-200 pb-2";
          item.innerHTML = `
                                <p class="font-medium text-gray-700">${formattedKey}</p>
                                <p class="text-gray-600">${value}</p>
                            `;
          summaryContainer.appendChild(item);
        }
      }
    }
  }

  // Initialize the form
  updateProgress();
  showCurrentStep();
});
