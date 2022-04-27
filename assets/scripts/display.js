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

                for(let data of liveData){
                    colour = 255-(data["Devices"]*20)
                    ctx.fillStyle = 'rgb('+colour+','+0+','+0+')';
                    ctx.fillRect(data["X"], data["Y"], data["Width"], data["Height"]);
                    console.log(data["X"], data["Y"], data["Width"], data["Height"]);
                }
                ctx.stroke();getRecordedOn
                $('#recOnTxt').html(getRecordedOn(liveData[liveData.length-1]))
                console.log(getRecordedOn(liveData[liveData.length-1]))
              
            }
        }

        xhttp.open("GET", "/getAPInfo", false);
        xhttp.send();
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