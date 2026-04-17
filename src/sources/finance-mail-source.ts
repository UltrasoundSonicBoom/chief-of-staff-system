import { gmailSearch, checkGoogleWorkspaceAuth } from './google-workspace.js'
import { FINANCE_GMAIL_QUERIES, summarizeMessage } from './query-presets.js'

export async function collectFinanceMailSignals() {
  const auth = await checkGoogleWorkspaceAuth()
  if (!auth.ok) {
    return { auth, messages: [] as Array<ReturnType<typeof summarizeMessage>>, queryCount: 0 }
  }

  const dedup = new Map<string, ReturnType<typeof summarizeMessage>>()
  for (const query of FINANCE_GMAIL_QUERIES) {
    const results = await gmailSearch(query, 8)
    for (const raw of results) {
      const msg = summarizeMessage(raw)
      const key = msg.threadId || msg.id
      if (!dedup.has(key)) dedup.set(key, msg)
    }
  }

  return {
    auth,
    messages: [...dedup.values()],
    queryCount: FINANCE_GMAIL_QUERIES.length,
  }
}
