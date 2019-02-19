"use strict";
var utils = require('./utils');

// https://html.spec.whatwg.org/multipage/webappapis.html#navigatorid
var NavigatorID = utils.Object.create('NavigatorID#', null, {
  appCodeName: { value: "Mozilla" },
  appName: { value: "Netscape" },
  appVersion: { value: "4.0" },
  platform: { value: "" },
  product: { value: "Gecko" },
  productSub: { value: "20100101" },
  userAgent: { value: "" },
  vendor: { value: "" },
  vendorSub: { value: "" },
  taintEnabled: { value: function() { return false; } }
});

module.exports = NavigatorID;
