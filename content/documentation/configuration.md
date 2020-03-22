## Configuration documentation

#### Runlevels

*CAVEAT: The next documentation was taken from the CRUX documentation and slighted modified to apply to Kwort*


The following runlevels are used in Kwort (defined in /etc/inittab):

| Runlevel | Description      |
|----------|------------------|
| 0        | Halt             |
| 1 (S)    | Single-user mode |
| 2        | Multi-user mode  |
| 3-5      | (Not used)       |
| 6        | Reboot           |

#### Layout

The initialization scripts used in Kwort follow the BSD-style (as opposed to the SysV-style) and have the following layout.

| File                       | Description                                        |
|----------------------------|----------------------------------------------------|
| /etc/rc.d/init/rc	         | System boot script                                 |
| /etc/rc.d/init/rc.single   | Single-user startup script                         |
| /etc/rc.d/init/rc.multi    | Multi-user startup script                          |
| /etc/rc.d/init/rc.local    | Local multi-user startup script (empty by default) |
| /etc/rc.d/init/rc.shutdown | System shutdown script                             |
| /etc/rc.conf               | System configuration                               |
| /etc/rc.d	                 | Service start/stop script directory                |


#### Configuration Variables in /etc/rc.conf

| Variable | Description |
|----------|-------------|
| FONT     | Specifies which console font to load at system startup. The contents of this variable will be passed as argument to setfont(1). The available fonts are located in /usr/share/kbd/consolefonts.<br>**Example:** `FONT=default` |
| KEYMAP   | Specifies which console keyboard map to load at system startup. The contents of this variable will be passed as argument to loadkeys(1). The available keyboard maps are located in /usr/share/kbd/keymaps. <br>**Example:** `KEYMAP=es-latin1` |
| TIMEZONE | Specifies the timezone used by the system. The available zone description files are located in /usr/share/zoneinfo. **Example:** `TIMEZONE=Europe/Stockholm` <br> **Example:** `TIMEZONE=UTC` |
| HOSTNAME | Specifies the hostname. <br> **Example:** `HOSTNAME=Aquiles` |
| MODULES  | You can indicate the list of modules that will be loaded during startup. <br> **Example:** `MODULES=(8139too ov511)` |
| LVM      | Indicate whether you want to use LVM or not (yes/no). <br> **Example:** `LVM=no` |
| SERVICES | Specifies which services to start at system startup. The services specified in this array must have a matching start/stop script in /etc/rc.d. When entering multi-user mode the specified scripts will be called in the specified order with the argument start. At system shutdown or when entering single-user mode these scripts will be called in the reverse order with the argument stop. <br> **Example:** `SERVICES=(sysklogd lo net sshd)` |

#### Generating locales

Since Kwort 3 is based on CRUX, glibc does not contain all possible locales anymore, thus you'll have to generate the locales you need/use. The following example is a typical setup for swedish users, replace sv\_SE\* with the locale you want:

``` sh
  localedef -i sv_SE -f ISO-8859-1 sv_SE
  localedef -i sv_SE -f ISO-8859-1 sv_SE.ISO-8859-1
  localedef -i sv_SE -f UTF-8 sv_SE.utf8
```

#### Network Configuration

The network configuration is found in the service script /etc/rc.d/net. To enable this service you need to add net to the SERVICES array in /etc/rc.conf.
Please adjust this script to your needs or create others if needed.

``` sh
  #!/bin/sh
  #
  # /etc/rc.d/net: start/stop network interface
  #

  # Connection type: "DHCP" or "static"
  TYPE="DHCP"

  # For "static" connections, specify your settings here:
  # To see your available devices run "ip link".
  DEV=wlo1

  # Optional settings:
  DHCPOPTS="-h `/bin/hostname` -t 10 -C resolv.conf"

  case $1 in
      start)
          if [ "${TYPE}" = "DHCP" ]; then
              /sbin/dhcpcd ${DHCPOPTS}
          else
              /sbin/ip addr add ${ADDR}/${MASK} dev ${DEV} broadcast +
              /sbin/ip link set ${DEV} up
              /sbin/ip route add default via ${GW}
          fi
      ;;
      stop)
          if [ "${TYPE}" = "DHCP" ]; then
              /sbin/dhcpcd -x
          else
              /sbin/ip route del default
              /sbin/ip link set ${DEV} down
              /sbin/ip addr del ${ADDR}/${MASK} dev ${DEV}
          fi
      ;;
      restart)
          $0 stop
          $0 start
      ;;
      *)
          echo "Usage: $0 [start|stop|restart]"
      ;;
  esac

  # End of file
```

