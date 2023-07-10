Test the resulting library by calling the test function from the `app-kdtree` application.
If you did everything correctly, the output of the application should look something like this:

```text
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM...
Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
                   Phoebe 0.10.0~3a997c1
Running test y ....................
inserting 10 random vectors... 0.000 sec
range query returned 0 items in 0.00000 sec
PASS
Running test z ....................
found 5 results:
node at (-3.463, -2.934, 7.719) is 8.108 away and has data=i
node at (-5.316, 2.205, 5.781) is 7.482 away and has data=f
node at (2.210, 3.937, -5.407) is 7.837 away and has data=h
node at (1.810, 8.039, -4.218) is 9.753 away and has data=g
node at (-2.347, -3.641, -7.053) is 9.144 away and has data=e
PASS
Total tests : 2
Total errors: 0
```

**Note**: Remember to include the updated library header in the main application file.
