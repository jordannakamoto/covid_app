/* home.js */

/* hold alert data clientside */
var newAlerts = [];
var inprogressAlerts = [];

/* hold completoin data clientside */
var completed;
var expected;
var awaiting;

function populateAlerts(){
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
             $('#alerts-widget .widget-sub-text').text("None In Progress");
            }
        else{
            $('#alerts-widget .widget-sub-text').addClass("are-inprogress");
            $('#alerts-widget .widget-sub-text').text(inprogressAlerts.length + " In Progress");
         }
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
}


function populateCompletion(){
    // get expected users for today
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/users/expected",
      dataType : 'json',
      success : function(data) {
         expected = data;
         completed = getCompleted(data);
         getAwaiting();
         updateCompletion();
         updateDashTable();
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    // get completed users for today
    function getCompleted(results){
        return results.filter(user => user.state != "expected");
    }
    // generate awaiting -> expected - completed
    function getAwaiting(){
        awaiting = expected.filter(n => !completed.includes(n))
        console.log(awaiting);
    }
    // update completion widget
    function updateCompletion(){
        var percent = completed.length/expected.length * 100;
        percent = Math.round(percent);
        $('#completion-widget .widget-med-num').text(percent + '%');
        $('#completion-widget .widget-sub-text').text(  completed.length + '/' + expected.length + ' Employees');
    }
    // update dash table
    function updateDashTable(){
        for(i = 0; i < completed.length; i++)
            $('#completed ul').append('<li>' + completed[i].name.First + " " + completed[i].name.Last + '</li>')
        for(i = 0; i < awaiting.length; i++)
        $('#awaiting ul').append('<li>' + awaiting[i].name.First + ' ' + awaiting[i].name.Last + '</li>')
    }
}

populateAlerts();
populateCompletion();

/* Events */

//Mouse

$('#completion-widget').on("mouseover", function(){
    $('#completion-panel').fadeIn(300);
})