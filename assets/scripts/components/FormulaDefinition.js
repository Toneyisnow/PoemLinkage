// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

class FormulaDefinition {
    
    constructor() {
        
        this.sourceCharacterA = "";
        this.sourceCharacterB = "";
        this.targetCharacter = "";
    }
    
    static loadFromArray(arr) {
        
        if (arr == undefined || arr.length !== 3) {
            
            console.log('Formula length should be 3.');
            return undefined;
        }
        
        var definition = new FormulaDefinition();
        
        definition.sourceCharacterA = arr[0];
        definition.sourceCharacterB = arr[1];
        definition.targetCharacter = arr[2];
        
        return definition;
    }
    
};


cc.FormulaDefinition = FormulaDefinition;
