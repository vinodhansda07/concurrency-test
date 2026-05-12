import { callTool } from '../lib/mcp-client.js';
import { TEST_DATA } from '../config.js';

export function runDamScenarios() {
  // 8.1 concurrent collection searches
  callTool('search_collections_in_DAM', {
    query: `collection-${__VU}-${__ITER}`,
  }, { scenario_id: '8.1' });

  // 8.2 concurrent asset searches
  callTool('search_assets_in_DAM', {
    query: `asset-${__VU}`,
  }, { scenario_id: '8.2' });

  // 8.3 get collection while updates happen externally
  if (TEST_DATA.collectionId) {
    callTool('get_collection_from_DAM', {
      collectionId: TEST_DATA.collectionId,
    }, { scenario_id: '8.3' });
  }
}
