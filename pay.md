---
layout: card
title: BETALNINGSMETOD
description: 
image: 
nav-menu: false
published: true
permalink: pay
order: 999
---

<div id="main">
	<section class="major">
		<div class="inner">
			<header class="major">
				<h2>{{ page.title }}</h2>
			</header>
			<div>
				<h4>Beställningsnummer: <span class="orderid"></span><br>Summa att betala: <span class="ordertotal"></span> kr</h4>
			</div>
			<h2><a onclick="paysel('#swishsel')">Betala med Swish</a></h2>
			<div id="swishsel">
				<a class="link swish-link">
					<img src="{{ site.baseurl }}/assets/images/Swish.png" alt-src="Betala med Swish">
				</a>
	                	<a id="swish-uri"></a>
      				<div id="swish-qr" class="modal" onclick="this.style.display='none'">
    	    				<div class="modal-content">
					    <h5>Scan the QR code using the Swish app to start payment or manually enter Swish number 123 478 05 32</h5>
		                            <h5>Amount: <span class="ordertotal"></span> kr<br>Message: <span class="orderid"></span></h5>					    					     <img src="{{ site.baseurl }}/assets/images/indiskaboxenswish.png" >
				  	</div>
  				</div>
 			</div>
			<h2><a onclick="paysel('#stripesel')">Betalkort</a></h2>
			<div id="stripesel">
				<iframe style="height: 340px; width: 100%;" allowpaymentrequest id="gFrame" src="https://script.google.com/macros/s/AKfycbzDz5bpLAOYri6kbhe1NcRvTIzHArm_hhtITKloobfokWgOAmuA/exec"></iframe>
				<p>Indiska Boxens kortbetalningspartner är Stripe. Indiska Boxen tar aldrig del av dina personliga kontokortsuppgifter utan detta hanteras endast av Stripe. Person och betalningsuppgifter som lämnas på Indiska Boxen är krypterade med den högsta säkerhetsnivån enligt den standard som gäller vid handel på Internet. Kortbetalning görs i förskott.</p>
			</div>
		</div>
	</section>
</div>
