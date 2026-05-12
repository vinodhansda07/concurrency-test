import { readResource } from '../lib/mcp-client.js';

export function runCacheScenarios() {
  // 9.1 concurrent resource reads at startup
  readResource('dam://mime-types', { scenario_id: '9.1' });

  // 9.2 read near TTL expiration window
  readResource('dam://mime-types', { scenario_id: '9.2' });
}
