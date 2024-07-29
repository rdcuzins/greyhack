import_code("allFiles.gs")

find = function(fileName, fileObject) //find files under a dir
    founded = []
    files = allFiles(fileObject)
    for file in files
        if lower(file.name).indexOf(lower(fileName)) != null then founded = founded + [file]
    end for
    return founded
end function