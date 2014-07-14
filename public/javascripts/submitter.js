$('#submitter').click(function() {
  var recName = $('#recTableHeader').children().html();
  var recVersion = 'UNDEFINED';
  var recOptions = {};

  // option labels
  var optionLabels = [];
  $('#'+recName+'-referencelabels').children().each(function(index) {
    if (index != 0) {
      optionLabels.push($(this).html());
    }
  });

  // option values
  var edited = false;
  var optionValues = [];
  $('#'+recName+'-dynamicvalues').children().each(function(index) {
    if (index == 0) {
      recVersion = $(this).html();
    } else {
      if ($(this).children().val() != '') {
        edited = true;
        optionValues.push($(this).children().val());
      } else {
        optionValues.push($(this).children().attr('placeholder'));
      }
    }
  });

  for (var i = 0; i < optionValues.length; i++) {
    recOptions[optionLabels[i]] = optionValues[i];
  }

  var hierarchy = [];
  $('.sideLink').each(function(index) {
    if (hierarchy.indexOf(recName) < 0) {
      hierarchy.push($(this).html());
    }
  });

  if (edited) {
    var newIdentifier = recName + '-' + recVersion.split('.').join('_');
    var newRecipe = {'identifier': newIdentifier, 'options': recOptions};
    $.post('/commit', {'newRecipe': newRecipe, 'hierarchy': hierarchy});
  } else {
    alert('Please edit recipe before updating!');
  }
});
