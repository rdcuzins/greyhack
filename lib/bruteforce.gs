bruteforce = function(length, charset, username)
    toDo = [""]
    while toDo
        item = toDo.pop
        for chr in charset
            newItem = item + chr
            if get_shell(username, newItem) then return get_shell(username, newItem)
            if newItem.len < length then toDo.push(newItem)
        end for
    end while
    return null
end function