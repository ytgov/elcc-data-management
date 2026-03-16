---
description: Create, enhance, and manage well-structured Jira issues using project conventions
auto_execution_mode: 1
---

# Jira Issue Management Workflow

## Intent

**WHY this workflow exists:** Creating and managing effective Jira issues requires consistent structure, clear problem descriptions, and actionable requirements. Poorly written issues lead to confusion, scope creep, and implementation delays, while proper enhancement patterns ensure issues remain valuable throughout their lifecycle.

**WHAT this workflow produces:** Well-structured Jira issues that include:

- Clear problem descriptions or feature requests
- Specific reproduction steps or requirements
- Proper issue labeling and assignment
- Screenshots/mockups when relevant
- Enhanced descriptions with visual evidence and external source links
- Proper dependency relationships between issues

**Decision Rules:**

- **Use Jira Web UI:** Create issues directly in TK project at https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27
- **Title Case Formatting:** Use title case for Jira ticket titles - capitalize major words, keep minor words (articles, prepositions, conjunctions) lowercase
- **Bug Reports:** Use "Bug" issue type for defects and problems
- **Feature Requests:** Use "User Story" issue type for new functionality (validate with getJiraProjectIssueTypesMetadata first)
- **Improvements/Refactoring:** Use "Task" issue type
- **Large Features:** Use "Epic" issue type with multiple child issues
- **Labels:** Always include appropriate labels for type, priority, and component
- **User Reports:** Integrate into main description when primary context; add as separate comment for supplemental information
- **Visual Evidence:** Embed screenshots directly in descriptions when available for immediate context
- **External Sources:** Create remote links with proper global IDs (MD5 hash pattern) for external references
- **Dependencies:** Use proper issue linking ("causes"/"is caused by") to establish technical relationships
- **MCP Tool Validation:** Always validate available options before using MCP tools (e.g., check issue types with getJiraProjectIssueTypesMetadata before creating)
- **Complete workflow sequence:** This is step 1 of 4 in the complete PR creation process. Always use before code-review, pull-request-management, and testing-instructions workflows to ensure proper issue structure and requirements gathering.

## Reference Files

- TK Jira Board: https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27
- Jira Issue Types: Bug, User Story, Task, Epic (validate with getJiraProjectIssueTypesMetadata)
- TK Project Labels and Components

---

## Step 1: Choose Issue Type

**For Bugs/Defects:** Use "Bug" issue type
**For New Features:** Use "User Story" issue type (validate with getJiraProjectIssueTypesMetadata first)
**For Improvements/Refactoring:** Use "Task" issue type
**For Large Features:** Use "Epic" issue type with multiple child issues

---

## Step 2: Fill Out Issue Fields

**Bug Issue Fields:**
- **Summary:** Clear, concise description of the problem
- **Description:** Detailed problem explanation with reproduction steps
- **Priority:** Set appropriate priority level
- **Labels:** Add relevant labels (bug, easy-win, etc.)
- **Components:** Assign to relevant component if applicable

**Story/Task Issue Fields:**
- **Summary:** Clear description of feature or improvement
- **Description:** Problem context and solution requirements
- **Priority:** Set appropriate priority level
- **Labels:** Add relevant labels (enhancement, refactor, etc.)
- **Components:** Assign to relevant component if applicable

---

## Step 3: Write Effective Context

**Enhanced Description Patterns:**

- **Visual Evidence Integration**: Embed screenshots directly in descriptions when available - they provide immediate context that text alone cannot convey
- **Precise Reproduction Steps**: Include specific trigger conditions rather than generic instructions
- **Impact Conciseness**: Use single, powerful statements that capture the essence of the business impact
- **External Source Linking**: Create remote links with proper global IDs (using MD5 hash pattern) for external references
- **Dependency Relationships**: Use proper issue linking ("causes"/"is caused by") to establish clear technical relationships between tickets
- **Description Integration**: Move user reports into the main description rather than separate comments when they're the primary context
- **Clean Structure**: Remove redundant comments when the information is properly integrated into the main description
- **Factual Accuracy**: Differentiate clearly between definite facts (user quotes, confirmed behaviors) and probable hypotheses (potential causes). Never guess or invent technical details
- **Actionable Investigation**: Provide specific file names, service names, and concrete technical steps rather than general possibilities
- **Focused Root Causes**: Prioritize the most probable causes (2-3 focused hypotheses) rather than exhaustive possibilities, but always label them as "possible" or "potential"
- **Implementation Hints**: Include specific technical solutions when known

