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

  if ($(".locale-modal-close-button").length > 0) {
    $(".locale-modal-close-button").click(function () {
      $(".locale-modal").hide();
      setSessionStorage();
    });
  }

  if($(".locale-modal-current-text").length > 0) {
    $(".locale-modal-current-text").click(function () {
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
