function getLocalStorageData(key) {
  return (
    localStorage.getItem(key) !== null && JSON.parse(localStorage.getItem(key))
  );
}

const data = getLocalStorageData("CAF_DATA_TRIGGER_EVENT");
const pageViewedData = getLocalStorageData("TEST_DATA_PAGE_VIEWED_EVENT");
const pixelID = getLocalStorageData("CAF_PIXEL_ID");
const EVENT_CHECKOUT = getLocalStorageData("TEST_DATA_TRIGGER_CHECKOUT");

console.log("pageViewedData =====", pageViewedData);
const metaPixelID = pixelID.accountID;
console.log("metaPixelID =====", metaPixelID);

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

window.gbfbq = async function (
  pixelID,
  eventName,
  payload,
  eventID,
  nameCustomEvent
) {
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
      data: "testing data based on gbfbq",
    };
    payload = { ...payload, ...t };
    console.log("gbfbq is defined");
    console.log(
      "pixelID === ",
      pixelID,
      "\neventName === ",
      eventName,
      "\npayload === ",
      payload,
      "\neventID === ",
      eventID
    );
    // Initialize the Facebook Pixel
    fbq("init", pixelID, t);
    // Use a switch statement to handle different event names
    switch (eventName) {
      case "PageView":
        fbq(
          "trackSingle",
          pixelID,
          "PageView",
          {},
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
      case "CollectionView":
      case "CartView":
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
};
gbfbq(metaPixelID, "PageView", {});

function giabaoCallBackCheckout(event) {
  console.log("giabaoCallBackCheckout === ", event);
  gbfbq(metaPixelID, "InitiateCheckout", event.data);
}

if (EVENT_CHECKOUT !== null) {
  giabaoCallBackCheckout(EVENT_CHECKOUT);
  localStorage.removeItem("TEST_DATA_TRIGGER_CHECKOUT");
}

if (window.location.href.includes("/checkouts")) {
  console.log("checkout page");
} else if (window.location.href.includes("/products")) {
  const productViewedData = getLocalStorageData(
    "TEST_DATA_PRODUCT_VIEWED_EVENT"
  ).data;
  gbfbq(metaPixelID, "ViewContent", {
    content_ids: productViewedData.productVariant.product.id,
    content_name: productViewedData.productVariant.product.title,
    content_type: productViewedData.productVariant.product.type,
    currency: productViewedData.productVariant.price.currencyCode,
    value: productViewedData.productVariant.price.amount,
  });
} else if (
  window.location.href.includes("/collections") &&
  !window.location.href.includes("/products")
) {
  gbfbq(metaPixelID, "CollectionView", {});
} else if (window.location.href.includes("/cart")) {
  gbfbq(metaPixelID, "CartView", {});
}
