getFile = function(toPath, fileObject) //changeDir only support folder but this works for both
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