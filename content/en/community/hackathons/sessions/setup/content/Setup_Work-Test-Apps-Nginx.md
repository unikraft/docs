To test `app-nginx`, we will first run it:

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
                  Atlas 0.13.1~2ece76cf
```

Then you can open a browser and go to `172.44.0.2`.
You should be met with [the web page](https://github.com/unikraft/app-nginx/blob/staging/fs0/nginx/html/index.html) `nginx` is configured to serve.

![app-nginx](/assets/imgs/app-nginx-browser.png)

You can also open another terminal and run:

```console
$ wget 172.44.0.2
--2023-06-18 15:02:55--  http://172.44.0.2/
Connecting to 172.44.0.2:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 180 [text/html]
Saving to: ‘index.html’

index.html     100%[=====================================================================================================================>]     180  --.-KB/s    in 0s

2023-06-18 15:02:55 (11,5 MB/s) - ‘index.html’ saved [180/180]
```
