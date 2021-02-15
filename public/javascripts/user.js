//<img src="https://i.ibb.co/nsp3Yw9/cloud-1.png" width="16px">

$('#field_vacDoc').text("google.com/myDoc");

var currentuser = {};
var isPopulated = false;
var searchQuery;
var searchIndex;
var keyCombo = false;
var changes = {};

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
                var insert = htmlStringify(data[group], groupStr);
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
    function htmlStringify(groupspace, groupname){
            var htmlStr = "<h2>"
            htmlStr += '    <button aria-expanded="false" id="'+groupname+'">'+groupspace;
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
          $('#'+groupStr + '-ul li').click((e)=>{updateCard(e.target.id); openProfile()});
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
        if(searchIndex["First"].length > 0 || searchIndex["Last"].length > 0){
            $('#search-results li').eq(0).addClass("results-hovered");
            if(searchIndex["First"].length > 0 ){
                updateCard(searchIndex["First"][0]._id);
            }
            else
                updateCard(searchIndex["Last"][0]._id)
            
            openProfile();
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
        else if(isPopulated){
            $('#search-results ul li').each(function(){
                console.log(searchQuery);
                if(!$(this).text().toLowerCase().includes(searchQuery)){
                    $(this).hide();
                }
                else
                    $(this).show();
                
            })
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
                AC_field.append('<li data-id="'+searchIndex["First"][user]._id+'">' + nameStr +  '</li>');
        }
        
        
        for(const user in searchIndex["Last"]){
                var nameStr = searchIndex["Last"][user].name.First + " " + searchIndex["Last"][user].name.Last;
                AC_field.append('<li data-id="'+searchIndex["Last"][user]._id+'"+>' + nameStr +  '</li>');
        }
        
        AC_field.children().click(function(e){
            updateCard(e.target.attributes.getNamedItem('data-id').value); openProfile()
        })
    }
});

function openProfile(){
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
         $('#alert-history ul').children().remove();
         
         //Populate DOM
         $('#fullname').text(currentuser.name.First + " " + currentuser.name.Last);
         $('#email').val(currentuser.email);
         $('#phone').val(currentuser.phone);
         
            // schedule
        $('.flex-schedule').children().removeClass('highlighted');
        var i = 0;  
        for(key in currentuser.Schedule){
            if(currentuser.Schedule[key] == true){
                $('#' + key).toggleClass('highlighted');
                i++;
            }
        }
        $('.flex-schedule').children().off();
        $('.flex-schedule').children().click(function(){
            $(this).toggleClass('highlighted')
            updateSchedule();
        });
        
            // labels
         $('#activity').text(currentuser.activity);
         $('#state').text(currentuser.state);
         
            // data
         $('#title').val(currentuser.title);
         $('#group').val(currentuser.group);
         $('#field_username').text(currentuser.username);
         $('#field_key').text(currentuser.key);
         
         $('#note').val(currentuser.note);

            for(item in currentuser.alerts){
                if(currentuser.alerts[item].state == "new")
                    $('#alert-history ul').append("<li class='alert-urgent'>"+currentuser.alerts[item].msg+ " - " +currentuser.alerts[item].date+"</li>")
                else if(currentuser.alerts[item].state == "false-positive"){}
                else
                    $('#alert-history ul').append("<li>"+currentuser.alerts[item].msg+ " - " +currentuser.alerts[item].date+"</li>")
            }
         
         // if doc? load doc link
     }
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
        if(Object.keys(changes).length > 0){
            submitChanges();
        }
        return false;
    }
}); 
/* end CTRL-S */

function submitChanges(){
    if(noteChanged){
        currentuser.note = $('#note').val();
        changes.note = currentuser.note;
    }
    if(scheduleChanged){
        var week = ['M','T','W','Th','F','S','Su']
        var i = 0;
        $('.flex-schedule').children().each(function(){
            if($(this).hasClass('highlighted'))
                currentuser.Schedule[week[i]] = true;
            else
                currentuser.Schedule[week[i]] = false;
            i++;
        }); // At this point, currentuser.Schedule is holding the updated schedule
        delete changes["schedule"]; // delete the temporary schedule object
        changes["Schedule"] = currentuser.Schedule;
    }
    
    changes["_id"]=currentuser._id;
    // console.log(changes);
    
  // AJAX Post  - UpdateUser
    $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "users/updateOne",
            data: JSON.stringify(changes),
            dataType: 'json',
            success: function(data){
                notification();
                resetChangeList();
            },
            error: function(e){
                alert("ERROR: " + e);
            }
        });
    
  // DOM notification  
      function notification(){
          setTimeout(function(){
              $("#user_saved").fadeIn(200);
              $("#user_saved").css("top","54px");
          }, 200)
          setTimeout(function(){
              $("#user_saved").fadeOut(500);
              },1400)
              $("#user_saved").css("top","48px");
      }
     
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

$('#profile-card input').change(function(e){
    var field = e.target.id;
    var val = e.target.value;
    
    // Change Message   
    changes[field] = val;
    
    updateChangeList();
})

var noteChanged = false; // hold a variable so we don't have to update every key up
$('#note').on('keyup paste',function(){  
    if(!noteChanged){
        if($(this).val() != currentuser.note){
            noteChanged = true;
            changes["note"] = 0;
            updateChangeList();            
        }
    }
})

var scheduleChanged = false;
function updateSchedule(){ // called by onclick of schedule buttons
        if(!scheduleChanged){
            changes["schedule"] = 0;
            scheduleChanged = true; // still needs conversion to Schedule object
            updateChangeList();
        }
}

var changeList = $('#change-list ul');

function updateChangeList(){

    if(changeList.is(':hidden')){
        changeList.show();
    }
    
    changeList.children().remove();
    for(item in changes){
        if(item == "note" || item=="schedule")
            changeList.append('<br><li>' + item + ": " + "edited" + '</li>');
        else{
            var msg  = "<br> " + currentuser[item] +  " > "  + changes[item];
            changeList.append('<br><li>' + item + ": " + msg + '</li>');
        }
    } 
}

function resetChangeList(){
    changes = {};
    noteChanged = false;
    scheduleChanged = false;
    changeList.hide();
}

$("#card-group").click((e)=>{
    e.stopPropagation();
})
$("#right-bar").click((e)=>{
    e.stopPropagation();
})

$(document).click(function(){
    if(Object.keys(currentuser).length > 0){
        $('#card-group').slideUp();
        for (var param in currentuser) delete currentuser[param];
        resetChangeList();
        setTimeout(()=>{
            $('#expandable').css("opacity","1");
        },500)
        
    }
})