scanLib = function(metaLib, metaxploit)
    if not metaLib then return null
    if not metaxploit then metaxploit = globals.metaxploit
    ret = {}
    ret.lib_name = metaLib.lib_name
    ret.version = metaLib.version
    ret.memorys = {}
    memorys = metaxploit.scan(metaLib)
    for memory in memorys
        addresses = metaxploit.scan_address(metaLib, memory).split("Unsafe check:")
        ret.memorys[memory] = []
        for address in addresses
            if address == addresses[0] then continue
            value = address[address.indexOf("<b>")+3:address.indexOf("</b>")]
            value = value.replace("\n", "")
            ret.memorys[memory] = ret.memorys[memory] + [value]
        end for
    end for
    return ret
end function