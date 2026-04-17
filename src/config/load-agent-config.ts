import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { TeamMemberConfig } from '../types.js'

const KOREAN_STYLE = '반드시 한국어로만 생각하고, 한국어로만 기록하고, 한국어로만 보고하라. 영어 원문이 있어도 최종 출력과 운영 기록은 한국어를 기본으로 한다.'

function withKoreanStyle(prompt: string): string {
  return `${prompt.trim()} ${KOREAN_STYLE}`
}

export function loadAgentConfig(key: string, root = process.cwd()): TeamMemberConfig {
  const file = path.join(root, 'config', 'agents', `${key}.json`)
  const config = JSON.parse(readFileSync(file, 'utf8')) as TeamMemberConfig
  return {
    ...config,
    systemPrompt: withKoreanStyle(config.systemPrompt),
  }
}

export function loadAgentConfigs(keys: string[], root = process.cwd()): TeamMemberConfig[] {
  return keys.map((key) => loadAgentConfig(key, root))
}
