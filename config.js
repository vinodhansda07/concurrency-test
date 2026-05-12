export const BASE_URL = __ENV.MCP_BASE_URL || ''; // Add full url of MCP endpoint with port number and context path if any, e.g. http://localhost:8080/mcp

export const commonOptions = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2500'],
  },
};

function raceScenario(exec, startTime) {
  return {
    executor: 'per-vu-iterations',
    exec,
    vus: Number(__ENV.RACE_VUS || 10),
    iterations: Number(__ENV.RACE_ITERATIONS || 1),
    maxDuration: __ENV.RACE_MAX_DURATION || '45s',
    startTime,
    gracefulStop: '0s',
  };
}

export function getOptions() {
  const mode = __ENV.TEST_MODE || 'full';

  if (mode === 'races') {
    return {
      thresholds: commonOptions.thresholds,
      scenarios: {
        race_site_area_same_name: raceScenario('raceSiteAreaSameName', '0s'),
        race_delete_same_site_area: raceScenario('raceDeleteSameSiteArea', '50s'),
        race_update_same_content: raceScenario('raceUpdateSameContent', '100s'),
      },
    };
  }

  return {
    thresholds: commonOptions.thresholds,
    scenarios: {
      full_suite: {
        executor: 'ramping-vus',
        exec: 'fullSuite',
        stages: commonOptions.stages,
      },
    },
  };
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
};

export const TEST_DATA = {
  dxUserA: __ENV.DX_USER_A || '',
  dxPassA: __ENV.DX_PASS_A || '',
  dxUserB: __ENV.DX_USER_B || '',
  dxPassB: __ENV.DX_PASS_B || '',
  libraryId: __ENV.LIBRARY_ID || '',
  templateId: __ENV.TEMPLATE_ID || '',
  siteAreaId: __ENV.SITE_AREA_ID || '',
  presentationTemplateId: __ENV.PRESENTATION_TEMPLATE_ID || '',
  contentId: __ENV.CONTENT_ID || '',
  collectionId: __ENV.COLLECTION_ID || '',
};
