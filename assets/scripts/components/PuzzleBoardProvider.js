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

var Utils = require('Utils');
require('StageDefinition');
require('PoemDefinition');
require('PuzzleDefinition');

var PuzzleBoard = require('PuzzleBoard');
var PuzzleBoardStatus = PuzzleBoard.PuzzleBoardStatus;


class PuzzleBoardProvider {

    constructor(handler) {

        this.board = undefined;

        this.stageDefinition = undefined;
        this.poemDefinition = undefined;
        this.puzzleDefinition = undefined;

        this.handler = handler;
    }

    createBoard(stageDefinition) {

        if (!stageDefinition) {
            return;
        }

        this.stageDefinition = stageDefinition;
        this.poemDefinition = stageDefinition.poemDefinition;
        this.puzzleDefinition = stageDefinition.puzzleDefinition;

        console.log('PuzzleBoardProvider: creating PuzzleBoard.');
        this.board = new cc.PuzzleBoard();

        var size = this.translateBoardSize(this.puzzleDefinition.boardSize);
        this.board.width = size.x;
        this.board.height = size.y;

        this.board.validTargetCharacters = this.composeValidTargetChars();
        this.board.targetCharacters = this.composeTargetChars();

        var appearingCharacterList = this.generateAppearingChars(this.board.targetCharacters);
        for(var i = 0; i < appearingCharacterList.length; i++) {
            this.board.pushCharacter(appearingCharacterList[i]);
        }
        console.log('PuzzleBoardProvider: puzzleCharacters:', this.board.puzzleCharacters);

        this.board.characterMatrix = this.generateMatrix(this.board.puzzleCharacters);
        console.log('PuzzleBoardProvider: matrix:', this.board.characterMatrix);

        return this.board;
    }

    getBoardSize() {

        return cc.v2(this.board.width, this.board.height);
    }

    composeValidTargetChars() {

        var targetCharacters = [];

        let lines = this.puzzleDefinition.selectedLines;
        for (var i = 0; i < lines.length; ++i) {
            for (var j = 0; j < this.poemDefinition.columnCount; ++j) {

                var charIndex = i * this.poemDefinition.columnCount + j;
                if (this.puzzleDefinition.isUncoveredChar(charIndex)) {
                    continue;
                }

                var characterId = this.poemDefinition.content[lines[i]][j];
                targetCharacters.push(characterId);
            }
        }

        console.log('PuzzleBoardProvider: validTargetCharacters:', targetCharacters);
        return targetCharacters;
    }

    composeTargetChars() {

        var targetCharacters = [];

        let lines = this.puzzleDefinition.selectedLines;
        for (var i = 0; i < lines.length; ++i) {
            for (var j = 0; j < this.poemDefinition.columnCount; ++j) {

                var charIndex = i * this.poemDefinition.columnCount + j;
                if (this.puzzleDefinition.isUncoveredChar(charIndex)) {
                    continue;
                }

                var characterId = this.poemDefinition.content[lines[i]][j];
                targetCharacters.push(characterId);
            }
        }

        var noiseCharacters = this.puzzleDefinition.noiseChars;
        for (var i = 0; i < noiseCharacters.length; ++i) {

            targetCharacters.push(noiseCharacters[i]);
        }

        console.log('PuzzleBoardProvider: targetCharacters:', targetCharacters);
        return targetCharacters;
    }

    generateAppearingChars(targetCharacters) {
       
        var appearingChars = [];
        for (var i = 0; i < targetCharacters.length; ++i) {

            var characterId = targetCharacters[i];
            var formula = this.stageDefinition.findFormulaDefinition(characterId);
            if (formula) {
                appearingChars.push(formula.sourceCharacterA);
                appearingChars.push(formula.sourceCharacterB);
            }
        }

        return appearingChars;
    }

    generateAndEnsureMatrix(puzzleCharacters) {

        while(true) {

            var matrix = generateMatrix(puzzleCharacters);
            if (!this.isMatrixDeadlock(matrix)) {
                return matrix;
            }
        }
        return undefined;
    }

