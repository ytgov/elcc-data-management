# Workflows

This directory contains reusable AI workflows for the ELCC Data Management system.

## Available Workflows

### 📋 [create-admin-ui.md](create-admin-ui.md)

Complete workflow for adding full CRUD admin UI for any model.

**Includes:**
- Backend: Model, Controller, Policy, Services, Serializers, Routes
- Frontend: API Client, Composables, Components, Pages, Integration
- Testing checklist
- Common pitfalls

**Reference:** FundingRegion implementation (commit: `973af90`)

### 📋 [pull-request-management.md](pull-request-management.md)

Create and edit well-structured pull requests following ELCC project conventions.

### 📋 [testing-instructions.md](testing-instructions.md)

Generate comprehensive testing instructions with exact UI element names verified from Vue code.

### 📋 [code-review.md](code-review.md)

Code review quality control for TypeScript with 14 hard rules as blocking gates.

### 📋 [jira-issue-management.md](jira-issue-management.md)

Create well-structured Jira issues using project conventions.

---

## Complete PR Creation Sequence

1. **jira-issue-management** - Create or review the Jira issue
2. **code-review** - Review code quality before PR
3. **pull-request-management** - Create the draft PR
4. **testing-instructions** - Generate comprehensive testing instructions

---

## Using Workflows

Workflows are designed to be used with AI coding assistants like Claude or Windsurf.

See parent [agents/README.md](../README.md) for setup instructions.

---

**Last Updated:** 2026-03-15
