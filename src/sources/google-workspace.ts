import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const SETUP_SCRIPT = `${process.env.HOME}/.hermes/skills/productivity/google-workspace/scripts/setup.py`
const API_SCRIPT = `${process.env.HOME}/.hermes/skills/productivity/google-workspace/scripts/google_api.py`

export async function checkGoogleWorkspaceAuth() {
  try {
    const { stdout } = await execFileAsync('python', [SETUP_SCRIPT, '--check'])
    return {
      ok: stdout.includes('AUTHENTICATED'),
      output: stdout.trim(),
    }
  } catch (error) {
    return {
      ok: false,
      output: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function gmailSearch(query: string, max = 10) {
  const { stdout } = await execFileAsync('python', [API_SCRIPT, 'gmail', 'search', query, '--max', String(max)])
  const trimmed = stdout.trim()
  if (!trimmed || trimmed === 'No messages found.') {
    return [] as Array<Record<string, unknown>>
  }
  return JSON.parse(trimmed) as Array<Record<string, unknown>>
}

export async function gmailGet(messageId: string) {
  const { stdout } = await execFileAsync('python', [API_SCRIPT, 'gmail', 'get', messageId])
  const trimmed = stdout.trim()
  if (!trimmed) {
    return {} as Record<string, unknown>
  }
  return JSON.parse(trimmed) as Record<string, unknown>
}

export async function calendarList(start: string, end: string) {
  const { stdout } = await execFileAsync('python', [API_SCRIPT, 'calendar', 'list', '--start', start, '--end', end])
  return JSON.parse(stdout) as Array<Record<string, unknown>>
}
