The [`unikraft` GitHub organization](https://github.com/unikraft) contains [the main Unikraft repository](https://github.com/unikraft/unikraft) and separate repositories for [external libraries](https://github.com/search?q=topic%3Alibrary+org%3Aunikraft&type=Repositories), as well as [already ported apps](https://github.com/search?q=topic%3Aunikraft-application+org%3Aunikraft&type=Repositories).
In the previous sessions, we saw that the Unikraft repository consists of internal libraries, platform code and architecture code.
The Unikraft code doesn't have any external dependencies, in contrast to the external libraries or applications, which can have external dependencies.

External libraries can have more specific purposes.
So, we can port a library even just for a single application.
The process of adding new internal libraries is almost the same as for external ones, so further we will focus on porting an external library.
