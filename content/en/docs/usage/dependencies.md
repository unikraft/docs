---
title: Ecosystem
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 402
---

## Managing Unikraft Ecosystem

Once `kraft` is installed, you can use it to manage dependencies for applications, including finding and retrieving existing applications, libraries, platforms and architectures.

Libraries are additional software components that will be linked with Unikraft for the final image.
Each unikernel image is using its specific libraries.
They are typically common libraries (such as OpenSSL or LWIP) that have been ported on top of Unikraft.
The libraries, also called **external** libraries are located in specialized repositories in the [Unikraft organization](https://github.com/unikraft), those whose names start with `lib-`.

The application is the actual application code.
It typically provides the `main()` function (or equivalent) and is reliant on Unikraft and external libraries.
The avalaible applications that have been ported on top of Unikraft are located in repositories in the [Unikraft organization](https://github.com/unikraft/), those whose names start with `app-`.

An important role of the core Unikraft component is providing support for different platforms and architectures.
A platform is the virtualization / runtime environment used to run the resulting unikernel image.

## Unikraft directories structure

By default, all components pulled by `kraft` are saved to `~/.unikraft/` directory, which is also the default value for the `UK_WORKDIR` environment variable used by `kraft`.
This is the usual layout of the `~/.unikraft` directory:

```text
|-- apps - This is where you would normally place existing app builds
|-- archs - Here we place our custom arch's files
|-- libs - This is where the build system looks for external library pool sources
|-- plats - The files for our custom plats are placed here
`-- unikraft - The core source code of the Unikraft Unikernel
```

If you want to keep your unikraft components in a different location, you can do that and export the environment variable `UK_WORKDIR`.
Apart from that, there are also environment variables available for the above subdirectories:

| Environment Variable |                       Purpouse                       |         Default        |
| -------------------- | ---------------------------------------------------- | ---------------------- |
| `UK_ROOT`            | The directory for Unikraft's core source code        | `$UK_WORKDIR/unikraft` |
| `UK_LIBS`            | The directory of all the external Unikraft libraries | `$UK_WORKDIR/libs`     |
| `UK_APPS`            | The directory of all the template applications       | `$UK_WORKDIR/apps`     |

## `kraft list`

You can find a list of all aplication, libraries and platforms by using:

```console
$ kraft list
```

You can see the component name, current version, release date and the time of the last check.
All the components already avalaible on your system, in your `UK_WORKDIR` directory will be shown green.
All the other components will be colored red.

```text
APPLICATIONS    	VERSION 	RELEASED  	LAST CHECKED
helloworld      	0.6     	22 Jan 22 	17 hours ago
httpreply       	0.6     	02 Dec 21 	17 hours ago
python3         	0.6     	2 days ago	17 hours ago
duktape         	0.6     	02 Dec 21 	17 hours ago
helloworld-cpp  	0.6     	02 Dec 21 	17 hours ago
```

You can add origins for kraft to use in the `.kraftrc` file, under `[list]`.
If you create a new library using the `kraft lib` command shown below, you can add the new local library to the `.kraftrc` file by using:

```console
$ kraft lib add ~/path/to/local/lib
$ kraft list update
```

You can check that everything worked fine and view basic informations about the new library by using:

```console
$ kraft list show LIBNAME
```

You can manually add URLs, git, git+ssh and wildcards in the `.kraftrc` file:

```text
[list]
origins = [
	"https://github.com/unikraft/unikraft.git",
	"https://github.com/unikraft/plat-*",
	"https://github.com/unikraft/app-*",
	"https://github.com/unikraft/lib-*",
]
```

After every update to `.kraftrc`, run:

```console
$ kraft list update
```

You may get the following error when running `kraft update`:

```text
GitHub rate limit exceeded. You can tell kraft to use a personal access token by setting the UK_KRAFT_GITHUB_TOKEN environmental variable.
```

In this case, create a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) and use the following command:

```console
$ UK_KRAFT_GITHUB_TOKEN=<your_GitHub_token_here> kraft list update
```

### Overview of `kraft list` command

```text
Usage: kraft list [OPTIONS] COMMAND [ARGS]...

  Retrieves lists of available architectures, platforms, libraries and
  applications supported by unikraft.  Use this command if you wish to
  determine (and then later select) the possible targets for your unikraft
  application.

By default, this subcommand will list all possible targets.

Options:
  -i, --installed   Display only installed components.
  -c, --core        Display information about Unikraft's core repository.
  -p, --plats       List supported platforms.
  -l, --libs        List supported libraries.
  -a, --apps        List supported application runtime execution environments.
  -d, --show-local  Show local source path.
  -n, --paginate    Paginate output.
  -t, --this        Show the components for this application (default is cwd).
  --this=PATH       Show the components for this application.
  -j, --json        Return output as JSON.
  -h, --help        Show this message and exit.

Commands:
  add     Add a remote manifest or repository.
  pull    Pull the remote component to disk.
  remove  Remove a remote manifest or repository.
  show    Show a unikraft component.
  update  Update the list of remote components.
```

## `kraft init`

If you want to initiate an existing application, you can use:

```console
$ kraft init -t TEMPLATE_NAME [TARGET_NAME]
```

### Overview of `kraft init` command

```text
Usage: kraft init [OPTIONS] [NAME]

  Initializes a new unikraft application.

  Start here if this is your first time using (uni)kraft.

Options:
  -t, --template NAME  Use an existing application as a template.
  -p, --plat PLAT      Target platform.
  -m, --arch ARCH      Target architecture.
  -w, --workdir PATH   Specify an alternative directory for the application
                       [default is cwd].
  -M, --with-makefile  Create a Unikraft compatible Makefile.
  -D, --no-deps        Do not download additional dependencies for application
                       components.
  -d, --dump           Dump dependencies into project directory.
  -F, --force          Overwrite any existing files.
  -h, --help           Show this message and exit.
```

## `kraft up`

You can retreive, build and run an existing appliication from the list above by using only one command:

```console
$ kraft up -t TEMPLATE_NAME TARGET_NAME
```

### Overview of `kraft up` command

```text
Usage: kraft up [OPTIONS] NAME

  Configures, builds and runs an application for a selected architecture and
  platform.

Options:
  -w, --workdir PATH         Specify an alternative directory for the
                             application [default is cwd].
  -t, --template NAME        Use an existing application as a template.
                             [required]
  -p, --plat TEXT            Target platform.
  -m, --arch TEXT            Target architecture.
  -i, --initrd TEXT          Provide an init ramdisk.
  -B, --background           Run in background.
  -P, --paused               Run the application in paused state.
  -g, --gdb INTEGER          Run a GDB server for the guest on specified port.
  -d, --dbg                  Use unstriped unikernel
  -n, --virtio-nic TEXT      Attach a NAT-ed virtio-NIC to the guest.
  -b, --bridge TEXT          Attach a NAT-ed virtio-NIC an existing bridge.
  -V, --interface TEXT       Assign host device interface directly as virtio-
                             NIC to the guest.
  -D, --dry-run              Perform a dry run.
  -M, --memory INTEGER       Assign MB memory to the guest.
  -s, --cpu-sockets INTEGER  Number of guest CPU sockets.
  -c, --cpu-cores INTEGER    Number of guest cores per socket.
  -F, --force                Overwrite any existing files in current working
                             directory.
  -j, --fast                 Use all CPU cores to build the application.
  -M, --with-makefile        Create a Unikraft compatible Makefile.
  -h, --help                 Show this message and exit.
```

## `kraft lib`

You can also use kraft to manage Unikraft libraries.
You can add and remove libraries from the project:

```console
$ kraft lib add NAME
$ kraft lib remove NAME
```

Or you can initialize a new Unikraft library using:

```console
$ kraft lib init [OPTIONS] [NAME]
```

### Overview of `kraft lib` command

```text
Usage: kraft lib [OPTIONS] COMMAND [ARGS]...

  Unikraft library sub-commands are useful for maintaining and working directly with Unikraft libraries.

Options:
  -h, --help  Show this message and exit.

Commands:
  add     Add a library to the project.
  bump    Update a library's version (experimental).
  init    Initialize a new Unikraft library.
  remove  Remove a library from the project.
```
