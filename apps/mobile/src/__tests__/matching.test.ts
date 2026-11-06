/**
 * Unit tests for the TASK-004 matching engine (src/matching/engine.ts).
 *
 * Tests verify behavioral outcomes — not just that the code runs — covering:
 * - Substantive relevance qualification (T4-B1): budget + category alone must
 *   not qualify an opportunity.
 * - Eligibility status semantics (T4-B2): category-compatible ≠ fully eligible.
 * - Hard learner-category filter.
 * - Scoring component totals and representative final scores.
 * - Deterministic ranking and stable tie-breaking.
 * - Explanation accuracy (reasons only when backed by real data).
 * - Unknown-price budget handling.
 * - Missing/incomplete profile safety.
 * - Catalog integrity.
 */
import { CATALOG } from '../catalog/data';
import { recommend } from '../matching/engine';
import type { OnboardingAnswers } from '../types/onboarding';
import type { Opportunity } from '../catalog/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const HS_CREDIT: OnboardingAnswers = {
  learnerType: 'high-school',
  grade: '12th',
  careerInterest: 'technology',
  goal: 'explore-credit',
  budget: 'free',
};

const HS_CAREER: OnboardingAnswers = {
  learnerType: 'high-school',
  grade: '10th',
  careerInterest: 'technology',
  goal: 'build-career-skills',
  budget: 'up-to-100',
};

const HS_MINIMAL: OnboardingAnswers = {
  learnerType: 'high-school',
  grade: null,
  careerInterest: null,
  goal: null,
  budget: null,
};

const UNI_CREDIT: OnboardingAnswers = {
  learnerType: 'university',
  studyArea: 'computer-science',
  careerInterest: 'technology',
  goal: 'explore-credit',
  budget: 'up-to-100',
  institutionName: 'State University',
};

const UNI_SKILLS: OnboardingAnswers = {
  learnerType: 'university',
  studyArea: 'engineering',
  careerInterest: 'engineering',
  goal: 'build-job-skills',
  budget: 'flexible',
  institutionName: '',
};

const ADULT_TECH_TX: OnboardingAnswers = {
  learnerType: 'adult',
  careerGoal: 'technology',
  careerGoalOther: '',
  goal: 'job-training',
  budget: 'flexible',
  stateRegion: 'TX',
};

const ADULT_TECH_LA: OnboardingAnswers = {
  learnerType: 'adult',
  careerGoal: 'technology',
  careerGoalOther: '',
  goal: 'job-training',
  budget: 'flexible',
  stateRegion: 'LA',
};

const ADULT_RV_LA: OnboardingAnswers = {
  learnerType: 'adult',
  careerGoal: 'something-else',
  careerGoalOther: 'Hospitality compliance',
  goal: 'job-training',
  budget: 'flexible',
  stateRegion: 'LA',
};

const ADULT_MINIMAL: OnboardingAnswers = {
  learnerType: 'adult',
  careerGoal: null,
  careerGoalOther: '',
  goal: null,
  budget: null,
  stateRegion: null,
};

// ─── Catalog IDs ──────────────────────────────────────────────────────────────

const IDS = {
  cisc1: 'cisco-intro-cybersecurity',
  cisc2: 'cisco-networking-basics',
  modernStates: 'modern-states-clep-prep',
  clep: 'clep-exam-program',
  rv: 'louisiana-atc-responsible-vendor',
};

function ids(recs: ReturnType<typeof recommend>): string[] {
  return recs.map((r) => r.opportunity.id);
}

// ─── 1. Substantive match qualification (T4-B1) ───────────────────────────────

