import { Client } from "pg";

export async function detectFlakyScenarios(client: Client) {

  const result = await client.query(`
    SELECT
        name,
        COUNT(*) FILTER (WHERE status = 'passed') as passed,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) as total
    FROM scenarios
    GROUP BY name
    HAVING COUNT(*) FILTER (WHERE status='passed') > 0
    AND COUNT(*) FILTER (WHERE status='failed') > 0
    ORDER BY failed DESC
  `)

  return result.rows
}

