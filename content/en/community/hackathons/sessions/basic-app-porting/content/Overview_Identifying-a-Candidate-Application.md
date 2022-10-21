The scope of this tutorial only covers how to bring an application to Unikraft `from first principles`.
Before you use Unikraft, you can access the source files of the application and compile the application natively for Linux user space.
You wish to compile this application against the Unikraft core and any auxiliary necessary third-party libraries in order to make it a unikernel.
Classic examples of these types of applications are open-source ones, such as NGINX, Redis, etc.
Of course, you can work with code which is not open-source, but again, you must be able to access the source files and the build system before you can begin.

For the sake of simplicity, this tutorial will only be targeting applications which are C/C++-based.
Unikraft supports other compile-time languages, such as Golang, Rust and WASM.
However, the scope of this tutorial only follows an example with a C/C++-based program.
Many of the principles in this tutorial, however, can be applied in the same way for said languages, with a bit of context-specific work.
Namely, this may include additional build rules for target files, using specific compilers and linkers, etc.

It is worth noting that we are only targeting compile-time applications in this tutorial.
Applications written a runtime language, such as Python or Lua, require an interpreter which must be brought to Unikraft first.
There are already lots of these high-level languages supported by Unikraft.(e.g., [app-python](https://github.com/unikraft/app-python3/), [app-lua](https://github.com/unikraft/app-lua))
If you wish to run an application written in such a language, please check out the list of available applications.
However, if the language you wish to run is interpreted and not yet available on Unikraft, porting the interpreter would be in the scope of this tutorial, as the steps here would cover the ones needed to bring the interpreter, which is a program after all, as a Unikraft unikernel application.

**Note:** In the case of higher-level languages which are interpreted, you do not need to follow this tutorial.
Instead, simply mount the application code with the relevant Unikernel binary.
For example, mounting a directory with python code to the python Unikraft unikernel.
Please review [Session 04: Complex Applications](/community/hackathons/sessions/complex-applications/) for more information on this topic.
