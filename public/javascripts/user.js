//<img src="https://i.ibb.co/nsp3Yw9/cloud-1.png" width="16px">

$('#field_username').text("jordan");
$('#field_group').text("students");
$('#field_vacDoc').text("google.com/myDoc");


// Programatic spaghetti
var schoolwideCount;
/* Ajax Populate Group Expandables */

function populateGroups(){
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/users/group/School-wide",
      dataType : 'json',
      success : function(data) {
          for(i = 0; i < data.length; i++){
            var userStr;
            userStr = data[i].name.First + " " + data[i].name.Last;
            userStr += ' - ' + data[i].title;
            // if(data[i].state == "expected"){
                // userStr += '<div class="scheduled"></div>'
            // }
            $('#sw-ul').append('<li>' + userStr + '</li>')
          }
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    
}

$("#add-from-sheet").click(()=>{
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/addFromSheet",
      dataType : 'json',
      success : function() {
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
})

function populateGroups2(){
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/users/group/US 1",
      dataType : 'json',
      success : function(data) {
          for(i = 0; i < data.length; i++){
            var userStr;
            userStr = data[i].name.First + " " + data[i].name.Last;
            userStr += ' - ' + data[i].title;
            $('#us-ul').append('<li>' + userStr + '</li>')
          }
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    
}

// Call AJAX -- fetch data
populateGroups();
populateGroups2();

/* End Ajax */



// Tracks visibility of saveBtn but also if document is in a saveable state.
var saveBtn_isVisible = false;

$(".schedule-start").on('keyup', function(){
  if(saveBtn_isVisible == false){
    showSaveBtn();
  }
});
$(".schedule-end").on('keyup', function(){
  if(saveBtn_isVisible == false){
    showSaveBtn();
  }
});
$("#user_note").on('keyup paste', function() {
  if(saveBtn_isVisible == false){
    showSaveBtn();
  }
});

// rename to save state tracking
function showSaveBtn(){
  setTimeout(function(){    
      saveBtn_isVisible = true;
  }, 300)
}

/* CTRL-S Shortcut */
var ctrl_down = false;
var ctrl_key = 17;
var s_key = 83;

$(document).keydown(function(e) {
    if (e.keyCode == ctrl_key) ctrl_down = true;
}).keyup(function(e) {
    if (e.keyCode == ctrl_key) ctrl_down = false;
});

$(document).keydown(function(e) {
    if (ctrl_down && (e.keyCode == s_key)) {
        if(saveBtn_isVisible == true)
          submitChanges();
        // Your code
        return false;
    }
}); 
/* end CTRL-S */

function submitChanges(){
  setTimeout(function(){
      $("#user_saved").fadeIn(200);
      $("#user_saved").css("top","54px");
      saveBtn_isVisible = false;
  }, 200)
  setTimeout(function(){
      $("#user_saved").fadeOut(500);
      },1400)
      $("#user_saved").css("top","48px");
 
}

/* Expandable */
(function() {
  const headings = document.querySelectorAll('h2');
  
  Array.prototype.forEach.call(headings, h => {
    let btn = h.querySelector('button');
    let target = h.nextElementSibling;
    
    if(btn){
      btn.onclick = () => {
        let expanded = btn.getAttribute('aria-expanded') === 'true';

        btn.setAttribute('aria-expanded', !expanded);
        target.hidden = expanded;  
      }
    }
  });
})()

/* end Expandable */

