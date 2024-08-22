// Step 1. Initialize the JavaScript pixel SDK (make sure to exclude HTML)
!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = "2.0";
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(
  window,
  document,
  "script",
  "https://connect.facebook.net/en_US/fbevents.js"
);

window.otfbq = async function () {
  if (arguments.length > 0) {
    let pixelID, eventName, payload, eventID, nameCustomEvent;

    if (typeof arguments[0] === "string") pixelID = arguments[0];
    if (typeof arguments[1] === "string") eventName = arguments[1];
    if (typeof arguments[2] === "object") payload = arguments[2];
    if (arguments[3] !== undefined) eventID = arguments[3];
    if (arguments[4] !== undefined) nameCustomEvent = arguments[4];

    if (!eventID || eventID === "") {
      eventID = new Date().getTime();
    }

    if (
      typeof pixelID === "string" &&
      pixelID.trim() !== "" &&
      typeof eventName === "string" &&
      eventName.trim() !== ""
    ) {
      let t = {
        data: "testing based on otfbq",
      };
      payload = { ...payload, ...t };
      console.log("otfbq is defined");
      console.log("pixelID === ", pixelID, "\neventName === ", eventName, "\npayload === ", payload, "\neventID === ", eventID);

      switch ((fbq("init", pixelID, t), eventName)) {
        case "PageView":
          console.log("track page view event");
          fbq(
            "trackSingle",
            pixelID,
            "PageView",
            payload,
            {
              eventID: eventID,
            }
          );
          break;
        case "ViewContent":
        case "Search":
        case "AddToCart":
        case "InitiateCheckout":
        case "AddPaymentInfo":
        case "Lead":
        case "CompleteRegistration":
        case "Purchase":
        case "AddToWishlist":
          console.log("track standard events");
          fbq("trackSingle", pixelID, eventName, payload, {
            eventID: eventID,
          });
          break;
        case "trackCustom":
          fbq("trackSingle", pixelID, nameCustomEvent, payload, {
            eventID: eventID,
          });
          break;
        default:
          return;
      }
    }
  }
};
otfbq("1796727657413629", "PageView", {}, "asdf1265x7vcq123");

if (window.location.href.includes("/checkouts")) {
  otfbq("1796727657413629", "InitiateCheckout", {}, "asdf1265x7vcq123");
} else if (window.location.href.includes("/products")) {
  otfbq("1796727657413629", "ViewContent", {}, "asdf1265x7vcq123");
} 
