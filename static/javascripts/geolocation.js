"use strict";

(async function () {
  let country = "";
  const storageKey = "locale";

  function setSessionStorage() {
    const strval = JSON.stringify({
      country,
    });
    sessionStorage.setItem(storageKey, strval);
  }

  if ($(".locale-modal-button-yes").length > 0) {
    $(".locale-modal-button-yes").click(function () {
      window.location.href = "https://help.cybozu.com" + window.location.pathname;
    });
  }

  if ($(".locale-modal-button-no").length > 0) {
    $(".locale-modal-button-no").click(function () {
      $(".locale-modal").hide();
      setSessionStorage();
    });
  }

  async function getGeolocation() {
    try {
      const resp = await fetch("http://localhost:8888/geolocation");
      const json = await resp.json();
      return json;
    } catch (err) {
      console.log(err);
    }
  }

  async function showModal() {
    const searchParams = new URLSearchParams(window.location.search);
    const disabled = searchParams.get("disabled_modal");
    if (disabled ||disabled === "") {
      return;
    }

    const strval = sessionStorage.getItem(storageKey);
    if (strval !== null) {
      return;
    }
    const geo = await getGeolocation();
    if (geo && geo.country.code.toUpperCase() === "JP") {
      country = geo.country.code;
      $(".locale-modal").show();
    }
  }

  await showModal();
})();
