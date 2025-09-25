# ToDo

This file tracks future enhancements, improvements, and suggestions for the DeXdo-Plan_Your_Life project.

## High Priority

*   [ ] **Complete Standalone Migration:** The initial migration to standalone components is complete, but the old module files (`.module.ts`) still exist in the codebase. These should be removed to avoid confusion.
    *   [ ] Delete all `.module.ts` files.
    *   [ ] Delete all `.routing.module.ts` files.
    *   [ ] Update `tsconfig.app.json` to only include necessary files (e.g., `main.ts`, `polyfills.ts`, `app.routes.ts`) instead of a broad `src/**/*.ts` pattern. This will resolve the "unused file" warnings during compilation.

## Medium Priority

*   [ ] **Refactor `app.component.ts`:** The `app.component.ts` file has a lot of logic in it. Consider moving some of the initialization logic (like status bar, splash screen, network listener) into separate services to make the `AppComponent` cleaner and more focused on its primary role as the root component.
*   [ ] **Improve State Management:** The application currently uses services to manage state. For a more robust and scalable solution, consider implementing a state management library like NgRx or Elf.
*   [ ] **Add Unit Tests:** The project is lacking unit tests. Adding unit tests for services and components will improve the code quality and make the application more maintainable.

## Low Priority

*   [ ] **UI/UX Enhancements:** Explore opportunities to improve the user interface and user experience. This could include adding animations, improving the color scheme, or optimizing the layout for different screen sizes.
*   [ ] **Code Cleanup:** Review the codebase for any commented-out code, unused variables, or other opportunities for cleanup.

## Suggestions

*   [ ] **Implement a "dark mode" toggle:** The application currently sets the status bar style based on the theme, but there is no way for the user to toggle between light and dark mode from within the app.
*   [ ] **Add more notification options:** The notification service could be expanded to allow for more types of notifications (e.g., reminders for upcoming tasks).

---
