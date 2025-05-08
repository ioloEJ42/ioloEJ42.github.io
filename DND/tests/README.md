# D&D Character Sheet Test Suite

This directory contains a comprehensive test suite for the D&D Character Sheet application. The test suite covers all major functionality, including rich text formatting, character data management, UI interactions, and accessibility features.

## Getting Started

To run the tests, open the test runner in your browser:

```
DND/tests/test-runner.html
```

This will load the test runner interface where you can run all tests or individual test categories.

## Test Categories

The test suite is organized into the following categories:

### 1. Rich Text Formatting Tests

Tests for the rich text editor functionality, including:
- Toolbar visibility on focus/blur
- Text formatting (bold, italic, underline)
- Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
- List creation (bullet and numbered)
- HTML formatting preservation in JSON

### 2. Character Data Tests

Tests for character data management, including:
- Character creation
- JSON validation
- Data loading/saving
- HP calculation
- Spell slot tracking
- Weapons data management

### 3. UI Interaction Tests

Tests for user interface interactions, including:
- Tab switching
- Theme changing
- Collapsible sections
- HP bar updates
- Weapon row addition

### 4. Accessibility Tests

Tests for accessibility features, including:
- ARIA attributes presence
- Keyboard navigation
- Focus management
- Screen reader compatibility

## Running Tests

The test runner provides several ways to run tests:

- **Run All Tests**: Runs all tests across all categories
- **Run Failed Tests**: Re-runs only the tests that failed in the previous run
- **Run Category Tests**: Runs all tests in a specific category

Each test panel also has a "Show/Hide Iframe" button to display the test environment for that category.

## Test Results

Test results are displayed in real-time as tests are executed. Each test will be marked as:

- **Pending**: Test has not been run yet
- **Passed**: Test completed successfully
- **Failed**: Test did not pass

You can click on any test result to see detailed information about the test execution.

## Adding New Tests

To add new tests:

1. Identify the appropriate test category for your test
2. Add your test function to the corresponding test file:
   - `rich-text-tests.html` for rich text tests
   - `character-data-tests.html` for character data tests
   - `ui-interaction-tests.html` for UI tests
   - `accessibility-tests.html` for accessibility tests
3. Add your test to the test module configuration in `test-runner.html`

## Troubleshooting

If tests are failing unexpectedly:

1. Check the detailed error message by clicking on the failed test
2. Use the "Show Iframe" button to see the test environment
3. Check the browser console for any JavaScript errors
4. Reset the test environment using the "Reset" button

## Notes

- These tests run in isolated environments and don't affect your actual character data
- Some tests use mocks for functionality that can't be tested directly (like file system access)