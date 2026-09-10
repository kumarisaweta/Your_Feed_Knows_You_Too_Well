let currentStep = 0;
const userProfile = {
  contentPreferences: [], categories: [], scrollTime: null, preferredTime: '',
  scrollMinutes: 60, behaviours: [], engagements: [],
  personalityChoices: [], scenarioAnswers: [], currentScenarioIndex: 0
};
let result = { archetype: null, scores: {}, percentages: [], compatibilityScore: 0, stats: {}, recommendations: [], roast: '' };
let activeRules = [];

if (typeof window !== 'undefined') {
  window.currentStep = currentStep;
  window.userProfile = userProfile;
  window.result = result;
}

function showScreen(screen) {
  if (typeof screen === 'number') currentStep = screen;
  if (window.UIEngine) UIEngine.showScreen(screen);
  window.currentStep = currentStep;

  if (screen !== 'landing-screen' && screen !== 0) {
    const keypad = document.getElementById('phone-keypad-area');
    if (keypad) keypad.style.display = 'none';
  }
}

function updateProgress(step) {
  if (window.UIEngine) UIEngine.updateProgress(step, 4);
}

function logToPhone(msg, type = "normal") {
  const display = document.getElementById('phone-display');
  if (!display) return;
  const line = document.createElement('div');
  line.className = 'crt-line ' + (type === 'alert' ? 'text-red' : type === 'success' ? 'text-mustard' : '');
  line.textContent = '>>> ' + msg;
  display.appendChild(line);
  display.parentElement.scrollTop = display.parentElement.scrollHeight;
}

function handleContentSelection(id) {
  const idx = userProfile.contentPreferences.indexOf(id);
  if (idx > -1) userProfile.contentPreferences.splice(idx, 1);
  else userProfile.contentPreferences.push(id);
  userProfile.categories = [...userProfile.contentPreferences];
  if (window.UIEngine) {
    UIEngine.renderContentPreferences(CONTENT_CATEGORIES, userProfile.contentPreferences, handleContentSelection);
    UIEngine.setButtonState('btn-preferences-next', userProfile.contentPreferences.length >= 3);
  }
  logToPhone('[BUBBLE] ' + id.toUpperCase() + ' INJECTED');
}

function updateScrollTime(id, min = null) {
  if (id) {
    userProfile.preferredTime = id;
    userProfile.scrollTime = id;
    if (window.UIEngine) UIEngine.renderScrollTimeOptions(SCROLL_TIME_OPTIONS, id, (i) => updateScrollTime(i, userProfile.scrollMinutes));
    logToPhone('[TEMPORAL] ' + id.toUpperCase());
  }
  if (min !== null) {
    userProfile.scrollMinutes = parseInt(min, 10);
    if (window.UIEngine) UIEngine.updateSliderDisplay(userProfile.scrollMinutes);
  }
  if (window.UIEngine) UIEngine.setButtonState('btn-scrolling-next', Boolean(userProfile.preferredTime));
}

function handleEngagementSelection(id) {
  const idx = userProfile.behaviours.indexOf(id);
  if (idx > -1) userProfile.behaviours.splice(idx, 1);
  else userProfile.behaviours.push(id);
  userProfile.engagements = [...userProfile.behaviours];
  if (window.UIEngine) {
    UIEngine.renderEngagementCards(ENGAGEMENT_OPTIONS, userProfile.behaviours, handleEngagementSelection);
    UIEngine.setButtonState('btn-engagement-next', userProfile.behaviours.length >= 1);
  }
  logToPhone('[FRICTION] ' + id.toUpperCase());
}

function showScenario(idx = 0) {
  userProfile.currentScenarioIndex = idx;
  if (window.renderScenario) renderScenario(idx);
  logToPhone(`[FREE-WILL] AWAITING CHOICE 0${idx+1}...`);
}

function handleScenarioAnswer(id) {
  const cur = userProfile.currentScenarioIndex || 0;
  userProfile.personalityChoices[cur] = id;
  userProfile.scenarioAnswers[cur] = id;
  logToPhone('[CHOICE] LOGGED: ' + id.toUpperCase());
}

