// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

class GlobalStorage {
    
    constructor() {
        
    }
    
    static characterAtlas_fzlb = undefined;
    
    static loadCharacterSpriteFrame(characterId, character, onLoadedCallback) {
    
        console.log('loadCharacterSpriteFrame: characterId = ', characterId);
        cc.loader.loadRes("characters/fzlb-n-0", cc.SpriteAtlas, function (err, atlas) {
            
            var frame = atlas.getSpriteFrame('c_' + characterId);
            if (frame != undefined) {
                console.log("Loaded!");
                onLoadedCallback(frame, character);
                return;
            } else {

                console.log("Failed! loading from 1.");
                cc.loader.loadRes("characters/fzlb-n-1", cc.SpriteAtlas, function (err, atlas) {
                    var frame = atlas.getSpriteFrame('c_' + characterId);
                    if (frame != undefined) {
                        onLoadedCallback(frame, character);
                        return;
                    }
                });
            }
            
        });
    }
};

module.exports = GlobalStorage;


cc.GlobalStorage = GlobalStorage;

