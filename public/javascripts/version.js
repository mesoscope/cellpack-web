$(document).ready(function() {
    var recn = $('select.nameselect');
    var recv = $('select.versionselect');
    recn.change(function() {
        $.post('/version', {'recipename': recn.val()}, function(data) {
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
