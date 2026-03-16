---
description: Generate comprehensive testing instructions for pull requests
---

# Testing Instructions Workflow

This workflow guides you through creating comprehensive, accurate testing instructions for a pull request.

## Intent

**WHY this workflow exists:** Pull requests need clear, actionable testing instructions that developers can follow to validate changes. Without proper testing instructions, PR validation becomes inconsistent and error-prone.

**WHAT this workflow produces:**
- Comprehensive testing instructions with exact UI element names
- Sequential test cases covering happy paths, edge cases, and error conditions
- Proper formatting following ELCC project standards
- Navigation paths and verification steps for each test scenario

**Decision Rules:**
- **Always verify UI element names**: Never guess button names, tab names, or labels - search the Vue code
- **Use exact formatting**: Follow the established bold formatting and sequential numbering patterns
- **Cover all scenarios**: Include happy paths, edge cases, error conditions, and cleanup flows
- **Be specific**: Include exact navigation paths, field labels, and expected outcomes
- **Feed PR workflow output back:** Use this workflow to produce or refresh the `# Testing Instructions` section that `pull-request-management.md` adds to a PR body.
- **Complete workflow sequence:** This is step 4 of 4 in the complete PR creation process. Always use after jira-issue-management, code-review, and pull-request-management workflows to provide comprehensive test coverage for the created PR.

---

## Process

### Step 1: Understand the PR changes

Read the PR description to understand:
- What feature or bug is being addressed
- What specific functionality changed
- What edge cases need testing
- Any concerns/questions raised

Identify the main test scenarios that need coverage.

### Step 2: Find actual UI element names from Vue code

**CRITICAL**: Always verify exact button names, tab names, and UI element labels from the actual Vue components. Never guess or assume names.

#### Finding button text and labels:

```bash
# Find button text in Vue components
grep -r "v-btn" web/src --include="*.vue" | grep -i "keyword"

# Find specific button labels
grep -r ">Create" web/src --include="*.vue"
grep -r ">Add" web/src --include="*.vue"
grep -r ">Save" web/src --include="*.vue"

# Find tab names
grep -r "v-tab" web/src --include="*.vue"

# Find form field labels
grep -r "label=" web/src --include="*.vue" | grep -i "keyword"
```

#### Finding navigation structure:

```bash
# Find router paths and page names
grep -r "router-link" web/src --include="*.vue" | grep -i "keyword"
grep -r "to=" web/src --include="*.vue" | grep -i "keyword"

# Find menu items
grep -r "v-list-item" web/src --include="*.vue"
grep -r "v-navigation" web/src --include="*.vue"
```

#### Example searches for common UI patterns:

```bash
# Agreement-related buttons
grep -r "New Agreement" web/src --include="*.vue"
grep -r "Create" web/src --include="*.vue"

# Tab components
grep -r 'v-tab.*Details' web/src --include="*.vue"
grep -r 'v-tab.*History' web/src --include="*.vue"

# Form buttons
grep -r "Submit" web/src --include="*.vue"
grep -r "Cancel" web/src --include="*.vue"
```

### Step 3: Verify navigation paths

Check the actual navigation structure:

```bash
# Find page components and their routes
cat web/src/router.ts

# Find sidebar navigation items
find web/src/components -name "*Nav*" -o -name "*Sidebar*" -o -name "*Menu*"
```

Read relevant navigation components to understand:
- Exact menu item text
- Navigation hierarchy
- Page locations

### Step 4: Structure test cases

Break testing into logical test cases:
- **Test Case 1**: Main happy path scenario
- **Test Case 2**: Edge cases and variations
- **Test Case 3**: Error conditions or negative tests
- **Test Case 4**: Additional scenarios specific to the feature

Each test case should:
- Have a clear descriptive heading
- Test one specific aspect of the functionality
- Include verification steps with expected outcomes

### Step 5: Write testing instructions following the standard format

Use this exact structure:

```markdown
# Testing Instructions

1. Run the test suite via `dev test`.
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:8080.

## Test Case 1: [Descriptive scenario name]

4. From the main app Dashboard, [first action]
5. Click **[Exact Button Name]** button
6. Fill in [form/dialog details]:
   - **[Field Label]**: [Instructions or example value]
   - **[Another Field]**: [Instructions]
7. Click **[Submit Button Name]** to submit
8. Verify [expected outcome]
9. Navigate to **[Page/Tab Name]** via [navigation path]
10. Verify [specific validation]

## Test Case 2: [Another scenario]

11. [Continue numbered sequence]
...
```

### Step 6: Follow formatting guidelines

**Required formatting rules:**

1. **Bold all UI elements**: `**Create Entry**`, `**Details** tab`, `**Add User** button`
2. **Use exact button text**: Search the code to find the actual button text, don't guess
3. **Sequential numbering**: Number steps continuously across all test cases (don't restart at 1)
4. **Navigation arrows**: Use `→` for navigation paths: `**Information Sharing Agreements** → **New Agreement** → **Details** tab`
5. **Specific locations**: "From the main app Dashboard", "in the right hand side panel", "via the left sidebar nav"
6. **Clear verification steps**: "Verify the table displays **Column Name** column", "Verify success message: 'exact text'"
7. **Test case headings**: Use `## Test Case N: Description` format
8. **Inline code for values**: Use backticks for URLs, exact error messages, field values

### Step 7: Include all test scenarios

Ensure coverage of:
- Main happy path functionality
- Edge cases (e.g., empty states, boundary conditions)
- Error conditions (e.g., validation errors, permission errors)
- Data persistence (verify data survives page refresh if relevant)
- Cleanup/deletion flows
- Any concerns mentioned in the PR description

### Step 8: Review and validate

Before finalizing:
- [ ] All UI element names match actual code
- [ ] Navigation paths are accurate
- [ ] All test cases have clear expected outcomes
- [ ] Sequential numbering is correct
- [ ] Bold formatting is applied to all UI elements
- [ ] Each test case tests a distinct scenario
- [ ] Edge cases from PR description are covered

## Example Output

```markdown
# Testing Instructions

1. Run the test suite via `dev test`.
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:8080.

## Test Case 1: User can create a new information sharing agreement

4. Click **Information Sharing Agreements** in the left sidebar nav
5. Click **New Agreement** button
6. Fill in the agreement details:
   - **Title**: Enter "Test Agreement"
   - **Yukon First Nation or Transboundary Contact Name**: Select a contact
7. Click **Save** to submit
8. Verify the agreement appears in the list with status "Draft"
9. Click the agreement to open it
10. Verify all fields are populated correctly

## Test Case 2: User can sign an agreement and groups are created

11. From the agreement detail page, click the **Sign** button
12. Fill in the signing details
13. Click **Confirm**
14. Verify the agreement status changes to "Signed"
15. Navigate to the **Groups** section
16. Verify sharing and receiving groups were created automatically
```

## Related Workflows

- [`./jira-issue-management.md`](./jira-issue-management.md) - Creating well-structured Jira issues
- [`./pull-request-management.md`](./pull-request-management.md) - Create and update pull requests
- [`./code-review.md`](./code-review.md) - Code review quality control

## Tips

- When in doubt about UI element names, always check the code first
- Pay attention to Vuetify component patterns (v-btn, v-tab, v-dialog, etc.)
- Check both the component files and any related store/service files
- Test instructions should be detailed enough that someone unfamiliar with the feature can follow them
- Include both success paths and failure paths when relevant
