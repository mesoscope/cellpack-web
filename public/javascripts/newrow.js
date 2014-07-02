$(document).ready(function() {
  $("#commitButton").hide();
  $(".tableButton").click(function() {
    // show the commit button
    $.post("/modified", 
    {
      name:"testName",
      city:"testCity"
    }, 
    function(data) {
      alert(data);
      $("#commitButton").show();
    });
  });
});
