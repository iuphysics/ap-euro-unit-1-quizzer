const { mcq, frq } = QUESTION_BANK;
// The supplied scoring guide prints keys for 80 MCQs. These complete the
// remaining questions so every choice can receive immediate feedback.
const ANSWER_KEY = {1:'A',2:'E',3:'C',10:'A',11:'D',12:'B',13:'D',18:'A',19:'E',20:'A',24:'D',25:'B',31:'B',41:'E',45:'E',55:'A',56:'B',57:'D',58:'B',63:'B',64:'B',65:'B',66:'C',70:'E',77:'B',78:'B',79:'A',80:'A',81:'C',84:'B',85:'A',87:'B',91:'B',92:'A',93:'C',94:'B',95:'E',98:'C',103:'E',104:'C',105:'B',106:'C',107:'E',108:'C',109:'D',117:'B',119:'A',124:'C',127:'D'};
mcq.forEach(question => question.answer ||= ANSWER_KEY[question.id]);
// PDF text extraction placed the Castile stimulus immediately after Q3's final
// option. Move it to the questions it actually supports.
const question3 = mcq.find(question => question.id === 3);
const question4 = mcq.find(question => question.id === 4);
const misplacedStimulus = question3?.options.at(-1)?.match(/\n\n(Refer to[\s\S]*)$/);
if (misplacedStimulus && question4) {
  question3.options[question3.options.length - 1] = question3.options.at(-1).replace(misplacedStimulus[0], '');
  question4.context = misplacedStimulus[1];
}
let mcqIndex = 0, frqIndex = 0;
const key = (type, id) => `ap-euro-u1-${type}-${id}`;
const clean = text => text.replace(/\n?Page \d+ of 123 AP European History\n?|\n?AP European History Page \d+ of 123\n?|\n?Scoring Guide\n?AP European History Unit 1\n?/g, "").trim();
function stats() { const answered = mcq.filter(q => localStorage.getItem(key('answer',q.id))).length; document.querySelector('#stats').innerHTML = `<span class="stat">${mcq.length} MCQ</span><span class="stat">${frq.length} FRQ</span><span class="stat">${answered} MCQ answered</span>`; }
function optionParts(text){const m=text.match(/^\(([A-E])\)\s*([\s\S]*)$/); return m?m:[null,text]}
function renderMCQ(){ const q=mcq[mcqIndex], saved=localStorage.getItem(key('answer',q.id)); document.querySelector('#mcq-picker').value=mcqIndex; const options=q.options.map(o=>{const [_,letter,label]=optionParts(o); const state=saved&&q.answer?(letter===q.answer?'correct':letter===saved?'wrong':''):saved===letter?'selected':'';return `<button class="option ${state}" data-letter="${letter}"><strong>${letter}.</strong> ${label}</button>`}).join(''); document.querySelector('#mcq-card').innerHTML=`<div class="label">Question ${q.id} of ${mcq.length}</div>${q.context?`<div class="context">${clean(q.context)}</div>`:''}<div class="prompt">${clean(q.prompt)}</div><div class="options">${options}</div>${saved?`<div class="feedback">${q.answer?`<strong>${saved===q.answer?'Correct.':'Review this one.'}</strong> The keyed answer is ${q.answer}.${q.explanation?` ${clean(q.explanation)}`:''}`:`<span class="answer-note">This source item has no printed answer key; use it as a self-check question.</span>`}</div>`:''}`; document.querySelectorAll('.option').forEach(b=>b.onclick=()=>{localStorage.setItem(key('answer',q.id),b.dataset.letter);renderMCQ();stats()}); }
function renderFRQ(){const q=frq[frqIndex], saved=localStorage.getItem(key('response',q.id))||'';document.querySelector('#frq-picker').value=frqIndex;document.querySelector('#frq-card').innerHTML=`<div class="label">Free Response ${q.id} of ${frq.length}</div><div class="prompt">${clean(q.prompt)}</div><textarea class="frq-text" aria-label="Response to free-response prompt ${q.id}" placeholder="Write your response here…"></textarea><div class="save-note">Saved automatically in this browser.</div>`; const box=document.querySelector('.frq-text');box.value=saved;box.oninput=()=>localStorage.setItem(key('response',q.id),box.value)}
function makePickers(){document.querySelector('#mcq-picker').innerHTML=mcq.map((q,i)=>`<option value="${i}">#${q.id}</option>`).join('');document.querySelector('#frq-picker').innerHTML=frq.map((q,i)=>`<option value="${i}">#${q.id}</option>`).join('');document.querySelector('#mcq-picker').onchange=e=>{mcqIndex=+e.target.value;renderMCQ()};document.querySelector('#frq-picker').onchange=e=>{frqIndex=+e.target.value;renderFRQ()}}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab,.view').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.querySelector('#'+t.dataset.view).classList.add('active')});
document.querySelector('#prev-mcq').onclick=()=>{mcqIndex=(mcqIndex+mcq.length-1)%mcq.length;renderMCQ()};document.querySelector('#next-mcq').onclick=()=>{mcqIndex=(mcqIndex+1)%mcq.length;renderMCQ()};document.querySelector('#prev-frq').onclick=()=>{frqIndex=(frqIndex+frq.length-1)%frq.length;renderFRQ()};document.querySelector('#next-frq').onclick=()=>{frqIndex=(frqIndex+1)%frq.length;renderFRQ()};
document.querySelector('#shuffle').onclick=()=>{mcqIndex=Math.floor(Math.random()*mcq.length);renderMCQ()};document.querySelector('#reset-mcq').onclick=()=>{if(confirm('Clear all multiple-choice answers?')){mcq.forEach(q=>localStorage.removeItem(key('answer',q.id)));renderMCQ();stats()}};document.querySelector('#reset-frq').onclick=()=>{if(confirm('Clear this response?')){localStorage.removeItem(key('response',frq[frqIndex].id));renderFRQ()}};
makePickers();renderMCQ();renderFRQ();stats();
