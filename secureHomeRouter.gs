if active_user != "root" then exit("Run as root.")
shell = get_shell

metaxploit = include_lib(current_path + "/metaxploit.so")
if not metaxploit then metaxploit = include_lib("/lib/metaxploit.so")
if not metaxploit then exit("metaxploit.so not found in current path or /lib")

getCloudExploitAPI = function(metaxploit)
    recursiveCheck = function(anyObject, maxDepth = -1)
        if maxDepth == 0 then return true
        if @anyObject isa map or @anyObject isa list then
            for key in indexes(@anyObject)
                if not recursiveCheck(@key, maxDepth - 1) then return false
            end for
            for val in values(@anyObject)
                if not recursiveCheck(@val, maxDepth - 1) then return false
            end for
        end if
        if @anyObject isa funcRef then return false
        return true
    end function
    if typeof(metaxploit) != "MetaxploitLib" then return print("metaxploit required for api to work.")
    netSession = metaxploit.net_use(nslookup("www.ExploitDatabase.org"), 22) //connect to server with metaxploit on ssh service
    if netSession then metaLib = netSession.dump_lib else metaLib = null
    if metaLib then remoteShell = metaLib.overflow("0xF8E54A6", "becolo") else remoteShell = null //exploit needed to grab a guest shell to the server
    if typeof(remoteShell) != "shell" then print("Server failed. API running in local mode.")
    
    clearInterface = function(interface)
        for k in indexes(interface)
            if @k == "classID" or @k == "__isa" then continue
            remove(interface, @k)
        end for
        if not recursiveCheck(@interface) then exit("<color=red>WARNING, API MAY HAVE BEEN POISONED, ABORTING.</color>")
        return null
    end function

    api = {}
    api.classID = "api"
    api.connection = remoteShell
    api.metaxploit = metaxploit
    api.interface = get_custom_object

    //all api method start
    api.testConnection = function(self) //demo method.
        clearInterface(self.interface)
        if typeof(self.connection) != "shell" then return false
        self.interface.ret = null
        self.interface.args = ["testConnection"]
        self.connection.launch("/interfaces/exploitAPI")
        if not hasIndex(self.interface, "ret") then return not (not clearInterface(self.interface)) //not (not) is for casting null to false, false to false, empty set to false, everything else to true.
        if @self.interface.ret isa funcRef or @self.interface.ret isa map then return not (not clearInterface(self.interface))
        ret = not (not @self.interface.ret)
        clearInterface(self.interface)
        return ret
    end function
    api.scanMetaLib = function(self, metaLib)
        clearInterface(self.interface)
        self.interface.ret = null
        self.interface.args = ["scanMetaLib", metaLib]
        if typeof(self.connection) == "shell" then self.connection.launch("/interfaces/exploitAPI")
        print("IF YOU SEE ANY WEIRD OUTPUT ABOVE (ESPECIALLY OVERFLOW PROMPT), OR IF YOUR TERMINAL WAS CLEARED (OUTPUT SHOULD ONLY BE A PROGRESS BAR, NOTHING MORE NOTHING LESS), IT MEANS THE SERVER WAS HACKED AND YOU NEED TO STOP USING THIS API RIGHT NOW, AND CONTACT DISCORD:rocketorbit IMMEDIATELY.")
        if hasIndex(self.interface, "ret") and @self.interface.ret != null and recursiveCheck(@self.interface.ret) then
            ret = @self.interface.ret
            clearInterface(self.interface)
            return ret
        end if
        clearInterface(self.interface)
        print("Server failed. Using local scan.")
        ret = {}
        ret.lib_name = lib_name(@metaLib)
        ret.version = version(@metaLib)
        ret.memorys = {}
        memorys = self.metaxploit.scan(@metaLib)
        for memory in memorys
            addresses = split(self.metaxploit.scan_address(@metaLib, memory), "Unsafe check:")
            ret.memorys[memory] = []
            for address in addresses
                if address == addresses[0] then continue
                value = address[indexOf(address, "<b>") + 3:indexOf(address, "</b>")].replace("\n", "")
                ret.memorys[memory] = ret.memorys[memory] + [value]
            end for
        end for
        return ret
    end function
    api.queryExploit = function(self, libName, libVersion)
        clearInterface(self.interface)
        if typeof(self.connection) != "shell" then return null
        self.interface.ret = null
        self.interface.args = ["queryExploit", libName, libVersion]
        self.connection.launch("/interfaces/exploitAPI")
        if not hasIndex(self.interface, "ret") then return clearInterface(self.interface)
        if not recursiveCheck(@self.interface.ret) then return clearInterface(self.interface)
        ret = @self.interface.ret
        clearInterface(self.interface)
        return ret
    end function
    api.getHashes = function(self)
        clearInterface(self.interface)
        if typeof(self.connection) != "shell" then return null
        self.interface.ret = null
        self.interface.args = ["getHashes"]
        self.connection.launch("/interfaces/exploitAPI")
        if not hasIndex(self.interface, "ret") then return clearInterface(self.interface)
        if not recursiveCheck(@self.interface.ret) then return clearInterface(self.interface)
        ret = @self.interface.ret
        clearInterface(self.interface)
        return ret
    end function
    //all api method end

    if not api.testConnection then print("unable to reach server. API is in local mode.")

    return api
end function
api = getCloudExploitAPI(metaxploit)
hashes = api.getHashes
if not hashes then exit("Server failed. Contact discord: rocketorbit.")

