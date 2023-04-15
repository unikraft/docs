It is recommended that for building and developing applications and Unikraft, you create a conventional folder structure:

```
.
|-- apps/
|-- libs/
`-- unikraft/
```

That is a hierarchy with:

* `unikraft/` as the clone of the [`unikraft` repository](https://github.com/unikraft/unikraft)
* `apps/` storing folders for applications
* `libs/` storing folders for libraries

You would usually only have a single such hierarchy and add applications and / or libraries in their respective folders and use a single clone of the [`unikraft` repository](https://github.com/unikraft/unikraft).
We create this hierarchy, if not having it created already, by using the commands:

```console
$ mkdir workdir

$ cd workdir/

$ mkdir apps libs

$ git clone https://github.com/unikraft/unikraft
[...]

$ tree --charset=ascii -L 1
.
|-- apps
|-- libs
`-- unikraft
```

We want to work on the [`helloworld` application](https://github.com/unikraft/app-helloworld), so we clone it in the `apps/` subfolder:

```console
$ cd apps/
$ git clone https://github.com/unikraft/app-helloworld helloworld
```

In the `apps/helloworld/` folder, make sure that `UK_ROOT` and `UK_LIBS` are set correctly in the `Makefile` file, i.e. to point to the location of the [`unikraft` repository](https://github.com/unikraft/unikraft) clone, and to the folder storing library repositories.
If you are not sure if they are set correctly, set them like this:

```
UK_ROOT ?= $(PWD)/../../unikraft
UK_LIBS ?= $(PWD)/../../libs
```
