## FAQ

#### The installation just hanged during boot. What should I do?

There's probably a kernel built-in configuration causing issues with your current hardware. Normally, noapic or nomodeset options at boot fix the problem.

#### Ok, I've installed Kwort, what should I do now?

First, login as root, then add a new user with:

```sh
  useradd -m -g users -G audio,video,cdrom,floppy,dialout,wheel -s /bin/bash newuser
```
Then you should try if Xorg (try the `startx` command) works as expected for you.

These days Xorg works pretty much OOTB, but **if not, should configure your X settings with:**

```sh
  X -configure
```

**A new file will be created, test it with:**

```sh
  X -config ./xorg.conf.new
```
Then, copy that file to /etc/X11 with the name xorg.conf.
Now you can login with your new created user and start the graphical environment with the following command:

```sh
  startx
```

#### My user can't play any sound file... What should I do?

First of all, check the audio volume level of your sound card, if they seem OK, surely your user isn't in the audio group. Check it with the command: `id -n -G`
If that's OK, then maybe you have to configure your soundcard, try it with: `alsaconf`

#### Where can I configure my network? Which file?

Just edit and put your configuration as needed `/etc/rc.d/net`. See the System Configuration in order to understand what `/etc/rc.d/net` should be.

#### How can I manage my packages with Kwort?

`kpkg` is the packet manager from Kwort. Read the full documentation here: [Package System](documentation.html?packaging.html). You can also read the same on the kpkg manual page (8).

#### X resolution in qemu/kvm, doesn't get any higher than 800x600, how can I fix it?

Yes, edit your xorg.conf (it should be in /etc/X11/xorg.conf in your virtual machine) and set in the Monitor settings the HorizSync and VertRefresh. So your Monitor section should look something like this:

```sh
  Section "Monitor"
      Identifier  "Monitor0"
      VendorName  "Monitor Vendor"
      ModelName   "Monitor Model"
      VertRefresh 43-60
      HorizSync   28-64
  EndSection
```

#### I go into X, but my mouse and/or keyboard isn't working. How can I fix it?

Since Kwort doesn't use PolicyKit/uinputd/hal, just add the following to your xorg.conf file:

```sh
  Section "ServerFlags"
      Option "AutoAddDevices" "False"
  EndSection
```

#### What should I do with the kdb file?

The kdb file stands for Kwort database, and you can install it with kpkg in this way:

```sh
  kpkg instkdb ctrl-c.kdb
```

Or simply:

```sh
  kpkg instkdb http://ctrl-c.club/~nomius/kwort/<KWORT VERSION>/ctrl-c.kdb
```

#### I heard that I can use CRUX ports with Kwort. Is that true? If that's so, then how can I do it?

CRUX ports are a really nice piece of software. You can even integrate that port system in any Linux distribution with just a few modifications. I made those modification in the crux port system for Kwort so that, the port system is fully integrated with Kwort's package system so you can really enjoy it. Go to the package\_more/ports directory of the ISO and install the packages in there:

```sh
  # If the ISO is mounted in /mnt/cdrom
  kpkg install /mnt/cdrom/packages_more/ports/*.tar.xz
```

Additionally you can install them from the mirror with:

```sh
  kpkg install fakeroot httpup rsync ports
```

I encourage you to read the [CRUX Port's documentation](https://crux.nu/Main/Handbook3-5#ntoc29). Just bear in mind that *ports are installed in /usr/src/ports, unlike CRUX where ports are in /usr/ports.*

#### How can I install docker?

kpkg doesn't handle dependencies so you need to install them manually. Below is how you do it:

```sh
  kpkg install go libseccomp btrfs-progs cgroupfs-mount containerd runc docker
```

#### Is it there something like a "service" command for Kwort?

Since Kwort 4.2, the service command is already included in the rc package, otherwise, you can download it from [here](https://raw.githubusercontent.com/nomius/misctools/master/service); although I encourage you to use `/etc/rc.d` script files

