/* alert.js */

/* hold alert data clientside */
var newAlerts = [];
var inprogressAlerts = [];
var completedAlerts = [];
var currentTable;

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
            
            htmlStr = '<div data-id="'+elem._id+'" class="alert">';
            if (date == formatted_date){
                htmlStr += '\t<div class="alert-date today">Today</div>'
            }
            else
                htmlStr += '\t<div class="alert-date">' + date + '</div>'
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + ' | '
            htmlStr += elem.user.phone
            htmlStr += '<div  class="move-btn">🡆</div></div>'
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
            if (date == formatted_date){
                htmlStr += '\t<div class="alert-date today">Today</div>'
            }
            else
                htmlStr += '\t<div class="alert-date">' + date + '</div>'
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + ' | '
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
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + ' | '
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
setMouseOver();

$(".alert").mouseleave(function(){
  $(this).removeClass("alert-hovered")
  $(this).find('.move-btn').hide();
  selectedAlert = null;
  lastSelectedAlert = $(this);
});

$(".move-btn").mouseover(function(){
  selectedAlert = lastSelectedAlert;
  selectedAlert.addClass("alert-hovered")
});

function setMouseOver(){
      $(".alert").mouseover(function(){
      $(this).find('.move-btn').show(); 
      $(this).addClass("alert-hovered")
      selectedAlert = $(this);
    });
}

$(".move-btn").click(function(){
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
    
    $('#new_btn').text("New (" + newAlerts.length + ")");
    $('#inprogress_btn').text("In-Progress (" + inprogressAlerts.length + ")");
    $('.alert').removeClass("alert-hovered")
})

}, 300);

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

