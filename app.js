const map = L.map("map").setView([41.7151,44.8271], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const groups = {
  mosque: L.layerGroup().addTo(map),
  food: L.layerGroup().addTo(map),
  place: L.layerGroup().addTo(map)
};
let userMarker = null;
let userCircle = null;
let userPosition = null;
let allMarkers = [];

const places = [
  {
    id:"m1", type:"mosque", name:"Test Mosque — replace with verified data",
    lat:41.7151, lng:44.8271, toilet:true, wudu:true, wheelchair:true,
    women:true, open:true, hours:"08:00–22:00", friday:true, parking:true,
    address:"Tbilisi, Georgia", phone:"+995 XXX XX XX XX", website:"",
    notes:"TEST RECORD. Replace this with your own verified information."
  },
  {
    id:"f1", type:"food", name:"Test Halal Restaurant — replace with verified data",
    lat:41.719, lng:44.823, halal:true, porkFree:true, vegetarian:true,
    cheap:true, atmosphere:true, delicious:true, hours:"10:00–23:00",
    address:"Tbilisi, Georgia", phone:"+995 XXX XX XX XX", website:"",
    notes:"TEST RECORD. Replace this with your own verified information."
  },
  {
    id:"p1", type:"place", name:"Test Interesting Place",
    lat:41.72, lng:44.84,
    address:"Tbilisi, Georgia",
    notes:"TEST RECORD. Later we can connect general attractions to external map information."
  }
];

function escapeHtml(s=""){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function navUrl(p){
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.lat+","+p.lng)}&travelmode=driving`;
}

function popup(p){
  let html = `<div class="popup"><h3>${escapeHtml(p.name)}</h3>`;
  if(p.type==="mosque"){
    html += `<div class="badges">
      <span>🕌 Prayer</span>${p.open?'<span>🟢 Open</span>':'<span>🔴 Closed</span>'}
      ${p.toilet?'<span>🚻 Toilet</span>':''}${p.wudu?'<span>💧 Wudu</span>':''}
      ${p.wheelchair?'<span>♿ Wheelchair</span>':''}${p.women?'<span>👩 Women</span>':''}
      ${p.parking?'<span>🅿 Parking</span>':''}</div>`;
    html += `<p><b>Hours:</b> ${escapeHtml(p.hours||"Not entered")}</p>`;
  } else if(p.type==="food"){
    html += `<div class="badges">
      <span>🍴 Food</span>${p.halal?'<span>☪ Halal</span>':''}
      ${p.porkFree?'<span>🚫 Pork-free</span>':''}${p.vegetarian?'<span>🥗 Vegetarian</span>':''}
      ${p.cheap?'<span>💰 Cheap</span>':''}${p.atmosphere?'<span>🙂 Nice atmosphere</span>':''}
      ${p.delicious?'<span>⭐ Very delicious</span>':''}</div>`;
    html += `<p><b>Hours:</b> ${escapeHtml(p.hours||"Not entered")}</p>`;
  }
  if(p.address) html += `<p>📍 ${escapeHtml(p.address)}</p>`;
  if(p.phone) html += `<p>☎ ${escapeHtml(p.phone)}</p>`;
  if(p.website) html += `<p>🌐 <a href="${escapeHtml(p.website)}" target="_blank" rel="noopener">Website</a></p>`;
  if(p.notes) html += `<p>${escapeHtml(p.notes)}</p>`;
  html += `<a class="nav" href="${navUrl(p)}" target="_blank" rel="noopener">🧭 Navigate with Google Maps</a>`;
  html += `<p class="small">Google Maps URL opens the destination in Google Maps; navigation is handled by Google.</p></div>`;
  return html;
}

function matchesFilters(p){
  const checked = [...document.querySelectorAll("[data-filter]:checked")].map(x=>x.dataset.filter);
  if(!checked.length) return true;
  if(p.type==="mosque") return checked.every(f=>p[f]===true);
  if(p.type==="food") return checked.every(f=>p[f]===true);
  return false;
}

function layerVisible(type){
  return document.querySelector(`[data-layer="${type}"]`).checked;
}

function render(){
  Object.values(groups).forEach(g=>g.clearLayers());
  allMarkers = [];
  places.forEach(p=>{
    if(!layerVisible(p.type) || !matchesFilters(p)) return;
    const icon = p.type==="mosque" ? "🕌" : p.type==="food" ? "🍴" : "⭐";
    const marker = L.marker([p.lat,p.lng], {
      title:p.name,
      icon:L.divIcon({className:"emoji-marker",html:`<div style="font-size:28px">${icon}</div>`,iconSize:[32,32],iconAnchor:[16,30],popupAnchor:[0,-28]})
    }).bindPopup(popup(p));
    marker.addTo(groups[p.type]);
    allMarkers.push({marker,p});
  });
}

document.querySelectorAll("[data-layer],[data-filter]").forEach(x=>x.addEventListener("change",render));

document.getElementById("locateBtn").addEventListener("click",()=>{
  const status=document.getElementById("locationStatus");
  if(!navigator.geolocation){
    status.textContent="This browser does not provide GPS location.";
    return;
  }
  status.textContent="Requesting your location…";
  navigator.geolocation.getCurrentPosition(pos=>{
    userPosition=[pos.coords.latitude,pos.coords.longitude];
    if(userMarker) map.removeLayer(userMarker);
    if(userCircle) map.removeLayer(userCircle);
    userMarker=L.marker(userPosition).addTo(map).bindPopup("📍 You are here").openPopup();
    userCircle=L.circle(userPosition,{radius:pos.coords.accuracy||30,weight:1}).addTo(map);
    map.setView(userPosition,15);
    status.textContent=`📍 Location found (accuracy about ${Math.round(pos.coords.accuracy)} m).`;
  },err=>{
    status.textContent="Location was not available. Please allow location access and try again.";
  },{enableHighAccuracy:true,timeout:15000,maximumAge:30000});
});

render();
