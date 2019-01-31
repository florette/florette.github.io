(function($){
$( document ).ready(function() {





console.log('Optimus rolling!');

// Get list of rules from "rules.txt" and create an array of all rules by category.
var fetchRules = function() {
    var def = $.Deferred();

    $.ajax({
        url: "/content/public/wbc/en/_services/serialiser/optimus.serialise.json",
        type: "GET"
    }).done(function(data) {
        data = $.parseJSON(data);

        self.kill = data.data.config.kill;

        var r = data.data.rules._array,
            map = {};

        for (var i = 0, len = r.length; i < len; i++) {
            if (map[r[i].category]) {
                map[r[i].category].push(r[i]);
            } else {
                map[r[i].category] = [];
                map[r[i].category].push(r[i]);
            }
        }

        self.categoryMap = map;

        def.resolve(data);

    }).fail(function(data) {
        def.reject(data);
    });

    return def;
    
};

fetchRules();




});
})(jQuery);

