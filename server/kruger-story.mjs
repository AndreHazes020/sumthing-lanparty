// Original arcade dialogue inspired by Guido's brief. These are invented lines, not real quotations.
import {MAP,distance} from './map.mjs';
const scene=(id,chapter,name,role,at,look,lines,question,choices,challenge=null)=>({id,chapter,name,role,...at,look,lines,question,choices,challenge});
const choice=(text,reply,item)=>({text,reply,item});
export const ENCOUNTERS=[
 scene('guido',0,'Guido','Founder. Currently also facilities.',{x:426,y:582},'cap',[
  'Welcome to our first office. We have natural light, natural ventilation, and a door that naturally does not close.',
  'The budget is €12 and an extension cable. What should go on the door?'
 ],'Our first official office sign?',[
  choice('SUMTHING — probably a real company','Perfect. Confident, but legally a question mark.','A probably-official office sign'),
  choice('Do not feed the founders','Good. The neighbours have already left three croissants and a printer cartridge.','A founder feeding schedule'),
  choice('Nature restoration. Door restoration pending.','Finally. A mission statement with an honest roadmap.','The honest mission statement')
 ]),
 scene('housemate',0,'The unexpected housemate','Has been here longer than the Wi-Fi.',{x:371,y:635},'beanie',[
  'An unexpected housemate is sitting on a mattress, conducting what appears to be a very relaxed board meeting.',
  '“You are starting a company? In THIS economy? I was using this room to not do that.”'
 ],'How do we negotiate the move?',[
  choice('Offer the honorary title Chief Nap Officer','“No salary, no responsibilities, no meetings? This is the best job I have ever had.” They take their mattress and an honorary business card.','Chief Nap Officer’s business card'),
  choice('Explain our five-year growth strategy','Three slides in, they quietly leave. Guido writes “PowerPoint” under security expenses.','A surprisingly effective pitch deck'),
  choice('Tell them the room is now hot-desking','“So nobody owns a desk AND everyone complains? I refuse to live in a consultancy.”','The world’s first anti-hot-desking policy')
 ],{verb:'RAISE THE SHUTTER',text:'Everyone tap together. This door has not opened since the previous business model.',result:'The shutter opens. The office is officially open to both business and draughts.'}),
 scene('seller',1,'The Marktplaats oracle','“Is this still available?” is a lifestyle.',{x:443,y:329},'cap',[
  '“FREE office chair. Pickup only. No questions. No sitting on it before purchase.”',
  'You have arrived. The chair has one wheel, two previous owners, and the energy of a middle manager.'
 ],'What is our negotiation strategy?',[
  choice('Offer €0, but with enormous confidence','“Sold. Honestly, the confidence was worth more than the chair.” Guido lists it as a leadership investment.','The confidence chair'),
  choice('Ask whether the missing wheels are remote workers','“They are hybrid.” The seller throws in a bag containing one completely unrelated wheel.','A hybrid-working chair'),
  choice('Trade an inspiring sustainability pitch','The seller agrees, provided nobody says “synergy” while carrying it downstairs.','The synergy-free chair')
 ]),
 scene('sofa',1,'The sofa situation','A furnishing. An obstacle. A team exercise.',{x:426,y:607},'sofa',[
  'The sofa is 180 cm wide. The doorway is 79 cm wide. Guido believes in potential.',
  'Someone says “PIVOT.” Nobody has moved. Someone else opens a spreadsheet.'
 ],'What is the approved moving technique?',[
  choice('Rotate the sofa. Keep the spreadsheet flat.','An excellent compromise between physical reality and office culture.','A sofa with a pivot strategy'),
  choice('Call it a standing meeting and leave it outside','The group spends 12 seconds enjoying a very spacious office. Then it starts raining.','The briefly outdoor meeting room'),
  choice('Tell the doorway to embrace growth','The doorway declines. You rotate the sofa like people who have now learned something.','A growth-mindset sofa')
 ],{verb:'PIVOT!',text:'All phones, one sofa. Tap together to shuffle it through the doorway.',result:'It fits! Nobody remembers which way it was rotated. A company tradition is born.'}),
 scene('karima',2,'Karima','The square’s unofficial reception desk.',{x:381,y:550},'scarf',[
  '“So you restore nature? Lovely. Can you start with the plant in your window? It looks like it has received some difficult feedback.”',
  'Karima offers coffee. She also appears to know about a delivery you have not ordered yet.'
 ],'How do we introduce Sumthing?',[
  choice('A tiny company with a suspiciously large mission','“Good. Start with coffee. Nobody has ever restored anything useful before coffee.”','Karima’s emergency coffee'),
  choice('We are the people borrowing your extension cable','“I know. You have borrowed it since Tuesday. It has joined your company on LinkedIn.”','An extension cable with ambitions'),
  choice('We would like to sponsor the window plant’s recovery','“Excellent. I will send you a weekly impact report. With photos. And opinions.”','A very accountable window plant')
 ]),
 scene('hedi',2,'Hedi','One very small printing request.',{x:450,y:566},'glasses',[
  '“Can I print one thing? Very quick.” Hedi puts down a file called FINAL_final_REALFINAL_v8.pdf.',
  'It is 216 pages. The printer displays: PC LOAD LETTER. Guido checks whether that is a person from the square.'
 ],'How do we get this printed?',[
  choice('Turn it off and compliment it on the way back on','The printer makes a noise like a tiny tractor becoming self-aware. “Nice work ethic,” you whisper.','A printer performance review'),
  choice('Offer the printer a four-day week','It immediately prints a page saying PAPER JAM. Negotiations are progressing.','The printer’s collective labour agreement'),
  choice('Rename the file “tiny little document”','It prints one page. It is the file name. Nobody is technically wrong.','The tiny little document')
 ],{verb:'UNJAM!',text:'All phones to the rescue. Tap together to feed the printer’s endless appetite for A4.',result:'The last page emerges. It is a blank page with a header saying “intentionally left blank.”'}),
 scene('bbq',2,'The upstairs neighbour','Already has opinions about the menu.',{x:372,y:610},'scarf',[
  '“You work so hard downstairs. Come and eat something.” This sounds optional. It is not optional.',
  'The BBQ is ready. Six people said they were “not that hungry.” There is enough food for a regional conference.'
 ],'What do we bring?',[
  choice('One very small salad. For balance.','“Lovely, that will be the garnish.” A plate the size of a satellite dish appears.','A plate that does not believe in small portions'),
  choice('The office’s only chair','“Very thoughtful. The chair can also stay for dinner.” It gets fed before Guido does.','A chair with BBQ privileges'),
  choice('A 12-slide presentation about responsible charcoal','“Put that laptop away, schat.” It is the shortest all-hands in company history.','The twelve-slide table mat')
 ]),
 scene('boules',2,'The boules gentleman','Retired. Competitively.',{x:505,y:405},'hat',[
  '“You do nature restoration? I restore my lead every Thursday.” He gestures at two boules lying 3 mm apart.',
  'He offers to teach you. First lesson: you are standing in the wrong place. So is Guido. So is the pigeon.'
 ],'Our opening move?',[
  choice('Ask whether the boules have measurable impact','“Yes. Watch.” CLONK. A devastating answer backed by primary data.','A peer-reviewed boule'),
  choice('Tell him the pigeon is our strategy consultant','“Overpaid.” The pigeon leaves before the feedback round.','A vacant pigeon consultancy contract'),
  choice('Suggest a friendly, non-competitive game','He takes out a tape measure, two notebooks, and the expression of a man who has heard this joke before.','The friendly-game tape measure')
 ]),
 scene('applicant',3,'The Café Oost applicant','Availability: immediately. Balance: uncertain.',{x:474,y:597},'beanie',[
  '“Are you hiring? I have a lot of experience with the environment. I am outside most evenings.”',
  'You explain that the office is moving. “Great. I am very flexible. Is the van the new office?”'
 ],'How do we redirect this interview?',[
  choice('Offer the role of External External Affairs','“I can start outside right now.” Their commute is impressive.','An External External Affairs application'),
  choice('Request a CV on the back of a beer mat','They produce a three-part career history and a small diagram of a tree. Better prepared than expected.','The beer-mat CV'),
  choice('Ask them to guard the van as a practical assessment','They salute the van. The van is now receiving a much stronger onboarding than most new employees.','The van’s onboarding checklist')
 ]),
 scene('van',3,'Guido, again','Same founder. More furniture.',{x:374,y:519},'cap',[
  'Everything must fit in one van. The whiteboard says “be realistic” and is currently the least likely thing to fit.',
  'Next stop: the laboratory beside Hortus. First stop: deciding what goes in last.'
 ],'What is the most important thing to bring?',[
  choice('Karima’s extension cable. Finally return it first.','A rare company milestone: closing a task older than the company’s first pitch deck.','A returned extension cable'),
  choice('The chair. It has seniority.','Nobody challenges this. The chair has attended every meeting and never once asked for an update.','A chair with five years of service'),
  choice('The printer. Face it toward the wall so it cannot object.','It prints “LOW TONER.” Nobody gave it paper. Some things follow you forever.','A haunted but loyal printer')
 ],{verb:'LOAD THE VAN',text:'One last team effort. Tap together. Yes, the plant is coming too.',result:'The doors close. Sumthing leaves Krugerplein with a van full of furniture and an unreasonable number of stories.'})
 ,scene('basnoe',2,'Basnoe','Most things in stock. Office budget sold separately.',{x:467,y:180},'cap',[
  'The shopping list says: coffee, paper, financial stability. Two of these are available in the shop.',
  '“Would you like a receipt?” Guido says yes. The receipt is immediately longer than Sumthing’s business plan.'
 ],'What goes in the office emergency cupboard?',[
  choice('Coffee. Label it “critical infrastructure.”','For the first time, everyone agrees on an infrastructure investment without scheduling a meeting.','Critical-infrastructure coffee'),
  choice('Biscuits. For the unexpected stakeholders.','“How many stakeholders?” You look towards Café Oost. “Better make it the big box.”','The stakeholder biscuit reserve'),
  choice('A coin jar called “Series A.”','You raise €3.40 and a button. Guido announces that the round was oversubscribed.','The €3.40 funding round')
 ])
 ,scene('police',2,'The neighbourhood officer','Knows which door the printer lives behind.',{x:565,y:553},'hat',[
  '“Everything all right here?” You explain the loud grinding noise is the printer. The officer looks unconvinced. So do you.',
  '“And the sofa on the pavement?” You explain that it is between meetings.'
 ],'What do we put in the neighbourhood report?',[
  choice('Printer: verbally warned. Sofa: cooperating.','The officer nods. Finally, a company update with clear action owners.','An unusually useful incident report'),
  choice('We are a startup. This is the normal noise.','“I will come back when it scales.” The printer immediately prints a blank sheet in self-defence.','The printer’s first formal warning'),
  choice('Invite the officer to the upstairs BBQ','“I will check on the neighbourhood.” A plate appears upstairs before the sentence has finished.','An extra place at the BBQ')
 ])

];
export function chapterEncounters(chapter){return ENCOUNTERS.filter(e=>e.chapter===chapter);}
export function beginAdventure(r){const g=r.game;g.krugerMode='rpg';g.completed??=[];g.souvenirs??=[];g.streetCred??=0;g.scene=null;g.tasks=[];g.visitors=[];}
export function openConversation(r,p,id,now){const g=r.game,e=chapterEncounters(g.chapter).find(e=>e.id===id);if(!e)throw Error('That neighbour is not in this chapter.');if(g.scene)throw Error('Everyone is already in a conversation.');if(g.completed.includes(id))throw Error('You have already heard this story. Try another neighbour.');if(distance(p,e)>44)throw Error('Walk over to this neighbour first.');g.scene={id:crypto.randomUUID(),encounter:id,stage:'talk',page:0,at:now,ready:{},votes:{},caller:p.id,contributors:{},taps:{},tapAt:{}};p.score+=20;g.log.unshift(p.name+' started a conversation with '+e.name+'.');}
function showOutcome(r,now){const s=r.game.scene,e=ENCOUNTERS.find(e=>e.id===s.encounter);const counts=e.choices.map((_,i)=>Object.values(s.votes).filter(n=>n===i).length),max=Math.max(...counts),tied=counts.map((n,i)=>n===max?i:-1).filter(i=>i>=0);s.choice=tied.includes(s.votes[s.caller])?s.votes[s.caller]:tied[0];s.tied=tied.length>1;s.stage='outcome';s.at=now;s.ready={};}
function finishConversation(r,now){const g=r.game,s=g.scene,e=ENCOUNTERS.find(e=>e.id===s.encounter);if(!g.completed.includes(e.id)){g.completed.push(e.id);g.souvenirs.push({name:e.choices[s.choice].item,from:e.name,chapter:g.chapter});g.streetCred++;for(const p of r.players)if(s.contributors[p.id]||s.votes[p.id]!==undefined)p.score+=50;}s.stage='done';s.at=now;s.ready={};g.log.unshift('NEW SOUVENIR: '+e.choices[s.choice].item);g.log=g.log.slice(0,4);}
function nextPage(r,now){const s=r.game.scene,e=ENCOUNTERS.find(e=>e.id===s.encounter);if(s.stage==='talk'){if(s.page<e.lines.length-1)s.page++;else s.stage='vote';}
 else if(s.stage==='outcome'){if(e.challenge){s.stage='challenge';s.target=r.players.length*10;s.total=0;s.challengeDeadline=now+45000;}else{finishConversation(r,now);return;}}
 else if(s.stage==='done'){r.game.scene=null;const done=chapterEncounters(r.game.chapter).every(e=>r.game.completed.includes(e.id));if(done){r.game.phase='chapter-end';r.game.deadline=null;}return;}
 s.at=now;s.ready={};}
