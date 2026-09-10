const AlgorithmEngine = {
  calculateScores(userProfile = {}) {
    const archetypeList = (typeof ARCHETYPES !== 'undefined') ? ARCHETYPES : (window.ARCHETYPES || []);
    const scores = {};
    archetypeList.forEach(arch => { scores[arch.id] = 0; });
    const rules = (typeof SCORING_RULES !== 'undefined') ? SCORING_RULES : (window.SCORING_RULES || {});

    const selectedCategories = userProfile.contentPreferences || userProfile.categories || [];
    selectedCategories.forEach(catId => {
      const categoryWeights = rules.categories && rules.categories[catId];
      if (categoryWeights) {
        Object.keys(categoryWeights).forEach(archId => {
          if (scores[archId] !== undefined) scores[archId] += categoryWeights[archId];
        });
      }
    });

    const selectedTime = userProfile.preferredTime || userProfile.scrollTime;
    if (selectedTime && rules.time && rules.time[selectedTime]) {
      const timeWeights = rules.time[selectedTime];
      Object.keys(timeWeights).forEach(archId => {
        if (scores[archId] !== undefined) scores[archId] += timeWeights[archId];
      });
    }

    const selectedEngagements = userProfile.behaviours || userProfile.engagements || [];
    selectedEngagements.forEach(engId => {
      const engWeights = rules.engagements && rules.engagements[engId];
      if (engWeights) {
        Object.keys(engWeights).forEach(archId => {
          if (scores[archId] !== undefined) scores[archId] += engWeights[archId];
        });
      }
    });

    const scenarioChoices = userProfile.personalityChoices || userProfile.scenarioAnswers || [];
    scenarioChoices.forEach(choiceId => {
      if (choiceId && rules.scenarios && rules.scenarios[choiceId]) {
        const scenarioWeights = rules.scenarios[choiceId];
        Object.keys(scenarioWeights).forEach(archId => {
          if (scores[archId] !== undefined) scores[archId] += scenarioWeights[archId];
        });
      }
    });
    return scores;
  },

  determineArchetype(scores = {}) {
    const archetypeList = (typeof ARCHETYPES !== 'undefined') ? ARCHETYPES : (window.ARCHETYPES || []);
    if (!archetypeList || archetypeList.length === 0) return null;
    const archetypeMap = {};
    archetypeList.forEach(a => { archetypeMap[a.id] = a; });
    const candidateIds = Object.keys(scores);
    if (candidateIds.length === 0) return archetypeList[0];
    const winningId = candidateIds.reduce((highestId, currentId) => {
      const currentScore = scores[currentId] || 0;
      const highestScore = scores[highestId] || 0;
      if (currentScore > highestScore) return currentId;
      if (currentScore === highestScore) {
        const currentPriority = archetypeMap[currentId]?.priority ?? 99;
        const highestPriority = archetypeMap[highestId]?.priority ?? 99;
        return currentPriority < highestPriority ? currentId : highestId;
      }
      return highestId;
    }, candidateIds[0]);
    return archetypeMap[winningId] || archetypeList[0];
  },

  calculatePercentages(userProfile = {}) {
    const categoriesPool = (typeof CONTENT_CATEGORIES !== 'undefined') ? CONTENT_CATEGORIES : (window.CONTENT_CATEGORIES || []);
    const selectedIds = userProfile.contentPreferences || userProfile.categories || [];
    const validIds = selectedIds.length > 0 ? selectedIds : ['sludge', 'echo', 'void'];
    const selectedMeta = validIds.map(id => categoriesPool.find(c => c.id === id)).filter(Boolean);
    const count = selectedMeta.length;
    if (count === 0) return [];
    const rawWeights = selectedMeta.map((_, index) => Math.max(10, 40 - index * 6));
    const totalWeight = rawWeights.reduce((sum, w) => sum + w, 0);
    let remainingPercentage = 100;
    const dnaList = selectedMeta.map((cat, index) => {
      const isLast = (index === count - 1);
      const calculatedPct = isLast ? remainingPercentage : Math.round((rawWeights[index] / totalWeight) * 100);
      remainingPercentage -= calculatedPct;
      return { id: cat.id, label: cat.label, icon: cat.icon, percentage: Math.max(1, calculatedPct) };
    });
    return dnaList.sort((a, b) => b.percentage - a.percentage);
  },

  calculateCompatibilityScore(userProfile = {}) {
    const categoryCount = (userProfile.contentPreferences || userProfile.categories || []).length;
    const engagementCount = (userProfile.behaviours || userProfile.engagements || []).length;
    const minutes = Number(userProfile.scrollMinutes) || 60;
    const scenarioCount = (userProfile.personalityChoices || userProfile.scenarioAnswers || []).filter(Boolean).length;
    const base = 60;
    const categoryFactor = Math.min(15, categoryCount * 2.5);
    const engagementFactor = Math.min(12, engagementCount * 3);
    const timeFactor = Math.min(8, Math.round((minutes / 120) * 8));
    const scenarioFactor = scenarioCount * 1.5;
    const rawScore = Math.round(base + categoryFactor + engagementFactor + timeFactor + scenarioFactor);
    return Math.min(99.9, Math.max(65.4, rawScore + 0.3));
  },

  calculateScrollingStats(dailyMinutes = 60) {
    const minutes = Math.max(5, Number(dailyMinutes) || 60);
    const weeklyMinutes = minutes * 7;
    const annualMinutes = minutes * 365;
    const annualHours = Math.round(annualMinutes / 60);
    const annualDays = (annualMinutes / (60 * 24)).toFixed(1);
    return { dailyMinutes: minutes, weeklyMinutes, annualMinutes, annualHours, annualDays };
  },

  // ===== FEATURE 1-7: CONSTRAINT ENGINE =====
  ConstraintEngine: {
    basePool: 10000,
    activeConstraints: [],
    metaLimit: 100,
    chaosBudget: 0,

    checkContradiction(constraintId, userProfile) {
      const isBlockingFavorite = (userProfile.contentPreferences || []).includes(constraintId);
      if (isBlockingFavorite) {
        return {
          conflict: true,
          rule: `BLOCK: ${constraintId.toUpperCase()}`,
          behaviour: `HIGH AFFINITY OBSERVED`,
          confidence: Math.floor(Math.random() * (98 - 75) + 75)
        };
      }
      return { conflict: false };
    },

    simulateImpact(constraintsList) {
      let currentPool = this.basePool;
      let discovery = 100;
      let predictable = 50;
      constraintsList.forEach((c, index) => {
        const drop = Math.floor(currentPool * (0.2 + (index * 0.05)));
        currentPool -= drop;
        discovery = Math.max(5, discovery - 20);
        predictable = Math.min(99, predictable + 10);
      });
      return {
        poolSize: currentPool,
        discoveryPct: discovery,
        predictabilityPct: predictable,
        collisionState: constraintsList.length > 2 ? 'HIGH' : constraintsList.length > 0 ? 'MODERATE' : 'LOW'
      };
    },

    getStressTestReport(constraints, profile) {
      if (!constraints || constraints.length === 0) return null;
      return {
        mostRestrictive: constraints[0] ? `BLOCK: ${constraints[0].toUpperCase()}` : 'NONE',
        mostContradictory: constraints[constraints.length - 1] ? `BLOCK: ${constraints[constraints.length - 1].toUpperCase()}` : 'NONE',
        discoveryLoss: (constraints.length * 20) + '%'
      };
    },

    regenerateFeed(baseFeed, categoriesPool, allRecommendations, chaosBudget) {
      let updatedFeed = [...baseFeed];
      if (chaosBudget > 5 && updatedFeed.length > 0) {
        const allKeys = Object.keys(allRecommendations || {});
        if (allKeys.length > 0) {
          let randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
          let chaosPost = allRecommendations[randomKey][0];
          if (chaosPost) {
            updatedFeed[updatedFeed.length - 1] = {
              ...chaosPost,
              title: `[CHAOS EXPLOIT] ${chaosPost.title}`
            };
          }
        }
      }
      return updatedFeed;
    }
  },

  generateFeed(userProfile = {}, archetype = {}) {
    const pool = (typeof RECOMMENDATIONS !== 'undefined') ? RECOMMENDATIONS : (window.RECOMMENDATIONS || {});
    const userCategories = userProfile.contentPreferences || userProfile.categories || [];
    const archetypeCategories = archetype.recommendationCategories || [];
    const mergedCategories = Array.from(new Set([...userCategories, ...archetypeCategories]));
    const feed = [];
    mergedCategories.forEach(catId => {
      const postsForCategory = pool[catId];
      if (postsForCategory && postsForCategory.length > 0) {
        feed.push(postsForCategory[0]);
      }
    });
    if (feed.length === 0 && pool.sludge) feed.push(...pool.sludge.slice(0, 3));
    return feed.slice(0, 4);
  },

  generateRoast(archetype = {}) {
    return archetype.roast || 'Your algorithm has analyzed your digital footprint and politely chosen not to comment.';
  }
};
if (typeof window !== 'undefined') { window.AlgorithmEngine = AlgorithmEngine; }