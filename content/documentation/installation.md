## Installation documentation

#### System requirements

* Processor x86\_64
* RAM 512 MB (for the installation only. Once installed you only require 128mb of RAM)
* Disk Space 1.4 GB

#### How to install Kwort Linux on your hardrive

Kwort has no installation system, the below steps describes how to install the OS using regular OS management tools. During the installation you can type `helpinstall` to see this message again.
Configure your partition table if you haven't done that already. In order to do that, you can use the tools fdisk/cfdisk commands for MBR, or gdisk/cgdisk for GPT. For example: `cfdisk /dev/sda`

You can setup LVM if you want (this is optional).
Create filesystems (and swap area(s) if you want to) where Kwort will be installed. Use the command mkfs.ext2, mkfs.ext3, mkfs.ext4, mkfs.jfs, mkfs.reiserfs or mkfs.xfsi, mkswap (for swap) with the device where you want to build a file system to install to. For example: `mkfs.ext4 /dev/sda1`

Mount your filesystems making /mnt/install your root mountpoint this will allow Kwort's package installer to do its job properly.

For example if you formatted /dev/sda1 as ext4 and want to install Kwort into it, you sould run:
`mount -t ext4 /dev/sda1 /mnt/install`. Take note that if for example you want /boot in a separate partition (let's say /dev/sda2 formatted as ext2) you should also do: `mkdir -p /mnt/install/boot &amp;&amp; mount -t ext2 /dev/sda2 /mnt/install/boot`.

Mount the installation media in /mnt/kwort if it is not already mounted:
 *CAVEAT: The installation media device could change depending your installation device (optical, usb, a separated partition, etc...).*

Run the `pkgsinstall` command to install all the packages in /mnt/install.
Setup your installation by using the `jumpOS` command to chroot with all required mountpoints. Once in the OS you should:

* Edit `/etc/fstab` to setup your mountpoints.
* Edit `/etc/rc.conf` to configure the keyboard language, hostname, timezone, LVM requirement and the auto-loading of kernel modules and services that will start during boot.
* Set the root password with the `passwd` command.
* Install a bootloader package (in /root/bootloaders you'll find several combinations of lilo and grub2. Pick one and install it with kpkg. For example `kpkg install /root/bootloaders/lilo#24.2#x86_64#1.tar.xz`

   *CAVEAT: If you installed GRUB2, you might want to install os-prober from the same directory as well.*

* Setup the chosen bootloader (edit `/etc/lilo.conf` or run `grub-mkconfig -o /boot/grub/grub.cfg`) and install the bootloader in MBR/EFI (for example, run `lilo` if you choose lilo and you're using MBR).
* Type exit once completed.

HINT: Kwort's main editor is vim, but if you're not comfortable with it, you can also use mc's mcedit editor which comes also installed.
Installation complete, you can now reboot to the installed system.

