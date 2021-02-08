// Testing



// Results div for DST clientside
for (i = 1; i <= total_questions; i++){
  var result = '<div><span> Question' + i +': </span><span id= "result_' + i + '"></span></div>'; 
  $("#results_div").append(result)
}
$("#results_div").append(flag);


// put after failure screens in html
        #results_div
          span(id='#results')
            | Results: