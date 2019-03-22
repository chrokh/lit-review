# Lit

Perform systematic literature reviews without loosing your mind and wasting too much time.


## Why?

Lit can help you:
1. Combine sets of phrases (keywords) into search queries.
2. Automatically collect results from Google Scholar.
3. Non-destructively remove duplicate results.
4. Generate statistics (e.g. relevant articles per keyword). WIP
5. Non-destructively activate/inactivate keywords. WIP
6. Tag articles. WIP


## Status

Instabilities and bugs should be expected. This is an early-stage project.


## Pre-requisites

We use `geckodriver` for [Selenium](https://www.seleniumhq.org/) which means that you must have both [Firefox](https://www.mozilla.org/firefox/) and geckodriver installed. Note that geckodriver must be available in your `PATH`. While `geckodriver` is available on the [download page](https://www.seleniumhq.org/download/) on the Selenium website you can usually also install it using your platform's package manager (such as e.g. [Homebrew](https://brew.sh/) for Mac OS).


## Installation

Coming soon. Will distributed as `npm` package.


## Usage

```bash
SYNOPSIS
  lit <command> [<args>]

COMMANDS
  lit init
    Initialize new review in current dir.

  lit status
    Show information about current lit review.

  lit feed [file]
    Feed current review with phrase sets.

  lit expand
    Expand phrase sets into queries.

  lit collect
    Execute queries and collect results.

  lit help
    This screen.
```

## License

This software is released under GNU GPL v3.

Full license text available at: https://www.gnu.org/licenses/gpl-3.0.en.html.