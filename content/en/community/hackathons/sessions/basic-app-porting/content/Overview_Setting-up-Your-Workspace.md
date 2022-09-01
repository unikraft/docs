Applications which are brought to Unikraft are actually libraries.
Everything in Unikraft is `libracized`, so it is no surprise to find out that even applications are a form of library.
They are a single component which interact with other components, have their own options and build files and interact in the same ways in which other libraries interact with each other.
The main difference between actual libraries and applications, is that we later invoke the application's `main` method.
The different ways to do this are [covered later in this tutorial](/community/hackathons/usoc22/basic-app-porting#invoking-the-applications-main-method).
