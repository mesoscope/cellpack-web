$(document).ready(function() {
  $('#commitButton').hide();
  $('.saveButton').click(function() {

    var editedDict = {};
    editedDict['name'] = $(this).data('recname');
    editedDict['optionValues'] = [];

    $('.'+editedDict['name']+'-valuerow').last().children().each(function(i) {
      
      if (i != 0) {
        editedDict['optionValues'].push($(this).children().val());
      } else {
        editedDict['version'] = $(this).text();
      }
    });


    $.post('/modified', editedDict, function(data) {
      if (typeof data == 'string') {
        alert(data);
      } else {
        $('.'+data['name']+'-valuerow').last().remove();
        $('#commitButton').show();
      }
    });
  });
});
