(function () {
  // Check if the device is mobile
  function detectDevice() {
    let ch = false;
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  // Constants can be changed to customize the SMS widget
  const PHONE_NUMBER = "+972545832828";
  const MESSAGE_SENT = '"The Message Sent"';
  const WE_RECEIVED_YOUR_MESSAGE_TITLE = "We Received your message.";
  const WE_RECEIVED_YOUR_MESSAGE_TEXT = "Our team will be texting you back from the number above.";
  const BUTTON_TEXT = "Send";
  const TEXT_COLOR = "#FFFFFF";
  const BACKGROUND_COLOR = "#90632D";
  const INPUT_TEXT_COLOR = "#707070";
  const INPUT_ERROR_COLOR = "#F63C45";
  const INPUT_BLUR_COLOR = "#E9F0FD";
  const INPUT_FOCUS_COLOR = BACKGROUND_COLOR;
  const EXCLUDED_URLS = [];
  const AGREEMENT_TEXT = 'By submitting, you authorize Sellence to text and call the number you provided with offers & other information, possibly using automated means. Message/data rates apply. Consent is not a condition of purchase. <a href="#" target="_blank">Use is subject to terms.</a>';
  const FORM_TITLE = "Enter your information, and our  team will text you shortly.";
  const FOOTER_TEXT = '<a href="#" target="_blank">Try Smarter SMS texting</a> powered by';

  function isPageExcluded(url) {
    return EXCLUDED_URLS.some((excludedUrl) => {
      const regex = new RegExp(
        excludedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      ); // Escape special characters in URL
      return regex.test(url);
    });
  }

  const isMobile = detectDevice();
  // Load the Google Fonts asynchronously
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css?family=Poppins";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  const createInputContainer = function (title, error, type, validationFunction) {
    const result = document.createElement("div");
    result.className = "input-container";

    const inputTitle = document.createElement("span");
    inputTitle.className = "input-title";
    inputTitle.textContent = title;

    const input = document.createElement("input");
    input.className = "input";
    input.type = type;
    input.placeholder = title;

    const errorText = document.createElement("span");
    errorText.className = "error";
    errorText.textContent = error;

    input.addEventListener("input", () => {
      input.style.borderColor = INPUT_TEXT_COLOR;
      errorText.style.visibility = "hidden";
      if (input.value) {
        inputTitle.style.visibility = "visible";
        if (validationFunction && !validationFunction(input.value)) {
          input.style.borderColor = INPUT_ERROR_COLOR;
          error.style.visibility = "visible";
        }
      } else {
        inputTitle.style.visibility = "hidden";
        errorText.style.visibility = "hidden";
        input.style.borderColor = INPUT_TEXT_COLOR;
      }

    });
    input.addEventListener("focus", () => {
      input.style.borderColor = INPUT_FOCUS_COLOR;
      errorText.style.visibility = "hidden";
    });
    input.addEventListener("blur", () => {
      if (!input.value) {
        input.style.borderColor = INPUT_BLUR_COLOR;
      }
      errorText.style.visibility = "hidden";
    });

    result.appendChild(inputTitle);
    result.appendChild(input);
    result.appendChild(errorText);

    return result;
  }
  
  const handleSendButtonClick = function () {
    // TODO: Call endpoint to send data
    formContainer.remove();
    agreement.remove();
    content.appendChild(messageSent);
    content.appendChild(weReceivedYourMessageContainer);
    sendButton.remove();
  }

  const svgNS = "http://www.w3.org/2000/svg";

  // Create the button wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.id = "wrap";

  // Create the button icon
  const buttonIconOpen = document.createElementNS(svgNS, "svg");
  buttonIconOpen.setAttribute("width", "44");
  buttonIconOpen.setAttribute("height", "46");
  buttonIconOpen.setAttribute("viewBox", "0 0 44 46");
  buttonIconOpen.setAttribute("fill", "none");
  const buttonIconOpenPath1 = document.createElementNS(svgNS, "path");
  buttonIconOpenPath1.setAttribute(
    "d",
    "M2.92302 13.6538C2.92302 9.04436 6.65972 5.30766 11.2692 5.30766H32.7307C37.3402 5.30766 41.0769 9.04437 41.0769 13.6538V28.6614C41.0769 31.9422 38.4172 34.6019 35.1364 34.6019H34.193C32.5557 34.6019 30.9876 35.2618 29.843 36.4325L26.4467 39.9064C25.3698 41.0079 23.4994 40.2454 23.4994 38.705C23.4994 36.4389 21.6623 34.6019 19.3962 34.6019H11.2692C6.65972 34.6019 2.92302 30.8652 2.92302 26.2557V13.6538Z",
  );
  buttonIconOpenPath1.setAttribute("stroke", TEXT_COLOR);
  buttonIconOpenPath1.setAttribute("stroke-width", "2.38462");
  const buttonIconOpenPath2 = document.createElementNS(svgNS, "path");
  buttonIconOpenPath2.setAttribute("d", "M12.1724 15.6903H21.9999");
  buttonIconOpenPath2.setAttribute("stroke", TEXT_COLOR);
  buttonIconOpenPath2.setAttribute("stroke-width", "2.38462");
  buttonIconOpenPath2.setAttribute("stroke-linecap", "round");
  const buttonIconOpenPath3 = document.createElementNS(svgNS, "path");
  buttonIconOpenPath3.setAttribute("d", "M12.1724 23.61H31.2132");
  buttonIconOpenPath3.setAttribute("stroke", TEXT_COLOR);
  buttonIconOpenPath3.setAttribute("stroke-width", "2.38462");
  buttonIconOpenPath3.setAttribute("stroke-linecap", "round");
  buttonIconOpen.appendChild(buttonIconOpenPath1);
  buttonIconOpen.appendChild(buttonIconOpenPath2);
  buttonIconOpen.appendChild(buttonIconOpenPath3);

  const buttonIconClose = document.createElementNS(svgNS, "svg");
  buttonIconClose.setAttribute("width", "30");
  buttonIconClose.setAttribute("height", "30");
  buttonIconClose.setAttribute("viewBox", "0 0 30 30");
  buttonIconClose.setAttribute("fill", "none");
  const buttonIconClosePath1 = document.createElementNS(svgNS, "path");
  buttonIconClosePath1.setAttribute("d", "M27.7739 2.1875L2.14893 27.8125");
  buttonIconClosePath1.setAttribute("stroke", TEXT_COLOR);
  buttonIconClosePath1.setAttribute("stroke-width", "2.5");
  buttonIconClosePath1.setAttribute("stroke-linecap", "round");
  buttonIconClosePath1.setAttribute("stroke-linejoin", "round");
  const buttonIconClosePath2 = document.createElementNS(svgNS, "path");
  buttonIconClosePath2.setAttribute("d", "M2.14892 2.1875L27.7739 27.8125");
  buttonIconClosePath2.setAttribute("stroke", TEXT_COLOR);
  buttonIconClosePath2.setAttribute("stroke-width", "2.5");
  buttonIconClosePath2.setAttribute("stroke-linecap", "round");
  buttonIconClosePath2.setAttribute("stroke-linejoin", "round");
  buttonIconClose.appendChild(buttonIconClosePath1);
  buttonIconClose.appendChild(buttonIconClosePath2);

  buttonWrapper.appendChild(buttonIconOpen);

  const popUpWrapper = document.createElement("div");
  popUpWrapper.id = "sellence-popup-wrapper";

  const header = document.createElement("div");
  header.id = "sellence-popup-header";

  const headerText = document.createElement("h1");
  headerText.id = "sellence-popup-header-text";
  headerText.textContent = "Get a quick response via text.";

  const headerIcon = document.createElementNS(svgNS, "svg");
  headerIcon.setAttribute("width", "24");
  headerIcon.setAttribute("height", "24");
  headerIcon.setAttribute("viewBox", "0 0 24 24");
  headerIcon.setAttribute("fill", "none");
  const headerIconPath1 = document.createElementNS(svgNS, "path");
  headerIconPath1.setAttribute("d", "M3.2902 15.5557C0.599657 10.559 4.21867 4.5 9.89374 4.5H14.5595C18.3926 4.5 21.5 7.60737 21.5 11.4405V11.7727C21.5 15.645 18.1972 18.6942 14.3372 18.3854L12.2307 18.2169C10.4013 18.0705 8.6663 19.0494 7.84556 20.6908C7.48306 21.4158 6.45403 21.4314 6.06974 20.7177L3.2902 15.5557Z");
  headerIconPath1.setAttribute("stroke", TEXT_COLOR);
  const headerIconPath2 = document.createElementNS(svgNS, "path");
  headerIconPath2.setAttribute("d", "M8 12H8.55");
  headerIconPath2.setAttribute("stroke", TEXT_COLOR);
  headerIconPath2.setAttribute("stroke-width", "2");
  headerIconPath2.setAttribute("stroke-linecap", "round");
  const headerIconPath3 = document.createElementNS(svgNS, "path");
  headerIconPath3.setAttribute("d", "M12 12H12.5");
  headerIconPath3.setAttribute("stroke", TEXT_COLOR);
  headerIconPath3.setAttribute("stroke-width", "2");
  headerIconPath3.setAttribute("stroke-linecap", "round");
  const headerIconPath4 = document.createElementNS(svgNS, "path");
  headerIconPath4.setAttribute("d", "M16 12H16.5");
  headerIconPath4.setAttribute("stroke", TEXT_COLOR);
  headerIconPath4.setAttribute("stroke-width", "2");
  headerIconPath4.setAttribute("stroke-linecap", "round");

  headerIcon.appendChild(headerIconPath1);
  headerIcon.appendChild(headerIconPath2);
  headerIcon.appendChild(headerIconPath3);
  headerIcon.appendChild(headerIconPath4);

  header.appendChild(headerIcon);
  header.appendChild(headerText);
  
  const footer = document.createElement("div");
  footer.id = "sellence-popup-footer";
  const footerText = document.createElement("p");
  footerText.innerHTML = FOOTER_TEXT;
  const footerIcon = document.createElementNS(svgNS, "svg");
  footerIcon.setAttribute("width", "71");
  footerIcon.setAttribute("height", "21");
  footerIcon.setAttribute("viewBox", "0 0 71 21");
  footerIcon.setAttribute("fill", "none");
  
  const footerIconRect = document.createElementNS(svgNS, "rect");
  footerIconRect.setAttribute("width", "71");
  footerIconRect.setAttribute("height", "21");
  footerIconRect.setAttribute("fill", "url(#pattern0_1184_13853)");
  const footerIconDefs = document.createElementNS(svgNS, "defs");
  const footerIconPattern = document.createElementNS(svgNS, "pattern");
  footerIconPattern.setAttribute("id", "pattern0_1184_13853");
  footerIconPattern.setAttribute("patternContentUnits", "objectBoundingBox");
  footerIconPattern.setAttribute("width", "1");
  footerIconPattern.setAttribute("height", "1");
  const footerIconUse = document.createElementNS(svgNS, "use");
  footerIconUse.setAttribute("xlink:href", "#image0_1184_13853");
  footerIconUse.setAttribute("transform", "matrix(0.00509956 0 0 0.0172414 -0.0176056 0)");
  footerIconPattern.appendChild(footerIconUse);
  const footerIconImage = document.createElementNS(svgNS, "image");
  footerIconImage.setAttribute("id", "image0_1184_13853");
  footerIconImage.setAttribute("width", "203");
  footerIconImage.setAttribute("height", "58");
  footerIconImage.setAttribute("xlink:href", "data:image/png;base64,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");
  
  footerIconDefs.appendChild(footerIconPattern);
  footerIconDefs.appendChild(footerIconImage);
  footerIcon.appendChild(footerIconRect);
  footerIcon.appendChild(footerIconDefs);
  
  footer.appendChild(footerText);
  footer.appendChild(footerIcon);
  
  const content = document.createElement("div");
  content.id = "sellence-popup-content";

  const formTitle = document.createElement("div");
  formTitle.id = "sellence-popup-content-form-title";
  formTitle.textContent = FORM_TITLE;

  const formContainer = document.createElement("div");
  formContainer.id = "sellence-popup-content-form-container";

  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";

  const agreement = document.createElement("p");
  agreement.id = "sellence-popup-content-agreement";
  agreement.innerHTML = AGREEMENT_TEXT;

  const sendButton = document.createElement("button");
  sendButton.id = "sellence-popup-send-button";
  sendButton.textContent = BUTTON_TEXT;
  sendButton.addEventListener("click", handleSendButtonClick);

  content.appendChild(formTitle);

  const nameInput = createInputContainer("Name", "", "text");
  const phoneInput = createInputContainer("Phone", "Invalid phone number", "tel", (value) => {
    return true
  });
  const messageInput = createInputContainer("Message", "", "text");

  formContainer.appendChild(nameInput);
  formContainer.appendChild(phoneInput);
  formContainer.appendChild(messageInput);

  content.appendChild(formContainer);
  content.appendChild(agreement);
  content.appendChild(sendButton);

  popUpWrapper.appendChild(header);
  popUpWrapper.appendChild(content);
  popUpWrapper.appendChild(footer);
  
  // Message sent successfully
  const messageSent = document.createElement("div");
  messageSent.id = "sellence-popup-message-sent";
  messageSent.textContent = MESSAGE_SENT;
  
  const weReceivedYourMessageContainer = document.createElement("div");
  weReceivedYourMessageContainer.id = "sellence-popup-we-received-your-message-container";
  
  const weReceivedYourMessageTitle = document.createElement("div");
  weReceivedYourMessageTitle.id = "sellence-popup-we-received-your-message-container-title";
  weReceivedYourMessageTitle.textContent = PHONE_NUMBER;
  
  const weReceivedYourMessageContent = document.createElement( "div");
  weReceivedYourMessageContent.id = "sellence-popup-we-received-your-message-container-content";

  const weReceivedYourMessage = document.createElement("p");
  weReceivedYourMessage.id = "sellence-popup-we-received-your-message-title";
  weReceivedYourMessage.textContent = WE_RECEIVED_YOUR_MESSAGE_TITLE;

  const weReceivedYourMessageText = document.createElement("p");
  weReceivedYourMessageText.id = "sellence-popup-we-received-your-message-text";
  weReceivedYourMessageText.textContent = WE_RECEIVED_YOUR_MESSAGE_TEXT;
  
  weReceivedYourMessageContent.appendChild(weReceivedYourMessage);
  weReceivedYourMessageContent.appendChild(weReceivedYourMessageText);
  
  weReceivedYourMessageContainer.appendChild(weReceivedYourMessageTitle);
  weReceivedYourMessageContainer.appendChild(weReceivedYourMessageContent);

  const onOpenButtonClickListener = function () {
    buttonIconOpen.remove();
    buttonWrapper.appendChild(buttonIconClose);
    anchor.addEventListener("click", onCloseButtonClickListener);
    anchor.removeEventListener("click", onOpenButtonClickListener);
    document.body.appendChild(popUpWrapper);
  };

  const onCloseButtonClickListener = function () {
    buttonIconClose.remove();
    buttonWrapper.appendChild(buttonIconOpen);
    anchor.addEventListener("click", onOpenButtonClickListener);
    anchor.removeEventListener("click", onCloseButtonClickListener);
    popUpWrapper.remove();
  };

  // Create the anchor tag for the SMS widget
  const anchor = document.createElement("a");
  anchor.id = "sellence-button";
  anchor.href = "#";
  // anchor.href = isMobile ? `sms:${PHONE_NUMBER}` : "#";
  anchor.addEventListener("click", onOpenButtonClickListener);

  anchor.appendChild(buttonWrapper);

  // Styles
  const style = document.createElement("style");
  style.textContent = `
    #sellence-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        text-decoration: none;
        z-index: 9999;
    }
    #sellence-popup-wrapper {
      position: fixed;
      right: 20px;
      bottom: 100px;
      width: 342px;
      height: 659px;
      background-color: #F1F1F5;
      border-radius: 8px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.21);
      display: flex;
      flex-direction: column;
    }
    #sellence-popup-header {
      height: 74px;
      background-color: ${BACKGROUND_COLOR};
      border-radius: 8px 8px 0 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 4px;
    }
    #sellence-popup-header-text {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: ${TEXT_COLOR};
    }
    #sellence-popup-content {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: flex-start;
      padding: 16px;
      gap: 16px;
    }
    #sellence-popup-content-form-title {
      width: 244px;
      padding: 16px;
      background-color: #DCE2EB;
      border-radius: 0 24px 24px 24px;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      font-weight: 400;
      color: #434343;
    }
    #sellence-popup-content-form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 235px;
      background-color: ${TEXT_COLOR};
      border-radius: 24px 24px 0 24px;
      padding: 24px;
    }
    .input-container {
      display: flex;
      flex-direction: column;
    }
    .input-title {
      visibility: hidden;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 400;
      color: ${INPUT_FOCUS_COLOR};
    }
    .input {
      display: inline-block;
      box-sizing: border-box;
      height: 34px;
      width: 100%;
      border: none;
      border-bottom: 2px solid ${INPUT_BLUR_COLOR};
      outline: none;
      padding: 7px 0;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: ${INPUT_TEXT_COLOR};
    }
    .error {
      visibility: hidden;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 400;
      color: ${INPUT_ERROR_COLOR};
    }
    #sellence-popup-content-agreement {
      font-family: 'Poppins', sans-serif;
      font-size: 9px;
      font-weight: 400;
      color: #707070;
      text-align: justify;
    }
    #sellence-popup-content-agreement a {
      text-decoration: underline;
      color: #707070;
    }
    #sellence-popup-send-button {
      display: block;
      margin: 0 auto;
      justify-content: center;
      align-items: center;
      height: 48px;
      width: 200px;
      border-radius: 50px;
      border: none;
      padding: 8px 20px;
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: ${TEXT_COLOR};
      background-color: ${BACKGROUND_COLOR};
      cursor: pointer;
    }
    #sellence-popup-footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 54px;
      background-color: ${TEXT_COLOR};
      border-radius: 0 0 8px 8px;
      color: #000000;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 400;
      gap: 8px;
    }
    #sellence-popup-footer a {
      text-decoration: underline;
      color: #345CD1;
    }
    #sellence-popup-message-sent {
      display: none;
      height: 50px;
      width: 153px;
      background-color: #DED5CD;
      border-radius: 24px 24px 0 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: flex-end;
      color: #434343;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      font-weight: 400;
    }
    #sellence-popup-we-received-your-message-container {
      width: 244px;
      height: 126px;
      background-color: ${TEXT_COLOR};
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      border-radius: 24px 24px 24px 0;
      align-self: flex-start;
    }
    
    #sellence-popup-we-received-your-message-container-title {
      height: 38px;
      width: 100%;
      background-color: #E0E6EE;
      border-radius: 24px 24px 0 0;
      color: ${BACKGROUND_COLOR};
      font-size: 12px;
      font-weight: 700;
      align-items: center;
      display: flex;
      justify-content: center;
      padding: 11px 0;
    }
    #sellence-popup-we-received-your-message-container-content {
      background-color: ${TEXT_COLOR};
      border-radius: 0 0 24px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 15px;
    }
    #sellence-popup-we-received-your-message-title {
      font-size: 12px;
      font-weight: 700;
      color: #000000;
      margin: 0 auto 2px auto;
    }
    #sellence-popup-we-received-your-message-text {
      font-size: 12px;
      font-weight: 400;
      color: #000000;
      text-align: center;
      margin: 0 auto;
    }
    ${
    !isMobile
      ? `
    #wrap {
        width: 62px;
        height: 62px;
        background-color: ${BACKGROUND_COLOR};
        border-radius: 62px;
        position: relative;
        cursor: pointer;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        transition: 300ms;
    }
    `
      : `
    #wrap {
      width: auto;
      padding: 0 20px;
      gap: 10px;
      height: 62px;
      background-color: ${BACKGROUND_COLOR};
      border-radius: 30px;
      position: relative;
      cursor: pointer;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    `
  }
  `;

  function handleLocationChange() {
    const existingButton = document.getElementById("sellence-button");

    if (isPageExcluded(window.location.href)) {
      if (existingButton) {
        existingButton.remove();
      }
    } else {
      if (!existingButton) {
        document.body.appendChild(anchor);
      }
    }
  }

  document.head.appendChild(style);

  // Initial check on page load
  handleLocationChange();

  // Listen for URL changes
  window.addEventListener("popstate", handleLocationChange);
  window.addEventListener("hashchange", handleLocationChange);

  // In case of single-page applications or frameworks that use history.pushState
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(history, args);
    handleLocationChange();
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    handleLocationChange();
  };
})();