function goToNextStep() {
  if (currentStep === 0) {
    logToPhone('CRITICAL: USER DETECTED', 'alert');
    setTimeout(() => {
      currentStep = 1;
      showScreen('content-screen');
      updateProgress(1);
    }, 500);
    return;
  }
  if (currentStep === 1 && userProfile.contentPreferences.length >= 3) {
    currentStep = 2; showScreen('scrolling-screen'); updateProgress(2); return;
  }
  if (currentStep === 2 && userProfile.preferredTime) {
    currentStep = 3; showScreen('engagement-screen'); updateProgress(3); return;
  }
  if (currentStep === 3 && userProfile.behaviours.length >= 1) {
    currentStep = 4; showScreen('scenarios-screen'); updateProgress(4); showScenario(0); return;
  }
  if (currentStep === 4) {
    const cur = userProfile.currentScenarioIndex || 0;
    if (userProfile.personalityChoices[cur]) {
      if (cur < (window.SCENARIOS ? SCENARIOS.length : 3) - 1) {
        userProfile.currentScenarioIndex = cur + 1;
        showScenario(userProfile.currentScenarioIndex);
      } else {
        startAnalysis();
      }
    }
  }
}

function goToPreviousStep() {
  if (currentStep === 1) { currentStep = 0; showScreen('landing-screen'); }
  else if (currentStep === 2) { currentStep = 1; showScreen('content-screen'); updateProgress(1); }
  else if (currentStep === 3) { currentStep = 2; showScreen('scrolling-screen'); updateProgress(2); }
  else if (currentStep === 4) {
    const cur = userProfile.currentScenarioIndex || 0;
    if (cur > 0) {
      userProfile.currentScenarioIndex = cur - 1;
      showScenario(userProfile.currentScenarioIndex);
    } else {
      currentStep = 3; showScreen('engagement-screen'); updateProgress(3);
    }
  }
}

function startAnalysis() {
  currentStep = 5;
  showScreen('analysis-screen');
  logToPhone('COMPILING CONSTRAINTS...', 'alert');
  const seq = [
    { p: 0, t: '>>> INITIATING', l: 'Reading choices...' },
    { p: 25, t: '>>> MAPPING', l: 'Scanning patterns...' },
    { p: 50, t: '>>> CALCULATING', l: 'Dopamine matrix...' },
    { p: 80, t: '>>> BUILDING', l: 'Cross-referencing...' },
    { p: 100, t: '>>> UNLOCKED', l: 'Diagnosis complete.' }
  ];
  let i = 0;
  const loop = () => {
    if (i >= seq.length) return setTimeout(finalizeResult, 700);
    const fill = document.getElementById('analysis-progress-fill');
    const pct = document.getElementById('analysis-percentage-text');
    const status = document.getElementById('analysis-status');
    const log = document.getElementById('analysis-log');
    if (fill) fill.style.width = seq[i].p + '%';
    if (pct) pct.textContent = seq[i].p + '%';
    if (status) status.textContent = seq[i].t;
    if (log) { log.innerHTML += '<div>' + seq[i].l + '</div>'; log.scrollTop = log.scrollHeight; }
    i++;
    setTimeout(loop, 450);
  };
  loop();
}

function finalizeResult() {
  if (!window.AlgorithmEngine) return;
  result.archetype = AlgorithmEngine.determineArchetype(AlgorithmEngine.calculateScores(userProfile));
  result.percentages = AlgorithmEngine.calculatePercentages(userProfile);
  result.compatibilityScore = AlgorithmEngine.calculateCompatibilityScore(userProfile);
  result.stats = AlgorithmEngine.calculateScrollingStats(userProfile.scrollMinutes);
  result.recommendations = AlgorithmEngine.generateFeed(userProfile, result.archetype);
  result.roast = AlgorithmEngine.generateRoast(result.archetype);
  window.result = result;
  if (window.UIEngine) UIEngine.renderResult(result);
  currentStep = 6;
  showScreen('result-screen');
  logToPhone('PROFILE CLASSIFIED. CHECK SCREEN.', 'success');
}

