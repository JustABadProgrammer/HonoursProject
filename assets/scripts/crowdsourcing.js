
$(document).ready(function () {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const loc = urlParams.get('Name');

    var reasonable = 0;
    var niceName = loc;

    var obj = null;
    console.log(loc);

    var curVenue = {
        Venue_Name:loc
    }

    $.ajax({
        url: "/getVenueInfo", // Url of backend (can be python, php, etc..)
        type: "POST", // data type (can be get, post, put, delete)
        data: curVenue, // data in json format
        async: true,
        success: function (response, textStatus, jqXHR) {
            arrObj = JSON.parse(response);

            obj = arrObj[0];

            console.log(obj)

            niceName = obj["Name"];
            document.title = niceName;
            $("#LogoImage").attr("src", "images/" + loc + ".png");
            $('#dataInput').fadeIn(300);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });




    $(".submit").click(function () {

        var num = $('input').val();

        //WILL CHANGE TO GET REASONABLE NUMBER FROM DATABASE
        var reasonable = 10;

        if (num != '' && num < reasonable) {
            console.log(loc + " - " + num)

            //Loc will then be the ID of a row in a database
            //The assosicated number with this ID will be updated with the num value

            //Nicename will be taken from database

            var output = niceName + " will be updated with " + num + " visitors"

            var strMonth = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

            $('#text').text(output);

            var today = new Date();
            var date = today.getDate()+"-"+strMonth[today.getMonth()]+"-"+today.getFullYear();
            var time = today.getHours() + ":" + today.getMinutes();

            var formData = {
                Venue_Name: loc,
                Name: niceName,
                Capacity: num,
                Date: date,
                Time: time
            };

            $.ajax({
                url: "/updateVenue", // Url of backend (can be python, php, etc..)
                type: "POST", // data type (can be get, post, put, delete)
                data: formData, // data in json format
                async: true, // enable or disable async (optional, but suggested as false if you need to populate data afterwards)
                success: function (response, textStatus, jqXHR) {
                    console.log("Poggers");
                    $('#dataInput').fadeOut('slow');
                    $('#dataInput').promise().done(function(){
                        $("#muchThank").fadeIn(300);
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });

            
        } else {
            alert("No Trolling :)")
        }


    });

});