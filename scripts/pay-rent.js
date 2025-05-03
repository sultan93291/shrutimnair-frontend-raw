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
    ownerAccountContainer: document.getElementById("owner-account-container"),
    tenantDetailsSummary: document
      .getElementById("tenant-details-summary")
      .querySelector(".details"),
    rentalDetailsSummary: document
      .getElementById("rental-details-summary")
      .querySelector(".details"),
    ownerDetailsSummary: document
      .getElementById("owner-details-summary")
      .querySelector(".details"),
    ownerAccountsSummary: document
      .getElementById("owner-accounts-summary")
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
    tenant_type: {
      required: true,
      validate: () =>
        document.querySelector('input[name="tenant_type"]:checked'),
      error: "Please select tenant type (Individual or Company)",
    },
    salutation: {
      required: true,
      validate: value => value !== "",
      error: "Please select your title",
    },
    tenant_first_name: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,50}$/.test(value),
      error:
        "Please enter a valid first name (letters only, max 50 characters)",
    },
    tenant_middle_name: {
      required: false,
      validate: value => !value || /^[A-Za-z\s]{1,50}$/.test(value),
      error:
        "Please enter a valid middle name (letters only, max 50 characters)",
    },
    tenant_last_name: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,50}$/.test(value),
      error: "Please enter a valid last name (letters only, max 50 characters)",
    },
    tenant_dob: {
      required: true,
      validate: value => {
        const date = new Date(value);
        const today = new Date();
        return !isNaN(date.getTime()) && date < today;
      },
      error: "Please enter a valid date of birth in the past",
    },
    tenant_mobile: {
      required: true,
      validate: value => /^[0-9]{10}$/.test(value),
      error: "Please enter a valid 10-digit mobile number",
    },
    tenant_email: {
      required: true,
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      error: "Please enter a valid email address",
    },
    tenant_city: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid city name (letters only, max 100 characters)",
    },
    tenant_pin: {
      required: true,
      validate: value => /^[0-9]{6}$/.test(value),
      error: "Please enter a valid 6-digit pin code",
    },
    tenant_address: {
      required: true,
      validate: value => value.length >= 5 && value.length <= 200,
      error: "Please enter a valid address (5–200 characters)",
    },
    rent_amount: {
      required: true,
      validate: value => !isNaN(value) && parseFloat(value) > 0,
      error: "Please enter a valid rent amount",
    },
    tenant_pan: {
      required: true,
      validate: value => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
      error: "Please enter a valid 10-character PAN number",
    },
    payment_frequency: {
      required: true,
      validate: value => ["monthly", "yearly"].includes(value),
      error: "Please select payment frequency",
    },
    gstin: {
      required: false,
      validate: value =>
        !value ||
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
      error: "Please enter a valid 15-character GSTIN",
    },
    due_date: {
      required: true,
      validate: value => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      error: "Please enter a valid due date",
    },
    agreement_expiry: {
      required: true,
      validate: value => {
        const date = new Date(value);
        const dueDate = new Date(
          document.querySelector('[name="due_date"]').value
        );
        return !isNaN(date.getTime()) && (!dueDate || date > dueDate);
      },
      error: "Please enter a valid expiry date after the due date",
    },
    card_issuing_bank: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid bank name (letters only, max 100 characters)",
    },
    owner_salutation: {
      required: true,
      validate: value => value !== "",
      error: "Please select owner title",
    },
    owner_first_name: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,50}$/.test(value),
      error:
        "Please enter a valid owner first name (letters only, max 50 characters)",
    },
    owner_middle_name: {
      required: false,
      validate: value => !value || /^[A-Za-z\s]{1,50}$/.test(value),
      error:
        "Please enter a valid owner middle name (letters only, max 50 characters)",
    },
    owner_last_name: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,50}$/.test(value),
      error:
        "Please enter a valid owner last name (letters only, max 50 characters)",
    },
    owner_mobile: {
      required: true,
      validate: value => /^[0-9]{10}$/.test(value),
      error: "Please enter a valid 10-digit owner mobile number",
    },
    owner_email: {
      required: true,
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      error: "Please enter a valid owner email address",
    },
    owner_pan: {
      required: true,
      validate: value => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
      error: "Please enter a valid 10-character owner PAN number",
    },
  };

  // Initialize dynamic validation rules for owner accounts
  function updateAccountValidationRules() {
    const accountBlocks = domElements.ownerAccountContainer.querySelectorAll(
      ".owner-account-block"
    );
    accountBlocks.forEach((block, index) => {
      const idx = index + 1;
      validationRules[`account_holder_name_${idx}`] = {
        required: true,
        validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
        error:
          "Please enter a valid account holder name (letters only, max 100 characters)",
      };
      validationRules[`account_rent_amount_${idx}`] = {
        required: true,
        validate: value => !isNaN(value) && parseFloat(value) > 0,
        error: "Please enter a valid rent amount",
      };
      validationRules[`account_type_${idx}`] = {
        required: true,
        validate: value => ["active", "inactive"].includes(value),
        error: "Please select account type",
      };
      validationRules[`account_pan_${idx}`] = {
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
        required: idx === 1,
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
          for (let file of fileInput.files) {
            if (!allowedTypes.includes(file.type) || file.size > maxSize)
              return false;
          }
          return true;
        },
        error:
          "Please upload at least one valid file (PNG, PDF, JPG, DOCX, max 5MB)",
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
    const newDropzoneWrapper = document.createElement("div");
    newDropzoneWrapper.className = "dropzone-wrapper relative";
    const newDropzone = domElements.dropzoneTemplate.cloneNode(true);
    newDropzone.id = "";
    const fileInput = newDropzone.querySelector(".file-input");
    fileInput.name = `file_upload_${
      document.querySelectorAll(".dropzone-wrapper").length + 1
    }`;
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
        selectedFilename.textContent = e.target.files[0].name;
        selectedFilename.classList.remove("hidden");
        fileSelectionText.classList.add("hidden");
      } else {
        selectedFilename.classList.add("hidden");
        fileSelectionText.classList.remove("hidden");
      }
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
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
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

  // Add more owner account functionality
  document.addEventListener("click", function (e) {
    if (e.target.closest(".add-account")) {
      const accountBlocks = domElements.ownerAccountContainer.querySelectorAll(
        ".owner-account-block"
      );
      const lastAccount = accountBlocks[accountBlocks.length - 1];
      const newAccount = lastAccount.cloneNode(true);
      const newIndex = accountBlocks.length + 1;
      newAccount.querySelector(
        "h3"
      ).textContent = `Owner Account Details #${newIndex}`;
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
      domElements.ownerAccountContainer.appendChild(newAccount);
      updateAccountValidationRules();
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

    // Edit Details functionality
    domElements.editDetailsButton.addEventListener("click", function () {
      formState.currentStep = 1;
      showCurrentStep();
    });

    // Submit button
    domElements.submitButton.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        formState.currentStep === formState.totalSteps &&
        validateCurrentStep()
      ) {
        submitForm();
      }
    });
  }

  function initForm() {
    updateAccountValidationRules();
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
        const fieldName = field.name;
        const rule = validationRules[fieldName];
        if (!rule) return;
        const value = field.type === "file" ? field.files : field.value.trim();
        const errorElement = document.getElementById(`${fieldName}_error`);

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
      });

      // Special handling for radio buttons
      if (formState.currentStep === 1) {
        const tenantType = document.querySelector(
          'input[name="tenant_type"]:checked'
        );
        const errorElement = document.getElementById("tenant_type_error");
        if (!tenantType) {
          showError(
            document.querySelector('input[name="tenant_type"]'),
            errorElement,
            validationRules.tenant_type.error
          );
          isValid = false;
        }
      }
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
    field.addEventListener(
      "input",
      function () {
        field.classList.remove("border-red-500");
        field.classList.add("border-gray-300");
        field.removeAttribute("aria-invalid");
        if (errorElement) errorElement.classList.add("hidden");
      },
      { once: true }
    );
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
          }
        } else {
          formData[field.name] = field.value;
        }
      }
    });
    formState.formData = formData;
    localStorage.setItem("rentFormData", JSON.stringify(formData));
  }

  function restoreFormData() {
    const data = JSON.parse(localStorage.getItem("rentFormData")) || {};
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
    // Restore dynamic owner accounts
    const accountKeys = Object.keys(data).filter(k =>
      k.startsWith("account_holder_name_")
    );
    const accountCount = accountKeys.length;
    if (accountCount > 1) {
      for (let i = 2; i <= accountCount; i++) {
        const event = new Event("click");
        domElements.ownerAccountContainer
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

    domElements.tenantDetailsSummary.innerHTML = `
  <div class="w-screen  text-gray-700 relative space-y-4">

    <!-- First row: User Type & Mobile Number -->
    <div class="flex flex-col md:flex-row justify-between gap-4 w-full">
      <div class="flex-1">
        <h6 class="font-extrabold text-lg md:text-xl">User Type</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.tenant_type || "N/A"
        }</p>
      </div>
      <div class="flex-1">
        <h6 class="font-extrabold text-lg md:text-xl">Mobile Number</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.tenant_mobile || "N/A"
        }</p>
      </div>
    </div>

    <!-- Remaining fields stacked in 2-column layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Name</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.salutation || ""
        } ${data.tenant_first_name || ""} ${data.tenant_middle_name || ""} ${
      data.tenant_last_name || ""
    }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Email</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.tenant_email || "N/A"
        }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">PAN Number</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.tenant_pan || "N/A"
        }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">DOB</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.tenant_dob || "N/A"
        }</p>
      </div>
    </div>
  </div>
`;

    // Rental Details
    domElements.rentalDetailsSummary.innerHTML = `
    <div class=" w-screen  grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Address Line 1</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.tenant_address || "N/A"
        }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">City</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.tenant_city || "N/A"
        }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Pin Code</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.tenant_pin || "N/A"
        }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Rent Amount</h6>
        <p class="font-semibold text-base md:text-lg">₹${
          data.rent_amount || "N/A"
        }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Payment Frequency</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.payment_frequency || "N/A"
        }</p>
      </div>
    </div>
  `;

    // Owner Details
    domElements.ownerDetailsSummary.innerHTML = `
    <div class="grid grid-cols-1 w-screen md:grid-cols-2 gap-x-8 gap-4 text-gray-700">
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Name</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.owner_salutation || ""
        } ${data.owner_first_name || ""} ${data.owner_middle_name || ""} ${
      data.owner_last_name || ""
    }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Mobile Number</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.owner_mobile || "N/A"
        }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">Email</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.owner_email || "N/A"
        }</p>
      </div>
      <div>
        <h6 class="font-extrabold text-lg md:text-xl">PAN Number</h6>
        <p class="font-semibold text-base md:text-lg">${
          data.owner_pan || "N/A"
        }</p>
      </div>
    </div>
  `;

    // Owner Accounts
    let ownerAccountsHtml = "";
    const accountKeys = Object.keys(data).filter(k =>
      k.startsWith("account_holder_name_")
    );
    if (accountKeys.length > 0) {
      accountKeys.forEach((_, idx) => {
        const index = idx + 1;
        ownerAccountsHtml += `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 py-4 border-t border-gray-200">
          <div>
            <h6 class="font-extrabold text-lg md:text-xl">Account Holder Name #${index}</h6>
            <p class="font-semibold text-base md:text-lg">${
              data[`account_holder_name_${index}`] || "N/A"
            }</p>
          </div>
          <div>
            <h6 class="font-extrabold text-lg md:text-xl">Rent Amount #${index}</h6>
            <p class="font-semibold text-base md:text-lg">₹${
              data[`account_rent_amount_${index}`] || "N/A"
            }</p>
          </div>
          <div>
            <h6 class="font-extrabold text-lg md:text-xl">Account Type #${index}</h6>
            <p class="font-semibold text-base md:text-lg">${
              data[`account_type_${index}`] || "N/A"
            }</p>
          </div>
          <div>
            <h6 class="font-extrabold text-lg md:text-xl">PAN Number #${index}</h6>
            <p class="font-semibold text-base md:text-lg">${
              data[`account_pan_${index}`] || "N/A"
            }</p>
          </div>
          <div>
            <h6 class="font-extrabold text-lg md:text-xl">Account Number #${index}</h6>
            <p class="font-semibold text-base md:text-lg">${
              data[`account_number_${index}`] || "N/A"
            }</p>
          </div>
          <div>
            <h6 class="font-extrabold text-lg md:text-xl">IFSC #${index}</h6>
            <p class="font-semibold text-base md:text-lg">${
              data[`bank_ifsc_${index}`] || "N/A"
            }</p>
          </div>
        </div>
      `;
      });
    } else {
      ownerAccountsHtml =
        '<p class="text-base md:text-lg text-gray-700">No account details available</p>';
    }
    domElements.ownerAccountsSummary.innerHTML = ownerAccountsHtml;

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
      filesHtml =
        '<p class="text-base md:text-lg text-gray-700">No files uploaded</p>';
    }
    domElements.filesSummary.innerHTML = filesHtml;
  }

  function submitForm() {
    console.log("Form submitted with data:", formState.formData);
    alert("Form submitted successfully!");
    localStorage.removeItem("rentFormData");
    formState.formData = {};
    formState.currentStep = 1;
    showCurrentStep();
  }
});
