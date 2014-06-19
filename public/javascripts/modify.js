$(function() {
  var $recn = $('select.recn');
  var $recv = $('select.recv');
  $recn.change(function() {
    $recv.empty().append(function() {
      var output = '';
      $.each(local_data[$recn.val()], function(versIndex) {
        output += '<option>' + local_data[$recn.val()][versIndex] + '</option>'
      });
      return output;
    });
  }).change();
});
