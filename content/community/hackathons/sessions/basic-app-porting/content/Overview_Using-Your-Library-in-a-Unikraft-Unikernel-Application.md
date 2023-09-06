Now that we have a library set up in `iperf3`'s name, located at `~/workspace/libs/iperf3`, we should immediately start using it so that we can start the porting effort.

To do this, we create a parallel application which uses both the library we are porting and the Unikraft core source code.

1. First start by creating a new application structure, which we can do by initializing a blank project:

   ```console
   $ cd ~/workspace/apps
   $ kraft init iperf3
   ```

2. We will now have a `empty` initialized project.
   You'll find boilerplate in this directory, including a `kraft.yaml` file which will look something like this:

   ```console
   $ cd ~/workspace/apps/iperf3
   $ cat kraft.yaml
   ```
   ```yaml
   specification: '0.5'
   unikraft: staging
   targets:
      - architecture: x86_84
        platform: kvm
   ```

3. After setting up your application project, we should add the new library we are working on to the application.
   This is done via:

   ```console
   $ kraft lib add iperf3@staging
   ```

   **Note:** Remember that the default branch of the library is `staging` from the `kraft lib init` command used above.
   If you change branch or use an alternative `--initial-branch`, set it in this step.

   This command will update your `kraft.yaml` file:

   ```diff
   diff --git a/kraft.yaml b/kraft.yaml
   index 33696bb..c14e480 100644
   --- a/kraft.yaml
   +++ b/kraft.yaml
   @@ -6,3 +6,6 @@ unikraft:
   targets:
      - architecture: x86_64
        platform: kvm
   +libraries:
   +  iperf3:
   +    version: staging
   ```

4. We are ready to configure the application to use the library.
   It should be possible to now see the boilerplate `iperf3` library within the [`menuconfig`](https://en.wikipedia.org/wiki/Menuconfig) system by running:

   ```console
   $ kraft menuconfig
   ```

   within the application folder.
   However, it will also be selected automatically since it is in the `kraft.yaml` file now if you run the configure step:

   ```console
   $ kraft configure
   ```

   By default, the application targets `kvm` on `x86_64`.
   Adjust appropriately for your use case either by updating the `kraft.yaml` file or by setting it the `menuconfig`.

In the next section, we study the necessary files in the workspace and how we can modify them to bring `iperf3` into life with Unikraft.
