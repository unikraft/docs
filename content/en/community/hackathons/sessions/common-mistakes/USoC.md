# Common Mistake 1

In case the students get an unexpected error, they should check to see if
both Unikraft and the used libraries are on the `staging` branch.

In order to check
this, one must go in the directory where Unikraft/the libraries are located
and check the branch using `git branch`.

An undesired output could look like `((HEAD detached at RELEASE-0.5))`.
We can correct this by moving to the staging branch with `git checkout staging`.