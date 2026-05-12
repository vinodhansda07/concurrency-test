import { callTool } from '../lib/mcp-client.js';
import { TEST_DATA } from '../config.js';

export function runTransactionScenarios() {
  // 14.1 partial failure: dependency invalidation should be orchestrated externally.
  callTool('create_site_area_in_WCM', {
    name: `Txn-${__VU}-${__ITER}`,
    libraryId: TEST_DATA.libraryId,
    templateId: TEST_DATA.templateId,
    presentationTemplateId: TEST_DATA.presentationTemplateId,
    description: 'transaction rollback test',
  }, { scenario_id: '14.1' });
}