    generateMatrix(puzzleCharacters) {

        //var characterMatrix = new Array(this.board.width);
        var characterMatrix = [];
        for (var i = 0; i <= this.board.width + 1; ++i) {

            //characterMatrix[i] = new Array(this.board.height);
            characterMatrix[i] = [];
        }

        for (var i = 0; i < puzzleCharacters.length; ++i) {
            this.placeCharacterInMatrix(puzzleCharacters[i], characterMatrix);
        }

        return characterMatrix;
    }

    placeCharacterInMatrix(puzzleChar, matrix) {

        if (!puzzleChar || !puzzleChar.characterId || !matrix) {
            return cc.v2(-1, -1);
        }

        var x = Utils.randomInteger(this.board.width) + 1;
        var y = Utils.randomInteger(this.board.height) + 1;

        while(matrix[x][y]) {
            x = Utils.randomInteger(this.board.width) + 1;
            y = Utils.randomInteger(this.board.height) + 1;
        }

        matrix[x][y] = puzzleChar;
        puzzleChar.position = cc.v2(x, y);
    }

    // Check whether need to shuffle, and return the shuffled new puzzle characters if needed
    checkShuffle() {

        var newMatrix = [];
        var hasShuffled = false;

        var missingChars = this.checkBoardMissingChar();
        if (missingChars && missingChars.length > 0) {

            console.log("checkShuffle: Missing character found.");
            for(var i = 0; i < missingChars.length; i++) {

                console.log("Missing character: ", missingChars[i]);

                // Add the missing char into the matrix
                var missingChar = this.board.pushCharacter(missingChars[i]);
                this.placeCharacterInMatrix(missingChar, this.board.matrix);
            }

            newMatrix = this.generateAndEnsureMatrix(this.board.puzzleCharacters);
            hasShuffled = true;
        }

        if (this.isMatrixDeadlock(this.board.matrix)) {

            newMatrix = this.generateAndEnsureMatrix(this.board.puzzleCharacters);
            hasShuffled = true;
        }

        if (!hasShuffled) {
            return undefined;
        }

        this.board.matrix = newMatrix;
        return this.board.puzzleCharacters;
    }

    isMatrixDeadlock(matrix) {

        for(var i = 1; i <= this.board.width; i++) {
            for(var j = 1; j <= this.board.height; j++) {
            
                for(var ii = 1; ii <= this.board.width; ii++) {
                    for(var jj = 1; jj <= this.board.height; jj++) {
                    
                        if (i == ii && j == jj) {
                            continue;
                        }

                        var charA = matrix[i][j];
                        var charB = matrix[ii][jj];
                        
                        if (this.areCharactersMatching(charA, charB)) {

                            var connect = this.connectCharacters(charA, charB)
                            if (connect && connect.length > 0) {
                                return false;
                            }
                        }
                    }
                }
            }
        }

        return true;
    }

    checkBoardMissingChar() {

        var missingChars = [];
        for (var i = 0; i < this.board.validTargetCharacters.length; ++i) {

            var characterId = this.board.validTargetCharacters[i];
            var formula = this.stageDefinition.findFormulaDefinition(characterId);
            if (formula) {

                if (!this.getCharacter(formula.sourceCharacterA)) {
                    missingChars.push(formula.sourceCharacterA);
                }
                
                if (!this.getCharacter(formula.sourceCharacterB)) {
                    missingChars.push(formula.sourceCharacterB); 
                }
            }
        }

        return missingChars;
    }
    
    // When player choose character on the position
    takeActionAt(position) {

        if (this.board.status == PuzzleBoardStatus.IDLE) {

            this.board.lastSelectedPosition = position;
            this.board.status = PuzzleBoardStatus.ONE_SELECTED;

            this.handler.onChooseCharacterAt(position);

        } else {

            var matchingFormula = this.areCharactersMatching(position, this.board.lastSelectedPosition);
            if (Utils.areSameVec(position, this.board.lastSelectedPosition) || !matchingFormula) {

                this.board.status = PuzzleBoardStatus.IDLE;
                this.handler.onUnchooseCharacterAt(position, this.board.lastSelectedPosition);
                return;
            }

            var connectionPoints = this.connectCharacters(this.board.lastSelectedPosition, position);
            if (connectionPoints && connectionPoints.length > 0) {

                // Remove the characters
                this.clearCharacterAt(this.board.lastSelectedPosition);
                this.clearCharacterAt(position);

                // Remove the valid target character
                this.board.clearValidTargetCharacter(matchingFormula.targetCharacter);

                this.board.status = PuzzleBoardStatus.IDLE;
                this.handler.onConnected(position, this.board.lastSelectedPosition, connectionPoints, matchingFormula.targetCharacter);
            } else {

                this.board.status = PuzzleBoardStatus.IDLE;

                this.handler.onMatchNotConnected(position, this.board.lastSelectedPosition);
            }

        }
    }