describe('substantive match qualification — T4-B1', () => {
  it('budget-only profile returns empty recommendations', () => {
    // budget=flexible but no goal topics and no career topics → no substantive match
    const noTopicProfile: OnboardingAnswers = {
      learnerType: 'adult',
      careerGoal: 'business',   // maps to no catalog topics
      careerGoalOther: '',
      goal: 'build-general-skills', // maps to no catalog topics
      budget: 'flexible',
      stateRegion: null,
    };
    const recs = recommend(noTopicProfile, CATALOG);
    expect(recs).toHaveLength(0);
  });

  it('category-only profile (all nulls) returns empty recommendations', () => {
    // No goal, no career, no location — only category membership → empty
    expect(recommend(HS_MINIMAL, CATALOG)).toHaveLength(0);
    expect(recommend(ADULT_MINIMAL, CATALOG)).toHaveLength(0);
  });

  it('goal match qualifies even without career interest', () => {
    const goalOnly: OnboardingAnswers = {
      learnerType: 'high-school',
      grade: '11th',
      careerInterest: null,
      goal: 'explore-credit',
      budget: null,
    };
    const recs = recommend(goalOnly, CATALOG);
    // explore-credit → alternative-credit topic → CLEP and Modern States qualify
    expect(recs.length).toBeGreaterThan(0);
    recs.forEach((r) => {
      expect(r.matchReasons.some((m) => m.field === 'goal')).toBe(true);
    });
  });

  it('career match qualifies even without goal', () => {
    const careerOnly: OnboardingAnswers = {
      learnerType: 'high-school',
      grade: '10th',
      careerInterest: 'technology',
      goal: null,
      budget: null,
    };
    const recs = recommend(careerOnly, CATALOG);
    // technology → cybersecurity/networking/IT → Cisco courses qualify
    expect(recs.length).toBeGreaterThan(0);
    recs.forEach((r) => {
      expect(r.matchReasons.some((m) => m.field === 'careerInterest')).toBe(true);
    });
  });

  it('location-only profile returns empty recommendations (T4-B3 adversarial case)', () => {
    // Healthcare adult in Louisiana: neither 'build-general-skills' nor
    // 'healthcare' maps to any catalog topic. Location alone must not qualify
    // Responsible Vendor Training. T4-B3 negative test (Test A).
    const healthcareLA: OnboardingAnswers = {
      learnerType: 'adult',
      careerGoal: 'healthcare',
      careerGoalOther: '',
      goal: 'build-general-skills',
      budget: 'flexible',
      stateRegion: 'LA',
    };
    const recs = recommend(healthcareLA, CATALOG);
    expect(recs).toHaveLength(0);
    expect(ids(recs)).not.toContain(IDS.rv);
  });

  it('location adds ranking points only after topical qualification (Test F)', () => {
    // ADULT_RV_LA qualifies via goal (job-training → responsible-vendor topic).
    // Louisiana then adds +10 to an already-qualified item → score 75.
    // This confirms location is a ranking signal, not a gate signal.
    const rv = recommend(ADULT_RV_LA, CATALOG).find((r) => r.opportunity.id === IDS.rv);
    expect(rv).toBeDefined();
    expect(rv?.score).toBe(75); // 15 education + 40 goal + 10 budget + 10 location
    expect(rv?.matchReasons.some((m) => m.field === 'goal')).toBe(true);
    expect(rv?.matchReasons.some((m) => m.field === 'location')).toBe(true);
  });
});

// ─── 2. Louisiana hospitality compliance profile (T4-B1 reproduction) ─────────

