// display.js
// example: https://postranch.typeform.com/to/sspEfN#name=xxxxx&department=xxxxx&manager=xxxxx&phone=xxxxx&type=xxxxx

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
var success = "unfinished";
var submitted = false;

var submission = {}

initUserTime();

function initUserTime(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var namestr = urlParams.get('name');
    
    var separator = namestr.indexOf('_');
    userFirst = namestr.substr(0,separator);
    userFirst = userFirst.charAt(0).toUpperCase()+ userFirst.slice(1);
    
    userLast = namestr.substr(separator+1,namestr.length);
    userLast = userLast.charAt(0).toUpperCase()+ userLast.slice(1);
    
    formatted_date = date.toLocaleString('en-us', {weekday:'long'}) + " " + (date.getMonth() + 1) + "/" + date.getDate();
    var ampm = date.getHours() >= 12 ? 'pm' : 'am';
    formatted_time = (date.getHours() % 12) + ":" + date.getMinutes() + ampm;
}
    
function answersToSubmission(){
    // fill submission dictionary with form data from array
    
    submission["First Name"] = userFirst;
    submission["Last Name"] = userLast;
    submission["Date"] = formatted_date;
    submission["Time"] = formatted_time;
    submission["Status"] = success;
    
    for(i = 0; i < answers.length ; i++){
      submission["Question "+(i+1)] = answers[i];
    }
    
    $.ajax({
      type : "POST",
      contentType : "application/json",
      url : "/test",
      data : JSON.stringify(submission),
      dataType : 'json',
      success : function() {
       console.log(data);
       console.log("posted to Google");
      },
      error : function(e) {
        alert("Error!")
        console.log("ERROR: ", e);
      }
    });
}



var EnglishData = {
  "Welcome": {"Title": "Welcome %userFirst to The HR Manager daily employee wellness screen",
              "Description": "You must complete this survey before leaving your home to report for work. Your answers will be used to determine if you are clear to work for the day.",},
  "Confirmation": {"Title": "Please enter your Employee ID Number below:"},
  "Question1": {"Title": "Take your temperature using the company provided thermometer.", "Description":"Is your temperature at or above 100.4 F?"},
  "Question2": {"Title": "Have you had a Cough or Shortness of Breath or Unusual Fatigue in the last 24 hours?",
               "Description": "If you have a diagnosed chronic condition with these symptoms, please answer no."},
  "Question3": {"Title": "Have you had any two of these symptoms in the last 24 hours?", "Image":"https://images.typeform.com/images/rduinNdMUAYM/image/default"},
  "Question4" : {"Title": "In the last 14 days, what is your exposure to others who are known to have COVID-19?", "Options" : ["I live with someone who has COVID-19","I've had close contact (within 6 feet) with someone who has COVID-19.","I've been near someone who has COVID-19 but was at least 6 feet away and was not exposed to a sneeze or cough.","I've had no exposure","I don't know"]},
  "Success": {"Title":"All clear!","Description":"Don’t forget to wear a face covering, wash your hands, limit in-person interactions to 10 minutes, and maintain the 6' rule. Have a great day!"},"Failure1":{"Title":"It sounds like your temperature is higher than expected or you may be exhibiting symptoms related to COVID-19.", "Description":"Please seek medical treatment and text your manager to let them know that you are ill and cannot come to work.   HR will reach out to you to discuss next steps."},
  "Failure2": {"Title":"It sounds like you will need to quarantine for the next 14 days.","Description":"Please text your manager to let them know that you cannot come to work today.   HR will reach out to you to discuss next steps."}
}

var SpanishData = {
  "Welcome": {"Title": "Bienvenido %userFirst a la pantalla diaria de bienestar de los empleados de PRI. ",
              "Description": "Debe completar esta encuesta antes de salir de su casa para presentarse a trabajar. Sus respuestas se utilizarán para determinar si está listo para trabajar por el día."},
  "Confirmation": {"Title": "Por favor, introduzca su número de identificación de empleado a continuación:"},
  "Question1": {"Title": "Tome su temperatura usando el termómetro proporcionado por la compañía. ¿Su temperatura está en o por encima de 100.4 F?"},
  "Question2": {"Title": "¿Has tenido tos, dificultad para respirar o fatiga inusual en las últimas 24 horas?  ",
               "Description": "Si usted tiene una condición crónica diagnosticada con estos síntomas, por favor responda"},
  "Question3": {"Title": "¿Has tenido dos (2) o alguno de estos síntomas en las últimas 24 horas?   ", "Image":"https://images.typeform.com/images/pvfsLhrRQAV2/image/default"},
  "Question4" : {"Title": "En los últimos 14 días, ¿cuál es su exposición a otras personas que se sabe que tienen COVID-19?  ", "Options" : ["Vivo con alguien que tiene COVID-19","He tenido contacto cercano (dentro de 6 pies) con alguien que tiene COVID-19.","He estado cerca de alguien que tiene COVID-19 pero estaba al menos a 6 pies de distancia y no estaba expuesto a un estornudo.","No he tenido ninguna exposición","No lo sé"]},
  "Success": {"Title":"¡Todo listo!", "Description":" No olvides usar una máscara, lavarte las manos, limitar las interacciones con personas a 10 minutos y mantener la regla de 6 piés."},
"Failure1":{"Title":"Parece que su temperatura es más alta de lo esperado o puede estar exhibiendo síntomas relacionados con COVID-19.","Description":"Busque tratamiento médico y envíe un mensaje de texto a su gerente para informarles que está enfermo y que no puede ir a trabajar. Recursos Humanos se comunicará con usted para discutir los próximos pasos."},
  "Failure2": {"Title":"Parece que tendrá que poner en cuarentena durante las próximas 2 semanas.","Description":" Envíe un mensaje de texto a su gerente para informarle que no puede venir a trabajar hoy. Recursos Humanos se comunicará con usted para discutir los próximos pasos."}
}

