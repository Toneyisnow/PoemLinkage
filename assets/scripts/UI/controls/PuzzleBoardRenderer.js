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
var Utils = require('Utils');

require('PoemDefinition');
require('StageDefinition');
require('PuzzleDefinition');
require('PuzzleBoardProvider');

require('PuzzleNodeRenderer');

cc.Class({
    extends: cc.Component,

    properties: {
        
        boardWidth: 1,
        
        boardHeight: 1,
        
        poemDefinition: {
            default: null,
            type: cc.PoemDefinition,
        },
        
        puzzleDefinition: {
            default: null,
            type: cc.PuzzleDefinition,
        },
        
        stageDefinition: {
            default: null,
            type: cc.StageDefinition,
        },
        
        anchorStartPoint: {
            default: cc.v2(0, 0),
            type: cc.v2
        },
        
        anchorInterval: 64,
        
        puzzleBoardPrefab: cc.Prefab,
        
        connectLineHorizon: cc.Prefab,
        
        connectLineVertical: cc.Prefab,
        
        
        
        
        boardProvider: {
            default: null,
            type: cc.PuzzleBoardProvider,
        },
        
        boardRootNode: {
            default: null,
            type: cc.Node,
        },
        
        
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
    
        console.log('PuzzleBoard init.');
        
        this.stageDefinition = stageDefinition;
        this.poemDefinition = this.stageDefinition.poemDefinition;
        this.puzzleDefinition = this.stageDefinition.puzzleDefinition;
        
        if (!this.poemDefinition || !this.puzzleDefinition) {
        
            console.log('poemDefinition is null.');
            return;
        }
        
        var self = this;
        
        this.boardProvider = new cc.PuzzleBoardProvider(this);
        this.boardProvider.createBoard(this.stageDefinition);

        var size = this.boardProvider.getBoardSize();
        for (var i = 1; i <= size.x; ++i) {
            for (var j = 1; j <= size.y; ++j) {
        
                var character = this.boardProvider.getCharacterAt(cc.v2(i, j));
                
                if (character) {
                    self.renderPuzzleNodeToBoard(character, this.boardRootNode);
                }
            }
        }
    },

    onLoad () {
        
        var self = this;
        
        
    },
    
    renderPuzzleNodeToBoard(character, boardNode) {

        if (!character) {
            return undefined;
        }

        var self = this;        
        console.log('Rendering node with character: ', character.position.x, character.position.y, character.uniqueId, character.characterId);
        cc.GlobalStorage.loadCharacterSpriteFrame(character.characterId, character, function(characterSpriteFrame, chara) {
        
                        var node = new cc.Node();
                        node.name = self.getCharacterKey(chara);
                        
                        let charSprite = node.addComponent(cc.Sprite);
                        charSprite.spriteFrame = characterSpriteFrame;
                        
                        //var posX = self.anchorStartPoint.x + ii * self.anchorInterval;
                        //var posY = self.anchorStartPoint.y - jj * self.anchorInterval;
                        
                        //var posX = -160 + ii * 64;
                        //var posY = 226 - jj * 64;
                        
                        node.position = self.convertToPixelPosition(chara.position);
                        node.scale = 1;
                        // node.tag = cc.v2(ii, jj);
                        // node.on(cc.Node.EventType.TOUCH_END, this.onBoardClickedAt, this);
                        
                        
                        // var clickEventHandler = new cc.Component.EventHandler();
                        // clickEventHandler.target = self.node; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
                        // clickEventHandler.component = "PuzzleBoardRenderer";//这个是脚本文件名
                        // clickEventHandler.handler = "onBoardClickedAt"; //回调函名称
                        // clickEventHandler.customEventData = cc.v2(ii, jj); //用户数据
                        // 
                        // let button = node.addComponent(cc.Button); //获取cc.Button组件
                        // button.clickEvents.push(clickEventHandler);
                        
                        let puzzleNode = node.addComponent(cc.PuzzleNodeRenderer);
                        puzzleNode.character = chara;
                        puzzleNode.callbackNode = self.node;
                        puzzleNode.callbackComponentName = "PuzzleBoardRenderer";
                        puzzleNode.callbackHandlerName = "onBoardClickedAt";
                        
                        boardNode.addChild(node);
                    });
    },

    start () {

    },
    
    getCharacterKey(character) {

        return 'char_' + character.uniqueId + '_' + character.characterId;
    },

    ///getKeyforPosition(position) {
    ///    return 'char_' + position.x + '_' + position.y;
    ///},

    getNodeAtPosition(position) {
        
        // console.log("start getNodeAtPosition:", position.x, position.y);
        var subNodes = this.boardRootNode.children;
        for(var i = 0; i < subNodes.length; i++) {

            var subNode = subNodes[i];
            var puzzleNode = subNode.getComponent(cc.PuzzleNodeRenderer);
            if (!puzzleNode) {
                //// console.log("puzzleNode is null.");
                continue;
            }
            
            if (!puzzleNode || !puzzleNode.character || !puzzleNode.character.position) {
                continue;
            }

            //// console.log("got node at postion. character position:", puzzleNode.character.position.x, puzzleNode.character.position.y);
        
            if (Utils.areSameVec(puzzleNode.character.position, position)) {
                //// console.log("got node at position: ", position.x, position.y);
                return subNode;
            }
        }
        return undefined;
    },

    getNodeByUniqueId(unieuqId) {
        var subNodes = this.boardRootNode.children;
        for(var i = 0; i < subNodes.length; i++) {

            var subNode = subNodes[i];
            var puzzleNode = subNode.getComponent(cc.PuzzleNodeRenderer);
            if (!puzzleNode || !puzzleNode.character) {
                continue;
            }

            if (puzzleNode.character.uniqueId == uniqueId) {
                return subNode;
            }
        }
        return undefined;
    },

    getNodeByCharacterId(charId) {
        var subNodes = this.boardRootNode.children;
        for(var i = 0; i < subNodes.length; i++) {

            var subNode = subNodes[i];
            var puzzleNode = subNode.getComponent(cc.PuzzleNodeRenderer);
            if (!puzzleNode || !puzzleNode.character) {
                continue;
            }

            if (puzzleNode.character.characterId == charId) {
                return subNode;
            }
        }
        return undefined;
    },

    updateNodePosition(characterNode, newPosition) {
        var puzzleNode = characterNode.getComponent(cc.PuzzleNodeRenderer);
        if (!puzzleNode || !puzzleNode.character) {
            return;
        }
        
        puzzleNode.character.position = newPosition;
    },

    onBoardClickedAt: function (event, customEventData) {
        
        console.log('onBoardClickedAt');
        
        var node = event.target;
        if (!node || !customEventData) {
            console.log("onBoardClickedAt: empty event data detected.");
            return;
        }
        
        var character = customEventData;
        
        this.boardProvider.takeActionAt(character.position);
    },

    // --------------- Callbacks from Provider ---------------
    onChooseCharacterAt: function (position) {
    
        console.log('onChooseCharacterAt triggered.');
        
        var node = this.getNodeAtPosition(position);
        if (node) {
        
            console.log('Got node on ', position.x, position.y);
            
            // Play animation
            node.runAction(new cc.scaleTo(0.3, 0.6));
        }
    },
    
    // The two characters not match, or use click the firstPosition again. Cancel them.
    onUnchooseCharacterAt: function (position, firstPosition) {
    
        console.log('onUnchooseCharacterAt triggered.');
        
        var node = this.getNodeAtPosition(position);
        if (node) {
        
            // console.log('Got node on ', position.x, position.y);
            
            // Play animation
            node.runAction(cc.scaleTo(0.2, 0.5));
        }
        
        if (Utils.areSameVec(firstPosition, position)) {
            return;
        }
        
        var firstNode = this.getNodeAtPosition(firstPosition);
        if (firstNode) {
        
            // console.log('Got node on ', firstPosition.x, firstPosition.y);
            
            // Play animation
            firstNode.runAction(cc.scaleTo(0.2, 0.5));
        }
    },
    
    // The two characters are matching, but not connected, so cancel them
    onMatchNotConnected: function (position, firstPosition) {
        console.log('onMatchNotConnected triggered.');
    
        var interval = 0.06;
        var scale1 = 0.5;
        var scale2 = 0.6;
        
        var blinkAnimation = cc.sequence(cc.scaleTo(interval, scale1), cc.scaleTo(interval, scale2), cc.scaleTo(interval, scale1), cc.scaleTo(interval, scale2), cc.scaleTo(interval, scale1), cc.scaleTo(interval, scale2), cc.scaleTo(interval, scale1));
        var blinkAnimation2 = cc.sequence(cc.scaleTo(interval, scale1), cc.scaleTo(interval, scale2), cc.scaleTo(interval, scale1), cc.scaleTo(interval, scale2), cc.scaleTo(interval, scale1), cc.scaleTo(interval, scale2), cc.scaleTo(interval, scale1));
        
        var node = this.getNodeAtPosition(position);
        if (node) {
        
            // console.log('Got node on ', position.x, position.y);
            
            // Play animation
            node.runAction(blinkAnimation);
        }
        
        if (Utils.areSameVec(firstPosition, position)) {
            return;
        }
        
        var firstNode = this.getNodeAtPosition(firstPosition);
        if (firstNode) {
        
            // console.log('Got node on ', firstPosition.x, firstPosition.y);
            
            // Play animation
            firstNode.runAction(blinkAnimation2);
        }
    },

    // Connect from the firstPosition through connectPoints and to the position
    onConnected: function (position, firstPosition, connectPoints, targetChar) {
        
        console.log('onConnected triggered. points:', connectPoints, ' target character:', targetChar);
        
        var self = this;
        var node = this.getNodeAtPosition(position);
        var firstNode = this.getNodeAtPosition(firstPosition);
        if (!node || !firstNode) {
        
            console.log('onConnected: one of the node is undefined, ignore this.');
            return;
        }
        
        if (!connectPoints || connectPoints.length <= 0) {
            console.log('no connect points returned.');
            return;
        }
    
        // Show the lines connect them
        var lineNodes = [];
        for (var i = 1; i < connectPoints.length; i++) {
            var lastPoint = connectPoints[i - 1];
            var point = connectPoints[i];
            
            var lineNode = this.createLinePrefab(lastPoint, point);
            lineNodes.push(lineNode);
            // this.boardRootNode.addChild(lineNode);
        }
        
        this.playAnimationMergeChars(firstNode, node, lineNodes, function() {
            self.node.emit('receivedCharacter', targetChar);
        });
    },

    checkAndMakeShuffle: function () {

        var shuffledCharacters = this.boardProvider.checkShuffle();
        if (!shuffledCharacters || shuffledCharacters.length == 0) {
            return;
        }
        
        // Need to udpate the board to show new board
        for(var i = 0; i < shuffledCharacters.length; i++) {

            var character = shuffledCharacters[i];
            var existingNode = this.getNodeByUniqueId(character.uniqueId);
            if (existingNode) {
                // The Node is an existing node, make a move animation
                var newPosition = self.convertToPixelPosition(character.position);
                existingNode.runAction(cc.moveTo(0.3, newPosition));
                this.updateNodePosition(existingNode, newPosition);

            } else {
                // The Node is newly added, render it to the board
                this.renderPuzzleNodeToBoard(character, this.boardRootNode);
            }
        }
    },

    createLinePrefab: function(posA, posB) {
        
        var line = undefined;
        var startX = Utils.Min(posA.x, posB.x);
        var startY = Utils.Max(posA.y, posB.y);
        
        if (posA.x == posB.x) {
        
            line = cc.instantiate(this.connectLineVertical);
            line.position = this.convertToPixelPosition(cc.v2(startX, startY));
            line.anchorX = line.anchorY = 0;
            line.scaleY = Utils.Abs(posA.y, posB.y);
            
        } else if (posA.y == posB.y) {
            
            line = cc.instantiate(this.connectLineHorizon);
            line.position = this.convertToPixelPosition(cc.v2(startX, startY));
            line.anchorX = line.anchorY = 0;
            line.scaleX = Utils.Abs(posA.x, posB.x);
            
        } else {
            return undefined;
        }
        
        
        
        return line;
    },

    // Note: the position in the poem is starting from 1
    convertToPixelPosition: function(position) {
    
        var pixelX = this.anchorStartPoint.x + (position.x - 1) * this.anchorInterval;
        var pixelY = this.anchorStartPoint.y - (position.y - 1) * this.anchorInterval;
        
        return cc.v2(pixelX, pixelY);
    },
    
    playAnimationMergeChars: function(charNodeA, charNodeB, lineNodes, followUpAction) {
        
        var self = this;
        
        // Play animation
        charNodeA.runAction(cc.scaleTo(0.3, 0.8));
        charNodeB.runAction(cc.scaleTo(0.3, 0.8));
           
        for (var i = 0; i < lineNodes.length; i++) {
            this.boardRootNode.addChild(lineNodes[i]);
        }
        
        var delayAction = cc.delayTime(0.7);
        var finishAction = cc.callFunc(function () {
            
            charNodeA.removeFromParent();
            charNodeB.removeFromParent();
            
            for (var i = 0; i < lineNodes.length; i++) {
                lineNodes[i].removeFromParent();
            }
        }, this);

        var calbackAction = cc.callFunc(followUpAction, this);

        this.node.runAction(cc.sequence(delayAction, finishAction, calbackAction));
    }
    

    // update (dt) {},
});
