
const BOOKING={swedish:{60:"https://tranquilitasspa.setmore.com/services/7b35ade0-4f53-42c5-b757-da1aeefc1197",90:"https://tranquilitasspa.setmore.com/services/7b35ade0-4f53-42c5-b757-da1aeefc1197"},deep:{60:"https://tranquilitasspa.setmore.com/services/5e3a7bad-efb5-40f7-836f-e0d5b15dc6cc",90:"https://tranquilitasspa.setmore.com/services/c1ad1be3-3cdb-4d0e-8866-a8c600b77e87"},couples:{60:"https://tranquilitasspa.setmore.com/services/6cf0518f-cfdb-4f71-88e8-5c285c42c5a6",90:"https://tranquilitasspa.setmore.com/services/159fce09-d4ca-488d-848b-898ef0297074"},beach:{60:"https://tranquilitasspa.setmore.com/services/d00c3eed-5c54-48c3-95fe-6006a68b3600",90:"https://tranquilitasspa.setmore.com/services/879faf48-cbae-4a9b-b780-f433d3ef864c"}};
const WA="https://wa.me/12428168286";
const modal=document.querySelector("#bookingModal");
const form=document.querySelector("#bookingForm");
function openBooking(service="swedish",duration="60"){if(!modal)return;modal.classList.add("open");document.body.style.overflow="hidden";form.service.value=service;form.duration.value=duration}
function closeBooking(){if(!modal)return;modal.classList.remove("open");document.body.style.overflow=""}
document.addEventListener("click",e=>{const b=e.target.closest("[data-book]");if(b){e.preventDefault();openBooking(b.dataset.service||"swedish",b.dataset.duration||"60")}if(e.target.matches("[data-close]")||e.target===modal)closeBooking()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeBooking()});
document.querySelectorAll(".faq-q").forEach(b=>b.addEventListener("click",()=>b.parentElement.classList.toggle("open")));
const details={grace:"Grace Bay is our highest-demand zone for resort, villa and couples massage.",leeward:"Leeward is ideal for discreet in-villa sessions, private estates and couples setups.",longbay:"Long Bay is popular with kiteboarders and active travelers booking deep tissue and recovery work.",turtle:"Turtle Cove combines villas, marina access and yacht-friendly logistics.",chalk:"Chalk Sound is best booked in advance for private-home and villa appointments.",bight:"The Bight is central for resort, family-villa and beach-adjacent requests."};
document.querySelectorAll(".area-chip").forEach(c=>c.addEventListener("click",()=>{document.querySelectorAll(".area-chip").forEach(x=>x.classList.remove("active"));c.classList.add("active");const d=document.querySelector("#areaDetail");if(d)d.textContent=details[c.dataset.area]||""}));
const observer=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add("visible")),{threshold:.12});document.querySelectorAll(".reveal").forEach(x=>observer.observe(x));
if(form)form.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(form),mode=d.get("payment"),service=d.get("service"),duration=d.get("duration");if(mode==="pay"){const url=BOOKING[service]?.[duration]||"https://tranquilitasspa.setmore.com/";location.href=url;return}const msg=["Turks & Caicos massage reservation request",`Service: ${service}`,`Duration: ${duration} minutes`,`Date: ${d.get("date")}`,`Time: ${d.get("time")}`,`Location: ${d.get("location")}`,`Name: ${d.get("name")}`,`Phone: ${d.get("phone")}`,`Email: ${d.get("email")}`,"Payment: Pay in person"].join("\n");location.href=WA+"?text="+encodeURIComponent(msg)});
document.querySelectorAll(".pay-card").forEach(card=>card.addEventListener("click",()=>{document.querySelectorAll(".pay-card").forEach(x=>x.classList.remove("selected"));card.classList.add("selected");card.querySelector("input").checked=true}));

const lightbox=document.querySelector("#lightbox"),lightboxImage=document.querySelector("#lightboxImage");
document.querySelectorAll("[data-gallery]").forEach(item=>item.addEventListener("click",()=>{if(!lightbox||!lightboxImage)return;lightboxImage.src=item.dataset.gallery;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}));
document.addEventListener("click",e=>{if(e.target.matches("[data-lightbox-close]")||e.target===lightbox){lightbox?.classList.remove("open");lightbox?.setAttribute("aria-hidden","true");document.body.style.overflow=""}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&lightbox?.classList.contains("open")){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");document.body.style.overflow=""}});

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
