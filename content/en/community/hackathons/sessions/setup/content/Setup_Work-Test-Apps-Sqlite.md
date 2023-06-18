To test `app-sqlite`, we will first run it, then run some `sqlite` commands.
We can make use of the [files](https://github.com/unikraft-upb/scripts/tree/main/make-based/app-sqlite/rootfs) we have in the `scripts` repository:

```console
$ ./do.sh run
SeaBIOS (version 1.13.0-1ubuntu1.1)
Booting from ROM..Powered by
o.   .o       _ _               __ _
Oo   Oo  ___ (_) | __ __  __ _ ' _) :_
oO   oO ' _ `| | |/ /  _)' _` | |_|  _)
oOo oOO| | | | |   (| | | (_) |  _) :_
 OoOoO ._, ._:_:_,\_._,  .__,_:_, \___)
           Atlas 0.13.1~2ece76cf-custom
-- warning: cannot find home directory; cannot read ~/.sqliterc
SQLite version 3.30.1 2019-10-10 20:19:45
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite> .open chinook.db
sqlite> .tables
Album          Employee       InvoiceLine    PlaylistTrack
Artist         Genre          MediaType      Track
Customer       Invoice        Playlist
sqlite> select * from Album limit 3;
1|For Those About To Rock We Salute You|1
2|Balls to the Wall|2
3|Restless and Wild|2
sqlite> .read script.sql
sqlite> .tables
Album          Employee       InvoiceLine    PlaylistTrack
Artist         Genre          MediaType      Track
Customer       Invoice        Playlist       tab
sqlite> select * from tab limit 3;
7405751063934098374|424248302456590115
8823877996303865636|-7898283057077283054
-6858711495926786800|7025275982166127864
sqlite> .exit
```
