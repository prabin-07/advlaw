/**
 * analyticsUtils.js
 * Pure utility functions for analytics computations.
 * No React imports — safe to unit test in isolation.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** @param {string} s */
const normalize = (s) => (typeof s === 'string' ? s.trim().toLowerCase() : '')

/**
 * Returns the start-of-day (midnight) for a given Date.
 * @param {Date} d
 */
const startOfDay = (d) => {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/**
 * Returns the Monday of the ISO week containing `d`.
 * @param {Date} d
 */
const startOfWeek = (d) => {
  const copy = new Date(d)
  const day = copy.getDay() // 0 = Sun
  const diff = (day === 0 ? -6 : 1 - day) // shift to Monday
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

/**
 * Formats a Date as "Mon D" (e.g. "Jan 5").
 * @param {Date} d
 */
const fmtDay = (d) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

/**
 * Formats a Date as "Week of Mon D" (e.g. "Week of Jan 1").
 * @param {Date} d
 */
const fmtWeek = (d) => `Week of ${fmtDay(d)}`

// ---------------------------------------------------------------------------
// Period window config
// ---------------------------------------------------------------------------

const PERIOD_DAYS = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 }

// ---------------------------------------------------------------------------
// filterByPeriod
// ---------------------------------------------------------------------------

/**
 * Filters cases to those whose `created_at` falls within the period window.
 * For `'all'`, returns all cases unchanged.
 *
 * @param {object[]} cases
 * @param {'7d'|'30d'|'90d'|'1y'|'all'} period
 * @returns {object[]}
 */
export function filterByPeriod(cases, period) {
  if (!Array.isArray(cases)) return []
  if (period === 'all') return cases

  const days = PERIOD_DAYS[period]
  if (days == null) return cases

  const windowStart = new Date()
  windowStart.setDate(windowStart.getDate() - days)
  windowStart.setHours(0, 0, 0, 0)

  return cases.filter((c) => {
    const d = new Date(c.created_at)
    return !isNaN(d) && d >= windowStart
  })
}

// ---------------------------------------------------------------------------
// computeStats
// ---------------------------------------------------------------------------

/**
 * Computes summary statistics for a set of cases.
 *
 * @param {object[]} cases
 * @returns {{ total: number, withAnalysis: number, uniqueSections: number, uniqueIssues: number, totalLoopholes: number }}
 */
export function computeStats(cases) {
  if (!Array.isArray(cases) || cases.length === 0) {
    return { total: 0, withAnalysis: 0, uniqueSections: 0, uniqueIssues: 0, totalLoopholes: 0 }
  }

  let withAnalysis = 0
  let totalLoopholes = 0
  const sectionSet = new Set()
  const issueSet = new Set()

  for (const c of cases) {
    const analysis = c.analysis
    const hasAnalysis =
      analysis != null &&
      typeof analysis === 'object' &&
      Object.keys(analysis).length > 0

    if (hasAnalysis) withAnalysis++

    const sections = analysis?.applicable_sections
    if (Array.isArray(sections)) {
      for (const s of sections) {
        const key = normalize(s)
        if (key) sectionSet.add(key)
      }
    }

    const issues = analysis?.legal_issues
    if (Array.isArray(issues)) {
      for (const i of issues) {
        const key = normalize(i)
        if (key) issueSet.add(key)
      }
    }

    const loopholes = analysis?.loopholes
    if (Array.isArray(loopholes)) {
      totalLoopholes += loopholes.length
    }
  }

  return {
    total: cases.length,
    withAnalysis,
    uniqueSections: sectionSet.size,
    uniqueIssues: issueSet.size,
    totalLoopholes,
  }
}

// ---------------------------------------------------------------------------
// buildActivityData
// ---------------------------------------------------------------------------

/**
 * Buckets cases by day (7d / 30d) or week (90d / 1y / all).
 * Returns an array of `{ label, count }` sorted chronologically.
 *
 * @param {object[]} cases
 * @param {'7d'|'30d'|'90d'|'1y'|'all'} period
 * @returns {{ label: string, count: number }[]}
 */
export function buildActivityData(cases, period) {
  if (!Array.isArray(cases) || cases.length === 0) return []

  const byDay = period === '7d' || period === '30d'

  // Build a map: bucketKey (ISO string) -> { label, count }
  const bucketMap = new Map()

  for (const c of cases) {
    const d = new Date(c.created_at)
    if (isNaN(d)) continue

    const bucketDate = byDay ? startOfDay(d) : startOfWeek(d)
    const key = bucketDate.toISOString()

    if (!bucketMap.has(key)) {
      bucketMap.set(key, {
        label: byDay ? fmtDay(bucketDate) : fmtWeek(bucketDate),
        count: 0,
        _ts: bucketDate.getTime(),
      })
    }
    bucketMap.get(key).count++
  }

  return Array.from(bucketMap.values())
    .sort((a, b) => a._ts - b._ts)
    .map(({ label, count }) => ({ label, count }))
}

// ---------------------------------------------------------------------------
// computeTopIssues
// ---------------------------------------------------------------------------

/**
 * Case-insensitive frequency count of `analysis.legal_issues`.
 * Returns top `limit` items sorted by count desc.
 * Display name is the first occurrence of each normalized key.
 *
 * @param {object[]} cases
 * @param {number} [limit=5]
 * @returns {{ name: string, count: number }[]}
 */
export function computeTopIssues(cases, limit = 5) {
  return _computeTopFrequency(cases, (c) => c.analysis?.legal_issues, limit)
}

// ---------------------------------------------------------------------------
// computeTopSections
// ---------------------------------------------------------------------------

/**
 * Case-insensitive frequency count of `analysis.applicable_sections`.
 * Returns top `limit` items sorted by count desc.
 * Display name is the first occurrence of each normalized key.
 *
 * @param {object[]} cases
 * @param {number} [limit=5]
 * @returns {{ name: string, count: number }[]}
 */
export function computeTopSections(cases, limit = 5) {
  return _computeTopFrequency(cases, (c) => c.analysis?.applicable_sections, limit)
}

/**
 * Shared frequency computation helper.
 * @param {object[]} cases
 * @param {(c: object) => string[] | undefined} getItems
 * @param {number} limit
 */
function _computeTopFrequency(cases, getItems, limit) {
  if (!Array.isArray(cases) || cases.length === 0) return []

  /** @type {Map<string, { name: string, count: number }>} */
  const freq = new Map()

  for (const c of cases) {
    const items = getItems(c)
    if (!Array.isArray(items)) continue

    for (const item of items) {
      const key = normalize(item)
      if (!key) continue

      if (!freq.has(key)) {
        freq.set(key, { name: item.trim(), count: 0 })
      }
      freq.get(key).count++
    }
  }

  return Array.from(freq.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

// ---------------------------------------------------------------------------
// getRecentCases
// ---------------------------------------------------------------------------

/**
 * Sorts cases by `created_at` descending and returns the top `limit`.
 *
 * @param {object[]} cases
 * @param {number} [limit=5]
 * @returns {object[]}
 */
export function getRecentCases(cases, limit = 5) {
  if (!Array.isArray(cases) || cases.length === 0) return []

  return [...cases]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit)
}

// ---------------------------------------------------------------------------
// formatRelativeTime
// ---------------------------------------------------------------------------

/**
 * Returns a human-readable relative time string.
 * Examples: "just now", "1 hour ago", "2 days ago", "3 weeks ago", "1 month ago", "2 years ago"
 *
 * @param {string} dateStr
 * @returns {string}
 */
export function formatRelativeTime(dateStr) {
  const date = new Date(dateStr)
  if (isNaN(date)) return 'unknown'

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'just now'

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return diffHr === 1 ? '1 hour ago' : `${diffHr} hours ago`

  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`

  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 4) return diffWeek === 1 ? '1 week ago' : `${diffWeek} weeks ago`

  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`

  const diffYear = Math.floor(diffDay / 365)
  return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`
}
