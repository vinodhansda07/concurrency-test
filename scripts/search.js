import { callTool } from '../lib/mcp-client.js';

export function runSearchScenarios() {
  // 10.1 same-query concurrent search
  callTool('search_DX_items_in_WCM', {
    name: 'HomePage',
  }, { scenario_id: '10.1' });

  // 10.2 type-filtered concurrent search
  const types = ['Content', 'SiteArea', 'ContentTemplate'];
  const type = types[__VU % types.length];
  callTool('search_DX_items_in_WCM', {
    type,
  }, { scenario_id: '10.2' });

  // 10.3 search during modification (other VUs can run creates)
  callTool('search_DX_items_in_WCM', {
    name: 'Article',
  }, { scenario_id: '10.3' });
}
