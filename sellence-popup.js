(function () {
  const MINUTES = 1000 * 60;
  // Constants can be changed to customize the SMS widget
  const START_AFTER = 0.01; // minutes
  const TITLE = "Signup now<br>to unlock 10% back";
  const END_TITLE = "Thank you!";
  const SUBTITLE = "A message with the code<br>has been sent to you";
  const INPUT_PLACEHOLDER = "Enter your phone number";
  const NOTE_TEXT = "*By  clicking ‘Unlock my 10% back’, you agree to recieve SMS messages from inner balance.<br>View our full Terms & Conditions and Privacy Policy."
  const BUTTON_TEXT = "Unlock my 10% back";
  const END_BUTTON_TEXT = "Got it";
  const ERROR_MESSAGE = "Please enter a valid phone number";

  const POPUP_BACKGROUND_COLOR = "#FFFFFF";
  const WRAPPER_BACKGROUND_COLOR = "#00000073";
  const TITLE_COLOR = "#434343";
  const INPUT_COLOR = "#00000073";
  const BUTTON_COLOR = "#90632D";
  const BUTTON_TEXT_COLOR = "#FFFFFF";
  const ERROR_COLOR = "#F63C45";

  // Check if the device is mobile
  function detectDevice() {
    let ch = false;
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  function isValidPhoneNumber(phoneNumber) {
    const pattern1 = new RegExp(/^\d{10}$/);
    const pattern2 = new RegExp(/^\d{3}-\d{3}-\d{4}$/);
    const pattern3 = new RegExp(/^\d{3} \d{3} \d{4}$/);
    const pattern4 = new RegExp(/^\d{3}\.\d{3}\.\d{4}$/);
    const pattern5 = new RegExp(/^\+1 \d{3}-\d{3}-\d{4}$/);
    const pattern6 = new RegExp(/^\+1 \d{3} \d{3} \d{4}$/);
    return pattern1.test(phoneNumber) || pattern2.test(phoneNumber) || pattern3.test(phoneNumber) || pattern4.test(phoneNumber) || pattern5.test(phoneNumber) || pattern6.test(phoneNumber);
  }

  function send(phoneNumber) {
    // TODO: Send the phone number to the backend
    title.innerHTML = END_TITLE;
    inputContainer.remove();
    subtitle.style.display = "inline-block";
    button.textContent = END_BUTTON_TEXT;
    button.addEventListener("click", () => {
      popUpWrapper.remove();
    });
    note.remove();
    titleContainer.style.marginTop = "100px";
  }

  const isMobile = detectDevice();
  const svgNS = "http://www.w3.org/2000/svg";

  // Load the Google Fonts asynchronously
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css?family=Poppins";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  // Create title
  const title = document.createElement("span");
  title.className = "title";
  title.innerHTML = TITLE;

  // Create subtitle
  const subtitle = document.createElement("span");
  subtitle.className = "subtitle";
  subtitle.innerHTML = SUBTITLE;

  const titleContainer = document.createElement("div");
  titleContainer.className = "title-container";
  titleContainer.appendChild(title);
  titleContainer.appendChild(subtitle);

  // Create input title
  const inputTitle = document.createElement("span");
  inputTitle.className = "input-title";
  inputTitle.textContent = INPUT_PLACEHOLDER;

  // Create input field
  const input = document.createElement("input");
  input.className = "input";
  input.type = "tel";
  input.placeholder = INPUT_PLACEHOLDER;
  input.addEventListener("input", () => {
    input.style.borderColor = INPUT_COLOR;
    error.style.visibility = "hidden";
    if (input.value) {
      inputTitle.style.visibility = "visible";
      if (!isValidPhoneNumber(input.value)) {
        input.style.borderColor = ERROR_COLOR;
        error.style.visibility = "visible";
      }
    } else {
      inputTitle.style.visibility = "hidden";
      error.style.visibility = "hidden";
      input.style.borderColor = INPUT_COLOR;
    }

  });
  input.addEventListener("focus", () => {
    input.style.borderColor = TITLE_COLOR;
    error.style.visibility = "hidden";
  });

  // Create error message
  const error = document.createElement("span");
  error.className = "error";
  error.textContent = ERROR_MESSAGE;

  // Create input container
  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";
  inputContainer.appendChild(inputTitle);
  inputContainer.appendChild(input);
  inputContainer.appendChild(error);

  // Create note text
  const note = document.createElement("span");
  note.className = "note";
  note.innerHTML = NOTE_TEXT;

  // Create button
  const button = document.createElement("button");
  button.className = "button";
  button.textContent = BUTTON_TEXT;
  button.addEventListener("click", () => {
    if (!input.value || !isValidPhoneNumber(input.value)) {
      input.style.borderColor = ERROR_COLOR;
      error.style.visibility = "visible";
      return;
    }
    send(input.value);
  });

  // Create close button
  const closeButton = document.createElementNS(svgNS, "svg");
  closeButton.id = "sellence-close-button";
  closeButton.setAttribute("width", "16");
  closeButton.setAttribute("height", "16");
  closeButton.setAttribute("viewBox", "0 0 16 16");
  closeButton.setAttribute("fill", "none");
  
  const path1 = document.createElementNS(svgNS, "path");
  path1.setAttribute("d", "M12 4L3 13");
  path1.setAttribute("stroke", "#C1C1C1");
  path1.setAttribute("stroke-width", "1.45946");
  path1.setAttribute("stroke-linecap", "round");
  path1.setAttribute("stroke-linejoin", "round");
  const path2 = document.createElementNS(svgNS, "path");
  path2.setAttribute("d", "M3 4L12 13");
  path2.setAttribute("stroke", "#C1C1C1");
  path2.setAttribute("stroke-width", "1.45946");
  path2.setAttribute("stroke-linecap", "round");
  path2.setAttribute("stroke-linejoin", "round");
  
  closeButton.appendChild(path1);
  closeButton.appendChild(path2);
  closeButton.addEventListener("click", () => {
    popUpWrapper.remove();
  });

  // Create the popup window
  const popUpWindow = document.createElement("div");
  popUpWindow.id = "sellence-popup";
  popUpWindow.appendChild(titleContainer);
  popUpWindow.appendChild(inputContainer);
  popUpWindow.appendChild(note);
  popUpWindow.appendChild(button);
  popUpWindow.appendChild(closeButton);

  // Create the popup wrapper
  const popUpWrapper = document.createElement("div");
  popUpWrapper.id = "sellence-popup-wrapper";
  popUpWrapper.appendChild(popUpWindow);

  const style = document.createElement("style");
  style.textContent = `
    #sellence-popup-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100vh;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      background-color: ${WRAPPER_BACKGROUND_COLOR};
    }
    #sellence-popup {
      position: relative;
      height: ${isMobile ? `332px` : `415px`};
      width: ${isMobile ? `435px` : `456px`};
      border-radius: 24px;
      background-color: ${POPUP_BACKGROUND_COLOR};
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 84px 24px 40px 24px;
    }
    #sellence-close-button {
      position: absolute;
      top: 27px;
      right: 24px;
      cursor: pointer;
    }
    .title-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      gap: 8px;
    }
    .title {
      display: inline-block;
      font-family: 'Poppins', sans-serif;
      font-size: 26px;
      font-weight: 600;
      color: ${TITLE_COLOR};
      text-align: center;
      line-height: 32px;
    }
    .subtitle {
      display: none;
      font-family: 'Poppins', sans-serif;
      font-size: 20px;
      font-weight: 400;
      color: ${TITLE_COLOR};
      text-align: center;
    }
    .input-container {
      margin-top: 24px;
      display: flex;
      box-sizing: border-box;
      height: 126px;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-start;
      width: 100%;
    }
    .input-title {
      visibility: hidden;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 400;
      color: ${INPUT_COLOR};
    }
    .input {
      display: inline-block;
      box-sizing: border-box;
      height: 48px;
      width: 100%;
      border-radius: 8px;
      border: 1px solid ${INPUT_COLOR};
      outline: none;
      padding: 0 14px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: ${TITLE_COLOR};
    }
    .error {
      visibility: hidden;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 400;
      color: ${ERROR_COLOR};
    }
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 80px;
      height: 48px;
      border-radius: 50px;
      border: none;
      padding: 8px 20px;
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: ${BUTTON_TEXT_COLOR};
      background-color: ${BUTTON_COLOR};
      cursor: pointer;
    }
    .note {
      margin-top: 16px;
      display: inline-block;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 18px;
      color: ${INPUT_COLOR};
    }
  `;

  document.head.appendChild(style);

  function start() {
    document.body.appendChild(popUpWrapper);
  }
  // Initial check on page load
  setTimeout(start, START_AFTER * MINUTES);
})();
