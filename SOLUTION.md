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

- **What the new API test verifies:** The new API test verifies that a task can be successfully created using a POST request to the /tasks endpoint. It validates the response status code, response payload structure and key task attributes.

Additionally, the test retrieves the newly created task using a GET request with its ID and re-validates the key attributes to confirm that the data was persisted correctly.

Finally, the test deletes the created task to clean up the test data and prevent it from affecting subsequent tests.

## Task D — Bug / usability / improvement report

**Issue #1**
- **What I observed:** The main tasks grid does not provide a pagination mechanism.
- **Steps to reproduce (if applicable):** On main tasks grid page check posibility to use paging feature. Actual result: paging feature is missing
- **Why it matters:** As the amount of data in the database grows, loading all tasks on a single page can negatively impact application performance. Large datasets may increase page load times, consume more browser resources and potentially make the page difficult or even impossible to use efficiently.
- **Suggested fix or improvement:** Implement pagination with standard controls such as page numbers, Next, Previous, First, and Last. Consider server-side pagination for larger datasets to avoid loading the entire task collection into the browser at once.

**Issue #2**
- **What I observed:** Button styles are different
- **Steps to reproduce (if applicable):** On main tasks grid page check the displaying of 'New Task', 'Edit' and 'Delete' buttons. Actual result: buttons have different styles and and shapes
- **Why it matters:** A well-designed application should maintain consistent UI components and visual standards across the application. Consistent styling improves usability, makes the interface more predictable and contributes to a more polished and professional user experience. Inconsistent styling can also negatively affect the perceived quality of the product.
- **Suggested fix or improvement:** Establish and apply consistent button components, styles, and color schemes across the application.

**Issue #3**
- **What I observed:** The task status is displayed twice in each task row on the main Tasks grid: once as a status label and again as an editable status dropdown.
- **Steps to reproduce (if applicable):** Navigate to the main Tasks grid page. Inspect an individual task row. Pay attention to the task status information. Actual result: The same status is displayed both as a label and as a dropdown control.
- **Why it matters:** From a user perspective, displaying the same information twice provides little additional value and may create unnecessary visual clutter. It can also make the interface less clear by presenting two representations of the same piece of information.
- **Suggested fix or improvement:** Review the intended UX design and consider one of the following approaches:
Allow status changes only through the Edit Task dialog and display the status as a non-editable label on the grid or Keep the inline status dropdown and remove the redundant status label.

The final approach should be consistent with the application's overall UX and interaction patterns.

**Issue #4**
- **What I observed:** Task status can be changed in any direction without any apparent transition rules.
- **Steps to reproduce (if applicable):** Navigate to the main Tasks grid page and change the status of a task through different statuses in various combinations. Actual result: A task's status can be changed to any available status without any apparent restrictions or validation.
- **Why it matters:** If the business workflow or status history is important for the application, unrestricted status transitions may allow invalid business states. For example, the system might need to prevent a task from being moved directly from Open to Done without first going through In Progress.
- **Suggested fix or improvement:** Additional requirements should be clarified with the BA, PM, or Design team to determine the expected status transition workflow and identify which status changes should be allowed or restricted.

**Issue #5**
- **What I observed:** No character limits are enforced for the text fields in the Create/Edit Task modal.
- **Steps to reproduce (if applicable):** Navigate to the main Tasks grid page. Click the New Task button or edit an existing task. Enter a large number of characters into the Title or Description fields. Actual result: No apparent character limits or validation are applied to the text fields. If a very long string without spaces is entered, it can break the layout of the Tasks grid.
- **Why it matters:** The application should properly handle negative and boundary cases and prevent excessively long input from negatively affecting the user interface or application behavior.
- **Suggested fix or improvement:** Add appropriate character limits and input validation to the Title and Description fields. Consider displaying a validation message when the maximum length is exceeded and ensuring that long text cannot break the layout.

**Issue #6**
- **What I observed:** Duplicate task names are allowed.
- **Steps to reproduce (if applicable):** Navigate to the main Tasks grid page and create two different tasks with the same name. Actual result: Multiple tasks with identical names can be created.
- **Why it matters:** Duplicate task names can create ambiguity for users and may lead to conflicts when identifying or managing specific tasks. There is also a potential impact on the automation framework, which currently locates tasks by their name. If task names are not unique, locators may match multiple tasks and cause test instability or unexpected behavior.
- **Suggested fix or improvement:** Consider restricting the creation of tasks with duplicate names if task names are intended to be unique. Alternatively, introduce another unique attribute, such as a task ID and use it for task identification. If duplicate names are allowed by design, the automation framework should use a unique identifier rather than the task name when locating individual tasks.

**Issue #7**
- **What I observed:** Missing confirmation and informational feedback for Create, Edit, and Delete task actions.
- **Steps to reproduce (if applicable):** Navigate to the main Tasks grid page and create, edit or delete any task. Actual result: No informational banner or confirmation message is displayed after completing these actions and deleting a task does not require additional confirmation.
- **Why it matters:** Clear UI feedback is important to confirm that an action has been completed successfully. Additionally, deleting a task is potentially destructive and users should have an opportunity to confirm the action before the task is permanently removed.
- **Suggested fix or improvement:** Implement success/information banners for completed Create, Edit, and Delete actions. Add a confirmation dialog before deleting a task to help prevent accidental deletion.

## Anything else you'd like us to know
- I identified several additional areas that could be improved or further explored. However, I prioritized the mandatory requirements and higher-impact findings to ensure the most important areas were covered thoroughly within the available time.
