function renderScenario(index = 0) {
  const scenarioList = (typeof SCENARIOS !== 'undefined') ? SCENARIOS : window.SCENARIOS;
  if (!scenarioList || !scenarioList[index]) return;
  const scenario = scenarioList[index];
  const totalScenarios = scenarioList.length;

  const counterEl = document.getElementById('scenario-counter');
  if (counterEl) counterEl.textContent = `${index + 1} / ${totalScenarios}`;

  const questionEl = document.getElementById('scenario-question');
  if (questionEl) questionEl.textContent = scenario.prompt;

  const optionsContainer = document.getElementById('scenario-options');
  if (!optionsContainer) return;
  optionsContainer.innerHTML = '';
  const profile = window.userProfile || {};
  const currentSelection = profile.personalityChoices ? profile.personalityChoices[index] : null;

  scenario.options.forEach(opt => {
    const isSelected = (currentSelection === opt.id);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `scenario-option-card ${isSelected ? 'selected active' : ''}`;
    card.innerHTML = `<span class="option-icon">${opt.icon}</span><span class="option-label">${opt.text}</span>`;
    card.addEventListener('click', () => {
      optionsContainer.querySelectorAll('.scenario-option-card').forEach(c => c.classList.remove('selected', 'active'));
      card.classList.add('selected', 'active');
      profile.personalityChoices[index] = opt.id;
      profile.scenarioAnswers[index] = opt.id;
      document.getElementById('btn-scenario-next').removeAttribute('disabled');
      if (window.handleScenarioAnswer) window.handleScenarioAnswer(opt.id);
    });
    optionsContainer.appendChild(card);
  });
  const btnNext = document.getElementById('btn-scenario-next');
  if (btnNext) {
    btnNext.innerHTML = (index === totalScenarios - 1) ? 'START DIAGNOSIS &rarr;' : 'PROCEED &rarr;';
    currentSelection ? btnNext.removeAttribute('disabled') : btnNext.setAttribute('disabled', 'true');
  }
}

