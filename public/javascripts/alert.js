/* alert.js */

/* hold alert data clientside */
var newAlerts = [];
var inprogressAlerts = [];
var completedAlerts = [];
var currentTable;
var selectedAlertData = [];   // holds 0 - alert, 1 - alertArray, 2 - alertIndex

var date = new Date(Date.now());
var formatted_date = formatted_date = date.toLocaleString('en-us', {weekday:'long'}) + " " + (date.getMonth() + 1) + "/" + date.getDate();

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
            var date = elem.date;
            newAlerts.push(elem);
            // format answers
            var answersString;
            answersString = "<h5>Testing:</h5>";
            answersString += '<p>' + elem.answers[1] + '</p>';
            answersString += "<h5>Exposure:</h5>";
            answersString += '<p>' + elem.answers[2] + '</p>';
            answersString += "<h5>Temperature:</h5>";
            answersString += '<p>' + elem.answers[3] + '</p>';
            answersString += "<h5>Symptoms:</h5>";
            answersString += '<p>' + elem.answers[4] + '</p>';
            answersString += "<h5>Travel outside CA:</h5>";
            answersString += '<p>' + elem.answers[5] + '</p>';
            
            
            htmlStr = '<div data-id="'+elem._id+'" class="alert">';
            htmlStr += '\t<div class="alert-body">\n'
            // Add date tag
            if (date == formatted_date){
                htmlStr += '\t\t<div class="alert-date today">Today</div>'
            }
            else
                htmlStr += '\t\t<div class="alert-date">' + date + '</div>'
            
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + '  :  '
            htmlStr += elem.user.phone
            htmlStr += '\t<div  class="move-btn">🡆</div>' // End Alert Body
            htmlStr += '\t<div class="alert-answers">' + answersString + '</div></div>'
            $("#table-new").append(htmlStr);
        }
        setupSlider();
        refreshCount();
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
            var date = elem.date;
            inprogressAlerts.push(elem);
            
            htmlStr = '<div data-id="'+elem._id+'" class="alert">';
            // if (date == formatted_date){
                // htmlStr += '\t<div class="alert-date today">Today</div>'
            // }
            // else
                // htmlStr += '\t<div class="alert-date">' + date + '</div>'
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + '  :  '
            htmlStr += elem.user.phone
            htmlStr += '<div  class="move-btn">🡆</div></div>'
            $("#table-inprogress").append(htmlStr);
        }
        refreshCount();
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
     // get and clone completed array
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/alerts/completed",
      dataType : 'json',
      success : function(data) {
        for(i = 0; i < data.length; i++){
            var elem = data[i];
            var date = elem.date;
            completedAlerts.push(elem);
            
            htmlStr = '<div data-id="'+elem._id+'" class="alert">';
            if (date == formatted_date){
                htmlStr += '\t<div class="alert-date today">Today</div>'
            }
            else
                htmlStr += '\t<div class="alert-date">' + date + '</div>'
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + '  :  '
            htmlStr += elem.user.phone
            htmlStr += '<div  class="move-btn">🡆</div></div>'
            $("#table-completed").append(htmlStr);
        }
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
}

populateAlerts();


/* Alert DOM events */
var selectedAlert;
var lastSelectedAlert;

