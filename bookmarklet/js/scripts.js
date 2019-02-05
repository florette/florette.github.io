(function($){
$( document ).ready(function() {





console.log('Optimus rolling!');

// Get list of rules from "rules.txt" and create an array of all rules by category.
var fetchRules = function() {
    var def = $.Deferred();

    $.ajax({
        url: "//127.0.0.1:8080/bookmarklet/js/serialiser.json",
        type: "GET"
    }).done(function(data) {
        console.log(data)
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

var execute = function() {
            
    // function to get all scriptlets of all rules/plugins from their respective paths in an array.
    // window object is created with result of all plugins.
    $.getMultipleScripts = function(arr, path) {
        var _arr = $.map(arr, function(scr) {
            //TODO: see if you can add script to global object here instead of every plugin js file.
            return $.getScript((path || "") + scr);
        });

        return $.when.apply($, _arr);
    };

    // function to find a specific rule/plugin from list of all rules.
    var findRule = function(id) {
        var r = {};
        for (var i=0, len=self.rules.length; i<len; i++) {
            if (self.rules[i].id === id) {
                r = self.rules[i];
                break;
            }
        }

        return r;
    };

    /*
    //Commented this on 25-10-17 as Sabine changed requirement to stop only those rules which require keyword and not all SEO rules.
    // AEMBAU-1189 & AEMBAU-1191 - both for SEO keyword missing and first entry with warning if keyword is missing.
    // TODO: check if SEO keyword present on current test web page. If yes, then do nothing, else filter out SEO rules with a warning as first entry under SEO tab. Execute only all non-SEO rules.
    // code goes here.
    var ignoreCategory = "";
    var keyword = $('meta[name="targeted-keyword"]').attr("content");
    //Check: if keyword is not present, stop SEO rules' execution and warn user about keyword missing for SEO. - AEMBAU-1191.
    if ((typeof keyword === "undefined") || (keyword === "")) {
        //TODO: AEMBAU-1189: add first entry to show user about missing keyword for page.
        // Later use this conditon to stop execution of all SEO rules if keyword is not present.
        console.log("SEO keyword for this page is missing. No SEO rules execution!");
        alert("SEO keyword is missing. Test cannot be conducted for SEO! Please add a keyword for this page.\n\n" +
            "This message needs to be removed and first entry for keyword missing needs to be added.");
        
        //filter scriptsArray to ignore SEO rules.
        //ignoreCategory = "SEO";       //SAU: commented only for development purpose. Its needed to work properly.
    }
    */

    // create an array with paths of all scripts of all rules/plugins.
    // var scriptsArray = [];
    
    // for (var i = 0, len = self.rules.length; i < len; i++) {
    //     //if (self.rules[i].category !== ignoreCategory)   //Commented for same reason as above AEMBAU-1191.
    //     scriptsArray.push(self.rules[i].script);
    // }

    // TEST THE BUG!
    // Remove the 2 last files to fix the issue -----> Regex is failing on the 2 last scripts:
    //     "/content/dam/optimus/plugins/accessibility-high-risk-words/index.js",
    //     "/content/dam/optimus/plugins/accessibility-industry-jargon-word/index.js"

    scriptsArray = [
        // "/content/dam/optimus/plugins/keyword-provided/index.js",
        // "/content/dam/optimus/plugins/targeted-keywords/index.js",
        // "/content/dam/optimus/plugins/targeted-keyword-in-url/index.js",
        // "/content/dam/optimus/plugins/url-keyword-stuffing/index.js",
        "/bookmarklet/content/dam/optimus/plugins/url-length/index.js",
        // "/content/dam/optimus/plugins/page-title-keyword-stuffing/index.js",
        // "/content/dam/optimus/plugins/page-title-keyword-placement/index.js",
        // "/content/dam/optimus/plugins/page-title-length/index.js",
        // "/content/dam/optimus/plugins/use-of-meta-description/index.js",
        // "/content/dam/optimus/plugins/keyword-in-meta-description/index.js",
        // "/content/dam/optimus/plugins/meta-description-length/index.js",
        // "/content/dam/optimus/plugins/sufficient-words/index.js",
        // "/content/dam/optimus/plugins/keyword-stuffing/index.js",
        // "/content/dam/optimus/plugins/keyword-in-h1/index.js",
        // "/content/dam/optimus/plugins/accessibility-image-alt-text/index.js",
        // "/content/dam/optimus/plugins/accessibility-high-risk-words/index.js",
        // "/content/dam/optimus/plugins/accessibility-industry-jargon-word/index.js"
    ]

    $.getMultipleScripts(scriptsArray).done(function() {
        //console.log ("Loaded all plugins -----> ", JSON.stringify(arguments));

        var responses = arguments,
            plugins = window['optimus-plugins'],
            pluginDefs = [];

        for (var i = 0, len = plugins.length; i < len; i++) {
            var plugin = plugins[i];
            // console.log('\n\n Plugin:'+plugin);
            pluginDefs.push(plugin());
        }

        $.when.apply($, pluginDefs).done(function() {
            var results = arguments,
                total = 0,
                rule,
                scoreType = "low",
                totalMarks = 0,
                scoreElm;
            self.scoreCategoryMap = {};

            $('.optimus-tests').addClass('scored');
            console.log('\nThis is the result ====> ' , JSON.stringify(results))
            

            for (var i = 0, len = results.length; i < len; i++) {
              if(typeof results[i] != 'undefined'){
                rule = findRule(results[i].id);
                if (typeof results[i].score !== 'number') {
                    results[i].score = 0;
                }

                var scoreMarks =  parseFloat(rule.score, 10);
                scoreMarks = _.isNaN(scoreMarks) ? 0 : scoreMarks;

                if (scoreMarks < results[i].score || scoreMarks === results[i].score) {
                    scoreType = "high";
                    scoreElm = "optimus-score-high";
                } else if (scoreMarks !== results[i].score && results[i].score >= scoreMarks/2) {
                    scoreType = "medium";
                    scoreElm = "optimus-score-medium";
                } else {
                    scoreType = "low";
                    scoreElm = "optimus-score-low";
                }

                $("#" + results[i].id).addClass(scoreElm);

                // Dynamic description and success/error messages logic:
                // if score is less than rule-score, its an error, else success.
                // description may contain dynamic values that will be supplied via 'dynamic' object in result.
                var desc = rule.description,
                    message = "",
                    descClass = "";
                if(typeof results[i].error !== "undefined"){
                    message = results[i].error;
                    descClass = "error-text";
                } else {
                    message = (results[i].score < scoreMarks)?rule.error:rule.success;
                    descClass = (results[i].score < scoreMarks)?"error-text":"success-text";
                }
                message = (typeof message === "undefined") ? "" : message;

                console.log('\n Dynamic keys : '+results[i].dynamic);

                for (key in results[i].dynamic){
                    message = message.replace(new RegExp("#"+key+"#",'g'), results[i].dynamic[key]);
                    desc = desc.replace(new RegExp("#"+key+"#",'g'), results[i].dynamic[key]);
                }

                console.log('\n Message Desc : '+desc+'\n\n'+message);

                $("#" + results[i].id + " div.optimus-result-section").append("<div class='optimus-generic-desc'>" + desc + "</div>");
                $("#" + results[i].id + " div.optimus-result-section").append("<div class='optimus-description "+descClass+"'>" + message + "</div>");

                if(typeof self.scoreCategoryMap[rule.category] === "undefined")
                    self.scoreCategoryMap[rule.category] = { score:0, total:0 };
                self.scoreCategoryMap[rule.category].score += results[i].score;
                self.scoreCategoryMap[rule.category].total += scoreMarks;
                console.log("scoreCategoryMap=", JSON.stringify(self.scoreCategoryMap));

                total += results[i].score;
                totalMarks += scoreMarks;
                console.log ("current: Score: ", results[i].score, " out of: ", scoreMarks, " rule:", rule.id);
                console.log ("Total  : Score: ", total, " out of: ", totalMarks); 
                
                self.excelReport.push({
                    'rule_category':rule.category,
                    'rule_type':rule.type,
                    'rule_name':rule.criterion,
                    'total_score':results[i].score,
                    'out_of_score':scoreMarks,
                    'result_type':descClass.replace("-text", ""),
                    'rule_description': desc,
                    'rule_msg': message                            
                })
              }
              
              if(i == len - 1) {
                makeIframe();
              }
            }

            //console.log('\n Report Excel => \n'+self.excelReport);
            showResult();
            setTimeout(function(){grunticon.embedSVG();}, 100);

        }).fail(function(){
            console.log("1. Unable to load test scripts...");

        });

    }).always(function(){
        console.log ("I am always executed...", arguments);
    }).fail(function() {
        console.log("2. Unable to load test scripts...");
    })

};

execute();




});
})(jQuery);

