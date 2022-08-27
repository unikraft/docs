For this session, a template has been provided which contains some basic building blocks (like crafting a IPv4/UDP packet) for our high performance NF.
Start by making a copy of it:

```sh
$ cp -a sol/pktgen path/to/your/copy
```

Go into your copy and initialize it with `kraft`:

```sh
$ cd path/to/your/copy
$ kraft list update
$ kraft list pull
$ kraft configure
$ kraft build
```

Check if the image runs and prints the Unikraft banner:

```sh
$ kraft run
```
