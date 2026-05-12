# concurrency-test
MCP Concurrency test

1. Full concurrency suite
MCP_BASE_URL="http://host:port/dx/api/iq/v1/mcp" TEST_MODE=full k6 run --summary-export reports/full-suite-summary.json main.js
2. Race-condition concurrency suite

MCP_BASE_URL="http://host:port/dx/api/iq/v1/mcp" TEST_MODE=races RACE_VUS=10 RACE_ITERATIONS=1 k6 run --summary-export reports/races-summary.json main.js
3. Concurrent login verification suite

MCP_BASE_URL="http://host:port/dx/api/iq/v1/mcp" k6 run --summary-export reports/login-summary.json verify-concurrent-logins.js
