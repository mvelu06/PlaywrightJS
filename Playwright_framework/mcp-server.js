#!/usr/bin/env node

/**
 * Playwright MCP Server
 * Provides Model Context Protocol tools for Playwright test automation
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

// MCP Server implementation
const mcp = {
  tools: [
    {
      name: 'run_playwright_tests',
      description: 'Run Playwright tests with specified options',
      inputSchema: {
        type: 'object',
        properties: {
          testFile: {
            type: 'string',
            description: 'Test file to run (e.g., tests/login.spec.js). If omitted, runs all tests.',
          },
          project: {
            type: 'string',
            description: 'Browser project to test: chromium, firefox, or webkit',
            enum: ['chromium', 'firefox', 'webkit', 'all'],
          },
          headed: {
            type: 'boolean',
            description: 'Run tests in headed mode (see browser)',
          },
          debug: {
            type: 'boolean',
            description: 'Run tests in debug mode with inspector',
          },
          grep: {
            type: 'string',
            description: 'Run only tests matching the pattern',
          },
        },
        required: [],
      },
    },
    {
      name: 'list_tests',
      description: 'List all available Playwright tests',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'get_test_report',
      description: 'Get HTML test report location and summary',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'get_test_results',
      description: 'Get summary of last test run results',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'configure_playwright',
      description: 'Configure Playwright settings',
      inputSchema: {
        type: 'object',
        properties: {
          baseURL: {
            type: 'string',
            description: 'Base URL for tests',
          },
          timeout: {
            type: 'number',
            description: 'Test timeout in milliseconds',
          },
          headless: {
            type: 'boolean',
            description: 'Run in headless mode',
          },
        },
        required: [],
      },
    },
  ],
};

// Tool implementation functions
async function runPlaywrightTests(input) {
  try {
    let cmd = 'npx playwright test';

    if (input.testFile) {
      cmd += ` ${input.testFile}`;
    }

    if (input.project && input.project !== 'all') {
      cmd += ` --project=${input.project}`;
    }

    if (input.headed) {
      cmd += ' --headed';
    }

    if (input.debug) {
      cmd += ' --debug';
    }

    if (input.grep) {
      cmd += ` --grep="${input.grep}"`;
    }

    cmd += ' --reporter=json';

    const { stdout, stderr } = await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 });

    // Parse JSON output
    let results = {};
    try {
      const lines = stdout.split('\n').filter(line => line.trim());
      const jsonLine = lines.find(line => line.startsWith('{'));
      if (jsonLine) {
        results = JSON.parse(jsonLine);
      }
    } catch (e) {
      results = { raw_output: stdout };
    }

    return {
      success: true,
      message: 'Tests completed',
      details: results,
      command: cmd,
    };
  } catch (error) {
    return {
      success: false,
      message: `Test execution failed: ${error.message}`,
      error: error.message,
    };
  }
}

async function listTests() {
  try {
    const testDir = 'tests';
    const files = await fs.readdir(testDir);
    const testFiles = files.filter(f => f.endsWith('.spec.js'));

    const tests = [];
    for (const file of testFiles) {
      const content = await fs.readFile(path.join(testDir, file), 'utf-8');
      const testNames = content.match(/test\(['"`](.*?)['"`]/g) || [];
      tests.push({
        file,
        testCount: testNames.length,
        path: path.join(testDir, file),
      });
    }

    return {
      success: true,
      testFiles: tests,
      totalFiles: testFiles.length,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to list tests: ${error.message}`,
    };
  }
}

async function getTestReport() {
  try {
    const reportDir = 'playwright-report';
    const indexPath = path.join(reportDir, 'index.html');

    const stats = await fs.stat(indexPath).catch(() => null);

    if (!stats) {
      return {
        success: false,
        message: 'No test report found. Run tests first with: npm test',
      };
    }

    const reportPath = path.resolve(reportDir);

    return {
      success: true,
      message: 'Test report available',
      reportPath,
      htmlPath: reportPath + '/index.html',
      viewCommand: 'npx playwright show-report',
      lastModified: stats.mtime.toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to get report: ${error.message}`,
    };
  }
}

async function getTestResults() {
  try {
    const resultsDir = 'test-results';
    const files = await fs.readdir(resultsDir).catch(() => []);

    if (files.length === 0) {
      return {
        success: false,
        message: 'No test results found. Run tests first.',
      };
    }

    const results = {
      resultsDirectory: path.resolve(resultsDir),
      testResultFiles: files,
      count: files.length,
    };

    return {
      success: true,
      results,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to get results: ${error.message}`,
    };
  }
}

async function configurePlaywright(input) {
  try {
    const configPath = 'playwright.config.js';
    let config = await fs.readFile(configPath, 'utf-8');

    if (input.baseURL) {
      config = config.replace(
        /baseURL:\s*.*?['"`].*?['"`]/,
        `baseURL: '${input.baseURL}'`
      );
    }

    if (input.timeout !== undefined) {
      config = config.replace(/timeout:\s*\d+/, `timeout: ${input.timeout}`);
    }

    await fs.writeFile(configPath, config);

    return {
      success: true,
      message: 'Playwright configuration updated',
      changes: input,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to configure Playwright: ${error.message}`,
    };
  }
}

// Tool dispatcher
async function handleToolCall(toolName, input) {
  switch (toolName) {
    case 'run_playwright_tests':
      return await runPlaywrightTests(input);
    case 'list_tests':
      return await listTests();
    case 'get_test_report':
      return await getTestReport();
    case 'get_test_results':
      return await getTestResults();
    case 'configure_playwright':
      return await configurePlaywright(input);
    default:
      return {
        success: false,
        message: `Unknown tool: ${toolName}`,
      };
  }
}

// MCP Server API
module.exports = {
  tools: mcp.tools,
  handleToolCall,
  getToolDefinitions() {
    return {
      tools: mcp.tools,
    };
  },
};

// If run directly
if (require.main === module) {
  console.log('Playwright MCP Server');
  console.log('====================');
  console.log('\nAvailable Tools:');
  mcp.tools.forEach((tool, idx) => {
    console.log(`\n${idx + 1}. ${tool.name}`);
    console.log(`   ${tool.description}`);
  });
  console.log('\nTo use this server, import it in your MCP configuration.');
}
