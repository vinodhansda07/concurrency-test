import { callTool } from '../lib/mcp-client.js';
import { TEST_DATA } from '../config.js';

export function runCrossDomainScenarios() {
  // 11.1 WCM + DAM operations in same iteration across VUs
  callTool('create_DX_content_in_WCM', {
    name: `CrossDomain-${__VU}-${__ITER}`,
    libraryId: TEST_DATA.libraryId,
    templateId: TEST_DATA.templateId,
    parentId: TEST_DATA.siteAreaId,
    content: '<p>cross-domain check</p>',
  }, { scenario_id: '11.1', domain: 'wcm' });

  callTool('search_assets_in_DAM', {
    query: 'cross-domain',
  }, { scenario_id: '11.1', domain: 'dam' });
}
