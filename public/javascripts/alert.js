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
            
            htmlStr = '<div data-id="'+i+'" class="alert">';
            if (date == formatted_date){
                htmlStr += '\t<div class="alert-date today">Today</div>'
            }
            else
                htmlStr += '\t<div class="alert-date">' + date + '</div>'
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + ' | '
            htmlStr += elem.user.phone + '</div>'
            $("#table-new").append(htmlStr);
        }
        setupSlider();
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
            inprogressAlerts.push(elem);
            
            htmlStr = '<div data-id="'+i+'" class="alert">';
            if (date == formatted_date){
                htmlStr += '\t<div class="alert-date today">Today</div>'
            }
            else
                htmlStr += '\t<div class="alert-date">' + date + '</div>'
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + ' | '
            htmlStr += elem.user.phone + '</div>'
            $("#table-inprogress").append(htmlStr);
        }
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
            completedAlerts.push(elem);
            
            htmlStr = '<div data-id="'+i+'" class="alert">';
            if (date == formatted_date){
                htmlStr += '\t<div class="alert-date today">Today</div>'
            }
            else
                htmlStr += '\t<div class="alert-date">' + date + '</div>'
            htmlStr += elem.user.name.First + " " + elem.user.name.Last + ' | '
            htmlStr += elem.user.phone + '</div>'
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
   $(".alert").mouseover(function(){
  var offset = $(this).data("id");
  $('#move-btn').show();
  $('#move-btn').css("top", 24 + ( offset * 60 )+"px")
  $(this).addClass("alert-hovered")
  selectedAlert = $(this);
});
$(".alert").mouseleave(function(){
  $(this).removeClass("alert-hovered")
  $('#move-btn').hide();
  selectedAlert = null;
  lastSelectedAlert = $(this);
});

$("#move-btn").mouseover(function(){
  $('#move-btn').show();
  selectedAlert = lastSelectedAlert;
  selectedAlert.addClass("alert-hovered")
});

$("#move-btn").click(function(){
    var copy;
    
     if( currentTable == "n"){
        copy = selectedAlert.data("id");
        selectedAlert.data("id",  inprogressAlerts.length);
        selectedAlert.appendTo($("#table-inprogress"));
        inprogressAlerts.push(newAlerts[copy]);
        newAlerts.splice(copy, 1);
        
        // TODO:: then for all elements after the splice position, subtract 1 from data.id
    }
     else if( currentTable == "ip"){
        copy = selectedAlert.data("id");
        selectedAlert.data("id",  completedAlerts.length);
        selectedAlert.appendTo($("#table-completed"));
        completedAlerts.push(inprogressAlerts[copy]);
        inprogressAlerts.splice(copy, 1);
    }
     else if( currentTable == "c"){
        copy = selectedAlert.data("id");
        selectedAlert.data("id",  inprogressAlerts.length);
        selectedAlert.appendTo($("#table-inprogress"));
        inprogressAlerts.push(completedAlerts[copy]);
        completedAlerts.splice(copy, 1);
    }
    
    $('#new_btn').text("New (" + newAlerts.length + ")");
    $('#inprogress_btn').text("In-Progress (" + inprogressAlerts.length + ")");
    $(this).hide();
})

}, 300);
/* End Alert DOM events */

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

    $('#new_btn').text("New (" + newAlerts.length + ")");
    $('#inprogress_btn').text("In-Progress (" + inprogressAlerts.length + ")");
}