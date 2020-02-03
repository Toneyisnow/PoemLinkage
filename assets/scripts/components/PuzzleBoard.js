// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var Utils = require('Utils');

const PuzzleBoardStatus = {
    IDLE: 0,
    ONE_SELECTED: 1
};

class PuzzleCharacter {

    constructor(uniqueId, charId) {
        this.uniqueId = uniqueId;
        this.characterId = charId;

        this.position = cc.v2(-1, -1);
    }
};

class PuzzleBoard {

    constructor() {

        this.width = 0;
        this.height = 0;

        this.characterUniqueId = 0;

        this.validTargetCharacters = [];
        this.targetCharacters = [];
        this.puzzleCharacters = [];
        this.targetCharacters = [];
        this.characterMatrix = [];

        this.status = PuzzleBoardStatus.IDLE;
        this.lastSelectedPosition = cc.v2(-1, -1);
    }

    pushCharacter(characterId) {

        var character = new PuzzleCharacter(this.characterUniqueId++, characterId);
        this.puzzleCharacters.push(character);

        return character;
    }

    removeCharacter(uniqueId) {

        for(var i = 0; i < this.puzzleCharacters.length; i++) {
            if (this.puzzleCharacters.uniqueId == uniqueId) {
                this.puzzleCharacters.splice(i, 1);
                return;
            }
        }
    }

    clearValidTargetCharacter(characterId) {

        for(var i = 0; i < this.validTargetCharacters.length; i++) {
            if (this.validTargetCharacters[i] == characterId) {
                this.validTargetCharacters.splice(i, 1);
                return;
            }
        }
    }

    getCharacterByUniqueId(uniqueId) {
        for(var i = 0; i < this.puzzleCharacters.length; i++) {
            if (this.puzzleCharacters.uniqueId == uniqueId) {
                return this.puzzleCharacters[i];
            }
        }
    }

};

module.exports = {
	PuzzleBoardStatus: PuzzleBoardStatus
};

cc.PuzzleCharacter = PuzzleCharacter;
cc.PuzzleBoard = PuzzleBoard;
