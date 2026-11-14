/* MARQ-DYNAMIC-PRODUCT-GALLERY-V2 */
(async()=>{
 const api='https://zonclgsfqtylnedxigxd.supabase.co/rest/v1/';
 const key='sb_publishable_7Oi8lKwThZ2kKQUVxUT-oQ_3O-4_mSK';
 const headers={apikey:key,Authorization:'Bearer '+key};
 const norm=v=>{try{const u=new URL(v,location.href);return(u.origin.toLowerCase()+u.pathname).replace(/\/$/,'')}catch(e){return String(v||'').trim()}};
 const main=document.getElementById('main-product-image'),thumbs=document.querySelector('.thumbs'),buy=document.querySelector('a.buy');
 if(!main||!thumbs||!buy)return;
 try{
  let productId=main.dataset.productId;
  if(!productId){
   const pr=await fetch(api+'produtos?select=id,link_afiliado&limit=1000',{headers,cache:'no-store'});
   if(!pr.ok)throw new Error('Produtos HTTP '+pr.status);
   const products=await pr.json(),link=norm(buy.href);
   const product=products.find(p=>p.id&&p.link_afiliado&&norm(p.link_afiliado)===link);
   if(!product)return;
   productId=product.id;
  }
  const ir=await fetch(api+'produto_imagens?select=image_url,ordem&produto_id=eq.'+encodeURIComponent(productId)+'&order=ordem.asc',{headers,cache:'no-store'});
  if(!ir.ok)throw new Error('Galeria HTTP '+ir.status);
  const rows=await ir.json(),urls=[...new Set(rows.map(x=>x.image_url).filter(Boolean))];
  if(!urls.length)return;
  const alt=main.alt||document.querySelector('h1')?.textContent||'Foto do produto',counter=document.getElementById('photo-counter'),fallback=main.nextElementSibling;
  thumbs.replaceChildren();let current=0;
  const show=i=>{
   current=(i+urls.length)%urls.length;main.hidden=false;main.src=urls[current];main.alt=alt;
   if(fallback)fallback.style.display='none';
   [...thumbs.children].forEach((b,n)=>{b.classList.toggle('active',n===current);b.setAttribute('aria-pressed',n===current?'true':'false')});
   if(counter)counter.textContent='Foto '+(current+1)+' de '+urls.length;
  };
  urls.forEach((url,i)=>{
   const b=document.createElement('button');b.type='button';b.className='thumb'+(i===0?' active':'');b.setAttribute('aria-label','Ver foto '+(i+1));b.setAttribute('aria-pressed',i===0?'true':'false');
   const im=document.createElement('img');im.src=url;im.alt='';im.loading='lazy';b.append(im);b.addEventListener('click',()=>show(i));thumbs.append(b);
  });
  show(0);
  let controls=thumbs.parentElement.querySelector('.dynamic-gallery-controls');
  if(!controls){controls=document.createElement('div');controls.className='dynamic-gallery-controls';controls.style.cssText='display:flex;gap:8px;margin:4px 0 8px';thumbs.parentElement.insertBefore(controls,thumbs)}
  controls.replaceChildren();
  [['‹ Anterior',()=>show(current-1)],['Próxima ›',()=>show(current+1)]].forEach(([label,fn])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='border:0;border-radius:9px;background:#fff9ed;color:#8f1728;padding:9px 13px;font-weight:800;cursor:pointer';b.addEventListener('click',fn);controls.append(b)});
  console.info('[MarQ] Galeria da página de detalhes carregada:',urls.length);
 }catch(e){console.warn('[MarQ] Falha ao carregar fotos da galeria:',e)}
})();