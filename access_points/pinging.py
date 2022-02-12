#from pymongo import MongoClient
import pymongo
import time
import sys
import subprocess
from datetime import datetime

#Connect to db
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
db = myclient["HonoursProject"]


def pinging(adr):
    dev = 0
    active = []
    disactive = []

    #Gets the adresses of all the devices assigned to this router
    arpa = subprocess.check_output(("arp", "-a")).decode("ascii") 


    #Splits the returned text into an array and removes the router ips
    adresses = [x for x in arpa.split('\n') if adr in x and  all(y not in x for y in ['192.168.1.1 ','192.168.1.255']) ]

    #Get all the adresses in the arp - a output
    #Extract all the ip adrresses present
    #Then ping them all to ensure they are still active
    for ar in adresses:
        try:
            stri = ar.split(" ")[2]
            if "Internet" not in stri and "---" not in stri:
                command=['ping', '-n', '1','-w','100', stri]
                if subprocess.call(command) == 0:
                    dev+=1
                    print("Success")
                    active.append(ar)
                else:
                    disactive.append(ar)
        except:
            print("")

    """
    print("\n\n")
    print("DEVICES ACTIVE - " + str(dev))
    print("\n\n"+"ACTIVE")
    for ar in active:
        print(ar)
    print("\n\n"+"DISACTIVE")
    for ar in disactive:
        print(ar)
    """
    return dev

#Looping infinately
while(True):
    #Get information for each router saved in the database and loop through them
    for x in db["AccessPointInfo"].find():
        #Pull information from json
        ip = x["ip"]
        locID = x["Location_ID"]
        location = x["Location"]

        #Call pinging method to gather number of devices
        devices = pinging(ip)

        #Get the current date and time in a format for storing
        now = datetime.now()
        date = now.strftime("%d-%b-%Y")
        Time = now.strftime("%H:%M:%S")

        #Insert the device information to the all time information storage 
        mydict = { "Location": location, "Devices": devices, "Date":date,  "Time":Time }
        x = db["PastAccessPointInformation"].insert_one(mydict)

        #Update the current information that will be used regularly by the site
        filter = {"Location_ID":locID}
        newvalues = { "$set": { "Location": location, "Devices": devices, "Date":date,  "Time":Time, "Location_ID":locID } }
        db["CurrentAccessPointInformation"].update_one(filter, newvalues)

        #print(devices)

    #Wait for 60 seconds before repeating
    for i in range(60,0,-1):
        sys.stdout.write(str(i)+' ')
        sys.stdout.flush()
        time.sleep(1)
    #time.sleep(60)
