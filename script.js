
const steps = [...document.querySelectorAll('.step')];
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
let current = 1;

function showStep(n){
  current = n;
  steps.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === n));
  if(progressBar) progressBar.style.width = `${(n/7)*100}%`;
  if(progressText) progressText.textContent = `Step ${n} of 7`;
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('.choices').forEach(group => {
  group.querySelectorAll('.choice').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const target = document.querySelector(`input[name="${group.dataset.name}"]`);
      if(target) target.value = btn.dataset.value;
      setTimeout(() => showStep(Math.min(7,current+1)), 100);
    });
  });
});

document.querySelectorAll('.back').forEach(btn => btn.addEventListener('click',() => showStep(Math.max(1,current-1))));

document.querySelectorAll('.next').forEach(btn => {
  btn.addEventListener('click', () => {
    if(current === 2){
  const month = document.getElementById('dob_month').value;
  const day = document.getElementById('dob_day').value;
  const year = document.getElementById('dob_year').value;
  const dobInput = document.getElementById('date_of_birth');
  const err = document.getElementById('dobError');

  if(!month || !day || !year){
    err.textContent = 'Please select your complete date of birth.';
    err.style.display = 'block';
    return;
  }

  const dob = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();

  const adult = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  const oldest = new Date(
    today.getFullYear() - 110,
    today.getMonth(),
    today.getDate()
  );

  const validDate =
    dob.getFullYear() === Number(year) &&
    dob.getMonth() === Number(month) - 1 &&
    dob.getDate() === Number(day);

  if(!validDate || dob > adult || dob < oldest){
    err.textContent = 'Please select a valid date of birth for an adult age 18 or older.';
    err.style.display = 'block';
    return;
  }

  dobInput.value = `${year}-${month}-${String(day).padStart(2,'0')}`;
  err.style.display = 'none';
}
    showStep(Math.min(7,current+1));
  });
});

const params = new URLSearchParams(location.search);
['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'].forEach(k=>{
  const el=document.getElementById(k);
  if(el) el.value=params.get(k)||'';
});
const lp=document.getElementById('landing_page');
if(lp) lp.value=location.href;

const form=document.getElementById('leadForm');
if(form){
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return;}
    const submit=form.querySelector('button[type="submit"]');
    submit.disabled=true;submit.textContent='Submitting...';
    const data=new FormData(form);
    const body=new URLSearchParams();
    for(const [k,v] of data.entries()) body.append(k,v);
    try{
      const res=await fetch('/',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:body.toString()
      });
      if(!res.ok) throw new Error();
     document.getElementById('formFlow').style.display='none';
document.getElementById('thankYou').style.display='block';

// Google Ads lead conversion
if (typeof gtag === 'function') {
  gtag('event', 'conversion', {
    'send_to': 'AW-18388637123/cLq9COmu9OEcEMOrscBE',
    'value': 1.0,
    'currency': 'USD'
  });
}

// Existing tracking
window.dataLayer=window.dataLayer||[];
window.dataLayer.push({event:'lead_submit'});

if(window.fbq) fbq('track','Lead');
    }catch(err){
      submit.disabled=false;submit.textContent='Request a Call From Ian';
      alert('We could not submit your request. Please email iansellslife@gmail.com.');
    }
  });
}
