(() => {
  'use strict';
  const config = window.GAME_CONFIG;
  const byId = (id) => document.getElementById(id);
  const valid = config && typeof config.name === 'string' && typeof config.intro === 'string' &&
    Number.isInteger(config.pointsPerAnswer) && config.pointsPerAnswer > 0 &&
    Array.isArray(config.questions) && config.questions.length > 0 &&
    config.questions.every(q => typeof q.prompt === 'string' && typeof q.explanation === 'string' &&
      Array.isArray(q.answers) && q.answers.length >= 2 && q.answers.every(a => typeof a === 'string') &&
      Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < q.answers.length);
  if (!valid) {
    byId('welcome').textContent = 'The game needs valid questions before it can start. Please check config.js.';
    return;
  }
  const state = { player: '', index: 0, score: 0, answered: false };
  byId('brand-name').textContent = config.name;
  byId('footer-brand').textContent = config.name.toUpperCase();
  byId('intro-copy').textContent = config.intro;
  byId('question-count').textContent = String(config.questions.length).padStart(2, '0');
  document.querySelector('.facts div:nth-child(2) strong').textContent = config.pointsPerAnswer;
  document.title = `${config.name} — Company game`;

  function show(id) {
    for (const screen of ['welcome', 'round', 'results']) byId(screen).hidden = screen !== id;
  }
  function renderQuestion() {
    const question = config.questions[state.index];
    state.answered = false;
    byId('stage-label').textContent = `LET’S GO, ${state.player.toUpperCase()}`;
    byId('round-count').textContent = `QUESTION ${state.index + 1} / ${config.questions.length}`;
    byId('score').textContent = `${state.score} PTS`;
    byId('progress').style.width = `${state.index / config.questions.length * 100}%`;
    byId('question').textContent = question.prompt;
    byId('feedback').textContent = '';
    byId('next').hidden = true;
    byId('answers').replaceChildren();
    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.className = 'answer';
      const number = document.createElement('span');
      number.className = 'answer-letter';
      number.textContent = String(index + 1).padStart(2, '0');
      button.append(number, document.createTextNode(answer));
      button.addEventListener('click', () => answerQuestion(index));
      byId('answers').append(button);
    });
    show('round');
    byId('question').focus();
  }
  function answerQuestion(selected) {
    if (state.answered) return;
    state.answered = true;
    const question = config.questions[state.index];
    const correct = selected === question.correctIndex;
    if (correct) state.score += config.pointsPerAnswer;
    [...byId('answers').children].forEach((button, index) => {
      button.disabled = true;
      if (index === question.correctIndex) button.classList.add('correct');
      else if (index === selected) button.classList.add('incorrect');
    });
    byId('score').textContent = `${state.score} PTS`;
    byId('progress').style.width = `${(state.index + 1) / config.questions.length * 100}%`;
    byId('feedback').textContent = `${correct ? `Correct! +${config.pointsPerAnswer} points.` : `Correct answer: ${question.answers[question.correctIndex]}.`} ${question.explanation}`;
    byId('next').textContent = state.index === config.questions.length - 1 ? 'See my score →' : 'Next question →';
    byId('next').hidden = false;
  }
  byId('join-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = byId('player-name').value.trim();
    if (!name) return;
    Object.assign(state, { player: name, index: 0, score: 0, answered: false });
    renderQuestion();
  });
  byId('next').addEventListener('click', () => {
    if (!state.answered) return;
    state.index++;
    if (state.index < config.questions.length) return renderQuestion();
    show('results');
    byId('stage-label').textContent = 'THAT’S A WRAP';
    byId('result-title').textContent = `Nice one, ${state.player}.`;
    byId('final-score').textContent = `${state.score} / ${config.questions.length * config.pointsPerAnswer}`;
    byId('result-copy').textContent = `You got ${state.score / config.pointsPerAnswer} of ${config.questions.length} questions right. This is just the warm-up for your company edition.`;
    byId('share-status').textContent = '';
    byId('result-title').focus();
  });
  byId('replay').addEventListener('click', () => {
    show('welcome');
    byId('stage-label').textContent = 'THE WARM-UP';
    byId('player-name').focus();
  });
  byId('share').addEventListener('click', async () => {
    const url = new URL(location.href);
    url.hash = '';
    url.search = '';
    try {
      await navigator.clipboard.writeText(url.href);
      byId('share-status').textContent = 'Game link copied. Send it to a teammate!';
    } catch {
      byId('share-status').textContent = `Copy this link from your address bar: ${url.href}`;
    }
  });
})();
