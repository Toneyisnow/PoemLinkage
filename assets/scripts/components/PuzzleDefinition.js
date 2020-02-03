// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var PuzzleBoardSize = require('Constants').PuzzleBoardSize;


class PuzzleDefinition {
    
    constructor() {
        
        this.selectedLines = [];
        this.uncoveredChars = [];
        this.noiseChars = [];
        this.boardSize = PuzzleBoardSize.SMALL;
    }
    
    static loadFromJsonText(jsonObject) {
        
        var puzzle = new cc.PuzzleDefinition();
        
        puzzle.selectedLines = jsonObject.selected_lines;
        puzzle.uncoveredChars = jsonObject.uncovered_chars;
        puzzle.noiseChars = jsonObject.noise_chars;
        puzzle.boardSize = jsonObject.panel_size;
        
        return puzzle;
    }
    
    isUncoveredChar(charIndex) {
        
        // console.log('uncoveredChars list:', this.uncoveredChars);
        
        return this.uncoveredChars.some(function(cIndex) {
            
            if (cIndex == charIndex) {
                return true;
            }
        });
    }
    
};


cc.PuzzleDefinition = PuzzleDefinition;
