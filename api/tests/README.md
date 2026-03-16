# API service Tests

## Implementation

Tests are written in [vitest](https://vitest.dev/guide/)

Test initialization goes like this:

1. `api/vitest.config.mts` loads the ts config and finds the appropriate setup functions.

2. Before running the tests, it runs the `globalSetup` function from `api/tests/global-setup.ts`. Things like setting up the database and running migrations and base seeds.

3. Next it loads a specific test file triggers the `setupFiles` files, currently only `api/tests/setup.ts`. These setup files add callbacks that will run before/after _each test file_ runs, so they should be performant. Mostly cleanup functions.

4. It runs the actual tests in the loaded file.

5. (Currently) Runs `beforeEach` callback that cleans the database before each test file is run.

6. Runs the next test file, and repeats from step 3.

## General Notes About Tests

1. Tests should map to a specific file in the api/src folder.

   e.g.

   - `api/src/models/funding-submission-line-json.ts` maps to `api/tests/models/funding-submission-line-json.test.ts`
   - `api/src/services/centre-services.ts` maps to `api/tests/services/centre-services.test.ts`

2. Tests should follow the naming convention `{filename}.test.{extension}`.
3. Test file location should be moved if a given file is moved, and deleted if the file under test is deleted.
4. A good general pattern for a test is
   ```typescript
   describe("api/src/services/centre-services.ts", () => { // references file under test
     describe("CentreServices", () => { // references class or model under test
       describe(".create", () => { // referneces a specific method on the class or model
       test("creates a new centre in the database", async () => { // descriptive message about the specific behaviour under test
       })
     })
   })
   ```
5. In isolated model or scope tests, avoid redundant `where` clauses that only restate the records created in the test. Only include extra filters when that filter is part of the behavior under test.
6. Prefer one `expect(...)` per test. If you need to verify multiple outcomes, split them into separate tests with narrow assertions.
7. Prefer concrete record assertions over count-only assertions. When asserting persisted results, prefer `findAll()` on the full table and compare the returned records directly. Do not add restrictive `where` clauses or `order` clauses unless that filter or ordering is part of the behavior under test.
8. Use full, descriptive variable names in tests. Avoid abbreviations like `persistedCategory` when `persistedBuildingExpenseCategory` is clearer.
9. Order test imports by conceptual distance: third-party libraries first, then local project imports such as models, then factories, and finally the file under test.
10. I'm using a plugin that lets me switch between the test and non-test file, and creates the test file if it does not exist. It's not great, but it mostly works. See https://marketplace.visualstudio.com/items?itemName=klondikemarlen.create-test-file

   It requires this config (in your workspace or `.vscode/settings.json`).

   > Note that if this is in your worspace config must be inside the "settings" entry. i.e. `{ "settings": { // these settings } }`.

   ```json
   {
     "createTestFile.nameTemplate": "{filename}.test.{extension}",
     "createTestFile.languages": {
       "[vue]": {
         "createTestFile.nameTemplate": "{filename}.test.{extension}.ts"
       }
     },
     "createTestFile.pathMaps": [
       {
         // Other examples
         // "pathPattern": "/?(.*)",
         // "testFilePathPattern": "spec/$1"
         "pathPattern": "(api)/src/?(.*)",
         "testFilePathPattern": "$1/tests/$2"
       },
       {
         "pathPattern": "(web)/src/?(.*)",
         "testFilePathPattern": "$1/tests/$2"
       }
     ],
     "createTestFile.isTestFileMatchers": [
       "^(?:test|spec)s?/",
       "/(?:test|spec)s?/",
       "/?(?:test|spec)s?_",
       "/?_(?:test|spec)s?",
       "/?\\.(?:test|spec)s?",
       "/?(?:test|spec)s?\\."
     ]
   }
   ```
