import type { CreateDatabasePayload, CreatePagePayload, NotionObject, QueryDataSourcePayload } from './types.js'

const NOTION_VERSION = '2025-09-03'
const BASE_URL = 'https://api.notion.com/v1'

function requireApiKey(): string {
  const key = process.env.NOTION_API_KEY
  if (!key) throw new Error('NOTION_API_KEY is required')
  return key
}

async function notionFetch(path: string, init?: RequestInit): Promise<NotionObject> {
  const apiKey = requireApiKey()
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const data = (await response.json()) as NotionObject
  if (!response.ok) {
    throw new Error(`Notion API error ${response.status}: ${String(data['message'] ?? 'unknown error')}`)
  }
  return data
}

export async function getPage(pageId: string) {
  return notionFetch(`/pages/${pageId}`)
}

export async function getDatabase(databaseId: string) {
  return notionFetch(`/databases/${databaseId}`)
}

export async function getDataSource(dataSourceId: string) {
  return notionFetch(`/data_sources/${dataSourceId}`)
}

export async function searchNotion(query: string, pageSize = 20) {
  return notionFetch('/search', {
    method: 'POST',
    body: JSON.stringify({ query, page_size: pageSize }),
  })
}

export async function createDatabase(payload: CreateDatabasePayload) {
  return notionFetch('/databases', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function createPage(payload: CreatePagePayload) {
  return notionFetch('/pages', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updatePage(pageId: string, properties: Record<string, unknown>) {
  return notionFetch(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties }),
  })
}

export async function patchDataSource(dataSourceId: string, properties: Record<string, unknown>) {
  return notionFetch(`/data_sources/${dataSourceId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties }),
  })
}

export async function queryDataSource(dataSourceId: string, payload: QueryDataSourcePayload = {}) {
  return notionFetch(`/data_sources/${dataSourceId}/query`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