const UIEngine = {
  init() { },
  showScreen(target) {
    document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));
    const activeEl = document.getElementById(target);
    if (activeEl) activeEl.classList.add('active');

    const pBar = document.getElementById('simulation-progress');
    const isQuest = ['content-screen','scrolling-screen','engagement-screen','scenarios-screen'].includes(target);
    if(pBar) isQuest ? pBar.removeAttribute('hidden') : pBar.setAttribute('hidden', '');

    const footer = document.getElementById('app-footer');
    if(footer) ['landing-screen','result-screen','constraint-lab-screen'].includes(target) ? footer.removeAttribute('hidden') : footer.setAttribute('hidden', '');

    if (target === 'scenarios-screen') renderScenario(window.userProfile ? (window.userProfile.currentScenarioIndex || 0) : 0);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  },
  updateProgress(stepNumber, totalSteps = 4) {
    const percentage = Math.round((stepNumber / totalSteps) * 100);
    const textEl = document.getElementById('progress-text');
    const pctEl = document.getElementById('progress-percent');
    const barEl = document.getElementById('progress-bar');
    if (textEl) textEl.textContent = `LEVEL 0${stepNumber}`;
    if (pctEl) pctEl.textContent = `${percentage}%`;
    if (barEl) barEl.style.width = `${percentage}%`;
  },
  renderContentPreferences(categories, selectedIds, onToggle) {
    const container = document.getElementById('content-preference-cards');
    if (!container) return;
    container.innerHTML = '';
    categories.forEach(cat => {
      const isSelected = selectedIds.includes(cat.id);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `selection-card ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `<span class="card-icon">${cat.icon}</span><div><span class="card-title">${cat.label}</span><span class="card-desc">${cat.description}</span></div>`;
      card.addEventListener('click', () => onToggle(cat.id));
      container.appendChild(card);
    });
    const countEl = document.getElementById('preferences-selected-count');
    if (countEl) countEl.textContent = selectedIds.length;
  },
  renderScrollTimeOptions(options, selectedId, onSelect) {
    const container = document.getElementById('scroll-time-cards');
    if (!container) return;
    container.innerHTML = '';
    options.forEach(opt => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `selection-card ${selectedId === opt.id ? 'selected' : ''}`;
      card.innerHTML = `<span class="card-icon">${opt.icon}</span><div><span class="card-title">${opt.label}</span><span class="card-desc">${opt.subtitle}</span></div>`;
      card.addEventListener('click', () => onSelect(opt.id));
      container.appendChild(card);
    });
  },
  updateSliderDisplay(minutes) {
    const pill = document.getElementById('slider-pill-display');
    const fb = document.getElementById('slider-feedback-display');
    const input = document.getElementById('input-scroll-minutes');
    if (pill) pill.textContent = `${minutes} MINS`;
    if (fb) fb.innerHTML = `<span class="feedback-text">SYSTEM DETECTS: ${minutes} MINS OF DAILY DOOM</span>`;
    if (input) input.value = minutes;
  },
  renderEngagementCards(options, selectedIds, onToggle) {
    const container = document.getElementById('engagement-cards');
    if (!container) return;
    container.innerHTML = '';
    options.forEach(opt => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `selection-card ${selectedIds.includes(opt.id) ? 'selected' : ''}`;
      card.innerHTML = `<span class="card-icon">${opt.icon}</span><div><span class="card-title">${opt.label}</span><span class="card-desc">${opt.subtitle}</span></div>`;
      card.addEventListener('click', () => onToggle(opt.id));
      container.appendChild(card);
    });
    const countEl = document.getElementById('engagement-selected-count');
    if (countEl) countEl.textContent = selectedIds.length;
  },
  renderResult(result) {
    const { archetype, compatibilityScore, percentages, stats, recommendations, roast } = result;
    const emojiEl = document.getElementById('archetype-emoji');
    if (emojiEl && archetype) emojiEl.innerHTML = archetype.emoji;

    const titleEl = document.getElementById('archetype-title');
    if (titleEl && archetype) titleEl.textContent = archetype.name;

    const descEl = document.getElementById('archetype-description');
    if (descEl && archetype) descEl.textContent = archetype.description;

    const traitsEl = document.getElementById('traits');
    if (traitsEl && archetype) {
      traitsEl.innerHTML = '';
      archetype.traits.forEach(t => {
        const s = document.createElement('span');
        s.className = 'trait-tag';
        s.textContent = t;
        traitsEl.appendChild(s);
      });
    }

    const compEl = document.getElementById('compatibility-score');
    if (compEl) compEl.innerHTML = `<div class="compatibility-metric">${compatibilityScore}%</div>`;

    const dnaEl = document.getElementById('content-dna');
    if (dnaEl && percentages) {
      dnaEl.innerHTML = '';
      percentages.forEach(item => {
        dnaEl.innerHTML += `<div class="dna-bar-item"><div class="dna-bar-label"><span>${item.label}</span><span>${item.percentage}%</span></div><div class="dna-track"><div class="dna-fill" style="width:${item.percentage}%"></div></div></div>`;
      });
    }

    const statsEl = document.getElementById('scrolling-stats');
    if (statsEl && stats) {
      statsEl.innerHTML = `<div class="stat-box"><span class="stat-label">DAILY EXPOSURE</span><span class="stat-number">${stats.dailyMinutes}m</span></div><div class="stat-box"><span class="stat-label">YEARLY DAMAGE</span><span class="stat-number">${stats.annualDays}d</span></div>`;
    }

    const roastEl = document.getElementById('roast');
    if (roastEl) roastEl.textContent = `"${roast}"`;

    const recEl = document.getElementById('recommendation-cards');
    if (recEl && recommendations) {
      recEl.innerHTML = '';
      recommendations.forEach(r => {
        recEl.innerHTML += `<div class="feed-post-preview"><div class="post-header">${r.emoji} ${r.author}</div><div class="post-caption">${r.title}</div><div class="post-desc-text">${r.description}</div></div>`;
      });
    }
  },
  setButtonState(btnId, isEnabled, text = null) {
    const btn = document.getElementById(btnId);
    if (btn) {
      isEnabled ? btn.removeAttribute('disabled') : btn.setAttribute('disabled', 'true');
      if (text) btn.innerHTML = text;
    }
  }
};

if (typeof window !== 'undefined') {
  window.UIEngine = UIEngine;
  window.renderScenario = renderScenario;
  window.showScreen = UIEngine.showScreen;
}