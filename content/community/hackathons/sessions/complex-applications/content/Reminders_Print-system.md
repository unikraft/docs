This print system in implemented in `lib/ukdebug` and can be activated using `make menuconfig` (`Library Configuration -> ukdebug: Debugging and Tracing`).

There are two types of messages:

* **Kernel messages**
  * **Information**(`uk_pr_info`)
  * **Warnings**(`uk_pr_warn`)
  * **Errors**(`uk_pr_err`)
  * **Critical Messages**(`uk_pr_crit`)
* **Debug messages**(`uk_pr_debug`)