downloadLibs = function
    netSession = metaxploit.net_use(nslookup("www.CFTShrinker.org"), 22) //download libs from CFTShrinker
    if netSession then metaLib = netSession.dump_lib else metaLib = null
    if metaLib then remoteShell = metaLib.overflow("0xF8E54A6", "becolo") else remoteShell = null
    if typeof(remoteShell) != "shell" then exit("Server failed. Contact discord: rocketorbit.")
    download = remoteShell.scp("/Public/htdocs/downloads", "/root", shell)
    if typeof(download) == "string" then exit(download)
    if not shell.host_computer.File("/root/downloads/init1.0.0hm") then exit("Server failed. Contact discord: rocketorbit.")
    if not shell.host_computer.File("/root/downloads/net1.0.0df") then exit("Server failed. Contact discord: rocketorbit.")
    if not shell.host_computer.File("/root/downloads/libhttp1.1.6Hm") then exit("Server failed. Contact discord: rocketorbit.")
    if not shell.host_computer.File("/root/downloads/kernel_router1.9.2nc") then exit("Server failed. Contact discord: rocketorbit.")
end function

checkAccess = function(shell)
    folder = shell.host_computer.File("/root")
    if folder.has_permission("w") and folder.has_permission("r") and folder.has_permission("x") then return "root"
    return "guest"
end function

escalate = function(guestShell)
    payload = "
    hashes = get_custom_object.hashes
    get_custom_object.ret = null
    for hsh in hashes.values
        shell = get_shell(""root"", hsh)
        if typeof(shell) != ""shell"" then continue
        get_custom_object.ret = shell
        exit(hsh)
    end for
    "
    guestShell.host_computer.touch("/home/guest", "dddd.src")
    guestShell.host_computer.File("/home/guest/dddd.src").set_content(payload)
    guestShell.build("/home/guest/dddd.src", "/home/guest")
    interface = get_custom_object
    interface.ret = null
    interface.hashes = hashes
    guestShell.launch("/home/guest/dddd")
    if host_computer(@interface.ret) then return interface.ret
    return null
end function

hackPort = function(port)
    netSession = metaxploit.net_use("192.168.0.1", port)
    netSession = metaxploit.net_use("192.168.0.1", port)
    if not netSession then exit("Unknown error. Contact discord: rocketorbit.")
    metaLib = netSession.dump_lib
    if not metaLib then exit("Unknown error. Contact discord: rocketorbit.")
    exploits = api.queryExploit(metaLib.lib_name, metaLib.version)
    if not exploits then exploits = api.scanMetaLib(metaLib)
    if not exploits then exit("Unknown error. Contact discord: rocketorbit.")
    for e in exploits.memorys
        for value in e.value
            object = metaLib.overflow(e.key, value)
            if typeof(object) != "shell" then continue
            if checkAccess(object) != "root" then return escalate(object)
            return object
        end for
    end for
end function

hackRouter = function
    routerPort = hackPort(0)
    if not routerPort then routerPort = hackPort(8080)
    if not routerPort then exit("The home network you are using right now does not provide a shell exploit, therefore this script will not work. However this does not mean it is secured. If you have never tried to secure it and you got this prompt, delete this network on ConfigLan.exe and rent a new one.")
    return routerPort
end function

randomPassword = function
    pass = ""
    for i in range(14)
        pass = pass + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"[floor(rnd * 62)]
    end for
    return pass
end function

secureRouter = function(localShell, routerShell)
    init = localShell.host_computer.File("/root/downloads/init1.0.0hm")
    net = localShell.host_computer.File("/root/downloads/net1.0.0df")
    http = localShell.host_computer.File("/root/downloads/libhttp1.1.6Hm")
    router = localShell.host_computer.File("/root/downloads/kernel_router1.9.2nc")
    if (not init) or (not net) or (not http) or (not router) then exit("Unknown error. Contact discord: rocketorbit.")
    localShell.scp(init.path, "/lib", routerShell)
    localShell.scp(net.path, "/lib", routerShell)
    localShell.scp(http.path, "/lib", routerShell)
    localShell.scp(router.path, "/lib", routerShell)
    remoteInit = routerShell.host_computer.File("/lib/init1.0.0hm")
    remoteNet = routerShell.host_computer.File("/lib/net1.0.0df")
    remoteHttp = routerShell.host_computer.File("/lib/libhttp1.1.6Hm")
    remoteRouter = routerShell.host_computer.File("/lib/kernel_router1.9.2nc")
    if (not remoteInit) or (not remoteNet) or (not remoteHttp) or (not remoteRouter) then exit("Unknown error. Contact discord: rocketorbit.")
    remoteInit.move("/lib", "init.so")
    remoteNet.move("/lib", "net.so")
    remoteHttp.move("/lib", "libhttp.so")
    remoteRouter.move("/lib", "kernel_router.so")
    if routerShell.host_computer.File("/home") then routerShell.host_computer.File("/home").delete
    routerRootFolder = routerShell.host_computer.File("/")
    routerRootFolder.set_owner("root", true)
    routerRootFolder.set_group("root", true)
    routerRootFolder.chmod("o-rwx", true)
    routerRootFolder.chmod("g-rwx", true)
    routerRootFolder.chmod("u-rwx", true)
    routerShell.host_computer.change_password("root", randomPassword)
    return true
end function

main = function
    downloadLibs
    routerShell = hackRouter
    if not routerShell then exit("Unknown error. Contact discord: rocketorbit.")
    secureRouter(shell, routerShell)
    print("<b><color=red>S<color=orange>u<color=yellow>c<color=green>c<color=blue>e<color=#6f00FF>s<color=#8000FF>s</color></color></color></color></color></color></color><color=white>! You have secured your home network. This is the last step, enjoy hack free Grey Hack!</color></b>")
    if shell.host_computer.File("/root/downloads") then shell.host_computer.File("/root/downloads").delete
    if shell.host_computer.File(program_path) then shell.host_computer.File(program_path).delete
end function
main