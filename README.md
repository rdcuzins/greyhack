# GreyHack
This is a collection of tools for the game [GreyHack](https://greyhackgame.com/)

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
        "PROXIES": "123.123.123.123:secret,122.122.122.122:secret2",
        "ZSH_PASS": "zsh_secret",
        "PROXY_PASS": "proxy_secret"
    }
```

# Credits
Thanks to [rocketorbit](https://github.com/rocketorbit/rocShell) for having an open source shell to learn/borrow from.