function resetSimulation() {
  userProfile.contentPreferences = [];
  userProfile.categories = [];
  userProfile.preferredTime = '';
  userProfile.scrollTime = null;
  userProfile.scrollMinutes = 60;
  userProfile.behaviours = [];
  userProfile.engagements = [];
  userProfile.personalityChoices = [];
  userProfile.scenarioAnswers = [];
  userProfile.currentScenarioIndex = 0;
  activeRules = [];
  if (window.UIEngine) {
    UIEngine.renderContentPreferences(CONTENT_CATEGORIES, [], handleContentSelection);
    UIEngine.renderScrollTimeOptions(SCROLL_TIME_OPTIONS, null, (id) => updateScrollTime(id, 60));
    UIEngine.updateSliderDisplay(60);
    UIEngine.renderEngagementCards(ENGAGEMENT_OPTIONS, [], handleEngagementSelection);
    UIEngine.setButtonState('btn-preferences-next', false);
    UIEngine.setButtonState('btn-scrolling-next', false);
    UIEngine.setButtonState('btn-engagement-next', false);
  }
  currentStep = 0;
  showScreen('landing-screen');
  const display = document.getElementById('phone-display');
  if (display) {
    display.innerHTML = '<div class="crt-line text-mustard">>>> SYS.CONSTRAINT_MONITOR</div><div class="crt-line">>>> AWAITING INPUT...</div><div class="crt-line blink">_</div>';
  }
  const keypad = document.getElementById('phone-keypad-area');
  if (keypad) keypad.style.display = 'block';
}

function tearBox() {
  const box = document.getElementById('box-intro');
  if (!box || box.classList.contains('zoomed-in')) return;
  box.classList.add('zoomed-in');
  setTimeout(() => { box.style.display = 'none'; }, 1500);
}

