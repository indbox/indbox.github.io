function jsonToURI(json){ return encodeURIComponent(JSON.stringify(json)); }
function uriToJSON(urijson){ return JSON.parse(decodeURIComponent(urijson)); }
function preq(t,o) {
  var datamsg = {"amount":{"value":eval(t),"editable":false},"message":{"value":o,"editable":false},"payee":{"value":"123 478 05 32","editable":false},"version":1};
  var dataenc = jsonToURI(datamsg);
  return dataenc;
}
function swishgen(total,order,addr) {
  var slink = "swish://payment?data="+preq(total,order)+"&callbackurl="+encodeURIComponent("https://www.indiskaboxen.se/postcall?email="+addr+"&order="+order+"&total="+total)+"&callbackresultparameter=res";
  return slink;
}
function stripegen(nsub,gway,fname,lname,addr,total,order) {
  if (nsub ==="no") {
    var slink = "https://www.indiskaboxen.se/thanks";
  } else {
    if(fname === ""){
      fname = addr;
      lname = addr;
    }
    var slink = "https://www.indiskaboxen.se/"+gway+"?name="+fname+"%20"+lname+"&email="+addr+"&amount="+total+"00&order="+order;
  }
  return slink;
}
function paysel(id) {
  $(id).toggle();
}
(function($) {
  function goToUri(uri) {
    $('#swish-qr').show();
    var appWindow = window.open(uri,"_blank");
    setTimeout( function () {if (appWindow) {
        appWindow.close();}
    },1000);
    //window.open(uri,'_blank');
    //document.location = uri;
  }
  var swishFunc = function(event){
    var $button = $(this);
    var req = $('#swish-uri').text();
    goToUri(req);
  }
  $(".swish-link").on("click", swishFunc);
  // get all data in form and return object
  function getCancelFormData(form) {
    var elements = form.elements;
    var d = new Date();
    var trap,honeypot;
    var fields = Object.keys(elements).filter(function(k) {
      if (elements[k].name === "_prev") {
        honeypot = elements[k].value;
        return false;
      } else if (elements[k].name === "_next") {
        trap = elements[k].value;
        return false;
      } else if (elements[k].value === "0") {
        return false;
      }
      return true;
    }).map(function(k) {
      if(elements[k].name !== undefined) {
        return elements[k].name;
      // special case for Edge's html collection
      }else if(elements[k].length > 0){
        return elements[k].item(0).name;
      }
    }).filter(function(item, pos, self) {
      return self.indexOf(item) == pos && item;
    });
    var formData = {};
    fields.forEach(function(name){
      var element = elements[name];
      // singular form elements just have one value
      formData[name] = element.value;
      // when our element has multiple items, get their values
      if (element.length) {
        var data = [];
        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(', ');
      }
    });
    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "order"; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default
    return {data: formData, honeypot: honeypot, trap:trap};
  }
  function getFormData(form) {
    var gway = 'pay';
    var elements = form.elements;
    var d = new Date();
    elements['order'] = {};
    elements['order'].name='order';
    elements['order'].value=Math.floor(Math.random()*10)+('0'+d.getDate()).slice(-2)+('0'+d.getHours()).slice(-2)+('0'+d.getMinutes()).slice(-2);
    $('.orderid').text(elements['order'].value);
    //elements['swish'].value="swish://payment?data="+preq(elements['total'].value,elements['order'].value)+"&callbackurl="+encodeURIComponent("https://www.indiskaboxen.se/postcall?email="+elements['email'].value+"&order="+elements['order'].value+"&total="+elements['total'].value)+"&callbackresultparameter=res";
    $('#swish-uri').text(swishgen(elements['total'].value,elements['order'].value,elements['email'].value));
    if(elements['subscription'].value === 'on') {
      gway = 'addcard';
      if(elements['nsub'].value === '') {
        elements['tinyurl'].value = '';
      }
    }
    $('#stripe-uri').attr("href",stripegen(elements['nsub'].value,gway,elements['firstname'].value,elements['lastname'].value,elements['email'].value,elements['total'].value,elements['order'].value));
    var trap,honeypot;
    var fields = Object.keys(elements).filter(function(k) {
      if (elements[k].name === "_prev") {
        honeypot = elements[k].value;
        return false;
      } else if (elements[k].name === "_next") {
        trap = elements[k].value;
        return false;
      } else if (elements[k].name === "postcode_ro") {
        return false;
      } else if (elements[k].name === "nsub") {
        return false;
      } else if (elements[k].name === "discount") {
        return false;
      } else if (elements[k].value === "0") {
        return false;
      }
      return true;
    }).map(function(k) {
      if(elements[k].name !== undefined) {
        return elements[k].name;
      // special case for Edge's html collection
      }else if(elements[k].length > 0){
        return elements[k].item(0).name;
      }
    }).filter(function(item, pos, self) {
      return self.indexOf(item) == pos && item;
    });
    var formData = {};
    fields.forEach(function(name){
      var element = elements[name];
      // singular form elements just have one value
      formData[name] = element.value;
      // when our element has multiple items, get their values
      if (element.length) {
        var data = [];
        for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(', ');
      }
    });
    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "order"; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default
    return {data: formData, honeypot: honeypot, trap:trap};
  }
  var incFunc = function(event){
    var $button = $(this);
    var oldValue = $button.parent().find('input').val();
    var newVal = parseFloat(oldValue) + 1;
    $button.parent().find('input').val(newVal).change();
  }
  $(".inc").on("click", incFunc);
  var decFunc = function(event){
    var $button = $(this);
    var oldValue = parseFloat($button.parent().find('input').val());
    var minValue = parseFloat($button.parent().find('input').attr("min"));
    if (oldValue > 0 && oldValue > minValue) {
      var newVal = oldValue - 1;
      $button.parent().find('input').val(newVal).change();
    }
  }
  $(".dec").on("click", decFunc);
  function savepostcode(pc_pre,pc_notpre) {  // handles form submit without any jquery
    var formData = {};
    if (pc_pre !== "") {
      formData['postcode present'] = pc_pre;
    } else {
      formData['postcode not present'] = pc_notpre;
    }
    formData.formGoogleSheetName = "order";
    formData.formGoogleSendEmail = "";
    // url encode form data for sending as post data
    var encoded = Object.keys(formData).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(formData[k]);
    }).join('&');
    var url = 'https://script.google.com/macros/s/AKfycbwR621wFIgtgm1eLjUYanem-Q0Zs59tV8ktHMYZwPboFx1O_gXu/exec';
    $.ajax({
      url: url,
      data: encoded,
      type: "POST",
      dataType: "json",
      statusCode: {}
    });
  }
  function summarize(box,faf) {
    var lines = "";
    var dis = 0;
    var subs = false;
    var mprice = "79 kr";
    var cprice = "129 kr";
    if (faf == true) {
      dis = 10;
      mprice = "<s>79 kr</s> 69 kr";
      cprice = "<s>129 kr</s> 99 kr";
    } else if(box >9) {
      dis = 10;
      mprice = "<s>79 kr</s> 69 kr";
      cprice = "<s>129 kr</s> 119 kr";
    }
    //if ($("#subscription").prop('checked')) {
    //  if (box<10) {
    //    dis = 5;
    //  }
    //}
    $(".subsel").each(function(){
      if ($(this).val()=='on') {
        subs = true;
        lines += '<tr><td style="width:40%">Currylådor (Prenumeration)</td>';
        lines += '<td></td>';
        lines += '<td></td>';
        lines += '<td></td></tr>';
      }
    });
    $(".quantity").not(".special,.chappati,.snacks").each(function(){
      if ($(this).val()>0) {
        lines += '<tr><td style="width:40%">'+$(this).attr("name")+'</td>';
        lines += '<td>'+mprice+'</td>';
        lines += '<td>'+$(this).val()+' st</td>';
        lines += '<td>'+($(this).val()*79-($(this).val()*dis))+' kr</td></tr>';
      }
    });
    $(".special").each(function(){
      if ($(this).val()>0) {
        lines += '<tr><td style="width:40%">'+$(this).attr("name")+'</td>';
        lines += '<td>'+cprice+'</td>';
        lines += '<td>'+$(this).val()+' st</td>';
        if (faf == true) {
          lines += '<td>'+($(this).val()*129-($(this).val()*30))+' kr</td></tr>';
        } else {
          lines += '<td>'+($(this).val()*129-($(this).val()*dis))+' kr</td></tr>';
        }
      }
    });
    $(".chappati").each(function(){
      if ($(this).val()>0) {
        lines += '<tr><td style="width:40%">'+$(this).attr("name")+'</td>';
        lines += '<td>'+$(this).parent().find('input').attr("data-price")+' kr</td>';
        lines += '<td>'+$(this).val()+' st</td>';
        lines += '<td>'+($(this).val()*($(this).parent().find('input').attr("data-price")))+' kr</td></tr>';
      }
    });
    $(".snacks").each(function(){
      if ($(this).val()>0) {
        lines += '<tr><td style="width:40%">'+$(this).attr("name")+'</td>';
        lines += '<td>'+$(this).parent().find('input').attr("data-price")+' kr</td>';
        lines += '<td>'+$(this).val()+' st</td>';
        lines += '<td>'+($(this).val()*($(this).parent().find('input').attr("data-price")))+' kr</td></tr>';
      }
    });
    $("#summary").html(lines);
  };
  function foverflow() {
    var sum = 0;
    var curry = 0;
    var chappati = 0;
    var snacks = 0;
    var total = 0;
    var box = 0;
    var min = 1;
    var stext = 'Beställ minst '+min+' lådor.';
    if ($("#subscription").prop('checked')) {
      min = 10;
      //dis = 10;
      //if (box<10) {
      //  min = 5;
      //  dis = 5;
      //}
      stext = 'Beställ '+min+' lådor med prenumeration.';
      $("#subscription").val('on');
      $(".syes").show();
      $(".sno").hide();
      if ($("#vegetarian").prop('checked')) {
        $("#vegetarian").val('on');
      }
      if ($("#vegan").prop('checked')) {
        $("#vegan").val('on');
      }
    } else {
      $('.special.nya').val(0);
      $("#subscription").val('');
      $("#vegetarian").val('');
      $("#vegan").val('');
      $(".syes").hide();
      $(".sno").show();
    }
    $(".quantity").not(".special,.chappati,.snacks").each(function(){
        sum += +$(this).val();
    });
    $(".special").each(function(){
        curry += +$(this).val();
    });
    $(".chappati").each(function(){
        chappati += +$(this).val();
        total += $(this).val()*$(this).parent().find('input').attr("data-price");
    });
    $(".snacks").each(function(){
        total += $(this).val()*$(this).parent().find('input').attr("data-price");
    });
    box += sum+curry;
    $("#productsel").val(box);
    var faf = false;
    if ($("#discount").val().toLowerCase() === 'faf25' || $("#subscription").prop('checked')) {
      total += 59*sum;
      total += 99*curry;
      faf = true;
    } else if (box>9) {
      total += 69*sum;
      total += 119*curry;
    } else {
      total += 79*sum;
      total += 129*curry;
    }
    $("#total").val(total);
    $('.ordertotal').text(total);
    $('.cart').attr('data-count',box);
    summarize(box,faf);
    if (box < min) {
      //$(".minorder").html('<i class="fa fa-fw fa-exclamation"></i> 0 lådor valda. Beställ minst 1 lådor.').show();
      $(".minorder").html('<i class="fa fa-fw fa-exclamation"></i> '+box+' av '+min+' lådor valda. '+stext).show();
      $("#orderbtn").prop('disabled', true);
    } else {
      $(".minorder").hide();
      //savepostcode(total,"");
      $("#orderbtn").prop('disabled', false);
    }
    if (box < 5){
      if (faf == true) {
        $(".minorderdeliv").hide();
      } else {
        $(".minorderdeliv").show();
        $("#total").val(total+59);
        $('.ordertotal').text(total+59);
      } 
    } else {
      $(".minorderdeliv").hide();
    }
  }
  $(".quantity,#subscription,#vegetarian,#vegan,#discount,.subsel").change(function(e) {
    foverflow();
  });
  function handlecontactFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    var form = event.target,
        form_e = $( "#contact-form" ),
        notice = form_e.find('#notice');
    var formData = getFormData(form);
    if (formData.honeypot || formData.trap !== 'thanks') {
      return false;
    }
    var data = formData.data;
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&');
    disableAllButtons(form);
    var url = 'https://script.google.com/macros/s/AKfycbzrCDB3cFfu_86VM83Lvb4Xn5v1Z6wx86kvKzfVv7QOQVeCmNs/exec';
    $.ajax({
      url: url,
      data: encoded,
      type: "POST",
      dataType: "json",
      statusCode: {
        404: function() {
          form_e.fadeOut(function() {
            form_e.html('<div class="field"><h4>' + notice.data('error') + '</h4></div>').fadeIn();
          });
        },
        500: function() {
          form_e.fadeOut(function() {
            form_e.html('<div class="field"><h4>' + notice.data('error') + '</h4></div>').fadeIn();
          });
        },
        200: function() {
          form_e.fadeOut(function() {
            form_e.html('<div class="field"><h4>' + form_e.data('success') + '</h4></div>').fadeIn();
          });
          window.location.replace($('#stripe-uri').attr("href"));
          //$("#paydiv").show();
          //$("#contact-form")[0].scrollIntoView();
        }
      }
    });
  }
  function handlecancelFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    var form = event.target,
        form_e = $( "#cancel-form" ),
        notice = form_e.find('#notice');
    var formData = getCancelFormData(form);
    if (formData.honeypot || formData.trap !== 'thanks') {
      return false;
    }
    var data = formData.data;
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&');
    disableAllButtons(form);
    var url = 'https://script.google.com/macros/s/AKfycbzwv0ktJwdAk_4G2FVqsNE_PXe56e3A9Uy8Ss667hx3F-6hjDY/exec';
    $.ajax({
      url: url,
      data: encoded,
      type: "POST",
      dataType: "json",
      statusCode: {
        404: function() {
          form_e.fadeOut(function() {
            form_e.html('<div class="field"><h4>' + notice.data('error') + '</h4></div>').fadeIn();
          });
        },
        500: function() {
          form_e.fadeOut(function() {
            form_e.html('<div class="field"><h4>' + notice.data('error') + '</h4></div>').fadeIn();
          });
        },
        200: function() {
          form_e.fadeOut(function() {
            form_e.html('<div class="field"><h4>' + form_e.data('success') + '</h4></div>').fadeIn();
          });
        }
      }
    });
  }
  function loaded() {
    // bind to the submit event of our form
    var forms = document.querySelectorAll("form#contact-form");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handlecontactFormSubmit, false);
    }
    var forms = document.querySelectorAll("form#cancel-form");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handlecancelFormSubmit, false);
    }
  };
  document.addEventListener("DOMContentLoaded", loaded, false);

  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
  function getRange(range){
    var arr=range.split("-");
    return {min:Number(arr[0]),max:Number(arr[1])};
  }
  function checkPcode(Pcode, Plist) {
    return Plist.some(function(Prange) {
      return Pcode >= Prange.min && Pcode <= Prange.max;
    });
  }
  function addcollapse() {
    // bind to the submit event of our form
    var colls = $("#postcode");
    var plist= ['10001-12999', '13100-13199', '14100-14199', '16000-17799', '18100-18399', '18700-18799', '19100-19299', '19400-19499'];
    var plists=[];
    for(var i=0;i<plist.length;i++) plists[i]=getRange(plist[i]);
    for (var i = 0; i < colls.length; i++) {
      $(colls[i]).on("change paste keyup", function() {
        var content = $(this).parent().parent().siblings('.cblock');
        var pcode = $(this).val().replace(/\s/g, '');
        var pmsg = $(this).siblings('label.collapsible');
        if(pcode.length == 5 && checkPcode(Number(pcode),plists)) {
          pmsg.html("Ja, vi levererar i ditt område!");
          content.css('display', 'block');
          $("#postcode_ro").val(pcode);
          $('.cart').show();
          if( $(this).data('last') != pcode ){
            savepostcode(pcode,"");
          }
          $(this).data('last',pcode);
        } else if(pcode.length == 5){
          pmsg.html("Vi levererar tyvärr inte till denna ort ännu.");
          content.css('display', 'none');
          $('.cart').hide();
          if( $(this).data('last') != pcode ){
            savepostcode("",pcode);
          }
          $(this).data('last',pcode);
        } else {
          pmsg.html("Kan vi leverera till dig? Skriv in ditt postnummer och kolla");
          content.css('display', 'none');
          $('.cart').hide();
        }
      });
    }
  };
  document.addEventListener("DOMContentLoaded", addcollapse, false);
})(jQuery);
(function($) {
  function get_delivery_date() {
    var date = new Date();
    date.setDate(date.getDate()+2);
    if(date.getDay() !== 2) {
      date.setDate(date.getDate()+1);
    }
    while(date.getDay() !== 0 && date.getDay() !== 2) {
      date.setDate(date.getDate()+1);
    }
    var time = "";
    for(var i=0; i < 4; i++){
      var day = date.getDate();
      //if((day<=7) || (day>14 && day<=21)) {
      //if(day>14 && day<=21) {
      //  date.setDate(day+7);
      //} else if(day>28) {
      //  date.setDate(day+14);
      //}
      //if(day>24) {
      //  date.setDate(day+7);
      //}
      if(date.getDay() === 0) {
        time = date.toDateString()+' KL 12-21';
        date.setDate(date.getDate()+2);
      } else {
        time = date.toDateString()+' KL 17-22';
        date.setDate(date.getDate()+5);
      }
      $('#delivery').append($('<option>', {value: time,text: time}));
    }
  }
  document.addEventListener("DOMContentLoaded", get_delivery_date, false);
  //function adddelivery() {
  //  function get_default_date() {
  //    var date = new Date();
  //    date.setDate(date.getDate()+3);
  //    while(date.getDay() !== 0) {
  //      date.setDate(date.getDate()+1);
  //    }
  //    return date; 
  //  }
  //  $("#delivery").datepicker({ 
  //      autoSize: true,         // automatically resize the input field 
  //      altFormat: 'yy-mm-dd',  // Date Format used
  //      dateFormat: "DD, d MM yy",
  //      firstDay: 1,
        //minDate: '+4D',
  //      minDate: '+2D',
  //      maxDate: '+25D',
  //      beforeShowDay: function(date) {
  //        return [date.getDay() === 0,''];
  //      }
  //  });
  //  $("#delivery").datepicker('setDate', get_default_date());
  //};
  //document.addEventListener("DOMContentLoaded", adddelivery, false);
})(jQuery);
