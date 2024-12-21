(function () {
  // Check if the device is mobile
  function detectDevice() {
    let ch = false;
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  // Constants can be changed to customize the SMS widget
  const TITLE = "Quick answer via text";
  const PHONE_NUMBER = "+12137996421";
  const SELLENCE_URL =
    "https://sellence.com/?utm_source=innerbalance&utm_medium=widget&utm_campaign=1";
  const TERMS_URL = "https://www.innerbalance.com/terms-of-use";
  const BUTTON_TEXT = "Send";
  const TEXT_COLOR = "#FFFFFF";
  const BACKGROUND_COLOR = "#90632D";
  const INPUT_TEXT_COLOR = "#707070";
  const INPUT_ERROR_COLOR = "#F63C45";
  const INPUT_BLUR_COLOR = "#E9F0FD";
  const INPUT_FOCUS_COLOR = BACKGROUND_COLOR;
  const EXCLUDED_URLS = [
    "https://www.innerbalance.com/pre-questionnaire",
    "https://www.innerbalance.com/onboarding-questionnaire",
  ];
  // const INCLUDE_URLS = ["https://www.innerbalance.com/learn", "localhost:8888"];
  const ON_TOP_URLS = [
    "https://www.innerbalance.com/checkout",
    "localhost:8888",
  ];
  let usefulWindowHeight = window.innerHeight - 120;
  const AGREEMENT_TEXT = `By submitting, you authorize Inner Balance to text and call the number you provided with offers & other information, possibly using automated means. Message/data rates apply. Consent is not a condition of purchase. <a href="${TERMS_URL}" target="_blank">Use is subject to terms.</a>`;
  const FORM_TITLE = "Fill in your details, and our team will text you soon";
  const FOOTER_TEXT = "Powered by";

  function isPageExcluded(url) {
    return EXCLUDED_URLS.some((excludedUrl) => {
      const regex = new RegExp(
        excludedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      ); // Escape special characters in URL
      return regex.test(url);
    });
  }

  // function isPageIncluded(url) {
  //   return INCLUDE_URLS.some((excludedUrl) => {
  //     const regex = new RegExp(
  //       excludedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  //     ); // Escape special characters in URL
  //     return regex.test(url);
  //   });
  // }

  function isOnTopPage(url) {
    return ON_TOP_URLS.some((onTopUrl) => {
      const regex = new RegExp(onTopUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")); // Escape special characters in URL
      return regex.test(url);
    });
  }

  const isMobile = detectDevice();
  let isOnTop = isOnTopPage(window.location.href);
  // Load the Google Fonts asynchronously
  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css?family=Poppins:wght@400;500;700;900";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  function isValidPhoneNumber(phoneNumber) {
    const pattern1 = new RegExp(/^\d{10}$/);
    const pattern2 = new RegExp(/^\d{3}-\d{3}-\d{4}$/);
    const pattern3 = new RegExp(/^\d{3} \d{3} \d{4}$/);
    const pattern4 = new RegExp(/^\+1 \d{3}\.\d{3}\.\d{4}$/);
    const pattern5 = new RegExp(/^\+1 \d{3}-\d{3}-\d{4}$/);
    const pattern6 = new RegExp(/^\+1 \d{3} \d{3} \d{4}$/);
    const pattern7 = new RegExp(/^\+1 \d{10}$/);
    const pattern8 = new RegExp(/^\+1\d{10}$/);
    return (
      pattern1.test(phoneNumber) ||
      pattern2.test(phoneNumber) ||
      pattern3.test(phoneNumber) ||
      pattern4.test(phoneNumber) ||
      pattern5.test(phoneNumber) ||
      pattern6.test(phoneNumber) ||
      pattern7.test(phoneNumber) ||
      pattern8.test(phoneNumber)
    );
  }

  const createInputContainer = function (
    title,
    error,
    type,
    validationFunction,
  ) {
    const result = document.createElement("div");
    result.className = "input-container";

    const inputTitle = document.createElement("span");
    inputTitle.className = "input-title";
    inputTitle.textContent = title;

    const input = document.createElement(
      title === "Message" ? "textarea" : "input",
    );
    input.className = "input";
    input.id = title.replace(" ", "").toLowerCase();
    input.type = type;
    input.placeholder = title;
    if (title === "Message") {
      input.setAttribute("rows", "4");
      input.setAttribute(
        "onInput",
        "this.style.height = '';this.style.height = this.scrollHeight + 'px'",
      );
      input.style.resize = "none";
      input.style.overflow = "hidden";
    }

    const errorText = document.createElement("span");
    errorText.className = "error";
    errorText.textContent = error;

    input.addEventListener("input", () => {
      input.style.borderColor = INPUT_TEXT_COLOR;
      errorText.style.display = "none";
      const inputHeight = parseInt(input.style.height);
      if (inputHeight > 38) {
        const fc = document.getElementById(
          "sellence-popup-content-form-container",
        );
        const cc = document.getElementById("sellence-popup-content");
        cc.scrollTop = fc.scrollHeight;
        fc.style.height = "auto";
      }
      if (input.value) {
        inputTitle.style.visibility = "visible";
        if (validationFunction && !validationFunction(input.value)) {
          input.style.borderColor = INPUT_ERROR_COLOR;
          errorText.style.display = "inline";
        }
        if (type === "tel") {
          if (!input.value.startsWith("+1 ")) {
            input.value = "+1 " + input.value.replace(/^\+1\s*/, ""); // Keeps "+1 " once
          }
        }
      } else {
        inputTitle.style.visibility = "hidden";
        errorText.style.display = "none";
        input.style.borderColor = INPUT_TEXT_COLOR;
      }
    });
    input.addEventListener("focus", () => {
      if (!input.value && type === "tel") {
        input.value = "+1 ";
      }
      input.style.borderColor = INPUT_FOCUS_COLOR;
      inputTitle.style.visibility = "visible";
      errorText.style.display = "none";
    });
    input.addEventListener("blur", () => {
      if (!input.value || input.value.trim() === "+1") {
        input.value = "";
        input.style.borderColor = INPUT_BLUR_COLOR;
        inputTitle.style.visibility = "hidden";
      }
      errorText.style.display = "none";
    });

    result.appendChild(inputTitle);
    result.appendChild(input);
    result.appendChild(errorText);

    return result;
  };

  const handleSendButtonClick = async function () {
    // Call endpoint to send data https://app.sellence.com:2083/pop-up/create (POST)
    const customer_name = formContainer.querySelector("#name").value;
    const phone_number = formContainer.querySelector("#mobilephone").value;
    const customer_message = formContainer.querySelector("#message").value;
    const errorText = formContainer.querySelector(".error");
    if (
      !customer_name ||
      !phone_number ||
      errorText.style.visibility === "visible"
    ) {
      return;
    }
    await fetch("https://app.sellence.com:2083/pop-up/create ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name,
        phone_number,
        customer_message,
      }),
    });
    formContainer.remove();
    agreement.remove();
    avatarImageContainer2.remove();
    messageSent.textContent = customer_message;
    content.appendChild(messageSent);
    content.appendChild(avatarImageContainer2);
    weReceivedYourMessageContainer.innerHTML = `<span>Thank you, ${customer_name}</span>.<br> We Received your message. We’ll be reaching out via text to your number:<br> <span>${phone_number}</span>`;
    content.appendChild(weReceivedYourMessageContainer);
    sendButton.remove();
  };

  const onOpenButtonClickListener = function () {
    if (isMobile) {
      header.appendChild(smallCloseIcon);
      anchor.style.visibility = "hidden";
    }
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
    if (isMobile) {
      smallCloseIcon.remove();
      anchor.style.visibility = "visible";
    }
    popUpWrapper.remove();
  };

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
  headerText.textContent = TITLE;

  const headerIcon = document.createElementNS(svgNS, "svg");
  headerIcon.setAttribute("width", "41");
  headerIcon.setAttribute("height", "41");
  headerIcon.setAttribute("viewBox", "0 0 24 24");
  headerIcon.setAttribute("fill", "none");
  const headerIconPath1 = document.createElementNS(svgNS, "path");
  headerIconPath1.setAttribute(
    "d",
    "M3.2902 15.5557C0.599657 10.559 4.21867 4.5 9.89374 4.5H14.5595C18.3926 4.5 21.5 7.60737 21.5 11.4405V11.7727C21.5 15.645 18.1972 18.6942 14.3372 18.3854L12.2307 18.2169C10.4013 18.0705 8.6663 19.0494 7.84556 20.6908C7.48306 21.4158 6.45403 21.4314 6.06974 20.7177L3.2902 15.5557Z",
  );
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
  const footerLink = document.createElement("a");
  footerLink.href = SELLENCE_URL;
  footerLink.target = "_blank";

  const footerIcon = document.createElementNS(svgNS, "svg");
  footerIcon.id = "sellence-popup-footer-icon";
  footerIcon.setAttribute("width", "71");
  footerIcon.setAttribute("height", "21");
  footerIcon.setAttribute("viewBox", "0 0 192 28");
  footerIcon.setAttribute("fill", "none");
  footerIcon.style.display = "block";

  const footerIconPath1 = document.createElementNS(svgNS, "path");
  footerIconPath1.setAttribute(
    "d",
    "M23.1039 18.3741C23.1039 23.8066 18.7726 27.3671 11.9086 27.3671C5.04459 27.3671 0.639883 23.7332 0.162707 17.8969H7.17353C7.24694 20.3929 8.89871 21.9713 11.7618 21.9713C14.1476 21.9713 15.726 21.0536 15.726 19.4019C15.726 18.264 14.5881 17.4198 13.0465 17.1261L8.238 16.2085C4.01682 15.4009 1.22718 12.9416 1.22718 8.68377C1.22718 3.76518 5.55847 0.314824 11.4681 0.314824C17.7448 0.314824 22.2596 3.912 22.6634 9.60141H15.6526C15.4691 7.21553 13.854 5.67388 11.5415 5.67388C9.486 5.67388 8.238 6.77506 8.238 8.20659C8.238 9.38118 9.41259 10.0786 10.8074 10.3355L15.9095 11.3266C20.6079 12.2442 23.1039 14.5567 23.1039 18.3741ZM45.3063 20.9802V27H26.6598V0.645177H45.0494V6.66494H33.5972V10.4456H43.9849V16.4654H33.5972V20.9802H45.3063ZM67.3009 27H49.2783V0.645177H56.2157V20.7233H67.3009V27ZM88.9875 27H70.9649V0.645177H77.9023V20.7233H88.9875V27ZM111.298 20.9802V27H92.6515V0.645177H111.041V6.66494H99.5889V10.4456H109.977V16.4654H99.5889V20.9802H111.298ZM132.118 27L121.62 10.5558V27H115.27V0.645177H122.721L132.448 15.8781V0.645177H138.799V27H132.118ZM155.803 27.5506C148.315 27.5506 142.405 21.5308 142.405 13.7859C142.405 6.07765 148.315 0.0945891 155.803 0.0945891C163.034 0.0945891 168.613 4.90306 169.457 11.8772H162.116C161.565 8.57365 159.106 6.29788 155.876 6.29788C151.985 6.29788 149.526 9.30777 149.526 13.7859C149.526 18.3007 151.985 21.3473 155.876 21.3473C159.069 21.3473 161.529 19.0715 162.116 15.7313H169.457C168.576 22.7788 163.034 27.5506 155.803 27.5506ZM191.7 20.9802V27H173.053V0.645177H191.443V6.66494H179.991V10.4456H190.378V16.4654H179.991V20.9802H191.7Z",
  );
  footerIconPath1.setAttribute("fill", "black");
  footerIcon.appendChild(footerIconPath1);

  footerLink.appendChild(footerIcon);

  footer.appendChild(footerText);
  footer.appendChild(footerLink);

  const avatarImage = document.createElementNS(svgNS, "svg");
  avatarImage.setAttribute("width", "26");
  avatarImage.setAttribute("height", "16");
  avatarImage.setAttribute("viewBox", "0 0 26 16");
  avatarImage.setAttribute("fill", "none");

  const avatarImagePath1 = document.createElementNS(svgNS, "path");
  avatarImagePath1.setAttribute(
    "d",
    "M1.4043 15.2002V9.28682C1.4043 6.79631 3.42326 4.77734 5.91377 4.77734V4.77734C8.40428 4.77734 10.4232 6.7963 10.4232 9.28682V15.2002",
  );
  avatarImagePath1.setAttribute("stroke", "#46503A");
  avatarImagePath1.setAttribute("stroke-width", "2");
  const avatarImagePath2 = document.createElementNS(svgNS, "path");
  avatarImagePath2.setAttribute(
    "d",
    "M14.9326 15.2002V9.28682C14.9326 6.79631 16.9516 4.77734 19.4421 4.77734V4.77734C21.9326 4.77734 23.9516 6.7963 23.9516 9.28682V15.2002",
  );
  avatarImagePath2.setAttribute("stroke", "#46503A");
  avatarImagePath2.setAttribute("stroke-width", "2");
  const avatarImagePath3 = document.createElementNS(svgNS, "path");
  avatarImagePath3.setAttribute("d", "M0.76001 1.52002H25.24");
  avatarImagePath3.setAttribute("stroke", "#46503A");
  avatarImagePath3.setAttribute("stroke-width", "2");

  avatarImage.appendChild(avatarImagePath1);
  avatarImage.appendChild(avatarImagePath2);
  avatarImage.appendChild(avatarImagePath3);

  const avatarImageContainer = document.createElement("div");
  avatarImageContainer.id = "sellence-popup-content-avatar";
  avatarImageContainer.appendChild(avatarImage);

  const avatarImageContainer2 = avatarImageContainer.cloneNode(true);

  const content = document.createElement("div");
  content.id = "sellence-popup-content";

  const formTitle = document.createElement("div");
  formTitle.className = "sellence-popup-content-form-title";
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

  content.appendChild(avatarImageContainer);
  content.appendChild(formTitle);

  const nameInput = createInputContainer("Name", "", "text");
  const phoneInput = createInputContainer(
    "Mobile Phone",
    "Invalid phone number",
    "tel",
    isValidPhoneNumber,
  );
  const messageInput = createInputContainer("Message", "", "text");

  formContainer.appendChild(nameInput);
  formContainer.appendChild(phoneInput);
  formContainer.appendChild(messageInput);

  content.appendChild(avatarImageContainer2);
  content.appendChild(formContainer);
  content.appendChild(agreement);
  content.appendChild(sendButton);

  popUpWrapper.appendChild(header);
  popUpWrapper.appendChild(content);
  popUpWrapper.appendChild(footer);

  // Message sent successfully
  const messageSent = document.createElement("div");
  messageSent.id = "sellence-popup-message-sent";

  const weReceivedYourMessageContainer = document.createElement("div");
  weReceivedYourMessageContainer.className =
    "sellence-popup-content-form-title";

  const smallCloseIcon = document.createElementNS(svgNS, "svg");
  smallCloseIcon.setAttribute("width", "32");
  smallCloseIcon.setAttribute("height", "32");
  smallCloseIcon.setAttribute("viewBox", "0 0 17 17");
  smallCloseIcon.setAttribute("fill", "none");
  const smallCloseIconIconPath1 = document.createElementNS(svgNS, "path");
  smallCloseIconIconPath1.setAttribute("d", "M12.5385 4.5L3.53845 13.5");
  smallCloseIconIconPath1.setAttribute("stroke", TEXT_COLOR);
  smallCloseIconIconPath1.setAttribute("stroke-width", "1.45946");
  smallCloseIconIconPath1.setAttribute("stroke-linecap", "round");
  smallCloseIconIconPath1.setAttribute("stroke-linejoin", "round");
  const smallCloseIconPath2 = document.createElementNS(svgNS, "path");
  smallCloseIconPath2.setAttribute("d", "M3.53845 4.5L12.5385 13.5");
  smallCloseIconPath2.setAttribute("stroke", TEXT_COLOR);
  smallCloseIconPath2.setAttribute("stroke-width", "1.45946");
  smallCloseIconPath2.setAttribute("stroke-linecap", "round");
  smallCloseIconPath2.setAttribute("stroke-linejoin", "round");
  smallCloseIcon.appendChild(smallCloseIconIconPath1);
  smallCloseIcon.appendChild(smallCloseIconPath2);
  smallCloseIcon.addEventListener("click", onCloseButtonClickListener);

  // Create the anchor tag for the SMS widget
  const anchor = document.createElement("a");
  anchor.id = "sellence-button";
  anchor.href = "#";
  anchor.addEventListener("click", onOpenButtonClickListener);

  anchor.appendChild(buttonWrapper);

  // Styles
  const style = document.createElement("style");
  style.textContent = `
${
    isMobile && isOnTop
      ? `
    #sellence-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        text-decoration: none;
        z-index: 999999;
    }`
      : `
    #sellence-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      text-decoration: none;
      z-index: 999999;
    }`
  }
    ${
    isMobile
      ? `
    #sellence-popup-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #F1F1F5;
      display: flex;
      flex-direction: column;
      z-index: 999999;
    } 
        ` // Mobile styles
      : `
    #sellence-popup-wrapper {
      position: fixed;
      right: 20px;
      bottom: 92px;
      width: 342px;
      height: ${usefulWindowHeight}px;
      max-height: 754px;
      background-color: #F1F1F5;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 1px 8.3px 0px #00000036;
      z-index: 999999;
    } 
    ` // Desktop styles
  }

    #sellence-popup-header {
      min-height: 70px;
      max-height: 70px;
      padding-horizontal: 24px;
      background-color: ${BACKGROUND_COLOR};
      border-radius: ${isMobile ? `0` : `8px 8px 0 0`};
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    #sellence-popup-header-text {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: ${TEXT_COLOR};
      display: inline-block;
      margin-left: 24px;
      margin-right: 24px;
    }
    #sellence-popup-content-avatar {
      min-width: 36px;
      min-height: 36px;
      background-color: ${TEXT_COLOR};
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: flex-start;
      box-shadow: 0px 1px 8.3px 0px #00000036;
    }    
    #sellence-popup-content {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: flex-start;
      padding: 16px;
      gap: 16px;
      overflow-y: auto;
    }
    .sellence-popup-content-form-title {
      width: 193px;
      padding: 16px;
      background-color: #DCE2EB;
      border-radius: 0 24px 24px 24px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: #434343;
    }
    .sellence-popup-content-form-title span {
      font-weight: bold;
      color: #000000;
    }
    #sellence-popup-content-form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 235px;
      width: 244px;
      background-color: ${TEXT_COLOR};
      border-radius: 0 24px 24px 24px;
      padding: 24px;
      align-self: flex-start;
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
      font-size: 16px;
      font-weight: 500;
      color: ${INPUT_TEXT_COLOR};
    }
    .error {
      display: none;
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
      text-decoration: underline !important;
      color: #707070 !important;
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
      max-width: 200px;
      padding: 16px;
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
      word-break:break-word;
    }
    #wrap {
        min-width: 62px;
        max-width: 62px;
        min-height: 62px;
        max-height: 62px;
        background-color: ${BACKGROUND_COLOR};
        border-radius: 50%;
        position: relative;
        cursor: pointer;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        transition: 300ms;
        box-shadow: 0px 1px 8.3px 0px #00000036;
    }
  `;

  function handleLocationChange() {
    const existingButton = document.getElementById("sellence-button");
    const existingPopUp = document.getElementById("sellence-popup-wrapper");

    if (isPageExcluded(window.location.href)) {
      if (existingButton) {
        existingButton.remove();
      }
      if (existingPopUp) {
        existingPopUp.remove();
      }
    } else {
      if (existingButton) {
        existingButton.remove();
      }
      if (isOnTopPage(window.location.href) && isMobile) {
        anchor.style.top = "160px";
        anchor.style.bottom = "auto";
      } else {
        anchor.style.bottom = "20px";
        anchor.style.top = "auto";
      }
      document.body.appendChild(anchor);
    }
    //   if (isPageIncluded(window.location.href)) {
    //     if (!existingButton) {
    //
    //       document.body.appendChild(anchor);
    //     }
    //   } else {
    //     if (existingButton) {
    //       existingButton.remove();
    //     }
    //     if (existingPopUp) {
    //       existingPopUp.remove();
    //     }
    //   }
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
