Let's try a new application based on networking, **Nginx**.

First clone the repository for [app-nginx](https://github.com/unikraft/app-nginx) and put it in the right hierarchy.
Then you need to create `Makefile` and `Makefile.uk`.
Make sure to respect the order of libraries in `Makefile`. For more information check [lib-nginx](https://github.com/unikraft/lib-nginx) repository.

Do you observe something strange? Where is the `main.c`?

Deselect this option `Library Configuration` -> `libnginx` -> `Provide a main function` and try to make your own `main.c` that will run **Nginx**.

* Nginx + Makefile
* Nginx without `provide main function`

