
const BOOKING={
  swedish:{60:"https://tranquilitasspa.setmore.com/services/7b35ade0-4f53-42c5-b757-da1aeefc1197",90:"https://tranquilitasspa.setmore.com/services/7b35ade0-4f53-42c5-b757-da1aeefc1197"},
  deep:{60:"https://tranquilitasspa.setmore.com/services/5e3a7bad-efb5-40f7-836f-e0d5b15dc6cc",90:"https://tranquilitasspa.setmore.com/services/c1ad1be3-3cdb-4d0e-8866-a8c600b77e87"},
  couples:{60:"https://tranquilitasspa.setmore.com/services/6cf0518f-cfdb-4f71-88e8-5c285c42c5a6",90:"https://tranquilitasspa.setmore.com/services/159fce09-d4ca-488d-848b-898ef0297074"},
  beach:{60:"https://tranquilitasspa.setmore.com/services/d00c3eed-5c54-48c3-95fe-6006a68b3600",90:"https://tranquilitasspa.setmore.com/services/879faf48-cbae-4a9b-b780-f433d3ef864c"},
  yacht:{60:"https://tranquilitasspa.setmore.com/",90:"https://tranquilitasspa.setmore.com/"}
};
const WA="https://wa.me/12428168286";
const SMS="sms:+12428168286";
const modal=document.querySelector("#bookingModal");
const form=document.querySelector("#bookingForm");

function humanService(key){
  return {swedish:"Swedish Massage",deep:"Deep Tissue Massage",couples:"Couples Massage",beach:"Beach-adjacent Massage",yacht:"Yacht Massage"}[key]||key;
}
function openBooking(service="",duration="60"){
  if(!modal||!form)return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  if(form.service) form.service.value=service;
  if(form.duration) form.duration.value=duration;
}
function closeBooking(){
  if(!modal)return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-book]");
  if(b){e.preventDefault();openBooking(b.dataset.service||"",b.dataset.duration||"60")}
  if(e.target.matches("[data-close]")||e.target===modal)closeBooking();
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBooking()});

document.querySelectorAll(".faq-q").forEach(b=>b.addEventListener("click",()=>b.parentElement.classList.toggle("open")));
const details={grace:"Grace Bay is our highest-demand zone for resort, villa and couples massage.",leeward:"Leeward is ideal for discreet in-villa sessions, private estates and couples setups.",longbay:"Long Bay is popular with kiteboarders and active travelers booking deep tissue and recovery work.",turtle:"Turtle Cove combines villas, marina access and yacht-friendly logistics.",chalk:"Chalk Sound is best booked in advance for private-home and villa appointments.",bight:"The Bight is central for resort, family-villa and beach-adjacent requests."};
document.querySelectorAll(".area-chip").forEach(c=>c.addEventListener("click",()=>{
  document.querySelectorAll(".area-chip").forEach(x=>x.classList.remove("active"));
  c.classList.add("active");
  const d=document.querySelector("#areaDetail");
  if(d)d.textContent=details[c.dataset.area]||"";
}));

if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add("visible")),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(x=>observer.observe(x));
}else{
  document.querySelectorAll(".reveal").forEach(x=>x.classList.add("visible"));
}

document.querySelectorAll(".pay-card").forEach(card=>card.addEventListener("click",()=>{
  document.querySelectorAll(".pay-card").forEach(x=>x.classList.remove("selected"));
  card.classList.add("selected");
  const radio=card.querySelector('input[type="radio"]');
  if(radio)radio.checked=true;
}));

function setFormError(message){
  let box=form?.querySelector(".booking-error");
  if(!box&&form){
    box=document.createElement("div");
    box.className="booking-error";
    const submit=form.querySelector('button[type="submit"]');
    submit?.parentElement?.before(box);
  }
  if(box){box.textContent=message;box.hidden=!message;}
}

