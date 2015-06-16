$(document).ready(function() {
    $("#nameSelect").change(function() {
        $.get("/recipe/"+$("#nameSelect").val(), function(versions) {
            $("#recVersion").empty().append(function() {
                var options = "";
                $.each(versions, function(versionIndex, version) {
                    options += "<option "+"value=\""+version+"\">"+version+"</option>";
                });
                return options;
            });
        });
    }).change();
});
