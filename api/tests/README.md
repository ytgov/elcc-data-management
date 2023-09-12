# API service Tests

Notes about test.

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
5. I'm using a plugin that lets me switch between the test and non-test file, and creates the test file if it does not exist. It's not great, but it mostly works. See https://marketplace.visualstudio.com/items?itemName=klondikemarlen.create-test-file

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
