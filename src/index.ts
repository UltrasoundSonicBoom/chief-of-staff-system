import { buildChiefOfStaffTeam } from './orchestration/build-chief-of-staff-team.js'

async function main() {
  const { orchestrator, team } = buildChiefOfStaffTeam()

  console.log(`Bootstrapping team: ${team.name}`)
  console.log(`Agents: ${team.getAgents().map((agent) => agent.name).join(', ')}`)

  const goal = [
    'Read the shared operating context and produce an executive bootstrap brief.',
    'Identify the top priority across finance, family, and KRTA.',
    'Return a short summary plus 3 next actions.',
  ].join(' ')

  const result = await orchestrator.runTeam(team, goal)

  console.log('\n=== TEAM RESULT ===')
  console.log(`success: ${result.success}`)
  console.log(`tokens: in=${result.totalTokenUsage.input_tokens} out=${result.totalTokenUsage.output_tokens}`)

  for (const [name, agentResult] of result.agentResults) {
    console.log(`\n--- ${name} ---`)
    console.log(agentResult.output.slice(0, 1000))
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
