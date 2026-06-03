/**
 * MCP Server Integration Examples
 * Demonstrates how to use the Playwright MCP Server
 */

const mcpServer = require('./mcp-server.js');

// Example 1: Get tool definitions
async function example_getTools() {
  console.log('\n=== Example 1: Get Available Tools ===');
  const definitions = mcpServer.getToolDefinitions();
  console.log(`Found ${definitions.tools.length} tools:`);
  definitions.tools.forEach((tool) => {
    console.log(`- ${tool.name}: ${tool.description}`);
  });
}

// Example 2: List all tests
async function example_listTests() {
  console.log('\n=== Example 2: List Available Tests ===');
  const result = await mcpServer.handleToolCall('list_tests', {});
  if (result.success) {
    console.log(`Found ${result.totalFiles} test file(s):`);
    result.testFiles.forEach((file) => {
      console.log(`- ${file.file} (${file.testCount} tests)`);
    });
  } else {
    console.log(`Error: ${result.message}`);
  }
}

// Example 3: Run specific test
async function example_runTest() {
  console.log('\n=== Example 3: Run Specific Test ===');
  const result = await mcpServer.handleToolCall('run_playwright_tests', {
    testFile: 'tests/login.spec.js',
    project: 'chromium',
    grep: 'positive login',
  });
  console.log(`Result: ${result.success ? 'Success' : 'Failed'}`);
  console.log(`Message: ${result.message}`);
}

// Example 4: Run tests in headed mode
async function example_runHeaded() {
  console.log('\n=== Example 4: Run Tests in Headed Mode ===');
  console.log('This will open a browser window...');
  const result = await mcpServer.handleToolCall('run_playwright_tests', {
    testFile: 'tests/login.spec.js',
    project: 'chromium',
    headed: true,
  });
  console.log(`Result: ${result.success ? 'Success' : 'Failed'}`);
}

// Example 5: Get test report
async function example_getReport() {
  console.log('\n=== Example 5: Get Test Report ===');
  const result = await mcpServer.handleToolCall('get_test_report', {});
  if (result.success) {
    console.log(`Report Location: ${result.reportPath}`);
    console.log(`View Report: ${result.viewCommand}`);
  } else {
    console.log(`Info: ${result.message}`);
  }
}

// Example 6: Get test results
async function example_getResults() {
  console.log('\n=== Example 6: Get Test Results ===');
  const result = await mcpServer.handleToolCall('get_test_results', {});
  if (result.success) {
    console.log(`Results Directory: ${result.results.resultsDirectory}`);
    console.log(`Result Files: ${result.results.count}`);
  } else {
    console.log(`Info: ${result.message}`);
  }
}

// Example 7: Configure Playwright
async function example_configure() {
  console.log('\n=== Example 7: Configure Playwright ===');
  const result = await mcpServer.handleToolCall('configure_playwright', {
    timeout: 60000,
  });
  console.log(`Configuration: ${result.success ? 'Updated' : 'Failed'}`);
  if (result.changes) {
    console.log(`Changes: ${JSON.stringify(result.changes, null, 2)}`);
  }
}

// Example 8: Advanced workflow - Run all tests and get report
async function example_workflow() {
  console.log('\n=== Example 8: Workflow - Run Tests and Get Report ===');

  // Step 1: List available tests
  console.log('Step 1: Listing tests...');
  const tests = await mcpServer.handleToolCall('list_tests', {});
  if (!tests.success) {
    console.log('Failed to list tests');
    return;
  }
  console.log(`Found ${tests.totalFiles} test file(s)`);

  // Step 2: Run all tests on chromium
  console.log('\nStep 2: Running tests on Chromium...');
  const runResult = await mcpServer.handleToolCall('run_playwright_tests', {
    project: 'chromium',
  });
  console.log(`Tests ${runResult.success ? 'completed' : 'failed'}`);

  // Step 3: Get report
  console.log('\nStep 3: Getting test report...');
  const report = await mcpServer.handleToolCall('get_test_report', {});
  if (report.success) {
    console.log(`Report available: ${report.htmlPath}`);
  }

  // Step 4: Get results summary
  console.log('\nStep 4: Getting results summary...');
  const results = await mcpServer.handleToolCall('get_test_results', {});
  if (results.success) {
    console.log(`Found ${results.results.count} result file(s)`);
  }
}

// Main: Run example based on command line argument
async function main() {
  const example = process.argv[2] || 'all';

  try {
    if (example === 'all' || example === '1') await example_getTools();
    if (example === 'all' || example === '2') await example_listTests();
    if (example === 'all' || example === '3') await example_runTest();
    if (example === 'all' || example === '4') await example_runHeaded();
    if (example === 'all' || example === '5') await example_getReport();
    if (example === 'all' || example === '6') await example_getResults();
    if (example === 'all' || example === '7') await example_configure();
    if (example === 'all' || example === '8') await example_workflow();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Usage:
// node mcp-examples.js              - Run all examples
// node mcp-examples.js 1            - Run example 1
// node mcp-examples.js workflow     - Run workflow example

if (require.main === module) {
  main();
}

module.exports = {
  example_getTools,
  example_listTests,
  example_runTest,
  example_getReport,
  example_getResults,
  example_configure,
  example_workflow,
};
