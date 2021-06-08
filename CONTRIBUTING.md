<p align="center" class="toc">
   <strong><a href="#how-do-i-get-started">How Do I Get Started?</a></strong>
   |
  <strong><a href="#setup">Setup</a></strong>
   |
   <strong><a href="#running-lintingtests">Running Linting/Tests</a></strong>
   |
   <strong><a href="#build-for-production">Build for Production</a></strong>
</p>

---

## How Do I Get Started?

[jspollock.art](https://jspollock.art) is a simple Single Page App for computer
generated art inspired by Jackson Pollock.

**A simple way on any device to quickly see [Open Source Software](https://en.wikipedia.org/wiki/Open-source_software)
(OSS) contributions, info on how the contributions, and how it impacts the larger OSS community.**

## Setup

Setup and use requires [Git](https://git-scm.com/),
[Node JS](https://nodejs.org/en/), and a text editor such as
[VS Code](https://code.visualstudio.com/).

If you're on a Mac, I'd suggest using [Homebrew](https://brew.sh/) for installing Node and Git.

### Cloning & Dependency Installations

```sh
git clone https://github.com/cujarrett/js-pollock.git
cd js-pollock
npm install
```

## Running Linting/Tests

### Run Linting

Finds problematic patterns or code that doesn’t adhere to certain style guidelines.

```sh
npm run lint
```

### Fix linting Errors (Where Possible)

```sh
npm run fix-lint
```

### Run Tests

Runs the app in the development mode.

```sh
npm run test
```

### Start local server to see app during development

The page will reload if you make edits. You will also see any lint errors in the console.

```sh
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Build for Production

It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.

```sh
npm run build
```

## Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) specification to
aid in automated releases and change log generation. [Commitlint](https://github.com/conventional-changelog/commitlint)
is enabled and ran as a `commit-msg` hook to enforce the commit format.
[Commitizen](http://commitizen.github.io/cz-cli/) can be used to prompt through any requirements at commit time
`npm run commit` (or `git cz` if Commitizen is installed globally).

In short, if a commit will be fixing a bug, prefix the commit message with `fix:`

```sh
fix: my bug fix
```

```sh
feat: my new feature
```

Commits with `fix:` prefix will show up in the generated changelog as bullets under the `Bug Fixes:` section, and
`feat:` prefixed messages will show under the `Features:` section. For more on the available prefixes/rules, see
[here](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#rules).
