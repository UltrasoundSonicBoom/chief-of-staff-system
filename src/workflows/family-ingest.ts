import { getAgentContextTargets } from '../config/load-notion-hq-map.js'
import { searchExistingNotionObjects } from '../notion/notion-hq-core.js'

export async function runFamilyIngest() {
  const contextTargets = getAgentContextTargets('Family Operations Agent')
  const notionSearch = await searchExistingNotionObjects('Family HQ')

  return {
    workflow: 'family-ingest',
    contextTargets,
    checks: {
      notionSearchCount: Array.isArray(notionSearch.results) ? notionSearch.results.length : 0,
    },
    nextSteps: [
      'Read Family Commitments / School & Academy Inbox / Prep & Supplies',
      'Convert notices into short summaries and prep actions',
      'Promote upcoming deadlines, exams, and missing items to Operating Signals when time-sensitive',
    ],
  }
}
