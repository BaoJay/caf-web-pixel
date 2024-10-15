var rootlinkFBPixel = "https://apps.omegatheme.com/facebook-pixel";
function otTransformURL(t) {
  var e = t.split("?")[1];
  return void 0 !== e
    ? -1 !== e.indexOf("&")
      ? ((e = e.slice(e.indexOf("&") + 1, e.length)), t.split("?")[0] + "?" + e)
      : t.split("?")[0]
    : t;
}
function otConvertShopName() {
  return null != localStorage.getItem("ot_fb_shop")
    ? localStorage.getItem("ot_fb_shop")
    : "";
}
function otConvertPageUrl() {
  var t = window.location.href,
    e = t.indexOf("/wpm@"),
    o = t.indexOf("/sandbox/modern") + "/sandbox/modern".length,
    e = t.slice(e, o);
  return t.replace(e, "");
}
function otIsJsonString(t) {
  try {
    JSON.parse(t);
  } catch (t) {
    return !1;
  }
  return !0;
}
function otSetCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toGMTString();
  document.cookie = `${name}=${value};${expires};path=/`;
}
function otGetCookie(name) {
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
function otDeleteCookie(name) {
  const date = new Date();
  date.setTime(date.getTime() + 0); // Set the expiration date to the past
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=;${expires};path=/`;
}
function generateEventID(length) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const charactersArray = characters.split("");
  let result = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersArray.length);
    result.push(charactersArray[randomIndex]);
  }

  return result.join("");
}
function ot_getUrlParam(t) {
  t = window.location.search.match("[?&]" + t + "(?:&|$|=([^&]*))");
  return t ? t[1] || "" : null;
}
function getRandomInt(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  return Math.floor(Math.random() * (maxFloor - minCeil) + minCeil);
}
async function sha256(t) {
  (t = new TextEncoder().encode(t)),
    (t = await crypto.subtle.digest("SHA-256", t));
  return Array.from(new Uint8Array(t))
    .map((t) => t.toString(16).padStart(2, "0"))
    .join("");
}
function otTrackEventConversionAPI(t, e) {
  fetch(t, {
    method: "POST",
    body: e,
  })
    .then(function (t) {})
    .catch(function (t) {
      console.log(t);
    });
}
function otSaveAdvancedMatchings(data) {
  const email = data.email || "";
  const city = data.shippingAddress.city
    ? data.shippingAddress.city.toLowerCase()
    : "";
  const phone = data.shippingAddress.phone || "";
  const zip = data.shippingAddress.zip || "";
  const firstName = data.shippingAddress.firstName
    ? data.shippingAddress.firstName.toLowerCase()
    : "";
  const lastName = data.shippingAddress.lastName
    ? data.shippingAddress.lastName.toLowerCase()
    : "";
  const countryCode = data.shippingAddress.countryCode
    ? data.shippingAddress.countryCode.toLowerCase()
    : "";
  const provinceCode = data.shippingAddress.provinceCode
    ? data.shippingAddress.provinceCode.toLowerCase()
    : "";

  const advancedMatchings = {
    em: email,
    ct: city,
    ph: phone,
    zp: zip,
    fn: firstName,
    ln: lastName,
    external_id: externalID,
    country: countryCode,
    st: provinceCode,
  };

  // Remove empty values
  Object.keys(advancedMatchings).forEach((key) => {
    if (advancedMatchings[key] === "") {
      delete advancedMatchings[key];
    }
  });

  window.localStorage.setItem(
    "OT_DATA_CUSTOMER__TRACK_FB",
    JSON.stringify(advancedMatchings)
  );
  OT_DATA_CUSTOMER__TRACK_FB = advancedMatchings;

  const basicMatchings = {
    em: email,
    ct: city,
    ph: phone,
    zp: zip,
    first_name: firstName,
    last_name: lastName,
    external_id: externalID,
  };

  window.localStorage.setItem(
    "OT_DATA_CUSTOMER",
    JSON.stringify(basicMatchings)
  );
}
function otGetContentCategories(t) {
  let o = [];
  return (
    t.forEach(function (t, e) {
      o.push(t.variant.product.type);
    }),
    (o = [...new Set(o)]).filter((t) => "" !== t).toString()
  );
}
function removeElementInObject(t, e) {
  var o = Object.keys(t);
  if (0 < o.length) for (const n of o) t[n] == e && delete t[n];
  return t;
}
function otGetAttributeFBCAndFBP() {
  var t = new Date().getTime() + getRandomInt(1, 1e5),
    e = new Date().getTime();
  return {
    fbc: otDetectFbc("1", e),
    fbp: otDetectFbp("1", e, t),
  };
}
function otDetectFbc(t, e) {
  var o = otGetCookie("OT_FBCLID"),
    n = ot_getUrlParam("fbclid");
  return null != n
    ? (otSetCookie("OT_FBCLID", (t = `fb.${t}.${e}.` + n), 14), t)
    : "" != o
    ? o
    : null;
}
function otFBDetectExternalID() {
  const userId = otGetCookie("c_user");
  let externalId = otGetCookie("ex_id");

  // If the user is logged in, use the user ID as the external ID
  if (userId !== null && userId !== "") {
    otSetCookie("ex_id", externalId, 14);
    return userId;
  }

  // If the external ID is not set, generate a new one
  if (externalId === null || externalId === "") {
    externalId = generateEventID(10);
    otSetCookie("ex_id", externalId, 14);
  }

  return externalId;
}
function otDetectFbp(t, e, o) {
  var n = otGetCookie("OT_FBPLID"),
    a = otGetCookie("_fbp");
  return "" !== a
    ? a
    : "" !== n
    ? n
    : (otSetCookie("OT_FBPLID", (a = `fb.${t}.${e}.` + o), 14), a);
}
function otAddUtmField(t, e = !1) {
  var o = ot_getUrlParam(t),
    t = t.replace("omega_", ""),
    n = (e && otDeleteCookie("ot_fb_" + t), ot_getUrlParam(t));
  if (null !== n || null !== o) {
    if (null !== o)
      return (
        e && otDeleteCookie("ot_fb_" + t),
        otSetCookie("ot_fb_" + t, o, 14),
        {
          status: "success",
          data: "" != o ? o : "undetectable",
        }
      );
    if (null !== n)
      return (
        e && otDeleteCookie("ot_fb_" + t),
        otSetCookie("ot_fb_" + t, n, 14),
        {
          status: "success",
          data: "" != n ? n : "undetectable",
        }
      );
  } else if ("" !== otGetCookie("ot_fb_" + t))
    return (
      e && otDeleteCookie("ot_fb_" + t),
      {
        status: "success",
        data: otGetCookie("ot_fb_" + t),
      }
    );
  return {
    status: "false",
    data: null,
  };
}
function OtDetectAdsUrl() {
  let e = !1;
  return (
    [
      "fbclid",
      "omega_utm_campaign",
      "omega_ad_name",
      "omega_adset_name",
      "omega_utm_source",
      "utm_campaign",
      "ad_name",
      "utm_source",
      "adset_name",
    ].every((t) => !window.location.search.includes(t) || !(e = !0)),
    e
  );
}
function otDetectField(t) {
  var e = ot_getUrlParam(t),
    t = t.replace("omega_", ""),
    o = ot_getUrlParam(t);
  return null != e
    ? (otSetCookie("ot_fb_" + t, e, 14), e)
    : null != o
    ? (otSetCookie("ot_fb_" + t, o, 14), o)
    : (otSetCookie("ot_fb_" + t, "undetectable", 14), "undetectable");
}
function otDetectUTMUrl() {
  return {
    utm_source: otDetectField("utm_source"),
    utm_campaign: otDetectField("utm_campaign"),
    adset_name: otDetectField("adset_name"),
    ad_name: otDetectField("ad_name"),
  };
}
function otDetectUTMCookie() {
  return {
    utm_source: otGetCookie("ot_fb_utm_source"),
    utm_campaign: otGetCookie("ot_fb_utm_campaign"),
    adset_name: otGetCookie("ot_fb_adset_name"),
    ad_name: otGetCookie("ot_fb_ad_name"),
  };
}
function otFBDetectCampaign() {
  return (OtDetectAdsUrl() ? otDetectUTMUrl : otDetectUTMCookie)();
}
function otGetContentProduct(t) {
  return t.map((t) => ({
    id: 1,
    name: "",
    quantity: "",
  }));
}
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
    if (ot_ip !== "") return ot_ip;

    let detectedIP = "";
    const response = await getIP();
    const ip = response.split("ip=")[1].split("\n")[0];

    if (ip === null || ip === undefined) return "";

    const excludedShops = [
      "duong-test-px3.myshopify.com",
      "juntestpx.myshopify.com",
      "12b241-2.myshopify.com",
      "personalizeddoghouse.myshopify.com",
      "mellydecor.myshopify.com",
      "creek-lander.myshopify.com",
      "custype.myshopify.com",
      "ericajewelstoronro.myshopify.com",
      "blunico.myshopify.com",
      "fitin30s.myshopify.com",
      "petti-store-japan.myshopify.com",
      "seniors-bra.myshopify.com",
      "vevacare.myshopify.com",
      "b71922.myshopify.com",
      "8b47b5.myshopify.com",
      "theuptest.myshopify.com",
      "a0224c.myshopify.com",
      "98f2a2-2.myshopify.com",
      "superladystar.myshopify.com",
    ];

    if (!excludedShops.includes(ot_fb_shop) && (isIPv4(ip) || isIPv6(ip))) {
      detectedIP = isIPv6(ip) ? ip : ipv4ToIpv6(ip);
    }

    return detectedIP;
  } catch (error) {
    return "";
  }
}
function otDetectMatchingParams(t, e) {
  var o = t[e] ?? null,
    n = t.shipping_address ? t.shipping_address[e] ?? null : null,
    t = t.billing_address ? t.billing_address[e] ?? null : null;
  return o ?? n ?? t ?? "";
}
function getItemOnCartPageFB(t, e) {
  t.ajax({
    type: "GET",
    url: "/cart.js",
    dataType: "json",
  }).done((t) => {
    "function" == typeof e && e(t);
  });
}
var fb_pageURL = otConvertPageUrl(),
  ot_fb_shop = otConvertShopName(),
  fb_pageURL = otTransformURL(fb_pageURL),
  ot_information_campaign = otFBDetectCampaign(),
  obj_fbp_fbc = otGetAttributeFBCAndFBP(),
  externalID = otFBDetectExternalID(),
  OT_DATA_CUSTOMER = JSON.parse(localStorage.getItem("OT_DATA_CUSTOMER")) || {},
  OT_DATA_CUSTOMER__TRACK_FB = JSON.parse(
    localStorage.getItem("OT_DATA_CUSTOMER__TRACK_FB")
  ) || {
    external_id: externalID,
  },
  ot_ip = "";
async function trackEventFBConversionAPI(formData, forceSend = false) {
  // Detect IP if not already set
  if (!ot_ip) {
    ot_ip = await otDetectIP();
  }

  if (ot_ip) {
    localStorage.setItem("ot_ip_v6", ot_ip);
    formData.append("client_ip_address", ot_ip);
  }

  // Retrieve settings from local storage
  const omegaSettings = JSON.parse(localStorage.getItem("ot_omega_settings"));

  // Determine the event name
  const action = formData.get("action");
  const eventName =
    action === "InitiateCheckout"
      ? "capi_track_checkout"
      : `capi_track_${action}`.toLowerCase();

  // Check if the event should be sent
  const shouldSendEvent =
    forceSend ||
    !omegaSettings?.settings[eventName] ||
    omegaSettings?.settings[eventName];

  if (shouldSendEvent) {
    try {
      await fetch(`${rootlinkFBPixel}/client/facebook-conversion-api.php`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
function saveLogEventIp(t, e, o, n) {
  fetch(
    rootlinkFBPixel +
      `/client/facebook-pixel.php?shop=${ot_fb_shop}&action=saveLogIp&side=${e}&event_id=${o}&event_name=${n}&ip=` +
      t
  )
    .then((t) => {})
    .catch((t) => {
      console.log(t);
    });
}
function otLogNameBaseCode(t) {
  void 0 === window.otLogInformationCode &&
    (console.log(
      `%c Omega Facebook pixels: Enable FB trigger - Event tracking using the ${t} codebase`,
      "color: white; background: blue;padding: 5px; border-radius: 5px"
    ),
    (window.otLogInformationCode = !1));
}
function otFormatFormData(
  pixels,
  eventId = generateEventID(36),
  shop = ot_fb_shop
) {
  const formData = new FormData();

  // Append pixels
  pixels.forEach((pixel) => {
    formData.append("pixels[]", pixel);
  });

  // Append OT_DATA_CUSTOMER entries
  Object.entries(OT_DATA_CUSTOMER).forEach(([key, value]) => {
    formData.append(key, value || "");
  });

  // Append ot_information_campaign entries
  Object.entries(ot_information_campaign).forEach(([key, value]) => {
    formData.append(key, value || "");
  });

  // Append otGetAttributeFBCAndFBP entries
  Object.entries(otGetAttributeFBCAndFBP()).forEach(([key, value]) => {
    formData.append(`obj_fbp_fbc[${key}]`, value || "");
  });

  // Append additional fields
  formData.append("shop", shop);
  formData.append("event_id", eventId);
  formData.append("external_id", externalID || "");

  return formData;
}
null !== localStorage.getItem("ot_ip_v6") &&
  (ot_ip = localStorage.getItem("ot_ip_v6")),
  parent.postMessage("ot_omega_get", fb_pageURL),
  window.addEventListener("message", (t) => {
    t.data.includes("ot_omega_px")
      ? localStorage.setItem("ot_omega_px", t.data.slice(12))
      : t.data.includes("ot_omega_settings") &&
        ((t = t.data.slice("ot_omega_settings".length + 1)),
        (t = JSON.parse(t)),
        null == localStorage.getItem("ot_omega_settings") &&
          (JSON.parse(localStorage.getItem("OT_DATA_TRIGGER_EVENT")),
          omegaCallBackPageView(t.settings.capi_track_pageview)),
        localStorage.setItem("ot_omega_settings", JSON.stringify(t)));
  });
(function (window, document) {
  if (!window.fbq) {
    const fbq = function () {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, arguments);
      } else {
        fbq.queue.push(arguments);
      }
    };

    if (!window._fbq) {
      window._fbq = fbq;
    }

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  }
})(window, document);
window.otfbq = async function () {
  var e, o, n, a;
  if (
    (otLogNameBaseCode("FB"), 0 < arguments.length) &&
    ("string" == typeof arguments[0] && (e = arguments[0]),
    "string" == typeof arguments[1] && (o = arguments[1]),
    "object" == typeof arguments[2] && (n = arguments[2]),
    void 0 !== arguments[3] && (a = arguments[3]),
    void 0 !== arguments[4] && (nameCustomEvent = arguments[4]),
    ("" != a && void 0 !== a) ||
      (a = new Date().getTime() + getRandomInt(1, 1e5)),
    "string" == typeof e &&
      "" != e.replace(/\s+/gi, "") &&
      "string" == typeof o &&
      o.replace(/\s+/gi, ""))
  ) {
    "" == ot_ip && (ot_ip = await otDetectIP());
    let t = {
      ...OT_DATA_CUSTOMER__TRACK_FB,
    };
    switch (
      ("" != ot_ip &&
        (localStorage.setItem("ot_ip_v6", ot_ip),
        (t = {
          ...t,
          client_ip_address: ot_ip,
        })),
      fbq("init", e, t),
      o)
    ) {
      case "PageView":
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
window.omegaCallBackPageView = function (t = !1) {
  if (
    -1 == fb_pageURL.indexOf("/processing") &&
    -1 == fb_pageURL.indexOf("/thank_you") &&
    -1 == fb_pageURL.indexOf("/products/")
  ) {
    let o = generateEventID(36);
    var e = localStorage.getItem("ot_omega_px").split(","),
      e =
        (e.forEach(function (t, e) {
          otfbq("" + t, "PageView", {}, o);
        }),
        otFormatFormData(e, o));
    e.append("action", "PageView"),
      e.append("event_source_url", fb_pageURL),
      trackEventFBConversionAPI(e, t);
  }
};
window.omegaCallBackPaymentInfo = function (t) {
  let o = generateEventID(36);
  var e = localStorage.getItem("ot_omega_px").split(",");
  let n = [],
    a = [],
    r = [];
  var i = otGetContentCategories(t.data.checkout.lineItems);
  let c =
      "1" ==
      JSON.parse(localStorage.getItem("ot_omega_settings")).settings
        .content_type_event
        ? "product"
        : "product_group",
    s = 0,
    d =
      (t.data.checkout.lineItems.forEach(function (t, e) {
        n.push(("product" == c ? t.variant : t.variant.product).id),
          r.push({
            id: ("product" == c ? t.variant : t.variant.product).id,
            name: t.title,
            quantity: t.quantity,
            item_price: t.quantity * t.variant.price.amount,
            item_category: t.variant.product.type,
          }),
          "" != t.variant.product.vendor && a.push(t.variant.product.vendor),
          (s += parseInt(t.quantity));
      }),
      {
        content_ids: n,
        content_category: i,
        content_brand: [...new Set(a)].toString(),
        contents: JSON.stringify(t.data.checkout.lineItems),
        content_type: c,
        value: t.data.checkout.totalPrice.amount,
        num_items: s,
        currency: t.data.checkout.currencyCode,
      });
  (d = removeElementInObject(d, "")),
    e.forEach(function (t, e) {
      otfbq("" + t, "AddPaymentInfo", d, o);
    });
  e = otFormatFormData(e, o);
  e.append("action", "AddPaymentInfo"),
    e.append("event_source_url", fb_pageURL),
    e.append("content_ids", n),
    e.append("content_type", c),
    e.append("content_category", i),
    e.append("content_brand", a),
    e.append("contents", JSON.stringify(r)),
    e.append("num_items", s),
    e.append("value", t.data.checkout.totalPrice.amount),
    e.append("currency", t.data.checkout.currencyCode),
    trackEventFBConversionAPI(e);
};
window.omegaCallBackCheckout = function (t) {
  const a = t;
  let r = [],
    i = [],
    c = [],
    s = localStorage.getItem("ot_omega_px").split(",");
  let d =
      "1" ==
      JSON.parse(localStorage.getItem("ot_omega_settings")).settings
        .content_type_event
        ? "product"
        : "product_group",
    p = [],
    _ = otGetContentCategories(a.data.checkout.lineItems),
    l = 0;
  a.data.checkout.lineItems.forEach((t, e) => {
    if (
      (i.push(t.title),
      r.push(("product" == d ? t.variant : t.variant.product).id),
      "" != t.variant.product.vendor &&
        null != t.variant.product.vendor &&
        c.push(t.variant.product.vendor),
      p.push({
        id: ("product" == d ? t.variant : t.variant.product).id,
        name: t.title,
        quantity: t.quantity,
        item_price: t.quantity * t.variant.price.amount,
        item_category: t.variant.product.type,
      }),
      (l += parseInt(t.quantity)),
      e == a.data.checkout.lineItems.length - 1)
    ) {
      let o = generateEventID(36),
        n = {
          content_type: d,
          content_category: _,
          content_brand: [...new Set(c)].toString(),
          content_ids: r,
          currency: a.data.checkout.currencyCode,
          value: a.data.checkout.totalPrice.amount,
          num_items: l,
          content_name: i,
          contents: JSON.stringify(p),
        };
      s.forEach(function (t, e) {
        otfbq("" + t, "InitiateCheckout", n, o);
      });
      t = otFormatFormData(s, o);
      t.append("action", "InitiateCheckout"),
        t.append("event_source_url", fb_pageURL),
        t.append("content_ids", r),
        t.append("content_type", d),
        t.append("content_category", _),
        t.append("content_brand", c),
        t.append("contents", JSON.stringify(p)),
        t.append("num_items", l),
        t.append("value", a.data.checkout.totalPrice.amount),
        t.append("content_name", i),
        t.append("currency", a.data.checkout.currencyCode),
        trackEventFBConversionAPI(t);
    }
  });
};

// Purchase event callback function
window.omegaCallBackPurchases = function (event) {
  const checkoutData = event.data.checkout;
  otSaveAdvancedMatchings(checkoutData);

  const pixelIds = localStorage.getItem("ot_omega_px").split(",");
  const eventId = generateEventID(36);

  pixelIds.forEach((pixelId) => {
    otfbq(pixelId, "PageView", {}, eventId);
  });

  let formData = otFormatFormData(pixelIds, eventId);
  formData.append("action", "PageView");
  formData.append("event_source_url", fb_pageURL);
  trackEventFBConversionAPI(formData);

  const settings = JSON.parse(localStorage.getItem("ot_omega_settings"));
  const contentType =
    settings.settings.content_type_event === "1" ? "product" : "product_group";

  const lineItems = checkoutData.lineItems;
  const contentIds = [];
  const contentBrands = [];
  const contents = [];
  let totalItems = 0;

  lineItems.forEach((item) => {
    const productId =
      contentType === "product" ? item.variant.id : item.variant.product.id;
    contentIds.push(productId);
    contents.push({
      id: productId,
      name: item.title,
      quantity: item.quantity,
      item_price: item.quantity * item.variant.price.amount,
      item_category: item.variant.product.type,
    });
    if (item.variant.product.vendor) {
      contentBrands.push(item.variant.product.vendor);
    }
    totalItems += parseInt(item.quantity);
  });

  const contentCategory = otGetContentCategories(lineItems);
  const purchaseData = {
    content_ids: contentIds,
    content_category: contentCategory,
    content_brand: [...new Set(contentBrands)].toString(),
    contents: JSON.stringify(contents),
    content_type: contentType,
    value: checkoutData.totalPrice.amount,
    currency: checkoutData.currencyCode,
    num_items: totalItems,
  };

  const cleanedPurchaseData = removeElementInObject(purchaseData, "");

  pixelIds.forEach((pixelId) => {
    otfbq(pixelId, "Purchase", cleanedPurchaseData, checkoutData.order.id);
  });

  localStorage.setItem("item_count", 0);
};
window.omegaCallBackEvent = function (t) {
  "product_added_to_cart" === t.name &&
    parent.postMessage("ot_track_add_to_cart:" + JSON.stringify(t), "*");
};
null != localStorage.getItem("ot_omega_settings") &&
  setTimeout(() => {
    omegaCallBackPageView();
  }, 500);
var EVENT_CHECKOUT = JSON.parse(
    localStorage.getItem("OT_DATA_TRIGGER_CHECKOUT")
  ),
  EVENT_PAYMENT_INFO =
    (null != EVENT_CHECKOUT &&
      (omegaCallBackCheckout(EVENT_CHECKOUT),
      localStorage.removeItem("OT_DATA_TRIGGER_CHECKOUT")),
    JSON.parse(localStorage.getItem("OT_DATA_TRIGGER_PAYMENT_INFO"))),
  EVENT_PURCHASE =
    (null != EVENT_PAYMENT_INFO &&
      (omegaCallBackPaymentInfo(EVENT_PAYMENT_INFO),
      localStorage.removeItem("OT_DATA_TRIGGER_PAYMENT_INFO")),
    JSON.parse(localStorage.getItem("OT_DATA_TRIGGER_PURCHASE"))),
  EVENT_TRIGGER =
    (null != EVENT_PURCHASE &&
      (omegaCallBackPurchases(EVENT_PURCHASE),
      localStorage.removeItem("OT_DATA_TRIGGER_PURCHASE")),
    JSON.parse(localStorage.getItem("OT_DATA_TRIGGER_EVENT")));
null != EVENT_TRIGGER.name &&
  null != localStorage.getItem("ot_omega_settings") &&
  "checkout_started" === EVENT_TRIGGER.name &&
  (omegaCallBackCheckout(EVENT_TRIGGER),
  localStorage.removeItem("OT_DATA_TRIGGER_EVENT"));
