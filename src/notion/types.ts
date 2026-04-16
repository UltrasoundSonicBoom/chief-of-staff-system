export type NotionText = { text: { content: string } }

export type CreateDatabasePayload = {
  parent: { type: 'page_id'; page_id: string }
  title: NotionText[]
  is_inline?: boolean
  properties: Record<string, unknown>
}

export type CreatePagePayload = {
  parent: { page_id?: string; data_source_id?: string }
  properties: Record<string, unknown>
  children?: Array<Record<string, unknown>>
}

export type QueryDataSourcePayload = {
  filter?: Record<string, unknown>
  sorts?: Array<Record<string, unknown>>
  page_size?: number
}

export type NotionObject = Record<string, unknown>
