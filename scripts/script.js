document.addEventListener("DOMContentLoaded", function () {
  const redirectBtn = document.querySelector(".redirect");
  const redirectBtnTwo = document.querySelector(".redirect-two");
  const getOtpBtn = document.getElementById("getOtpBtn");
  const otpModal = document.getElementById("otpModal");
  const modalMobile = document.getElementById("modalMobile");
  const cancelOtpModal = document.getElementById("cancelOtpModal");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const chargeAndTax = document.querySelectorAll(".chargeandTax");

  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("close-btn");

  const startAnim = document.getElementById("start");
  const reverseAnim = document.getElementById("reverse");

  function openSidebar() {
    sidebar.classList.add("open");
    overlay.classList.add("active");
    closeBtn.classList.add("visible");
    startAnim?.beginElement(); // Trigger hamburger → cross
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
    closeBtn.classList.remove("visible");
    reverseAnim?.beginElement(); // Trigger cross → hamburger
  }

  menuBtn?.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);

  getOtpBtn?.addEventListener("click", () => {
    const mobileInput = document.getElementById("tenant_mobile").value;
    if (/^\d{10}$/.test(mobileInput)) {
      modalMobile.textContent = mobileInput;
      otpModal.classList.remove("hidden");
      document.getElementById("tenant_mobile_error").classList.add("hidden");
    } else {
      document.getElementById("tenant_mobile_error").classList.remove("hidden");
    }
  });

  cancelOtpModal?.addEventListener("click", () => {
    otpModal.classList.add("hidden");
  });

  verifyOtpBtn?.addEventListener("click", () => {
    const otpInput = otpModal.querySelector('input[type="text"]');
    const otpValue = otpInput.value.trim();

    if (/^\d{4}$/.test(otpValue)) {
      otpModal.classList.add("hidden");
      otpInput.value = "";
      otpInput.classList.remove("border-red-500");
    } else {
      otpInput.classList.add("border-red-500");
      otpInput.focus();
    }
  });

  redirectBtn?.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "../select-option-credit.html";
    localStorage.setItem("PaymentMode", "credit");
  });

  redirectBtnTwo?.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "../select-option-debit.html";
    localStorage.setItem("PaymentMode", "debit"); // also corrected this line
  });

  const paymentMode = localStorage.getItem("PaymentMode");

  if (paymentMode === "credit") {
    chargeAndTax.forEach(el => {
      el.classList.remove("hidden");
      el.classList.add("block");
    });
  } else {
    chargeAndTax.forEach(el => {
      el.classList.remove("block");
      el.classList.add("hidden");
    });
  }

  // AOS Init
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
      keyframes: {
        progressStripe: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 0" },
        },
      },
      animation: {
        progressStripe: "progressStripe 1s linear infinite",
      },
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
