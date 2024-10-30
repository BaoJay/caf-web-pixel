// Define CAF backend server URL
// dev = "http://localhost:3000/"
// prod = "https://ttgumirxpi.ap-southeast-2.awsapprunner.com/"
const CAF_BACKEND_URL = "https://ttgumirxpi.ap-southeast-2.awsapprunner.com/";

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

// ======================= Cookies related functions =======================
function gbSetCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toGMTString();
  document.cookie = `${name}=${value};${expires};path=/`;
}
function gbGetCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    let cookieTrimmed = cookie.trim();
    if (cookieTrimmed.startsWith(nameEQ)) {
      return cookieTrimmed.substring(nameEQ.length, cookieTrimmed.length);
    }
  }
  return "";
}
function gbDeleteCookie(name) {
  const date = new Date();
  date.setTime(date.getTime() + 0); // Set the expiration date to the past
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=;${expires};path=/`;
}

// ======================= IP ADDRESS related functions =======================
let gb_ip = "";
function getIP() {
  return fetch("https://www.cloudflare.com/cdn-cgi/trace").then((t) =>
    t.text()
  );
}
function isIPv6(ip) {
  const ipv6Pattern = `
    ^(?:
      (?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
      (?:[a-fA-F\\d]{1,4}:){6}
        (?:
          (?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)
          (?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}|
          :[a-fA-F\\d]{1,4}|
          :
        )|
      (?:[a-fA-F\\d]{1,4}:){5}
        (?:
          :(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)
          (?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}|
          (?::[a-fA-F\\d]{1,4}){1,2}|
          :
        )|
      (?:[a-fA-F\\d]{1,4}:){4}
        (?:
          (?::[a-fA-F\\d]{1,4}){0,1}:
          (?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)
          (?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}|
          (?::[a-fA-F\\d]{1,4}){1,3}|
          :
        )|
      (?:[a-fA-F\\d]{1,4}:){3}
        (?:
          (?::[a-fA-F\\d]{1,4}){0,2}:
          (?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)
          (?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}|
          (?::[a-fA-F\\d]{1,4}){1,4}|
          :
        )|
      (?:[a-fA-F\\d]{1,4}:){2}
        (?:
          (?::[a-fA-F\\d]{1,4}){0,3}:
          (?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)
          (?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}|
          (?::[a-fA-F\\d]{1,4}){1,5}|
          :
        )|
      (?:[a-fA-F\\d]{1,4}:){1}
        (?:
          (?::[a-fA-F\\d]{1,4}){0,4}:
          (?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)
          (?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}|
          (?::[a-fA-F\\d]{1,4}){1,6}|
          :
        )|
      (?:
        (?::(?::[a-fA-F\\d]{1,4}){0,5}:
        (?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)
        (?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}|
        (?::[a-fA-F\\d]{1,4}){1,7}|
        :
      ))
    )
    (?:%[0-9a-zA-Z]{1,})?$
  `.replace(/\s+/g, "");

  return new RegExp(ipv6Pattern, "gm").test(ip);
}
function ipv4ToIpv6(ipv4) {
  const segments = ipv4.split(".").map((segment) => parseInt(segment, 10));

  if (
    segments.length !== 4 ||
    segments.some((segment) => isNaN(segment) || segment < 0 || segment > 255)
  ) {
    throw new Error("Invalid IPv4 address format");
  }

  const ipv6Segments = segments.map((segment) =>
    segment.toString(16).padStart(2, "0")
  );
  return `::ffff:${ipv6Segments[0]}:${ipv6Segments[1]}:${ipv6Segments[2]}:${ipv6Segments[3]}`;
}
function isIPv4(ip) {
  const ipv4Pattern = `
    ^(
      25[0-5]|
      2[0-4][0-9]|
      [01]?[0-9][0-9]?
    )\\.
    (
      25[0-5]|
      2[0-4][0-9]|
      [01]?[0-9][0-9]?
    )\\.
    (
      25[0-5]|
      2[0-4][0-9]|
      [01]?[0-9][0-9]?
    )\\.
    (
      25[0-5]|
      2[0-4][0-9]|
      [01]?[0-9][0-9]?
    )$
  `.replace(/\s+/g, "");

  return new RegExp(ipv4Pattern).test(ip);
}
async function otDetectIP() {
  try {
    if (gb_ip !== "") return gb_ip;

    let detectedIP = "";
    const response = await getIP();
    const ip = response.split("ip=")[1].split("\n")[0];

    if (ip === null || ip === undefined) return "";
    // const excludedShops = [
    //   "duong-test-px3.myshopify.com",
    //   "juntestpx.myshopify.com",
    //   "12b241-2.myshopify.com",
    //   "personalizeddoghouse.myshopify.com",
    //   "mellydecor.myshopify.com",
    //   "creek-lander.myshopify.com",
    //   "custype.myshopify.com",
    //   "ericajewelstoronro.myshopify.com",
    //   "blunico.myshopify.com",
    //   "fitin30s.myshopify.com",
    //   "petti-store-japan.myshopify.com",
    //   "seniors-bra.myshopify.com",
    //   "vevacare.myshopify.com",
    //   "b71922.myshopify.com",
    //   "8b47b5.myshopify.com",
    //   "theuptest.myshopify.com",
    //   "a0224c.myshopify.com",
    //   "98f2a2-2.myshopify.com",
    //   "superladystar.myshopify.com",
    // ];

    // if (!excludedShops.includes(ot_fb_shop) && (isIPv4(ip) || isIPv6(ip))) {
    //   detectedIP = isIPv6(ip) ? ip : ipv4ToIpv6(ip);
    // }
    detectedIP = isIPv6(ip) ? ip : ipv4ToIpv6(ip);
    console.log("detectedIP === ", detectedIP);

    return detectedIP;
  } catch (error) {
    return "Something went wrong with otDetectIP";
  }
}

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
  eventPayload,
  nameCustomEvent
) {
  if (!eventPayload || eventPayload === "") {
    eventPayload = new Date().getTime();
  }
  const { eventID } = eventPayload;
  const userIP = await otDetectIP();
  const eventAdvancedMatching = {
    external_id: eventPayload.client_id,
    client_ip_address: userIP,
  };
  console.log("eventAdvancedMatching", eventAdvancedMatching);

  if (
    typeof pixelID === "string" &&
    pixelID.trim() !== "" &&
    typeof eventName === "string" &&
    eventName.trim() !== ""
  ) {
    fbq("init", pixelID, eventAdvancedMatching);
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

function gbConvertionEvent(metaPixelID, eventName, payload) {
  // Send data to CAF backend
  console.log("Send data to CAF backend");
  fetch(CAF_BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metaPixelID, eventName, payload }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

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
  console.log("event", event);
  const eventPayload = {
    eventID: event.id,
    client_id: event.clientId,
  };
  metaPixelIDs.forEach((metaPixelID) => {
    gbfbq(metaPixelID, metaEventName, payload, eventPayload);
    gbConvertionEvent(metaPixelID, metaEventName, payload);
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
  const itemsQuantity = checkout.lineItems?.map(
    (lineItem) => lineItem.quantity
  );
  const num_items = itemsQuantity.reduce((a, b) => a + b, 0);
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
  const content_ids = checkout.lineItems?.map((lineItem) =>
    parseInt(lineItem.variant?.product?.id)
  );
  const itemsQuantity = checkout.lineItems?.map(
    (lineItem) => lineItem.quantity
  );
  const num_items = itemsQuantity.reduce((a, b) => a + b, 0);
  triggerEvent(CHECKOUT_COMPLETED_EVENT, {
    totalPrice: checkoutTotalPrice,
    discountCodesUsed: allDiscountCodes,
    paymentTransactions: paymentTransactions,
    content_ids,
    currency: checkout.totalPrice?.currencyCode,
    num_items,
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