describe('Louisiana hospitality compliance profile', () => {
  // Exact scenario from QA-Review-1 Scenario B
  const hospitality: OnboardingAnswers = {
    learnerType: 'adult',
    careerGoal: 'something-else',
    careerGoalOther: 'Hospitality compliance',
    goal: 'job-training',
    budget: 'flexible',
    stateRegion: 'LA',
  };

  it('returns exactly 1 result', () => {
    expect(recommend(hospitality, CATALOG)).toHaveLength(1);
  });

  it('the result is Louisiana Responsible Vendor Training', () => {
    expect(ids(recommend(hospitality, CATALOG))).toEqual([IDS.rv]);
  });

  it('Cisco Introduction to Cybersecurity is excluded', () => {
    expect(ids(recommend(hospitality, CATALOG))).not.toContain(IDS.cisc1);
  });

  it('Cisco Networking Basics is excluded', () => {
    expect(ids(recommend(hospitality, CATALOG))).not.toContain(IDS.cisc2);
  });

  it('Louisiana RV has goal and location match reasons', () => {
    const rv = recommend(hospitality, CATALOG)[0];
    expect(rv.matchReasons.some((m) => m.field === 'goal')).toBe(true);
    expect(rv.matchReasons.some((m) => m.field === 'location')).toBe(true);
  });

  it('Louisiana RV has confirm-with-employer caveat', () => {
    const rv = recommend(hospitality, CATALOG)[0];
    expect(rv.eligibilityCaveats.some((c) => c.kind === 'confirm-with-employer')).toBe(true);
  });
});

// ─── 3. High school learner — explore-credit, technology, free ────────────────

describe('high school learner — explore-credit, technology, free', () => {
  const recs = recommend(HS_CREDIT, CATALOG);

  it('returns 4 results (all non-adult items have substantive matches)', () => {
    expect(recs).toHaveLength(4);
  });

  it('excludes Louisiana RV training (adult-only hard filter)', () => {
    expect(ids(recs)).not.toContain(IDS.rv);
  });

  it('Modern States ranks first (goal + career + budget = 65 pts)', () => {
    expect(recs[0].opportunity.id).toBe(IDS.modernStates);
    expect(recs[0].score).toBe(65); // 15 education + 40 goal + 10 budget
  });

  it('CLEP ranks second (goal = 55 pts; $97 is not free)', () => {
    expect(recs[1].opportunity.id).toBe(IDS.clep);
    expect(recs[1].score).toBe(55); // 15 education + 40 goal (not free → no budget)
  });

  it('Cisco courses score 50 pts each (career + budget)', () => {
    const cisco1 = recs.find((r) => r.opportunity.id === IDS.cisc1);
    const cisco2 = recs.find((r) => r.opportunity.id === IDS.cisc2);
    expect(cisco1?.score).toBe(50); // 15 + 25 career + 10 budget
    expect(cisco2?.score).toBe(50);
  });

  it('free opportunities have a budget match reason', () => {
    const ms = recs.find((r) => r.opportunity.id === IDS.modernStates);
    expect(ms?.matchReasons.some((m) => m.field === 'budget')).toBe(true);
  });

  it('$97 CLEP does not have a budget match reason (not free)', () => {
    const clep = recs.find((r) => r.opportunity.id === IDS.clep);
    expect(clep?.matchReasons.every((m) => m.field !== 'budget')).toBe(true);
  });
});

// ─── 4. High school — career skills goal (no goal-topic mapping) ──────────────

describe('high school learner — build-career-skills, technology', () => {
  const recs = recommend(HS_CAREER, CATALOG);

  it('returns 2 results (only Cisco courses; Modern States/CLEP have no match)', () => {
    expect(recs).toHaveLength(2);
  });

  it('excludes Modern States (no goal-topic match for build-career-skills)', () => {
    expect(ids(recs)).not.toContain(IDS.modernStates);
  });

  it('excludes CLEP (no goal-topic match for build-career-skills)', () => {
    expect(ids(recs)).not.toContain(IDS.clep);
  });

  it('Cisco courses have career interest match reason', () => {
    recs.forEach((r) => {
      expect(r.matchReasons.some((m) => m.field === 'careerInterest')).toBe(true);
    });
  });

  it('no goal match reason (build-career-skills has no specific catalog topic)', () => {
    recs.forEach((r) => {
      expect(r.matchReasons.every((m) => m.field !== 'goal')).toBe(true);
    });
  });
});

// ─── 5. University learner receives relevant recommendations ──────────────────

