import { buildChiefOfStaffBrief } from './chief-of-staff-brief.js'

async function main() {
  const brief = await buildChiefOfStaffBrief()
  console.log(JSON.stringify(brief, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
