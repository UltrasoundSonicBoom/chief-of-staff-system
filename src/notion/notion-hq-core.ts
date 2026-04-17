import { slugify, buildMetadata, validateMetadata } from './metadata.js'
import { createPage, patchDataSource, queryDataSource, searchNotion, updatePage } from '../notion/client.js'
import { loadNotionHqMap } from '../config/load-notion-hq-map.js'

export async function findPageInRegistryBySlug(slug: string, root = process.cwd()) {
  const map = loadNotionHqMap(root)
  const dataSourceId = (map.hq.page_registry as { data_source_id: string }).data_source_id
  return queryDataSource(dataSourceId, {
    filter: {
      property: '표준 슬러그',
      rich_text: { equals: slug },
    },
    page_size: 5,
  })
}

export async function findDatabaseInRegistryBySlug(slug: string, root = process.cwd()) {
  const map = loadNotionHqMap(root)
  const dataSourceId = (map.hq.database_registry as { data_source_id: string }).data_source_id
  return queryDataSource(dataSourceId, {
    filter: {
      property: '표준 슬러그',
      rich_text: { equals: slug },
    },
    page_size: 5,
  })
}

export async function searchExistingNotionObjects(title: string) {
  return searchNotion(title, 10)
}

export async function upsertBasicRecord(args: {
  dataSourceId: string
  titleProperty: string
  title: string
  slug?: string
  slugPropertyName?: string
  domain: string
  ownerAgent: string
  sourceSystem: string
  runId: string
  extraProperties?: Record<string, unknown>
}) {
  const canonicalSlug = args.slug ?? slugify(args.title)
  const slugPropertyName = args.slugPropertyName ?? '표준 슬러그'
  const metadata = {
    canonical_slug: canonicalSlug,
    ...buildMetadata(args.ownerAgent, args.domain, args.sourceSystem, args.runId),
  }
  const missing = validateMetadata(metadata)
  if (missing.length > 0) {
    throw new Error(`Missing metadata: ${missing.join(', ')}`)
  }

  const result = await queryDataSource(args.dataSourceId, {
    filter: {
      property: slugPropertyName,
      rich_text: { equals: canonicalSlug },
    },
    page_size: 1,
  })

  const properties: Record<string, unknown> = {
    [args.titleProperty]: {
      title: [{ text: { content: args.title } }],
    },
    [slugPropertyName]: {
      rich_text: [{ text: { content: canonicalSlug } }],
    },
    ...args.extraProperties,
  }

  const existing = (result.results as Array<Record<string, unknown>> | undefined)?.[0]
  if (existing) {
    const pageId = String(existing.id)
    const updated = await updatePage(pageId, properties)
    return { mode: 'updated', page: updated }
  }

  const page = await createPage({
    parent: { data_source_id: args.dataSourceId },
    properties,
  })

  return { mode: 'created', page }
}

export async function ensureSignal(args: {
  dataSourceId: string
  title: string
  slug: string
  domain: string
  ownerAgent: string
  summary: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  signalType: 'KPI' | 'Risk' | 'Alert' | 'Decision Needed' | 'Deadline' | 'Opportunity' | 'Review' | 'Incident'
  reviewBy: string
  escalationNeeded?: boolean
  runId: string
}) {
  return upsertBasicRecord({
    dataSourceId: args.dataSourceId,
    titleProperty: '이름',
    title: args.title,
    slug: args.slug,
    slugPropertyName: '표준 슬러그',
    domain: args.domain,
    ownerAgent: args.ownerAgent,
    sourceSystem: 'Hermes',
    runId: args.runId,
    extraProperties: {
      '시그널 유형': { select: { name: args.signalType } },
      도메인: { select: { name: args.domain } },
      심각도: { select: { name: args.severity } },
      '담당 에이전트': { rich_text: [{ text: { content: args.ownerAgent } }] },
      상태: { status: { name: 'Not started' } },
      발생일: { date: { start: new Date().toISOString().slice(0, 10) } },
      '검토 기한': { date: { start: args.reviewBy } },
      요약: { rich_text: [{ text: { content: args.summary } }] },
      '즉시 보고 필요': { checkbox: args.escalationNeeded ?? false },
      '관련 프로젝트': { rich_text: [{ text: { content: '-' } }] },
    },
  })
}

export async function extendDataSourceProperties(dataSourceId: string, properties: Record<string, unknown>) {
  return patchDataSource(dataSourceId, properties)
}
