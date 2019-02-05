define(["text!./template.html", "text!./template-tray.html"], 
    function(baseTemplate, trayTemplate) {


    function Optimus($, _, ProgressBar) {
        var self = this;
        var $body = $('body');

        this.template = baseTemplate;
        this.tray = trayTemplate;
        this.rules = [];
        this.trayTemplate = "";
        this.categoryMap = {};
        this.$tray;
        this.kill = true;
        this.scoreCategoryMap = {};
        this.excelReport = [];

        // Generic error message for all keyword based rules when keyword not found. This global variable is used in rules.
        window.seoKeywordGenericError = "No targeted keyword has been provided.";

        var template = null;

        // Get list of rules from "rules.txt" and create an array of all rules by category.
        var fetchRules = function() {
            var def = $.Deferred();


            $.getJSON("/content/public/wbc/en/_services/serialiser/optimus-new-rules.serialise.json").success(function(data){

                //console.log("scb");
                    //data = $.parseJSON(data);
                    data = (data);

                            self.kill = data.data.config.kill;
                            window.seoRules = data;

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
                
                
            }).error(function(data){
                console.log("ecb")
                def.reject(data);
            });

            /* New json url link : /content/public/wbc/en/_services/serialiser/optimus.serialise.json 
               Old json url link : /content/public/wbc/en/_services/serialiser/optimus-rules.serialise.json
            */



            /*
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
            */

            return def;
        };

        // This is to show animation while showing result in circle at Run button.
        var showResult = function() {

            // Do nothing if Execution is not done yet.
            if ($.isEmptyObject(self.scoreCategoryMap)){
                return;
            }

            //Show the progress bar circle with animation.
            var displayResult = function(state){
                $('.icon-loading').hide();
                var bar = new ProgressBar.Circle('#optimus-results', {
                    color: '#fff',
                    // This has to be the same size as the maximum width to
                    // prevent clipping
                    strokeWidth: 7,
                    trailWidth: 1,
                    easing: 'easeInOut',
                    duration: 1400,
                    text: {
                        autoStyleContainer: false
                    },
                    from: { color: '#fff', width: 7 },
                    to: { color: '#fff', width: 7 },
                    // Set default step function for all animate calls
                    step: function(state, circle) {
                        circle.path.setAttribute('stroke', state.color);
                        circle.path.setAttribute('stroke-width', state.width);
                        var value = Math.round(circle.value() * 100);
                        if (value === 0) {
                            circle.setText('0');
                        } else {
                            circle.setText(value + '%');
                        }
                    }
                });
                // bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
                // bar.text.style.fontSize = '1.2em';
                bar.animate(state); // Number from 0.0 to 1.0
                //  $(".optimus-tests li em").show();
            }

            $('#optimus-results').empty();
            var currentTab = $('.optimus-underline .optimus-tab').data('tab');
            if(self.scoreCategoryMap[currentTab]){
                var score = self.scoreCategoryMap[currentTab].score / self.scoreCategoryMap[currentTab].total;
                displayResult(score);
            }
        }

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
            var scriptsArray = [];
            
            for (var i = 0, len = self.rules.length; i < len; i++) {
                //if (self.rules[i].category !== ignoreCategory)   //Commented for same reason as above AEMBAU-1191.
                scriptsArray.push(self.rules[i].script);
            }

            // TEST THE BUG!
            // Remove the 2 last files to fix the issue -----> Regex is failing on the 2 last scripts:
            //     "/content/dam/optimus/plugins/accessibility-high-risk-words/index.js",
            //     "/content/dam/optimus/plugins/accessibility-industry-jargon-word/index.js"

            // scriptsArray = [
            //     "/content/dam/optimus/plugins/keyword-provided/index.js",
            //     "/content/dam/optimus/plugins/targeted-keywords/index.js",
            //     "/content/dam/optimus/plugins/targeted-keyword-in-url/index.js",
            //     "/content/dam/optimus/plugins/url-keyword-stuffing/index.js",
            //     "/content/dam/optimus/plugins/url-length/index.js",
            //     "/content/dam/optimus/plugins/page-title-keyword-stuffing/index.js",
            //     "/content/dam/optimus/plugins/page-title-keyword-placement/index.js",
            //     "/content/dam/optimus/plugins/page-title-length/index.js",
            //     "/content/dam/optimus/plugins/use-of-meta-description/index.js",
            //     "/content/dam/optimus/plugins/keyword-in-meta-description/index.js",
            //     "/content/dam/optimus/plugins/meta-description-length/index.js",
            //     "/content/dam/optimus/plugins/sufficient-words/index.js",
            //     "/content/dam/optimus/plugins/keyword-stuffing/index.js",
            //     "/content/dam/optimus/plugins/keyword-in-h1/index.js",
            //     "/content/dam/optimus/plugins/accessibility-image-alt-text/index.js",
            //     "/content/dam/optimus/plugins/accessibility-high-risk-words/index.js",
            //     "/content/dam/optimus/plugins/accessibility-industry-jargon-word/index.js"
            // ]

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

        // Function to get analytics
        var makeIframe = function() {
            var scoreSEO = parseInt(self.scoreCategoryMap.SEO.score / self.scoreCategoryMap.SEO.total * 100);
            var scoreCompliance = parseInt(self.scoreCategoryMap.Compliance.score / self.scoreCategoryMap.Compliance.total * 100);
            console.log('SEO score', scoreSEO)
            console.log('Compliance score', scoreCompliance)

            var currentURL = window.location.href;
            console.log('currentURL', currentURL)
            var analyticsURL = currentURL + '&fid=optimus-seo-' + scoreSEO + '-compliance-' + scoreCompliance;
            console.log('analyticsURL', analyticsURL)

            $('#optimus-analytics__placeholder-js').append('<iframe src="' + analyticsURL + '"></iframe>');
        };

        // Handle UI on click of Tabs in tray.
        var doTab = function() {
            $body.on('click', '.optimus-tab', function() {
                var tab = $(this).data("tab");

                $(".tray-tabs li").removeClass("optimus-underline");
                $(this).parent().addClass("optimus-underline");

                $("ul.optimus-tests").removeClass("optimus-show-tab");
                $("ul.optimus-tests[data-optimus-category='" + tab + "']").addClass("optimus-show-tab");

                showResult();

                /*
                if (!$.isEmptyObject(self.scoreCategoryMap)){
                    $('#optimus-results').empty();
                    //showResult(6.5/10);
                    if(self.scoreCategoryMap[tab]){
                        var score = self.scoreCategoryMap[tab].score / self.scoreCategoryMap[tab].total;
                        showResult();
                    }
                }
                */
            });
        };

        // replace background-image for icons by corresponding svgs.
        var embedDataUri = function() {
            $('*[data-optimus-grunticon-embed]').each(function() {

                var backgroundSvg = decodeURIComponent(
                    $(this).css('background-image').slice(4, -1).replace(/"/g, "")
                ).split(',');

                if (backgroundSvg[0].indexOf("image/svg+xml") > -1) {
                    $(this).html(window.atob(backgroundSvg[1]));
                    $(this).css("background-image", "none");
                }

            });
        };

        var initialize = function() {
            $body.append(self.template);

            // Open optimus tray.
            $body.on('click', '.optimus-inspector-run', function() {
                $(".optimus-tray").removeClass('optimus-collapse');
                $(".optimus-tray").addClass('optimus-maximize');
                setTimeout(function() {
                    grunticon.embedSVG();
                    embedDataUri();
                }, 10);

                // Run all plugins/rules for all categories.
                //TODO: run only for specific category.
                execute();
                $('.optimus-results').show();

                $('.icon-download').show();
                
            });

            $body.on('click', '.optimus-inspector-still', function() {
                $(".optimus-tray").removeClass('optimus-collapse');
                $(".optimus-tray").addClass('optimus-maximize');
                setTimeout(function() {
                    grunticon.embedSVG();
                    embedDataUri();
                }, 10);
            }); 

            //AEMBAU-1188 - 061017
            //$body.on('click', '.optimus-result-explained', function() {
            $('.optimus-tests .rule-title').css("cursor", "pointer");
            $body.on('click', '.optimus-tests .rule-title', function() {
                $(this).toggleClass('open');
                var siblingDiv = $(this).closest('li').find("div.optimus-generic-desc, div.optimus-description, i.optimus-priority-high").toggle();
            });

            $body.on('click', '.optimus-tray-head .icon-download', function(){
                if (self.excelReport.length) {
                    updateLinksInHTML();
                }else{
                   console.log('\n Please run the script first !!') ;
                }
            })

            // Minimize Optimus tray.
            $body.on('click', '.optimus-minimize' , function() {
                $(".optimus-tray").removeClass('optimus-maximize');
                $(".optimus-tray").addClass('optimus-collapse');
                //  $('.optimus-tray').toggleClass("optimus-collapse optimus-maximize");
                $(".optimus-inspector").removeClass('optimus-inspector-run');
                $(".optimus-inspector").addClass('optimus-inspector-still');
            });

            // Close optimus. Only way to open again is refresh the page.
            // $body.on('click', '.optimus-close' , function() {
            //     $('.optimus-tray').remove();
            //     $('.optimus-inspector').remove();
            // });

            self.trayTemplate = _.template(self.tray);

            self.tray = self.trayTemplate({ 'rules': self.rules, 'categories': self.categoryMap });
            self.$tray = $(self.tray);
            $body.append(self.tray);

            doTab();


        };

        /* This function will convert any anchor tag in error/success messages to 
        plain url for excelsheet reports
        */

        var updateLinksInHTML = function () {

            var filename = window.location.href.substr(window.location.href.lastIndexOf('/') + 1).replace(".html?wcmmode=disabled","");

            var para = $.extend(true, {}, self.excelReport);
            $.each(para, function(key, item){
                var html = $(item.rule_result);
                html.find('a').each(function(){
                    $(this).replaceWith( $(this).text()+' : '+$(this).attr('href') );
                });
                para[key].rule_result = html.text().replace("'", "");
                // console.log('\n\n'+para[key].rule_result);
            });

            console.log('\nFile Data Print\n'+JSON.stringify(para));

            JSONToCSVConvertor(para, filename+'_'+currentDate(), true);
            
        }

        // Excel report creation 

        var JSONToCSVConvertor = function(JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = _.values(JSONData);
            
            var CSV = '';    
            //Set Report title in first row or line
            
            //CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";
                
                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    
                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);
                
                //append Label row with line break
                CSV += row + '\r\n';
            }
            
            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";
                
                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);
                
                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {        
                console.log("\nInvalid data provided to excel report !");
                return;
            }   
            
            //Generate a file name
            var fileName = "Optimus_Report_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g,"_");   
            
            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            
            //this will generate a temp <a /> tag
            var link = document.createElement("a");    
            link.href = uri;
            
            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            
            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Get current date (e.g day_month_year)
        var currentDate = function(){

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd = '0'+dd
            } 

            if(mm<10) {
                mm = '0'+mm
            } 

            today = dd + '_' + mm + '_' + yyyy;

            return today;

        }


        fetchRules().done(function(data) {
            self.rules = data.data.rules._array;
            console.log('This is optimus ' , self.kill)
            if (self.kill == "false") {
                initialize();
            }
        }).fail(function() {
            rules = [];
        });

    }

    return Optimus;

});