---
description: Code Review Quality Control Workflow for TypeScript code in the ELCC project
---

# Code Review Quality Control Workflow

Use this workflow to review TypeScript code for the ELCC project. Apply every rule below as a hard gate — flag any violation as a blocking issue. For each issue found, quote the offending lines and state which rule they violate.

**Complete workflow sequence:** This is step 2 of 4 in the complete PR creation process. Always use after jira-issue-management workflow and before pull-request-management workflow to ensure code quality standards are met.

## Steps

1. **Review TypeScript Strictness**
   - No `any` — not in source, not in tests, not in casts
   - No `!` (non-null assertion) — use `isNil` / optional chaining / explicit guard clauses instead
   - No `@ts-ignore` or `@ts-expect-error`
   - No relative imports — always `@/...` path aliases. Exception: barrel `index.ts` files may use relative imports for re-exports

2. **Check Type Cast Placement**
   - Type casts with `as` must happen on assignment or creation, never at the point of use
   - **When a cast is needed at point of use, create a new type definition** that returns the correct type by design, eliminating the need for casts
   - Prefer proper type definitions over runtime type checks; only use guard clauses when runtime validation is genuinely needed, not just to satisfy TypeScript
   - A cast is only acceptable when the type system genuinely cannot infer a type that is known at runtime

3. **Check Cyclomatic Complexity**
   - Each function or method should have at most one level of conditional nesting in its main body
   - Use guard clauses (early returns) to flatten logic
   - Each guard clause must be followed by a blank line before the next statement

4. **Verify Test Completeness**
   - Every test must include explicit Arrange / Act / Assert comments and be fully self-contained
   - No shared state from `beforeEach` unless it is truly invariant setup (e.g., DB reset)
   - Service test assertions should target database state, not service return values, unless the return value is specifically what is under test
   - Spy assertions — use `expect(spy).not.toHaveBeenCalled()` without arguments. Never use `not.toHaveBeenCalledWith(...)`

5. **Ensure One Expect Per Test**
   - Consolidate assertions into a single `expect` using `expect.objectContaining`
   - Exceptions: tests that assert something did NOT happen (e.g., `not.toHaveBeenCalled()`, `not.toBe()`) may be standalone single-line expects
   - When asserting "not any of N values", split into N separate tests rather than looping

6. **Check Test Naming**
   - Tests must follow `"when [condition], [expected behaviour]"` with full English words (no abbreviations)
   - Numbered entities in test bodies: `user1`, `user2`, `workflowStep1`, `workflowStep2` — never `existingUser`, `newUser`
   - Describe hierarchy must mirror the source file path

7. **Validate Error Messages**
   - `expect(bool).toBe(true)` is never acceptable — a failing test must tell you what went wrong without reading the source
   - Split complex boolean assertions into individual named assertions

8. **Check Architecture Consistency**
    - When multiple classes serve similar purposes, ensure they have consistent APIs and clear differentiation in their type signatures
    - **When extending functionality, create new types rather than modifying existing ones to avoid breaking changes**
    - **Ensure similar classes follow the same patterns**
    - Flag inconsistent naming or patterns between similar classes

9. **Check for Over-Engineering**
    - Flag additions that were not requested:
      - New abstractions, helpers, or utilities for a one-time use
      - Features, flags, or configurability that no current caller needs
      - Comments explaining what the code does when the names already say it
      - Error handling for states that cannot be reached

10. **Check for Orphaned or Non-Sensical Code**
    - Flag functions, methods, or code paths that serve no purpose
    - Look for placeholder implementations that never get called
    - Identify dead code paths or unreachable logic
    - **Flag code with comments like "legacy path" or "no-op here" that should be removed**
    - **When removing features, remove all related types, imports, and exports** - don't leave partially implemented type systems
    - Verify that all exported functions are actually used somewhere in the codebase

11. **Validate Import Organization**
    - Imports must follow PEP 8-style grouping with a blank line between each group:
      1. Node.js built-ins (`path`, `fs`, etc.)
      2. External packages from `node_modules`
      3. Internal imports from `@/`
    - Within each group, alphabetical ordering is required. One import statement per module

12. **Check Naming Conventions**
    - No abbreviations — `workflow` not `wf`, `migration` not `mig`
    - Fully qualified names at public boundaries — when data crosses a boundary (API response, email template, event payload), prefix with the parent model name to disambiguate
    - SQL — fully spell out table and column names; no abbreviated aliases
    - Function names — describe both trigger and behavior

13. **Verify Expanded Style**
    - Avoid terse functional chains. Each logical step must be on its own line or extracted to a named variable
    - Extract and rename before constructing objects — never inline a property rename
    - No chained transformations — break chains at each step
    - Named constants — hoist every magic number or string to a named `const` at the top of the function or file

14. **Check Service Pattern**
    - Services encapsulate business logic and are invoked exclusively via their static `perform()` method
    - Never instantiate a service directly outside of its own `static perform()` implementation
    - Red flags: `new SomeService(...)` at a call site, business logic in a controller that belongs in a service, a service calling a query directly instead of delegating to another service

## Output Format

For each issue:

```
[RULE N] <rule name>
File: <path>:<line>
> <quoted offending code>
Fix: <one-sentence description of what to change>
```

After listing all issues, conclude with one of:
- **APPROVED** — no blocking issues found.
- **CHANGES REQUESTED** — N blocking issues listed above.

## Related Workflows

- [`./jira-issue-management.md`](./jira-issue-management.md) - Creating well-structured Jira issues
- [`./pull-request-management.md`](./pull-request-management.md) - Create and update pull requests
- [`./testing-instructions.md`](./testing-instructions.md) - Generate comprehensive testing instructions for pull requests
