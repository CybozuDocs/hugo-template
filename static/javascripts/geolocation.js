"use strict";

(async function () {
  const localeSessionKey = "locale";
  const localeModalSessionKey = "locale_modal";

  if ($(".locale-modal-button-yes").length > 0) {
    $(".locale-modal-button-yes").click(function () {
      window.location.href =
        "https://help.cybozu.com" + window.location.pathname;
    });
  }

  if ($(".locale-modal-button-no").length > 0) {
    $(".locale-modal-button-no").click(function () {
      $(".locale-modal").hide();
      setSessionValue(localeModalSessionKey, { disabled: "1" });
    });
  }

  async function getGeolocation() {
    try {
      const resp = await fetch("https://3q5rgl4n37.execute-api.ap-northeast-1.amazonaws.com/geolocation");
      const json = await resp.json();
      return json.body;
    } catch (err) {
      console.log(err);
    }
  }

  function getSessionValue(key) {
    const strval = sessionStorage.getItem(key);
    if (strval) {
      return JSON.parse(strval);
    }
    return {};
  }

  function setSessionValue(key, target) {
    const strval = JSON.stringify(target);
    sessionStorage.setItem(key, strval);
  }

  function disabledModal() {
    const searchParams = new URLSearchParams(window.location.search);
    const disabledQueryString = searchParams.get("disabled_modal");
    if (disabledQueryString === "1") {
      setSessionValue(localeModalSessionKey, { disabled: "1" });
      return true;
    }
    const localeModalSessionValue = getSessionValue(localeModalSessionKey);
    return localeModalSessionValue.disabled === "1";
  }

  async function showModal() {
    if (disabledModal()) {
      return;
    }
    const localeSessionValue = getSessionValue(localeSessionKey);
    if (localeSessionValue?.country?.code?.toUpperCase() === "JP") {
      $(".locale-modal").show();
    } else {
      const geo = await getGeolocation();
      if (!geo) {
        return;
      }
      if (geo.country?.code?.toUpperCase() === "JP") {
        $(".locale-modal").show();
      }
      setSessionValue(localeSessionKey, { country: geo.country });
    }
  }

  await showModal();
})();
