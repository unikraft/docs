# Unikraft Site

Contents from this repository are published at "https://unikraft.org/" with sub-links available from the top bar:

- documentation: "https://unikraft.org/docs/"
- community information (including hackathons): "https://unikraft.org/community/"
- blog: "https://unikraft.org/blog/"

The Unikraft site is written in [Markdown](https://www.markdownguide.org/) and published via [Hugo](https://gohugo.io/) and the [Docsy theme](https://www.docsy.dev/).

## Build

You can build the site inside a Docker environment.
For this, you will need to install Docker-CE.
You can do that by following the instructions [here](https://github.com/docker/docker-install), or by running:

**Note: Building the site inside a Docker environment is highly recommended, since you will work in the same environment as the deployed site, so there will be no errors regarding packages version or filesystem layout.**

```bash
curl -fsSL https://get.docker.com/ | sh
```

To then deploy the site, run:

```bash
$ make container
$ make devenv

# To be run inside the docker env
$ npm install
$ make serve
```

You may need admin privileges to run the first 2 commands.

You can also build the site natively.
For a native build, you need to install `hugo`.
You can do it by following the instructions [here](https://gohugo.io/getting-started/installing/).

Then, to build and deploy the site, run:

```bash
$ hugo serve
```

**Note: This may lead to errors due to different `hugo` versions or other environment problems.
The problems can be avoided by building the webside inside a Docker environment.
If you choose to build the site natively, make sure you use [`Hugo v0.98.0`](https://github.com/gohugoio/hugo/releases/tag/v0.98.0).**

After building and deploying the site, `hugo` provides instructions on accessing and using it:

```text
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

Access the `http://localhost:1313/` URL in the browser to view the site.

## Tips, Tricks and Best Practices

If you are trying to add or update content on this repository, there are some things you should have in mind.

### Referring pages and sections

You can refer to different pages and sections in the [site](https://unikraft.org/) by using paths starting from [`content/en` directory](https://github.com/unikraft/docs/tree/main/content/en).
For example, say you want to add a reference to the [`development/booting` page](https://unikraft.org/docs/develop/booting/).
Inside the repository, the file used to render the page can be found [here](https://github.com/unikraft/docs/blob/main/content/en/docs/develop/booting.md), its location from the repository root being `content/en/docs/develop/booting.md`.

To achieve this, you can add the following line in your working `.md` page:

```md
[your reference](docs/develop/booting)
```

givind the path of the file starting after the `content/en` directory.

You can also refer specific sections of one page by adding `/#section` to the end of the path.
You can find the sections of a page listed on the rigth side of the page.

For example, a reference to the [`ARM` section of the booting page](https://unikraft.org/docs/develop/booting/#arm) would look like this:

```md
[your reference](docs/develop/booting/#arm)
```
