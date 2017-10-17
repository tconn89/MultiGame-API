BinaryFile = require('../models/binary_file')
saveURLs = ['/upload','/map_permission_level'];
loadURLs = ['/binary'];

MapPermission = function(){};
isOwner = function(map, user){ return map.user_id == user.id; }
isPrivate = function(map){ return map.permission_level_id == 1; };
isPublic = function(map){ return map.permission_level_id == 3; };
isSaveURL = function(url){
  baseURL = url.substring(0, url.indexOf('?'));
  return saveURLs.includes(baseURL);
};
isLoadURL = function(url){
  baseURL = url.substring(0, url.indexOf('?'));
  return loadURLs.includes(baseURL);
};
MapPermission.prototype.isAllowed = function(req, res, next){
  mapName = req.query.map_name;
  // seems bad
  if(!mapName )
    return next()

  BinaryFile.findOne({map_name: mapName}, function(err, map){
    if(err)
      console.error(err);
    console.log('Does user own map?');
    //Does map exist?
    if(!map || map.guest)
      return next()
    // if user owns the map, all good -- no logic
    if(isOwner(map, req.user))
      return next();
    // can the user save or load this map?
    // assume user does not own the map
    if(isSaveURL(req.url)){
      //check that its public
      console.log('Is map public?');
      if(isPublic(map))
        return next()
      else {
        log = `${req.user.username} cannot save map with ${map.getPermissionLevel()} level`;
        res.status(401).send(log);
      }
    } else if(isLoadURL(req.url)) {
      //check that its not private
      if(!isPrivate(map))
        return next()
      else {
        log = `${req.user.username} cannot load map with ${map.getPermissionLevel()} level`;
        res.status(401).send(log);
      }
    } else {
      // Not a permissions endpoint
      return next();
    }
  });
};
module.exports = MapPermission;
