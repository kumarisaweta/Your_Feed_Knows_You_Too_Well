const CONTENT_CATEGORIES = [
  { id: 'echo', label: 'Echo Chamber', icon: '<svg class="svg-icon"><use href="#icon-alert"></use></svg>', description: 'Only views that agree with your bias' },
  { id: 'sludge', label: 'Sensory Sludge', icon: '<svg class="svg-icon"><use href="#icon-zap"></use></svg>', description: 'Split-screen brainrot. Max stimulation' },
  { id: 'aesthetic', label: 'Aesthetic Prison', icon: '<svg class="svg-icon"><use href="#icon-star"></use></svg>', description: 'Perfect curated unreachable lifestyles' },
  { id: 'outrage', label: 'Outrage Loop', icon: '<svg class="svg-icon"><use href="#icon-cross"></use></svg>', description: 'Content made only to make you angry' },
  { id: 'lore', label: 'Niche Rabbit Hole', icon: '<svg class="svg-icon"><use href="#icon-tech"></use></svg>', description: 'Hyper-specific lore that traps your feed' },
  { id: 'hustle', label: 'Hustle Delusion', icon: '<svg class="svg-icon"><use href="#icon-clock"></use></svg>', description: 'Fake productivity and 5AM grind bait' },
  { id: 'void', label: 'The Void', icon: '<svg class="svg-icon"><use href="#icon-sleep"></use></svg>', description: 'Existential dread and liminal spaces' },
  { id: 'parasocial', label: 'Parasocial Trap', icon: '<svg class="svg-icon"><use href="#icon-heart"></use></svg>', description: 'Over-invested in strangers lives' }
];

const SCROLL_TIME_OPTIONS = [
  { id: 'circadian', label: 'Circadian Override', icon: '<svg class="svg-icon"><use href="#icon-sleep"></use></svg>', subtitle: 'Sacrificing sleep for the feed at 3 AM' },
  { id: 'morning', label: 'Morning Paralysis', icon: '<svg class="svg-icon"><use href="#icon-clock"></use></svg>', subtitle: 'Trapped in bed by the first scroll' },
  { id: 'meal', label: 'Meal Dependency', icon: '<svg class="svg-icon"><use href="#icon-plus"></use></svg>', subtitle: 'Cannot eat without a video playing' },
  { id: 'task', label: 'Task Avoidance', icon: '<svg class="svg-icon"><use href="#icon-study"></use></svg>', subtitle: 'Escaping real-world responsibilities' }
];

const ENGAGEMENT_OPTIONS = [
  { id: 'validation', label: 'Echo Validation', icon: '<svg class="svg-icon"><use href="#icon-check"></use></svg>', subtitle: 'Liking because it confirms your bias' },
  { id: 'hoard', label: 'Digital Hoarding', icon: '<svg class="svg-icon"><use href="#icon-save"></use></svg>', subtitle: 'Saving content you will never open' },
  { id: 'hate', label: 'Hate Engagement', icon: '<svg class="svg-icon"><use href="#icon-cross"></use></svg>', subtitle: 'Commenting just to prove someone wrong' },
  { id: 'pack', label: 'Pack Mentality', icon: '<svg class="svg-icon"><use href="#icon-arrow"></use></svg>', subtitle: 'Sharing to stay socially relevant' },
  { id: 'ghost', label: 'Ghost Protocol', icon: '<svg class="svg-icon"><use href="#icon-movies"></use></svg>', subtitle: 'Consuming everything, interacting with nothing' }
];