    areCharactersMatching(posA, posB) {

        var charA = this.getCharacterAt(posA);
        var charB = this.getCharacterAt(posB);
        if (!charA || !charB) {
            return false;
        }

        console.log("areCharactersMatching: charA:", charA.characterId, " charB:", charB.characterId);

        return this.stageDefinition.matchFormulaDefinition(charA.characterId, charB.characterId);
    }

    connectCharacters(posA, posB) {

        console.log('connectCharacters');

        // Check One Connection
        if (posA.x == posB.x && this.areDirectConnected(posA, posB)
            || posA.y == posB.y && this.areDirectConnected(posA, posB)) {
            return [posA, posB];
        }
        console.log('connectCharacters: check one connection failed.');

        // Check Two Connection
        var candidate = cc.v2(posA.x, posB.y);
        if (!this.getCharacterAt(candidate) && this.areDirectConnected(posA, candidate) && this.areDirectConnected(candidate, posB)) {
            return [posA, candidate, posB];
        }
        candidate = cc.v2(posB.x, posA.y);
        if (!this.getCharacterAt(candidate) && this.areDirectConnected(posA, candidate) && this.areDirectConnected(candidate, posB)) {
            return [posA, candidate, posB];
        }
        console.log('connectCharacters: check two connection failed.');

        // Check Three Inner Connection
        if (posA.x != posB.x) {

            var deltaX = (posA.x < posB.x ? 1 : -1);
            var iter = posA.x + deltaX;
            while (iter != posB.x) {
                var candidate1 = cc.v2(iter, posA.y);
                var candidate2 = cc.v2(iter, posB.y);
                if (!this.getCharacterAt(candidate1) && !this.getCharacterAt(candidate2)
                    && this.areDirectConnected(posA, candidate1) && this.areDirectConnected(candidate1, candidate2) && this.areDirectConnected(candidate2, posB) ) {
                    return [posA, candidate1, candidate2, posB];
                }
                iter = iter + deltaX;
            }
        }
        if (posA.y != posB.y) {

            var deltaY = (posA.y < posB.y ? 1 : -1);
            var iter = posA.y + deltaY;
            while (iter != posB.y) {
                var candidate1 = cc.v2(posA.x, iter);
                var candidate2 = cc.v2(posB.x, iter);
                if (!this.getCharacterAt(candidate1) && !this.getCharacterAt(candidate2)
                    && this.areDirectConnected(posA, candidate1) && this.areDirectConnected(candidate1, candidate2) && this.areDirectConnected(candidate2, posB) ) {
                    return [posA, candidate1, candidate2, posB];
                }
                iter = iter + deltaY;
            }
        }
        console.log('connectCharacters: check three inner connection failed.');

        // Check Three Outter Connection
        var minX = Utils.Min(posA.x, posB.x);
        var maxX = Utils.Max(posA.x, posB.x);
        var minY = Utils.Min(posA.y, posB.y);
        var maxY = Utils.Max(posA.y, posB.y);

        for(var i = maxX + 1; i <= this.board.width + 1; i++) {

            var candidate1 = cc.v2(i, posA.y);
            var candidate2 = cc.v2(i, posB.y);
            if (!this.getCharacterAt(candidate1) && !this.getCharacterAt(candidate2)
                && this.areDirectConnected(posA, candidate1) && this.areDirectConnected(candidate1, candidate2) && this.areDirectConnected(candidate2, posB) ) {
                return [posA, candidate1, candidate2, posB];
            }
        }
        for(var i = minX - 1; i >= 0; i--) {

            var candidate1 = cc.v2(i, posA.y);
            var candidate2 = cc.v2(i, posB.y);
            if (!this.getCharacterAt(candidate1) && !this.getCharacterAt(candidate2)
                && this.areDirectConnected(posA, candidate1) && this.areDirectConnected(candidate1, candidate2) && this.areDirectConnected(candidate2, posB) ) {
                return [posA, candidate1, candidate2, posB];
            }
        }
        for(var j = maxY + 1; j <= this.board.height + 1; j++) {

            var candidate1 = cc.v2(posA.x, j);
            var candidate2 = cc.v2(posB.x, j);
            if (!this.getCharacterAt(candidate1) && !this.getCharacterAt(candidate2)
                && this.areDirectConnected(posA, candidate1) && this.areDirectConnected(candidate1, candidate2) && this.areDirectConnected(candidate2, posB) ) {
                return [posA, candidate1, candidate2, posB];
            }
        }
        for(var j = minY - 1; j >= 0; j--) {

            var candidate1 = cc.v2(posA.x, j);
            var candidate2 = cc.v2(posB.x, j);
            if (!this.getCharacterAt(candidate1) && !this.getCharacterAt(candidate2)
                && this.areDirectConnected(posA, candidate1) && this.areDirectConnected(candidate1, candidate2) && this.areDirectConnected(candidate2, posB) ) {
                return [posA, candidate1, candidate2, posB];
            }
        }
        console.log('connectCharacters: check three outer connection failed.');


        return [];
    }

