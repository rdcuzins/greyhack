absolutePath = function(rPath, cPath) //current path + relative path = absolute path
    if rPath.len == 0 then return print("invalid path.")
    if rPath[0] == "/" then return rPath
    if cPath.len == 0 then return print("invalid path.")
    if not cPath[0] == "/" then return print("invalid path.")
    if not cPath[-1] == "/" then cPath = cPath + "/"
    absPath = cPath + rPath
    while absPath.len > 1 and absPath[-1] == "/"
        absPath = absPath[:-1]
    end while
    return absPath
end function