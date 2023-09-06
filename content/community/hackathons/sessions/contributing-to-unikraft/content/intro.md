The focus of this session will be on porting new libraries to Unikraft and preparing them for upstreaming to the [main organization's GitHub](https://github.com/unikraft).

Being a library operating system, the unikernels created using Unikraft are mainly a collection of internal and external libraries, alongside the ported application.
As a consequence, a large library pool is mandatory in order to make this project compatible with as many applications as possible.

An application ported on top of unikraft is nothing more than a library with an already provided `main()` function.
For example, if you take a look into the [`app-nginx` repository](https://github.com/unikraft/app-nginx), you will see that the only relevant files are the minimal `Makefile` and `Makefile.uk`.
All the magic happens in the [`lib-nginx` repository](https://github.com/unikraft/lib-nginx), where you can see a very complex [`Makefile.uk` file](https://github.com/unikraft/lib-nginx/blob/staging/Makefile.uk), along with a [`main` function](https://github.com/unikraft/lib-nginx/blob/staging/main.c), that will be the entry point for `app-nginx`.
