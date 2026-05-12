import { callTool } from '../lib/mcp-client.js';

export function runEdgeScenarios() {
  // 13.1 network interruption should be injected via proxy/network shaping.
  callTool('get_all_libraries_from_WCM', {}, { scenario_id: '13.1' });

  // 13.2 invalid request payload
  callTool('search_DX_items_in_WCM', {
    type: 'INVALID_TYPE_EXPECTED_TO_FAIL',
  }, { scenario_id: '13.2' });

  // 13.3 resource exhaustion is driven by high-VU config and custom load profiles
  callTool('search_assets_in_DAM', {
    query: 'stress',
  }, { scenario_id: '13.3' });
}
