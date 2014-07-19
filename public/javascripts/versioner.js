$(document).ready(function() {
    var recn = $('select.recn');
    var recv = $('select.recv');
    recn.change(function() {
        $.post('/versioner', {'recipename': recn.val()}, function(data) {
            recv.empty().append(function() {
                var output = '';
                $.each(data, function(versIndex) {
                    output += '<option>' + data[versIndex] + '</option>';
                })
                return output;
            });
        });
    }).change();
});
