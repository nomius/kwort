## Package System

Kwort package system is very simple, just tar packages containing the binaries compressed with a format supported by libarchive (we normally use xz). If your package needs the execution of extra commands after being decompressed, the /install/doinst.sh script is excecuted.

This page explains the usage of kpkg and makepkg. The first one is used to manage your packages (install, remove, upgrade packages, etc...), while the second one is used to create packages.

#### kpkg

kpkg is Kwort's package manager, it can handle packages created for Kwort in formats supported by libarchive: txz, tbz2 or .tgz are valid options, although txz/tar.xz are the ones prefered for Kwort. It can install packages from our mirrors or any other you choose. It has a few options, including the basics, likeinstalling and removing software, and more advanced features.

Usage: `kpkg <ACTION> [PACKAGE[S]|FILE ...]`

##### OPTIONS

**update:**
This option updates a package database from all mirrors installed or from the mirror you chose from. s section down here.

**Examples:**
```sh
kpkg update
kpkg update europa
```
