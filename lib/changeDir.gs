changeDir = function(toPath, fileObject) //go to another dir
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
    for p in toPath
        found = false
        for f in fileObject.get_folders
            if not f.name == p then continue
            found = true
            fileObject = f
            break
        end for
        if not found then return print("Folder not found.")
    end for
    if not fileObject.is_folder then return print("Folder not found.")
    return fileObject
end function