import subprocess

print(subprocess.check_output(("ipconfig")).decode("ascii"))