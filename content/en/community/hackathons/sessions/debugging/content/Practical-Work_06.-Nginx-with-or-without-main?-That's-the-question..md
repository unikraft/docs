Let's try a new application based on networking, **Nginx**.

First clone the repository for [app-nginx](https://github.com/unikraft/app-nginx) and put it in the right hierarchy.
Then you need to create `Makefile` and `Makefile.uk`.
Make sure to respect the order of libraries in `Makefile`. For more information, check the [lib-nginx](https://github.com/unikraft/lib-nginx) repository.  

* **Besides** the libraries listed in the [lib-nginx](https://github.com/unikraft/lib-nginx) repository, you will also
need to select the `posix-event` internal library in the configuration menu (`Library Configuration -> posix-event`).

Do you observe something strange? Where is the `main.c`?

Deselect this option `Library Configuration -> libnginx -> Provide a main function` and try to make your own `main.c` that will run **Nginx**.

Basically, this exercise has two tasks:
* Nginx + Makefile
* Nginx without `provide main function`

