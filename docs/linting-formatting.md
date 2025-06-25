# Linting and Formatting Guide

This document provides guidance on the linting and formatting configuration for this project.

## Overview

This project uses the following tools for code quality:

- **ESLint**: For static code analysis to identify problematic patterns
- **Prettier**: For consistent code formatting

Both tools are configured at the root level and in individual packages to ensure consistent style across the codebase.

## Configuration Files

### Root Configuration

- `.eslintrc.js`: Root ESLint configuration
- `.prettierrc`: Prettier configuration
- `.eslintignore`: Files to be ignored by ESLint
- `.prettierignore`: Files to be ignored by Prettier

### Package-specific Configuration

Each package (frontend and backend) has its own configuration that extends from the root:

- `packages/frontend/.eslintrc.js`
- `packages/frontend/.eslintignore`
- `packages/frontend/.prettierignore`
- `packages/backend/.eslintrc.js`
- `packages/backend/.eslintignore`
- `packages/backend/.prettierignore`

## Available Scripts

### Root Level

- `npm run lint`: Lint all files at the root level
- `npm run lint:fix`: Fix linting issues in all files at the root level
- `npm run format`: Format all files at the root level
- `npm run format:check`: Check if files are formatted correctly at the root level
- `npm run lint:all`: Run linting on all packages
- `npm run format:all`: Format all files in all packages

### Frontend Package

- `npm run lint`: Lint frontend files
- `npm run lint:fix`: Fix linting issues in frontend files
- `npm run format`: Format frontend files
- `npm run format:check`: Check if frontend files are formatted correctly

### Backend Package

- `npm run lint`: Lint backend files
- `npm run lint:fix`: Fix linting issues in backend files
- `npm run format`: Format backend files
- `npm run format:check`: Check if backend files are formatted correctly

## VS Code Integration

The project includes VS Code settings for seamless integration:

- `.vscode/settings.json`: Configured to run ESLint and Prettier on save
- `.vscode/extensions.json`: Recommends ESLint and Prettier extensions

## Coding Standards

This project follows these coding standards, enforced by ESLint and Prettier:

- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Maximum line length of 100 characters
- Single quotes for string literals
- Trailing commas in multi-line objects and arrays
- No console.log statements in production code
- No unused variables
- Proper error handling
- Consistent spacing and brackets

For more detailed code style guidance, see the [Code Style](./code-style.md) document.

## Adding New Rules

When adding new ESLint rules or Prettier options:

1. Update the root configuration files
2. Document the change and rationale
3. Run linting and formatting on the entire project to ensure consistency
4. Commit the changes

## Pre-commit Hooks

Consider adding pre-commit hooks to automatically run linting and formatting before each commit:

```bash
npm install --save-dev husky lint-staged
```

Then configure `package.json` with:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

This ensures all code is properly linted and formatted before being committed.
