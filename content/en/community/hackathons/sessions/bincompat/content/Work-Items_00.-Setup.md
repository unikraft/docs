To easily setup, build and run Linux ELFs with [`app-elfloader`](https://github.com/unikraft/app-elfloader), best way is to use [the `scripts` repository](https://github.com/unikraft-upb/scripts).
Clone [the `scripts` repository](https://github.com/unikraft-upb/scripts) on your machine to get started.

```console
$ git clone https://github.com/unikraft-upb/scripts

$ cd scripts/

$ cd make-based/app-elfloader/

$ ./do.sh run
'run' command requires target application as argument
Target applications: helloworld_static server_static helloworld_go_static server_go_static helloworld_cpp_static helloworld_rust_static_musl helloworld_rust_static_gnu nginx_static redis_static sqlite3 bc_static gzip_static helloworld server helloworld_go server_go helloworld_cpp helloworld_rust nginx redis sqlite3 bc gzip

$ ./do.sh run helloworld
[...]                       # many messages

$ ./do.sh run sqlite3
[...]                       # many messages
```

The last commands run the dynamic versions of `helloworld` and `sqlite3` applications, the ones in [the `dynamic-apps` repository](https://github.com/unikraft/dynamic-apps).
There is a lot of output because, by default, a pre-build version of [`app-elfloader`](https://github.com/unikraft/app-elfloader) is being used, with debugging enabled.
