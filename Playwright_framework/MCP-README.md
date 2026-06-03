# Playwright MCP Server

The Playwright MCP Server exposes test automation capabilities through the Model Context Protocol, allowing AI assistants and external tools to control Playwright tests programmatically.

## Quick Start

### 1. Start the MCP Server

```bash
npm run mcp
```

The server will start and display available tools.

### 2. Available Tools

#### `run_playwright_tests`
Execute Playwright tests with flexible options.

**Parameters:**
- `testFile` (string, optional): Specific test file to run (e.g., `tests/login.spec.js`)
- `project` (string, optional): Browser project - `chromium`, `firefox`, `webkit`, or `all`
- `headed` (boolean, optional): Run in headed mode (see browser window)
- `debug` (boolean, optional): Run in debug mode with inspector
- `grep` (string, optional): Run only tests matching pattern

**Example:**
```json
{
  "testFile": "tests/login.spec.js",
  "project": "chromium",
  "headed": false,
  "grep": "positive login"
}
```

#### `list_tests`
List all available Playwright test files and count of tests in each.

**Returns:** Array of test files with paths and test counts

#### `get_test_report`
Get location and details of the latest HTML test report.

**Returns:**
- Report path
- HTML file path
- View command
- Last modified timestamp

#### `get_test_results`
Get summary of test results from the last test run.

**Returns:**
- Results directory path
- List of result files
- Count of results

#### `configure_playwright`
Update Playwright configuration settings.

**Parameters:**
- `baseURL` (string, optional): Change test base URL
- `timeout` (number, optional): Change test timeout in milliseconds
- `headless` (boolean, optional): Set headless mode

## Integration Examples

### Using with Claude/AI Assistant

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["mcp-server.js"],
      "env": {
        "BASE_URL": "https://practicetestautomation.com/practice-test-login/"
      }
    }
  }
}
```

### Node.js Integration

```javascript
const mcpServer = require('./mcp-server.js');

// Get available tools
const tools = mcpServer.getToolDefinitions();

// Call a tool
const result = await mcpServer.handleToolCall('run_playwright_tests', {
  testFile: 'tests/login.spec.js',
  project: 'chromium'
});

console.log(result);
```

### Command Line Usage

```bash
# Run all tests
npm run mcp

# View MCP server definitions
node mcp-server.js

# Debug MCP server
npm run mcp:inspect
```

## API Responses

All tool responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation completed",
  "details": { /* operation-specific data */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

## Configuration

Configuration is stored in `mcp.config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["mcp-server.js"],
      "env": {
        "BASE_URL": "https://practicetestautomation.com/practice-test-login/",
        "TEST_USER": "student",
        "TEST_PASS": "Password123"
      }
    }
  }
}
```

## Test Results

- **Test reports:** `playwright-report/` (HTML report)
- **Test results:** `test-results/` (detailed result files)
- **Screenshots:** `screenshots/` (on failure)

View the latest report:
```bash
npm run report
```

## Environment Variables

The server respects the following environment variables from `.env`:

- `BASE_URL` - Test website URL
- `TEST_USER` - Test username
- `TEST_PASS` - Test password
- `CI` - Continuous Integration mode

## Troubleshooting

### Browsers not installed
```bash
npx playwright install
```

### Tests timing out
Increase timeout in `playwright.config.js` or via MCP:
```json
{
  "timeout": 60000
}
```

### Report not found
Run tests first:
```bash
npm test
```

## Architecture

The MCP server provides a bridge between:
- **Playwright Test Framework** - Core automation and test execution
- **Model Context Protocol** - Standardized tool interface
- **External Consumers** - AI assistants, CLI tools, other services

All tool calls are asynchronous and handle errors gracefully.
