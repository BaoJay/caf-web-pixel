console.log("caf-web-pixel.js is running");
console.log("Rendering pixel from Github");
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

  console.log("Pixel is loaded");
})(
  window,
  document,
  "script",
  "https://connect.facebook.net/en_US/fbevents.js"
);

fbq("init", "1796727657413629"); // Bao Testing 3629

const data = JSON.parse(localStorage.getItem("CAF_DATA_TRIGGER_EVENT"));
const pixelID = JSON.parse(localStorage.getItem("CAF_PIXEL_ID"));
console.log("data =====", data);
console.log("pixelID =====", pixelID);

// analytics.subscribe("all_events", (event) => {
//   let payload;
//   console.log("event name === ", event.name);
//   switch (event.name) {
//     case "page_viewed":
//       fbq("track", "PageView");
//       break;
//     case "product_viewed":
//       const productPrice = event.data.productVariant.price.amount;
//       const productTitle = event.data.productVariant.title;
//       payload = {
//         event_name: event.name,
//         event_data: {
//           productPrice: productPrice,
//           productTitle: productTitle,
//         },
//       };
//       fbq("track", "ViewContent", payload);
//       break;
//     case "product_added_to_cart":
//       const cartLine = event.data.cartLine;
//       const cartLineCost = cartLine.cost.totalAmount.amount;
//       const cartLineCostCurrency = cartLine.cost.totalAmount.currencyCode;
//       const merchandiseVariantTitle = cartLine.merchandise.title;
//       payload = {
//         event_name: event.name,
//         event_data: {
//           cartLineCost: cartLineCost,
//           cartLineCostCurrency: cartLineCostCurrency,
//           merchandiseVariantTitle: merchandiseVariantTitle,
//         },
//       };
//       break;
//     case "checkout_started":
//       const checkout = event.data.checkout;
//       const checkoutTotalPrice = checkout.totalPrice.amount;
//       const allDiscountCodes = checkout.discountApplications.map((discount) => {
//         if (discount.type === "DISCOUNT_CODE") {
//           return discount.title;
//         }
//       });
//       const firstItem = checkout.lineItems[0];
//       const firstItemDiscountedValue = firstItem.discountAllocations[0]?.amount;
//       const customItemPayload = {
//         quantity: firstItem.quantity,
//         title: firstItem.title,
//         discount: firstItemDiscountedValue,
//       };
//       payload = {
//         event_name: event.name,
//         event_data: {
//           totalPrice: checkoutTotalPrice,
//           discountCodesUsed: allDiscountCodes,
//           firstItem: customItemPayload,
//         },
//       };
//       //
//       break;
//     case "checkout_completed":
//       // const checkout = event.data.checkout;
//       // const checkoutTotalPrice = checkout.totalPrice.amount;
//       // const allDiscountCodes = checkout.discountApplications.map((discount) => {
//       //   if (discount.type === 'DISCOUNT_CODE') {
//       //     return discount.title;
//       //   }
//       // });
//       // const firstItem = checkout.lineItems[0];
//       // const firstItemDiscountedValue = firstItem.discountAllocations[0]?.amount;
//       // const customItemPayload = {
//       //   quantity: firstItem.quantity,
//       //   title: firstItem.title,
//       //   discount: firstItemDiscountedValue,
//       // };
//       const paymentTransactions = event.data.checkout.transactions.map(
//         (transaction) => {
//           return {
//             paymentGateway: transaction.gateway,
//             amount: transaction.amount,
//           };
//         }
//       );
//       payload = {
//         event_name: event.name,
//         event_data: {
//           totalPrice: checkoutTotalPrice,
//           discountCodesUsed: allDiscountCodes,
//           firstItem: customItemPayload,
//           paymentTransactions: paymentTransactions,
//         },
//       };
//       break;
//     case "search_submitted":
//       const searchResult = event.data.searchResult;
//       const searchQuery = searchResult.query;
//       const firstProductReturnedFromSearch =
//         searchResult.productVariants[0]?.product.title;
//       payload = {
//         event_name: event.name,
//         event_data: {
//           searchQuery: searchQuery,
//           firstProductTitle: firstProductReturnedFromSearch,
//         },
//       };
//       break;
//     case "payment_info_submitted":
//       // const checkout = event.data.checkout;
//       // const checkoutTotalPrice = checkout.totalPrice.amount;
//       const firstDiscountType = checkout.discountApplications[0]?.type;
//       const discountCode =
//         firstDiscountType === "DISCOUNT_CODE"
//           ? checkout.discountApplications[0]?.title
//           : null;
//       payload = {
//         event_name: event.name,
//         event_data: {
//           totalPrice: checkoutTotalPrice,
//           firstDiscountCode: discountCode,
//         },
//       };
//       break;
//     default:
//       console.log("This is default event", event);
//   }
// });

