from pathlib import Path
import json
import re
from datetime import datetime, timezone

REQUIRED_METADATA = [
    'canonical_slug',
    'domain',
    'owner_agent',
    'created_by_agent',
    'last_updated_by_agent',
    'source_system',
    'run_id',
    'lifecycle_status',
    'last_synced_at',
]


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r'[^a-z0-9가-힣\s_-]+', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text


def build_metadata(agent_name: str, domain: str, source_system: str, run_id: str, lifecycle_status='active'):
    now = datetime.now(timezone.utc).isoformat()
    return {
        'domain': domain,
        'owner_agent': agent_name,
        'created_by_agent': agent_name,
        'last_updated_by_agent': agent_name,
        'source_system': source_system,
        'run_id': run_id,
        'lifecycle_status': lifecycle_status,
        'last_synced_at': now,
    }


def validate_metadata(metadata: dict):
    missing = [k for k in REQUIRED_METADATA if k not in metadata or metadata[k] in (None, '')]
    return missing


if __name__ == '__main__':
    example = build_metadata('Chief of Staff Agent', 'Executive', 'Hermes', 'example-run')
    example['canonical_slug'] = slugify('Example Object')
    print(json.dumps({'example_metadata': example, 'missing': validate_metadata(example)}, ensure_ascii=False, indent=2))
