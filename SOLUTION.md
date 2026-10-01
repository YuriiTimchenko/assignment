# Solution

## Task A — Root cause analysis

### Failing test 1: `search filters the task list by title` (`../assignment/tests/e2e/search.spec.ts`)

- **Root cause:** The taskManager.search() method was using an incorrect/new locator for the Search input instead of the existing searchInput locator defined in TaskManagerPage.

- **Fix applied:** Updated taskManager.search() to use the existing searchInput locator from TaskManagerPage.

I also noticed that the second test in search.spec.ts was not failing, even though both tests covered the same search flow. The reason was that the second test accessed the searchInput locator directly from the Page Object instead of using the search() method. This bypassed the faulty implementation and therefore did not expose the defect in code.

I updated the second test to use the existing search() method, ensuring that both tests use the same Page Object functionality.

To prevent similar issues in the future, I encapsulated the Page Object locators by making them private, so tests can interact with the page only through the Page Object's public methods. This improves encapsulation and adherence to the Page Object Model.

### Failing test 2: `<test name>` (`<file path>`)

- **Root cause:**
- **Fix applied:**

## Task B — New test

- **Scenario covered:**
- **Why this scenario matters / why it was missing:**

## Task C — API validation

- **What the new API test verifies:**

## Task D — Bug / usability / improvement report

- **What I observed:**
- **Steps to reproduce (if applicable):**
- **Why it matters:**
- **Suggested fix or improvement:**

## Anything else you'd like us to know

-
