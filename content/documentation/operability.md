## Managing Kwort

The below documentaion describe a few tools and configuration files which makes the user experience easier and cleaner.

#### Moving around in the base GUI configuration

There are three main key shortcut available in Kwort that are not in other systems:

`alt + z` Opens the default terminal (rxvt-unicode, AKA: urxvt)

`alt + x` Opens the default browser. If this one wasn't configured, the browser chooser will show up.

`alt + c` Opens the volume mixer.


#### Kwort tools

Kwort comes with 3 tools to configure default tools and preferences on the system, these are: `browser`, `kwort-mixer` and `xdg-open`.
All of these three can be manually tweaked and/or configured.

`browser` will open the configured browser. If it wasn't configured yet, it will use a dmenu based menu with the list of installed browsers to let you pick the one you want to set. This tool will configure the variable `BROWSER` in the file `$HOME/.config/browser.conf`.

`kwort-mixer` will allow you to increase/decrease volume or toggle it. It supports pulseaudio (default) and alsa as backends and uses a Kwort notification system (built on top of dzen2). You can choose to switch to ALSA by editing the file `${HOME}/.config/audio.conf` (if it doesn't exist you can create it). If you choose to use	ALSA instead of PulseAudio, you should set the variable `USE_PULSE` to 0 and configure the variables `ALSA_CARD` and `ALSA_CHANNEL`in this configuration file.

`xdg-open` is a simple implementation and with a simple configuration of the file/URL opener using user's preferred application. It uses dmenu to allow the user to choose their preferred apps and the configuration is saved in `$HOME/.config/kxdg.cfg` in the format `extension=opener` in case you want to manually configure it.

