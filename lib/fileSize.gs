fileSize = function(bytes) //translate byte to kb and mb
    bytes = bytes.to_int
    i = 0
    units = ["B","KB","MB","GB","TB","PT"]
    while bytes > 1024
        bytes = bytes / 1024
        i = i + 1
    end while
    return round(bytes, 2) + units[i]
end function