# Solution

## Task A — Root cause analysis

### Failing test 1: `search filters the task list by title` (`../assignment/tests/e2e/search.spec.ts`)

- **Root cause:** The taskManager.search() method was using an incorrect/new locator for the Search input instead of the existing searchInput locator defined in TaskManagerPage.

- **Fix applied:** Updated taskManager.search() to use the existing searchInput locator from TaskManagerPage.

I also noticed that the second test in search.spec.ts was not failing, even though both tests covered the same search flow. The reason was that the second test accessed the searchInput locator directly from the Page Object instead of using the search() method. This bypassed the faulty implementation and therefore did not expose the defect in code.

I updated the second test to use the existing search() method, ensuring that both tests use the same Page Object functionality.

To prevent similar issues in the future, I encapsulated the Page Object locators by making them private, so tests can interact with the page only through the Page Object's public methods. This improves encapsulation and adherence to the Page Object Model.

### Failing test 2: `marking a task as Done updates its status badge` (`../assignment/tests/e2e/task-status.spec.ts`)

- **Root cause:** The test expected the status 'Completed' but the application UI shows 'Done'. I checked the 'TaskStatus' type in 'TaskManagerPage' and the database seed (db.seed.json) to confirm which status is actually valid, and both use 'Done'. The test history is worth checking too. If this test previously passed with 'Completed', the status was renamed during development (or the data changed), so the whole automation framework should be searched and updated. If no such change was intended, the 'Completed' → 'Done' difference may be a product defect.

- **Fix applied:** Confirmed 'Done' is the correct status and updated the test's expected result. To prevent this in the future, I would introduce an enum for task statuses and encourage the team to use it instead of typing status strings by hand, which avoids typos and duplicated values.

## Task B — `Verify task can not be created with empty title` (`../assignment/tests/e2e/task-management.spec.ts`)

- **Scenario covered:** Negative scenario for creating a task with an empty title.

- **Why this scenario matters / why it was missing:** This scenario may have been missed because the existing automation strategy focused primarily on positive or 'happy path' scenarios. It is also possible that negative cases were overlooked due to time or resource constraints.

However, it is important to verify not only expected user flows but also how the application behaves when users provide invalid or unexpected input. Negative testing can uncover defects that may not be identified through happy-path testing alone.

In this particular case, allowing a task to be created with an empty title could also have a broader impact on the automation suite. The current tests locate task rows based on their title text, so a task without a title could make those locators unreliable or ambiguous and potentially require additional changes to the test framework.

## Task C — API validation

- **What the new API test verifies:**

## Task D — Bug / usability / improvement report

- **What I observed:**
- **Steps to reproduce (if applicable):**
- **Why it matters:**
- **Suggested fix or improvement:**

## Anything else you'd like us to know

-
