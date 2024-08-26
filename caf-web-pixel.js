// Return false or data
function getLocalStorageData(key) {
  return (
    localStorage.getItem(key) !== null && JSON.parse(localStorage.getItem(key))
  );
}
const pixelID = getLocalStorageData("CAF_PIXEL_ID");

const data = getLocalStorageData("CAF_DATA_TRIGGER_EVENT");
const PAGE_VIEWED_EVENT = getLocalStorageData("TEST_DATA_TRIGGER_PAGE_VIEWED");
const PRODUCT_VIEWED_EVENT = getLocalStorageData(
  "TEST_DATA_TRIGGER_PRODUCT_VIEWED"
);
const COLLECTION_VIEWED_EVENT = getLocalStorageData(
  "TEST_DATA_TRIGGER_COLLECTION_VIEWED"
);
const CART_VIEWED_EVENT = getLocalStorageData("TEST_DATA_TRIGGER_CART_VIEWED");
const CHECKOUT_EVENT = getLocalStorageData("TEST_DATA_TRIGGER_CHECKOUT");

const metaPixelID = pixelID.accountID;
console.log("metaPixelID ===== ", metaPixelID);

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

function convertShopifyToMetaEventName(eventName) {
  if (eventName === "page_viewed") return "PageView";
  if (eventName === "product_viewed") return "ViewContent";
  if (eventName === "collection_viewed") return "CollectionView";
  if (eventName === "cart_viewed") return "CartView";
  if (eventName === "product_added_to_cart") return "AddToCart";
  if (eventName === "checkout_started") return "InitiateCheckout";
  if (eventName === "checkout_completed") return "Purchase";
  return eventName;
}

function triggerEvent(event, payload) {
  const metaEventName = convertShopifyToMetaEventName(event.name);
  console.log(
    "Trigger event:",
    metaEventName,
    "with payload: ",
    payload,
    "for event: ",
    event
  );
  gbfbq(metaPixelID, metaEventName, payload, event.id);
}

// =================== TRIGGER ZONE THEN REMOVE IT FROM LOCAL STORAGE ===================
// PAGE VIEWED EVENT
if (PAGE_VIEWED_EVENT) {
  triggerEvent(PAGE_VIEWED_EVENT, {});
  localStorage.removeItem("TEST_DATA_TRIGGER_PAGE_VIEWED");
}

// PRODUCT VIEWED EVENT
if (PRODUCT_VIEWED_EVENT) {
  triggerEvent(PRODUCT_VIEWED_EVENT, {
    content_ids: PRODUCT_VIEWED_EVENT.data?.productVariant?.product?.id,
    content_name: PRODUCT_VIEWED_EVENT.data?.productVariant?.product?.title,
    content_type: PRODUCT_VIEWED_EVENT.data?.productVariant?.product?.type,
    content_vendor: PRODUCT_VIEWED_EVENT.data?.productVariant?.product?.vendor,
    sku: PRODUCT_VIEWED_EVENT.data?.productVariant?.sku,
    currency: PRODUCT_VIEWED_EVENT.data?.productVariant?.price?.currencyCode,
    value: PRODUCT_VIEWED_EVENT.data?.productVariant?.price?.amount,
  });
  localStorage.removeItem("TEST_DATA_TRIGGER_PRODUCT_VIEWED");
}

// COLLECTION VIEWED EVENT
if (COLLECTION_VIEWED_EVENT) {
  triggerEvent(COLLECTION_VIEWED_EVENT, {
    collection_id: COLLECTION_VIEWED_EVENT.data?.collection?.id,
    collection_name: COLLECTION_VIEWED_EVENT.data?.collection?.title,
  });
  localStorage.removeItem("TEST_DATA_TRIGGER_COLLECTION_VIEWED");
}

// CART VIEWED EVENT
if (CART_VIEWED_EVENT) {
  triggerEvent(CART_VIEWED_EVENT, {
    num_items: CART_VIEWED_EVENT.data?.cart?.lines?.length,
    value: CART_VIEWED_EVENT.data?.cart?.totalQuantity,
  });
  localStorage.removeItem("TEST_DATA_TRIGGER_CART_VIEWED");
}

// CHECKOUT EVENT
if (CHECKOUT_EVENT) {
  triggerEvent(CHECKOUT_EVENT, {
    num_items: CHECKOUT_EVENT.data?.checkout?.lineItems?.length,
    value: CHECKOUT_EVENT.data?.checkout?.totalPrice?.amount,
  });
  localStorage.removeItem("TEST_DATA_TRIGGER_CHECKOUT");
}
