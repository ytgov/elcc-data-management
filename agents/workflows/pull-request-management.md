---
description: Create and edit well-structured pull requests following ELCC project patterns and conventions
auto_execution_mode: 1
---

# Pull Request Management Workflow

## Intent

**WHY this workflow exists:** Pull requests communicate intent to reviewers and future maintainers. A well-structured PR explains the problem, the solution approach, and how to verify correctness. This reduces review friction and creates valuable documentation.

**WHAT this workflow produces:** A draft PR with:
- Clear title following naming conventions
- Context explaining WHY the change is needed
- Implementation summarizing WHAT was changed (purpose, not files)
- A generated `# Testing Instructions` section

**Decision Rules:**
- **Title format:** Use `Issue-<number>: Description` for GitHub issues, `TICKET-ID: Description` for Jira tickets, `Fix: Description` for bug fixes, or `Action Verb + Noun` for features. Always use AP style title case.
- **Ticket prefix rule:** Only use ticket prefixes (`ELCC-123:`, `Issue-123:`) when referencing actual external ticket entities. For internal work without external tracking, use descriptive titles without prefixes.
- **Implementation section:** Focus on purpose and intent, not specific files. A reviewer can see file changes in the diff - the Implementation section explains the reasoning behind those changes.
- **Screenshots:** Check the diff for `web/src/components/` or `web/src/pages/` changes. If present, write "TODO" and let user add screenshots. Only write "N/A - backend changes only" if there are truly no frontend changes.
- **Draft mode:** Always create PRs as drafts first
- **Testing instructions are delegated:** Do not author detailed QA steps in this workflow. Generate or refresh the entire `# Testing Instructions` section via `testing-instructions.md`.
- **PR edits still need QA workflow:** When updating an existing PR body, if the change touches the `# Testing Instructions` section or could invalidate it, rerun the `testing-instructions` workflow before patching the PR.
- **Complete workflow sequence:** This is step 3 of 4 in the complete PR creation process. Always use after jira-issue-management and code-review workflows, then follow with testing-instructions workflow for comprehensive test coverage.

This workflow covers the process of creating and editing well-structured pull requests that follow the established patterns in the ELCC project.

## Quick Reference

```bash
# Create draft PR via gh api (preferred)
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls -X POST \
  -F title="Title here" \
  -F head="branch-name" \
  -F base="main" \
  -F draft=true \
  -F body=@-
Fixes <url>

Relates to:

- <related-pr-or-issue-url>

# Context

<context>

# Implementation

1. <change>

# Screenshots

TODO - check diff for web/src/components/ or web/src/pages/ changes

# Testing Instructions

Generated via `testing-instructions.md`
EOF
)"
```

## Process Steps

### 1. Gather Context

Before creating a PR, gather all the information you need:

```bash
# Check current branch status
git status

# View commits on this branch
git log main..HEAD --oneline

# View full diff from main
git diff main...HEAD

# Check if branch is pushed
git branch -vv
```

### 2. Determine PR Title

Use one of these patterns:

| Pattern | When to Use | Example |
|---------|-------------|---------|
| `Issue-<number>: Description` | Linked to GitHub issue | `Issue-314: Normalize Building Expense Components to Modern Patterns` |
| `TICKET-ID: Description` | Linked to Jira ticket | `ELCC-94: Add Per-Center Per-Month Building Expense Customization` |
| `Fix: Description` | Bug fixes without ticket | `Fix: Building Expense Search Not Returning Results` |
| `Action Verb + Noun` | Features/improvements | `Add Building Expense Category Management` |

