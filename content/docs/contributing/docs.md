---
title: Documentation
date: 2022-02-04T17:00:00+02:00
draft: false
weight: 507
---

## Documentation

As with the other parts of Unikraft, we welcome contributions to the [documentation repository](https://github.com/unikraft/docs).
Documentation is written using [GitHub Markdown](https://github.github.com/gfm/) and is built using [Hugo](https://gohugo.io/commands/hugo_server/).

We follow the [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow) for contributions.
Submit corrections and improvements to documentation as pull requests (PRs) that we will then review and approve in the documentation.
You can add entire sections if you think a topic is missing or update existing ones with missing information.

You can also open up an issue to signal a problem or a missing part in the documentation that you request someone to fix.

We use English as the documentation language.
Please proofread your text before submitting a pull request.

Write each sentence on a new line.
This way, changing one sentence only affects one line in the source code.

Prefer using the 1st person plural.
Use phrases like "we run the command / app", "we look at the source code", "we provide support".

### Content Layout

The content has the following structure:

```text
content/
`-- en
    |-- blog/                   # Blog posts, <date>-<blogpost title>.md
    |
    |-- community/              # Community related content
    |   |-- contacts.md         # Community contacts
    |   |-- events.md           # Information related to recurring and upcoming events
    |   |-- github.md           # Unikraft GitHub community layout
    |   |-- hackathons/         # Hackathon sessions, challenges and solutions
    |   |-- _index.md           # Community first page
    |   |-- people.md           # List of people in the community
    |   |-- publications.md     # List of Unikraft-related publications (theses, peer-reviewed publications, etc.)
    |   `-- talks.md            # List of Unikraft-related talks and presentations
    |
    |-- docs/                   # Unikraft documentation, split by categories into subdirectories
    |
    |-- faq/                    # List of frequently asked questions
    |
    `-- releases/               # Unikraft releases summaries
```

### Testing Changes

Before you submit your changes for review, please make sure you have tested them thoroughly.
You can build and deploy the site locally, following [the instructions below](/docs/contributing/#building-the-website).
You can also validate your changes for common issues using the [`super-linter`](https://github.com/github/super-linter), following the [instructions below](docs/contributing/docs/#using-the-linter).
Please also do a spell check on your changes.
Most text editors should be able to do that by themselves, [here's how you do it in `Vim`](https://thoughtbot.com/blog/vim-spell-checking).

#### Building the Website

You can build the website inside a Docker environment or natively.
Building inside a Docker environment is recommended, since you will work in the same environment as the deployed website.

#### Building the Website Inside a Docker Environment

You can build the site inside a Docker environment.
For this, you will need to install Docker-CE.
You can do that by following the instructions [here](https://github.com/docker/docker-install), or by running:

```console
$ curl -fsSL https://get.docker.com/ | sh
```

{{% alert theme="info" %}}
Building the site inside a Docker environment is highly recommended, since you will work in the same environment as the deployed site, so there will be no errors regarding packages version or filesystem layout.
{{% /alert %}}

To deploy the site, run (in the directory of the repository clone):

```console
$ make container
$ make devenv # This will take you inside the container

# Inside the container, run the following commands:
# npm install
# make serve
```

You may need admin privileges to run the first 2 commands.

#### Building the Website Natively

You can also build the site natively.
For a native build, you need to install `hugo`.
You can do it by following the instructions [here](https://gohugo.io/getting-started/installing/).

Deploying the website requires [`npm`](https://www.npmjs.com/) packages (listed in `package.json`).
First, install `npm` for your distribution;
for a Debian/Ubuntu distribution, run:

```console
$ sudo apt install npm
```

Then install required packages:

```console
$ npm install # Run from the documentation clone directory
```

{{% alert theme="warning" %}}
This may lead to errors due to different `hugo` versions or other environment problems.
These problems can be avoided by building the website inside a Docker environment.
If you choose to build the site natively, make sure you install and use [`Hugo v0.98.0`](https://github.com/gohugoio/hugo/releases/tag/v0.98.0) or later.
{{% /alert %}}

Then, to build and deploy the site, run:

```console
$ hugo serve
```

After building and deploying the site, `hugo` provides instructions on accessing and using it:

```text
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

Access the `http://localhost:1313/` URL in the browser to view the site.

#### Using the Linter

To automate a big part of the reviewing process, we use the [`super-linter`](https://github.com/github/super-linter) on the `docs` repository.
It runs as a GitHub action on every time you do a push, checking all the changed files.

{{< img
   class="w-auto mx-auto"
   src="/assets/imgs/github-super-linter.png"
   title="Checking the super linter output"
   caption="If you open a pull request, you will be able to see the linter output under the checks section."
   position="center"
>}}

If you click on `Details`, you can see the full linter output.
The most relevant part is under the `Lint Code Base` section, where you can find the full error messages and the line that generated the error.

{{< img
   class="w-auto mx-auto"
   src="/assets/imgs/github-super-linter-output.png"
   title="Checking the super linter output"
   caption="Full linter output. Error was caused by line 79 in file `content/en/blog/2022-12-03-random-device-support-in-unikraft.md`"
   position="center"
>}}

Since the linter checks the entire file, you may find yourself with a lot of errors from lines that you did not modify.
Please make sure that the errors are not caused by the lines that you added or modified.
If you have the time to add a commit to your pull request, that fixes all the linting errors within the modified files, we will be forever grateful :pray:

#### Running the Linter Locally

You can also run the linter locally, before creating the pull request.
[`super-linter`](https://github.com/github/super-linter) is actually a collection of linters;
for a local run, you need to install and then run the required linters.

For the Unikraft documentation repository, used and useful linters are:

- [`markdown-cli`](https://github.com/igorshubovych/markdownlint-cli#readme)
- [`textlint`](https://textlint.github.io/)
- [`jscpd`](https://github.com/kucherenko/jscpd)

To run the `super-linter` locally, follow the instructions from [here](https://github.com/github/super-linter/blob/main/docs/run-linter-locally.md).
Note that this will require quite a lot of storage, since it will pull the `super-linter` Docker image.

You will need to install Docker, following the [official documentation](https://docs.docker.com/install/).
After that, pull the latest container by running:

```console
$ docker pull github/super-linter:latest
```

To run the `super-linter` on a given directory, use a command similar to:

```console
$ docker run -e RUN_LOCAL=true -e USE_FIND_ALGORITHM=true -v /path/to/directory/to/check:/tmp/lint github/super-linter
--------------------------------------------------------------------------------
2022-12-29 07:50:55 [INFO]   ---------------------------------------------
2022-12-29 07:50:55 [INFO]   --- GitHub Actions Multi Language Linter ----
2022-12-29 07:50:55 [INFO]    - Image Creation Date:[2022-12-26T16:46:33Z]
2022-12-29 07:50:55 [INFO]    - Image Revision:[154522b380449499473f75d46f3796e23ebc1d2e]
2022-12-29 07:50:55 [INFO]    - Image Version:[154522b380449499473f75d46f3796e23ebc1d2e]
2022-12-29 07:50:55 [INFO]   ---------------------------------------------
2022-12-29 07:50:55 [INFO]   ---------------------------------------------
2022-12-29 07:50:55 [INFO]   The Super-Linter source code can be found at:
2022-12-29 07:50:55 [INFO]    - https://github.com/github/super-linter
2022-12-29 07:50:55 [INFO]   ---------------------------------------------
2022-12-29 07:50:55 [INFO]   --------------------------------------------
[...]
```

A sample run, while in the root directory of this documentation repository, is:

```console
$ docker run -e RUN_LOCAL=true -e USE_FIND_ALGORITHM=true -v $(pwd)/content/en/docs/contributing/:/tmp/lint/ github/super-linter
```

You can also run each linter separately, since it will require less storage space.
To run the linters, you will need to install the [`markdown-cli`](https://github.com/igorshubovych/markdownlint-cli), [`textlint`](https://textlint.github.io/docs/getting-started.html) and [`jscpd`](https://github.com/kucherenko/jscpd#installation) tools:

```console
$ npm install markdownlint-cli
$ npm install textlint
$ npm install jscpd
```

Note that it's likely that these linters require a more recent version of `node` than the default package installation.
Install the most recent one using [`nvm`](https://github.com/nvm-sh/nvm).
First, install `nvm` using [the instructions here](https://github.com/nvm-sh/nvm).
Then install the most recent version of `node` and follow the instructions:

```console
$ nvm install node
# Follow instructions shown by the above command.
$ nvm use node
$ node --version # Check node version.
```

The `textlinter` will require installation of rules.
You can find a list of rules [here](https://github.com/textlint/textlint/wiki/Collection-of-textlint-rule).

```console
$ npm install textlint-rule-terminology
$ npm install textlint-rule-no-todo
```

Use the linters with `npx` from the documentation directory:

```console
$ npx markdownlint --config .github/workflows/config/config.json --rules .github/workflows/rules/rules.js path/to/markdown/file.md
$ npx textlint --config .github/workflows/.textlintrc --rule <rule-name> path/to/markdown/file.md
$ npx jscpd <path> # Tipically a directory
```

For example:

```console
$ npx markdownlint --config .github/workflows/config/config.json --rules .github/workflows/rules/rules.js content/en/docs/contributing/*.md
_index.md:14:187 MD033/no-inline-html Inline HTML [Element: a]
blog-case-studies.md:10 MD012/no-multiple-blanks Multiple consecutive blank lines [Expected: 1; Actual: 2]
code-of-conduct.md:69 MD104/one line per sentence one line (and only one line) per sentence [Expected one sentence per line. Multiple end of sentence punctuation signs found on one line!]
code-of-conduct.md:82:1 MD007/ul-indent Unordered list indentation [Expected: 0; Actual: 1]
code-of-conduct.md:85:1 MD007/ul-indent Unordered list indentation [Expected: 0; Actual: 1]
[...]

$ npx textlint --config .github/workflows/.textlintrc content/en/docs/contributing/code-of-conduct.md

[...]/docs/content/en/docs/contributing/code-of-conduct.md
  61:66  ✓ error  Incorrect usage of the term: “e-mail”, use “email” instead  terminology

✖ 1 problem (1 error, 0 warnings)
✓ 1 fixable problem.
Try to run: $ textlint --fix [file]

$ npx jscpd content/en/docs/contributing/code-of-conduct.md
+--------------------------------------------------------------------------------------------------------------+
| Format   | Files analyzed | Total lines | Total tokens | Clones found | Duplicated lines | Duplicated tokens |
|----------+----------------+-------------+--------------+--------------+------------------+-------------------|
| url      | 1              | 4           | 28           | 0            | 0 (0%)           | 0 (0%)            |
|----------+----------------+-------------+--------------+--------------+------------------+-------------------|
| markdown | 1              | 130         | 1470         | 0            | 0 (0%)           | 0 (0%)            |
|----------+----------------+-------------+--------------+--------------+------------------+-------------------|
| Total:   | 2              | 134         | 1498         | 0            | 0 (0%)           | 0 (0%)            |
+--------------------------------------------------------------------------------------------------------------+
Found 0 clones.
Detection time:: 41.945ms
```

### Reviewing Changes

If you are assigned as a reviewer to a pull request (PR), please follow the [testing steps](docs/contributing/docs/#testing-changes) and make sure everything looks good.

The review may go through a set of back-and-forth steps between the author and the reviewer before the reviewer marks the PR as approved.
As a reviewer, when you consider the process complete, you must add a signature, in the same way that the author has.
This is done by writing adding a `Reviewed-by` line as part of your approval message in the GitHub review interface:

```text
Reviewed-by: Your Name <your@email.com>
```