describe('university learner — explore-credit, computer-science', () => {
  const recs = recommend(UNI_CREDIT, CATALOG);

  it('returns 4 results (all non-adult items have substantive matches)', () => {
    expect(recs).toHaveLength(4);
  });

  it('excludes Louisiana RV training (adult-only)', () => {
    expect(ids(recs)).not.toContain(IDS.rv);
  });

  it('CLEP and Modern States appear in top 2 (highest goal+career scores)', () => {
    const top2 = ids(recs).slice(0, 2);
    expect(top2).toContain(IDS.clep);
    expect(top2).toContain(IDS.modernStates);
  });

  it('credit disclaimer caveat on CLEP', () => {
    const clep = recs.find((r) => r.opportunity.id === IDS.clep);
    expect(clep?.eligibilityCaveats.some((c) => c.kind === 'credit-not-guaranteed')).toBe(true);
  });

  it('credit disclaimer caveat on Modern States', () => {
    const ms = recs.find((r) => r.opportunity.id === IDS.modernStates);
    expect(ms?.eligibilityCaveats.some((c) => c.kind === 'credit-not-guaranteed')).toBe(true);
  });
});

// ─── 6. Adult learner — technology, non-Louisiana ─────────────────────────────

describe('adult learner — technology, job-training, Texas', () => {
  const recs = recommend(ADULT_TECH_TX, CATALOG);

  it('returns 3 results (adult-eligible with substantive matches)', () => {
    expect(recs).toHaveLength(3);
  });

  it('excludes Modern States and CLEP (high-school/university only)', () => {
    expect(ids(recs)).not.toContain(IDS.modernStates);
    expect(ids(recs)).not.toContain(IDS.clep);
  });

  it('Louisiana RV is included (adult category, goal=job-training matches)', () => {
    expect(ids(recs)).toContain(IDS.rv);
  });

  it('Louisiana RV scores 65 pts (15+40 goal+10 budget; no location bonus)', () => {
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    expect(rv?.score).toBe(65); // 15+40+10; not in Louisiana so no +10 location
  });

  it('Louisiana RV has a location-dependent caveat for non-LA learner', () => {
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    expect(rv?.eligibilityCaveats.some((c) => c.kind === 'location-dependent')).toBe(true);
  });

  it('Louisiana RV does NOT have a location match reason', () => {
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    expect(rv?.matchReasons.every((m) => m.field !== 'location')).toBe(true);
  });

  it('Louisiana RV ranks first (highest score)', () => {
    expect(recs[0].opportunity.id).toBe(IDS.rv);
  });
});

// ─── 7. Adult learner — Louisiana ────────────────────────────────────────────

describe('adult learner — technology, job-training, Louisiana', () => {
  const recs = recommend(ADULT_TECH_LA, CATALOG);

  it('Louisiana RV scores 75 pts (15+40+10+10)', () => {
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    expect(rv?.score).toBe(75); // 15 + 40 goal + 10 budget + 10 location
  });

  it('Louisiana RV ranks first (highest score)', () => {
    expect(recs[0].opportunity.id).toBe(IDS.rv);
  });

  it('Louisiana RV has a location match reason', () => {
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    expect(rv?.matchReasons.some((m) => m.field === 'location')).toBe(true);
  });

  it('Louisiana RV does NOT have a location-dependent caveat for LA learner', () => {
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    expect(rv?.eligibilityCaveats.every((c) => c.kind !== 'location-dependent')).toBe(true);
  });

  it('Cisco courses are included (technology career match)', () => {
    expect(ids(recs)).toContain(IDS.cisc1);
    expect(ids(recs)).toContain(IDS.cisc2);
  });

  it('Cisco courses score 50 pts (15+25 career+10 budget; no location, not LA-specific)', () => {
    const cisco = recs.find((r) => r.opportunity.id === IDS.cisc1);
    expect(cisco?.score).toBe(50); // 15+25+10; Cisco is online/not LA-specific
  });
});