    // Simple check for two points to be connected
    areDirectConnected(posA, posB) {

        if (posA.x == posB.x) {

            var begin = (posA.y < posB.y ? posA.y : posB.y);
            var end = (posA.y > posB.y ? posA.y : posB.y);

            for(var i = begin + 1; i < end; i++) {
                if (this.getCharacterAt(cc.v2(posA.x, i))) {
                    return false;
                }
            }
            return true;

        } else if (posA.y == posB.y) {

            var begin = (posA.x < posB.x ? posA.x : posB.x);
            var end = (posA.x > posB.x ? posA.x : posB.x);

            for(var i = begin + 1; i < end; i++) {
                if (this.getCharacterAt(cc.v2(i, posA.y))) {
                    return false;
                }
            }
            return true;
        }

        // If A and B are not in the same line, just return false.
        return false;
    }

    clearCharacterAt(position) {

        var character = this.getCharacterAt(position);
        if (character && this.board.characterMatrix[position.x]) {
            this.board.characterMatrix[position.x][position.y] = undefined;
        }

        // Remove from the appearing chars
        if (character) {
            for(var i = 0; i < this.board.puzzleCharacters.length; i++) {
                if (character.uniqueId == this.board.puzzleCharacters[i].uniqueId) {
                    this.board.puzzleCharacters.splice(i, 1);
                    break;
                }
            }
        }
    }

    // Check whether a given character exsits in the board, if Yes, return the position
    getCharacter(characterId) {

        for(var i = 1; i <= this.board.width; i++) {
            for(var j = 1; j <= this.board.height; j++) {

                var position = cc.v2(i, j);
                var charId = this.getCharacterAt(position);
                if (charId && charId.characterId && charId.characterId == characterId) {
                    return position;
                }
            }
        }

        return undefined;
    }

    getCharacterAt(position) {

        // console.log('retrieving character at ', x, y);

        if (this.board.characterMatrix[position.x]) {
            return this.board.characterMatrix[position.x][position.y];
        } else {
            console.log('getCharacterAt error: matrix exceeded: ', position.x, position.y);
        }
    }

    translateBoardSize(boardType) {

        switch(boardType) {
            case PuzzleBoardSize.TINY: {
                return cc.v2(5, 6);
                break;
            }
            case PuzzleBoardSize.SMALL: {
                return cc.v2(6, 8);
                break;
            }
            case PuzzleBoardSize.MEDIUM: {
                return cc.v2(8, 10);
                break;
            }
            case PuzzleBoardSize.LARGE: {
                return cc.v2(9, 12);
                break;
            }
            case PuzzleBoardSize.HUGE: {
                return cc.v2(10, 14);
                break;
            }
            default: {
                return cc.v2(6, 8);

            }
        }
    }

};

cc.PuzzleBoardProvider = PuzzleBoardProvider;
