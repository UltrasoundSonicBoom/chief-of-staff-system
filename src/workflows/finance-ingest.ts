import { getAgentContextTargets } from '../config/load-notion-hq-map.js'
import { searchExistingNotionObjects } from '../notion/notion-hq-core.js'

export async function runFinanceIngest() {
  const contextTargets = getAgentContextTargets('Finance Agent')
  const notionSearch = await searchExistingNotionObjects('Finance HQ')

  return {
    workflow: 'finance-ingest',
    contextTargets,
    checks: {
      notionSearchCount: Array.isArray(notionSearch.results) ? notionSearch.results.length : 0,
    },
    nextSteps: [
      'Read Finance Ledger / Major Events / Renewals',
      'Classify incoming statement/order/billing events into debt, living, housing, car, education, or investment categories',
      'Promote large commitments and abnormal cashflow changes to Operating Signals',
    ],
  }
}
