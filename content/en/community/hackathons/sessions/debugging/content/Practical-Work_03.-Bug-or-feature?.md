There are two kernel images located in the `work/03-app-bug/` folder.
One of them is build for **Linuxu**, the other for **KVM**.

First try to inspect what it's wrong with **Linuxu** image.
You will notice that if you run the program you will get a segmentation fault.
Why does this happen?

After you figure out what it's happening with **Linuxu** image have a look also at the **KVM** one.
It was built from the code source, but when you will try to run it, you will not get a segmentation fault.
Is this a bug or a feature?