**Title Guidelines:**
- Use **AP style title case** (validate at https://titlecaseconverter.com/?style=AP)
- Be specific but concise
- Start with action verb when no ticket ID
- **Important:** Only use ticket prefixes (`ELCC-123:`, `Issue-123:`) when referencing actual external ticket entities. For internal work without external tracking, use descriptive titles without prefixes.

### 3. Write PR Body

Follow this template structure:

```markdown
Fixes <issue-tracker-url>

Relates to:

- <related-pr-or-issue-url>

# Context

<Problem explanation, user reports, motivation>

# Implementation

1. <Implementation detail>
2. <Additional change>

# Screenshots

<Screenshots or "N/A">

# Testing Instructions

<Paste the output from `testing-instructions.md`>
```

**PR Template Usage:**

The GitHub PR template provides the basic structure. Fill in each section following these guidelines:

- **Fixes:** Add issue URL or "N/A" if no specific issue
- **Relates to:** Add related PRs/issues or remove this section entirely
- **Context:** Explain the problem, user reports, or motivation for the change
- **Implementation:** List all changes made in numbered format
- **Screenshots:** Check diff for frontend changes; write "TODO" and let user add screenshots if UI changed, "N/A" only if no frontend files changed
- **Testing Instructions:** Delegate the entire section to `testing-instructions.md` and paste that workflow's output

### 4. Section Guidelines

#### Context Section

- Explain **why** the change is needed
- Include user reports using blockquotes (`>`)
- For bugs, describe root cause if known
- Include "Steps to Reproduce" for bugs
- **Use concise, direct language**: "Implements automatic group creation when agreements are signed" not "Implements automatic group creation when information sharing agreements is marked as signed"
- **Focus on problem and solution**: Remove redundant words and unnecessary context

**Example:**
```markdown
# Context

User Report
> Building expenses are fairly informal and need to be customized on a per-month, per-center basis.

The existing interface only supported bulk management at the category level, with no way to individually adjust expenses.
```

#### Implementation Section

- Use numbered list
- Focus on **purpose and intent**, not specific file changes
- Extract meaning from commits - what was the goal of each change?
- A reviewer can see file diffs - tell them WHY, not WHERE
- Keep it concise: 5-10 items maximum
- **Use direct, active voice**: "Add group creation service" not "Add proper group creation service for the entire system"
- **Avoid redundant qualifiers**: Remove words like "entire", "proper", "fully", "completely"

**Good Example (purpose-focused):**
```markdown
# Implementation

1. Replace dialog-based editing with dedicated page routes
2. Convert JavaScript API and composables to TypeScript
3. Split monolithic table into modular Card and DataTable components
4. Standardize component naming to match Vuetify patterns
```

**Bad Example (file-focused - avoid this):**
```markdown
# Implementation

1. Delete BuildingExpenseCreateDialog.vue
2. Delete BuildingExpenseEditDialog.vue
3. Add BuildingExpenseNewPage.vue
4. Add BuildingExpenseEditPage.vue
5. Update BuildingExpensesEditCard.vue
6. Update router.ts
```

#### Screenshots Section

**Before writing this section, check the diff:**
```bash
git diff main...HEAD --name-only | grep -E "^web/src/(components|pages)/"
```

- **If files are returned:** UI changes exist - write "TODO" and let user add screenshots
- **If no files returned:** Write "N/A - backend changes only"

**For humans adding screenshots:**
- Use `<img>` tags with width/height
- Include before/after comparisons for visual changes
- Capture the relevant UI state after the change

**Example:**
```markdown
# Screenshots

<img width="726" height="604" alt="Updated search results with proper display" src="https://github.com/user-attachments/assets/..." />
```

#### Testing Instructions Section

Describe how a reviewer can verify the change with the least ambiguity possible.

- Include the relevant automated checks
- List the main manual verification steps in the order a reviewer should perform them
- Call out any setup, seed data, or permissions needed to exercise the change
- Focus on the changed behavior, not generic project smoke tests

### 5. Create the PR

**All PRs should be created in draft mode** to allow for review and iteration before marking ready.

```bash
# Ensure branch is pushed
git push -u origin HEAD

# Create draft PR via gh api
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls -X POST \
  -F title="Title" \
  -F head="$(git branch --show-current)" \
  -F base="main" \
  -F draft=true \
  -F body=@-
[Body content]
EOF
```

To mark a draft PR as ready for review:
```bash
gh api repos/{owner}/{repo}/pulls/NUMBER -X PATCH -F draft=false
```

### 6. Edit Existing Pull Requests

When you need to update an existing PR (add context, fix title, update testing instructions):

```bash
# View current PR details
gh api repos/{owner}/{repo}/pulls/NUMBER

# Edit PR title
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls/NUMBER -X PATCH -F title=@-
New Title
EOF

# Edit PR body
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls/NUMBER -X PATCH -F body=@-
Updated PR body content
EOF

# Or edit interactively (use gh api for consistency)
gh api repos/{owner}/{repo}/pulls/NUMBER
```

**Common Scenarios for Editing:**

| Scenario | What to Update |
|----------|----------------|
| **Missing context** | Add detailed problem explanation to Context section |
| **Unclear implementation** | Expand Implementation section with numbered list |
| **Missing screenshots** | Add Screenshots section with images or "N/A - backend changes only" |
| **Incomplete testing** | Add specific testing steps after the standard 3 steps |
| **Wrong title format** | Update title to follow naming patterns |
| **Add related issues** | Add "Relates to:" section with links |

**Editing Workflow:**

1. **Assess what's missing** - Compare current PR against the quality checklist
2. **Gather missing information** - Get screenshots, testing steps, or context
3. **Update systematically** - Edit one section at a time if needed
4. **Verify completeness** - Run through the quality checklist again

**Example Edit:**
```bash
# Add missing testing instructions to PR #108
cat <<'EOF' | gh api repos/{owner}/{repo}/pulls/108 -X PATCH -F body=@-
Fixes https://yg-hpw.atlassian.net/browse/ELCC-94

# Context

End users reported that building expenses need per-month, per-center customization.

# Implementation

1. Add inline building expense creation form to the monthly worksheet edit table
2. Add building expense deletion capability to the edit table
3. Expose building expense policy actions via the API serializer

# Screenshots

<img width="1024" height="768" alt="Building expense create form" src="https://github.com/user-attachments/assets/..." />

# Testing Instructions

1. Run the test suite via `dev test` (or `dev test_api`).
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:8080.
4. Navigate to a child care centre monthly worksheet.
5. Click the **Add Building Expense** button.
6. Fill in the form and click **Create**.
7. Verify the expense appears in the table.
EOF
```

### 7. Quality Checklist

Before submitting:

- [ ] PR created as draft
- [ ] Title follows naming pattern
- [ ] Context explains the "why"
- [ ] Implementation lists all changes
- [ ] Screenshots included for UI changes
- [ ] Testing instructions start with standard steps
- [ ] All tests pass locally
- [ ] Type checking passes: `dev api npm run check-types` / `dev web npm run check-types`
- [ ] No `@ts-ignore`, `@ts-expect-error`, or `any` types

## ELCC-Specific Patterns

### Testing Commands

Always use these exact commands in testing instructions:

- **Tests:** `dev test` (or `dev test_api`, `dev test_web`)
- **Type checking:** `dev api npm run check-types` / `dev web npm run check-types`
- **App startup:** `dev up`
- **Login URL:** http://localhost:8080

### Code Quality Standards

- TypeScript only - no `any`, `@ts-expect-error`, `@ts-ignore`, or `!`
- Use full descriptive names (no abbreviations)
- Follow expanded code style with guard clauses
- Use `@/` import alias for src directory

### Common UI Navigation Patterns

- **Administration** → **Building Expense Categories** → **New Building Expense Category**
- Child care centre → fiscal year → month tab → **Monthly Worksheet**
- **Administration** → **Funding Periods**

## Pattern Examples from ELCC

### Bug Fix Example

```markdown
# Fix: Building Expense Total Not Updating

Fixes https://yg-hpw.atlassian.net/browse/ELCC-100

# Context

User Report
> The total cost column is not updating when estimated or actual costs are changed.

Investigation revealed that the computed total was not reacting to input changes due to a missing watcher.

# Implementation

1. Fix reactive total cost computation on building expense edit
2. Add test coverage for total cost recalculation

# Screenshots

<img width="1024" height="768" alt="Building expenses table with correct totals" src="https://github.com/user-attachments/assets/..." />

# Testing Instructions

1. Run the test suite via `dev test` (or `dev test_api`).
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:8080.
4. Navigate to a child care centre monthly worksheet.
5. Edit the **Estimated Cost** for a building expense.
6. Verify the **Total Cost** column updates accordingly.
```

### Feature Example

```markdown
# ELCC-94: Add Per-Center Per-Month Building Expense Customization

Fixes https://yg-hpw.atlassian.net/browse/ELCC-94

# Context

End users reported that building expenses are fairly informal and need to be customized on a per-month, per-center basis. The existing interface only supported bulk management at the category level.

# Implementation

1. Add inline building expense creation form to the monthly worksheet edit table
2. Add building expense deletion capability to the edit table
3. Optionally apply newly added building expenses to current and future fiscal periods

# Screenshots

TODO

# Testing Instructions

1. Run the test suite via `dev test` (or `dev test_api`).
2. Boot the app via `dev up`.
3. Log in to the app at http://localhost:8080.
4. Navigate to a child care centre monthly worksheet for a current fiscal period.
5. Click the **Add Building Expense** button.
6. Select a **Category** and fill in costs.
7. Click **Create**.
8. Verify the expense appears in the **Building Expenses** table.
```

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| PR not in draft mode | Always create PRs as drafts using `draft=true` |
| Vague context | Be specific about the problem and user impact |
| Missing testing steps | Start with standard 3 steps for ELCC |
| No screenshots for UI | Always include for visual changes |
| Marking screenshots N/A when UI changed | Check diff for `web/src/components/` or `web/src/pages/` before writing N/A |
| Unclear scope | Separate core changes from side fixes |
| Missing links | Include Fixes/Relates to URLs |
| Wrong test commands | Use `dev test` not generic test commands |
| Type checking ignored | Always run `npm run type-check` |

---

## Related Workflows

- [`./testing-instructions.md`](./testing-instructions.md) - Generate the `# Testing Instructions` section with verified UI labels and QA scenarios

- [`./jira-issue-management.md`](./jira-issue-management.md) - Creating well-structured Jira issues
- [`./testing-instructions.md`](./testing-instructions.md) - Generate comprehensive testing instructions
- [`./code-review.md`](./code-review.md) - Code review quality control

---

**Last Updated:** 2026-03-12

*Update this workflow when you discover better patterns or ELCC project conventions evolve.*
