# Gnoswap Interface
Welcome to the open source interface for Gnoswap, the first decentralized exchange (DEX) powered by Gnoland, designed to simplify concentrated liquidity experience and increase capital efficiency for traders.

_Note: Gnoswap is in active development and not yet in production, and we welcome your contributions! Please check our [contribution guidelines](#contributing) and the [latest release](https://github.com/gnoswap-labs/gnoswap-interface/releases) to see the current development status._

## Project Overview
This repository hosts the codebase for the Gnoswap interface, which enables users to interact with Gnoswap. The interface is built using TypeScript and is designed to be user-friendly, secure, and accessible, despite having complex mechanisms such as concentrated liquidity and staking as part of its core service.

## Development Setup
The Node.js version is 18.14.2.  
We recommend using [nvm](https://github.com/nvm-sh/nvm).

```bash
# If you don't have that version installed,
# $ nvm install

$ nvm use
```

We use [yarn berry](https://yarnpkg.com) to manage our packages.  
And we use the [yarn workspaces](https://yarnpkg.com/features/workspaces).

```bash
# If you don't have a yarn berry

$ npm i yarn -g
$ yarn set version berry
```

## Contributing
Thank you for considering contributing to the Gnoswap Interface! We value and appreciate your input. Before submitting a pull request, please check the guidelines below.

### How to Contribute
**Steps**
1. Check existing issues or pull requests before submitting a new one to avoid duplicate submissions.
2. Fork the Gnoswap repository.
3. Create a new branch for your changes.
4. Make changes and commit them with a concise and descriptive message using the [Conventional Commits](https://www.conventionalcommits.org/) format. Please check spelling, grammar, and remove any trailing whitespace.
5. Push your branch to your forked repository.
6. Submit a pull request to our main branch.

**Pull Request Title**

Your pull request title must follow the conventional commits format and start with one of the following types:
- feat: A new feature
   - Use this type when you introduce a new feature to the codebase or enhance existing functionality.
   - Example: feat: Add user authentication
- chore: Routine tasks or maintenance
   - Use this type when you perform tasks that don't directly change the codebase, such as updating dependencies, configuration changes, or setting up build processes.
   - Example: chore: Update dependencies
- fix: A bug fix
   - Use this type when you fix a bug or an issue in the existing codebase.
   - Example: fix: Resolve memory leak issue
- test: Adding missing tests or correcting existing tests
   - Use this type when you add new tests to improve code coverage or fix existing tests that were incorrect or failing.
   - Example: test: Add unit tests for user registration
- style: Changes that do not affect the meaning of the code
   - Use this type when you make changes that only affect the code's appearance, such as whitespace, indentation, or formatting adjustments.
   - Example: style: Apply gofmt to the codebase
- refactor: Refactoring code that neither fixes a bug nor adds a feature
   - Use this type when you restructure existing code to improve its readability, performance, or maintainability without changing its functionality.
   - Example: refactor: Optimize database query logic

This will help maintain a clean and consistent commit history and make it easier for other developers to understand the changes made in each commit.

## License
This project is licensed under the [Apache License, Version 2.0](LICENSE). See the [full text](https://www.apache.org/licenses/LICENSE-2.0) for details.