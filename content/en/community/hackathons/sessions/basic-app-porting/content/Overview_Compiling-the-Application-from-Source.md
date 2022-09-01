The [`README`](https://github.com/esnet/iperf/blob/master/README.md) for the `iperf3` program has relatively simple build instructions, and uses GNU Make which is a first good sign.
Unikraft uses GNU Make to handle its internal builds and so when we see an application using Make, it makes porting a little easier.
For non-Make type build systems, such as CMake, Bazel, etc., it is still possible to bring this application to Unikraft, but the flags, files, and compile-time options, etc. will have to be considered with more care as they do not necessarily align in the same ways.
It is still possible to bring an application using an alternative build system, but you must closely follow how the program is built in order to bring it to Unikraft.

Let's walk through the build process of `iperf3` from its `README`:

1. First we obtain the source code of the application:

   ```bash
   $ git clone https://github.com/esnet/iperf.git
   ```

1. Then, we are asked to configure and build the application:

   ```bash
   $ cd ./iperf
   $ ./configure;
   $ make
   ```

If this has worked for you, your terminal will be greeted with several pieces of useful information:

1. The first thing we did was run `./configure`: an auto-generated utility program part of the [`automake`](https://www.gnu.org/software/automake/) build system.
   Essentially, it checks the compatibility of your system and the program in question.
   If everything went well, it will tell us information about what it checked and what was available.
   Usually this `./configure`-type program will raise any issues when it finds something missing.
   One of the things it is checking is whether you have relevant shared libraries (e.g. `.so` files) installed on your system which are necessary for the application to run.
   The application will be dynamically linked to these shared libraries and they will be referenced at runtime in a traditional Linux user space manner.
   If something is missing, usually you must use your Linux-distro's package manager to install this dependency, such as via `apt-get`.

   The `./configure` program also comes with a useful `--help` page where we can learn about which features we would like to turn on and off before the build.
   It's useful to study this page and see what is available, as these can later become build options (see [exercise 2](/community/hackathons/usoc22/basic-app-porting#02-add-fortunes-to-unikrafts-boot-sequence)) for the application when it is brought to the Unikraft ecosystem.
   The only thing to notice for the case of `iperf3` is that it uses [OpenSSL](https://www.openssl.org).
   [Unikraft already has a port of OpenSSL](https://github.com/unikraft/lib-openssl), which means we do not have to port this before starting.
   **If, however, there are library dependencies for the target application which do not exist within the Unikraft ecosystem, then these library dependencies will need to be ported first before continuing.**
   The remainder of this tutorial also applies to porting libraries to Unikraft.

1. When we next run `make` in the sequence above, we can see the intermediate object files which are compiled during the compilation process before `iperf3` is finally linked together to form a final Linux user space binary application.
   It can be useful to note these files down, as we will be compiling these files with respect to Unikraft's build system.

You have now built `iperf3` for Linux user space and we have walked through the build process for the application itself.
In the next section, we prepare ourselves to bring this application to Unikraft.
