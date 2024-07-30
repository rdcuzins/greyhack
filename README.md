# GreyHack
This is a collection of tools for the game [GreyHack](https://greyhackgame.com/)

## Tools

### zsh
This is my verison of [rocShell](https://github.com/rocketorbit/rocShell) which will be tweaked over time. This shell can make breaking into anything super easy. Will be adding/tweaking features as I go. 

### RocLock
This [script](https://github.com/rocketorbit/Player-s-Handbook-Grey-Hack-guides-/blob/main/home_security.md) fully locks down a network using specific versions of libraries pulled down from a repo in game. 

### getCredJob
This program automatically searches the players e-mail for credential jobs and breaks into the networks to find useres to use for the social engineering part to obtain passwords. Unfortunately the features aren't implemented to fully automate this concept. 

### bdoor
Simply creates a backdoor on a server that connects back to a reverse shell server. The server info is injected during compile time using the vs-code plugin and can be set in the settings.

### dropper
Simple program to upload useful files to a target machine. This will be tweaked and added to the zsh.

### findHackShop
This is a [script](https://github.com/rocketorbit/Player-s-Handbook-Grey-Hack-guides-/blob/main/home_security.md) used to locate a hackshop for initial purchase of tools to keep private hackshop private.

### genpass
Generates a password.

## Vs-Code Plugin
I currently am using the [greybel-vs](https://github.com/ayecue/greybel-vs) and have a nice setup to auto build an installer and inject it into the game. 

### Settings
In the vscode settings, a password needs to be set in the settings under *greybel.transpiler.environmentVariables*. 
Here is the full settings I use for the plugin:

```json
    "greybel.createIngame.agent": "message-hook",
    "greybel.transpiler.installer.autoCompile": true,
    "greybel.createIngame.autoCompile": true,
    "greybel.createIngame.active": true,
    "greybel.createIngame.steamUser": "",
    "greybel.transpiler.environmentVariables": {
        "ZSH_PASS": "zsh_secret",
        "RSHELL_SERVER": "123.123.123.123"
    }
```

# Credits
Thanks to [rocketorbit](https://github.com/rocketorbit/rocShell) for having an open source shell to learn/borrow from.