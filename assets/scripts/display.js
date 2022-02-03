$(document).ready(function () {
console.log("Cum")
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("DataTime")
            //On getting information from db

            liveData = JSON.parse(this.responseText);
            console.log(liveData)

            var divCode = "";
            for(var i = 0; i < liveData.length; i++){
                info = liveData[i];
                var div = '<div class="infoDiv" id="info_'+info["Venue_Name"]+'">'
                div+='<img src="images/'+info["Venue_Name"]+'.png" class="venueImage">'
                div+='<h2>Current Capacity : ' + info["Capacity"] + '</h2>'
                div+='<h4>Recorded on : ' + info["Time"] + " " + info["Date"] + '</h4></br>'
                divCode+=div;
                console.log(div)
            }
            $("#venueInformation").html(divCode);
        
        }

    }

    xhttp.open("GET", "/getLiveVenueInfo", false);
    xhttp.send();


});