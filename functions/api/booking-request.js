
const ADMIN_RECIPIENTS=["info@massagebahamas.com","amar@massagebahamas.com"];
const SERVICE_NAMES={swedish:"Swedish Massage",deep:"Deep Tissue Massage",couples:"Couples Massage",beach:"Beach-adjacent Massage",yacht:"Yacht Massage"};

function esc(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function clean(value,max=300){return String(value??"").trim().slice(0,max)}
function validEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}})}

async function sendEmail(apiKey,payload){
  const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!r.ok){const detail=await r.text();throw new Error("Resend "+r.status+": "+detail)}
  return r.json();
}

export async function onRequestPost(context){
  const {request,env}=context;
  if(!env.RESEND_API_KEY)return json({error:"Email service is not configured."},503);
  let input;
  try{input=await request.json()}catch{return json({error:"Invalid booking request."},400)}
  if(clean(input.website,120))return json({ok:true,reference:"REQUEST-RECEIVED"});

  const data={
    service:clean(input.service,40),duration:clean(input.duration,10),date:clean(input.date,20),time:clean(input.time,20),
    location:clean(input.location,220),name:clean(input.name,120),phone:clean(input.phone,80),email:clean(input.email,160),
    payment:clean(input.payment,30),source:clean(input.source,300)
  };
  if(!data.service||!data.duration||!data.date||!data.time||!data.location||!data.name||!data.phone||!data.email)return json({error:"Please complete all required fields."},400);
  if(!validEmail(data.email))return json({error:"Please enter a valid email address."},400);
  if(!["60","90"].includes(data.duration))return json({error:"Invalid duration."},400);
  if(!["swedish","deep","couples","beach","yacht"].includes(data.service))return json({error:"Invalid service."},400);
  if(!["pay","later"].includes(data.payment))return json({error:"Invalid payment preference."},400);

  const ref="TCI-"+new Date().toISOString().slice(2,10).replaceAll("-","")+"-"+crypto.randomUUID().slice(0,6).toUpperCase();
  const service=SERVICE_NAMES[data.service]||data.service;
  const payment=data.payment==="pay"?"Pay Online Now":"Pay in Person";
  const from=env.BOOKING_FROM_EMAIL||"Tranquilitas <bookings@bahamasmassages.com>";
  const adminSubject=`[${ref}] Turks & Caicos Booking Request — ${service} — ${data.date}`;
  const adminHtml=`
  <div style="font-family:Arial,sans-serif;color:#17343a;max-width:680px;margin:auto">
    <div style="background:#0a282e;color:white;padding:26px 30px"><div style="font-size:12px;letter-spacing:2px;color:#9ce7df">TRANQUILITAS · TURKS & CAICOS</div><h1 style="margin:8px 0 0;font-size:28px">New booking request</h1></div>
    <div style="padding:28px 30px;background:#fbfaf6">
      <p><strong>Reference:</strong> ${esc(ref)}</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Guest</td><td style="padding:9px;border-bottom:1px solid #ddd"><strong>${esc(data.name)}</strong></td></tr>
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Email</td><td style="padding:9px;border-bottom:1px solid #ddd">${esc(data.email)}</td></tr>
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Phone</td><td style="padding:9px;border-bottom:1px solid #ddd">${esc(data.phone)}</td></tr>
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Service</td><td style="padding:9px;border-bottom:1px solid #ddd">${esc(service)}</td></tr>
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Duration</td><td style="padding:9px;border-bottom:1px solid #ddd">${esc(data.duration)} minutes</td></tr>
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Requested date</td><td style="padding:9px;border-bottom:1px solid #ddd">${esc(data.date)}</td></tr>
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Preferred time</td><td style="padding:9px;border-bottom:1px solid #ddd">${esc(data.time)}</td></tr>
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Location</td><td style="padding:9px;border-bottom:1px solid #ddd">${esc(data.location)}</td></tr>
        <tr><td style="padding:9px;border-bottom:1px solid #ddd">Payment preference</td><td style="padding:9px;border-bottom:1px solid #ddd">${esc(payment)}</td></tr>
      </table>
      <p style="margin-top:22px">This is a <strong>booking request</strong>. Contact the guest to confirm therapist availability and appointment details.</p>
    </div>
  </div>`;

  const customerHtml=`
  <div style="font-family:Arial,sans-serif;color:#17343a;max-width:680px;margin:auto">
    <div style="background:#0a282e;color:white;padding:30px"><div style="font-size:12px;letter-spacing:2px;color:#9ce7df">TRANQUILITAS · TURKS & CAICOS</div><h1 style="margin:8px 0 0;font-size:30px">Booking request received</h1></div>
    <div style="padding:30px;background:#fbfaf6">
      <p>Hi ${esc(data.name)},</p>
      <p>We've received your request for a <strong>${esc(data.duration)}-minute ${esc(service)}</strong> on <strong>${esc(data.date)}</strong> at <strong>${esc(data.time)}</strong>.</p>
      <div style="margin:24px 0;padding:18px;background:#edf8f6;border-left:4px solid #70ddd3"><strong>Request reference: ${esc(ref)}</strong><br><span>Your appointment is pending until our team confirms therapist availability.</span></div>
      <p><strong>Location:</strong> ${esc(data.location)}<br><strong>Payment preference:</strong> ${esc(payment)}</p>
      <p>We'll contact you shortly using the email address or phone number you provided. If you need to make a change, reply directly to this email.</p>
      <p style="margin-top:30px">Tranquilitas<br>Turks & Caicos Island Wellness Concierge<br>+1 (242) 816-8286</p>
    </div>
  </div>`;

  try{
    await Promise.all([
      sendEmail(env.RESEND_API_KEY,{from,to:ADMIN_RECIPIENTS,reply_to:data.email,subject:adminSubject,html:adminHtml,text:`New booking request ${ref}: ${data.name}, ${service}, ${data.duration} min, ${data.date} ${data.time}, ${data.location}, ${payment}. Email: ${data.email}. Phone: ${data.phone}.`}),
      sendEmail(env.RESEND_API_KEY,{from,to:[data.email],reply_to:"info@massagebahamas.com",subject:`Your Turks & Caicos massage request — ${ref}`,html:customerHtml,text:`Hi ${data.name}, we received your request for a ${data.duration}-minute ${service} on ${data.date} at ${data.time}. Reference: ${ref}. Your appointment is pending until therapist availability is confirmed. Tranquilitas will contact you shortly.`})
    ]);
    return json({ok:true,reference:ref});
  }catch(err){
    console.error(err);
    return json({error:"We couldn't send the booking confirmation email. Please try again."},502);
  }
}
