import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  filterByPeriod,
  computeStats,
  buildActivityData,
  computeTopIssues,
  computeTopSections,
  getRecentCases,
  formatRelativeTime,
} from './analyticsUtils.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns an ISO string for `daysAgo` days before now. */
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const makeCase = (overrides = {}) => ({
  _id: Math.random().toString(36).slice(2),
  case_text: 'Sample case text',
  retrieved_sections: [],
  analysis: {
    summary: 'Summary',
    applicable_sections: [],
    legal_issues: [],
    loopholes: [],
    recommended_actions: [],
  },
  created_at: daysAgo(0),
  ...overrides,
})

// ---------------------------------------------------------------------------
// filterByPeriod
// ---------------------------------------------------------------------------

describe('filterByPeriod', () => {
  it('returns all cases for period "all"', () => {
    const cases = [makeCase({ created_at: daysAgo(400) }), makeCase({ created_at: daysAgo(1) })]
    expect(filterByPeriod(cases, 'all')).toHaveLength(2)
  })

  it('filters to last 7 days', () => {
    const cases = [
      makeCase({ created_at: daysAgo(3) }),   // inside
      makeCase({ created_at: daysAgo(6) }),   // inside
      makeCase({ created_at: daysAgo(8) }),   // outside
      makeCase({ created_at: daysAgo(30) }),  // outside
    ]
    const result = filterByPeriod(cases, '7d')
    expect(result).toHaveLength(2)
  })

  it('filters to last 30 days', () => {
    const cases = [
      makeCase({ created_at: daysAgo(1) }),
      makeCase({ created_at: daysAgo(29) }),
      makeCase({ created_at: daysAgo(31) }),
    ]
    expect(filterByPeriod(cases, '30d')).toHaveLength(2)
  })

  it('filters to last 90 days', () => {
    const cases = [
      makeCase({ created_at: daysAgo(45) }),
      makeCase({ created_at: daysAgo(91) }),
    ]
    expect(filterByPeriod(cases, '90d')).toHaveLength(1)
  })

  it('filters to last 365 days', () => {
    const cases = [
      makeCase({ created_at: daysAgo(100) }),
      makeCase({ created_at: daysAgo(366) }),
    ]
    expect(filterByPeriod(cases, '1y')).toHaveLength(1)
  })

  it('returns empty array for empty input', () => {
    expect(filterByPeriod([], '30d')).toEqual([])
  })

  it('returns all cases for unknown period', () => {
    const cases = [makeCase(), makeCase()]
    expect(filterByPeriod(cases, 'unknown')).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// computeStats
// ---------------------------------------------------------------------------

describe('computeStats', () => {
  it('returns zeros for empty array', () => {
    expect(computeStats([])).toEqual({
      total: 0,
      withAnalysis: 0,
      uniqueSections: 0,
      uniqueIssues: 0,
      totalLoopholes: 0,
    })
  })

  it('counts total cases', () => {
    const cases = [makeCase(), makeCase(), makeCase()]
    expect(computeStats(cases).total).toBe(3)
  })

  it('counts cases with non-empty analysis', () => {
    const withAnalysis = makeCase({
      analysis: { summary: 'x', applicable_sections: ['s1'], legal_issues: [], loopholes: [], recommended_actions: [] },
    })
    const withoutAnalysis = makeCase({ analysis: {} })
    const nullAnalysis = makeCase({ analysis: null })
    const result = computeStats([withAnalysis, withoutAnalysis, nullAnalysis])
    expect(result.withAnalysis).toBe(1)
  })

  it('counts unique sections case-insensitively', () => {
    const cases = [
      makeCase({ analysis: { applicable_sections: ['Section 1', 'section 1', 'SECTION 2'], legal_issues: [], loopholes: [], recommended_actions: [] } }),
    ]
    expect(computeStats(cases).uniqueSections).toBe(2)
  })

  it('counts unique issues case-insensitively', () => {
    const cases = [
      makeCase({ analysis: { applicable_sections: [], legal_issues: ['Fraud', 'fraud', 'Theft'], loopholes: [], recommended_actions: [] } }),
    ]
    expect(computeStats(cases).uniqueIssues).toBe(2)
  })

  it('sums loopholes across all cases', () => {
    const cases = [
      makeCase({ analysis: { applicable_sections: [], legal_issues: [], loopholes: ['a', 'b'], recommended_actions: [] } }),
      makeCase({ analysis: { applicable_sections: [], legal_issues: [], loopholes: ['c'], recommended_actions: [] } }),
    ]
    expect(computeStats(cases).totalLoopholes).toBe(3)
  })

  it('handles cases with missing analysis fields gracefully', () => {
    const cases = [makeCase({ analysis: undefined }), makeCase({ analysis: null })]
    const result = computeStats(cases)
    expect(result.total).toBe(2)
    expect(result.withAnalysis).toBe(0)
    expect(result.totalLoopholes).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// buildActivityData
// ---------------------------------------------------------------------------

describe('buildActivityData', () => {
  it('returns empty array for empty cases', () => {
    expect(buildActivityData([], '30d')).toEqual([])
  })

  it('buckets by day for 7d period', () => {
    const cases = [
      makeCase({ created_at: daysAgo(1) }),
      makeCase({ created_at: daysAgo(1) }),
      makeCase({ created_at: daysAgo(3) }),
    ]
    const result = buildActivityData(cases, '7d')
    const total = result.reduce((s, b) => s + b.count, 0)
    expect(total).toBe(3)
    // Two distinct days
    expect(result).toHaveLength(2)
  })

  it('buckets by day for 30d period', () => {
    const cases = [makeCase({ created_at: daysAgo(5) }), makeCase({ created_at: daysAgo(10) })]
    const result = buildActivityData(cases, '30d')
    expect(result).toHaveLength(2)
    result.forEach((b) => expect(b.label).not.toMatch(/^Week of/))
  })

  it('buckets by week for 90d period', () => {
    const cases = [makeCase({ created_at: daysAgo(10) }), makeCase({ created_at: daysAgo(10) })]
    const result = buildActivityData(cases, '90d')
    expect(result).toHaveLength(1)
    expect(result[0].label).toMatch(/^Week of/)
    expect(result[0].count).toBe(2)
  })

  it('buckets by week for 1y period', () => {
    const cases = [makeCase({ created_at: daysAgo(100) }), makeCase({ created_at: daysAgo(200) })]
    const result = buildActivityData(cases, '1y')
    expect(result).toHaveLength(2)
    result.forEach((b) => expect(b.label).toMatch(/^Week of/))
  })

  it('returns results sorted chronologically', () => {
    const cases = [
      makeCase({ created_at: daysAgo(5) }),
      makeCase({ created_at: daysAgo(1) }),
      makeCase({ created_at: daysAgo(3) }),
    ]
    const result = buildActivityData(cases, '7d')
    const labels = result.map((b) => b.label)
    const sorted = [...labels].sort()
    // Chronological order means earlier dates come first
    expect(result[0].label).not.toBe(result[result.length - 1].label)
  })
})

// ---------------------------------------------------------------------------
// computeTopIssues
// ---------------------------------------------------------------------------

describe('computeTopIssues', () => {
  it('returns empty array for empty cases', () => {
    expect(computeTopIssues([])).toEqual([])
  })

  it('counts issues case-insensitively', () => {
    const cases = [
      makeCase({ analysis: { legal_issues: ['Fraud', 'fraud'], applicable_sections: [], loopholes: [], recommended_actions: [] } }),
      makeCase({ analysis: { legal_issues: ['FRAUD'], applicable_sections: [], loopholes: [], recommended_actions: [] } }),
    ]
    const result = computeTopIssues(cases)
    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(3)
  })

  it('uses first occurrence as display name', () => {
    const cases = [
      makeCase({ analysis: { legal_issues: ['Fraud'], applicable_sections: [], loopholes: [], recommended_actions: [] } }),
      makeCase({ analysis: { legal_issues: ['fraud'], applicable_sections: [], loopholes: [], recommended_actions: [] } }),
    ]
    const result = computeTopIssues(cases)
    expect(result[0].name).toBe('Fraud')
  })

  it('respects limit parameter', () => {
    const issues = ['A', 'B', 'C', 'D', 'E', 'F']
    const cases = issues.map((i) =>
      makeCase({ analysis: { legal_issues: [i], applicable_sections: [], loopholes: [], recommended_actions: [] } })
    )
    expect(computeTopIssues(cases, 3)).toHaveLength(3)
  })

  it('sorts by count descending', () => {
    // Fraud appears in 3 cases, Theft in 2 — Fraud should rank first
    const cases = [
      makeCase({ analysis: { legal_issues: ['Fraud'], applicable_sections: [], loopholes: [], recommended_actions: [] } }),
      makeCase({ analysis: { legal_issues: ['Fraud', 'Theft'], applicable_sections: [], loopholes: [], recommended_actions: [] } }),
      makeCase({ analysis: { legal_issues: ['Fraud', 'Theft'], applicable_sections: [], loopholes: [], recommended_actions: [] } }),
    ]
    const result = computeTopIssues(cases)
    expect(result[0].name).toBe('Fraud')
    expect(result[0].count).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// computeTopSections
// ---------------------------------------------------------------------------

describe('computeTopSections', () => {
  it('returns empty array for empty cases', () => {
    expect(computeTopSections([])).toEqual([])
  })

  it('deduplicates sections case-insensitively', () => {
    const cases = [
      makeCase({ analysis: { applicable_sections: ['Section 302', 'section 302'], legal_issues: [], loopholes: [], recommended_actions: [] } }),
    ]
    const result = computeTopSections(cases)
    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(2)
  })

  it('respects limit parameter', () => {
    const sections = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']
    const cases = sections.map((s) =>
      makeCase({ analysis: { applicable_sections: [s], legal_issues: [], loopholes: [], recommended_actions: [] } })
    )
    expect(computeTopSections(cases, 2)).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// getRecentCases
// ---------------------------------------------------------------------------

describe('getRecentCases', () => {
  it('returns empty array for empty input', () => {
    expect(getRecentCases([])).toEqual([])
  })

  it('sorts by created_at descending', () => {
    const cases = [
      makeCase({ created_at: daysAgo(5) }),
      makeCase({ created_at: daysAgo(1) }),
      makeCase({ created_at: daysAgo(3) }),
    ]
    const result = getRecentCases(cases, 3)
    expect(new Date(result[0].created_at) >= new Date(result[1].created_at)).toBe(true)
    expect(new Date(result[1].created_at) >= new Date(result[2].created_at)).toBe(true)
  })

  it('respects limit parameter', () => {
    const cases = Array.from({ length: 10 }, (_, i) => makeCase({ created_at: daysAgo(i) }))
    expect(getRecentCases(cases, 3)).toHaveLength(3)
  })

  it('returns all cases when limit exceeds array length', () => {
    const cases = [makeCase(), makeCase()]
    expect(getRecentCases(cases, 10)).toHaveLength(2)
  })

  it('does not mutate the original array', () => {
    const cases = [makeCase({ created_at: daysAgo(3) }), makeCase({ created_at: daysAgo(1) })]
    const original = [...cases]
    getRecentCases(cases, 5)
    expect(cases[0].created_at).toBe(original[0].created_at)
  })
})

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------

describe('formatRelativeTime', () => {
  it('returns "just now" for very recent dates', () => {
    const now = new Date(Date.now() - 10 * 1000).toISOString()
    expect(formatRelativeTime(now)).toBe('just now')
  })

  it('returns minutes ago', () => {
    const t = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('5 minutes ago')
  })

  it('returns singular minute', () => {
    const t = new Date(Date.now() - 90 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('1 minute ago')
  })

  it('returns hours ago', () => {
    const t = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('3 hours ago')
  })

  it('returns singular hour', () => {
    const t = new Date(Date.now() - 90 * 60 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('1 hour ago')
  })

  it('returns days ago', () => {
    const t = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('2 days ago')
  })

  it('returns singular day', () => {
    const t = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('1 day ago')
  })

  it('returns weeks ago', () => {
    const t = new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('3 weeks ago')
  })

  it('returns months ago', () => {
    const t = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('2 months ago')
  })

  it('returns years ago', () => {
    const t = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatRelativeTime(t)).toBe('1 year ago')
  })

  it('returns "unknown" for invalid date string', () => {
    expect(formatRelativeTime('not-a-date')).toBe('unknown')
  })
})
