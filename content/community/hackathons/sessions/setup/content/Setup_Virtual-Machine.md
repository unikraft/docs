If a native Linux environment is not available, you can use [this virtual machine](https://drive.google.com/file/d/1u5DtN5kMPWxBU8UdBfnZ7DNRP2n6oiTy/view?usp=share_link).
It's in OVA format, import it in VirtualBox or VMware or any other OVA-supporting virtualization solution.

Start the virtual machine and log in using:

- username: `unikraft`
- password: `unikraft`

Secondly, list files.
You would get something like:

```console
unikraft@vm-49:~$ ls
hack-athens-2023/

ubuntu@vm-49:~$ tree -L 2 --charset=ascii
.
|-- apps/
|-- libs/
`-- unikraft/
```

A quick description of the contents:

- `hack-athens-2023/` is a Unikraft work folder already setup to run Unikraft applications
- `unikraft/` contains the [Unikraft core](https://github.com/unikraft/unikraft) repository
- `libs/` will contain all the necessarry [external libraries](https://github.com/orgs/unikraft/repositories?q=lib-&type=all&language=&sort=)
- `apps/` will contain all the [applications](https://github.com/orgs/unikraft/repositories?q=app-&type=all&language=&sort=) we want to use
