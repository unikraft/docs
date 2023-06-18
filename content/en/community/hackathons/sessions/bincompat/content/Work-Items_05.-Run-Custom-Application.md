We saw how to pack existing applications from our system and run them using the Unikraft `app-elfloader`, now let's try doing it with our own applications, from grounds up.
We will start with an empty `C` source file.

```console
mkdir my-app/
cd my-app/

### Create a `main.c` file to do what you want.
### We will assume for the tutorial that it will print `Hello, World!`

gcc -fPIC -pie -o main main.c
gcc -fPIC -static-pie -o main_static main.c
```

The last two commands will generate the `main_static` **statically linked executable**, and the `main` **dynamically linked executable**.
To run the `main_static` application, we can just pass it to the `app-elfloader` image, without worrying about any external dependencies:

```console
./run.sh -r ../my-app/ /main_static
```

```text
SeaBIOS (version rel-1.16.2-0-gea1b7a073390-prebuilt.qemu.org)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                  Atlas 0.13.1~d20aa7cb
Hello, world!
```

To run the dynamically linked application, use the `extract.sh` script as we did before.

Add more functionalities to your basic applications and try to run it using `app-elfloader`.
If you're feeling brave, you can try something more complex, like running a basic Go application that prints `Hello, World!`.

**Take a look at [this page](https://stackoverflow.com/questions/64019336/go-compile-to-static-binary-with-pie) for some help on building Go executables as `static-pie` applications**
