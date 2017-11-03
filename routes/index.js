module.exports = function(app) {
    app.get('/*', function (req, res) {
        console.log(req.url);
        switch (req.url.split("?")[0]){
            // case '/':res.render('index', {});break;
            case '/':res.render('login', {});break;
            case '/login.html':res.render('login', {});break;
            case '/index.html':res.render('index', {});break;
            case '/welcome.html':res.render('welcome', {});break;
            // case '/favicon.ico':res.render('favicon', {});break;
            case '/admin-list.html':res.render('admin-list', {});break;
            case '/admin-add.html':res.render('admin-add', {});break;
            case '/admin-password-edit.html':res.render('admin-password-edit', {});break;
            // 带客通
            case '/daiketong/housing-estate-manager.html':res.render('daiketong/housing-estate-manager', {});break;
            case '/daiketong/housing-estate-manager-add.html':res.render('daiketong/housing-estate-manager-add', {});break;
            case '/daiketong/house_type_manager.html':res.render('daiketong/house_type_manager', {});break;
            case '/daiketong/communityhouse-list.html':res.render('daiketong/communityhouse-list', {});break;
            case '/daiketong/communityhouse-list-add.html':res.render('daiketong/communityhouse-list-add', {});break;
            case '/daiketong/communityhouse-second-add.html':res.render('daiketong/communityhouse-second-add', {});break;
            case '/daiketong/seller-list.html':res.render('daiketong/seller-list', {});break;
            case '/daiketong/seller-list-add.html':res.render('daiketong/seller-list-add', {});break;
            case '/daiketong/property-company-manager.html':res.render('daiketong/property-company-manager', {});break;
            case '/daiketong/property-company-manager-add.html':res.render('daiketong/property-company-manager-add', {});break;
            case '/daiketong/user-manager.html':res.render('daiketong/user-manager', {});break;
            case '/daiketong/sign-manager.html':res.render('daiketong/sign-manager', {});break;
            case '/daiketong/sign-manager-describe.html':res.render('daiketong/sign-manager-describe', {});break;
            case '/daiketong/recommend-manager.html':res.render('daiketong/recommend-manager', {});break;
            case '/daiketong/recommend-manager-describe.html':res.render('daiketong/recommend-manager-describe', {});break;
            case '/daiketong/information-manager.html':res.render('daiketong/information-manager', {});break;
            case '/daiketong/information-manager-add.html':res.render('daiketong/information-manager-add', {});break;
            case '/daiketong/form-search.html':res.render('daiketong/form-search', {});break;
            case '/daiketong/form-download.html':res.render('daiketong/form-download', {});break;
            case '/daiketong/label-manager.html':res.render('daiketong/label-manager', {});break;
            case '/daiketong/label-manager-add.html':res.render('daiketong/label-manager-add', {});break;
            case '/daiketong/household-manager.html':res.render('daiketong/household-manager', {});break;
            case '/daiketong/household-manager-add.html':res.render('daiketong/household-manager-add', {});break;
            case '/404.html':res.render('404', {});break;
            case '/daiketong/lunbotu-check.html':res.render('daiketong/lunbotu-check', {});break;
            case '/daiketong/good-activety.html':res.render('daiketong/good-activety', {});break;
            case '/daiketong/house_type_describe.html':res.render('daiketong/house_type_describe', {});break;
            case '/daiketong/housing-estate-manager_revise.html':res.render('daiketong/housing-estate-manager_revise', {});break;
            case '/daiketong/communityhouse-list-revise.html':res.render('daiketong/communityhouse-list-revise', {});break;
            case '/daiketong/lunbotu-check2.html':res.render('daiketong/lunbotu-check2', {});break;
            case '/daiketong/house_type_manager2.html':res.render('daiketong/house_type_manager2', {});break;
            case '/daiketong/good-activety2.html':res.render('daiketong/good-activety2', {});break;

            case '/daiketong/housing-estate-manager2.html':res.render('daiketong/housing-estate-manager2', {});break;
            case '/daiketong/housing-estate-manager3.html':res.render('daiketong/housing-estate-manager3', {});break;
            case '/daiketong/communityhouse-list2.html':res.render('daiketong/communityhouse-list2', {});break;
            case '/daiketong/communityhouse-list3.html':res.render('daiketong/communityhouse-list3', {});break;
            case '/daiketong/housing-estate-manager-add2.html':res.render('daiketong/housing-estate-manager-add2', {});break;
            case '/daiketong/fankui.html':res.render('daiketong/fankui', {});break;
        }
    });

};
