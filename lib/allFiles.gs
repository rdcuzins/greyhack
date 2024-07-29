allFiles = function(fileObject, maxDepth = -1)
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