$(document).ready(function() {
  $('#commitButton').hide();
  $('.saveButton').click(function() {

    var editedDict = {};
    editedDict['name'] = $(this).data('recname');
    editedDict['optionValues'] = [];
    editedDict['optionHolders'] = [];

    $('#'+editedDict['name']+'-table tr:last').children().each(function(i) {
      
      if (i != 0) {
        editedDict['optionHolders'].push($(this).children().attr('placeholder'));
        if ($(this).children().val() == '') {
          editedDict['optionValues'].push('UNTOUCHED');
        } else {
          editedDict['optionValues'].push($(this).children().val());
        }
      } else {
        editedDict['version'] = $(this).html();
      }
    });

    var newVersion = editedDict['version'].split('.');
    newVersion[2] = parseInt(newVersion[2]) + 1;
    editedDict['newVersion'] = newVersion.join('.');


    var edited = false;
    for (var i = 0; i < editedDict['optionValues'].length; i++) {
      if (editedDict['optionValues'][i] != 'UNTOUCHED') {
        edited = true;
      }
    }

    if (!edited) {
      alert('Please edit recipe before saving!');
    } else {
      $('.'+editedDict['name']+'-valuerow').last().remove();

      var staticRow = '<tr class='+editedDict['name']+'-valuerow><td>'+editedDict['version']+'</td>'
      for (var i = 0; i < editedDict['optionHolders'].length; i++) {
        staticRow = staticRow + '<td>'+editedDict['optionHolders'][i]+'</td>'
      }
      staticRow = staticRow + '</tr>'
      $('#'+editedDict['name']+'-table tr:last').after(staticRow);
        
      var dynamicRow = '<tr class='+editedDict['name']+'-valuerow><td>'+editedDict['newVersion']+'</td>'
      for (var i = 0; i < editedDict['optionValues'].length; i++) {
        if (editedDict['optionValues'][i] != 'UNTOUCHED') {
          dynamicRow = dynamicRow+'<td><input type=\'text\' placeholder='+editedDict['optionValues'][i]+'></td>';
        } else {
          dynamicRow = dynamicRow+'<td><input type=\'text\' placeholder='+editedDict['optionHolders'][i]+'></td>';
        }
      }
      dynamicRow = dynamicRow + '</tr>'
      $('#'+editedDict['name']+'-table tr:last').after(dynamicRow);

      $('#commitButton').show();
    }
  });
});
