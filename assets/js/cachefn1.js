(function($) {
  function uriToJSON(urijson){ return JSON.parse(decodeURIComponent(urijson)); }
  $(function() {
    const sPageURL = window.location.search;
    const urlParams = new URLSearchParams(sPageURL);
    var formData = {};
    formData["status"] = "";
    if (urlParams.has('order')) {
      formData["order"] = urlParams.get('order');
    }
    if (urlParams.has('total')) {
      formData["total"] = urlParams.get('total');
    }
    if (urlParams.has('email')) {
      formData["email"] = urlParams.get('email');
    }
    if (urlParams.has('res')) {
      const decodeJSON = uriToJSON(urlParams.get('res'));
      if (decodeJSON.hasOwnProperty('result')) {
        formData["status"] = decodeJSON.result;
      }
    }
    // url encode form data for sending as post data
    var encoded = Object.keys(formData).map(function(k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(formData[k]);
    }).join('&');
    var url = 'https://script.google.com/macros/s/AKfycbxTFQx9GwgAnlKzOPmvTV1Oiib_dTD_fEgnkxT1fhHI2DDIGb4/exec';
    $.ajax({
      url: url,
      data: encoded,
      type: "POST",
      dataType: "json",
      statusCode: {
        404: function() {
          window.location.replace("https://www.indiskaboxen.se/thanks");
        },
        500: function() {
          window.location.replace("https://www.indiskaboxen.se/thanks");
        },
        200: function() {
          window.location.replace("https://www.indiskaboxen.se/thanks");
        }
      }
    });
    
    //if (formData["status"] === "paid") {
    //  window.location.replace("https://www.indiskaboxen.se/thanks.html");
    //} else {
    //  alert('Payment failed! If this is incorrect please email info@indiskaboxen.se');
    //  window.location.replace("https://www.indiskaboxen.se");
    //}
  });
})(jQuery);
