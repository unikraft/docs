To test `app-redis`, we will use the [`redis-cli`](https://github.com/unikraft-upb/scripts/blob/main/utils/redis-cli) tool.
We run the application, then we connect to the `Redis` server from another terminal using `redis-cli`.

```console
$ ./do.sh run
SeaBIOS (version 1.13.0-1ubuntu1.1)

iPXE (http://ipxe.org) 00:03.0 C000 PCI2.10 PnP PMM+0FF8C8B0+0FECC8B0 C000

Booting from ROM..1: Set IPv4 address 172.44.0.2 mask 255.255.255.0 gw 172.44.0.1
en1: Added
en1: Interface is up
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
           Atlas 0.13.1~2ece76cf-custom
1:C 18 Jun 2023 12:21:41.051 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
1:C 18 Jun 2023 12:21:41.052 # Redis version=5.0.6, bits=64, commit=c5ee3442, modified=1, pid=1, just started
1:C 18 Jun 2023 12:21:41.052 # Configuration loaded
[    0.207621] ERR:  [libposix_process] <deprecated.c @  348> Ignore updating resource 7: cur = 10032, max = 10032
1:M 18 Jun 2023 12:21:41.108 * Increased maximum number of open files to 10032 (it was originally set to 1024).
                _._
           _.-``__ ''-._
      _.-``    `.  `_.  ''-._           Redis 5.0.6 (c5ee3442/1) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 1
  `-._    `-._  `-./  _.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |           http://redis.io
  `-._    `-._`-.__.-'_.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |
  `-._    `-._`-.__.-'_.-'    _.-'
      `-._    `-.__.-'    _.-'
          `-._        _.-'
              `-.__.-'

1:M 18 Jun 2023 12:21:41.158 # Server initialized
1:M 18 Jun 2023 12:21:41.159 # Warning: can't mask SIGALRM in bio.c thread: No error information
1:M 18 Jun 2023 12:21:41.182 # Warning: can't mask SIGALRM in bio.c thread: No error information
1:M 18 Jun 2023 12:21:41.183 # Warning: can't mask SIGALRM in bio.c thread: No error information
1:M 18 Jun 2023 12:21:41.185 * Ready to accept connections
```

```console
$ ./redis-cli -h 172.44.0.2 -p 6379
172.44.0.2:6379> PING
PONG
172.44.0.2:6379>
```
