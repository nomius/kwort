## Package System

#### Packaging with makepkg

*NOTE: The next documentation was taken from the Slackware documentation and slighted modified to apply to Kwort*

makepkg was borrowed from Slackware and rewritten to create Kwort specific packages. In order to create a package, you will need to have the binary files for the package you want to create. Obviously this means you will need to either have the binary files already available in your system, or you will have to build the binary files from the source files. Here are the steps you need to follow to create a package:

* create a directory tree
* copy all the files related to the package into the appropriate directories in the directory tree.
* run makepkg to create the package.

I would advice you to create a directory where you will package your packages; for instance, something like /pkg. This is where you will create your directory tree. /pkg will simple contain the location on where the files in the package you are creating will be installed. For instance, foo#1.0#x86\_64#1.tar.xz will install the binary file foo in /usr/bin and a configuration file foorc in /usr/etc. Therefore, /pkg will contain the following directories:

```sh
  /pkg/usr/bin
  /pkg/usr/etc
```

The next step is to copy all the files to the directory tree. So in this case, there are only two files to foo#1.0#x86\_64#1.tar.xz, and they are foo and foorc. We then copy the files to where they will be installed, in this case, /usr/bin and /usr/etc respectively. When that is done with, we do the following:

```sh
  cd /pkg
  makepkg -s -c -z foo#1.0#x86_64#1.tar.xz
```

This will create a package called foo#1.0#x86\_64#1.tar.xz which contains the files foo and foorc which will be installed in /usr/bin and /usr/etc respectively. Also, given the options -s, -c and -z was given, it will strip binaries (in this case `/usr/bin/foo`), chown all files to root:root and compress man pages if any.

As you probably noted, you will need to hunt around for the files and then to copy them to the created directory tree. An easier way to do this would be to build the package from source, and then have the built binaries installed into the directory tree. If for instance we have downloaded a source package called foo-1.0.tar.gz. We have already created a directory /pkg it is currently empty. The first thing to do is to unpack the source file and then to build the source. A full sequence of a software source which uses autotools would be:

```sh
  tar xvzf foo-1.0.tar.gz
  cd foo-1.0
  ./configure --prefix=/usr
  make
  make DESTDIR=/pkg install
  cd /pkg
  makepkg -s -z -c foo#1.0#x86_64#1.tar.xz
```

The line `./configure --prefix=/usr` will build the package in order to get configured for the real system in usr. The line `make DESTDIR=/pkg install` will cause the known `make install` to install all files into `/pkg` while at the same time, building the directory tree for you. So when you are done, just go to `/pkg` and run `makepkg` from within it, and it will automatically build the package for you. If the source package doesn't use autotools, then you will have to build and find out where the files will be installed in. Fortunately, most major source packages will require you to make use of the `./configure` stage.

##### Important notes on official packages

**If you pretend your package to be in the official mirror, first of all your package must apply some rules:**

1. Nothing goes to /usr/local, your package prefix should be /usr unless it's for file systems or networking, which in that case should be / (depends on the criteria).
2. All man pages must be in /usr/man (and not /usr/share/man).
3. All man pages must be gziped.
4. There's no /usr/libexec, so don't create one with your packages. libexecdir should be /usr/lib/package.
5. Stay clean!

The fact that you did all that doesn't mean that your package is gonna be in the official mirror, as your package must be stable, well tested, etc. But at first sight it will not be rejected because you didn't "follow the book".

