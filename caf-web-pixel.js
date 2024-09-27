// Return false or data
function getLocalStorageData(key) {
  return (
    localStorage.getItem(key) !== null && JSON.parse(localStorage.getItem(key))
  );
}
const metaPixelIDs = getLocalStorageData("CAF_PIXEL_ID");

const OTHER_EVENT = getLocalStorageData("GB_TRIGGER_EVENT");
const PAGE_VIEWED_EVENT = getLocalStorageData("GB_TRIGGER_PAGE_VIEWED");
const PRODUCT_VIEWED_EVENT = getLocalStorageData("GB_TRIGGER_PRODUCT_VIEWED");
const PRODUCT_ADDED_TO_CART_EVENT = getLocalStorageData(
  "GB_TRIGGER_PRODUCT_ADDED_TO_CART"
);
const COLLECTION_VIEWED_EVENT = getLocalStorageData(
  "GB_TRIGGER_COLLECTION_VIEWED"
);
const CART_VIEWED_EVENT = getLocalStorageData("GB_TRIGGER_CART_VIEWED");
const CHECKOUT_STARTED_EVENT = getLocalStorageData(
  "GB_TRIGGER_CHECKOUT_STARTED"
);
const CHECKOUT_COMPLETED_EVENT = getLocalStorageData(
  "GB_TRIGGER_CHECKOUT_COMPLETED"
);
const GB_TRIGGER_SEARCH_EVENT = getLocalStorageData("GB_TRIGGER_SEARCH");

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
    fbq("init", pixelID, eventID);
    // Use a switch statement to handle different event names
    switch (eventName) {
      case "PageView":
        fbq("trackSingle", pixelID, "PageView", {}, { eventID });
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
        fbq("trackSingle", pixelID, eventName, payload, { eventID });
        break;
      case "trackCustom":
        fbq("trackSingle", pixelID, nameCustomEvent, payload, { eventID });
        break;
      default:
        return;
    }
  }
};

function convertShopifyToMetaEventName(eventName) {
  if (eventName === "page_viewed") return "PageView";
  if (eventName === "product_viewed") return "ViewContent";
  if (eventName === "collection_viewed") return "CollectionView"; // Custom event
  if (eventName === "cart_viewed") return "CartView"; // Custom event
  if (eventName === "product_added_to_cart") return "AddToCart";
  if (eventName === "checkout_started") return "InitiateCheckout";
  if (eventName === "checkout_completed") return "Purchase";
  if (eventName === "payment_info_submitted") return "AddPaymentInfo";
  if (eventName === "search_submitted") return "Search";
  return eventName;
}

function triggerEvent(event, payload) {
  const metaEventName = convertShopifyToMetaEventName(event.name);
  metaPixelIDs.forEach((metaPixelID) => {
    gbfbq(metaPixelID, metaEventName, payload, event.id);
  });
}

// =================== TRIGGER ZONE THEN REMOVE IT FROM LOCAL STORAGE ===================
// PAGE VIEWED EVENT
if (PAGE_VIEWED_EVENT) {
  triggerEvent(PAGE_VIEWED_EVENT, {});
  localStorage.removeItem("GB_TRIGGER_PAGE_VIEWED");
}

// PRODUCT VIEWED EVENT
// aka ViewContent
if (PRODUCT_VIEWED_EVENT && window.location.href.includes("/product")) {
  const productVariant = PRODUCT_VIEWED_EVENT.data?.productVariant;
  triggerEvent(PRODUCT_VIEWED_EVENT, {
    content_ids: productVariant.product?.id,
    content_name: productVariant.product?.title,
    content_type: productVariant.product?.type,
    content_vendor: productVariant.product?.vendor,
    sku: productVariant.sku,
    currency: productVariant.price?.currencyCode,
    value: productVariant.price?.amount,
  });
  localStorage.removeItem("GB_TRIGGER_PRODUCT_VIEWED");
}

// COLLECTION VIEWED EVENT
if (COLLECTION_VIEWED_EVENT && window.location.href.includes("/collection")) {
  const collection = COLLECTION_VIEWED_EVENT.data?.collection;
  triggerEvent(COLLECTION_VIEWED_EVENT, {
    collection_id: collection.id,
    collection_name: collection.title,
  });
  localStorage.removeItem("GB_TRIGGER_COLLECTION_VIEWED");
}

