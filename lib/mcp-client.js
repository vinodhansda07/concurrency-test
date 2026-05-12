import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, DEFAULT_HEADERS } from '../config.js';

function parseJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function parseMcpResponse(rawBody) {
  const direct = parseJsonSafe(rawBody);
  if (direct) {
    return direct;
  }

  const dataLine = String(rawBody || '')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.startsWith('data:'));

  if (!dataLine) {
    return null;
  }

  return parseJsonSafe(dataLine.replace(/^data:\s*/, ''));
}

export function buildRequestId(prefix) {
  return `${prefix}-${__VU}-${__ITER}-${Date.now()}`;
}

export function callTool(name, args = {}, tags = {}) {
  const payload = {
    jsonrpc: '2.0',
    id: buildRequestId(name),
    method: 'tools/call',
    params: {
      name,
      arguments: args,
    },
  };

  const res = http.post(BASE_URL, JSON.stringify(payload), {
    headers: DEFAULT_HEADERS,
    tags: { mcp_tool: name, ...tags },
    timeout: '30s',
  });

  const body = parseMcpResponse(res.body);

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'no top-level error object': () => !!body && !Object.prototype.hasOwnProperty.call(body, 'error'),
  });

  return { res, body, ok };
}

export function readResource(uri, tags = {}) {
  const payload = {
    jsonrpc: '2.0',
    id: buildRequestId('resource-read'),
    method: 'resources/read',
    params: { uri },
  };

  const res = http.post(BASE_URL, JSON.stringify(payload), {
    headers: DEFAULT_HEADERS,
    tags: { mcp_resource: uri, ...tags },
    timeout: '30s',
  });

  const body = parseMcpResponse(res.body);

  const ok = check(res, {
    'resource status is 200': (r) => r.status === 200,
    'resource response has no error object': () => !!body && !Object.prototype.hasOwnProperty.call(body, 'error'),
  });

  return { res, body, ok };
}
