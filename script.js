(function(){
  // elements
  const firstEl = document.getElementById('first');
  const lastEl = document.getElementById('last');
  const domainEl = document.getElementById('domain');
  const namesEl = document.getElementById('names');
  const results = document.getElementById('results');
  const generate = document.getElementById('generate');
  const clear = document.getElementById('clear');

  // bulk buttons
  const bulkActionsTop = document.getElementById('bulk-actions-top');
  const bulkActionsBottom = document.getElementById('bulk-actions-bottom');
  const copyAllTop = document.getElementById('copyAllTop');
  const copyAllBottom = document.getElementById('copyAllBottom');
  const downloadCsvTop = document.getElementById('downloadCsvTop');
  const downloadCsvBottom = document.getElementById('downloadCsvBottom');

  const themeBtn = document.getElementById('themeToggle');

  let lastResultList = [];

  // nickname map
  const nicknames = {
  michael: ['mike', 'mickey'],
  mike: ['michael', 'mickey'],
  mickey: ['michael', 'mike'],

  timothy: ['tim', 'timmy'],
  tim: ['timothy', 'timmy'],
  timmy: ['timothy', 'tim'],

  robert: ['bob', 'rob', 'bobby', 'robby'],
  bob: ['robert', 'rob', 'bobby', 'robby'],
  rob: ['robert', 'bob', 'bobby', 'robby'],
  bobby: ['robert', 'bob', 'rob', 'robby'],
  robby: ['robert', 'bob', 'rob', 'bobby'],

  william: ['will', 'bill', 'billy', 'liam'],
  will: ['william', 'bill', 'billy', 'liam'],
  bill: ['william', 'will', 'billy', 'liam'],
  billy: ['william', 'will', 'bill', 'liam'],
  liam: ['william', 'will', 'bill', 'billy'],

  jonathan: ['jon', 'john', 'nate'],
  jon: ['jonathan', 'john', 'nate'],
  john: ['jonathan', 'jon', 'nate'],
  nate: ['jonathan', 'jon', 'john'],

  christopher: ['chris', 'topher'],
  chris: ['christopher', 'topher'],
  topher: ['christopher', 'chris'],

  katherine: ['kate', 'kathy', 'katie', 'kat'],
  kate: ['katherine', 'kathy', 'katie', 'kat'],
  kathy: ['katherine', 'kate', 'katie', 'kat'],
  katie: ['katherine', 'kate', 'kathy', 'kat'],
  kat: ['katherine', 'kate', 'kathy', 'katie'],

  elizabeth: ['liz', 'beth', 'lizzy', 'eliza', 'betsy'],
  liz: ['elizabeth', 'beth', 'lizzy', 'eliza', 'betsy'],
  beth: ['elizabeth', 'liz', 'lizzy', 'eliza', 'betsy'],
  lizzy: ['elizabeth', 'liz', 'beth', 'eliza', 'betsy'],
  eliza: ['elizabeth', 'liz', 'beth', 'lizzy', 'betsy'],
  betsy: ['elizabeth', 'liz', 'beth', 'lizzy', 'eliza'],

  alexandra: ['alex', 'ali', 'lexi', 'sandra'],
  alex: ['alexandra', 'ali', 'lexi', 'sandra'],
  ali: ['alexandra', 'alex', 'lexi', 'sandra'],
  lexi: ['alexandra', 'alex', 'ali', 'sandra'],
  sandra: ['alexandra', 'alex', 'ali', 'lexi'],

  daniel: ['dan', 'danny'],
  dan: ['daniel', 'danny'],
  danny: ['daniel', 'dan'],

  joseph: ['joe', 'joey'],
  joe: ['joseph', 'joey'],
  joey: ['joseph', 'joe'],

  matthew: ['matt', 'matty'],
  matt: ['matthew', 'matty'],
  matty: ['matthew', 'matt'],

  andrew: ['andy', 'drew'],
  andy: ['andrew', 'drew'],
  drew: ['andrew', 'andy'],

  nicholas: ['nick', 'nicky'],
  nick: ['nicholas', 'nicky'],
  nicky: ['nicholas', 'nick'],

  anthony: ['tony'],
  tony: ['anthony'],

  steven: ['steve', 'stevie'],
  steve: ['steven', 'stevie'],
  stevie: ['steven', 'steve'],

  thomas: ['tom', 'tommy'],
  tom: ['thomas', 'tommy'],
  tommy: ['thomas', 'tom'],

  benjamin: ['ben', 'benny'],
  ben: ['benjamin', 'benny'],
  benny: ['benjamin', 'ben'],

  samuel: ['sam', 'sammy'],
  sam: ['samuel', 'sammy'],
  sammy: ['samuel', 'sam'],

  charles: ['charlie', 'chuck'],
  charlie: ['charles', 'chuck'],
  chuck: ['charles', 'charlie'],

  james: ['jim', 'jimmy'],
  jim: ['james', 'jimmy'],
  jimmy: ['james', 'jim'],

  patrick: ['pat', 'paddy'],
  pat: ['patrick', 'paddy'],
  paddy: ['patrick', 'pat'],

  margaret: ['meg', 'maggie', 'peggy'],
  meg: ['margaret', 'maggie', 'peggy'],
  maggie: ['margaret', 'meg', 'peggy'],
  peggy: ['margaret', 'meg', 'maggie'],

  susan: ['sue', 'susie'],
  sue: ['susan', 'susie'],
  susie: ['susan', 'sue'],

  rebecca: ['becca', 'becky'],
  becca: ['rebecca', 'becky'],
  becky: ['rebecca', 'becca'],

  victoria: ['vicky', 'tori'],
  vicky: ['victoria', 'tori'],
  tori: ['victoria', 'vicky'],

  catherine: ['cate', 'cathy', 'kitty'],
  cate: ['catherine', 'cathy', 'kitty'],
  cathy: ['catherine', 'cate', 'kitty'],
  kitty: ['catherine', 'cate', 'cathy'],

  madeline: ['maddie'],
  maddie: ['madeline'],

  abigail: ['abby'],
  abby: ['abigail'],

  samantha: ['sam', 'sammy'],
  sam: ['samantha', 'sammy'],
  sammy: ['samantha', 'sam']

}
;

  const patterns = [
    {key: 'first.last', fn: ({first,last}) => `${first}.${last}`},
    {key: 'firstlast',  fn: ({first,last}) => `${first}${last}`},
    {key: 'f.last',     fn: ({first,last}) => `${first.charAt(0)}.${last}`},
    {key: 'first.l',    fn: ({first,last}) => `${first}.${last.charAt(0)}`},
    {key: 'flast',      fn: ({first,last}) => `${first.charAt(0)}${last}`},
    {key: 'first_last', fn: ({first,last}) => `${first}_${last}`},
    {key: 'last.first', fn: ({first,last}) => `${last}.${first}`},
    {key: 'first-last', fn: ({first,last}) => `${first}-${last}`},
    {key: 'first',      fn: ({first}) => `${first}`},
    {key: 'last',       fn: ({last}) => `${last}`}
  ];

  function normalizeInput(s){
    if(!s) return '';
    s = s.normalize('NFKD').replace(/\p{Diacritic}/gu,'');
    s = s.toLowerCase().trim();
    s = s.replace(/[^a-z0-9._\- ]+/g,'');
    s = s.replace(/\s+/g,'').replace(/ /g,'');
    return s;
  }

  function getFirstNames(first){
    const list = [first];
    if(nicknames[first]) nicknames[first].forEach(n => { if(!list.includes(n)) list.push(n); });
    return list;
  }

  function buildEmails(firstRaw,lastRaw,domainRaw){
    const domain = normalizeInput(domainRaw).replace(/^mailto:|^@/,'');
    const firstNorm = normalizeInput(firstRaw);
    const lastNorm = normalizeInput(lastRaw);
    const firstNames = getFirstNames(firstNorm);

    const allResults = [];
    firstNames.forEach(f=>{
      patterns.forEach(p=>{
        const local = p.fn({first:f,last:lastNorm})||'';
        const cleaned = local.replace(/^[._-]+|[._-]+$/g,'').replace(/\.{2,}/g,'.');
        const email = (cleaned && domain)? `${cleaned}@${domain}` : '';
        allResults.push({first:f,last:lastNorm,pattern:p.key,local:cleaned,email});
      });
    });
    return allResults;
  }

  function buildBulkEmails(namesText, domainRaw){
    const domain = normalizeInput(domainRaw).replace(/^mailto:|^@/,'');
    const lines = namesText.split('\n').map(l=>l.trim()).filter(Boolean);
    const allResults = [];

    lines.forEach(line=>{
      let [firstRaw,...rest] = line.split(' ');
      let lastRaw = rest.join(' ');
      const firstNorm = normalizeInput(firstRaw);
      const lastNorm = normalizeInput(lastRaw);
      const firstNames = getFirstNames(firstNorm);

      firstNames.forEach(f=>{
        patterns.forEach(p=>{
          const local = p.fn({first:f,last:lastNorm})||'';
          const cleaned = local.replace(/^[._-]+|[._-]+$/g,'').replace(/\.{2,}/g,'.');
          const email = (cleaned && domain)? `${cleaned}@${domain}` : '';
          allResults.push({first:f,last:lastNorm,pattern:p.key,local:cleaned,email});
        });
      });
    });

    return allResults;
  }

  // Render
  function render(list){
    lastResultList = list;
    results.innerHTML='';
    const anyEmails = list.some(r=>r.email);
    bulkActionsTop.style.display = anyEmails ? 'flex':'none';
    bulkActionsBottom.style.display = anyEmails ? 'flex':'none';

    list.forEach(item=>{
      const el = document.createElement('div');
      el.className='pattern';
      el.innerHTML=`
        <div class="meta">
          <b>${item.pattern}</b>
          <span class="small">local: <code>${item.local||'—'}</code></span>
        </div>
        <div class="email">${item.email ? `<a href="mailto:${item.email}" style="color:inherit;text-decoration:none">${item.email}</a>`:'<span class="small">Incomplete</span>'}</div>
        ${item.email ? `
        <div class="email-actions" style="margin-top:6px;display:flex;gap:6px;">
          <button class="open-btn">Open</button>
          <button class="copy-btn-single">Copy</button>
        </div>` : ''}
      `;
      results.appendChild(el);

      const openBtn = el.querySelector('.open-btn');
      if(openBtn){
        openBtn.addEventListener('click', ()=> window.location.href = `mailto:${item.email}`);
      }

      const copyBtn = el.querySelector('.copy-btn-single');
      if(copyBtn){
        copyBtn.addEventListener('click', ()=>{
          navigator.clipboard.writeText(item.email)
            .then(()=> { copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy',1200); })
            .catch(()=> { copyBtn.textContent='Failed'; setTimeout(()=>copyBtn.textContent='Copy',1200); });
        });
      }

      el.getBoundingClientRect(); // trigger animation
    });
  }

  // Generate
  generate.addEventListener('click', ()=>{
    const domain = domainEl.value.trim();
    const namesText = namesEl.value.trim();
    if(namesText){
      render(buildBulkEmails(namesText, domain));
    } else {
      render(buildEmails(firstEl.value,lastEl.value,domain));
    }
  });

  // Clear
  clear.addEventListener('click', ()=>{
    firstEl.value=''; lastEl.value=''; domainEl.value=''; namesEl.value='';
    results.innerHTML='';
    bulkActionsTop.style.display='none';
    bulkActionsBottom.style.display='none';
  });

  // Enter key on single-line inputs
  [firstEl,lastEl,domainEl].forEach(inp=>{
    inp.addEventListener('keydown', e=>{
      if(e.key==='Enter'){ e.preventDefault(); generate.click(); }
    });
  });

  // Theme toggle
  if(localStorage.getItem('theme')==='light'){ 
    document.documentElement.classList.add('light'); 
    themeBtn.textContent='🌙'; 
  }
  themeBtn.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    themeBtn.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // Copy All
  function copyAllEmails(btn){
    const allEmails = lastResultList.filter(r=>r.email).map(r=>r.email).join('\n');
    if(!allEmails) return;
    navigator.clipboard.writeText(allEmails)
      .then(()=> { btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy All',1200); })
      .catch(()=> { btn.textContent='Failed'; setTimeout(()=>btn.textContent='Copy All',1200); });
  }
  [copyAllTop, copyAllBottom].forEach(btn=>btn.addEventListener('click',()=>copyAllEmails(btn)));

  // Download CSV
  function downloadCsv(){
    const emails = lastResultList.filter(r=>r.email);
    if(emails.length===0) return;
    const rows = ['First Name,Last Name,Pattern,Email'];
    emails.forEach(item=>{
      const first = `"${item.first}"`;
      const last = `"${item.last}"`;
      const pattern = `"${item.pattern}"`;
      const email = `"${item.email}"`;
      rows.push([first,last,pattern,email].join(','));
    });
    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = emails.length>10 ? 'bulk-emails.csv' : `${normalizeInput(firstEl.value||'unknown')}-${normalizeInput(lastEl.value||'unknown')}-emails.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  [downloadCsvTop, downloadCsvBottom].forEach(btn=>btn.addEventListener('click',()=>downloadCsv()));

  // Prefill example
  firstEl.value='Michael'; lastEl.value='Smith'; domainEl.value='example.com';
  generate.click();

})();