export function adventureTick(r,now){const g=r.game,s=g.scene;if(!s)return false;const quorum=Math.max(1,Math.ceil(r.players.length*.6));if(['talk','outcome','done'].includes(s.stage)&&Object.keys(s.ready).length>=quorum&&now-s.at>=1600){nextPage(r,now);return true;}if(s.stage==='vote'&&(now-s.at>=30000||Object.keys(s.votes).length===r.players.length&&now-s.at>=2000)){showOutcome(r,now);return true;}if(s.stage==='challenge'&&(s.total>=s.target||now>=s.challengeDeadline)){s.challengeSuccess=s.total>=s.target;finishConversation(r,now);return true;}return false;}
export function adventureAction(r,p,a,now){const g=r.game;if(a.type==='talk'){openConversation(r,p,a.encounter,now);return true;}const s=g.scene;if(!s)return a.type.startsWith('dialogue-');if(a.scene!==s.id)return true;if(a.type==='dialogue-ready'){if(!['talk','outcome','done'].includes(s.stage))return true;if(a.stage!==s.stage||a.page!==s.page)return true;if(!s.ready[p.id]){s.ready[p.id]=true;s.contributors[p.id]=true;p.score+=5;}adventureTick(r,now);return true;}
 if(a.type==='dialogue-vote'){const e=ENCOUNTERS.find(e=>e.id===s.encounter);if(s.stage!=='vote')return true;if(!Number.isInteger(a.choice)||!e.choices[a.choice])throw Error('Choose one reply.');if(!(p.id in s.votes)){s.votes[p.id]=a.choice;s.contributors[p.id]=true;p.score+=25;}adventureTick(r,now);return true;}
 if(a.type==='dialogue-tap'){if(s.stage!=='challenge'||now>=s.challengeDeadline)return true;const count=Math.min(4,Math.max(0,Math.floor(Number(a.count)||0)));if(now-(s.tapAt[p.id]||0)<220||!count)return true;const accepted=Math.min(count,s.target-s.total);s.tapAt[p.id]=now;s.total+=accepted;s.taps[p.id]=(s.taps[p.id]||0)+accepted;s.contributors[p.id]=true;p.score+=accepted*2;adventureTick(r,now);return true;}return false;}
