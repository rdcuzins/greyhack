if params.len != 1 or params[0] != #envar PROXY_PASS then exit 

libs = {}
libs.getFile = function(toPath, fileObject) //changeDir only support folder but this works for both
    if not fileObject then fileObject = globals.current.folder
    while fileObject.parent
        fileObject = fileObject.parent
    end while
    if toPath.len == 0 then return print("File not found.")
    while (toPath.len > 1) and (toPath[-1] == "/") //trim end "/"
        toPath = toPath[:-1]
    end while
    while (toPath.len > 1) and (toPath[0] == "/") //trim start "/"
        toPath = toPath[1:]
    end while
    if toPath == "/" then return fileObject
    toPath = toPath.split("/")
    for i in toPath.indexes
        found = false
        if i == (toPath.len - 1) then
            for f in fileObject.get_folders + fileObject.get_files
                if not f.name == toPath[i] then continue
                return f
            end for
            return print("File not found")
        end if
        for f in fileObject.get_folders
            if not f.name == toPath[i] then continue
            found = true
            fileObject = f
            break
        end for
        if not found then return print("File not found.")
    end for
    return fileObject
end function
libs.allFiles = function(fileObject, maxDepth = -1)
    if fileObject.is_folder then total = {"ret":[fileObject], "stack":[maxDepth, fileObject]} else return [fileObject]
    while total.stack
        c = {"folder":total.stack.pop, "maxDepth":total.stack.pop}
        if c.maxDepth then total.ret = total.ret + c.folder.get_folders + c.folder.get_files else continue
        folders = c.folder.get_folders
        for i in range(len(folders) - 1)
            if folders then [total.stack.push(c.maxDepth - 1), total.stack.push(folders[i])] else break
        end for
    end while
    return total.ret
end function

libs.corruptLog = function(fileObject) //overwrite system.log by copy the smallest file to that dir
    files = self.allFiles(fileObject, 3)
    toCopy = null
    for file in files
        if file.is_folder or (not file.has_permission("r")) then continue
        if not toCopy then toCopy = file
        if val(file.size) < val(toCopy.size) then toCopy = file
    end for
    if not toCopy then return print("No file to overwrite log! try using ""touch"".")
    logFile = self.getFile("/var/system.log", fileObject)
    if not logFile then return print("log file not found!")
    tryDelete = logFile.delete
    if tryDelete == "" then print("Log file deleted.") else return print("Error: " + tryDelete)
    tryCopy = toCopy.copy("/var", "system.log")
    return tryCopy
end function

secure = function(rootFolder)
    if not rootFolder then return print("/ not found.")
    rootFolder.set_group("root", true)
    rootFolder.set_owner("root", true)
    rootFolder.chmod("u-rwx", true)
    rootFolder.chmod("g-rwx", true)
    rootFolder.chmod("o-rwx", true)
end function

proxies = (#envar PROXIES).split(",")

shell = get_shell

for proxy in proxies
  creds = proxy.split(":")
  ip = creds[0]
  pass = creds[1]
  shell = shell.connect_service(ip, 22, "root", pass)
  rootDir = shell.host_computer.File("/")
  secure(rootDir)
  corrupted = libs.corruptLog(rootDir)
  if corrupted != 1 then return print("Failed to corrupt logs.")
end for

print("Proxy Hops: " + proxies.len)
shell.start_terminal