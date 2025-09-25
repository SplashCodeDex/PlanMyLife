# Contributing to DeXdo-Plan_Your_Life

First off, thank you for considering contributing to this project! Any and all help is greatly appreciated.

## Project Architecture

This project is built with Angular and Ionic and has been recently updated to use a **standalone component architecture**. This means that we are moving away from `NgModule`s and embracing a more simplified and modern approach to building Angular applications.

When adding new features or fixing bugs, please adhere to the following architectural guidelines:

*   **Create Standalone Components:** All new components, directives, and pipes should be standalone. Set the `standalone` flag to `true` in the component's decorator.
*   **Use `app.config.ts` for Providers:** All services and other providers should be registered in the `app.config.ts` file. Avoid using the `providers` array in a component's decorator unless the provider is truly specific to that component.
*   **Use `app.routes.ts` for Routing:** All routes should be defined in the `app.routes.ts` file.

## Development Workflow

1.  **Fork the repository:** Create your own fork of the project.
2.  **Create a new branch:** `git checkout -b my-new-feature`
3.  **Make your changes:** Make your changes in your forked repository.
4.  **Ensure your changes are clean:** Make sure your code lints and follows the project's coding style.
5.  **Commit your changes:** `git commit -am 'Add some feature'`
6.  **Push to the branch:** `git push origin my-new-feature`
7.  **Create a new Pull Request:** Submit a pull request from your forked repository to the main project.

## Coding Style

Please follow the existing coding style in the project. We use the standard Angular style guide.

## Questions?

If you have any questions, feel free to open an issue and we will get back to you as soon as possible.

---
