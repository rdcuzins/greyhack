import_code("allFiles.gs")
import_code("getFile.gs")

corruptLog = function(fileObject) //overwrite system.log by copy the smallest file to that dir
    if not fileObject then fileObject = globals.current.folder
    while fileObject.parent
        fileObject = fileObject.parent
    end while
    files = allFiles(fileObject, 3)
    toCopy = null
    for file in files
        if file.is_folder or (not file.has_permission("r")) then continue
        if not toCopy then toCopy = file
        if val(file.size) < val(toCopy.size) then toCopy = file
    end for
    if not toCopy then return print("No file to overwrite log! try using ""touch"".")
    logFile = getFile("/var/system.log", fileObject)
    if not logFile then return print("log file not found!")
    tryDelete = logFile.delete
    if tryDelete == "" then print("Log file deleted.") else return print("Error: " + tryDelete)
    tryCopy = toCopy.copy("/var", "system.log")
    if tryCopy == true then return print("All steps done. Log cleared.")
    return print(tryCopy)
end function