function renderBookingSuccess(data,payload){
  const service=humanService(payload.service);
  const payNow=payload.payment==="pay";
  const payUrl=BOOKING[payload.service]?.[payload.duration]||"https://tranquilitasspa.setmore.com/";
  const panel=modal?.querySelector(".booking-panel");
  if(!panel)return;
  panel.innerHTML=`
    <div class="booking-success">
      <div class="success-check">✓</div>
      <p class="eyebrow">REQUEST RECEIVED</p>
      <h2>We've got your booking request.</h2>
      <p class="success-lede">A confirmation has been sent to <strong>${payload.email}</strong>. Your requested appointment remains pending until our team confirms therapist availability.</p>
      <div class="success-ref"><span>REQUEST REFERENCE</span><strong>${data.reference}</strong></div>
      <div class="success-summary">
        <div><span>Service</span><strong>${service}</strong></div>
        <div><span>Duration</span><strong>${payload.duration} minutes</strong></div><div><span>Service subtotal</span><strong>${window.tranquilitasBookingSummary?.(payload)||"Quote required"}</strong></div>
        <div><span>Date</span><strong>${payload.date}</strong></div>
        <div><span>Preferred time</span><strong>${payload.time}</strong></div>
        <div class="wide"><span>Location</span><strong>${payload.location}</strong></div>
        <div class="wide"><span>Payment preference</span><strong>${payNow?"Pay online now":"Pay in person"}</strong></div>
      </div>
      ${payNow?`<div class="success-action"><p>Your request is recorded. Continue to the secure online booking/payment step.</p><a class="button button--dark" href="${payUrl}">Continue to online payment</a></div>`:`<div class="success-action"><p>No payment was taken. Tranquilitas will contact you shortly to confirm availability and appointment details.</p></div>`}
      <div class="success-help"><span>Need to change something?</span><a href="mailto:info@massagebahamas.com">Email us</a><a href="${WA}">WhatsApp</a><a href="${SMS}">iMessage / Text</a></div>
      <button class="button button--ghost success-close" data-close>Close</button>
    </div>`;
}

