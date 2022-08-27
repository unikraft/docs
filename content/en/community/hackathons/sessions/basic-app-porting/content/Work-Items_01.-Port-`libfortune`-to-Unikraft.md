(Uni)kernel developers often seek guidance from elders, lost `man` pages, wizards, source code comments and occasionally swear by the reproducible environment.  But the unfortunate truth is that "bitshifts happen," and we cannot always [leverage guidance from mysterious forces](https://www.ggbuddy.com/img/post/oymiswgv/midgvf/3245543291_ac5d471739d22f258621e4e7cbdcb98f_309e11564f795_m.jpg).

A shared library called [`libfortune`](https://github.com/nderjung/libfortune) can offer solace in such times, providing much needed guidance to those who find themselves in the position of requiring fast boot times and secure memory isolation of an application.
This library is no joke, it will save us all.

In this mission, if you choose to accept it, port `libfortune` to Unikraft using the steps in the tutorial above.
`libfortune` is a simple shared library and should also demonstrate how it is possible to build a library which can be used for both Linux user space as well as Unikraft with a little bit of glue.
If you are successful in porting this library, you should be able to run the [`app-fortune`](https://github.com/unikraft/summer-of-code-2021/content/en/docs/sessions/08-basic-app-porting/work/01-app-fortune) located in this session's repository folder:

```bash
$ git clone https://github.com/unikraft/summer-of-code-2021.git
$ cd summer-of-code-2021/content/en/docs/sessions/08-basic-app-porting/work/01-app-fortune
$ kraft configure
$ kraft build
$ kraft run
```
```
[...]

SeaBIOS (version rel-1.12.0-59-gc9ba5276e321-prebuilt.qemu.org)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Tethys 0.5.0~825b115

"It always seems impossible until it is done."
        -- Nelson Mandela
```

