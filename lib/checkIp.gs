checkIp = function(anyObject, targetIp, targetPort, currentRouter)
    if typeof(anyObject) != "shell" and typeof(anyObject) != "computer" and typeof(anyObject) != "file" then return null
    if not is_valid_ip(targetIp) then return null
    if typeof(targetPort) != "number" then return null
    if typeof(currentRouter) != "router" then return null
    if typeof(anyObject) == "shell" then return {"localIp":anyObject.host_computer.local_ip, "publicIp":anyObject.host_computer.public_ip, "router":get_router(anyObject.host_computer.public_ip)}
    if typeof(anyObject) == "computer" then return {"localIp":anyObject.local_ip, "publicIp":anyObject.public_ip, "router":get_router(anyObject.public_ip)}
    if is_lan_ip(targetIp) then return {"localIp":targetIp, "publicIp":currentRouter.public_ip, "router":currentRouter}
    targetRouter = get_router(targetIp)
    if not targetRouter then return null
    targetPortObject = targetRouter.ping_port(targetPort)
    if targetPortObject then return {"localIp":targetPortObject.get_lan_ip, "publicIp":targetIp, "router":targetRouter}
    return {"localIp":targetRouter.local_ip, "publicIp":targetIp, "router":targetRouter}
end function