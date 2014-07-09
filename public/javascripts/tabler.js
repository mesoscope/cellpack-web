$(document).ready(function() {

  $('#commit').hide();
  var recn = $('select.recn');
  var recv = $('select.recv');
  $('#loader').click(function() {
    $('#tableForm').empty();
    $.post('/tabler', {'recipename': recn.val(), 'recipevers': recv.val()}, function(data) {
      $.each(data, function(i, val) {
        var recTable = '<table border="1" id="'+val['tablename']+'-table">';
        var recLabels = '<tr id="'+val['tablename']+'-labelrow"><th>Version</th>';
        var recValues = '<tr id="'+val['tablename']+'-valuerow"><td>'+val['tableversion']+'</td>';
        $.each(Object.keys(val['tableoptions']), function(i, val2) {
          recLabels = recLabels + '<th>'+ val2 + '</th>';
          recValues = recValues + '<td><input type="text" placeholder="' + val['tableoptions'][val2] + '" val=""></td>';
        });
        recTable = recTable + recLabels + '</tr>' + recValues + '</tr>' +'</table>';
        $('#tableForm').append('<div><div style="float:left", align="center"><h2>'+val['tablename']+'</h2></div><div style="float:right" align="center"><button type="button" class="saver" data-recname="'+val['tablename']+'">Save as New Version</button></div><div style="float:none" align="center">'+recTable+'</div></div><br><br>');
      });
    });
    $.getScript('javascripts/newrow.js');
  });
});
