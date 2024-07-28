libFiles = ["metaxploit.so", "crypto.so", "librshell.so"]
binFiles = ["AdminMonitor.exe", "sniffer", "decipher", "zsh", "dropper", "top"]

total = 0
localShell = get_shell
creds = params[0].split(":")
remoteShell = localShell.connect_service(creds[0], 22, "root", creds[1])

for libFile in libFiles
  file = "/lib/" + libFile
  print("Uploading file: " + file)
  upload = localShell.scp(file, "/lib", remoteShell)
  if typeof(upload) == "string" then
    print(upload)
  else
    total = total + 1
  end if
end for

for binFile in binFiles
  file = "/root/" + binFile
  print("Uploading file: " + file)
  upload = localShell.scp(file, "/root", remoteShell)
  if typeof(upload) == "string" then
    print(upload)
  else
    total = total + 1
  end if
end for

print("Finished uploading " + total + " files.")