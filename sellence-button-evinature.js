(function () {  
  // Google Analytics
  const gaScript = document.createElement("script");
  gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-1RGYN3KY3Z";
  gaScript.async = true;
  document.head.appendChild(gaScript);

  // Initialize Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());

  gtag('config', 'G-1RGYN3KY3Z');
  
  function trackButtonDisplay(siteName) {
    gtag('event', 'button_display', {
      'event_category': 'Button',
      'event_label': siteName, // Replace with site-specific name
      'value': 1
    });
  }
  // Check if the device is mobile
  function detectDevice() {
    let ch = false;
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  // Constants can be changed to customize the SMS widget
  //const TITLE = "Quick answer via text";
  const TITLE = "Talk to an Expert 24/7";
  const PHONE_NUMBER = "+12137996421";
  const SELLENCE_URL =
    "https://sellence.com/?utm_source=evinature&utm_medium=widget&utm_campaign=1";
  const TERMS_URL = "https://evinature.com/terms-and-conditions/";
  const BUTTON_TEXT = "Send";
  const TEXT_COLOR = "#FFFFFF";
  const BACKGROUND_COLOR = "#43D4C2";
  const INPUT_TEXT_COLOR = "#707070";
  const INPUT_ERROR_COLOR = "#F63C45";
  const INPUT_BLUR_COLOR = "#E9F0FD";
  const INPUT_FOCUS_COLOR = BACKGROUND_COLOR;
  const EXCLUDED_URLS = [];
  // const INCLUDE_URLS = ["https://www.innerbalance.com/learn", "localhost:8888"];
  const ON_TOP_URLS = [
    "localhost:8888",
  ];
  let usefulWindowHeight = window.innerHeight - 120;
  const AGREEMENT_TEXT = `By submitting, you authorize Evinature to text and call the number you provided with offers & other information, possibly using automated means. Message/data rates apply. Consent is not a condition of purchase. <a href="${TERMS_URL}" target="_blank">Use is subject to terms.</a>`;
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
    result.className = "sellence-input-container";

    const inputTitle = document.createElement("span");
    inputTitle.className = "sellence-input-title";
    inputTitle.textContent = title;

    const input = document.createElement(
      title === "Message" ? "textarea" : "input",
    );
    input.className = "sellence-input";
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
    errorText.className = "sellence-error";
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
      input.style.borderColor = `${INPUT_FOCUS_COLOR} !important`;
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
    const errorText = formContainer.querySelector(".sellence-error");
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
    weReceivedYourMessageContainer.innerHTML = `<span>Thank you, ${customer_name}</span>.<br> We Received your message and will be reaching out via text to your number:<br> <span>${phone_number}</span> within 4-6 hours.`;
    content.appendChild(weReceivedYourMessageContainer);
    sendButton.remove();
  };

  const onOpenButtonClickListener = function () {
    gtag('event', 'button_click', {
      'event_category': 'Button',
      'event_label': window.location.hostname, // Captures the domain of the website
      'value': 1
    });
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
  buttonWrapper.id = "sellence-wrap";

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

  // Avatar image
  const avatarImage = document.createElementNS(svgNS, "svg");
  avatarImage.setAttribute("width", "26");
  avatarImage.setAttribute("height", "26");
  avatarImage.setAttribute("viewBox", "6 -6.5 77 77");
  avatarImage.setAttribute("fill", "none");

  // Complete evinature logo paths
  const avatarImagePath1 = document.createElementNS(svgNS, "path");
  avatarImagePath1.setAttribute(
    "d",
    "M 82.109375 26.945312 C 79.269531 25.054688 75.800781 24.582031 72.488281 25.527344 C 69.335938 26.472656 66.652344 28.679688 65.078125 31.671875 C 64.761719 32.300781 64.917969 33.089844 65.550781 33.5625 C 67.441406 34.824219 69.648438 35.453125 72.015625 35.453125 C 73.121094 35.453125 74.066406 35.296875 75.171875 34.980469 C 78.480469 34.035156 81.003906 31.828125 82.582031 28.835938 C 83.054688 28.207031 82.898438 27.257812 82.109375 26.945312 Z M 74.539062 32.144531 C 72.648438 32.617188 70.4375 32.460938 68.546875 31.671875 C 69.808594 29.9375 71.386719 28.835938 73.433594 28.207031 C 75.484375 27.574219 77.535156 27.734375 79.429688 28.679688 C 78.167969 30.410156 76.433594 31.671875 74.539062 32.144531 Z M 74.539062 32.144531"
  );
  avatarImagePath1.setAttribute("fill", "#caaf91");
  avatarImagePath1.setAttribute("fill-opacity", "1");
  avatarImagePath1.setAttribute("fill-rule", "nonzero");
  
  const avatarImagePath2 = document.createElementNS(svgNS, "path");
  avatarImagePath2.setAttribute(
    "d",
    "M 55.457031 18.121094 C 55.613281 18.121094 55.769531 18.121094 55.929688 18.121094 C 59.082031 17.019531 61.765625 14.8125 63.183594 11.816406 C 64.601562 8.824219 64.601562 5.355469 63.339844 2.207031 C 63.027344 1.574219 62.238281 1.101562 61.605469 1.417969 C 58.292969 2.519531 55.769531 4.726562 54.351562 7.722656 C 52.933594 10.714844 52.933594 14.179688 54.195312 17.332031 C 54.351562 17.804688 54.824219 18.121094 55.457031 18.121094 Z M 56.875 8.824219 C 57.820312 6.933594 59.242188 5.515625 61.132812 4.570312 C 61.605469 6.617188 61.449219 8.667969 60.660156 10.558594 C 59.871094 12.449219 58.292969 13.867188 56.558594 14.8125 C 55.769531 12.761719 55.929688 10.714844 56.875 8.824219 Z M 56.875 8.824219"
  );
  avatarImagePath2.setAttribute("fill", "#caaf91");
  avatarImagePath2.setAttribute("fill-opacity", "1");
  avatarImagePath2.setAttribute("fill-rule", "nonzero");
  
  const avatarImagePath3 = document.createElementNS(svgNS, "path");
  avatarImagePath3.setAttribute(
    "d",
    "M 17.445312 35.453125 C 19.65625 35.453125 21.863281 34.824219 23.914062 33.5625 C 24.542969 33.246094 24.859375 32.300781 24.386719 31.671875 C 22.808594 28.519531 20.128906 26.472656 16.972656 25.527344 C 13.660156 24.582031 10.347656 25.054688 7.351562 26.945312 C 6.722656 27.417969 6.5625 28.207031 6.878906 28.835938 C 8.457031 31.828125 11.136719 34.035156 14.292969 34.980469 C 15.394531 35.296875 16.5 35.453125 17.445312 35.453125 Z M 10.191406 28.679688 C 12.085938 27.890625 14.132812 27.734375 16.183594 28.363281 C 18.234375 28.992188 19.8125 30.097656 21.074219 31.828125 C 19.179688 32.617188 17.132812 32.773438 15.082031 32.300781 C 13.1875 31.671875 11.453125 30.410156 10.191406 28.679688 Z M 10.191406 28.679688"
  );
  avatarImagePath3.setAttribute("fill", "#caaf91");
  avatarImagePath3.setAttribute("fill-opacity", "1");
  avatarImagePath3.setAttribute("fill-rule", "nonzero");
  
  const avatarImagePath4 = document.createElementNS(svgNS, "path");
  avatarImagePath4.setAttribute(
    "d",
    "M 33.691406 18.121094 C 33.847656 18.121094 34.007812 18.121094 34.164062 18.121094 C 34.796875 18.121094 35.269531 17.804688 35.425781 17.175781 C 36.84375 14.023438 36.6875 10.558594 35.269531 7.5625 C 33.847656 4.570312 31.324219 2.207031 28.011719 1.261719 C 27.226562 1.101562 26.59375 1.417969 26.277344 2.046875 C 25.015625 5.199219 25.015625 8.667969 26.4375 11.660156 C 27.855469 14.652344 30.535156 17.019531 33.691406 18.121094 Z M 28.644531 4.570312 C 30.535156 5.515625 31.957031 6.933594 32.902344 8.824219 C 33.691406 10.714844 34.007812 12.761719 33.375 14.8125 C 31.484375 13.867188 30.0625 12.449219 29.273438 10.558594 C 28.171875 8.667969 28.011719 6.460938 28.644531 4.570312 Z M 28.644531 4.570312"
  );
  avatarImagePath4.setAttribute("fill", "#caaf91");
  avatarImagePath4.setAttribute("fill-opacity", "1");
  avatarImagePath4.setAttribute("fill-rule", "nonzero");

  const avatarImagePath5 = document.createElementNS(svgNS, "path");
  avatarImagePath5.setAttribute(
    "d",
    "M 64.128906 35.453125 C 62.078125 35.453125 59.871094 35.925781 57.820312 36.714844 C 58.292969 37.660156 58.925781 38.445312 59.554688 39.078125 C 60.976562 38.445312 62.554688 38.289062 64.128906 38.289062 C 67.914062 38.289062 71.699219 40.023438 74.222656 43.015625 C 72.332031 43.960938 70.4375 44.433594 68.386719 44.433594 C 65.707031 44.433594 63.027344 43.648438 60.816406 42.070312 C 58.292969 40.339844 56.558594 37.660156 55.613281 34.824219 C 55.296875 33.878906 55.140625 32.933594 55.140625 31.988281 C 56.246094 31.988281 57.347656 31.828125 58.292969 31.671875 C 65.550781 30.253906 71.226562 24.582031 72.332031 17.175781 C 72.488281 16.386719 71.859375 15.757812 71.226562 15.597656 C 70.28125 15.441406 69.335938 15.285156 68.230469 15.285156 C 60.976562 15.285156 54.507812 20.167969 52.773438 27.257812 C 52.773438 27.257812 52.773438 27.417969 52.773438 27.417969 C 53.722656 27.574219 54.667969 27.734375 55.769531 27.574219 C 57.347656 21.902344 62.554688 18.121094 68.386719 18.121094 C 68.703125 18.121094 69.019531 18.121094 69.335938 18.121094 C 67.914062 23.476562 63.5 27.734375 57.980469 28.679688 C 55.769531 29.152344 53.40625 28.992188 51.199219 28.363281 C 50.09375 28.046875 48.988281 27.574219 48.042969 26.945312 C 47.726562 26.785156 47.570312 26.628906 47.253906 26.472656 C 47.726562 26 48.042969 25.683594 48.359375 25.210938 C 50.882812 22.058594 52.144531 18.4375 52.144531 14.496094 C 52.144531 9.296875 49.9375 4.410156 45.992188 1.101562 C 45.519531 0.628906 44.730469 0.628906 44.101562 1.101562 C 40.15625 4.410156 37.949219 9.296875 37.949219 14.496094 C 37.949219 18.59375 39.367188 22.53125 41.890625 25.527344 C 42.679688 25.054688 43.46875 24.421875 44.101562 23.636719 C 41.890625 21.113281 40.789062 17.804688 40.789062 14.339844 C 40.789062 10.398438 42.367188 6.777344 45.046875 4.097656 C 47.726562 6.777344 49.304688 10.558594 49.304688 14.339844 C 49.304688 17.648438 48.199219 20.800781 46.152344 23.320312 C 45.046875 24.738281 43.628906 26 41.890625 26.945312 C 41.578125 27.101562 41.105469 27.417969 40.789062 27.574219 C 40.15625 27.890625 39.527344 28.046875 38.738281 28.363281 C 38.894531 29.308594 39.054688 30.253906 39.054688 31.199219 C 39.054688 31.515625 39.054688 31.828125 39.054688 32.144531 C 40.316406 32.460938 41.578125 33.089844 42.679688 33.71875 C 42.207031 34.191406 41.734375 34.664062 41.261719 35.296875 C 39.84375 37.027344 38.738281 39.078125 38.105469 41.285156 C 37.792969 40.96875 37.632812 40.652344 37.320312 40.339844 C 35.742188 38.605469 33.847656 37.34375 31.484375 36.398438 C 29.75 35.769531 27.699219 35.296875 25.804688 35.296875 C 20.441406 35.296875 15.394531 37.972656 12.398438 42.386719 C 12.242188 42.703125 12.085938 43.175781 12.242188 43.488281 C 12.242188 43.804688 12.558594 44.277344 12.871094 44.433594 C 15.394531 46.324219 18.550781 47.269531 21.546875 47.269531 C 26.59375 47.269531 31.011719 44.90625 34.007812 41.285156 C 34.320312 41.597656 34.636719 41.914062 34.953125 42.230469 C 36.214844 43.648438 37.003906 45.378906 37.160156 47.269531 C 37.160156 48.058594 37.320312 48.847656 37.476562 49.632812 C 38.105469 52.628906 39.527344 55.464844 41.578125 57.671875 C 42.367188 57.199219 43.152344 56.566406 43.941406 55.9375 C 42.207031 54.046875 40.945312 51.683594 40.316406 49.003906 C 39.210938 43.332031 41.578125 37.816406 45.835938 34.507812 C 45.992188 34.351562 46.152344 34.191406 46.308594 34.191406 C 46.308594 34.191406 46.308594 34.191406 46.464844 34.191406 C 46.625 34.035156 46.78125 34.035156 46.9375 33.878906 C 46.9375 33.878906 47.097656 33.878906 47.097656 33.71875 C 47.253906 33.5625 47.414062 33.5625 47.570312 33.40625 C 47.726562 33.40625 47.726562 33.246094 47.886719 33.246094 C 49.148438 32.617188 50.410156 32.144531 51.828125 31.828125 C 51.984375 31.828125 52.144531 31.828125 52.300781 31.828125 C 52.300781 33.089844 52.460938 34.191406 52.773438 35.296875 C 53.089844 36.554688 53.5625 37.660156 54.195312 38.761719 C 53.246094 39.550781 52.460938 40.339844 51.828125 41.285156 C 51.039062 38.921875 49.777344 36.554688 48.199219 34.664062 C 47.414062 35.136719 46.625 35.769531 45.835938 36.398438 C 48.832031 39.707031 50.410156 44.277344 49.460938 49.003906 C 48.988281 51.367188 48.042969 53.417969 46.625 55.148438 C 45.203125 56.882812 43.46875 58.300781 41.417969 59.246094 C 40.628906 59.5625 39.84375 59.875 38.894531 60.191406 C 38.105469 60.347656 37.632812 61.136719 37.949219 61.925781 C 38.105469 62.554688 38.738281 63.027344 39.367188 63.027344 C 39.527344 63.027344 39.683594 63.027344 39.683594 63.027344 C 40.628906 62.714844 41.734375 62.398438 42.679688 61.925781 C 43.46875 61.609375 44.257812 61.136719 45.046875 60.507812 C 46.625 61.609375 48.359375 62.398438 50.410156 63.027344 C 50.566406 63.027344 50.722656 63.027344 50.722656 63.027344 C 51.355469 63.027344 51.984375 62.554688 52.144531 61.925781 C 52.300781 61.136719 51.828125 60.347656 51.199219 60.191406 C 49.9375 59.875 48.675781 59.246094 47.570312 58.617188 C 48.042969 58.144531 48.675781 57.511719 48.988281 57.039062 C 50.722656 54.835938 51.828125 52.3125 52.460938 49.632812 C 52.617188 48.847656 52.773438 48.058594 52.773438 47.269531 C 53.089844 44.75 54.351562 42.859375 56.085938 41.285156 C 57.03125 42.386719 58.136719 43.488281 59.398438 44.277344 C 62.078125 46.167969 65.234375 47.113281 68.546875 47.113281 C 71.699219 47.113281 74.695312 46.167969 77.378906 44.433594 C 77.695312 44.277344 77.851562 43.960938 78.007812 43.488281 C 78.007812 43.175781 78.007812 42.703125 77.851562 42.386719 C 74.382812 38.132812 69.492188 35.453125 64.128906 35.453125 Z M 21.546875 44.433594 C 19.496094 44.433594 17.605469 43.960938 15.710938 43.015625 C 18.234375 40.023438 21.863281 38.289062 25.804688 38.289062 C 27.382812 38.289062 28.960938 38.605469 30.378906 39.078125 C 30.851562 39.234375 31.167969 39.394531 31.640625 39.550781 C 29.117188 42.542969 25.488281 44.433594 21.546875 44.433594 Z M 46.9375 30.726562 C 46.78125 30.726562 46.78125 30.882812 46.625 30.882812 C 46.464844 30.882812 46.308594 31.042969 46.308594 31.042969 C 46.152344 31.199219 45.992188 31.199219 45.835938 31.355469 C 45.675781 31.355469 45.675781 31.515625 45.519531 31.515625 C 45.363281 31.671875 45.203125 31.671875 44.890625 31.828125 C 43.941406 31.199219 42.996094 30.726562 41.890625 30.253906 C 42.367188 30.097656 42.839844 29.78125 43.152344 29.625 C 43.785156 29.308594 44.257812 28.992188 44.730469 28.519531 C 45.203125 28.835938 45.835938 29.308594 46.308594 29.625 C 46.78125 29.9375 47.253906 30.097656 47.570312 30.253906 C 47.570312 30.410156 47.253906 30.570312 46.9375 30.726562 Z M 46.9375 30.726562"
  );
  avatarImagePath5.setAttribute("fill", "#caaf91");
  avatarImagePath5.setAttribute("fill-opacity", "1");
  avatarImagePath5.setAttribute("fill-rule", "nonzero");

  const avatarImagePath6 = document.createElementNS(svgNS, "path");
  avatarImagePath6.setAttribute(
    "d",
    "M 34.636719 31.828125 C 34.636719 32.460938 34.636719 33.089844 34.480469 33.71875 C 34.320312 34.507812 34.007812 35.296875 33.847656 36.082031 C 34.796875 36.554688 35.582031 37.027344 36.371094 37.660156 C 36.84375 36.554688 37.160156 35.453125 37.476562 34.191406 C 37.632812 33.246094 37.792969 32.144531 37.792969 31.199219 C 37.792969 29.625 37.476562 28.046875 37.003906 26.472656 C 34.953125 19.695312 28.800781 15.285156 21.703125 15.285156 C 20.601562 15.285156 19.65625 15.441406 18.707031 15.597656 C 17.917969 15.757812 17.445312 16.542969 17.605469 17.175781 C 18.707031 25.683594 25.964844 31.828125 34.636719 31.828125 Z M 21.546875 18.121094 C 27.382812 18.121094 32.429688 21.902344 34.164062 27.417969 C 34.320312 27.890625 34.480469 28.519531 34.480469 28.992188 C 27.855469 28.992188 22.179688 24.421875 20.601562 18.121094 C 20.917969 18.121094 21.230469 18.121094 21.546875 18.121094 Z M 21.546875 18.121094"
  );
  avatarImagePath6.setAttribute("fill", "#caaf91");
  avatarImagePath6.setAttribute("fill-opacity", "1");
  avatarImagePath6.setAttribute("fill-rule", "nonzero");

  avatarImage.appendChild(avatarImagePath1);
  avatarImage.appendChild(avatarImagePath2);
  avatarImage.appendChild(avatarImagePath3);
  avatarImage.appendChild(avatarImagePath4);
  avatarImage.appendChild(avatarImagePath5);
  avatarImage.appendChild(avatarImagePath6);

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
  inputContainer.className = "sellence-input-container";

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
      margin: 0;
      padding: 0 24px;
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
    .sellence-input-container {
      display: flex;
      flex-direction: column;
    }
    .sellence-input-title {
      visibility: hidden;
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      font-weight: 400;
      color: ${INPUT_FOCUS_COLOR};
    }
    .sellence-input {
      display: inline-block;
      box-sizing: border-box;
      height: 34px;
      width: 100%;
      border: none !important;
      border-bottom: 2px solid ${INPUT_BLUR_COLOR} !important;
      outline: none;
      padding: 7px 0 !important;
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: ${INPUT_TEXT_COLOR};
    }
    .sellence-error {
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
    #sellence-popup-footer p {
      margin: 0;
      padding: 0;
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
    #sellence-wrap {
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
      trackButtonDisplay(window.location.hostname);
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
