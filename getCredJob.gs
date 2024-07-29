if params.len != 1 or params[0] != #envar ZSH_PASS then exit 
EMAIL = #envar EMAIL
EMAIL_PASS = #envar EMAIL_PASS

import_code("/lib/scanLib.gs")
import_code("/lib/checkAccess.gs")
import_code("/lib/toFile.gs")
import_code("/lib/getFile.gs")

metaMail = mail_login(EMAIL, EMAIL_PASS)
metax = include_lib("/lib/metaxploit.so")

mails = metaMail.fetch

getAdminEmail = function(pubIP)
  who = whois(pubIP).split(char(10))
  return who[2][who[2].indexOf(":")+2:]
end function

getAnyTarget = function(pubIP, privIP)
  netSesh = metax.net_use(pubIP, 0)
  netSesh = metax.net_use(pubIP, 0)
  metaLib = netSesh.dump_lib
  exploits = scanLib(metaLib, metax)
  results = []
  for e in exploits.memorys
    for value in e.value
      object = metaLib.overflow(e.key, value, privIP)
      if (typeof(object) != "shell") and (typeof(object) != "computer") and (typeof(object) != "file") then continue
      
      user = checkAccess(toFile(object))
      if user != "guest" and user != "root" then return user
      people = getFile("/home", toFile(object)).get_folders
      for p in people
        if p.name == "guest" or p.name == "root" then continue
        return p.name
      end for
    end for
  end for
  return "NIL"
end function

targets = []
for mail in mails
  segments = mail.split(char(10))
  item = {}
  item.mailId = segments[2][8:]
  item.from = segments[3][6:]
  item.subject = segments[4][9:]
  item.preview = segments[5:8]
  if item.subject != "Mission Contract" then continue
  if item.preview[0][21:38] != "login credentials" then continue
  contents = metaMail.read(item.mailId).split(char(10))
  who = contents[3][contents[3].indexOf("<b>")+3:contents[3].indexOf("</b>")]
  csplit = contents[4].split("\. ")
  pubIP = csplit[0][csplit[0].indexOf("<b>")+3:csplit[0].indexOf("</b>")]
  privIP = csplit[2][csplit[2].indexOf("<b>")+3:csplit[2].indexOf("</b>")]
  if (who.len > 15) then who = getAnyTarget(pubIP, privIP)
  target = {"id": item.mailId, "who": who, "pubIP": pubIP, "privIP": privIP, "admin": getAdminEmail(pubIP)}
  targets.push(target)
end for



clear_screen
for target in targets 
  print("=======================")
  print("= ("+target.pubIP+") =")
  print(target.admin)
  print(target.who)
  print("=======================")
  print("")
end for