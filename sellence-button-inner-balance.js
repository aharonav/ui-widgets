(function () {
  // Check if the device is mobile
  function detectDevice() {
    let ch = false;
    const regex =
      /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

  const isMobile = detectDevice();
  // Load the Google Fonts asynchronously
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css?family=Manrope";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);

  //Load QR code library
  const qrScript = document.createElement("script");
  qrScript.src =
    "https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js";
  document.head.appendChild(qrScript);

  const svgNS = "http://www.w3.org/2000/svg";

  // Constants can be changed to customize the SMS widget
  const PHONE_NUMBER = "+12137996421";
  const MESSAGE_BODY = "";
  const BUTTON_TEXT = "Text us";
  const TEXT_COLOR = "#FAFAFA";
  const BACKGROUND_COLOR = "#98622B";
  const QR_CODE_COLOR = "#000000";

  // Create QR code wrapper
  const qrWrapper = document.createElement("div");
  qrWrapper.className = "qr-code-wrapper";
  const qrCodeHeaderContainer = document.createElement("div");
  qrCodeHeaderContainer.className = "qr-code-header-container";
  const qrCodeHeaderText = document.createElement("span");
  qrCodeHeaderText.textContent = "Scan the QR code to text us";
  const qrCodeHeaderIcon = document.createElementNS(svgNS, "svg");
  qrCodeHeaderIcon.setAttribute("width", "17");
  qrCodeHeaderContainer.setAttribute("height", "17");
  qrCodeHeaderIcon.setAttribute("viewBox", "0 0 17 17");
  qrCodeHeaderIcon.setAttribute("fill", "none");
  const headerIconPath1 = document.createElementNS(svgNS, "path");
  headerIconPath1.setAttribute("d", "M12.5385 4.5L3.53845 13.5");
  headerIconPath1.setAttribute("stroke", TEXT_COLOR);
  headerIconPath1.setAttribute("stroke-width", "1.45946");
  headerIconPath1.setAttribute("stroke-linecap", "round");
  headerIconPath1.setAttribute("stroke-linejoin", "round");
  const headerIconPath2 = document.createElementNS(svgNS, "path");
  headerIconPath2.setAttribute("d", "M3.53845 4.5L12.5385 13.5");
  headerIconPath2.setAttribute("stroke", TEXT_COLOR);
  headerIconPath2.setAttribute("stroke-width", "1.45946");
  headerIconPath2.setAttribute("stroke-linecap", "round");
  headerIconPath2.setAttribute("stroke-linejoin", "round");
  qrCodeHeaderIcon.appendChild(headerIconPath1);
  qrCodeHeaderIcon.appendChild(headerIconPath2);
  qrCodeHeaderContainer.appendChild(qrCodeHeaderIcon);
  qrCodeHeaderContainer.appendChild(qrCodeHeaderText);
  const qrCodeContainer = document.createElement("div");
  qrCodeContainer.className = "qr-code";
  const qrCodeView = document.createElement("div");
  qrCodeView.className = "qr-code-view";
  qrCodeContainer.appendChild(qrCodeView);
  qrWrapper.appendChild(qrCodeHeaderContainer);
  qrWrapper.appendChild(qrCodeContainer);
  document.body.appendChild(qrWrapper);

  // Create the anchor tag for the SMS widget
  const anchor = document.createElement("a");
  anchor.id = "sellence-button";
  anchor.href = isMobile ? `sms:${PHONE_NUMBER}` : "#";
  anchor.addEventListener("click", function () {
    if (!isMobile) {
      let qr = null;
      const buttonComponent = document.querySelector("#sellence-button");
      buttonComponent.style.display = "none";
      const qrWrapperComponent = document.querySelector(".qr-code-wrapper");
      qrWrapperComponent.style.display = "flex";
      qrWrapperComponent.addEventListener("click", function () {
        qrWrapperComponent.style.display = "none";
        buttonComponent.style.display = "flex";
      });

      // Generate QR code
      const qrCodeViewComponent = document.querySelector(".qr-code-view");
      qrCodeViewComponent.innerHTML = "";
      qr = new QRCode(document.querySelector(".qr-code-view"), {
        text: `sms:${PHONE_NUMBER}`,
        width: 200,
        height: 200,
        colorDark: QR_CODE_COLOR,
        colorLight: TEXT_COLOR,
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  });

  // Create the button wrapper
  const buttonWrapper = document.createElement("div");
  buttonWrapper.id = "wrap";

  // Create the button text
  const buttonText = document.createElement("span");
  buttonText.className = "text";
  buttonText.textContent = BUTTON_TEXT;

  // Create the button icon
  const buttonIcon = document.createElementNS(svgNS, "svg");
  buttonIcon.setAttribute("width", "44");
  buttonIcon.setAttribute("height", "46");
  buttonIcon.setAttribute("viewBox", "0 0 44 46");
  buttonIcon.setAttribute("fill", "none");

  const path1 = document.createElementNS(svgNS, "path");
  path1.setAttribute(
    "d",
    "M2.92302 13.6538C2.92302 9.04436 6.65972 5.30766 11.2692 5.30766H32.7307C37.3402 5.30766 41.0769 9.04437 41.0769 13.6538V28.6614C41.0769 31.9422 38.4172 34.6019 35.1364 34.6019H34.193C32.5557 34.6019 30.9876 35.2618 29.843 36.4325L26.4467 39.9064C25.3698 41.0079 23.4994 40.2454 23.4994 38.705C23.4994 36.4389 21.6623 34.6019 19.3962 34.6019H11.2692C6.65972 34.6019 2.92302 30.8652 2.92302 26.2557V13.6538Z",
  );
  path1.setAttribute("stroke", TEXT_COLOR);
  path1.setAttribute("stroke-width", "2.38462");

  const path2 = document.createElementNS(svgNS, "path");
  path2.setAttribute("d", "M12.1724 15.6903H21.9999");
  path2.setAttribute("stroke", TEXT_COLOR);
  path2.setAttribute("stroke-width", "2.38462");
  path2.setAttribute("stroke-linecap", "round");

  const path3 = document.createElementNS(svgNS, "path");
  path3.setAttribute("d", "M12.1724 23.61H31.2132");
  path3.setAttribute("stroke", TEXT_COLOR);
  path3.setAttribute("stroke-width", "2.38462");
  path3.setAttribute("stroke-linecap", "round");

  // Build widget
  buttonIcon.appendChild(path1);
  buttonIcon.appendChild(path2);
  buttonIcon.appendChild(path3);

  buttonWrapper.appendChild(buttonText);
  buttonWrapper.appendChild(buttonIcon);

  anchor.appendChild(buttonWrapper);

  const style = document.createElement("style");
  style.textContent = `
    #sellence-button {
        position: fixed;
        bottom: ${isMobile ? `200px` : `20px`};
        right: ${isMobile ? `auto` : `20px`};
        left: ${isMobile ? `20px` : `auto`};
        text-decoration: none;
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
    #wrap .text {
      color: ${TEXT_COLOR};
      font-size: 19px;
      display: ${!isMobile ? `none` : `inline`};
      font-family: 'Manrope', sans-serif;
    }
    ${
    !isMobile
      ? `
    #wrap:hover {
      width: auto;
      padding: 0 21px;
      gap: 10px;
    }
    #wrap:hover .text {
      display: inline;
    }
    `
      : ""
  }
    .qr-code-wrapper {
      height: 311px;
      width: 329px;
      position: fixed;
      display: none;
      flex-direction: column;
      bottom: 20px;
      right: 20px;
      border-radius: 50px;
      border: 2px solid ${BACKGROUND_COLOR};
    }
    .qr-code-header-container {
      background-color: ${BACKGROUND_COLOR};
      color: ${TEXT_COLOR};
      padding: 10px;
      border-top-left-radius: 50px;
      border-top-right-radius: 50px;
      font-family: 'Manrope', sans-serif;
      font-size: 19px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }
    .qr-code {
      background-color: ${TEXT_COLOR};
      flex: 1;
      border-bottom-left-radius: 50px;
      border-bottom-right-radius: 50px;
      display: flex;
      align-items: center;
      align-content: center;
    }
    .qr-code-view {
      margin: auto;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(anchor);
})();
