We build the Unikraft `helloworld` image for the **linuxu** platform, for the **x86_64** architecture.
We follow the steps:

1. While in the `helloworld` folder, run

   ```console
   $ make menuconfig
   ```

1. From `Architecture Selection`, select `Architecture` -> `x86 compatible`.
1. From `Platform Configuration`, select `Linux user space`.
1. Save, exit and run

   ```console
   $ make
   ```

1. The resulting image, `app-helloworld_linuxu-x86_64`, will be present in the `build/` folder.
   Run it.

   ```console
   $ ./build/app-helloworld_linuxu-x86_64
   ```
