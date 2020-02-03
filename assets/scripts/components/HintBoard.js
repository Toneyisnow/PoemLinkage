// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

class HintBoard {
    
    constructor() {
        
        this.charCount = 0;
        this.charList = [];
        this.isCharUncovered = [];
    }
    
    pushCharacter(charId) {
    
        this.charCount ++;
        this.charList.push(charId);
        this.isCharUncovered.push(false);
    }
    
    setUncoveredAt(charIndex) {
    
        if (charIndex < 0 || charIndex >= this.charCount) {
            console.log('charIndex out of range.');
            return;
        }
        
        this.isCharUncovered[charIndex] = true;
    }
    
    isUncoveredAt(charIndex) {
        
        if (charIndex < 0 || charIndex >= this.charCount) {
            console.log('charIndex out of range.');
            return;
        }
        
        return this.isCharUncovered[charIndex];
        
    }
    
};


cc.HintBoard = HintBoard;
