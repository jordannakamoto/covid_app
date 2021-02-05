/* home.js */

/* hold alert data clientside */
var newAlerts = [];
var inprogressAlerts = [];

function populateAlerts(){
    var htmlStr;
    // get and clone newAlerts array
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/alerts/new",
      dataType : 'json',
      success : function(data) {
        for(i = 0; i < data.length; i++){
            var elem = data[i];
            newAlerts.push(elem);
        }
        if(newAlerts.length < 1){
            $("#alerts-widget").addClass("no-new");
        }
        else
            $("#alerts-widget").removeClass("no-new");
        $('#alerts-widget .widget-big-num').text(newAlerts.length);
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    // get and clone inprogressAlerts array
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/alerts/inprogress",
      dataType : 'json',
      success : function(data) {
         for(i = 0; i < data.length; i++){
            var elem = data[i];
                        var elem = data[i];
            inprogressAlerts.push(elem);
        }
        if(inprogressAlerts.length < 1){
             $('#alerts-widget .widget-sub-text').removeClass("are-pending"); // TODO rename this
             $('#alerts-widget .widget-sub-text').text("None In Progress");
            }
        else
            $('#alerts-widget .widget-sub-text').text(inprogressAlerts.length + " In Progress");
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
}

populateAlerts();
