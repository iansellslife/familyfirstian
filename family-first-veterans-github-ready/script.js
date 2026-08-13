
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
      const dobInput = document.getElementById('date_of_birth');
      const err = document.getElementById('dobError');
      const dob = new Date(dobInput.value + 'T00:00:00');
      const today = new Date();
      const adult = new Date(today.getFullYear()-18,today.getMonth(),today.getDate());
      const oldest = new Date(today.getFullYear()-110,today.getMonth(),today.getDate());
      if(!dobInput.value || isNaN(dob.getTime()) || dob > adult || dob < oldest){
        err.style.display='block'; return;
      }
      err.style.display='none';
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
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:'lead_submit'});
      if(window.fbq) fbq('track','Lead');
    }catch(err){
      submit.disabled=false;submit.textContent='Request a Call From Ian';
      alert('We could not submit your request. Please email iansellslife@gmail.com.');
    }
  });
}
