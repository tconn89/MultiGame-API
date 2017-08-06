import sys
import time
dataToSendBack = "Hello World"

print(dataToSendBack)

time.sleep(2)
print("after 2 seconds")

time.sleep(2)
print("after 4 seconds")
sys.stdout.flush()