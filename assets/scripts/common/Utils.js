// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html



class Utils {
    
    constructor() {
    }
    
    // This will generate integer between 0 and maxValue - 1
    static randomInteger(maxValue) {
    
        return Math.floor(Math.random() * maxValue);
    }
    
    
    static areSameVec(vec1, vec2) {
    
        return (vec1 && vec2 && (vec1.x == vec2.x) && (vec1.y == vec2.y));
    }
    
    static Min(val1, val2) {
    
        return (val1 < val2 ? val1 : val2);
    }
    
    static Max(val1, val2) {
    
        return (val1 > val2 ? val1 : val2);
    }
    
    static Abs(val1, val2) {
        
        return (val1 > val2 ? val1 - val2 : val2 - val1);
    }
    
};


module.exports = Utils;