const SCENARIOS = [
  {
    id: 'attention-trap',
    prompt: '[TEST 01] A 45-minute video essay appears. It challenges your limits.',
    options: [
      { id: 'submit', label: 'Submit', text: 'Watch the entire 45 minutes', icon: '<svg class="svg-icon"><use href="#icon-check"></use></svg>' },
      { id: 'illusion', label: 'Illusion', text: 'Save it for "later" (never)', icon: '<svg class="svg-icon"><use href="#icon-save"></use></svg>' },
      { id: 'reject', label: 'Reject', text: 'Swipe instantly. Attention span too short', icon: '<svg class="svg-icon"><use href="#icon-zap"></use></svg>' }
    ]
  },
  {
    id: 'social-trap',
    prompt: '[TEST 02] You open the app JUST to check a DM. The feed loads first.',
    options: [
      { id: 'focus', label: 'Focus', text: 'Check DM, close app. Willpower intact', icon: '<svg class="svg-icon"><use href="#icon-study"></use></svg>' },
      { id: 'relapse', label: 'Relapse', text: 'Forget the DM. Scroll for an hour', icon: '<svg class="svg-icon"><use href="#icon-sleep"></use></svg>' },
      { id: 'distract', label: 'Distract', text: 'Reply, then send them 5 random posts', icon: '<svg class="svg-icon"><use href="#icon-arrow"></use></svg>' }
    ]
  },
  {
    id: 'reset-trap',
    prompt: '[TEST 03] The algorithm breaks. It shows completely alien content.',
    options: [
      { id: 'escape', label: 'Escape', text: 'Close the app. The spell is broken', icon: '<svg class="svg-icon"><use href="#icon-cross"></use></svg>' },
      { id: 'rebuild', label: 'Rebuild', text: 'Manually hit "Not Interested" to fix it', icon: '<svg class="svg-icon"><use href="#icon-tech"></use></svg>' },
      { id: 'adapt', label: 'Adapt', text: 'Keep watching. Let it form a new trap', icon: '<svg class="svg-icon"><use href="#icon-alert"></use></svg>' }
    ]
  }
];

const ARCHETYPES = [
  { id: 'memeLord', name: 'THE SLUDGE CONSUMER', emoji: '<svg class="svg-icon"><use href="#icon-zap"></use></svg>', description: 'Your attention span has been constrained to 7 seconds.', traits: ['Hyper-Stimulated', 'Zero Retention'], recommendationCategories: ['sludge'], roast: 'You need Subway Surfers gameplay just to read a text message.', priority: 1 },
  { id: 'nightScroller', name: 'THE CHRONO-PRISONER', emoji: '<svg class="svg-icon"><use href="#icon-sleep"></use></svg>', description: 'The algorithm has completely bypassed your temporal constraints.', traits: ['Sleep Deprived', 'Time Blindness'], recommendationCategories: ['void'], roast: 'You say going to sleep but your router logs say 4:30 AM.', priority: 2 },
  { id: 'techGoblin', name: 'THE DATA HOARDER', emoji: '<svg class="svg-icon"><use href="#icon-save"></use></svg>', description: 'Constrained by the illusion of future utility.', traits: ['Bookmark Addict', 'False Productivity'], recommendationCategories: ['lore'], roast: 'You have 4000 saved videos you will never open.', priority: 3 },
  { id: 'vibeCurator', name: 'THE FILTERED MIND', emoji: '<svg class="svg-icon"><use href="#icon-star"></use></svg>', description: 'Trapped in a perfectly curated aesthetic bubble.', traits: ['Curated Reality', 'Aesthetic Bias'], recommendationCategories: ['aesthetic'], roast: 'Your algorithm thinks you live in a Pinterest board. You dont.', priority: 4 },
  { id: 'grindMachine', name: 'THE HUSTLE CAPTIVE', emoji: '<svg class="svg-icon"><use href="#icon-clock"></use></svg>', description: 'Constrained by the guilt of not constantly working.', traits: ['Toxic Productivity', 'Burnout Candidate'], recommendationCategories: ['hustle'], roast: 'Watching podcasts about getting rich while lying horizontally.', priority: 5 },
  { id: 'digitalWarrior', name: 'THE OUTRAGE ENGINE', emoji: '<svg class="svg-icon"><use href="#icon-alert"></use></svg>', description: 'The algorithm uses anger as your primary engagement constraint.', traits: ['Reactive', 'Easily Provoked'], recommendationCategories: ['outrage'], roast: 'You let pixels on a screen ruin your actual real-life mood.', priority: 6 },
  { id: 'internetAnalyst', name: 'THE ECHO CHAMBER', emoji: '<svg class="svg-icon"><use href="#icon-check"></use></svg>', description: 'Severely constrained worldview based on confirmation bias.', traits: ['Algorithmically Isolated', 'Opinion Locked'], recommendationCategories: ['echo'], roast: 'You only engage with content that tells you that you are already right.', priority: 7 },
  { id: 'chaosScroller', name: 'THE ALGO-ANOMALY', emoji: '<svg class="svg-icon"><use href="#icon-cross"></use></svg>', description: 'You lack any predictable constraints. The system fears you.', traits: ['Unpredictable', 'Data Hazard'], recommendationCategories: ['sludge', 'void'], roast: 'Your data profile looks like a server error.', priority: 8 }
];

