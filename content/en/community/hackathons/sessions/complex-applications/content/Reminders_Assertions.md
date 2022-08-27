We can use assertions to check if the system is in a defined and stable state.
Can be compiled-in or compiled-out and it can be activated from `Library Configuration -> ukdebug: Debugging and Tracing -> Enable assertions`.

The macros used can be:

* `UK_ASSERT` (condition)
* `UK_BUGON` (negative condition)
* `UK_CTASSERT` (condition)(used for compile-time assertions)