**For Bug Reports:**

- Include exact error messages
- Provide specific URLs or page names
- Include browser console errors if applicable
- Mention recent changes that might be related
- Add screenshots directly in description when available

**For Feature Requests:**

- Use simple structure: Context → User Report → Proposed Solution(s)
- Keep descriptions concise and focused
- Use numbered options for different approaches
- Reference related tickets where applicable

---

## Step 4: Add Labels and Assignment

**TK Project Labels:**
- `bug` - Something isn't working
- `enhancement` - Adds or modifies features to improve functionality or user experience
- `refactor` - Improves code's internal structure without changing its behavior
- `documentation` - Improvements or additions to documentation
- `easy-win` - Quick fixes that provide significant user value
- `cultural-protocols` - Issues related to Indigenous cultural protocols
- `indigenous-language` - Language support and translation
- `access-control` - Permissions and access management
- `data-migration` - Data import/export/migration tasks

**Priority Levels:**
- **Highest** - Critical issues blocking production
- **High** - Important issues affecting core functionality
- **Medium** - Standard priority for most issues
- **Low** - Minor issues or nice-to-have improvements
- **Lowest** - Cosmetic issues or very low impact

**Assignment:**
- Assign to appropriate team member based on expertise
- If unsure, leave unassigned for team lead to assign

---

## Complete Examples

### Bug Report Example

**Title:** `Fix: Knowledge Entry Search Not Returning Indigenous Language Results`

**Labels:** `bug`, `indigenous-language`

**Body:**

```
**Describe the bug**
Users are unable to search for traditional knowledge entries using Indigenous language terms. The search returns no results even when entries exist with matching terms.

**To Reproduce**
Steps to reproduce the behavior:
1. Navigate to Knowledge Base
2. Enter an Indigenous language search term
3. Click search
4. Observe empty results

**Expected behavior**
Search should return knowledge entries matching the Indigenous language terms.

**Desktop (please complete your following information):**
- OS: Windows 11
- Browser: Chrome 120.0.6099.129
- Version: Latest

**Additional context**
Error in console: "Search index does not include language metadata"
```

### Feature Request Example

**Title:** `Enhancement: Add Cultural Protocol Management for Knowledge Entries`

**Labels:** `enhancement`, `cultural-protocols`

**Body:**

```
# Context

Knowledge Keepers need the ability to set cultural protocols on entries so that sensitive information is only accessible to authorized community members. Currently there is no way to restrict access based on cultural sensitivity.

## User Report

> We need to be able to mark certain knowledge as restricted so only authorized community members can view it.

## Proposed Solutions

### Option 1

Add cultural protocol settings directly on each knowledge entry with role-based access control.

### Option 2

Implement community-level protocol templates that can be applied to entries.

### Option 3

Create a tiered access system with community approval workflows.
```

### Refactoring Example

**Title:** `Refactor: Standardize Information Sharing Agreement Service Pattern`

**Labels:** `refactor`

**Body:**

```
# Context

Current ISA services have inconsistent patterns between create, update, and sign flows, leading to potential data integrity issues and maintenance overhead.

## User Report

> We're seeing inconsistencies in how agreements are processed depending on the action taken.

## Proposed Solutions

### Option 1

Standardize all ISA services to use the BaseService pattern with consistent validation and group management.

### Option 2

Keep current service patterns with manual oversight.
```

---

## Step 5: Create the Issue

### Option 1: Create via Jira Web UI

1. Go to https://yg-hpw.atlassian.net/jira/software/projects/TK/boards/27
2. Click **Create** in the top navigation
3. Select appropriate issue type (Bug, Story, Task, Epic)
4. Fill in Summary and Description fields following the examples above
5. Set Priority and add relevant Labels
6. Assign to appropriate team member if known
7. Click **Create**

### Option 2: Create via Jira REST API

**For Bug Reports:**
```bash
curl -X POST "https://yg-hpw.atlassian.net/rest/api/3/issue" \
  -H "Authorization: Basic $(echo -n 'email:api_token' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": { "key": "TK" },
      "issuetype": { "name": "Bug" },
      "summary": "Bug: [Brief Description]",
      "description": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{
            "type": "text",
            "text": "**Describe the bug**\n[Clear description]\n\n**To Reproduce**\nSteps to reproduce the behavior:\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\n**Expected behavior**\n[What should happen]\n\n**Desktop (please complete your following information):**\n- OS: [e.g. macOS 14.0]\n- Browser: [e.g. Chrome 120.0.6099.129]\n- Version: Latest\n\n**Additional context**\n[Any relevant extra information]"
          }]
        }]
      },
      "priority": { "name": "Medium" },
      "labels": ["bug", "easy-win"]
    }
  }'
```

