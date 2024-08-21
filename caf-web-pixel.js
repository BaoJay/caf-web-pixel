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
  var e, o, n, a;
  if (
    0 < arguments.length &&
    ("string" == typeof arguments[0] && (e = arguments[0]),
    "string" == typeof arguments[1] && (o = arguments[1]),
    "object" == typeof arguments[2] && (n = arguments[2]),
    void 0 !== arguments[3] && (a = arguments[3]),
    void 0 !== arguments[4] && (nameCustomEvent = arguments[4]),
    ("" != a && void 0 !== a) || (a = new Date().getTime()),
    "string" == typeof e &&
      "" != e.replace(/\s+/gi, "") &&
      "string" == typeof o &&
      o.replace(/\s+/gi, ""))
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
    fbq(e, o, a);

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
};
otfbq("1796727657413629", "PageView", {}, "asdf1265x7vcq123");

// Step 2. Only define and subscribe to the event on the Checkout page
analytics.subscribe("checkout_started", async (event) => {
  const currentPathname = event?.context?.document?.location?.pathname;

  if (currentPathname.includes("/checkouts")) {
    otfbq("1796727657413629", "InitiateCheckout", {}, "asdf1265x7vcq123");
  }
});
