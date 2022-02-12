$(document).ready(function () {

    getVenues();
    getAPInfo();
    function getVenues(){
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("DataTime")
                //On getting information from db

                liveData = JSON.parse(this.responseText);
                console.log(liveData)

                var divCode = "";
                for (var i = 0; i < liveData.length; i++) {
                    info = liveData[i];
                    var div = '<div class="infoDiv" id="info_' + info["Venue_Name"] + '">'
                    div += '<img src="images/' + info["Venue_Name"] + '.png" class="venueImage">'
                    div += '<h2>Current Capacity : ' + info["Capacity"] + '</h2>'
                    div += '<h4>Recorded on : ' + info["Time"] + " " + info["Date"] + '</h4></br>'
                    divCode += div;
                    console.log(div)
                }
                $("#venueInformation").html(divCode);

            }

        }

        xhttp.open("GET", "/getLiveVenueInfo", false);
        xhttp.send();
    }


    function getAPInfo() {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {
                
                console.log
                liveData = JSON.parse(this.responseText);
                console.log(liveData)

                for (var i = 0; i < liveData.length; i++) {
                    divCode = '<div id="'+liveData[i]["Location_ID"]+'"></div>';
                }
                $("#heatmap").html(divCode);

                for (var i = 0; i < liveData.length; i++) {                    
                    getAP(liveData[i]["Location_ID"])
                }
                //$("#heatmap").html(divCode);
            }
        }

        xhttp.open("GET", "/getAPInfo", false);
        xhttp.send();
    }

    function getAP(apID) {

        myData = {
            Location_ID: apID
        }

        $.ajax({
            url: "/getAPCurrentInfo", // Url of backend (can be python, php, etc..)
            type: "POST", // data type (can be get, post, put, delete)
            data: myData, // data in json format
            async: true,
            success: function (response, textStatus, jqXHR) {
                arrObj = JSON.parse(response);

                info = arrObj[0];
                console.log(arrObj)
                var div = '<div class="infoDiv" id="info_' + info["Venue_Name"] + '">'
                // div+='<img src="images/'+info["Venue_Name"]+'.png" class="venueImage">'
                div += '<h1>Location : ' + info["Location"] + '</h2>'
                div += '<h2>Current Capacity : ' + info["Devices"] + '</h2>'
                div += '<h4>Recorded on : ' + info["Time"] + " " + info["Date"] + '</h4></br>'
                console.log(div)
                $("#"+apID).html(div);
                return div;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                return "error";
            }
        });

    }
});