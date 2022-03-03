let venuesDiv = new Map();
$(document).ready(function () {
    getVenues();
    getAPInfo();
    function getVenues() {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("DataTime")
                //On getting information from db

                liveData = JSON.parse(this.responseText);
                console.log(liveData)

                var divCode = "";
                for (var i = 0; i < liveData.length; i++) {
                    var info = liveData[i];
                    //  console.log(info)
                    var div = '<div class="infoDiv" id="info_' + info["Venue_Name"] + '"  style="display:none;">'
                    div += '<img src="images/' + info["Venue_Name"] + '.png" class="venueImageInfo">'
                    div += '<h2>Current Capacity : ' + info["Capacity"] + '</h2>'
                    div += '<h4>Recorded on : ' + info["Time"] + " " + info["Date"] + '</h4></br>'
                    div += '</div>'
                    venuesDiv.set(info["Venue_Name"], div);
                    //divCode += div;
                    //   console.log(info["Venue_Name"])

                    console.log(info)
                    console.log(info["Left_On_Img"])
                    var imgDiv = '<div id="' + info["Venue_Name"] + 'Div" class="imgDiv" style="left:' + info["Left_On_Img"] + '%; top:' + info["Top_On_Img"] + '%">'
                    imgDiv += '<img src="images/' + info["Venue_Name"] + '.png" id="' + info["Venue_Name"] + '"class="venueImage">';
                    imgDiv += div;
                    imgDiv += '</div>'

                    console.log("IMG DIV")
                    console.log(imgDiv)
                    divCode += imgDiv;
                }
                $("#data").append(divCode);

            }

        }

        xhttp.open("GET", "/getLiveVenueInfo", false);
        xhttp.send();
    }


    function getAPInfo() {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {

                var heatmapInstance = h337.create({
                    // only container is required, the rest will be defaults
                    container: document.querySelector('#heatmapContainer')
                });

                liveData = JSON.parse(this.responseText);

                var points = []

                for (var i = 0; i < liveData.length; i++) {
                    var point = {
                        x: liveData[i]["Left_On_Img"],
                        y: liveData[i]["Top_On_Img"],
                        value: (parseInt(liveData[i]["Devices"]) * 5)
                    }
                    points.push(point)
                    console.log(point)
                }

                var data = {
                    max: 0,
                    data: points
                }

                heatmapInstance.setData(data);
                /*
                var apDiv = "";

                for (var i = 0; i < liveData.length; i++) {
                    apDiv += '<div id="'+liveData[i]["Location_ID"]+'"></div>';
                }
               // $("#heatmap").html(apDiv);

                for (var i = 0; i < liveData.length; i++) {                    
                    getAP(liveData[i]["Location_ID"])
                }*/

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
                var div = '<div class="infoDiv" id="info_' + info["Venue_Name"] + '">'
                // div+='<img src="images/'+info["Venue_Name"]+'.png" class="venueImage">'
                div += '<h1>Location : ' + info["Location"] + '</h2>'
                div += '<h2>Current Capacity : ' + info["Devices"] + '</h2>'
                div += '<h4>Recorded on : ' + info["Time"] + " " + info["Date"] + '</h4></br>'
                $("#" + apID).html(div);
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

    $(document).click(function () {
        console.log("Click");
        if (lastShown === "") {
        } else {
            $(lastShown).hide();
            lastShown = "";
        }
    });

    var lastShown = "";

    $(".venueImage").click(function (e) {
        e.stopPropagation();
        var imgID = '#info_' + this.id;

        if ($(imgID).is(':visible')) {
            $(imgID).hide();
            lastShown = "";
        } else {
            $(imgID).show();
            lastShown = imgID;
        }

        console.log("CLICK")
        console.log(this)
    });
});