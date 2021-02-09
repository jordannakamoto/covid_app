// display.js

$(".inactive").hide();
$(".result_screen").hide();


var userFirst;
var userLast;
var items = $(".item");
var total_questions = items.length;
var current_question = 1;
var next_question = 2;
var answers = [];
var date = new Date(Date.now());
var formatted_date;
var formatted_time;
var flag = 0; // What question has been answered Yes and what failure screen will show
// flags - 0 clear - 1 symptoms 2 no test 3 exposure 4 travel 5 positive test

var submitted = false;
var user_state;

var submission = {}
var transitionTime = 150;

// Initialize
initUser();

function initUser(){
    
    // Get User from db
   $.ajax({
      type : "GET",
      contentType : "application/json",
      url : "/user",
      dataType : 'json',
      success : function(data) {
       userFirst = data.name["First"];
       userLast = data.name["Last"];
       user_state = data.state;
       setLanguage(data.language, "none"); // load the text data after userName has been set
       setAppState();
       
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    
    // Setup Time Formatting for End Screen and Alert Storage
    formatted_date = date.toLocaleString('en-us', {weekday:'long'}) + " " + (date.getMonth() + 1) + "/" + date.getDate();
    var ampm = date.getHours() >= 12 ? 'pm' : 'am';
    formatted_time = (date.getHours() % 12) + ":" + date.getMinutes() + ampm;
    
    // Jumps User to end of DST if they have already completed it
    function setAppState(){
        if(user_state == "expected"){
        }
        else if(user_state == 0){
            $('#welcome').hide();
            showScreen("Success");
        }
        else{
            flag = user_state;
            $('#welcome').hide();
            showScreen("Failure");
        }
    }
}
    

/* Loading Animation */

function onReady(callback) {            // Load completion loop    
  var intervalId = window.setInterval(function() {
    if (document.getElementsByTagName('body')[0] !== undefined) {
      window.clearInterval(intervalId);
      callback.call(this);
    }
  }, 1000);
}

// Hide loading dial and show app
function setVisible() {
  $('.indicator').hide();
  $('.page').fadeIn();
}

onReady(function() {
  setVisible();
});

/* End Loading */

/* Pack and Post to Google Sheet */
function answersToSubmission(){
    // fill submission dictionary with form data from array
    
    submission["First Name"] = userFirst;
    submission["Last Name"] = userLast;
    submission["Date"] = formatted_date;
    submission["Time"] = formatted_time;
    submission["Status"] = flag; 
    
    for(i = 0; i < answers.length ; i++){
      submission["Question "+(i+1)] = answers[i];
    }
    
    // Post to Google
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/toGoogle",
      data : JSON.stringify(submission),
      dataType : 'json',
      success : function() {
       console.log("posted to Google");
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
}

/* English language Data */
var EnglishData = {
  "Welcome": {"Title": "Welcome %userFirst to The Making Waves Academy daily employee wellness screen",
              "Description": "You must complete this survey before leaving your home to report for work. Your answers will be used to determine if you are clear to work for the day.",},
  "Confirmation": {"Title": "Please enter your Employee ID Number below:"},
  "Questions":[
                        {"Title": "Emergency Signs",
                            "Description":"If you develop <span class='inline-bold'>emergency warning signs</span> for COVID-19, <span class='inline-bold'>get medical attention immediately</span>. Emergency warning signs include:",
                            "List":["Trouble breathing","Persistent pain or pressure in the chest","New confusion","Inability to wake or stay awake","Bluish lips or face"],
                            "Footer":"<span class'inline-italic'>This list is not all inclusive. Please consult your medical provider for any other symptoms that are severe or concerning.</span>",
                            "Citation":"<span class='inline-italic'>Citation: <a href='https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/symptoms.html'>https://www.cdc.gov/coronavirus</a></span>"
                            },
                        {"Title": "Have you been tested for COVID-19 over the past 7 days?",
                            "Options":["1. No, I  have not been tested in the past 7 days. ","2. Yes, I have been tested in the last 7 days, but I am waiting for the results","3. Yes, I have been tested in the last 7 days and my test was positive.","4. Yes, I have been tested in the last 7 days and my test was negative."]
                            },
                        {"Title":"Within the past 14 days, have you been caring for or in close physical contact with:",
                           "Description":"<br>Anyone who is known to have laboratory-confirmed COVID-19?<br><br>OR<br><br>Anyone who has any symptoms consistent with COVID-19?",
                           "Footer":'"Close physical contact" is defined as 6 feet or closer for a cumulative total of 15 minutes within a 24 hour period.'
                           },
                        {"Title":"Please take your temperature and answer the following:",
                          "Description":"Is your temperature at or above 100.4 degrees F?"
                           },
                        {"Title":"Do you have any of the following symptoms?",
                           "List":["Chills","Cough or sore throat","Shortness of breath or difficulty breathing","Fatigue, muscle, or body aches", "Headache", "New loss of taste or smell","Congestion or runny nose","Nausea, vomiting. or diarrhea"],
                           "Footer":"Note: if you are under a doctor's care for a non-contagious chronic condition and have the above symptoms, please answer no."
                           },
                        {"Title":"Have you traveled outside of California in the last 10 days?"
                            }
    ],
  "Success": {"Title":"All clear!","Description":"Don’t forget to wear a face covering, wash your hands, limit in-person interactions to 10 minutes, and maintain the 6' rule. Have a great day!"},
  "Failures":[{"Title":"It sounds like your temperature is higher than expected or you may be exhibiting symptoms related to COVID-19.", "Description":"Please seek medical treatment and text your manager to let them know that you are ill and cannot come to work.   HR will reach out to you to discuss next steps."},
                    {"Title":"Since we require weekly testing and you have indicated that you have not taken your weekly test, please stay at home","Description":"HR will reach out to you to discuss next steps."},
                    {"Title":"Based on the information that you have shared, please stay home.","Description":"HR will reach out to you to discuss next steps."},
                    {"Title":"Please stay home, in accordance with the Calfiiornia Public Health Department advisory.","Description":"travelers traveling into California should self-quarantine for 10 days after arrival. <a href='https://covid19.ca.gov/travel/'>https://covid19.ca.gov/travel/</a>"}
                    ],
  "Failure_Error":"If you believe that you received this message in error,  please contact HR at humanresources@mwacademy.org and await further instructions."
}

/* Spanish language Data */
var SpanishData = {
  "Welcome": {"Title": "Welcome %userFirst to The Making Waves Academy daily employee wellness screen",
              "Description": "You must complete this survey before leaving your home to report for work. Your answers will be used to determine if you are clear to work for the day.",},
  "Confirmation": {"Title": "Please enter your Employee ID Number below:"},
  "Questions":[
                        {"Title": "Emergency Signs",
                            "Description":"If you develop <span class='inline-bold'>emergency warning signs</span> for COVID-19, <span>get medical attention immediately</span>. Emergency warning signs include:",
                            "List":["Trouble breathing","Persistent pain or pressure in the chest","New confusion","Inability to wake or stay awake","Bluish lips or face"],
                            "Footer":"<span class'inline-italic'>This list is not all inclusive. Please consult your medical provider for any other symptoms that are severe or concerning.</span>",
                            "Citation":"<span class='inline-italic'>Citation: <a href='https://www.cdc.gov/coronavirus/2019-ncov/symptoms-testing/symptoms.html'>https://www.cdc.gov/coronavirus</a></span>"
                            },
                        {"Title": "Have you been tested for COVID-19 over the past 7 days?",
                            "Options":["1. No, I  have not been tested in the past 7 days. ","2. Yes, I have been tested in the last 7 days, but I am waiting for survey results","3. Yes, I have been tested in the last 7 days and my test was negative.","4. Yes, I have been tested in the last 7 days and my test was positive."]
                            },
                        {"Title":"Within the past 14 days, have you been caring for or in close physical contact",
                           "Description":"(6 feet or closer for a cumulative total of 15 minutes within a 24 hour period) with:",
                           "Footer":"Anyone who is known to have laboratory-confirmed COVID-19?<br>OR<br>Anyone who has any symptoms consistent with COVID-19?"
                           },
                        {"Title":"Please take your temperature and answer the following:",
                          "Description":"Is your temperature at or above 100.4 degrees F?"
                           },
                        {"Title":"Do you have any of the following symptoms?",
                           "List":["Chills","Cough or sore throat","Shortness of breath or difficulty breathing","Fatigue, muscle, or body aches", "Headache", "New loss of taste or smell","Congestion or runny nose","Nausea, vomiting. or diarrhea"],
                           "Footer":"Note: if you are under a doctor's care for a non-contagious chronic condition and have the above symptoms, please answer no."
                           },
                        {"Title":"Have you traveled outside of California in the last 10 days?"
                            }
    ],
  "Success": {"Title":"All clear!","Description":"Don’t forget to wear a face covering, wash your hands, limit in-person interactions to 10 minutes, and maintain the 6' rule. Have a great day!"},
  "Failures":[{"Title":"It sounds like your temperature is higher than expected or you may be exhibiting symptoms related to COVID-19.", "Description":"Please seek medical treatment and text your manager to let them know that you are ill and cannot come to work.   HR will reach out to you to discuss next steps."},
                    {"Title":"It sounds like you will need to quarantine for the next 14 days.","Description":"Please text your manager to let them know that you cannot come to work today.   HR will reach out to you to discuss next steps."},
                    {"Title":"It sounds like you will need to quarantine for the next 14 days.","Description":"Please text your manager to let them know that you cannot come to work today.   HR will reach out to you to discuss next steps."},
                    {"Title":"Please stay home, in accordance with the Calfiiornia Public Health Department advisory.","Description":"travelers traveling into California should self-quarantine for 10 days after arrival. <a href='https://covid19.ca.gov/travel/'>https://covid19.ca.gov/travel/</a>"}
                    ],
  "Failure_Error":"If you believe that you received this message in error,  please contact HR at humanresources@mwacademy.org and await further instructions."
}

// When the language selector is changed
$("#language").change(function(){
  setLanguage($("#language option:selected").text(),"update");
})

// Set Language
function setLanguage(language, setting){
  if(language == "English"){
    data = EnglishData;
    $("#language").val("english");
  }
  else if(language == "Spanish"){
    data = SpanishData;
    $("#language").val("spanish");
  }
    if(setting == "update"){
        changeUserLanguage(language); // Update language on server
    }
    // Populate DOM
    // Welcome
    $("#welcome h2").text(data.Welcome.Title.replace ("%userFirst", userFirst));
    $("#welcome p").text(data.Welcome.Description);
    // Questions
    for(i = 0; i < data["Questions"].length; i++){
        n = i+1;
        var q = data["Questions"][i];
        if(q.hasOwnProperty('Title')){
            $('#'+n+' .title').html(q.Title);
        }
        if(q.hasOwnProperty('Description')){
            $('#'+n+' .description').html(q.Description);
        }
         if(q.hasOwnProperty('List')){
             for(j = 0; j < q.List.length; j++){
                  $('#'+n+' .list').append('<li>' + q.List[j] + '</li>');
             }
        }
         if(q.hasOwnProperty('Footer')){
            $('#'+n+' .footer').html(q.Footer);
        }
         if(q.hasOwnProperty('Citation')){
            $('#'+n+' .citation').html(q.Citation);
        }
        if(q.hasOwnProperty('Options')){
            for(var option in q.Options){
              var newElement = '<button class="choice_btn btn">'+q.Options[option]+'</button><br>'
              $('#'+n+ ' .answer_multiple').append(newElement);
            }
        }
      }
      
      // Setup failure flags for Multiple Choice - Question 2
      $('#2 .answer_multiple button').eq(0).attr("data-flag","2"); // haven't been tested
      $('#2 .answer_multiple button').eq(2).attr("data-flag","5"); // recieved positive test result - flag for test result
      
      init_choice_btns(); // Create handlers and add next-slide logic to multiple choice buttons logic
        
      // Populate Success screen
      $('#success .title').text(data["Success"].Title)
      $('#success .description').text(data["Success"].Description)
      
      // Populate Failure screens
      for(i = 0; i < data["Failures"].length; i++){
        n = i+1;
        var f = data["Failures"][i];
        if(f.hasOwnProperty('Title')){
            $('#failure'+n+' .title').html(f.Title);
        }
        if(f.hasOwnProperty('Description')){
            $('#failure'+n+' .description').html(f.Description);
        }
        $('#failure'+n+' .errormsg').html(data["Failure_Error"]);
      }
      update();
}


// Hide welcome screen and the first item
$(".start_btn").click(function() {
  var domObject = items[current_question - 1];
  setTimeout(function(){
    $(domObject).removeClass("inactive");
    $(domObject).addClass("active");
    $("#welcome").hide();
  },transitionTime);
  update();
})

// Navigation buttons in bottom-right control
// back and forward
// determine the range of traversal
$(".back_btn").click(function() {  
 var domObject = items[current_question - 1];
 var domObject_previous = items[current_question - 2];
   
 $(domObject).removeClass("active unanswered");
 $(domObject).addClass("inactive answered");
 
 $(domObject_previous).removeClass("inactive");
 $(domObject_previous).addClass("active");
 
 current_question --
 next_question --
 update();
})
$(".forward_btn").click(function() {  
 var domObject = items[current_question - 1];
 var domObject_next = items[current_question];
   
 goTo_next(domObject, domObject_next);

 update();
})


// Yes answer button                      
$(".yes_btn").click(function() {  
 // $("#result_" + current_question).text("Yes");
 answers[current_question - 1] = "Yes";
 var domObject = items[current_question - 1];
 var domObject_next = items[next_question - 1];
 $(this).addClass("selected");
 $(this).siblings().removeClass("selected");
 goTo_next(domObject, domObject_next);

 update();
})

// No answer button
$(".no_btn").click(function() {  
 // $("#result_" + current_question).text("No");
 answers[current_question - 1] = "No";
 var domObject = items[current_question - 1];
 var domObject_next = items[next_question - 1];
 
  $(this).addClass("selected");
 $(this).siblings().removeClass("selected");
 goTo_next(domObject, domObject_next);

 update();
})

update();

// Multiple choice answer buttons
function init_choice_btns(){
    $(".choice_btn").click(function() { 
     var choice = $(this).text()
     // $("#result_" + current_question).text(choice);
     // flag if invalid option is clicked
     if($(this).data('flag')){flag = $(this).data('flag')};
     // Go to next
     answers[current_question - 1] = choice;
     var domObject = items[current_question - 1];
     var domObject_next = items[next_question - 1];
     $(this).addClass("selected");
     $(this).siblings().removeClass("selected");
     goTo_next(domObject, domObject_next);

     update();
    })
}

// Called by answer buttons
function goTo_next(current, next){
  if(current_question < total_questions){
  $(current).removeClass("active unanswered");
  $(current).addClass("inactive answered");
 
  $(next).removeClass("inactive");
  $(next).addClass("active");
   
   current_question ++
   next_question ++
 }  
};

// update()
// Update progress bar and show/hide active/inactive elements
function update(){
 setTimeout(function(){
   var percent = (answers.length) / total_questions * 100;
   if(current_question <= answers.length){
      percent = current_question / total_questions * 100;}
   $(".progress-bar").css("width", percent +"%");
   $("#progress").text(current_question + "/" + total_questions);
   if(current_question > 1 && user_state == "expected"){
     $('.back_btn').addClass("active");
     $('.back_btn').removeClass("inactive")
  }
  else{
     $('.back_btn').removeClass("active");
     $('.back_btn').addClass("inactive")
  }
  if(current_question < answers.length + 1 && current_question != items.length){
     $('.forward_btn').addClass("active");
     $('.forward_btn').removeClass("inactive")
  }
  else{
    $('.forward_btn').removeClass("active");
    $('.forward_btn').addClass("inactive")
  }
  
  if(current_question == total_questions && answers.length == total_questions){
    $('#submit').fadeIn(300);
    $(".progress-bar").css("width", "100%");
  }
  
  $(".active").fadeIn(300);
  $(".inactive").hide();
 }, transitionTime) 
}

// submit_btn onclick
$(".submit_btn").click(function(){
    setTimeout(function(){
      $("#" + items.length).addClass("inactive");
      $(".back_btn").addClass("inactive");
      $(".inactive").hide();
      checkAnswers();
      submitted = true;
      answersToSubmission();
    },transitionTime);
 });


// Show Success or Failure screens
function showScreen(screen){
  if (screen == "Success"){
     $('#success_gradient').css("opacity", ".7");
    $("#success span").text(formatted_date);
    $("#success").fadeIn(500);
  }
  else if (screen == "Failure"){
     if(user_state == "expected")   // Unless this screen is being re-loaded
        postAlert();
    if(flag == 1){ // Symptoms
    $("#failure1").fadeIn(500);
    }
    if(flag == 2){ // No test
    $("#failure2").fadeIn(500);
    }
    if(flag == 3){ // Exposure
    $("#failure3").fadeIn(500);
    }
    if(flag == 4){ // Travel
    $("#failure4").fadeIn(500);
    }
    if(flag == 5){ // Positive Test
    $("#failure1").fadeIn(500);
    }
  }
}

// checkAnswers()
// Determine DST result
function checkAnswers(){
  for(i = 0; i < answers.length; i++){
    if(answers[i] == "Yes" && flag == 0){
      if(i==2)
          flag = 3 // Question 3, flag for exposure
      if(i==5)
          flag = 4 // Question 5, flag for travel
      else
          flag = 1 // Flag for symptoms
    }
  }
  if(flag != 0){
    showScreen("Failure");
    user_state = flag.toString();
    updateState(user_state);
  }
  else{
    showScreen("Success");
    updateState("0");
  }
}

/*          */
/* AJAX */
/*          */

// Change Language of User
function changeUserLanguage(_lang) {
    var obj = {"language": _lang};
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/changelanguage",
      data : JSON.stringify(obj),
      dataType : 'json',
      success : function() {
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
}

// Create Alert
function postAlert() {
        // Change Language of User
    var obj = {
                    "date": formatted_date
    };
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/newAlert",
      data : JSON.stringify(obj),
      dataType : 'json',
      success : function() {
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
}

// Update User State - post submit
function updateState(_state){
    var obj = {"state": _state}
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/updatestate",
      data : JSON.stringify(obj),
      dataType : 'json',
      success : function() {
      },
      error : function(e) {
        console.log("ERROR: ", e);
      }
    });
    
}

/*          */
/* AJAX */
/*          */