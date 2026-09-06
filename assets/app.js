/* ===================== AMICONE — shared JS (v4 · Black & Fuchsia) ===================== */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* member bio toggle */
document.querySelectorAll('.member .more').forEach(m=>m.addEventListener('click',()=>{
  const card=m.closest('.member');card.classList.toggle('open');
  m.textContent=card.classList.contains('open')?'− CLOSE':'+ MORE';
}));

/* lightbox */
const lb=document.getElementById('lb'),lbimg=document.getElementById('lbimg');
if(lb){
  document.querySelectorAll('.pcard img').forEach(img=>img.addEventListener('click',()=>{lbimg.src=img.src;lbimg.alt=img.alt;lb.classList.add('open')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')});
}

/* mobile menu */
(function(){
  const b=document.getElementById('burger'),m=document.getElementById('mnav');if(!b||!m)return;
  b.addEventListener('click',()=>{m.classList.toggle('open');b.classList.toggle('x');document.body.style.overflow=m.classList.contains('open')?'hidden':''});
})();

/* booking form → mail app */
function sendMail(f){
  const email=f.email?f.email.value:'',phone=f.phone?f.phone.value:'';
  const s=encodeURIComponent('[공연 섭외 문의 / Booking Inquiry] '+f.who.value);
  const b=encodeURIComponent('성함/소속 (Name/Org): '+f.who.value+'\n이메일 (Email): '+email+'\n연락처 (Phone): '+phone+'\n공연 유형 (Type): '+f.type.value+'\n희망 일시·장소 (Date/Venue): '+f.when.value+'\n\n문의 내용 (Message):\n'+f.msg.value);
  location.href='mailto:amicone5@naver.com?subject='+s+'&body='+b;
  return false;
}

/* ===================== background music (all pages) ===================== */
const bgm=document.getElementById('bgm'),sndBtn=document.getElementById('sndBtn');
let sndFade=null,bgmOK=false;
if(bgm){
  // 파일이 있을 때만 버튼 노출 (bgm.mp3 없으면 조용히 숨김)
  fetch('assets/bgm.mp3',{method:'HEAD'}).then(r=>{if(r.ok){bgmOK=true;sndBtn&&sndBtn.classList.add('show');sndResume()}else bgmMissing()}).catch(bgmMissing);
}
function bgmMissing(){const s=document.getElementById('enterSub');if(s)s.remove()}
function sndFadeTo(v,ms,done){clearInterval(sndFade);const from=bgm.volume,t0=performance.now();sndFade=setInterval(()=>{const p=Math.min(1,(performance.now()-t0)/ms);bgm.volume=from+(v-from)*p;if(p>=1){clearInterval(sndFade);done&&done()}},50)}
function sndOn(quick){if(!bgm||!bgmOK)return;bgm.volume=quick?.1:0;const pr=bgm.play();if(pr&&pr.catch)pr.catch(()=>{sndBtn&&sndBtn.classList.remove('on');const once=()=>{document.removeEventListener('pointerdown',once);sndOn()};document.addEventListener('pointerdown',once)});sndBtn&&sndBtn.classList.add('on');if(!quick)sndFadeTo(.1,3000);try{localStorage.setItem('amicone-snd','on')}catch(e){}}
function sndOff(){if(!bgm)return;sndBtn&&sndBtn.classList.remove('on');sndFadeTo(0,900,()=>bgm.pause());try{localStorage.setItem('amicone-snd','off')}catch(e){}}
if(sndBtn)sndBtn.addEventListener('click',()=>{(bgm.paused||sndFade&&bgm.volume<.05)?sndOn():sndOff()});
function sndSave(){try{sessionStorage.setItem('amicone-t',bgm.paused?'':bgm.currentTime);sessionStorage.setItem('amicone-at',Date.now())}catch(e){}}
if(bgm){bgm.addEventListener('timeupdate',sndSave);window.addEventListener('pagehide',sndSave);document.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',sndSave))}
function sndResume(){let pref='',t='';try{pref=localStorage.getItem('amicone-snd')||'';t=sessionStorage.getItem('amicone-t')||''}catch(e){}
  if(pref==='off'||t===''||document.getElementById('intro'))return;let at=0;try{at=parseFloat(sessionStorage.getItem('amicone-at'))||0}catch(e){}
  const gap=at?Math.min(8,Math.max(0,(Date.now()-at)/1000)):0;const tt=(parseFloat(t)||0)+gap;const seek=()=>{try{bgm.currentTime=bgm.duration?tt%bgm.duration:tt}catch(e){}};
  if(bgm.readyState>=1)seek();else bgm.addEventListener('loadedmetadata',seek,{once:true});
  sndOn(true);setTimeout(()=>{if(bgm.paused){const h=document.getElementById('sndHint');if(h){h.classList.add('show');setTimeout(()=>h.classList.remove('show'),5000)}}},1200)}

/* ===================== home: ENTER intro + slideshow ===================== */
let SL_I=0;
(function(){
  const box=document.getElementById('sl');if(!box)return;
  const imgs=[...box.querySelectorAll('img')],bar=document.getElementById('slBar');let timer=null;const DUR=7000;
  function ensure(k){k=(k+imgs.length)%imgs.length;const im=imgs[k];if(im.dataset.src){im.src=im.dataset.src;delete im.dataset.src}}
  ensure(1);
  function go(n,manual){imgs[SL_I].classList.remove('on');SL_I=(n+imgs.length)%imgs.length;imgs[SL_I].classList.add('on');ensure(SL_I+1);
    document.getElementById('slN').textContent=SL_I+1;bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run');if(manual)restart()}
  function restart(){clearInterval(timer);timer=setInterval(()=>go(SL_I+1),DUR)}
  document.getElementById('slPrev').addEventListener('click',()=>go(SL_I-1,true));
  document.getElementById('slNext').addEventListener('click',()=>go(SL_I+1,true));
  let tx=null;box.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
  box.addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)go(dx<0?SL_I+1:SL_I-1,true);tx=null},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(SL_I+1,true);if(e.key==='ArrowLeft')go(SL_I-1,true)});
  document.addEventListener('visibilitychange',()=>{document.hidden?clearInterval(timer):restart()});
  window.slStart=function(){bar.classList.add('run');restart()};window.slStop=function(){clearInterval(timer)};
})();
(function(){
  const intro=document.getElementById('intro');
  function open(){intro.classList.add('done');document.body.classList.add('ready');window.slStart&&slStart();setTimeout(()=>intro.remove(),1500);try{sessionStorage.setItem('amicone-intro','1')}catch(e){}
    if(bgmOK)sndOn()}
  if(intro){
    let seen=false;try{seen=sessionStorage.getItem('amicone-intro')==='1'}catch(e){}
    if(seen){intro.remove();document.body.classList.add('ready');window.slStart&&slStart()}
    else document.getElementById('enterBtn').addEventListener('click',open);
  }else requestAnimationFrame(()=>document.body.classList.add('ready'));
})();

/* ===================== i18n (KO = DOM snapshot, EN, IT) ===================== */
let LANG='ko';
const KO={};
const T={
en:{
 n3:'Performances',
 h1:'A friendship forged in Italy,<br>carried onto <b>one stage</b>.',
 sl_cap:'Studio, 2025',
 q_ko:'A friend closer than a friend — true friendship bound by music is the heart of Amicone.',
 q_src:"<b>Lobby Concert 'You Shall Bloom'</b> · 3 Sep 2026 · Suseong Artpia Grand Theatre Lobby",
 f_contact:'Contact',
 snd_hint:'♪ Press the top button to turn on sound',
 h_lede:'From an invited stage in the Philippines in 2025 to Daegu Opera House and Suseong Artpia — the stages Amicone has walked.',
 y_now:'Now',
 y_start:'First stages',
 hc26:'3 Sep 2026, Suseong Artpia',
 hc25:'16 Dec 2025, Daegu Opera House',
 p_lede:'Posters from each stage, and the moments the camera caught. Click any image to enlarge.',
 sk_h2:'Posters',
 os_h2:'On Stage',
 oc1:'Suseong Artpia Grand Theatre Lobby — four voices',
 oc2:'Applause',
 oc3:'Curtain call',
 oc4:'After the concert',
 m_lede:'Five artists who studied voice together in Italy — soprano, mezzo-soprano, tenor, baritone and piano.',
 en_src:'Studio · 2025',
 c_lede2:'Opera galas and concerts, corporate and institutional events, celebrations and festivals.',
 n1:'About',n2:'History',n4:'Members',n5:'Booking',
 h_sub:'A friendship forged in Italy, brought to one stage',h_badge:'Soloist Ensemble · Opera Singers',
 a_h2:"Like our name — Italian for <b>'a true friend'</b> —<br>we build one stage together,<br>as musical companions and friends for life.",
 a_p1:"<strong>'Amicone'</strong> derives from the Italian word 'amico' (friend) and means far more than an acquaintance: a close, true friend who shares from the heart. The ensemble was formed by singers who studied voice together in Italy and shared a deep bond through music and life. True to its name, Amicone creates one stage as musical companions and lifelong friends.",
 a_p2:"The members — <strong>soprano, mezzo-soprano, tenor and baritone</strong> together with <strong>piano (opera coach)</strong> — are artists whose abilities have been proven on major stages at home and abroad and at prestigious international voice competitions. The harmony of their distinct colours and personalities embodies Amicone's philosophy: to convey the deep emotion and refined expression of classical music to the audience.",
 a_p3:"Sincerity toward music, and true friendship bound by music, are at the heart of Amicone. Through diverse concerts and artistic activities, the ensemble continues to grow, communicating candidly with audiences, sharing the beauty of classical music and leading warm artistic exchange.",
 s_mem:'Members',s_voice:'Voice Types',s_ctry:'Countries Performed',s_prize:'Int\'l Competition Prizes',
 f_name_t:'Name',f_name:'AMICONE Opera Singers',f_rep_t:'General Director',f_rep:'Kil Kyungnam (Baritone)',f_comp_t:'Formation',f_comp:'Soprano · Mezzo-soprano · Tenor · Baritone · Piano',f_base_t:'Based in',f_base:'Daegu · Gyeongbuk and nationwide',f_mail_t:'Email · SNS',
 q_text:'"Amico più che amico."<br>A friend closer than a friend — true friendship bound by music is the heart of Amicone.',
 exp_h2:'Explore',exp_lead:'Discover Amicone',exp2:'The stages Amicone has walked',exp3:'Posters and moments on stage',exp4:'The artists of Amicone',exp5:'Invite Amicone to your stage',en_cap1:'Five colours, one stage',en_cap2:'Friends who met in Italy',en_lede:'Each with a colour of their own, they make one sound under the name Amicone.',exp_view:'VIEW',
 foot:'Booking 010-6417-9634 · amicone5@naver.com<br>© 2026 AMICONE Opera Singers',
 hist_h2:'History',sk_h2:'Sketches',sk_note:'Click an image to enlarge',
 b26:"Suseong Artpia <b>Lobby Concert 'You Shall Bloom'</b> · Library Cool-Classic <b>'A Midsummer Journey of Song'</b>",
 d26_1:"2026 Suseong Renaissance Project Lobby Concert 'You Shall Bloom' (3 Sep 2026, Suseong Artpia Grand Theatre Lobby · hosted by Suseong Artpia, organised by Daegu Music Association)",
 d26_2:"Library Cool-Classic: A Midsummer Journey of Song — AMICONE with Ensemble BOAZ (30 Jul 2026, Suseong Beomeo Library Kim Man-yong · Park Su-nyeon Hall · 2026 Suseong Cultural Foundation arts group support programme)",
 b25:"Daegu Opera House Patrons' Night <b>'Opera day'</b> · Invited to the <b>Hallyu Korea-Philippines Cultural Exchange Fiesta</b>, Philippines",
 d25_1:"Daegu Opera House Patrons' Night: Christmas Special Concert 'Opera day' — with DIO Orchestra (16 Dec 2025, Daegu Opera House)",
 d25_2:"Hallyu Korea-Philippines Cultural Exchange Fiesta in Iligan — K Classic Team Amicone (24 Sep 2025, Iligan, Philippines · Hallyu Week)",
 d25_3:"Hallyu Korea-Philippines Cultural Exchange Fiesta in Villanueva — K Classic Team Amicone (23 Sep 2025, Villanueva, Misamis Oriental, Philippines)",
 p:["Lobby Concert 'You Shall Bloom'","Library Cool-Classic 'A Midsummer Journey of Song'","Daegu Opera House 'Opera day'","Hallyu Fiesta in Iligan · Philippines","Hallyu Fiesta in Villanueva · Philippines"],
 mn:['Kil Kyungnam','Jeon Minkeung','Lee Jaeyeong','An Sejoon','Kang Kyungshin'],
 mt:['General Director','Soprano','Mezzo-soprano','Tenor','Music Coach · Piano'],
 mb:[
  ["B.M. in Voice, Anyang University","Biennio, Conservatorio 'G. Nicolini' di Piacenza, Italy","Diplomas in choral conducting and musical theatre, Accademia Mariano Comense, Como, Italy","Academy of Teatro Coccia di Novara","Alto perfezionamento (opera), Istituto Musicale 'Vallotti' di Vercelli, Italy","Special Prize, Cappuccilli–Patanè–Respighi International Voice Competition","Prizewinner at the Enzo Sordello, Valsesia Musica, Ismaele Voltolini (Italy) and Lousada (Portugal) international competitions, among others","Debut as Conte di Luna in <Il trovatore> at Teatro Civico di Vercelli, Italy","Leading and supporting roles in <La traviata>, <Gianni Schicchi>, <La forza del destino> and <Carmen> in Korea","Currently General Director of the soloist ensemble Amicone and active as a professional singer"],
  ["B.M. in Voice, Daegu Catholic University; graduate studies at the same university","Biennio, Conservatorio 'G. Nicolini' di Piacenza, Italy","Diplomas in choral conducting and musical theatre, Accademia Mariano Comense, Como, Italy","Alto perfezionamento (opera), Istituto Musicale 'Vallotti' di Vercelli, Italy","Prizewinner at the Cappuccilli, Valsesia and Marmo all'Opera international competitions, among others","Debut as Leonora in <Il trovatore> at the Teatro di Vercelli, Italy","Masterclass with the renowned baritone Leo Nucci; concert at Teatro alle Vigne di Lodi, Italy","Currently teaching at Gyeongbuk Arts High School and active as a professional singer"],
  ["B.M. and M.M. in Voice, Keimyung University College of Music and Performing Arts","Graduate of the Conservatorio 'G. Verdi' di Milano, Italy","Alto perfezionamento (opera), Istituto Musicale 'Vallotti' di Vercelli, Italy","2nd Prize Béziers (France), 3rd Prize Bellano (Italy), Special Prize Giuditta Pasta (Italy) and other international competition awards","Guest soloist with the Orchestra 'Arpeggione', Hohenems, Austria","Leading and supporting roles in <Il trovatore>, <Nabucco>, <Madama Butterfly>, <Hänsel und Gretel>, <Faust>, <Le nozze di Figaro> and <Rigoletto>","Leading and supporting roles in opera gala concerts of <Carmen>, <Cavalleria rusticana>, <L'amico Fritz> and <La traviata>","Currently teaching at Gyeongbuk Arts High School and Keimyung University; active as a professional singer"],
  ["B.M. in Voice and M.M., Keimyung University College of Music and Performing Arts","Biennio, Conservatorio 'G. Nicolini' di Piacenza, Italy","2nd Prize The Voice of Kamen (Bulgaria), 1st Prize Gianni Poggi (Italy), 1st Prize Arturo Toscanini (Italy) and other international competition prizes and wins","Capri Opera Festival Invitation Award, Davide Gaetano International Competition","Leading roles in <Il trovatore>, <Turandot> and <Cavalleria rusticana> at Teatro Coccia di Novara (Italy), Astana Opera (Kazakhstan) and Teatro di Vercelli (Italy)","Debut as Calaf in <Turandot> at Teatro di San Carlo Naples, Teatro Filarmonico Verona, Auditorium Conciliazione Rome and Auditorium Parco della Musica","Guest soloist, 8 Tenors Concert, Szczecin, Poland","Formerly with Italian management meopera","Currently active as a professional singer in theatres at home and abroad"],
  ["B.M. and M.M. in Piano, Keimyung University College of Music and Performing Arts","Opera coaching diploma, Conservatorio di Milano, Italy","Opera and chorus pianist, Teatro Municipale di Piacenza, Italy","Pianist for numerous operas including <La bohème>, <Nabucco>, <Don Carlo> and <La traviata>","Concerts and recitals with Richard Bonynge, Aprile Millo and others in Spain, Milan, Busseto and Tuscany","2nd Prize Arona International Competition · 3rd Prize Massa International Competition, Italy","Prizewinner, chamber music division, Clara Schumann International Competition","Over 100 performances of contemporary and newly commissioned works","Currently teaching voice at Gyeongbuk Arts High School · Music coach, Honam Opera Company · Co-director, Ensemble BOAZ"]
 ],
 c_lede:'Sincerity carried by song, friendship on stage. Invite Amicone to your occasion.',c_desc:'We fill the room with a resonance only a vocal ensemble can give, and tailor solo, duet or full-ensemble programmes to your scale and budget.',
 cl1:'Director',c_rep:'Kil Kyungnam (Baritone)',cl2:'Phone',cl3:'Email',cl4:'Formation',c_comp:'Soprano · Mezzo-soprano · Tenor · Baritone · Piano',cl5:'Based in',c_area:'Daegu · Gyeongbuk and nationwide',
 fm_who:'Name / Organisation',fm_who_ph:'Jane Doe / ABC Foundation',fm_email:'Email (for reply)',fm_email_ph:'you@example.com',fm_phone:'Phone',fm_phone_ph:'+82 10-0000-0000',fm_type:'Type of event',o1:'Curated concert',o2:'Opera gala',o3:'Corporate / institutional event',o4:'Celebratory performance',o5:'Festival invitation',o6:'Other',fm_when:'Preferred date · venue',fm_when_ph:'December 2026 / Daegu',fm_msg:'Message',fm_msg_ph:'Please describe the scale, budget and programme preferences.',fm_note:'※ Clicking SEND opens your mail app with the message pre-filled.'
},
it:{
 n3:'Concerti',
 h1:"Un'amicizia nata in Italia,<br>portata su <b>un unico palcoscenico</b>.",
 sl_cap:'Studio, 2025',
 q_ko:'Un amico più vicino di un amico: la vera amicizia nata dalla musica è il cuore di Amicone.',
 q_src:"<b>Lobby Concert 'Tu fiorirai'</b> · 3 set 2026 · Foyer del Grande Teatro Suseong Artpia",
 f_contact:'Contatti',
 snd_hint:'♪ Premi il pulsante in alto per attivare l\'audio',
 h_lede:'Da un palco su invito nelle Filippine nel 2025 al Daegu Opera House e al Suseong Artpia: i palcoscenici di Amicone.',
 y_now:'Oggi',
 y_start:'I primi palchi',
 hc26:'3 set 2026, Suseong Artpia',
 hc25:'16 dic 2025, Daegu Opera House',
 p_lede:'Le locandine di ogni concerto e i momenti catturati dalla macchina fotografica. Clicca per ingrandire.',
 sk_h2:'Locandine',
 os_h2:'Sul palco',
 oc1:'Foyer del Grande Teatro Suseong Artpia — quattro voci',
 oc2:'Applausi',
 oc3:'Chiamata alla ribalta',
 oc4:'Dopo il concerto',
 m_lede:'Cinque artisti che hanno studiato canto insieme in Italia: soprano, mezzosoprano, tenore, baritono e pianoforte.',
 en_src:'Studio · 2025',
 c_lede2:'Gala lirici e concerti, eventi aziendali e istituzionali, celebrazioni e festival.',
 n1:'Chi siamo',n2:'Storia',n4:'Membri',n5:'Contatti',
 h_sub:"Un'amicizia nata in Italia, un unico palcoscenico",h_badge:'Ensemble di solisti · Cantanti lirici',
 a_h2:"Come il nostro nome — <b>'amicone'</b>, un amico vero —<br>costruiamo insieme un unico palcoscenico,<br>compagni di musica e amici per la vita.",
 a_p1:"<strong>'Amicone'</strong> deriva dalla parola italiana 'amico' e indica molto più di una semplice conoscenza: un amico stretto e sincero, con cui si condivide il cuore. L'ensemble è nato dall'incontro di cantanti che hanno studiato canto insieme in Italia, condividendo un profondo legame attraverso la musica e la vita. Fedele al suo nome, Amicone crea un unico palcoscenico come compagni di musica e amici per la vita.",
 a_p2:"I membri — <strong>soprano, mezzosoprano, tenore e baritono</strong> insieme al <strong>pianoforte (maestro collaboratore)</strong> — sono artisti che hanno dimostrato il proprio valore sui principali palcoscenici in Corea e all'estero e in prestigiosi concorsi lirici internazionali. L'armonia dei loro colori e delle loro personalità diverse incarna la filosofia di Amicone: trasmettere al pubblico la profonda emozione e la raffinata espressività della musica classica.",
 a_p3:"La sincerità verso la musica e la vera amicizia nata dalla musica sono il cuore di Amicone. Attraverso concerti e attività artistiche di ogni genere, l'ensemble continua a crescere, dialogando con il pubblico in modo autentico, diffondendo il fascino della musica classica e promuovendo un caloroso scambio artistico.",
 s_mem:'Membri',s_voice:'Registri vocali',s_ctry:'Paesi',s_prize:'Premi internazionali',
 f_name_t:'Nome',f_name:'AMICONE Opera Singers',f_rep_t:'Direttore generale',f_rep:'Kil Kyungnam (baritono)',f_comp_t:'Formazione',f_comp:'Soprano · Mezzosoprano · Tenore · Baritono · Pianoforte',f_base_t:'Sede',f_base:'Daegu · Gyeongbuk e tutta la Corea',f_mail_t:'E-mail · Social',
 q_text:'"Amico più che amico."<br>Un amico più vicino di un amico: la vera amicizia nata dalla musica è il cuore di Amicone.',
 exp_h2:'Esplora',exp_lead:'Scopri Amicone',exp2:'I palcoscenici di Amicone',exp3:'Locandine e momenti sul palco',exp4:'Gli artisti di Amicone',exp5:'Invita Amicone sul tuo palcoscenico',en_cap1:'Cinque colori, un solo palcoscenico',en_cap2:'Amici incontrati in Italia',en_lede:'Ognuno con il proprio colore, creano un unico suono sotto il nome Amicone.',exp_view:'VEDI',
 foot:'Contatti 010-6417-9634 · amicone5@naver.com<br>© 2026 AMICONE Opera Singers',
 hist_h2:'Storia',sk_h2:'Locandine',sk_note:"Clicca su un'immagine per ingrandirla",
 b26:"Suseong Artpia <b>Lobby Concert 'Tu fiorirai'</b> · Library Cool-Classic <b>'Viaggio di mezza estate nel canto'</b>",
 d26_1:"Progetto Rinascimento Suseong 2026, Lobby Concert 'Tu fiorirai' (3 set 2026, foyer del Grande Teatro Suseong Artpia · organizzato da Suseong Artpia e Associazione Musicale di Daegu)",
 d26_2:"Library Cool-Classic: Viaggio di mezza estate nel canto — AMICONE con Ensemble BOAZ (30 lug 2026, Biblioteca Beomeo di Suseong, Sala Kim Man-yong · Park Su-nyeon · programma di sostegno 2026 della Fondazione Culturale Suseong)",
 b25:"Serata dei sostenitori del Daegu Opera House <b>'Opera day'</b> · Invito alla <b>Hallyu Korea-Philippines Cultural Exchange Fiesta</b>, Filippine",
 d25_1:"Serata dei sostenitori del Daegu Opera House: concerto speciale di Natale 'Opera day' — con la DIO Orchestra (16 dic 2025, Daegu Opera House)",
 d25_2:"Hallyu Korea-Philippines Cultural Exchange Fiesta a Iligan — K Classic Team Amicone (24 set 2025, Iligan, Filippine · Hallyu Week)",
 d25_3:"Hallyu Korea-Philippines Cultural Exchange Fiesta a Villanueva — K Classic Team Amicone (23 set 2025, Villanueva, Misamis Oriental, Filippine)",
 p:["Lobby Concert 'Tu fiorirai'","Library Cool-Classic 'Viaggio di mezza estate nel canto'","Daegu Opera House 'Opera day'","Hallyu Fiesta a Iligan · Filippine","Hallyu Fiesta a Villanueva · Filippine"],
 mn:['Kil Kyungnam','Jeon Minkeung','Lee Jaeyeong','An Sejoon','Kang Kyungshin'],
 mt:['Direttore generale','Soprano','Mezzosoprano','Tenore','Maestro collaboratore · Pianoforte'],
 mb:[
  ["Laurea in canto, Anyang University","Biennio, Conservatorio 'G. Nicolini' di Piacenza","Diplomi in direzione di coro e musical, Accademia Mariano Comense, Como","Accademia del Teatro Coccia di Novara","Alto perfezionamento in opera, Istituto Musicale 'Vallotti' di Vercelli","Premio speciale, Concorso internazionale Cappuccilli–Patanè–Respighi","Premiato ai concorsi internazionali Enzo Sordello, Valsesia Musica, Ismaele Voltolini (Italia) e Lousada (Portogallo), tra gli altri","Debutto come Conte di Luna in <Il trovatore> al Teatro Civico di Vercelli","Ruoli principali e comprimari in <La traviata>, <Gianni Schicchi>, <La forza del destino> e <Carmen> in Corea","Attualmente direttore generale dell'ensemble di solisti Amicone e cantante professionista"],
  ["Laurea in canto, Daegu Catholic University; studi post-laurea presso la stessa università","Biennio, Conservatorio 'G. Nicolini' di Piacenza","Diplomi in direzione di coro e musical, Accademia Mariano Comense, Como","Alto perfezionamento in opera, Istituto Musicale 'Vallotti' di Vercelli","Premiata ai concorsi internazionali Cappuccilli, Valsesia e Marmo all'Opera, tra gli altri","Debutto come Leonora in <Il trovatore> al Teatro di Vercelli","Masterclass con il celebre baritono Leo Nucci; concerto al Teatro alle Vigne di Lodi","Attualmente docente presso la Gyeongbuk Arts High School e cantante professionista"],
  ["Laurea e specializzazione in canto, Keimyung University College of Music and Performing Arts","Diploma del Conservatorio 'G. Verdi' di Milano","Alto perfezionamento in opera, Istituto Musicale 'Vallotti' di Vercelli","2º premio Béziers (Francia), 3º premio Bellano (Italia), premio speciale Giuditta Pasta (Italia) e altri riconoscimenti internazionali","Solista ospite con l'Orchestra 'Arpeggione', Hohenems, Austria","Ruoli principali e comprimari in <Il trovatore>, <Nabucco>, <Madama Butterfly>, <Hänsel und Gretel>, <Faust>, <Le nozze di Figaro> e <Rigoletto>","Ruoli principali e comprimari in concerti di gala di <Carmen>, <Cavalleria rusticana>, <L'amico Fritz> e <La traviata>","Attualmente docente presso la Gyeongbuk Arts High School e la Keimyung University; cantante professionista"],
  ["Laurea in canto e specializzazione, Keimyung University College of Music and Performing Arts","Biennio, Conservatorio 'G. Nicolini' di Piacenza","2º premio The Voice of Kamen (Bulgaria), 1º premio Gianni Poggi (Italia), 1º premio Arturo Toscanini (Italia) e altri premi e vittorie internazionali","Premio invito al Capri Opera Festival, Concorso internazionale Davide Gaetano","Ruoli principali in <Il trovatore>, <Turandot> e <Cavalleria rusticana> al Teatro Coccia di Novara, all'Astana Opera (Kazakistan) e al Teatro di Vercelli","Debutto come Calaf in <Turandot> al Teatro di San Carlo di Napoli, Teatro Filarmonico di Verona, Auditorium Conciliazione di Roma e Auditorium Parco della Musica","Solista ospite, concerto degli 8 Tenori, Stettino, Polonia","Già artista del management italiano meopera","Attualmente cantante professionista in teatri in Corea e all'estero"],
  ["Laurea e specializzazione in pianoforte, Keimyung University College of Music and Performing Arts","Diploma in maestro collaboratore d'opera, Conservatorio di Milano","Pianista d'opera e di coro, Teatro Municipale di Piacenza","Pianista in numerose opere tra cui <La bohème>, <Nabucco>, <Don Carlo> e <La traviata>","Concerti e recital con Richard Bonynge, Aprile Millo e altri in Spagna, a Milano, Busseto e in Toscana","2º premio Concorso internazionale di Arona · 3º premio Concorso internazionale di Massa","Premiato nella sezione musica da camera, Concorso internazionale Clara Schumann","Oltre 100 esecuzioni di musica contemporanea e nuove composizioni","Attualmente docente di canto presso la Gyeongbuk Arts High School · maestro collaboratore, Honam Opera Company · co-direttore, Ensemble BOAZ"]
 ],
 c_lede:'La sincerità del canto, l\'amicizia sul palco. Invitate Amicone alla vostra occasione.',c_desc:'Riempiamo la sala con una risonanza che solo un ensemble vocale può dare, con programmi da solista, in duo o d\'insieme su misura per dimensioni e budget.',
 cl1:'Direttore',c_rep:'Kil Kyungnam (baritono)',cl2:'Telefono',cl3:'E-mail',cl4:'Formazione',c_comp:'Soprano · Mezzosoprano · Tenore · Baritono · Pianoforte',cl5:'Sede',c_area:'Daegu · Gyeongbuk e tutta la Corea',
 fm_who:'Nome / Organizzazione',fm_who_ph:'Mario Rossi / Fondazione ABC',fm_email:'E-mail (per la risposta)',fm_email_ph:'tu@esempio.com',fm_phone:'Telefono',fm_phone_ph:'+82 10-0000-0000',fm_type:'Tipo di evento',o1:'Concerto a tema',o2:'Gala lirico',o3:'Evento aziendale / istituzionale',o4:'Esibizione celebrativa',o5:'Invito a festival',o6:'Altro',fm_when:'Data · luogo desiderati',fm_when_ph:'Dicembre 2026 / Daegu',fm_msg:'Messaggio',fm_msg_ph:'Descrivi dimensioni dell\'evento, budget e preferenze di programma.',fm_note:"※ Premendo SEND si apre l'app di posta con il messaggio precompilato."
}
};
function DICT(){return LANG==='ko'?KO:Object.assign({},T.en,T[LANG]||{});}
function buildSnapshot(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{KO[el.dataset.i18n]=el.innerHTML});
  document.querySelectorAll('[data-ph]').forEach(el=>{KO[el.dataset.ph]=el.placeholder});
  KO.mn=[...document.querySelectorAll('.member-grid .member h3')].map(e=>e.textContent);
  KO.mt=[...document.querySelectorAll('.member-grid .member .title')].map(e=>e.textContent);
  KO.mb=[...document.querySelectorAll('.member-grid .member')].map(m=>[...m.querySelectorAll('li')].map(li=>li.textContent));
  KO.p=[...document.querySelectorAll('#posters .poster-grid .cap .t')].map(e=>e.textContent);
}
function setLang(l){
  LANG=l;const d=DICT();
  document.documentElement.lang=l;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const v=d[el.dataset.i18n];if(v!==undefined)el.innerHTML=v});
  document.querySelectorAll('[data-ph]').forEach(el=>{const v=d[el.dataset.ph];if(v!==undefined)el.placeholder=v});
  document.querySelectorAll('.member-grid .member').forEach((m,i)=>{
    if(d.mn&&d.mn[i])m.querySelector('h3').textContent=d.mn[i];
    if(d.mt&&d.mt[i])m.querySelector('.title').textContent=d.mt[i];
    if(d.mb&&d.mb[i]){const lis=[...m.querySelectorAll('li')];lis.forEach((li,j)=>{if(d.mb[i][j])li.textContent=d.mb[i][j]})}
  });
  document.querySelectorAll('#posters .poster-grid .cap .t').forEach((e,i)=>{if(d.p&&d.p[i])e.textContent=d.p[i]});
  const sel=document.getElementById('langSel');if(sel&&sel.value!==l)sel.value=l;
  try{localStorage.setItem('amicone-lang',l)}catch(e){}
}
buildSnapshot();
try{const saved=localStorage.getItem('amicone-lang');if(saved&&saved!=='ko')setLang(saved)}catch(e){}