// ─── 8. Hard eligibility constraint ──────────────────────────────────────────

describe('hard eligibility constraint', () => {
  it('adult learner never sees university-only items', () => {
    const returned = ids(recommend(ADULT_TECH_TX, CATALOG));
    expect(returned).not.toContain(IDS.modernStates);
    expect(returned).not.toContain(IDS.clep);
  });

  it('high school learner never sees adult-only items', () => {
    expect(ids(recommend(HS_CREDIT, CATALOG))).not.toContain(IDS.rv);
  });

  it('university learner never sees adult-only items', () => {
    expect(ids(recommend(UNI_CREDIT, CATALOG))).not.toContain(IDS.rv);
  });

  it('unsupported learner type returns empty array without crashing', () => {
    const invalid = {
      learnerType: 'unsupported-type',
      goal: null,
      budget: null,
    } as unknown as OnboardingAnswers;
    expect(() => recommend(invalid, CATALOG)).not.toThrow();
    expect(recommend(invalid, CATALOG)).toHaveLength(0);
  });
});

// ─── 9. Eligibility status semantics (T4-B2) ─────────────────────────────────

describe('eligibility status — T4-B2', () => {
  it('all recommendations have eligibilityStatus category-compatible', () => {
    const profiles: OnboardingAnswers[] = [HS_CREDIT, UNI_CREDIT, ADULT_TECH_TX, ADULT_RV_LA];
    for (const answers of profiles) {
      recommend(answers, CATALOG).forEach((r) => {
        expect(r.eligibilityStatus).toBe('category-compatible');
      });
    }
  });

  it('category-compatible does not mean prerequisites are confirmed satisfied', () => {
    // CLEP has learner-category match but its institutional credit policies are
    // not independently verified. The status must be category-compatible, not eligible.
    const recs = recommend(HS_CREDIT, CATALOG);
    const clep = recs.find((r) => r.opportunity.id === IDS.clep);
    expect(clep?.eligibilityStatus).toBe('category-compatible');
    // The separate caveat must still carry the accurate disclaimer.
    expect(clep?.eligibilityCaveats.some((c) => c.kind === 'credit-not-guaranteed')).toBe(true);
  });

  it('credit is not presented as guaranteed through any status or score', () => {
    const recs = recommend(HS_CREDIT, CATALOG);
    const clep = recs.find((r) => r.opportunity.id === IDS.clep);
    clep?.eligibilityCaveats.forEach((c) => {
      if (c.label.toLowerCase().includes('guaranteed')) {
        expect(c.label.toLowerCase()).toContain('not guaranteed');
      }
    });
  });
});

// ─── 10. Missing optional data handled safely ─────────────────────────────────

describe('missing optional fields', () => {
  it('high school with all nulls returns empty recommendations (no substantive match)', () => {
    expect(recommend(HS_MINIMAL, CATALOG)).toHaveLength(0);
  });

  it('adult with null careerGoal and null goal returns empty recommendations', () => {
    expect(recommend(ADULT_MINIMAL, CATALOG)).toHaveLength(0);
  });

  it('profile with goal only (no career) does not crash', () => {
    const goalOnly: OnboardingAnswers = {
      learnerType: 'university',
      studyArea: null,
      careerInterest: null,
      goal: 'explore-credit',
      budget: null,
      institutionName: '',
    };
    expect(() => recommend(goalOnly, CATALOG)).not.toThrow();
  });

  it('null budget produces no budget match reason', () => {
    const recs = recommend({ ...HS_CREDIT, budget: null }, CATALOG);
    recs.forEach((r) => {
      expect(r.matchReasons.every((m) => m.field !== 'budget')).toBe(true);
    });
  });
});

// ─── 11. Unknown-price budget handling ───────────────────────────────────────

