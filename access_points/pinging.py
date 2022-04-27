import pymongo
import time
import sys
import os
from datetime import datetime

#Connect to db
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
db = myclient["HonoursProject"]

def angryPing(adr, WiFi):
    
    #Create command to open AngryIP scanner
    #Opens sets the range to be the adress range in the database
    #Adds commands to start imediately and close the GUI when it is finished
    #Save output to log.txt

    #oos.system(f'''cmd /c "netsh wlan connect name={WiFi}"''')

    filepath = os.path.dirname(os.path.realpath(__file__))
    command = "\""+filepath+'\ipscan-win64-3.8.2.exe\" -o log.txt -f:range '+adr+' -q -s'
    #Run command through system
    os.system(command)
    
    #Open the output file and save it as a string
    f = open(filepath + "\log.txt", "r")
    logStr = f.read()
    print(logStr)
    #Count the number of devices by counting the number of occurences of the string ms (meaning miliseconds)
    devices = logStr.count("ms")
    print("Devices Connected - " + str(devices))
    return devices


#Looping infinately
while(True):
    #Get information for each router saved in the database and loop through them
    for x in db["CurrentAccessPointInformation"].find():
        
        #Pull information from json
        locID = x["Location_ID"]
        location = x["Location"]

        #Call pinging method to gather number of devices
        devices = angryPing(x["range"], x["WiFi"])

        #Get the current date and time in a format for storing
        now = datetime.now()
        date = now.strftime("%d-%b-%Y")
        Time = now.strftime("%H:%M:%S")

        x["Devices"] = devices
        #Insert the device information to the all time information storage 
        mydict = { "Location": location, "Devices": devices, "Date":date,  "Time":Time }
        db["PastAccessPointInformation"].insert_one(mydict)

        #Update the current information that will be used regularly by the site
        updateDict = {"Devices": devices, "Date":date,  "Time":Time }
        filter = {"Location_ID":locID}
        newvalues = { "$set": updateDict }
        db["CurrentAccessPointInformation"].update_one(filter, newvalues)
        print("\n")


    #Wait for 180 seconds before repeating
    for i in range(180,0,-1):
        sys.stdout.write(str(i)+' | ')
        sys.stdout.flush()
        time.sleep(1)
    #time.sleep(60)
