At this stage, you should be familiar with the steps of configuring, building and running any application within Unikraft and know the main parts of the architecture.
Below, you can see a list of the commands you have used so far.

| Command                                                | Description                                                             |
|--------------------------------------------------------|-------------------------------------------------------------------------|
| `kraft list`                                           | Get a list of all components that are available for use with kraft      |
| `kraft up -t <appname> <your_appname>`                 | Download, configure and build existing components into unikernel images |
| `kraft run`                                            | Run resulting unikernel image                                           |
| `kraft init -t <appname>`                              | Initialize the application                                              |
| `kraft configure`                                      | Configure platform and architecture (interactive)                       |
| `kraft configure -p <plat> -m <arch>`                  | Configure platform and architecture (non-interactive)                   |
| `kraft build`                                          | Build the application                                                   |
| `kraft clean`                                          | Clean the application                                                   |
| `make menuconfig`                                      | Configure application through the main menu                             |