// CART VIEWED EVENT
if (CART_VIEWED_EVENT && window.location.href.includes("/cart")) {
  const cart = CART_VIEWED_EVENT.data?.cart;
  triggerEvent(CART_VIEWED_EVENT, {
    num_items: cart.lines?.length,
    value: cart.totalQuantity,
  });
  localStorage.removeItem("GB_TRIGGER_CART_VIEWED");
}

// CHECKOUT STARTED EVENT
// aka InitiateCheckout
if (CHECKOUT_STARTED_EVENT && window.location.href.includes("/checkout")) {
  const checkout = CHECKOUT_STARTED_EVENT.data?.checkout;
  console.log("checkout", checkout);
  const content_ids = checkout.lineItems?.map((lineItem) =>
    parseInt(lineItem.variant?.product?.id)
  );
  const itemQuantity = checkout.lineItems?.map((lineItem) => lineItem.quantity);
  const num_items = itemQuantity.reduce((a, b) => a + b, 0);
  console.log("content_ids", content_ids);
  console.log("num_items", num_items);
  triggerEvent(CHECKOUT_STARTED_EVENT, {
    content_ids,
    currency: checkout.totalPrice?.currencyCode,
    num_items,
    value: checkout.totalPrice?.amount,
  });
  localStorage.removeItem("GB_TRIGGER_CHECKOUT");
}

// CHECKOUT COMPLETED EVENT
// aka Purchase
if (CHECKOUT_COMPLETED_EVENT) {
  const checkout = CHECKOUT_COMPLETED_EVENT.data?.checkout;
  const checkoutTotalPrice = checkout.totalPrice?.amount;
  const allDiscountCodes = checkout.discountApplications?.map((discount) => {
    if (discount.type === "DISCOUNT_CODE") {
      return discount.title;
    }
  });
  const paymentTransactions = checkout.transactions?.map((transaction) => {
    return {
      paymentGateway: transaction.gateway,
      amount: transaction.amount,
    };
  });
  triggerEvent(CHECKOUT_COMPLETED_EVENT, {
    totalPrice: checkoutTotalPrice,
    discountCodesUsed: allDiscountCodes,
    paymentTransactions: paymentTransactions,
    currency: checkout.totalPrice?.currencyCode,
    num_items: checkout.lineItems?.length,
    value: checkout.totalPrice?.amount,
  });
  localStorage.removeItem("GB_TRIGGER_CHECKOUT_COMPLETED");
}

// SEARCH EVENT
if (GB_TRIGGER_SEARCH_EVENT) {
  const searchResult = GB_TRIGGER_SEARCH_EVENT.data.searchResult;
  triggerEvent(GB_TRIGGER_SEARCH_EVENT, {
    search_query: searchResult.query,
    first_product_title: searchResult.productVariants[0]?.product.title,
  });
  localStorage.removeItem("GB_TRIGGER_SEARCH");
}

const style =
  "background-color: darkblue; color: white; font-style: italic; border-radius: 5px; padding: 5px; font-size: 1em;";

// Function to handle the custom event
function handleCustomEvent(customEvent) {
  const event = customEvent.detail;
  if (event.name === "product_added_to_cart") {
    const cartLine = event.data?.cartLine;

    triggerEvent(event, {
      content_ids: [cartLine.merchandise?.product?.id],
      content_name:
        cartLine.merchandise?.product?.title ||
        cartLine.merchandise?.product?.untranslatedTitle,
      content_type: cartLine.merchandise?.product?.type,
      content_vendor: cartLine.merchandise?.product?.vendor,
      sku: cartLine.merchandise?.sku,
      currency: cartLine.merchandise?.price?.currencyCode,
      value: cartLine.merchandise?.price?.amount,
      quantity: cartLine.quantity,
    });
  } else if (event.name === "payment_info_submitted") {
    const checkout = event.data.checkout;
    const checkoutTotalPrice = checkout.totalPrice?.amount;
    const firstDiscountType = checkout.discountApplications[0]?.type;
    const discountCode =
      firstDiscountType === "DISCOUNT_CODE"
        ? checkout.discountApplications[0]?.title
        : null;

    triggerEvent(event, {
      total_price: checkoutTotalPrice,
      first_discount_code: discountCode,
    });
  }
}

// Add an event listener for the custom event
window.addEventListener("customEvent", handleCustomEvent, false);
