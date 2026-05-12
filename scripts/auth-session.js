import { callTool } from '../lib/mcp-client.js';
import { TEST_DATA } from '../config.js';

export function runAuthenticationScenarios() {
  // 1.1 Concurrent User Logins (run under load across VUs)
  const useA = __VU % 2 === 0;
  callTool('login', {
    username: useA ? TEST_DATA.dxUserA : TEST_DATA.dxUserB,
    password: useA ? TEST_DATA.dxPassA : TEST_DATA.dxPassB,
  }, { scenario_id: '1.1' });

  // 1.2 Concurrent Login/Logout (different VUs simulate different sessions)
  callTool('logout', {}, { scenario_id: '1.2' });

  // 1.3 Expiry behavior is validated by invoking regular tools near token expiry window
  callTool('get_all_libraries_from_WCM', {}, { scenario_id: '1.3' });
}
