Run as many executables as possible from the list of applications listed by the command:

```console
$ ./run_app.sh
Usage: ./run_app.sh [-l] <app>
Possible apps:
bc bc_static bzip2 client client_go client_go_static client_static echo gzip 
gzip_static haproxy helloworld helloworld_cpp helloworld_cpp_static 
helloworld_go helloworld_go_static helloworld_rust helloworld_rust_static_gnu 
helloworld_rust_static_musl helloworld_static ls nginx nginx_static openssl 
python redis redis7 redis_static server server_go server_go_static 
server_static sqlite3 sqlite3_static
```

**Note that some applications will not function properly.
These issues are caused by missing features within Unikraft.
These are known and are planned to be solved in the near future.**