// analytics.subscribe('product_viewed', (event) => {
//   const productPrice = event.data.productVariant.price.amount;
//   const productTitle = event.data.productVariant.title;
//   const payload = {
//     event_name: event.name,
//     event_data: {
//       productPrice: productPrice,
//       productTitle: productTitle,
//     },
//   };

// });

// analytics.subscribe('product_added_to_cart', (event) => {
//   const cartLine = event.data.cartLine;
//   const cartLineCost = cartLine.cost.totalAmount.amount;
//   const cartLineCostCurrency = cartLine.cost.totalAmount.currencyCode;
//   const merchandiseVariantTitle = cartLine.merchandise.title;
//   const payload = {
//     event_name: event.name,
//     event_data: {
//       cartLineCost: cartLineCost,
//       cartLineCostCurrency: cartLineCostCurrency,
//       merchandiseVariantTitle: merchandiseVariantTitle,
//     },
//   };

// });

// analytics.subscribe('checkout_started', (event) => {
//   const checkout = event.data.checkout;
//   const checkoutTotalPrice = checkout.totalPrice.amount;
//   const allDiscountCodes = checkout.discountApplications.map((discount) => {
//     if (discount.type === 'DISCOUNT_CODE') {
//       return discount.title;
//     }
//   });
//   const firstItem = checkout.lineItems[0];
//   const firstItemDiscountedValue = firstItem.discountAllocations[0]?.amount;
//   const customItemPayload = {
//     quantity: firstItem.quantity,
//     title: firstItem.title,
//     discount: firstItemDiscountedValue,
//   };
//   const payload = {
//     event_name: event.name,
//     event_data: {
//       totalPrice: checkoutTotalPrice,
//       discountCodesUsed: allDiscountCodes,
//       firstItem: customItemPayload,
//     },
//   };

// });

// analytics.subscribe('checkout_completed', (event) => {
//   const checkout = event.data.checkout;
//   const checkoutTotalPrice = checkout.totalPrice.amount;
//   const allDiscountCodes = checkout.discountApplications.map((discount) => {
//     if (discount.type === 'DISCOUNT_CODE') {
//       return discount.title;
//     }
//   });
//   const firstItem = checkout.lineItems[0];
//   const firstItemDiscountedValue = firstItem.discountAllocations[0]?.amount;
//   const customItemPayload = {
//     quantity: firstItem.quantity,
//     title: firstItem.title,
//     discount: firstItemDiscountedValue,
//   };
//   const paymentTransactions = event.data.checkout.transactions.map((transaction) => {
//     return {
//       paymentGateway: transaction.gateway,
//       amount: transaction.amount,
//     };
//   });
//   const payload = {
//     event_name: event.name,
//     event_data: {
//       totalPrice: checkoutTotalPrice,
//       discountCodesUsed: allDiscountCodes,
//       firstItem: customItemPayload,
//       paymentTransactions: paymentTransactions,
//     },
//   };

// });

// analytics.subscribe('search_submitted', (event) => {
//   const searchResult = event.data.searchResult;
//   const searchQuery = searchResult.query;
//   const firstProductReturnedFromSearch = searchResult.productVariants[0]?.product.title;
//   const payload = {
//     event_name: event.name,
//     event_data: {
//       searchQuery: searchQuery,
//       firstProductTitle: firstProductReturnedFromSearch,
//     },
//   };

// });

// analytics.subscribe('payment_info_submitted', (event) => {
//   const checkout = event.data.checkout;
//   const checkoutTotalPrice = checkout.totalPrice.amount;
//   const firstDiscountType = checkout.discountApplications[0]?.type;
//   const discountCode = firstDiscountType === 'DISCOUNT_CODE' ? checkout.discountApplications[0]?.title : null;
//   const payload = {
//     event_name: event.name,
//     event_data: {
//       totalPrice: checkoutTotalPrice,
//       firstDiscountCode: discountCode,
//     },
//   };
// });