describe('unknown-price budget handling', () => {
  // Louisiana RV has price.kind='unknown'. Only flexible budget matches it.

  it('unknown price is never matched as free budget', () => {
    const recs = recommend({ ...ADULT_TECH_LA, budget: 'free' }, CATALOG);
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    if (rv) {
      expect(rv.matchReasons.every((m) => m.field !== 'budget')).toBe(true);
    }
  });

  it('unknown price matches flexible budget', () => {
    const recs = recommend({ ...ADULT_TECH_LA, budget: 'flexible' }, CATALOG);
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    expect(rv).toBeDefined();
    expect(rv?.matchReasons.some((m) => m.field === 'budget')).toBe(true);
  });

  it('unknown price is not matched as up-to-25 budget', () => {
    const recs = recommend({ ...ADULT_TECH_LA, budget: 'up-to-25' }, CATALOG);
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    if (rv) {
      expect(rv.matchReasons.every((m) => m.field !== 'budget')).toBe(true);
    }
  });

  it('unknown price is not matched as up-to-100 budget', () => {
    const recs = recommend({ ...ADULT_TECH_LA, budget: 'up-to-100' }, CATALOG);
    const rv = recs.find((r) => r.opportunity.id === IDS.rv);
    if (rv) {
      expect(rv.matchReasons.every((m) => m.field !== 'budget')).toBe(true);
    }
  });

  it('free opportunity is correctly matched for free budget', () => {
    // Cisco courses are free and should receive budget reason with free budget
    const recs = recommend(HS_CREDIT, CATALOG); // budget=free
    const cisco = recs.find((r) => r.opportunity.id === IDS.cisc1);
    expect(cisco?.matchReasons.some((m) => m.field === 'budget')).toBe(true);
  });
});

// ─── 12. Scores within 0–100 ──────────────────────────────────────────────────

describe('score bounds', () => {
  const allAnswers: OnboardingAnswers[] = [
    HS_CREDIT, HS_CAREER,
    UNI_CREDIT, UNI_SKILLS,
    ADULT_TECH_TX, ADULT_TECH_LA, ADULT_RV_LA,
  ];

  it.each(allAnswers.map((a) => [a.learnerType + '/' + (a.goal ?? 'null'), a]))(
    'all scores in [0, 100] for %s',
    (_label, answers) => {
      recommend(answers as OnboardingAnswers, CATALOG).forEach((r) => {
        expect(r.score).toBeGreaterThanOrEqual(0);
        expect(r.score).toBeLessThanOrEqual(100);
      });
    },
  );
});

// ─── 13. Ranking is deterministic ────────────────────────────────────────────

describe('determinism', () => {
  it('same answers produce identical result order across multiple calls', () => {
    expect(ids(recommend(UNI_CREDIT, CATALOG))).toEqual(ids(recommend(UNI_CREDIT, CATALOG)));
  });

  it('scores are identical across calls', () => {
    const r1 = recommend(ADULT_TECH_LA, CATALOG);
    const r2 = recommend(ADULT_TECH_LA, CATALOG);
    expect(r1.map((r) => r.score)).toEqual(r2.map((r) => r.score));
  });
});

// ─── 14. Stable tie-breaking ─────────────────────────────────────────────────

describe('stable tie-breaking', () => {
  it('tied-score items are sorted by title ascending', () => {
    // Both Cisco courses get career match (technology) but no goal and no budget
    // → both score 15+25=40; tie resolved by title.
    const tieProfile: OnboardingAnswers = {
      learnerType: 'high-school',
      grade: '10th',
      careerInterest: 'technology',
      goal: null,     // no goal → no GOAL pts
      budget: null,   // no budget → no BUDGET pts
    };
    const recs = recommend(tieProfile, CATALOG);
    const ciscoRecs = recs.filter((r) => r.opportunity.id.startsWith('cisco'));

    // First assert the tie actually exists
    expect(ciscoRecs).toHaveLength(2);
    expect(ciscoRecs[0].score).toBe(40); // 15 + 25 career
    expect(ciscoRecs[1].score).toBe(40);
    expect(ciscoRecs[0].score).toBe(ciscoRecs[1].score);

    // Then assert title-ascending tie-breaking
    expect(ciscoRecs[0].opportunity.id).toBe(IDS.cisc1); // "Introduction to Cybersecurity"
    expect(ciscoRecs[1].opportunity.id).toBe(IDS.cisc2); // "Networking Basics"
    expect(
      ciscoRecs[0].opportunity.title.localeCompare(ciscoRecs[1].opportunity.title),
    ).toBeLessThan(0);
  });
});

