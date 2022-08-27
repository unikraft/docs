The [organization's GitHub](https://github.com/unikraft) contains [the main Unikraft repository](https://github.com/unikraft/unikraft) and separate repositories for [external libraries](https://github.com/search?q=topic%3Alibrary+org%3Aunikraft&type=repositories), as well as [already ported apps](https://github.com/topics/unikraft-application).
In the previous sessions, we saw that the Unikraft repository consists of internal libraries, platform code and architecture code.
The Unikraft code doesn't have any external dependencies, in contrast to the external libraries or applications, which can have external dependencies.

External libraries can have more specific purposes.
So, we can port a library even just for a single application.
The process of adding new internal libraries is almost the same as for external ones, so further we will focus on porting an external library.

Also, the main repository has [open issues](https://github.com/unikraft/unikraft/issues) to which you can contribute.
In general, this process is done by solving the issue on your personal fork of the project, and after that making a [pull request (PR)](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) with your solution.
For more specific details about creating a PR while following the comunity guidelines, check the [Contributing page](https://unikraft.org/docs/contributing/) on the Unikraft documentation website.
