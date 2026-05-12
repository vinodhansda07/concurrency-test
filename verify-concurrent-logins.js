import { check, sleep } from 'k6';
import http from 'k6/http';
import { BASE_URL, DEFAULT_HEADERS, TEST_DATA } from './config.js';

export const options = {
  vus: Number(__ENV.LOGIN_VUS || 6),
  iterations: Number(__ENV.LOGIN_ITERATIONS || 12),
  thresholds: {
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95'],
  },
};

function parseJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function parseSseBody(rawBody) {
  if (!rawBody) {
    return null;
  }

  const direct = parseJsonSafe(rawBody);
  if (direct) {
    return direct;
  }

  const dataLine = String(rawBody)
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('data:'));

  if (!dataLine) {
    return null;
  }

  return parseJsonSafe(dataLine.replace(/^data:\s*/, ''));
}

function parseToolText(body) {
  const resultText = body?.result?.content?.[0]?.text;
  if (!resultText) {
    return null;
  }

  const asJson = parseJsonSafe(resultText);
  if (asJson) {
    return asJson;
  }

  const parsed = {};
  String(resultText)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes(':'))
    .forEach((line) => {
      const index = line.indexOf(':');
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (value === 'true') {
        parsed[key] = true;
      } else if (value === 'false') {
        parsed[key] = false;
      } else {
        parsed[key] = value;
      }
    });

  return Object.keys(parsed).length ? parsed : null;
}

export default function () {
  const useA = __VU % 2 === 0;
  const username = useA ? TEST_DATA.dxUserA : TEST_DATA.dxUserB;
  const password = useA ? TEST_DATA.dxPassA : TEST_DATA.dxPassB;

  const payload = {
    jsonrpc: '2.0',
    id: `login-${__VU}-${__ITER}-${Date.now()}`,
    method: 'tools/call',
    params: {
      name: 'login',
      arguments: {
        username,
        password,
      },
    },
  };

  const res = http.post(BASE_URL, JSON.stringify(payload), {
    headers: DEFAULT_HEADERS,
    tags: { scenario_id: '1.1', tool: 'login' },
    timeout: '30s',
  });

  const body = parseSseBody(res.body);
  const tool = parseToolText(body);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'no top-level error object': () => !!body && !Object.prototype.hasOwnProperty.call(body, 'error'),
    'login success true': () => !!tool && tool.success === true,
    'ltpa token cached true': () => !!tool && tool.ltpaTokenCached === true,
  });

  sleep(1);
}
