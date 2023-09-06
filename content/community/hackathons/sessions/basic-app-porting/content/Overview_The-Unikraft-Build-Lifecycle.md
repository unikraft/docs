The lifecycle of the construction of a Unikraft unikernel includes several distinct steps:

<p style="text-align:center;">
   <img src="/community/hackathons/sessions/basic-app-porting/unikraft-overview.svg" style="max-width:700px;display:block;margin:auto;" alt="Diagram of the overview of the Unikraft Build Process" />
   <strong style="margin-top:20px;display:inline-block;">Overview of the Unikraft build process.</strong>
</p>

1. Configuring the Unikraft unikernel application with compile-time options
1. Fetching the remote "origin" code of libraries
1. Preparing the remote "origin" code of libraries
1. Compiling the libraries and the core Unikraft code
1. Finally, linking a final unikernel executable binary together

The above steps are displayed in the diagram.
The Unikraft unikernel targets a specific platform and hardware architecture, which are set during the configuration step of the lifecycle.

The steps in the lifecycle above are discussed in this tutorial in greater depth.
Particularly, we cover `fetching`, `preparing` and compiling (`building`) external code which is to be used as a Unikraft unikernel application (or library for that matter).
