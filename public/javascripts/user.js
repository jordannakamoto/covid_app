//<img src="https://i.ibb.co/nsp3Yw9/cloud-1.png" width="16px">

$('#field_vacDoc').text("google.com/myDoc");

var currentUser = {};
var isPopulated = false;
var searchQuery;
var searchIndex;
var keyCombo = false;
/* Ajax Populate Group Expandables */



function initExpandable(){
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "users/groups",
        dataType: 'json',
        success: function(data){
            console.log(data); 
            for(const group in data){
                var groupStr = data[group].replace(/\s/g, '');
                var insert = htmlStringify(groupStr);
                $('#expandable').append(insert);
                var selector = $('#'+groupStr);
                selector.mouseenter(function(){
                        populateGroup(data[group]);
                        $(this).off("mouseenter");
                });
                selector.click(function() {
                    var groupStr = data[group].replace(/\s/g, '');
                    let expanded = selector.attr('aria-expanded') === 'true';
                    selector.attr('aria-expanded', !expanded);
                    $('#'+groupStr+'-div').slideToggle(200);
                })
            }
        },
        error: function(e){
            console.log("ERROR: " + e)
        }
    });
    function htmlStringify(groupname){
            var htmlStr = "<h2>"
            htmlStr += '    <button aria-expanded="false" id="'+groupname+'">'+groupname;
            htmlStr += '        <svg aria-hidden="true" focusable="false" viewBox="0 0 10 10">';
            htmlStr += '            <rect class="vert" height="8" width="2" y="1" x="4"></rect>';
            htmlStr += '            <rect height="2" width="8" y="4" x="1"></rect>';
            htmlStr += '        </svg>';
            htmlStr += '    </button>';
            htmlStr += '</h2>';
            htmlStr += '<div id="'+groupname+'-div">';
            htmlStr += '    <ul id="'+groupname+'-ul"></ul>';
            htmlStr += '</div>';
            return htmlStr;
        }
}

function populateGroup(group){
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/users/group/"+group,
      dataType : 'json',
      success : function(data) {
          for(i = 0; i < data.length; i++){
            var userStr;
            userStr = data[i].name.First + " " + data[i].name.Last;
            userStr += ' - ' + data[i].title;
            userStr += ' | ' +data[i].state;
            var groupStr = group.replace(/\s/g, '');
            $('#'+groupStr + '-ul').append('<li class="list-item-emp" id="' + data[i]._id + '">' + userStr + '</li>')
          }
          $('#'+groupStr + '-ul li').click((e)=>{updateCard(e.target.id); animateTransition()});
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    
}

// Call AJAX -- fetch data

initExpandable();

/* End Ajax */

$( "#search-input" ).keydown(function(event) {
    var isWordCharacter = event.key.length === 1 || event.keyCode === 8 || event.keyCode === 46 ;
    
    if(!isWordCharacter)
        keyCombo = true;
});

$( "#search-input" ).keyup(function(event) {
    let keycode = (event.keyCode ? event.keyCode : event.which);
    // hmmmm
    var isWordCharacter = event.key.length === 1;
    
    // if enter is pressed
    if(keycode == '13') {
        console.log(searchIndex);
        if(searchIndex["First"].length > 0 || searchIndex["Last"].length > 0){
            $('#search-results li').eq(0).addClass("results-hovered");
            if(searchIndex["First"].length > 0 ){
                updateCard(searchIndex["First"][0]._id);
            }
            else
                updateCard(searchIndex["Last"][0]._id)
            
            animateTransition();
        }
    }
    
    if(keyCombo == true){
        if(!isWordCharacter)
            keyCombo = false;
        return;
    }
    
    setTimeout(function() { // get value after event loop. In other words, the state of input after keypress
        // Possibly not needed in keyup vs keypressed

        // this is the value after the keypress
         searchQuery = $('#search-input').val();
         
         console.log(isPopulated);
         console.log(searchQuery.length);
             // perform db lookup if the string length is 2.... TODO: also detect paste
        if(searchQuery.length <= 4 && searchQuery.length > 1){
            if(!isPopulated)
                getSearchIndex(searchQuery);
            isPopulated = true;
        }
        else if(searchQuery.length < 2){
            updateAutoComplete("clear");
            isPopulated = false;
        }
    }, 0);
   
    
    function getSearchIndex(query){
        var _query = {"query":query};
            $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "users/search",
            data: JSON.stringify(_query),
            dataType: 'json',
            success: function(data){
                searchIndex = data;
                console.log(searchIndex);
                updateAutoComplete();
            },
            error: function(e){
                console.log("ERROR: " + e)
            }
        });
    }
    
    function updateAutoComplete(_option){
        // AC -> AutoComplete
        var AC_field = $('#search-results ul');
        
        if(_option == "clear"){
            AC_field.children().remove();
            return;
        }
        
        
        for(const user in searchIndex["First"]){
                var nameStr = searchIndex["First"][user].name.First + " " + searchIndex["First"][user].name.Last;
                AC_field.append('<li>' + nameStr +  '</li>');
        }
        
        for(const user in searchIndex["Last"]){
                var nameStr = searchIndex["Last"][user].name.First + " " + searchIndex["Last"][user].name.Last;
                AC_field.append('<li>' + nameStr +  '</li>');
        }
    }
});

function animateTransition(){
    $('#card-group').slideDown(500);
        $('#card-group').css("transform", "scale(.98)");
        $('#expandable').css("opacity","0");
        setTimeout(function(){
            $('#card-group').css("box-shadow","0 10px 15px -5px rgba(0,0,0,.2)") 
        }, 200); 
        setTimeout(function(){
            $('#expandable').css("opacity",".2");
            $('#expandable').hover(()=>{$('#expandable').css("opacity","1")});
        }, 400); 
}

function updateCard(userid){
    // ajax call
    $('#field_username').text('none');
    var _query = {"query":userid};
    console.log(_query)
            $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "users/findById",
            data: JSON.stringify(_query),
            dataType: 'json',
            success: function(data){
                drawCard(data);
            },
            error: function(e){
                console.log("ERROR: " + e)
            }
        });
        
     function drawCard(user){
         currentuser = user; 
         
         //Populate DOM
         $('#fullname').text (currentuser.name.First + " " + currentuser.name.Last);
         $('#email').text(currentuser.email);
         $('#phone').text(currentuser.phone);
         
            // schedule
        $('.flex-schedule').children().removeClass('highlighted');
        var i = 0;
        for(key in currentuser.Schedule){
            if(currentuser.Schedule[key] == true){
                console.log(i);
                $('.flex-schedule').children().eq(i).toggleClass('highlighted');
                i++;
            }
        }
        
            // labels
         $('.activity-label').text(currentuser.activity);
         $('.state-label').text(currentuser.state);
         
            // data
         $('#field_title').text(currentuser.title);
         $('#field_username').text(currentuser.username);
         $('#field_group').text(currentuser.group);
         $('#field_key').text(currentuser.key);
         
         $('#user_note').val(currentuser.note);
         
         // if doc? load doc link
     }
}


/* Save Button */
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
function setExpandable() {
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
}

/* end Expandable */

/* add from sheet*/
$('#add-from-sheet').click(()=>{
    $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/admin/addFromSheet",
      dataType : 'json',
      success : function(data) {
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
   
})

