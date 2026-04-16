import { slugify, buildMetadata, validateMetadata } from './metadata.js'
import { createPage, patchDataSource, queryDataSource, searchNotion } from '../notion/client.js'
import { loadNotionHqMap } from '../config/load-notion-hq-map.js'

export async function findPageInRegistryBySlug(slug: string, root = process.cwd()) {
  const map = loadNotionHqMap(root)
  const dataSourceId = (map.hq.page_registry as { data_source_id: string }).data_source_id
  return queryDataSource(dataSourceId, {
    filter: {
      property: 'Canonical Slug',
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
      property: 'Canonical Slug',
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
  domain: string
  ownerAgent: string
  sourceSystem: string
  runId: string
  extraProperties?: Record<string, unknown>
}) {
  const canonicalSlug = args.slug ?? slugify(args.title)
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
      property: 'Canonical Slug',
      rich_text: { equals: canonicalSlug },
    },
    page_size: 1,
  })

  const existing = (result.results as Array<Record<string, unknown>> | undefined)?.[0]
  if (existing) {
    return { mode: 'existing', page: existing }
  }

  const properties: Record<string, unknown> = {
    [args.titleProperty]: {
      title: [{ text: { content: args.title } }],
    },
    'Canonical Slug': {
      rich_text: [{ text: { content: canonicalSlug } }],
    },
    ...args.extraProperties,
  }

  const page = await createPage({
    parent: { data_source_id: args.dataSourceId },
    properties,
  })

  return { mode: 'created', page }
}

export async function extendDataSourceProperties(dataSourceId: string, properties: Record<string, unknown>) {
  return patchDataSource(dataSourceId, properties)
}