setTimeout(function(){
setMouseEvents();

$(".alert").mouseleave(function(){
  $(this).removeClass("alert-hovered")
  $(this).find('.move-btn').css("opacity","0");
  selectedAlert = null;
  lastSelectedAlert = $(this);
});

$(".move-btn").mouseover(function(){
  $(this).css("opacity","1");
  selectedAlert = $(this).parent;
  // selectedAlert.addClass("alert-hovered")
});

function setMouseEvents(){
      $(".alert").off("mouseover");
      $(".alert").on("mouseover", function(){
      $(this).addClass("alert-hovered");
      selectedAlert = $(this);
    });
    
    $('#note').click(function(e){
        e.stopPropagation();
    })
    // ALERT CLICK
    $(".alert").click(function(e){
        e.stopPropagation();
        $('.alert').removeClass('selected');
        $('.alert').css('opacity','.2');
        $(this).css('opacity','1'); 
        $(this).find('.alert-answers').slideDown(); 
          var id = $(this).data("id");
          // Search for alert by the DOM element's data-id
          for(_alert in newAlerts){
              if(newAlerts[_alert]._id == id){
                 var user = newAlerts[_alert].user;
                 selectedAlertData[0] = newAlerts[_alert];
                 selectedAlertData[1] = newAlerts;
                 selectedAlertData[2] = _alert;
                  $('#user-info').text(user.name.First + " " + user.name.Last);
                  $('#note').val(user.note)
                  return;
              }
          }
        for(_alert in inprogressAlerts){
              if(inprogressAlerts[_alert]._id ==  id){
                 var user = inprogressAlerts[_alert].user;
                 selectedAlertData[0] = inprogressAlerts[_alert];
                 selectedAlertData[1] = inprogressAlerts;
                 selectedAlertData[2] = _alert;
                  $('#user-info').text(user.name.First + " " + user.name.Last);
                  $('#note').val(user.note)
                  return;
              }
          }
        for(_alert in completedAlerts){
              if(completedAlerts[_alert]._id ==  id){
                 var user = completedAlerts[_alert].user;
                 selectedAlertData[0] = completedAlerts[_alert];
                 selectedAlertData[1] = completedAlerts;
                 selectedAlertData[2] = _alert;
                  $('#user-info').text(user.name.First + " " + user.name.Last);
                  $('#note').val(user.note)
                  return;
              }
          }
    })
    
    $(document).click(function(){
        if(selectedAlertData.length == 0){
            clearSelectedAlert();
        }
    })
}



$(".move-btn").click(function(e){
    e.stopPropagation();
    var tempSelector = selectedAlert;
    var index;
    
     if( currentTable == "n"){
        (function(){
            tempSelector.addClass("moving");
            setTimeout( function(){tempSelector.appendTo($("#table-inprogress")); tempSelector.removeClass("moving");tempSelector.find('.move-btn').css("opacity","1");},400)
            
        })();
        var item = newAlerts.find(item => item._id = tempSelector.data("id"));
        var updateObj = {_id : item._id, state : "inprogress"};
        updateAlert(updateObj);
        index = newAlerts.indexOf(item);
        inprogressAlerts.push(newAlerts[index]);
        newAlerts.splice(index, 1);
    }
     else if( currentTable == "ip"){
        (function(){
            tempSelector.addClass("moving");
            setTimeout( function(){tempSelector.appendTo($("#table-completed")); tempSelector.removeClass("moving");tempSelector.find('.move-btn').css("opacity","1");},400)
            
        })();
        var item = inprogressAlerts.find(item => item._id = tempSelector.data("id"));
        var updateObj = {_id : item._id, state : "completed"};
        updateAlert(updateObj);
        index = inprogressAlerts.indexOf(item);
        completedAlerts.push(inprogressAlerts[index]);
        inprogressAlerts.splice(index, 1);
        
    }
     else if( currentTable == "c"){
        (function(){
            tempSelector.addClass("moving-left");
            setTimeout( function(){tempSelector.appendTo($("#table-inprogress")); tempSelector.removeClass("moving-left");tempSelector.find('.move-btn').css("opacity","1");},400)
            
        })();
        var item = completedAlerts.find(item => item._id = tempSelector.data("id"));
        var updateObj = {_id : item._id, state : "inprogress"};
        updateAlert(updateObj);
        index = completedAlerts.indexOf(item);
        inprogressAlerts.push(completedAlerts[index]);
        completedAlerts.splice(index, 1);
    }
    
    updateSliderLabels()
})

}, 300);

function updateSliderLabels(){
    $('#new_btn').text("New (" + newAlerts.length + ")");
    $('#inprogress_btn').text("In-Progress (" + inprogressAlerts.length + ")");
    $('.alert').removeClass("alert-hovered")
}

function setupSlider(){
    window.slider = new Swipe(document.getElementById('slider'), {
      startSlide: 0,
      speed: 400,
      draggable: true,
      continuous: false,
      disableScroll: true,
      stopPropagation: false,
      ignore: ".scroller",
      callback: function(index, elem, dir) {
        $(".alerts-table").css("overflow","hidden");
        $(".slider-tab").removeClass("active");
         $("#slider-nav ul li").eq(index ).addClass('active');
        setTimeout( function(){$(".alerts-table").css("overflow","auto");},400);
      },
      transitionEnd: function(index, elem) {}
    });
    currentTable = "n";
    /* Slider Buttons */
    var slide_duration;

    $("#new_btn").click(function(){
      window.slider.slide(0, slide_duration);
      currentTable = "n";
    });

    $("#inprogress_btn").click(function(){
      window.slider.slide(1, slide_duration);
      currentTable = "ip";
    });

    $("#completed_btn").click(function(){ 
      window.slider.slide(2, slide_duration);
      currentTable = "c";
    });
}

function refreshCount(){
    $('#new_btn').text("New (" + newAlerts.length + ")");
    $('#inprogress_btn').text("In-Progress (" + inprogressAlerts.length + ")");
}

/* End Alert DOM events */

// updateAlert
// takes input of _id and state
function updateAlert(obj){
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/admin/alerts/update",
      data : JSON.stringify(obj),
      dataType : 'json',
      success : function(data) {
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    
}

// updateUser
// updates user
function updateUser(obj){
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/admin/users/updateOne",
      data : JSON.stringify(obj),
      dataType : 'json',
      success : function(data) {
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    
}

// Action buttons
$('#false-positive').click(function(){
    var updateObj = {_id : selectedAlertData[0]._id, state : "false-positive"};
    updateAlert(updateObj);
    //then update state of user
    updateUser({state:"clear"})
    // remove DOM object
    lastSelectedAlert.hide();
    lastSelectedAlert.remove();
    // remove Data object
    selectedAlertData[1].splice(selectedAlertData[2],1);
    updateSliderLabels();
    clearSelectedAlert();
})

function clearSelectedAlert(){
        $('.alert').css('opacity','1');
        $('.alert .alert-answers').slideUp();
        selectedAlertData.splice(0,3);
        $('#user-info').text("");
        $('#note').val("");
}

