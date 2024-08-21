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
    let e, o, n, a, nameCustomEvent;

    if (typeof arguments[0] === "string") e = arguments[0];
    if (typeof arguments[1] === "string") o = arguments[1];
    if (typeof arguments[2] === "object") n = arguments[2];
    if (arguments[3] !== undefined) a = arguments[3];
    if (arguments[4] !== undefined) nameCustomEvent = arguments[4];

    if (!a || a === "") {
      a = new Date().getTime();
    }

    if (
      typeof e === "string" &&
      e.trim() !== "" &&
      typeof o === "string" &&
      o.trim() !== ""
    ) {
      let t = {
        data: "testing based on otfbq",
      };
      console.log("otfbq is defined");
      console.log("e === ", e);
      console.log("o === ", o);
      console.log("n === ", n);
      console.log("a === ", a);
      fbq("init", o); // My Pixel ID

      switch ((fbq("init", e, t), o)) {
        case "PageView":
          console.log("track page view event");
          fbq(
            "trackSingle",
            e,
            "PageView",
            {},
            {
              eventID: a,
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
          fbq("trackSingle", e, o, n, {
            eventID: a,
          });
          break;
        case "trackCustom":
          fbq("trackSingle", e, nameCustomEvent, n, {
            eventID: a,
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
}