// ─── 15. Explanation accuracy ────────────────────────────────────────────────

describe('explanation accuracy', () => {
  it('goal reason only appears when opp.topics intersect goal-derived topics', () => {
    recommend(HS_CREDIT, CATALOG).forEach((r) => {
      if (r.matchReasons.some((m) => m.field === 'goal')) {
        // explore-credit → alternative-credit
        expect(r.opportunity.topics).toContain('alternative-credit');
      }
    });
  });

  it('career interest reason only appears when opp.topics intersect career-derived topics', () => {
    const techTopics = ['cybersecurity', 'networking', 'information-technology'];
    recommend(HS_CREDIT, CATALOG).forEach((r) => {
      if (r.matchReasons.some((m) => m.field === 'careerInterest')) {
        expect(r.opportunity.topics.some((t) => techTopics.includes(t))).toBe(true);
      }
    });
  });

  it('budget reason only appears when price actually fits stated budget', () => {
    // budget=free: only actually-free items should have a budget reason
    recommend(HS_CREDIT, CATALOG).forEach((r) => {
      if (r.matchReasons.some((m) => m.field === 'budget')) {
        expect(r.opportunity.price.kind).toBe('free');
      }
    });
  });

  it('location reason only appears for Louisiana-specific opportunities with LA learner', () => {
    recommend(ADULT_TECH_LA, CATALOG).forEach((r) => {
      if (r.matchReasons.some((m) => m.field === 'location')) {
        const juris = r.opportunity.availability.jurisdictions;
        expect(juris).not.toBeNull();
        expect(juris?.includes('Louisiana') || juris?.includes('LA')).toBe(true);
      }
    });
  });

  it('no fabricated explanations — reason labels reference real data', () => {
    // Verify reason label text is non-empty and does not contain the words
    // "guaranteed", "promised", or "confirmed credit" as affirmative claims.
    recommend(HS_CREDIT, CATALOG).forEach((r) => {
      r.matchReasons.forEach((m) => {
        expect(m.label.trim().length).toBeGreaterThan(0);
        const lower = m.label.toLowerCase();
        // "not guaranteed" is acceptable; bare "guaranteed" is not
        if (lower.includes('guaranteed') && !lower.includes('not guaranteed')) {
          throw new Error(`Fabricated guarantee claim in reason: "${m.label}"`);
        }
      });
    });
  });
});

// ─── 16. Catalog integrity ────────────────────────────────────────────────────

describe('catalog integrity', () => {
  it('catalog contains exactly 5 records', () => {
    expect(CATALOG).toHaveLength(5);
  });

  it('catalog IDs match expected set', () => {
    expect([...CATALOG].map((o) => o.id).sort()).toEqual(Object.values(IDS).sort());
  });

  it('recommend does not mutate the catalog', () => {
    const before = JSON.stringify(CATALOG);
    recommend(HS_CREDIT, CATALOG);
    expect(JSON.stringify(CATALOG)).toBe(before);
  });
});

// ─── 17. Empty catalog ───────────────────────────────────────────────────────

describe('empty catalog', () => {
  const empty: readonly Opportunity[] = [];

  it('returns empty array for all learner types', () => {
    expect(recommend(HS_CREDIT, empty)).toEqual([]);
    expect(recommend(UNI_CREDIT, empty)).toEqual([]);
    expect(recommend(ADULT_TECH_TX, empty)).toEqual([]);
  });
});
