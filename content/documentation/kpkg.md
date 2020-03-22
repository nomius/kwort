## Package System

Kwort package system is very simple, just tar packages containing the binaries compressed with a format supported by libarchive (we normally use xz). If your package needs the execution of extra commands after being decompressed, the /install/doinst.sh script is excecuted.

This page explains the usage of kpkg and makepkg. The first one is used to manage your packages (install, remove, upgrade packages, etc...), while the second one is used to create packages.

#### kpkg

kpkg is Kwort's package manager, it can handle packages created for Kwort in formats supported by libarchive: txz, tbz2 or .tgz are valid options, although txz/tar.xz are the ones prefered for Kwort. It can install packages from our mirrors or any other you choose. It has a few options, including the basics, likeinstalling and removing software, and more advanced features.

Usage: `kpkg <ACTION> [PACKAGE[S]|FILE ...]`

##### OPTIONS

**update:**
This option updates a package database from all mirrors installed or from the mirror you chose from.

**Examples:**
```sh
  kpkg update
  kpkg update europa
```

**install PACKAGE1 [PACKAGE2 ...]:**
This option allows you to install a package from a local place or from the chosen mirrors.

**Examples:**
```
  kpkg install openvpn
  kpkg install go libseccomp btrfs-progs cgroupfs-mount containerd runc docker
  kpkg install /home/user/mypackage#1.0#x86_64#1.tar.xz
```

**remove PACKAGE1 [PACKAGE2 ...]:**
Use this option to remove installed packages.

**Examples:**
```
  kpkg remove openvpn
  kpkg remove go libseccomp btrfs-progs cgroupfs-mount containerd runc docker
```
*CAVEAT: This option does not remove packages installed from source. Only packages installed with kpkg.*

**download PACKAGE1 [PACKAGE2 ...]:**
With this option you download packages from the mirror but don't install them. The downloaded packages go to /var/packages/downloads.

**Examples:**
```
  kpkg download openvpn
```

**search PACKAGE1 [PACKAGE2 ...]:**
This option only search a package in the database, it doesn't install or remove any package. It doesn't modify the database at all. If you want to know all packages in the database, you can use "/all" as package name.

**Examples:**
```
  kpkg search openvpn
```

**provides FILE:**
This option allows you to know which package installed by kpkg is providing a given file.

**Examples:**
```
  kpkg provides bin/ls
```

**instkdb FILE or LINK:**
This option allow you to install a kdb file that contains a database mirror definition. Its argument can be a local kdb file or a link to a kdb file.

**Examples:**
```
  kpkg instkdb /root/ctrl-c.kdb
  kpkg instkdb http://ctrl-c.club/~nomius/kwort/4.3.4/ctrl-c.kdb
```

##### ENVIRONMENT

**ROOT:**
This option is used to set a path to an installation. Leave it empty to install in the root (/). Accepted value is a full directory name.

**Examples:**
```
  ROOT=/opt kpkg install openvpn
```
*CAVEAT: Note that if you change this variable you might also probably change also KPKG_DB_HOME, to point the installed packages database to.* `$ROOT/var/packages/installed.kdb`.


**KPKG_DB_HOME:**
This option is used to set a path where the database is. You can work with this with several database using them completely separated. Leave it empty to use the default database path (`/var/packages/installed.kdb`).

**Examples:**
```
  KPKG_DB_HOME=/home/nomius/installed.kdb kpkg install openvpn
```

**CSV:**
Using the search command will produce a human readable form list of installed packages, setting this variable to "yes" will make its output to be in csv format. This option is useful for front-ends where the output of kpkg must be piped to another program.

**Examples:**
```
  CSV=yes kpkg search /all
```

**MIRROR:**
If you have a package on several mirrors and you don't want to be prompted when installing, you can set this variable the the mirror name. The mirror name is the name of the database without its extension.

**Examples:**
```
  MIRROR=ctrl-c kpkg install openvpn
```