export function adventureView(r,me){const g=r.game,s=g.scene;const completed=g.completed||[];const encounters=chapterEncounters(g.chapter).map(e=>({id:e.id,name:e.name,role:e.role,x:e.x,y:e.y,look:e.look,done:completed.includes(e.id)}));let conversation=null;if(s){const e=ENCOUNTERS.find(e=>e.id===s.encounter),selected=e.choices[s.choice];conversation={id:s.id,encounter:e.id,name:e.name,role:e.role,look:e.look,x:e.x,y:e.y,stage:s.stage,page:s.page,at:s.at,text:s.stage==='talk'?e.lines[s.page]:s.stage==='vote'?e.question:s.stage==='outcome'?selected.reply:s.stage==='challenge'?e.challenge.text:(e.challenge?(s.challengeSuccess?e.challenge.result:'You get it done, eventually. There will be a debrief. Nobody will attend.'):'A new chapter in the neighbourhood legend.'),options:s.stage==='vote'?e.choices.map(c=>c.text):undefined,counts:s.stage==='outcome'?e.choices.map((_,i)=>Object.values(s.votes).filter(n=>n===i).length):undefined,choice:s.choice,tied:s.tied,ready:Object.keys(s.ready),voted:Object.keys(s.votes),myVote:s.votes[me?.id],myReady:!!s.ready[me?.id],quorum:Math.max(1,Math.ceil(r.players.length*.6)),voteDeadline:s.at+30000,verb:e.challenge?.verb,target:s.target,total:s.total,taps:s.taps,challengeDeadline:s.challengeDeadline,item:s.stage==='done'?selected.item:undefined};}return{krugerMode:g.krugerMode,encounters,conversation,completed,souvenirs:g.souvenirs||[],streetCred:g.streetCred||0,chapterTotal:encounters.length,chapterDone:encounters.filter(e=>e.done).length};}

export function advanceAdventure(r,now){const s=r.game.scene;if(!s)return;if(s.stage==='vote')showOutcome(r,now);else if(s.stage==='challenge'){s.challengeSuccess=s.total>=s.target;finishConversation(r,now);}else nextPage(r,now);}
