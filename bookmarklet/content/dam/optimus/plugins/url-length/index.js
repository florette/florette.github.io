(function() {

    function UrlLength() {
        var def = $.Deferred();
        var rule = _.filter(window.seoRules.data.rules._array, function(item){ return item.id == 'url-length' });
        var path = window.location,
            path1 = path.origin.replace("composer.wbccms.srv.", ""),
            path2 = path.pathname.replace("/content/public/wbc/en/", ""),
            subFolders = ((path2.split("/")).length - 1),
            urlPath = (path1 + "/" + path2),
            pathLength = urlPath.length;

        if (subFolders <= 3 && pathLength <= 75) {
            def.resolve({
                score: parseInt(rule[0].score),
                id: 'url-length',
                dynamic: {"NumberCharacters": pathLength, "NumberSubfolders":subFolders, "URL": urlPath}
            });
        } else {
            def.resolve({
                score: 0,
                id: 'url-length',
                dynamic: {"NumberCharacters": pathLength, "NumberSubfolders":subFolders, "URL": urlPath}
            });
        } 

        return def;
    }

    if (window['optimus-plugins'] && _.isArray(window['optimus-plugins'])) {
        window['optimus-plugins'].push(UrlLength);
    } else {
        window['optimus-plugins'] = [];
        window['optimus-plugins'].push(UrlLength);
    }

}());