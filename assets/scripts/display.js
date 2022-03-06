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

                    var loi = info["Left_On_Img"];
                    var toi = info["Top_On_Img"];

                    var infoLoi = 50;
                    if(loi >75){
                        infoLoi = -300;
                    }
                    var infoToi = 50;
                    if(toi >75){
                        infoToi = -180;
                    }

                    var div = '<div class="infoDiv" id="info_' + info["Venue_Name"] + '"  style="display:none; left:' + infoLoi + 'px; top:' + infoToi + 'px;">'
                    div += '<img src="images/' + info["Venue_Name"] + '.png" class="venueImageInfo">'
                    div += '<h2>Current Capacity : ' + info["Capacity"] + '</h2>'
                    div += '<h4>'+getRecordedOn(info)+'</h4></br>'
                    div += '</div>'
                    venuesDiv.set(info["Venue_Name"], div);
                    //divCode += div;
                    //   console.log(info["Venue_Name"])

                    console.log(info)
                    console.log(info["Left_On_Img"])
                    var imgDiv = '<div id="' + info["Venue_Name"] + 'Div" class="imgDiv" style="left:' + loi + '%; top:' + toi + '%">'
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

    function getRecordedOn(e){
        return 'Recorded on : ' + e["Time"] + ",   " + e["Date"]
    }

    function getAPInfo() {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {

            if (this.readyState == 4 && this.status == 200) {


                liveData = JSON.parse(this.responseText);

                var c = document.getElementById("MaskDrawing");
                var ctx = c.getContext("2d");
                ctx.beginPath();

                console.log(liveData)
                for(let data of liveData){
                    //ctx.fillRect(20, 20, 10, 10);
                  //  ctx.fillStyle = "rgb(120,0,0)";
                  rgb = 'rgb(('+data["Devices"]+'*20),0,0)';
                  console.log(rgb)
                  var r = data["Devices"] * 20
                  var g = 0
                  var b = 0
                    ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
                    ctx.fillRect(data["X"], data["Y"], data["Width"], data["Height"]);
                    console.log(data["X"], data["Y"], data["Width"], data["Height"]);
                }
                ctx.stroke();getRecordedOn
                $('#recOnTxt').html(getRecordedOn(liveData[liveData.length-1]))
                console.log(getRecordedOn(liveData[liveData.length-1]))
               // $('#recOnTxt').html(liveData[liveData.length-1][""])
                /*
                var points = []

                for (var i = 0; i < liveData.length; i++) {
                    console.log(liveData[i])
                    var point = {
                        xPos: liveData[i]["Left_On_Img"],
                        yPos: liveData[i]["Top_On_Img"],
                        value: (parseInt(liveData[i]["Devices"]) * 5)
                    }
                    points.push(point)
                    console.log(point)
                }

                
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
                
                var apDiv = "";

                for (var i = 0; i < liveData.length; i++) {
                    apDiv += '<div id="'+liveData[i]["Location_ID"]+'"></div>';
                }
               // $("#heatmap").html(apDiv);

                for (var i = 0; i < liveData.length; i++) {                    
                    getAP(liveData[i]["Location_ID"])
                }

                //$("#heatmap").html(divCode);
                */
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

        if (lastShown === "") {
        } else {
            $(lastShown).hide();
            lastShown = "";
        }

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