document.cookie = "language=English";

var cookie = document.cookie;

setLanguage("English");

$("#language").change(function(){
  setLanguage($("#language option:selected").text());
})

function setLanguage(language){
  if(language == "English"){
    data = EnglishData;
  }
  else if(language == "Spanish"){
    data = SpanishData;
  }
    $("#welcome h2").text(data.Welcome.Title.replace ("%userFirst", userFirst));
    $("#welcome p").text(data.Welcome.Description);
    $("#1 h2").text(data.Question1.Title);
    $("#1 p").text(data.Question1.Description);
    $("#2 h2").text(data.Question2.Title);
    $("#2 p").text(data.Question2.Description);
    $("#3 h2").text(data.Question3.Title);
    $("#3 img").attr("src",data.Question3.Image);
    $("#4 h2").text(data.Question4.Title);
    $("#4 .choice_btn").remove();
    $("#4 br").remove();
    for(var option in data.Question4.Options){
      var newElement = '<button class="choice_btn btn">'+data.Question4.Options[option]+'</button><br>'
      // Add negative flags to multiple choice options
      if(option == 0 || option == 1){
        newElement = newElement.replace('class="','class="invalid ')
      }
      $("#4 .answer").append(newElement);
    }
      init_choice_btns();
      $("#success h2").text(data.Success.Title);
      $("#success p").text(data.Success.Description);
      $("#failure_1 h2").text(data.Failure1.Title);
      $("#failure_1 p").text(data.Failure1.Description);
      $("#failure_2 h2").text(data.Failure2.Title);
      $("#failure_2 p").text(data.Failure2.Description);
      update();
    //Make class for multiple choice options
}



$(".start_btn").click(function() {
  var domObject = items[current_question - 1];
  $(domObject).removeClass("inactive");
  $(domObject).addClass("active");
  $("#welcome").hide();
  update();
})

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
                      
$(".yes_btn").click(function() {  
 $("#result_" + current_question).text("Yes");
 answers[current_question - 1] = "Yes";
 var domObject = items[current_question - 1];
 var domObject_next = items[next_question - 1];
 $(this).addClass("selected");
 $(this).siblings().removeClass("selected");
 goTo_next(domObject, domObject_next);

 update();
})

function init_choice_btns(){
$(".choice_btn").click(function() {  
 var choice = $(this).text()
 $("#result_" + current_question).text(choice);
 if($(this).hasClass('invalid')){flag = current_question};
 answers[current_question - 1] = choice;
 var domObject = items[current_question - 1];
 var domObject_next = items[next_question - 1];
 $(this).addClass("selected");
 $(this).siblings().removeClass("selected");
 goTo_next(domObject, domObject_next);

 update();
})
}

$(".no_btn").click(function() {  
 $("#result_" + current_question).text("No");
 answers[current_question - 1] = "No";
 var domObject = items[current_question - 1];
 var domObject_next = items[next_question - 1];
 
  $(this).addClass("selected");
 $(this).siblings().removeClass("selected");
 goTo_next(domObject, domObject_next);

 update();
})

update();

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

function update(){
  $("#progress").text(current_question + "/" + total_questions)
  if(current_question > 1 && submitted == false){
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
    createSubmitButton();
}
  
    $(".active").fadeIn(500);
    $(".inactive").hide();
  
}

function createSubmitButton(){
  if($(".submit_btn").length < 1){
  $("#"+total_questions).append('<button class="submit_btn btn green_btn">Submit</button>');
  $(".submit_btn").click(function(){
    $("#" + items.length).addClass("inactive");
    $(".back_btn").addClass("inactive");
    $(".inactive").hide();
    checkAnswers();
    submitted = true;
    answersToSubmission();
  })
  }
}

for (i = 1; i <= total_questions; i++){
  var result = '<div><span> Question' + i +': </span><span id= "result_' + i + '"></span></div>'; 
  $("#results_div").append(result)
}

function showScreen(screen){
  if (screen == "Success"){
    $("#success span").text(formatted_date);
    $("#success").fadeIn(500);
  }
  else if (screen == "Failure"){
    if(flag == 4){ // If exposure has been reported on question 4
    $("#failure_2").fadeIn(500);
    }
    else{
    $("#failure_1").fadeIn(500);
    }
  }
}

function checkAnswers(){
  for(i = 0; i < answers.length; i++){
    if(answers[i] == "Yes"){
      flag = i + 1;
    }
  }
  if(flag != 0){
    showScreen("Failure");
    success = "failed";
  }
  else{
    showScreen("Success");
    success = "passed";
  }
}