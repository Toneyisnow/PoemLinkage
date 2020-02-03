// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

require('GlobalStorage');

require('PoemDefinition');
require('StageDefinition');
require('PuzzleDefinition');
require('HintBoard');

cc.Class({
    extends: cc.Component,

    properties: {
        
        boardWidth: 1,
        
        boardHeight: 1,
        
        poemId: 0,
        
        poemDefinition: {
            default: null,
            type: cc.PoemDefinition
        },
        
        puzzleDefinition: {
            default: null,
            type: cc.PuzzleDefinition
        },
        
        stageDefinition: {
            default: null,
            type: cc.StageDefinition
        },
        
        characterAnchors: {
            default: [],
            type: cc.Node
        },
        
        poemBoardPrefab: cc.Prefab,
        
        hintBoard: cc.HintBoard,
        
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    init: function(stageDefinition) {
    
        console.log('PoemBoard init.');
        
        this.stageDefinition = stageDefinition;
        this.poemDefinition = this.stageDefinition.poemDefinition;
        this.puzzleDefinition = this.stageDefinition.puzzleDefinition;
        
    },


    onLoad () {
        
        if (!this.poemDefinition) {
        
            console.log('poemDefinition is null.');
            return;
        }
        
        var self = this;
        
        //cc.loader.loadRes("characters/chars_fzlb", cc.SpriteAtlas, function (err, atlas) {
            
        //    var frame = atlas.getSpriteFrame('c_7eb7');
        //    self.testSprite.spriteFrame = frame;
        //});
        
        let lines = this.puzzleDefinition.selectedLines;
        
        let lineCount = this.poemDefinition.lineCount;
        let columnCount = this.poemDefinition.columnCount;
        this.hintBoard = new cc.HintBoard();
        
        
        //cc.loader.loadRes("characters/chars_fzlb", cc.SpriteAtlas, function (err, atlas) {
            
        //    var frame = atlas.getSpriteFrame('c_7eb7');
            
            //var node = new cc.Node();
            //let charSprite = node.addComponent(cc.Sprite);
            //charSprite.spriteFrame = frame;
            //node.zIndex = 10;
            
            //anchor.addChild(node);
            
        //    self.testSprite.spriteFrame = frame;
        //});
        
        console.log('onLoad: loading PoemDefinitions. Total length: ', lineCount, columnCount);
        console.log('selectedLines: ', lines);
        for (var i = 0; i < lines.length; ++i) {
            for (var j = 0; j < columnCount; ++j) {
                
                var characterId = this.poemDefinition.content[lines[i]][j];
                this.hintBoard.pushCharacter(characterId);
                
                var character = new cc.PuzzleCharacter();
                character.characterId = characterId;
                character.position = cc.v2(i, j);
                cc.GlobalStorage.loadCharacterSpriteFrame(characterId, character, function(characterSpriteFrame, chara) {
        
                    var node = new cc.Node();
                    let charSprite = node.addComponent(cc.Sprite);
                    charSprite.spriteFrame = characterSpriteFrame;
                    
                    var charIndex = chara.position.x * columnCount + chara.position.y;
                    var anchor = self.characterAnchors[charIndex];
                    console.log('anchor position:', anchor.position.x, anchor.position.y);
                    
                    anchor.addChild(node, 1, self.getCharacterTag(charIndex));
                    node.position = cc.v2(0, 0);
                    
                    console.log('checking uncovered for charIndex: ', charIndex);
                    if (self.puzzleDefinition.isUncoveredChar(charIndex)) {
                        
                        self.hintBoard.setUncoveredAt(charIndex);
                        self.setCharUncoveredEffect(anchor, true);
                    } else {
                        self.setCharCoveredEffect(anchor);
                    }
                });
            }
        }
    },
    
    getCharacterTag: function(index) {
        return 'char_' + index;
    },
    
    // On this board has received character
    onReceivedCharacter: function(characterId) {
        
        console.log('HintBoardRenderer onReceivedCharacter: ', characterId);
        var foundChar = -1;
        for (var i = 0; i < this.hintBoard.charCount; i++) {
            // console.log('HintBoardRenderer: comparing char:', this.hintBoard.charList[i], characterId);
            if (this.hintBoard.charList[i] == characterId && !this.hintBoard.isUncoveredAt(i)) {

                foundChar = i;
                break;
            }                
        }

        if (foundChar < 0) {
            return;
        }

        this.hintBoard.setUncoveredAt(i);
                
        var anchor = this.characterAnchors[i];
        if (anchor) {
            this.setCharUncoveredEffect(anchor, true);
        }
                
        this.node.emit('allclear', this.isBoardAllClear());
        return;
    },
    
    isBoardAllClear: function() {
    
        for (var i = 0; i < this.hintBoard.charCount; i++) {
            if (!this.hintBoard.isUncoveredAt(i)) {
                return false;
            }
        }
        
        return true;
    },
    
    setCharUncoveredEffect: function(node, hasAnimation) {
        node.opacity = 255;
        
        if (hasAnimation) {
        
            var ani1 = cc.scaleTo(0.1, 1.2);
            var ani2 = cc.scaleTo(0.8, 1.0);
            node.runAction(cc.sequence(ani1, ani2));
        }
    },
    
    setCharCoveredEffect: function(node) {
        node.opacity = 64;
    },
    

    start () {

    },

});
