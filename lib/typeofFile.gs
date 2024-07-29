typeofFile = function(fileObject)
    if not typeof(fileObject) == "file" then return null
    if fileObject.is_folder then return "fld"
    if fileObject.is_binary then return "bin"
    return "txt"
end function