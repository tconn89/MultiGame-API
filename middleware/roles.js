var rolesReference = require('./roles_config');


var permissions = (function () {

  var getRoles = function (role) {
    if(!role)
      role = 'user';

    var rolesArr = [];

    if (typeof role === 'object' && Array.isArray(role)) {

        // Returns selected roles   
        for (var i = 0, len = role.length; i < len; i++) {
            rolesArr.push(rolesReference[role[i]]);
        };
        return rolesArr;

    } else if (typeof role === 'string' || !role) {

        // Returns all roles
        console.log('role: ' + role);
        if (!role) {
            for (var role in rolesReference) {
                rolesArr.push(rolesReference[role]);
            };
        }   

        // Returns single role

        console.log('rolesArr: ' + rolesArr);
        rolesArr.push(rolesReference[role]);
        return rolesArr;

    }

},
check = function (action, resource, loginRequired) {

    return function(req, res, next) {

        var isAuth = req.isAuthenticated();

        // If user is required to be logged in & isn't
        if (loginRequired  && !isAuth) {
            return next(new Error("You must be logged in to view this area"));
        }

        if (isAuth || !loginRequired) {

            // Just check first role of user for now
            var authRole = isAuth ? req.user.roles[0] : 'user', 
                role =  getRoles(authRole),
                hasPermission = false;

            console.log('role: ' + role);
            (function () {
                for (var i = 0, len = role[0].resource.length; i < len; i++){
                    if (role[0].resource[i].id === resource && role[0].resource[i].permissions.indexOf(action) !== -1) {
                        console.log(role[0])
                        console.log(role[0].resource[i])
                        console.log(role[0].resource[i].permissions)
                        hasPermission = true;
                        return;
                    }
                };
            })();

            if (hasPermission) {
                console.log('has permission');
                next();
            } else {
                console.log('does not have permission');
                return res.status(401).send("You are trying to " + action + " a " + resource + " and do not have the correct permissions.");
            }

        }
    }
}

return {
    get : function (role) {

        var roles = getRoles(role);

        return roles;
    },
    check : function (action, resource, loginRequired = true) {
        return check(action, resource, loginRequired);
    }
}

})();

module.exports = permissions;