export const DEFAULT_PACK = {
  title: 'Five years of Sumthing', sample: true,
  quiz: [
    { question: 'What does Sumthing help restore?', answers: ['Nature', 'Vintage printers', 'Office chairs', 'Lost passwords'], correct: 0, story: 'A warm-up based on Sumthing’s public mission: nature restoration.' },
    { question: 'Which square was home to the first office in this anniversary story?', answers: ['Dam', 'Krugerplein', 'Museumplein', 'Leidseplein'], correct: 1, story: 'Guido’s anniversary brief puts the first office on Krugerplein.' },
    { question: 'What was collected to furnish the first office?', answers: ['Only designer furniture', 'Marktplaats and street finds', 'Laboratory equipment', 'Arcade cabinets'], correct: 1, story: 'From the event brief: Marktplaats finds and furniture from the street.' },
    { question: 'Where does the moving-out chapter take us?', answers: ['Schiphol', 'A boat', 'The laboratory by Hortus', 'A treehouse'], correct: 2, story: 'Guido’s brief names the laboratory next to Hortus Botanicus.' },
    { question: 'Which anniversary are we celebrating?', answers: ['One year', 'Three years', 'Five years', 'Ten years'], correct: 2, story: 'Five years of Sumthing. Replace these warm-ups with your company stories.' }
  ],
  characters: [
    { name: 'The mystery applicant', description: 'Fictional sample character. Replace with one of your five legends.', prompt: 'The applicant opened the interview with…', truth: 'Can my imaginary assistant join too?', story: 'This is invented demo content, not a real company anecdote.' },
    { name: 'The bargain hunter', description: 'Fictional sample character.', prompt: 'The free office chair came with…', truth: 'A very detailed instruction manual for sitting down', story: 'Invented sample. Add your actual character and true ending.' },
    { name: 'The printer whisperer', description: 'Fictional sample character.', prompt: 'The printer finally worked after…', truth: 'Someone politely asked it to take a break', story: 'Invented sample. Your real printing story belongs here.' },
    { name: 'The neighbourhood legend', description: 'Fictional sample character.', prompt: 'Their essential BBQ equipment was…', truth: 'A surprisingly official seating chart', story: 'Invented sample. Replace with a true story.' },
    { name: 'The moving-day hero', description: 'Fictional sample character.', prompt: 'The last thing put in the van was…', truth: 'The list of everything already in the van', story: 'Invented sample. Replace with your moving-day story.' }
  ],
  sketch: ['A sofa stuck in an office doorway', 'A printer having a terrible day', 'Moving an office in one van', 'A very enthusiastic job applicant', 'A tiny forest taking over a desk', 'A company BBQ on the square', 'A heroic second-hand office chair', 'Coral restoration underwater', 'Five years of birthday cake', 'Coffee delivery during moving day'],
  ecosystems: [ {name:'Forest', action:'plant'}, {name:'Wetland',action:'water'}, {name:'Coast',action:'clean'}, {name:'Reef',action:'coral'}, {name:'Meadow',action:'trace'} ]
};
export const GAMES = {
 quiz: {title:'Sumthing Doesn’t Add Up',short:'THE QUIZ',genre:'Company trivia',minutes:'8 min',color:'#c7f50a',icon:'?',description:'Big stories. Suspicious facts. Lock in your answer.'},
 bluff:{title:'The Usual Sumthings',short:'THE LEGENDS',genre:'Bluff & discover',minutes:'9 min',color:'#c7f50a',icon:'★',description:'Write a believable lie. Find the real company legend.'},
 kruger:{title:'Krugerplein Chaos',short:'THE OLD OFFICE',genre:'Multiplayer adventure',minutes:'18 min',color:'#c7f50a',icon:'⌂',description:'Move in. Meet the neighbours. Get everything out again.'},
 restore:{title:'Restore Rush',short:'THE RESTORATION',genre:'Watch · Remember · Tap',minutes:'7 min',color:'#c7f50a',icon:'✳',description:'Watch the order. Repeat it fast. Bring a habitat back to life.'},
 sketch:{title:'Sumthing Sketchy',short:'THE DRAWING GAME',genre:'Draw & guess',minutes:'8 min',color:'#c7f50a',icon:'✎',description:'Bad drawings. Great memories. Guess what just happened.'}
};
export const CHAPTERS = [
 {title:'01 · Moving in',subtitle:'Help Guido make room for the beginning of Sumthing.',instruction:'Find an old item or unwanted occupant at the office. Carry or guide them to the exit marker.',seconds:150},
 {title:'02 · Marktplaats empire',subtitle:'A beautiful office. A questionable furniture budget.',instruction:'Collect finds around the square and deliver them to the office. A sofa needs a second player nearby to help lift.',seconds:150},
 {title:'03 · Meet the neighbours',subtitle:'Keep the office running and make friends on the square.',instruction:'Pick up an errand and follow its destination. Help Hedi print, organise the BBQ, visit Karima, and return boules. Redirect walk-in visitors at the office.',seconds:240},
 {title:'04 · The great move',subtitle:'Next stop: the laboratory beside Hortus Botanicus.',instruction:'Move office furniture to the van. Work together on the sofa. Watch out for cartoon moving-day mischief: recover dropped items!',seconds:180}
];
export const COLORS=['#d9f86e','#ef9db9','#89cfe9','#d0b2f3','#ffbd7e','#8cdbc0','#e9dd9c','#ef8c84','#a3b5f5','#d6d8ce'];
export function validatePack(p){
 if(!p||typeof p.title!=='string'||p.title.length>100)throw Error('Add a title of at most 100 characters.');
 if(!Array.isArray(p.quiz)||!p.quiz.length||p.quiz.length>60)throw Error('Add 1–60 quiz questions.');
 for(const q of p.quiz)if(typeof q.question!=='string'||q.question.length>500||!Array.isArray(q.answers)||q.answers.length!==4||!q.answers.every(a=>typeof a==='string'&&a.length<=160)||!Number.isInteger(q.correct)||q.correct<0||q.correct>3||typeof q.story!=='string'||q.story.length>2000)throw Error('Each quiz question needs four answers, correct (0–3), and a story.');
 if(!Array.isArray(p.characters)||!p.characters.length||p.characters.length>20)throw Error('Add 1–20 characters.');
 for(const c of p.characters)for(const k of ['name','description','prompt','truth','story'])if(typeof c[k]!=='string'||c[k].length>(k==='story'?2000:500))throw Error('Each character needs name, description, prompt, truth, and story.');
 if(!Array.isArray(p.sketch)||!p.sketch.length||p.sketch.length>100||!p.sketch.every(s=>typeof s==='string'&&s.trim()&&s.length<=120))throw Error('Add 1–100 short drawing prompts.');
 return {...p,sample:!!p.sample,ecosystems:DEFAULT_PACK.ecosystems};
}
