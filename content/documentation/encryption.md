## Encryption

Kwort uses ext4 encryption if configured. The first step is to perform the initial filesystem encryption.
For this, you need to be sure your filesystem was created with the `encrypt` option. When using mkfs.ext4 you can specify the option `-O encrypt` or once formated you can enable it with: `tune2fs -O encrypt /dev/device`.
Then you can use fscrypt tool to perform the global setup with: `fscrypt setup`.
At this point, nothing is encrypted yet, but you'll see now in your root (/) that a `.fscrypt` directory has been created to store the directories' policies and protectors.

### Home directory encryption

Once your home directory is created and **CLEAN**, ensure it's owned by the right user:

```sh
  chown user:user /home/directory
```

Now it's time to setup encryption on that directory using.

*CAVEAT: The next step will encrypt the home directory.

``` sh
  fscrypt encrypt /home/newhome --user=user
```

This will create a policy and protector for the home directory.

From now on, every time you try to login with that user, the /etc/profile.d/0-encryption.sh will be executed to decrypt the user's home directory.

#### Handling fscrypt policies and protector ownership bug

Recent versions of fscrypt has shown ignoring the `--user=user` parameter, making the policy and protector inaccesible by the user. If you see this sympthom, run `fscrypt status /home/newhome` to get the policy and protector and change ownership. i.e.:

```sh
root@localhost:~# fscrypt status /home/newhome
"/home/newhome" is encrypted with fscrypt.

Policy:   9j8d4039485h2039485dj230mxnnw7nm
Options:  padding:32  contents:AES_256_XTS  filenames:AES_256_CTS  policy_version:2
Unlocked: Yes

Protected with 1 protector:
PROTECTOR         LINKED  DESCRIPTION
j89458n98m238n3c  No      custom protector "user"

root@localhost:~# chown user:root /.fscrypt/{policies/9j8d4039485h2039485dj230mxnnw7nm,protectors/j89458n98m238n3c}
```

