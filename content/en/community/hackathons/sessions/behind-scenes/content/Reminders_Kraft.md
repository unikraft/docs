[Kraft](https://github.com/unikraft/kraft) is the tool developed by the Unikraft team, to make application deployment easier.
To automatically download, configure, build and run an application (e.g. helloworld), run

```
$ kraft list update
$ kraft up -t helloworld@staging ./my-first-unikernel
```

If you are already working with cloned / forked repositories from Unikraft, kraft can also help you configure, build and run you application.
`kraft up` can be broken down into the following commands:

```
$ kraft configure
$ kraft build
$ kraft run
```