function bindHoverSurprises() {
  const slangs = ['COOKED', 'AURA -1000', 'NO CAP', 'FR FR', 'TOUCH GRASS', 'BRAINROT', 'SKIBIDI', 'SUS', 'MAIN CHARACTER', 'LITERALLY YOU', 'CHRONICALLY ONLINE'];
  const colors = ['#E84A35', '#3657A7', '#4E815A', '#E8B84A', '#ff007f', '#9b59b6'];

  document.querySelectorAll('.surprise-me').forEach(el => {
    let popup = null;
    el.addEventListener('mouseenter', () => {
      const slang = el.getAttribute('data-slang') || slangs[Math.floor(Math.random() * slangs.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      popup = document.createElement('div');
      popup.className = 'hover-slang-popup';
      popup.style.setProperty('--rand', Math.random());
      popup.style.borderColor = color;
      popup.style.color = color;
      popup.textContent = slang;
      document.body.appendChild(popup);
      const rect = el.getBoundingClientRect();
      popup.style.left = (rect.left + window.scrollX + rect.width / 2) + 'px';
      popup.style.top = (rect.top + window.scrollY) + 'px';
      el.style.outline = '4px dashed ' + color;
      el.style.outlineOffset = '5px';
    });
    el.addEventListener('mouseleave', () => {
      if (popup) { popup.remove(); popup = null; }
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  });
}

function bindGlobalClicks() {
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#box-intro') || e.target.closest('#modal-contradiction') || e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
    const stamps = ['BRAINROT', 'CAUGHT IN 4K', 'SUS', 'TOUCH GRASS', 'NO CAP', 'COOKED', 'FR FR', 'SKIBIDI'];
    const stamp = document.createElement('div');
    stamp.className = 'genz-stamp';
    stamp.style.setProperty('--rand', Math.random());
    stamp.textContent = stamps[Math.floor(Math.random() * stamps.length)];
    stamp.style.left = e.pageX + 'px';
    stamp.style.top = e.pageY + 'px';
    document.body.appendChild(stamp);
    setTimeout(() => stamp.remove(), 1000);
  });
}

// ===== FEATURE 1-7: CONSTRAINT LAB LOGIC BINDINGS =====
function bindConstraintLab() {
  const btnLab = document.getElementById('btn-open-lab');
  const btnAddRule = document.getElementById('btn-add-rule');
  const ruleSelect = document.getElementById('rule-select');
  const modal = document.getElementById('modal-contradiction');
  const sliderKnow = document.getElementById('slider-knowledge');
  const sliderChaos = document.getElementById('slider-chaos');
  const btnReboot = document.getElementById('btn-reboot-algo');
  const btnStress = document.getElementById('btn-stress-test');

  if (btnLab) {
    btnLab.addEventListener('click', () => {
      document.getElementById('result-screen').classList.remove('active');
      document.getElementById('constraint-lab-screen').classList.add('active');
      logToPhone('ENTERING ROOT ACCESS...', 'alert');
    });
  }

  if (sliderKnow) {
    sliderKnow.addEventListener('input', (e) => {
      document.getElementById('val-knowledge').textContent = e.target.value + '%';
      if (window.AlgorithmEngine) AlgorithmEngine.ConstraintEngine.metaLimit = parseInt(e.target.value);
    });
  }

  if (sliderChaos) {
    sliderChaos.addEventListener('input', (e) => {
      document.getElementById('val-chaos').textContent = e.target.value + '%';
      if (window.AlgorithmEngine) AlgorithmEngine.ConstraintEngine.chaosBudget = parseInt(e.target.value);
    });
  }

  if (btnAddRule && ruleSelect) {
    btnAddRule.addEventListener('click', () => {
      const val = ruleSelect.value;
      if (!val) return;

      const check = AlgorithmEngine.ConstraintEngine.checkContradiction(val, userProfile);
      if (check.conflict) {
        logToPhone(`CONFLICT: ${val.toUpperCase()} INJECTED`, 'alert');
        document.getElementById('modal-rule').textContent = check.rule;
        document.getElementById('modal-behav').textContent = check.behaviour;
        document.getElementById('modal-conf').textContent = check.confidence + '%';
        modal.style.display = 'flex';
        activeRules.push(val);
      } else {
        activeRules.push(val);
        updateSimulator();
        logToPhone(`APPLIED RULE: NO ${val.toUpperCase()}`, 'success');
      }
    });
  }

  document.querySelectorAll('.modal-resolve').forEach(btn => {
    btn.addEventListener('click', (e) => {
      modal.style.display = 'none';
      const action = e.target.getAttribute('data-action');
      logToPhone(`CONFLICT RESOLVED: ${action.toUpperCase()}`, 'success');
      updateSimulator();
    });
  });

  if (btnStress) {
    btnStress.addEventListener('click', () => {
      const report = AlgorithmEngine.ConstraintEngine.getStressTestReport(activeRules, userProfile);
      if (report) {
        logToPhone('--- STRESS TEST REPORT ---', 'alert');
        logToPhone(`MOST RESTRICTIVE: ${report.mostRestrictive}`);
        logToPhone(`MOST CONTRADICTORY: ${report.mostContradictory}`);
        logToPhone(`DISCOVERY LOSS: ${report.discoveryLoss}`);
        logToPhone('--------------------------');
      } else {
        logToPhone('NO ACTIVE RULES TO TEST.', 'alert');
      }
    });
  }

  if (btnReboot) {
    btnReboot.addEventListener('click', () => {
      logToPhone('REBOOTING WITH CONSTRAINTS...', 'success');

      let currentRecommendations = AlgorithmEngine.generateFeed(userProfile, result.archetype);
      result.recommendations = AlgorithmEngine.ConstraintEngine.regenerateFeed(
        currentRecommendations,
        window.CONTENT_CATEGORIES,
        window.RECOMMENDATIONS,
        AlgorithmEngine.ConstraintEngine.chaosBudget
      );

      if (window.UIEngine) UIEngine.renderResult(result);

      const cardMeta = document.getElementById('card-meta-knowledge');
      if (cardMeta) {
        cardMeta.style.display = 'block';
        document.getElementById('predict-score').textContent = AlgorithmEngine.ConstraintEngine.metaLimit + '%';
        document.getElementById('chaos-score').textContent = AlgorithmEngine.ConstraintEngine.chaosBudget + '%';
        document.getElementById('knowledge-msg').textContent = AlgorithmEngine.ConstraintEngine.chaosBudget > 5 
          ? "> Algorithm control bypassed. Chaos injected into recommendations." 
          : "> Feed remains heavily constrained & predictable.";
      }

      document.getElementById('constraint-lab-screen').classList.remove('active');
      document.getElementById('result-screen').classList.add('active');
    });
  }
}

function updateSimulator() {
  const sim = AlgorithmEngine.ConstraintEngine.simulateImpact(activeRules);
  document.getElementById('sim-pool').textContent = sim.poolSize.toLocaleString() + ' items';
  document.getElementById('sim-collision').textContent = `COLLISION SEVERITY: ${sim.collisionState} | DISCOVERY: ${sim.discoveryPct}% | PREDICTABILITY: ${sim.predictabilityPct}%`;
}

function bindEvents() {
  const btnTear = document.getElementById('btn-tear-tape');
  const theBox = document.getElementById('the-box');
  const tape = document.getElementById('tape-strip');
  const overlay = document.getElementById('box-intro');

  if (btnTear) btnTear.onclick = function(e) { e.preventDefault(); e.stopPropagation(); tearBox(); };
  if (theBox) theBox.onclick = function() { tearBox(); };
  if (tape) tape.onclick = function(e) { e.stopPropagation(); tearBox(); };
  if (overlay) overlay.onclick = function(e) { if (e.target === overlay) tearBox(); };

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const b = document.getElementById('box-intro');
      if (b && b.style.display !== 'none' && !b.classList.contains('zoomed-in')) {
        e.preventDefault();
        tearBox();
      }
    }
  });

  const startBtn = document.getElementById('btn-start-simulation');
  if (startBtn) startBtn.onclick = goToNextStep;

  const map = [
    ['btn-preferences-back', goToPreviousStep],
    ['btn-preferences-next', goToNextStep],
    ['btn-scrolling-back', goToPreviousStep],
    ['btn-scrolling-next', goToNextStep],
    ['btn-engagement-back', goToPreviousStep],
    ['btn-engagement-next', goToNextStep],
    ['btn-scenario-back', goToPreviousStep],
    ['btn-scenario-next', goToNextStep],
    ['btn-restart-simulation', resetSimulation]
  ];
  map.forEach(([id, fn]) => {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
  });

  const slider = document.getElementById('input-scroll-minutes');
  if (slider) slider.oninput = (e) => updateScrollTime(null, e.target.value);

  const shareBtn = document.getElementById('btn-share-results');
  if (shareBtn) {
    shareBtn.onclick = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        shareBtn.textContent = 'LINK COPIED!';
        setTimeout(() => shareBtn.textContent = 'SHARE DOSSIER', 2000);
      }
    };
  }

  bindGlobalClicks();
  bindHoverSurprises();
  bindConstraintLab();
}

function initializeApp() {
  if (window.UIEngine) {
    UIEngine.init();
    UIEngine.renderContentPreferences(CONTENT_CATEGORIES || [], [], handleContentSelection);
    UIEngine.renderScrollTimeOptions(SCROLL_TIME_OPTIONS || [], null, (id) => updateScrollTime(id, 60));
    UIEngine.updateSliderDisplay(60);
    UIEngine.renderEngagementCards(ENGAGEMENT_OPTIONS || [], [], handleEngagementSelection);
  }
  bindEvents();
  currentStep = 0;
  showScreen('landing-screen');
}

window.initializeApp = initializeApp;
window.goToNextStep = goToNextStep;
window.goToPreviousStep = goToPreviousStep;
window.handleContentSelection = handleContentSelection;
window.updateScrollTime = updateScrollTime;
window.handleEngagementSelection = handleEngagementSelection;
window.handleScenarioAnswer = handleScenarioAnswer;
window.startAnalysis = startAnalysis;
window.resetSimulation = resetSimulation;
window.tearBox = tearBox;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}