**For Feature Requests:**
```bash
curl -X POST "https://yg-hpw.atlassian.net/rest/api/3/issue" \
  -H "Authorization: Basic $(echo -n 'email:api_token' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": { "key": "TK" },
      "issuetype": { "name": "Story" },
      "summary": "Feature: [Brief Description]",
      "description": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{
            "type": "text",
            "text": "Relates to:\n- [Related issues or documentation]\n\n# Context\n\n**Is your feature request related to a problem? Please describe.**\n[Problem description]\n\n**Describe the solution you would like**\n[Clear solution description]\n\n**Describe alternatives you have considered**\n[Alternative approaches]\n\n**Additional context**\n[Extra details, examples, or context]"
          }]
        }]
      },
      "priority": { "name": "Medium" },
      "labels": ["enhancement"]
    }
  }'
```

---

## Enhancing Existing Issues

### When to Enhance

- Adding visual evidence after initial creation
- Integrating user reports from external sources
- Adding dependency relationships between issues
- Updating descriptions with investigation findings

### Enhancement Patterns

**Adding Remote Links:**
```bash
# Generate MD5 hash global ID
GLOBAL_ID=$(echo -n "https://external-system.com/conversation/unique-id" | md5sum | cut -c1-8)

# Create remote link
curl -X POST "https://yg-hpw.atlassian.net/rest/api/3/issue/{issueKey}/remotelink" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n '${JIRA_EMAIL}:${JIRA_API_TOKEN}' | base64)" \
  -d "{
    \"globalId\": \"${GLOBAL_ID}\",
    \"object\": {
      \"url\": \"https://external-system.com/conversation/unique-id\",
      \"title\": \"User Report - UserName <user@example.com>\"
    }
  }"
```

**Issue Linking Patterns:**
- Use "causes"/"is caused by" for technical dependencies
- Use "relates to" for related but independent issues
- Link to parent/child issues for hierarchical relationships

---

## Quality Checklist

**For Bug Reports:**

- [ ] Bug description is clear and concise
- [ ] Reproduction steps are numbered and specific
- [ ] Expected vs actual behavior is clearly stated
- [ ] Screenshots included when applicable
- [ ] Browser/OS version information provided
- [ ] Error messages included verbatim
- [ ] Recent changes mentioned if relevant

**For Feature Requests:**

- [ ] Uses simple structure: Context → User Report → Proposed Solutions
- [ ] User report included as direct quote
- [ ] Problem context is clearly explained
- [ ] Multiple solution options provided when applicable
- [ ] Related tickets referenced where applicable

**General:**

- [ ] Appropriate labels assigned (type, priority, component)
- [ ] Related issues or documentation linked
- [ ] Title is descriptive and follows project conventions
- [ ] Title uses proper title case formatting
- [ ] Issue is assigned to appropriate team member if applicable

---

## ELCC-Specific Considerations

### User Reports Integration

For issues reported by users:

1. **Primary Context**: Integrate user reports into main description when they're the primary context for the issue
2. **Supplemental Information**: Add as separate comment with web link when providing additional context
3. **Remote Links**: Create remote links with proper global IDs for external references
4. **Format**: Use clear "User Report" section with reporter's email and original description
5. **Visual Evidence**: Include screenshots directly in description when available

### Common ELCC Context Patterns

**Building Expense Issues:**
- Include specific expense categories and funding regions
- Reference fiscal periods and centre details
- Include subsidy rate context when relevant

**Worksheet Issues:**
- Include fiscal year and month context
- Reference centre and funding period relationships
- Include employee benefit or space allocation context

**Administration Issues:**
- Include user roles and permissions
- Reference funding region or period scoping
- Include data integrity considerations for past fiscal periods

---

## Related Workflows

- [`./code-review.md`](./code-review.md) - Code review quality control
- [`./pull-request-management.md`](./pull-request-management.md) - Create and update pull requests
- [`./testing-instructions.md`](./testing-instructions.md) - Generate comprehensive testing instructions

---

**Last Updated:** 2026-03-12

_Update this workflow when you discover better patterns or ELCC project conventions evolve._
