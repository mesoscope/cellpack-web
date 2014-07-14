$(document).ready(function() {
  var recn = $('select.recn');
  var recv = $('select.recv');
  $('#loader').click(function() {

    $('#recipeList').empty();
    $('#recTableHeader').empty();
    $('#recipeForm').empty();
    $('#recipeButtons').empty();

    $.post('/tabler', {'recipename': recn.val(), 'recipevers': recv.val()}, function(data) {
      $.each(data, function(i, val) {
        $('#recipeList').append('<li class="sideLink" data-vers="'+val['tableversion']+'">'+val['tablename']+'</li>');
      });

      $('#recTableHeader').append('<h3>'+data[0]['tablename']+'</h3>');

      var recTable = '<table border="1" id="'+data[0]['tablename']+'-referencetable">';
      var recLabels = '<tr id="'+data[0]['tablename']+'-referencelabels"><th>Version</th>';
      var recValues = '<tr id="'+data[0]['tablename']+'-referencevalues"><td>'+data[0]['tableversion']+'</td>';
      var newTableVersion = data[0]['tableversion'].split('.');
      newTableVersion[2] = parseInt(newTableVersion[2])+1;
      var dyValues = '<tr id="'+data[0]['tablename']+'-dynamicvalues"><td>'+newTableVersion.join('.')+'</td>';

      $.each(Object.keys(data[0]['tableoptions']), function(i, val) {
        recLabels = recLabels + '<th>'+ val + '</th>';
        recValues = recValues + '<td>' + data[0]['tableoptions'][val] + '</td>';
        dyValues = dyValues + '<td><input type="text" name="' + val + '" val="" placeholder="' + data[0]['tableoptions'][val] + '"></td>';
      });
      recTable = recTable + recLabels + '</tr>' + recValues + '</tr>' + dyValues + '</tr></table>';

      $('#recipeForm').append(recTable+'<br><br>');
      $('#recipeForm').append('<button type="button"> Add Extra Reference Row </button><button id="submitter" type="button"> Update </button><br><br>');
    });
    $.getScript('javascripts/submitter.js');
    $.getScript('javascripts/linkTable.js');
  });
});
