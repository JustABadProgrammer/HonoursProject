$(document).ready(function () {
    
    $('#dataInput').fadeIn(300);


    $(".submit").click(function () {

        var loc = $(this).attr('id')

        var num = $('input').val();

        //WILL CHANGE TO GET REASONABLE NUMBER FROM DATABASE
        var reasonable = 10;

        if(num != '' && num < reasonable){
            console.log(loc + " - " + num)

            //Loc will then be the ID of a row in a database
            //The assosicated number with this ID will be updated with the num value

            //Nicename will be taken from database
            var niceName = loc.split("_")[0] 

            var output = niceName + " will be updated with " + num + " visitors"
            
            $('#text').text(output);

            $('#dataInput').fadeOut('slow');
            $('#dataInput').promise().done(function(){
                $("#muchThank").fadeIn(300);
            });
        }else{
            alert("No Trolling :)")
        }
        
    });

});