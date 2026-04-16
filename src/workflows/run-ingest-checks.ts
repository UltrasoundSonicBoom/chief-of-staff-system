import { runKrtaEmailIngest } from './krta-email-ingest.js'
import { runFinanceIngest } from './finance-ingest.js'
import { runFamilyIngest } from './family-ingest.js'

async function main() {
  const [krta, finance, family] = await Promise.all([
    runKrtaEmailIngest(),
    runFinanceIngest(),
    runFamilyIngest(),
  ])

  console.log(JSON.stringify({ krta, finance, family }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