if(form){
  const hp=document.createElement("input");
  hp.type="text";hp.name="website";hp.tabIndex=-1;hp.autocomplete="off";hp.className="hp-field";hp.setAttribute("aria-hidden","true");
  form.appendChild(hp);

  form.addEventListener("submit",async e=>{
    e.preventDefault();
    setFormError("");
    const d=new FormData(form);
    const payload={
      service:d.get("service"),
      duration:d.get("duration"),
      date:d.get("date"),
      time:d.get("time"),
      location:d.get("location"),
      name:d.get("name"),
      phone:d.get("phone"),
      email:d.get("email"),
      payment:d.get("payment"),
      website:d.get("website")||"",
      source:location.href
    };
    if(!payload.date||!payload.time||!payload.location||!payload.name||!payload.phone||!payload.email){
      setFormError("Please complete all required booking details.");
      return;
    }
    const submit=form.querySelector('button[type="submit"]');
    const original=submit?.textContent;
    if(submit){submit.disabled=true;submit.textContent="Sending request…";}
    try{
      const res=await fetch("/api/booking-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json().catch(()=>({}));
      if(!res.ok)throw new Error(data.error||"We couldn't send your booking request.");
      renderBookingSuccess(data,payload);
    }catch(err){
      console.error("Booking request failed",err);
      setFormError("We couldn't send your booking request. Please try again, or use the contact button for help.");
      if(submit){submit.disabled=false;submit.textContent=original||"Continue booking";}
    }
  });
}

const lightbox=document.querySelector("#lightbox"),lightboxImage=document.querySelector("#lightboxImage");
document.querySelectorAll("[data-gallery]").forEach(item=>item.addEventListener("click",()=>{
  if(!lightbox||!lightboxImage)return;
  lightboxImage.src=item.dataset.gallery;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}));
document.addEventListener("click",e=>{
  if(e.target.matches("[data-lightbox-close]")||e.target===lightbox){
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
  }
});

const expPanels=[...document.querySelectorAll(".experience-panel")];
const expTabs=[...document.querySelectorAll(".experience-tab")];
const expProgress=document.querySelector("#experienceProgress");
let expIndex=0;
function showExperience(i){
  if(!expPanels.length)return;
  expIndex=(i+expPanels.length)%expPanels.length;
  expPanels.forEach((p,n)=>{p.hidden=n!==expIndex;p.classList.toggle("active",n===expIndex)});
  expTabs.forEach((t,n)=>t.classList.toggle("active",n===expIndex));
  if(expProgress)expProgress.textContent=String(expIndex+1).padStart(2,"0")+" / "+String(expPanels.length).padStart(2,"0");
}
expTabs.forEach((t,i)=>t.addEventListener("click",()=>showExperience(i)));
document.querySelector("[data-exp-prev]")?.addEventListener("click",()=>showExperience(expIndex-1));
document.querySelector("[data-exp-next]")?.addEventListener("click",()=>showExperience(expIndex+1));

(function addContactDock(){
  if(document.querySelector(".contact-dock"))return;
  const dock=document.createElement("div");
  dock.className="contact-dock";
  dock.innerHTML=`
    <div class="contact-menu" id="contactMenu" hidden>
      <span>Need help booking?</span>
      <a href="${WA}" target="_blank" rel="noopener"><b>WhatsApp</b><small>Message our concierge</small></a>
      <a href="${SMS}"><b>iMessage / Text</b><small>+1 (242) 816-8286</small></a>
    </div>
    <button class="contact-trigger" type="button" aria-expanded="false" aria-controls="contactMenu"><span class="contact-pulse"></span>Need help?</button>`;
  document.body.appendChild(dock);
  const trigger=dock.querySelector(".contact-trigger"),menu=dock.querySelector(".contact-menu");
  trigger.addEventListener("click",()=>{
    const open=menu.hidden;
    menu.hidden=!open;
    trigger.setAttribute("aria-expanded",String(open));
  });
  document.addEventListener("click",e=>{
    if(!dock.contains(e.target)){menu.hidden=true;trigger.setAttribute("aria-expanded","false")}
  });
})();


/* Shared country UX: selectable service + visible cost in each booking request. */
(()=>{
const form=document.getElementById("bookingForm"),modal=document.getElementById("bookingModal");
if(!form||!modal||form.dataset.summaryInstalled)return;
form.dataset.summaryInstalled="true";
const PRICES={"swedish":[140,200],"deep":[150,220],"couples":[290,410],"beach":[165,240]};
const service=form.querySelector('[name="service"]'),duration=form.querySelector('[name="duration"]');
if(!service||!duration)return;
if(!Array.from(service.options).some(o=>o.value===""))service.insertBefore(new Option("Choose a massage",""),service.firstChild);
service.required=true;
const guestsField=document.createElement("div");guestsField.className="field booking-guests-field";
guestsField.innerHTML='<label for="bookingGuestQty">Number of guests</label><input id="bookingGuestQty" name="guests" type="number" min="1" max="10" step="1" value="1" required>';
duration.closest(".field")?.after(guestsField);
const guests=guestsField.querySelector("input");
const summary=document.createElement("div");summary.className="field full booking-price-summary";summary.setAttribute("aria-live","polite");
summary.innerHTML='<div class="booking-price-panel"><strong>Request summary</strong><p data-booking-desc>Choose a service to see the listed price.</p><p class="booking-price-value" data-booking-price>Choose a service</p><small data-booking-note>Published USD service rates. Final costs and availability are confirmed before payment.</small></div>';
const payment=form.querySelector(".pay-choice")?.closest(".field"),submit=form.querySelector('button[type="submit"]');
(payment||submit?.closest(".field"))?.before(summary);
const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
function calculate(){
 const svc=service.value,dur=duration.value;
 if(svc==="couples")guests.value="2";
 const qty=Number(guests.value),unit=dur==="60"?PRICES[svc]?.[0]:dur==="90"?PRICES[svc]?.[1]:undefined;
 if(!svc)return{amount:null,note:"Choose a treatment to see the listed service price.",count:qty};
 if(!Number.isInteger(qty)||qty<1||qty>10)return{amount:null,note:"Enter a valid guest count.",count:qty};
 if(!Number.isFinite(unit))return{amount:null,note:"Custom service: our concierge will confirm pricing before payment.",count:qty};
 return{amount:unit*(svc==="couples"?1:qty),note:svc==="couples"?"Couples price covers two guests.":"Listed price per guest, multiplied by "+qty+".",count:qty};
}
function update(){
 const p=calculate();const label=service.options[service.selectedIndex]?.textContent||"Choose a service";
 summary.querySelector("[data-booking-desc]").textContent=label+" · "+duration.value+" minutes · "+p.count+" guest(s)";
 summary.querySelector("[data-booking-price]").textContent=p.amount===null?"Price: quote required":"Published service subtotal: "+money(p.amount)+" USD";
 summary.querySelector("[data-booking-note]").textContent=p.note+" Travel, property or island-specific charges may apply. Your request is not a confirmed booking.";
}
window.tranquilitasBookingSummary=payload=>{
 const svc=payload.service,dur=String(payload.duration),q=Number(payload.guests||guests.value||1);
 const val=dur==="60"?PRICES[svc]?.[0]:dur==="90"?PRICES[svc]?.[1]:undefined;
 return Number.isFinite(val)&&Number.isInteger(q)&&q>=1&&q<=10?money(val*(svc==="couples"?1:q))+" USD (service subtotal)":"Quote required";
};
form.addEventListener("input",update);form.addEventListener("change",update);
document.addEventListener("click",event=>{
 const trigger=event.target.closest("[data-book]");if(!trigger)return;
 queueMicrotask(()=>{
 const serviceHint=trigger.dataset.service||({swedish:"swedish",deep:"deep",couples:"couples",beach:"beach"}[location.pathname.split("/").filter(Boolean)[0]?.split("-")[0]]);
 if(serviceHint&&Array.from(service.options).some(o=>o.value===serviceHint))service.value=serviceHint;
 update();
 });
});
update();
})();
