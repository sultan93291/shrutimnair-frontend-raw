document.addEventListener("DOMContentLoaded", function () {
  // Initialize form state
  const formState = {
    currentStep: 1,
    totalSteps: 6,
    formData: {},
  };

  // DOM elements
  const domElements = {
    stepContents: document.querySelectorAll(".step-content"),
    prevButton: document.querySelector(".prev-step"),
    nextButtons: document.querySelectorAll(".next-step button"),
    prevButtons: document.querySelectorAll(".prev-step button"),
    buttonContainer: document.querySelector(".form-button-container"),
    activeProgressBar: document.querySelector(".progres-width"),
    stepLabels: document.querySelectorAll(".step-label"),
    activePercent: document.querySelector(".active-percent"),
    fileUploadContainer: document.getElementById("file-upload-container"),
    addMoreButton: document.getElementById("addMoreButton"),
    dropzoneTemplate: document.querySelector("#dropzone-template"),
    agencyAccountContainer: document.getElementById("agency-account-container"),
    payerDetailsSummary: document
      .getElementById("payer-details-summary")
      .querySelector(".details"),
    propertyAddressSummary: document
      .getElementById("property-address-summary")
      .querySelector(".details"),
    propertyDetailsSummary: document
      .getElementById("property-details-summary")
      .querySelector(".details"),
    agencyDetailsSummary: document
      .getElementById("agency-details-summary")
      .querySelector(".details"),
    filesSummary: document
      .getElementById("files-summary")
      .querySelector(".flex"),
    editDetailsButton: document.querySelector(
      "#summary[data-step='6'] .summary-header p"
    ),
    submitButton: document.querySelector(".submit-button"),
  };

  // Validation rules for all fields
  const validationRules = {
    // Step 1: Payer Details
    user_type: {
      required: true,
      validate: () => document.querySelector('input[name="user_type"]:checked'),
      error: "Please select whether you are a Tenant or Owner",
    },
    payer_type: {
      required: true,
      validate: () =>
        document.querySelector('input[name="payer_type"]:checked'),
      error: "Please select Payer Type (Company or Individual)",
    },
    salutation: {
      required: true,
      validate: value => ["Mr", "Ms", "Dr"].includes(value),
      error: "Please select a valid title (Mr, Ms, Dr)",
    },
    first_name: {
      required: true,
      validate: value => /^[A-Za-z]{1,50}$/.test(value),
      error: "First name must contain only letters (max 50 characters)",
    },
    middle_name: {
      required: false,
      validate: value => !value || /^[A-Za-z]{1,50}$/.test(value),
      error: "Middle name must contain only letters (max 50 characters)",
    },
    last_name: {
      required: true,
      validate: value => /^[A-Za-z]{1,50}$/.test(value),
      error: "Last name must contain only letters (max 50 characters)",
    },
    dob: {
      required: true,
      validate: value => {
        const date = new Date(value);
        const today = new Date();
        const minAgeDate = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate()
        );
        return !isNaN(date.getTime()) && date <= minAgeDate;
      },
      error:
        "Please enter a valid date of birth (must be at least 18 years old)",
    },
    mobile: {
      required: true,
      validate: value => /^[6-9][0-9]{9}$/.test(value),
      error:
        "Please enter a valid 10-digit Indian mobile number (starting with 6-9)",
    },
    email: {
      required: true,
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      error: "Please enter a valid email address",
    },
    city: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid city name (letters only, max 100 characters)",
    },
    pin: {
      required: true,
      validate: value => /^[0-9]{6}$/.test(value),
      error: "Please enter a valid 6-digit pin code",
    },
    address: {
      required: true,
      validate: value => value.length >= 5 && value.length <= 200,
      error: "Please enter a valid address (5–200 characters)",
    },
    // Step 2: Property Address
    apartment_number: {
      required: true,
      validate: value => /^[A-Za-z0-9\s-]{1,50}$/.test(value),
      error:
        "Please enter a valid apartment number (alphanumeric, max 50 characters)",
    },
    address_line_1: {
      required: true,
      validate: value => value.length >= 5 && value.length <= 100,
      error: "Please enter a valid address line 1 (5–100 characters)",
    },
    address_line_2: {
      required: false,
      validate: value => !value || value.length <= 100,
      error: "Please enter a valid address line 2 (max 100 characters)",
    },
    street_landmark: {
      required: false,
      validate: value => !value || value.length <= 100,
      error: "Please enter a valid street landmark (max 100 characters)",
    },
    state: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid state name (letters only, max 100 characters)",
    },
    property_city: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid city name (letters only, max 100 characters)",
    },
    property_pin: {
      required: true,
      validate: value => /^[0-9]{6}$/.test(value),
      error: "Please enter a valid 6-digit pin code",
    },
    // Step 3: Property Details
    maintenance_amount: {
      required: true,
      validate: value => !isNaN(value) && parseFloat(value) > 0,
      error: "Please enter a valid maintenance amount",
    },
    pan_number: {
      required: true,
      validate: value => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
      error: "Please enter a valid 10-character PAN number",
    },
    gstin: {
      required: false,
      validate: value =>
        !value ||
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
      error: "Please enter a valid 15-character GSTIN",
    },
  };

  // Initialize dynamic validation rules for agency accounts
  function updateAgencyValidationRules() {
    const accountBlocks = domElements.agencyAccountContainer.querySelectorAll(
      ".agency-account-block"
    );
    accountBlocks.forEach((block, index) => {
      const idx = index + 1;
      validationRules[`agency_name_${idx}`] = {
        required: true,
        validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
        error:
          "Please enter a valid society/agency name (letters only, max 100 characters)",
      };
      validationRules[`agency_phone_${idx}`] = {
        required: true,
        validate: value => /^[6-9][0-9]{9}$/.test(value),
        error:
          "Please enter a valid 10-digit Indian phone number (starting with 6-9)",
      };
      validationRules[`agency_email_${idx}`] = {
        required: true,
        validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        error: "Please enter a valid email address",
      };
      validationRules[`agency_pan_${idx}`] = {
        required: true,
        validate: value => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
        error: "Please enter a valid 10-character PAN number",
      };
      validationRules[`account_number_${idx}`] = {
        required: true,
        validate: value => /^[0-9]{9,18}$/.test(value),
        error: "Please enter a valid account number (9–18 digits)",
      };
      validationRules[`re_account_number_${idx}`] = {
        required: true,
        validate: value =>
          value ===
          document.querySelector(`[name="account_number_${idx}"]`).value,
        error: "Account numbers do not match",
      };
      validationRules[`bank_ifsc_${idx}`] = {
        required: true,
        validate: value => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value),
        error: "Please enter a valid 11-character IFSC code",
      };
    });
  }

  // Initialize file upload validation
  function updateFileValidationRules() {
    const dropzones =
      domElements.fileUploadContainer.querySelectorAll(".dropzone-wrapper");
    dropzones.forEach((wrapper, index) => {
      const idx = index + 1;
      validationRules[`file_upload_${idx}`] = {
        required: idx === 1, // Only the first file upload is required
        validate: () => {
          const fileInput = wrapper.querySelector(".file-input");
          if (!fileInput.files.length && idx === 1) return false;
          const allowedTypes = [
            "image/png",
            "application/pdf",
            "image/jpeg",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];
          const maxSize = 5 * 1024 * 1024; // 5MB
          const maxFiles = 5;
          if (fileInput.files.length > maxFiles) return false;
          for (let file of fileInput.files) {
            if (!allowedTypes.includes(file.type) || file.size > maxSize)
              return false;
          }
          return true;
        },
        error: `Please upload at least one valid file (PNG, PDF, JPG, DOCX, max 5MB, max 5 files) for upload #${idx}`,
      };
    });
  }

  // Setup initial dropzone
  const firstDropzone =
    domElements.fileUploadContainer.querySelector(".dropzone-wrapper");
  firstDropzone.querySelector(".dropzone-remove").classList.add("hidden");
  setupDropzone(firstDropzone.querySelector("#dropzone-template"));

  // Add more dropzone functionality
  domElements.addMoreButton.addEventListener("click", function () {
    const dropzoneCount = document.querySelectorAll(".dropzone-wrapper").length;
    if (dropzoneCount >= 5) {
      alert("Maximum 5 file uploads allowed.");
      return;
    }
    const newDropzoneWrapper = document.createElement("div");
    newDropzoneWrapper.className = "dropzone-wrapper relative";
    const newDropzone = domElements.dropzoneTemplate.cloneNode(true);
    newDropzone.id = "";
    const fileInput = newDropzone.querySelector(".file-input");
    fileInput.name = `file_upload_${dropzoneCount + 1}`;
    fileInput.value = "";
    newDropzone.querySelector(".dropzone-remove").classList.remove("hidden");
    newDropzone
      .querySelector(".file-selection-text")
      .classList.remove("hidden");
    newDropzone.querySelector(".selected-filename").classList.add("hidden");
    newDropzone.querySelector(".selected-filename").textContent = "";
    newDropzoneWrapper.appendChild(newDropzone);
    domElements.fileUploadContainer.appendChild(newDropzoneWrapper);
    setupDropzone(newDropzone);
    updateFileValidationRules();
  });

  // Setup dropzone event listeners
  function setupDropzone(dropzone) {
    const fileInput = dropzone.querySelector(".file-input");
    const removeButton = dropzone.querySelector(".dropzone-remove");
    const fileSelectionText = dropzone.querySelector(".file-selection-text");
    const selectedFilename = dropzone.querySelector(".selected-filename");

    fileInput.addEventListener("change", function (e) {
      if (e.target.files.length > 0) {
        selectedFilename.textContent = Array.from(e.target.files)
          .map(file => file.name)
          .join(", ");
        selectedFilename.classList.remove("hidden");
        fileSelectionText.classList.add("hidden");
      } else {
        selectedFilename.classList.add("hidden");
        fileSelectionText.classList.remove("hidden");
      }
      validateField(fileInput);
    });

    dropzone.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropzone.classList.add("border-blue-500", "bg-blue-50");
    });

    dropzone.addEventListener("dragleave", function () {
      dropzone.classList.remove("border-blue-500", "bg-blue-50");
    });

    dropzone.addEventListener("drop", function (e) {
      e.preventDefault();
      dropzone.classList.remove("border-blue-500", "bg-blue-50");
      if (e.dataTransfer.files.length > 0) {
        const dataTransfer = new DataTransfer();
        for (let i = 0; i < Math.min(e.dataTransfer.files.length, 5); i++) {
          dataTransfer.items.add(e.dataTransfer.files[i]);
        }
        fileInput.files = dataTransfer.files;
        const event = new Event("change");
        fileInput.dispatchEvent(event);
      }
    });

    removeButton.addEventListener("click", function () {
      dropzone.closest(".dropzone-wrapper").remove();
      updateFileValidationRules();
    });

    fileInput.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Add more agency account functionality
  document.addEventListener("click", function (e) {
    if (e.target.closest(".add-account")) {
      const accountBlocks = domElements.agencyAccountContainer.querySelectorAll(
        ".agency-account-block"
      );
      if (accountBlocks.length >= 3) {
        alert("Maximum 3 accounts allowed.");
        return;
      }
      const lastAccount = accountBlocks[accountBlocks.length - 1];
      const newAccount = lastAccount.cloneNode(true);
      const newIndex = accountBlocks.length + 1;
      newAccount.querySelector(
        "h3"
      ).textContent = `Maintenance/Agency Account Details #${newIndex}`;
      newAccount.querySelectorAll("input, select").forEach(field => {
        field.value = "";
        field.name = field.name.replace(/\d+$/, newIndex);
        const errorElement = field.parentElement.nextElementSibling;
        if (errorElement) {
          errorElement.id = `${field.name}_error`;
          errorElement.classList.add("hidden");
        }
      });
      newAccount
        .querySelectorAll("p.text-red-500")
        .forEach(p => p.classList.add("hidden"));
      const oldBtn = lastAccount.querySelector(".add-account");
      if (oldBtn) oldBtn.remove();
      domElements.agencyAccountContainer.appendChild(newAccount);
      updateAgencyValidationRules();
    }
  });

  // Initialize form
  initForm();

  function setupEventListeners() {
    domElements.nextButtons.forEach(button => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        nextStep();
      });
    });

    domElements.prevButtons.forEach(button => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        prevStep();
      });
    });

    domElements.editDetailsButton.addEventListener("click", function () {
      formState.currentStep = 1;
      showCurrentStep();
    });

    domElements.submitButton.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        formState.currentStep === formState.totalSteps &&
        validateCurrentStep()
      ) {
        submitForm();
      } else {
        alert(
          "Please complete all required fields in the current step before submitting."
        );
      }
    });

    // Real-time validation
    document.querySelectorAll("input, select, textarea").forEach(field => {
      field.addEventListener("input", () => validateField(field));
      field.addEventListener("change", () => validateField(field));
    });
  }

  function initForm() {
    updateAgencyValidationRules();
    updateFileValidationRules();
    showCurrentStep();
    restoreFormData();
    setupEventListeners();
  }

  function showCurrentStep() {
    domElements.stepContents.forEach(content =>
      content.classList.add("hidden")
    );
    const currentContent = document.querySelector(
      `.step-content[data-step="${formState.currentStep}"]`
    );
    if (currentContent) currentContent.classList.remove("hidden");
    updateProgressBar();
    updateNavigationButtons();
    if (formState.currentStep === 6) {
      displaySummary();
    }
  }

  function updateProgressBar() {
    const percent = Math.round(
      ((formState.currentStep - 1) / (formState.totalSteps - 1)) * 100
    );
    domElements.activePercent.innerHTML = `${percent}%`;
    const containerWidth =
      domElements.activeProgressBar.parentElement.offsetWidth;
    const leftPos = (percent / 100) * containerWidth;
    if (formState.currentStep === 1) {
      domElements.activePercent.style.left = `0px`;
      domElements.activePercent.classList.remove("-translate-x-1/2");
    } else {
      domElements.activePercent.style.left = `${leftPos}px`;
      domElements.activePercent.classList.add("-translate-x-1/2");
    }
    const progressWidths = {
      1: "2.5%",
      2: "20%",
      3: "39.9%",
      4: "59.3%",
      5: "79.6%",
      6: "100%",
    };
    domElements.activeProgressBar.style.width =
      progressWidths[formState.currentStep] || "0%";
    domElements.stepLabels.forEach((label, index) => {
      label.style.color = index < formState.currentStep ? "#2F5D50" : "#BFBFBF";
    });
  }

  function updateNavigationButtons() {
    domElements.prevButton.style.display =
      formState.currentStep === 1 ? "none" : "flex";
    domElements.nextButtons.forEach(btn => {
      btn.parentElement.style.display =
        formState.currentStep === formState.totalSteps ? "none" : "flex";
    });
    domElements.submitButton.style.display =
      formState.currentStep === formState.totalSteps ? "flex" : "none";
    domElements.buttonContainer.style.display =
      formState.currentStep !== 6 ? "flex" : "none";
  }

  function nextStep() {
    if (validateCurrentStep()) {
      saveFormData();
      if (formState.currentStep < formState.totalSteps) {
        formState.currentStep++;
        showCurrentStep();
      }
    } else {
      return;
    }
  }

  function prevStep() {
    if (formState.currentStep > 1) {
      formState.currentStep--;
      showCurrentStep();
    }
  }

  function validateCurrentStep() {
    let isValid = true;
    document
      .querySelectorAll('[id$="_error"]')
      .forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".input-styles").forEach(field => {
      field.classList.remove("border-red-500");
      field.classList.add("border-gray-300");
    });

    const currentContent = document.querySelector(
      `.step-content[data-step="${formState.currentStep}"]`
    );
    if (currentContent) {
      const fields = currentContent.querySelectorAll(
        "input[name], select[name], textarea[name]"
      );
      fields.forEach(field => {
        if (!validateField(field, true)) {
          isValid = false;
        }
      });

      // Special handling for radio buttons in Step 1
      if (formState.currentStep === 1) {
        const userType = document.querySelector(
          'input[name="user_type"]:checked'
        );
        const payerType = document.querySelector(
          'input[name="payer_type"]:checked'
        );
        const userTypeError = document.getElementById("user_type_error");
        const payerTypeError = document.getElementById("payer_type_error");
        if (!userType) {
          showError(
            document.querySelector('input[name="user_type"]'),
            userTypeError,
            validationRules.user_type.error
          );
          isValid = false;
        }
        if (!payerType) {
          showError(
            document.querySelector('input[name="payer_type"]'),
            payerTypeError,
            validationRules.payer_type.error
          );
          isValid = false;
        }
      }

      // Ensure dynamic agency account fields are validated
      if (formState.currentStep === 4) {
        const accountBlocks =
          domElements.agencyAccountContainer.querySelectorAll(
            ".agency-account-block"
          );
        accountBlocks.forEach((block, index) => {
          const idx = index + 1;
          [
            "agency_name",
            "agency_phone",
            "agency_email",
            "agency_pan",
            "account_number",
            "re_account_number",
            "bank_ifsc",
          ].forEach(field => {
            const input = block.querySelector(`[name="${field}_${idx}"]`);
            if (input && !validateField(input, true)) {
              isValid = false;
            }
          });
        });
      }

      // Ensure file uploads are validated
      if (formState.currentStep === 5) {
        const dropzones =
          domElements.fileUploadContainer.querySelectorAll(".dropzone-wrapper");
        dropzones.forEach((wrapper, index) => {
          const idx = index + 1;
          const fileInput = wrapper.querySelector(".file-input");
          if (!validateField(fileInput, true)) {
            isValid = false;
          }
        });
      }
    }

    return isValid;
  }

  function validateField(field, batch = false) {
    const fieldName = field.name;
    const rule = validationRules[fieldName];
    if (!rule) return true;

    const value = field.type === "file" ? field.files : field.value.trim();
    const errorElement = document.getElementById(`${fieldName}_error`);
    let isValid = true;

    field.classList.remove("border-red-500");
    field.classList.add("border-gray-300");
    if (errorElement) errorElement.classList.add("hidden");

    if (
      rule.required &&
      ((field.type !== "file" && value === "") ||
        (field.type === "file" && !value.length))
    ) {
      showError(field, errorElement, rule.error);
      isValid = false;
    } else if (rule.validate && !rule.validate(value)) {
      showError(field, errorElement, rule.error);
      isValid = false;
    }

    return isValid;
  }

  function showError(field, errorElement, message) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove("hidden");
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", errorElement.id);
    }
    field.classList.remove("border-gray-300");
    field.classList.add("border-red-500");
  }

  function saveFormData() {
    const formData = { ...formState.formData };
    document.querySelectorAll("input, select, textarea").forEach(field => {
      if (field.name) {
        if (field.type === "radio") {
          if (field.checked) formData[field.name] = field.value;
        } else if (field.type === "file") {
          if (field.files.length) {
            formData[field.name] = Array.from(field.files).map(file => ({
              name: file.name,
              type: file.type,
              size: file.size,
            }));
          } else {
            delete formData[field.name]; // Remove empty file inputs
          }
        } else {
          formData[field.name] = field.value;
        }
      }
    });
    formState.formData = formData;
    localStorage.setItem("maintenanceFormData", JSON.stringify(formData));
  }

  function restoreFormData() {
    const data = JSON.parse(localStorage.getItem("maintenanceFormData")) || {};
    formState.formData = data;
    Object.keys(data).forEach(key => {
      const field = document.querySelector(`[name="${key}"]`);
      if (field && key !== "file_upload_1" && !key.startsWith("file_upload_")) {
        if (field.type === "radio") {
          const radio = document.querySelector(
            `input[name="${key}"][value="${data[key]}"]`
          );
          if (radio) radio.checked = true;
        } else {
          field.value = data[key];
        }
      }
    });
    // Restore dynamic agency accounts
    const accountKeys = Object.keys(data).filter(k =>
      k.startsWith("agency_name_")
    );
    const accountCount = accountKeys.length;
    if (accountCount > 1) {
      for (let i = 2; i <= accountCount; i++) {
        const event = new Event("click");
        domElements.agencyAccountContainer
          .querySelector(".add-account")
          .dispatchEvent(event);
      }
    }
    // Restore file uploads
    const fileKeys = Object.keys(data).filter(k =>
      k.startsWith("file_upload_")
    );
    if (fileKeys.length > 1) {
      for (let i = 2; i <= fileKeys.length; i++) {
        domElements.addMoreButton.click();
      }
    }
  }

  function displaySummary() {
    const data = formState.formData;

    // Payer Details
    domElements.payerDetailsSummary.innerHTML = `
      <div class="text-gray-700 w-screen space-y-4">
        <div class="flex flex-col md:flex-row justify-between gap-4 w-full">
          <div class="flex-1">
            <h6 class="font-extrabold text-xl">User Type</h6>
            <p class="font-semibold text-lg">${data.user_type || "N/A"}</p>
          </div>
          <div class="flex-1">
            <h6 class="font-extrabold text-xl">Payer Type</h6>
            <p class="font-semibold text-lg">${data.payer_type || "N/A"}</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <h6 class="font-extrabold text-xl">Name</h6>
            <p class="font-semibold text-lg">${data.salutation || ""} ${
      data.first_name || ""
    } ${data.middle_name || ""} ${data.last_name || ""}</p>
          </div>
          <div>
            <h6 class="font-extrabold text-xl">Email</h6>
            <p class="font-semibold text-lg">${data.email || "N/A"}</p>
          </div>
          <div>
            <h6 class="font-extrabold text-xl">Mobile Number</h6>
            <p class="font-semibold text-lg">${data.mobile || "N/A"}</p>
          </div>
          <div>
            <h6 class="font-extrabold text-xl">Date of Birth</h6>
            <p class="font-semibold text-lg">${data.dob || "N/A"}</p>
          </div>
          <div>
            <h6 class="font-extrabold text-xl">City</h6>
            <p class="font-semibold text-lg">${data.city || "N/A"}</p>
          </div>
          <div>
            <h6 class="font-extrabold text-xl">Pin Code</h6>
            <p class="font-semibold text-lg">${data.pin || "N/A"}</p>
          </div>
          <div>
            <h6 class="font-extrabold text-xl">Address</h6>
            <p class="font-semibold text-lg">${data.address || "N/A"}</p>
          </div>
        </div>
      </div>
    `;

    // Property Address
    domElements.propertyAddressSummary.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <h6 class="font-extrabold text-xl">Apartment Number</h6>
          <p class="font-semibold text-lg">${data.apartment_number || "N/A"}</p>
        </div>
        <div>
          <h6 class="font-extrabold text-xl">Address Line 1</h6>
          <p class="font-semibold text-lg">${data.address_line_1 || "N/A"}</p>
        </div>
        <div>
          <h6 class="font-extrabold text-xl">Address Line 2</h6>
          <p class="font-semibold text-lg">${data.address_line_2 || "N/A"}</p>
        </div>
        <div>
          <h6 class="font-extrabold text-xl">Street Landmark</h6>
          <p class="font-semibold text-lg">${data.street_landmark || "N/A"}</p>
        </div>
        <div>
          <h6 class="font-extrabold text-xl">State</h6>
          <p class="font-semibold text-lg">${data.state || "N/A"}</p>
        </div>
        <div>
          <h6 class="font-extrabold text-xl">City</h6>
          <p class="font-semibold text-lg">${data.property_city || "N/A"}</p>
        </div>
        <div>
          <h6 class="font-extrabold text-xl">Pin Code</h6>
          <p class="font-semibold text-lg">${data.property_pin || "N/A"}</p>
        </div>
      </div>
    `;

    // Property Details
    domElements.propertyDetailsSummary.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <h6 class="font-extrabold text-xl">Maintenance Amount</h6>
          <p class="font-semibold text-lg">₹${
            data.maintenance_amount || "N/A"
          }</p>
        </div>
        <div>
          <h6 class="font-extrabold text-xl">PAN Number</h6>
          <p class="font-semibold text-lg">${data.pan_number || "N/A"}</p>
        </div>
        <div>
          <h6 class="font-extrabold text-xl">GSTIN</h6>
          <p class="font-semibold text-lg">${data.gstin || "N/A"}</p>
        </div>
      </div>
    `;

    // Agency Details
    let agencyDetailsHtml = "";
    const accountKeys = Object.keys(data).filter(k =>
      k.startsWith("agency_name_")
    );
    if (accountKeys.length > 0) {
      accountKeys.forEach((_, idx) => {
        const index = idx + 1;
        agencyDetailsHtml += `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 py-4 border-t border-gray-200">
            <div>
              <h6 class="font-extrabold text-xl">Society/Agency Name #${index}</h6>
              <p class="font-semibold text-lg">${
                data[`agency_name_${index}`] || "N/A"
              }</p>
            </div>
            <div>
              <h6 class="font-extrabold text-xl">Phone Number #${index}</h6>
              <p class="font-semibold text-lg">${
                data[`agency_phone_${index}`] || "N/A"
              }</p>
            </div>
            <div>
              <h6 class="font-extrabold text-xl">Email #${index}</h6>
              <p class="font-semibold text-lg">${
                data[`agency_email_${index}`] || "N/A"
              }</p>
            </div>
            <div>
              <h6 class="font-extrabold text-xl">PAN Number #${index}</h6>
              <p class="font-semibold text-lg">${
                data[`agency_pan_${index}`] || "N/A"
              }</p>
            </div>
            <div>
              <h6 class="font-extrabold text-xl">Account Number #${index}</h6>
              <p class="font-semibold text-lg">${
                data[`account_number_${index}`] || "N/A"
              }</p>
            </div>
            <div>
              <h6 class="font-extrabold text-xl">IFSC #${index}</h6>
              <p class="font-semibold text-lg">${
                data[`bank_ifsc_${index}`] || "N/A"
              }</p>
            </div>
          </div>
        `;
      });
    } else {
      agencyDetailsHtml =
        '<p class="text-lg text-gray-700">No agency details available</p>';
    }
    domElements.agencyDetailsSummary.innerHTML = agencyDetailsHtml;

    // Files
    let filesHtml = "";
    const fileKeys = Object.keys(data).filter(k =>
      k.startsWith("file_upload_")
    );
    if (fileKeys.length > 0) {
      filesHtml =
        '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">';
      fileKeys.forEach(key => {
        const files = data[key];
        files.forEach(file => {
          const extension = file.name.split(".").pop().toLowerCase();
          const iconUrl =
            extension === "pdf"
              ? "https://img.icons8.com/color/96/pdf.png"
              : "https://img.icons8.com/color/96/image.png";
          filesHtml += `
            <div class="flex flex-col items-center p-2">
              <img src="${iconUrl}" alt="${extension.toUpperCase()} Icon" class="w-12 h-12" />
              <p class="mt-2 text-xs text-gray-700 text-center truncate">${
                file.name
              }</p>
            </div>
          `;
        });
      });
      filesHtml += "</div>";
    } else {
      filesHtml = '<p class="text-lg text-gray-700">No files uploaded</p>';
    }
    domElements.filesSummary.innerHTML = filesHtml;
  }

  function submitForm() {
    // Validate all steps before submission
    let allStepsValid = true;
    const originalStep = formState.currentStep;

    // Validate each step
    for (let step = 1; step <= formState.totalSteps; step++) {
      formState.currentStep = step;
      if (!validateCurrentStep()) {
        allStepsValid = false;
        alert(
          `Validation failed in Step ${step}. Please review and correct the errors.`
        );
        break;
      }
    }

    // Restore original step
    formState.currentStep = originalStep;
    showCurrentStep();

    if (!allStepsValid) {
      return;
    }

    // Prepare form data for submission
    const submissionData = { ...formState.formData };

    // Handle file data
    const fileKeys = Object.keys(submissionData).filter(k =>
      k.startsWith("file_upload_")
    );
    fileKeys.forEach(key => {
      submissionData[key] = submissionData[key].map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));
    });

    try {
      // Simulate form submission (replace with actual API call if needed)
      console.log("Submitting form data:", submissionData);

      // Example for real submission:
      /*
          const formData = new FormData();
          Object.keys(submissionData).forEach(key => {
            if (key.startsWith('file_upload_')) {
              const input = document.querySelector(`input[name="${key}"]`);
              Array.from(input.files).forEach(file => formData.append(key, file));
            } else {
              formData.append(key, submissionData[key]);
            }
          });
    
          const response = await fetch('https://your-api-endpoint.com/submit', {
            method: 'POST',
            body: formData
          });
          if (!response.ok) throw new Error('Submission failed');
          */

      // Show success message
      alert("Form submitted successfully! Thank you for your submission.");

      // Clear form data and reset
      localStorage.removeItem("maintenanceFormData");
      formState.formData = {};
      formState.currentStep = 1;

      // Reset form fields
      document.querySelectorAll("input, select, textarea").forEach(field => {
        if (field.type === "radio" || field.type === "checkbox") {
          field.checked = false;
        } else if (field.type !== "file") {
          field.value = "";
        }
      });

      // Reset dynamic fields (agency accounts and file uploads)
      const agencyBlocks = domElements.agencyAccountContainer.querySelectorAll(
        ".agency-account-block"
      );
      for (let i = 1; i < agencyBlocks.length; i++) {
        agencyBlocks[i].remove();
      }
      const dropzones =
        domElements.fileUploadContainer.querySelectorAll(".dropzone-wrapper");
      for (let i = 1; i < dropzones.length; i++) {
        dropzones[i].remove();
      }
      const firstDropzone =
        domElements.fileUploadContainer.querySelector(".dropzone-wrapper");
      firstDropzone.querySelector(".file-input").value = "";
      firstDropzone.querySelector(".selected-filename").classList.add("hidden");
      firstDropzone
        .querySelector(".file-selection-text")
        .classList.remove("hidden");
      firstDropzone.querySelector(".selected-filename").textContent = "";

      // Update validation rules
      updateAgencyValidationRules();
      updateFileValidationRules();

      // Reset to initial step
      showCurrentStep();
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred during submission. Please try again later.");
    }
  }
});
