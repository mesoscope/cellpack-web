$(document).ready(function() {
  var recn = $('select.recn');
  var recv = $('select.recv');
  $('#loader').click(function() {
    $('#tableForm').empty();
    if (recv.val()) {
      // data is an array
      $.post('/tabler', {'recipename': recn.val(), 'recipevers': recv.val()}, function(data) {
        $.each(data, function(i, val) {
          $('#tableForm').append('<div><div style="float:left", align="center"><h2>'+val['tablename']+'</h2></div><div style="float:right" align="center"><button type="button" class="saveButton" data-recname='+val['tablename']+'>Save as New Version</button></div><div style="float:none" align="center"></div></div>');
        });
      });
    } else {
      alert('Please select a recipe and version!');
    }
  });
});
