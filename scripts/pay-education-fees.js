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
    accountContainer: document.getElementById("account-container"),
    payerDetailsSummary: document
      .getElementById("payer-details-summary")
      .querySelector(".details"),
    studentDetailsSummary: document
      .getElementById("student-details-summary")
      .querySelector(".details"),
    instituteDetailsSummary: document
      .getElementById("institute-details-summary")
      .querySelector(".details"),
    accountDetailsSummary: document
      .getElementById("account-details-summary")
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
    // Step 1: Applicant Details
    salutation: {
      required: true,
      validate: value => ["Mr", "Ms", "Dr"].includes(value),
      error: "Please select a valid title (Mr, Ms, Dr)",
    },
    first_name: {
      required: true,
      validate: value => /^[A-Za-z]{1,50}$/.test(value),
      error:
        "Please enter a valid first name (letters only, max 50 characters)",
    },
    middle_name: {
      required: false,
      validate: value => !value || /^[A-Za-z]{1,50}$/.test(value),
      error:
        "Please enter a valid middle name (letters only, max 50 characters)",
    },
    last_name: {
      required: true,
      validate: value => /^[A-Za-z]{1,50}$/.test(value),
      error: "Please enter a valid last name (letters only, max 50 characters)",
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
    alternate_number: {
      required: false,
      validate: value => !value || /^[6-9][0-9]{9}$/.test(value),
      error:
        "Please enter a valid 10-digit Indian mobile number (starting with 6-9)",
    },
    whatsapp_number: {
      required: true,
      validate: value => /^[6-9][0-9]{9}$/.test(value),
      error:
        "Please enter a valid 10-digit Indian mobile number (starting with 6-9)",
    },
    address_line_1: {
      required: true,
      validate: value => value.length >= 5 && value.length <= 200,
      error: "Please enter a valid address (5–200 characters)",
    },
    address_line_2: {
      required: false,
      validate: value => !value || value.length <= 200,
      error: "Please enter a valid address (max 200 characters)",
    },
    state: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid state name (letters only, max 100 characters)",
    },
    city: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid city name (letters only, max 100 characters)",
    },
    pin_code: {
      required: true,
      validate: value => /^[0-9]{6}$/.test(value),
      error: "Please enter a valid 6-digit pin code",
    },
    // Step 2: Student Details
    institute_type: {
      required: true,
      validate: () =>
        document.querySelector('input[name="institute_type"]:checked'),
      error: "Please select an institute type",
    },
    student_full_name: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error: "Please enter a valid name (letters only, max 100 characters)",
    },
    student_id: {
      required: true,
      validate: value => /^[A-Za-z0-9\s-]{1,50}$/.test(value),
      error:
        "Please enter a valid student ID (alphanumeric, max 50 characters)",
    },
    student_dob: {
      required: true,
      validate: value => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      error: "Please enter a valid date of birth",
    },
    relationship: {
      required: true,
      validate: value =>
        ["Mother", "Father", "Grandparent", "Uncle", "Aunt", "Other"].includes(
          value
        ),
      error: "Please select a valid relationship",
    },
    class: {
      required: true,
      validate: value => value !== "",
      error: "Please select a valid class",
    },
    fees: {
      required: true,
      validate: value => !isNaN(value) && parseFloat(value) > 0,
      error: "Please enter a valid fee amount (greater than 0)",
    },
    fees_frequency: {
      required: true,
      validate: value =>
        ["Monthly", "Quarterly", "Semi-Annually", "Annually", "Other"].includes(
          value
        ),
      error: "Please select a valid frequency",
    },
    fees_due_date: {
      required: true,
      validate: value => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      error: "Please enter a valid due date",
    },
    session_end_date: {
      required: true,
      validate: value => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      error: "Please enter a valid session end date",
    },
    card_bank: {
      required: true,
      validate: value =>
        [
          "HDFC",
          "HSBC",
          "Payzapp",
          "Kotak Mahindra",
          "Yes Bank",
          "Standard Chartered",
          "RBL",
          "IndusInd",
          "ICICI",
        ].includes(value),
      error: "Please select a valid bank",
    },
    // Step 3: Institute Details
    institute_name: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid institute name (letters only, max 100 characters)",
    },
    institute_email: {
      required: true,
      validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      error: "Please enter a valid email address",
    },
    institute_website: {
      required: false,
      validate: value =>
        !value || /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}\/?$/.test(value),
      error: "Please enter a valid URL",
    },
    institute_contact: {
      required: true,
      validate: value => /^[6-9][0-9]{9}$/.test(value),
      error:
        "Please enter a valid 10-digit Indian mobile number (starting with 6-9)",
    },
    institute_address_line_1: {
      required: true,
      validate: value => value.length >= 5 && value.length <= 200,
      error: "Please enter a valid address (5–200 characters)",
    },
    institute_address_line_2: {
      required: false,
      validate: value => !value || value.length <= 200,
      error: "Please enter a valid address (max 200 characters)",
    },
    institute_state: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid state name (letters only, max 100 characters)",
    },
    institute_city: {
      required: true,
      validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
      error:
        "Please enter a valid city name (letters only, max 100 characters)",
    },
    institute_pin_code: {
      required: true,
      validate: value => /^[0-9]{6}$/.test(value),
      error: "Please enter a valid 6-digit pin code",
    },
    institute_pan: {
      required: true,
      validate: value => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
      error: "Please enter a valid 10-character PAN number",
    },
    institute_gstin: {
      required: false,
      validate: value =>
        !value ||
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value),
      error: "Please enter a valid 15-character GSTIN",
    },
    institute_reg_number: {
      required: false,
      validate: value => !value || /^[A-Za-z0-9\s-]{1,50}$/.test(value),
      error:
        "Please enter a valid registration number (alphanumeric, max 50 characters)",
    },
  };

  // Initialize dynamic validation rules for account details
  function updateAccountValidationRules() {
    const accountBlocks =
      domElements.accountContainer.querySelectorAll(".account-block");
    accountBlocks.forEach((block, index) => {
      const idx = index + 1;
      validationRules[`account_holder_name_${idx}`] = {
        required: true,
        validate: value => /^[A-Za-z\s]{1,100}$/.test(value),
        error: "Please enter a valid name (letters only, max 100 characters)",
      };
      validationRules[`account_fee_amount_${idx}`] = {
        required: true,
        validate: value => !isNaN(value) && parseFloat(value) > 0,
        error: "Please enter a valid fee amount (greater than 0)",
      };
      validationRules[`account_type_${idx}`] = {
        required: true,
        validate: value => ["Savings", "Current"].includes(value),
        error: "Please select a valid account type",
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
    updateAccountValidationRules();
    updateFileValidationRules();
    restoreFormData();
    showCurrentStep();
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
      const fields = currentContent.querySelectorAll("input, select, textarea");
      fields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      // Special handling for radio buttons (institute_type)
      if (formState.currentStep === 2) {
        const instituteType = document.querySelector(
          'input[name="institute_type"]:checked'
        );
        const rule = validationRules["institute_type"];
        if (!rule.validate()) {
          isValid = false;
          const errorElement = document.getElementById("institute_type_error");
          if (errorElement) {
            errorElement.textContent = rule.error;
            errorElement.classList.remove("hidden");
          }
        }
      }

      // Special handling for file uploads
      if (formState.currentStep === 5) {
        const dropzones =
          domElements.fileUploadContainer.querySelectorAll(".dropzone-wrapper");
        dropzones.forEach((wrapper, index) => {
          const idx = index + 1;
          const fileInput = wrapper.querySelector(".file-input");
          const rule = validationRules[`file_upload_${idx}`];
          if (!rule.validate()) {
            isValid = false;
            const errorElement = document.getElementById(
              `file_upload_${idx}_error`
            );
            if (errorElement) {
              errorElement.textContent = rule.error;
              errorElement.classList.remove("hidden");
            }
          }
        });
      }
    }

    return isValid;
  }

  function validateField(field) {
    const name = field.name;
    const rule = validationRules[name];
    if (!rule) return true;

    let isValid = true;
    const errorElement = document.getElementById(`${name}_error`);
    let value = field.type === "file" ? field.files : field.value;

    if (rule.required && !value && field.type !== "file") {
      isValid = false;
    } else if (value || (rule.required && field.type === "file")) {
      isValid = rule.validate(value);
    }

    if (!isValid) {
      field.classList.add("border-red-500");
      field.classList.remove("border-gray-300");
      if (errorElement) {
        errorElement.textContent = rule.error;
        errorElement.classList.remove("hidden");
      }
    } else {
      field.classList.remove("border-red-500");
      field.classList.add("border-gray-300");
      if (errorElement) {
        errorElement.classList.add("hidden");
      }
    }

    return isValid;
  }

  function saveFormData() {
    const currentContent = document.querySelector(
      `.step-content[data-step="${formState.currentStep}"]`
    );
    if (currentContent) {
      const fields = currentContent.querySelectorAll("input, select, textarea");
      fields.forEach(field => {
        if (field.type === "file") {
          formState.formData[field.name] = Array.from(field.files).map(
            file => ({
              name: file.name,
              size: file.size,
              type: file.type,
            })
          );
        } else if (field.type === "radio") {
          if (field.checked) {
            formState.formData[field.name] = field.value;
          }
        } else {
          formState.formData[field.name] = field.value;
        }
      });
    }

    try {
      localStorage.setItem("formData", JSON.stringify(formState.formData));
      localStorage.setItem("currentStep", formState.currentStep);
    } catch (e) {
      console.error("Error saving form data to localStorage:", e);
    }
  }

  function restoreFormData() {
    try {
      const savedData = localStorage.getItem("formData");
      const savedStep = localStorage.getItem("currentStep");
      if (savedData) {
        formState.formData = JSON.parse(savedData);
        Object.keys(formState.formData).forEach(key => {
          const field = document.querySelector(`[name="${key}"]`);
          if (field && field.type !== "file" && field.type !== "radio") {
            field.value = formState.formData[key];
          } else if (field && field.type === "radio") {
            if (field.value === formState.formData[key]) {
              field.checked = true;
            }
          }
        });
      }
      if (savedStep) {
        formState.currentStep = parseInt(savedStep);
      }
    } catch (e) {
      console.error("Error restoring form data from localStorage:", e);
    }
  }

  function displaySummary() {
    // Clear previous summary
    domElements.payerDetailsSummary.innerHTML = "";
    domElements.studentDetailsSummary.innerHTML = "";
    domElements.instituteDetailsSummary.innerHTML = "";
    domElements.accountDetailsSummary.innerHTML = "";
    domElements.filesSummary.innerHTML = "";

    // Helper function to create summary item
    const createSummaryItem = (label, value) => {
      if (!value) return;
      const div = document.createElement("div");
      div.className = "flex flex-col gap-1";
      div.innerHTML = `
          <span class="text-[#2F5D50] text-[16px] font-semibold">${label}</span>
          <span class="text-[#333333] text-[16px]">${value}</span>
        `;
      return div;
    };

    // Step 1: Applicant Details
    const payerFields = [
      { key: "salutation", label: "Salutation" },
      { key: "first_name", label: "First Name" },
      { key: "middle_name", label: "Middle Name" },
      { key: "last_name", label: "Last Name" },
      { key: "dob", label: "Date of Birth" },
      { key: "mobile", label: "Mobile Number" },
      { key: "email", label: "Email Address" },
      { key: "pan_number", label: "PAN Number" },
      { key: "gstin", label: "GSTIN" },
      { key: "alternate_number", label: "Alternate Number" },
      { key: "whatsapp_number", label: "WhatsApp Number" },
      { key: "address_line_1", label: "Address Line 1" },
      { key: "address_line_2", label: "Address Line 2" },
      { key: "state", label: "State" },
      { key: "city", label: "City" },
      { key: "pin_code", label: "Pin Code" },
    ];
    payerFields.forEach(field => {
      const item = createSummaryItem(
        field.label,
        formState.formData[field.key]
      );
      if (item) domElements.payerDetailsSummary.appendChild(item);
    });

    // Step 2: Student Details
    const studentFields = [
      { key: "institute_type", label: "Institute Type" },
      { key: "student_full_name", label: "Student Full Name" },
      { key: "student_id", label: "Student ID" },
      { key: "student_dob", label: "Date of Birth" },
      { key: "relationship", label: "Relationship" },
      { key: "class", label: "Class" },
      { key: "fees", label: "Fees (INR)" },
      { key: "fees_frequency", label: "Fees Frequency" },
      { key: "fees_due_date", label: "Fees Due Date" },
      { key: "session_end_date", label: "Session End Date" },
      { key: "card_bank", label: "Card Issuing Bank" },
    ];
    studentFields.forEach(field => {
      const item = createSummaryItem(
        field.label,
        formState.formData[field.key]
      );
      if (item) domElements.studentDetailsSummary.appendChild(item);
    });

    // Step 3: Institute Details
    const instituteFields = [
      { key: "institute_name", label: "Institute Name" },
      { key: "institute_email", label: "Institute Email" },
      { key: "institute_website", label: "Institute Website" },
      { key: "institute_contact", label: "Institute Contact Number" },
      { key: "institute_address_line_1", label: "Address Line 1" },
      { key: "institute_address_line_2", label: "Address Line 2" },
      { key: "institute_state", label: "State" },
      { key: "institute_city", label: "City" },
      { key: "institute_pin_code", label: "Pin Code" },
      { key: "institute_pan", label: "Institute PAN Number" },
      { key: "institute_gstin", label: "Institute GSTIN" },
      { key: "institute_reg_number", label: "Institute Registration Number" },
    ];
    instituteFields.forEach(field => {
      const item = createSummaryItem(
        field.label,
        formState.formData[field.key]
      );
      if (item) domElements.instituteDetailsSummary.appendChild(item);
    });

    // Step 4: Account Details
    const accountBlocks =
      domElements.accountContainer.querySelectorAll(".account-block");
    accountBlocks.forEach((block, index) => {
      const idx = index + 1;
      const accountFields = [
        {
          key: `account_holder_name_${idx}`,
          label: `Account Holder Name ${idx}`,
        },
        { key: `account_fee_amount_${idx}`, label: `Fee Amount ${idx} (INR)` },
        { key: `account_type_${idx}`, label: `Account Type ${idx}` },
        { key: `account_number_${idx}`, label: `Account Number ${idx}` },
        { key: `bank_ifsc_${idx}`, label: `Bank IFSC ${idx}` },
      ];
      accountFields.forEach(field => {
        const item = createSummaryItem(
          field.label,
          formState.formData[field.key]
        );
        if (item) domElements.accountDetailsSummary.appendChild(item);
      });
    });

    // Step 5: Files
    const dropzones =
      domElements.fileUploadContainer.querySelectorAll(".dropzone-wrapper");
    dropzones.forEach((wrapper, index) => {
      const idx = index + 1;
      const files = formState.formData[`file_upload_${idx}`] || [];
      files.forEach(file => {
        const div = document.createElement("div");
        div.className = "text-[#333333] text-[16px]";
        div.textContent = file.name;
        domElements.filesSummary.appendChild(div);
      });
    });
  }

  function submitForm() {
    // Simulate form submission
    console.log("Form submitted with data:", formState.formData);
    alert("Form submitted successfully!");
    // Clear form data
    localStorage.removeItem("formData");
    localStorage.removeItem("currentStep");
    formState.formData = {};
    formState.currentStep = 1;
    showCurrentStep();
  }
});
