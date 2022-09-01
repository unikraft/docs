To get started, we must create a new library for our application.
The premise here is that we are going to wrap or decorate the source code of `iperf3` with the _lingua franca_ of Unikraft's build system.
That is, when we eventually build the application, the Unikraft build system will understand where to get the source code files from, which ones to compile and how, with respect to the rest of Unikraft's internals and other dependencies.

Let's first start by initializing a working environment for ourselves:

1. Let's create a workspace with a typical Unikraft structure using `kraft`:

   ```bash
   $ cd ~/workspace
   $ export UK_WORKDIR=$(pwd)
   $ kraft list update
   $ kraft list pull unikraft@staging
   ```

   This will generate the necessary directory structure to build a new Unikraft application, and will also download the latest `staging` branch of Unikraft's core.
   When we list the directories, we should get something like this:

   ```bash
   tree -L 1
   ```

   ```markdown
   .
   ├── apps
   ├── archs
   ├── libs
   ├── plats
   └── unikraft

   5 directories, 0 files
   ```

1. Let's now create a library for `iperf3`.
   We can use `kraft` to initialize some boilerplate for us too.
   To do this, we must first retrieve some information about the program itself.
   First, we need to identify the latest version number of `iperf3`.
   GitHub tells us (as of the time of writing this tutorial) that this is `3.11`.

   Unikraft relies on the ability to download the source code of the `origin` code which is about to be compiled.
   Usually these are tarballs or zips.
   Ideally, we want to have a version number in the URL so we can safely know the version being downloaded.
   However, if the source code is on GitHub, which it is in the case of `iperf3`, then `kraft` can figure this out for us.

   We can now use `kraft` to initialize a template library for us:

   ```bash
   $ cd ~/workspace/libs
   $ kraft lib init \
      --no-prompt \
      --author-name "Your Name" \
      --author-email "your@email.com" \
      --version 3.11 \
      --origin https://github.com/esnet/iperf \
      iperf3
   ```

   `kraft` will have now generated a new Git repository in `~/workspace/libs/iperf3` which contains some of the necessary files used to create an external library.
   It has also checked out the repository with a default branch of `staging` and created a blank (empty) commit as the base of the repository.
   This is standard practice for Unikraft repositories.

   **Note:** Our new library is called `libiperf3` to Unikraft.
   The last argument of `kraft lib init` will simply prepend `lib` to whatever string name you give it.
   If you are porting a library which is called `libsomething`, still pass the full name to `kraft`, it will replace instances of `liblibsomething` with `libsomething` during the initialization of the project where appropriate.

1. The next step is to register this library with `kraft` such that we can use it and manipulate it with the `kraft` toolchain.
   To do this, simply add the path of the newly initialized library like so:

   ```bash
   $ kraft list add ~/workspace/libs/iperf3
   ```

   This will modify your `.kraftrc` file with a new local library.
   When you have added this library directory, run the update command so that `kraft` can realize it:

   ```bash
   $ kraft list update
   ```

1. You should now be able to start using this boilerplate library with Unikraft and `kraft`.
   To view basic information about the library and to confirm everything has worked, you can run:

   ```bash
   $ kraft list show iperf3
   ```