const SCORING_RULES = {
  categories: {
    echo: { internetAnalyst: 5 },
    sludge: { memeLord: 5, chaosScroller: 3 },
    aesthetic: { vibeCurator: 5 },
    outrage: { digitalWarrior: 5 },
    lore: { techGoblin: 4 },
    hustle: { grindMachine: 5 },
    void: { nightScroller: 5, chaosScroller: 2 },
    parasocial: { internetAnalyst: 3, vibeCurator: 2 }
  },
  time: {
    circadian: { nightScroller: 6 },
    morning: { memeLord: 4 },
    meal: { vibeCurator: 3, internetAnalyst: 3 },
    task: { techGoblin: 4, grindMachine: 3 }
  },
  engagements: {
    validation: { internetAnalyst: 5 },
    hoard: { techGoblin: 5 },
    hate: { digitalWarrior: 5 },
    pack: { memeLord: 4 },
    ghost: { chaosScroller: 5 }
  },
  scenarios: {
    submit: { internetAnalyst: 5 },
    illusion: { techGoblin: 5 },
    reject: { memeLord: 5 },
    focus: { grindMachine: 5 },
    relapse: { nightScroller: 5 },
    distract: { memeLord: 4 },
    escape: { vibeCurator: 5 },
    rebuild: { techGoblin: 4 },
    adapt: { chaosScroller: 5 }
  }
};

const RECOMMENDATIONS = {
  echo: [{ id: '1', emoji: '<svg class="svg-icon-small"><use href="#icon-zap"></use></svg>', title: 'Why You Are Right', author: 'SYS_ALGO', engagementCount: '2M', description: 'Pure validation.' }],
  sludge: [{ id: '2', emoji: '<svg class="svg-icon-small"><use href="#icon-zap"></use></svg>', title: 'GTA + Family Guy', author: 'SYS_ALGO', engagementCount: '5M', description: 'Brain melt.' }],
  aesthetic: [{ id: '3', emoji: '<svg class="svg-icon-small"><use href="#icon-star"></use></svg>', title: 'Silent Tokyo Vlog', author: 'SYS_ALGO', engagementCount: '800k', description: 'Unreachable vibe.' }],
  outrage: [{ id: '4', emoji: '<svg class="svg-icon-small"><use href="#icon-alert"></use></svg>', title: 'Infuriating Hot Take', author: 'SYS_ALGO', engagementCount: '3M', description: 'Blood pressure rising.' }],
  lore: [{ id: '5', emoji: '<svg class="svg-icon-small"><use href="#icon-tech"></use></svg>', title: '4-Hour Video Essay', author: 'SYS_ALGO', engagementCount: '1.2M', description: 'Niche obsession.' }],
  hustle: [{ id: '6', emoji: '<svg class="svg-icon-small"><use href="#icon-clock"></use></svg>', title: 'WAKE UP AT 4AM', author: 'SYS_ALGO', engagementCount: '400k', description: 'Fake grindset.' }],
  void: [{ id: '7', emoji: '<svg class="svg-icon-small"><use href="#icon-sleep"></use></svg>', title: 'Liminal Space Mix', author: 'SYS_ALGO', engagementCount: '900k', description: 'Existential dread.' }],
  parasocial: [{ id: '8', emoji: '<svg class="svg-icon-small"><use href="#icon-heart"></use></svg>', title: 'Day in my life', author: 'SYS_ALGO', engagementCount: '1.1M', description: 'You feel like you know them.' }]
};

if (typeof window !== 'undefined') {
  window.CONTENT_CATEGORIES = CONTENT_CATEGORIES;
  window.SCROLL_TIME_OPTIONS = SCROLL_TIME_OPTIONS;
  window.ENGAGEMENT_OPTIONS = ENGAGEMENT_OPTIONS;
  window.SCENARIOS = SCENARIOS;
  window.ARCHETYPES = ARCHETYPES;
  window.SCORING_RULES = SCORING_RULES;
  window.RECOMMENDATIONS = RECOMMENDATIONS;
}