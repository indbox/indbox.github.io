---
layout: card
title: Betala med Sodexkortet
description: 
image: 
nav-menu: false
published: false
permalink: cardv2
order: 999
---

<div id="main">
	<section class="major">
		<div class="inner">
			<header class="major">
				<h1>{{ page.title }}</h1>
			</header>
			<h4>Beställningsnummer: <span class="orderid"></span><br>Summa att betala: <span class="ordertotal"></span> kr</h4>
			<iframe style="height: 300px; width: 100%;" id="gFrame" src="https://script.google.com/macros/s/AKfycbzDz5bpLAOYri6kbhe1NcRvTIzHArm_hhtITKloobfokWgOAmuA/exec"></iframe>
			<div>
				<header class="major">
					<h1>Betala med Swish</h1>
				</header>
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
		</div>
	</section>
</div>
