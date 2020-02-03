// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        
        hintBoard_2_5: cc.Prefab,
        
        hintBoard_2_7: cc.Prefab,
        
        hintBoard_4_5: cc.Prefab,
        
        hintBoard_4_7: cc.Prefab,
        
        puzzleBoard_Tiny: cc.Prefab,
        
        puzzleBoard_Small: cc.Prefab,
        
        puzzleBoard_Medium: cc.Prefab,
        
        puzzleBoard_Large: cc.Prefab,
        
        puzzleBoard_Huge: cc.Prefab,
        
        anchorHintBoard: {
            default: null,
            type: cc.Node,
        },
        
        anchorPuzzleBoard: {
            default: null,
            type: cc.Node,
        },
        
        hintBoard: {
            default: null,
            type: cc.HintBoard,
        },
        
        puzzleBoard: {
            default: null,
            type: cc.PuzzleBoard,
        },
        
        btnBack: {
            default: null,
            type: cc.Button,
        },
        
        btnRestart: {
            default: null,
            type: cc.Button,
        },
        
        btnFinish: {
            default: null,
            type: cc.Button,
        },
        
        stageId: 0,
        
        stageDefinition: {
            default: null,
            type: cc.StageDefinition,
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

    onLoad () {
        
        this.stageId = cc.sys.localStorage.getItem("stageId");
        
        this.btnBack.node.on("click", this.onBackToScene, this);
        this.btnRestart.node.on("click", this.onRefresh, this);
        this.btnFinish.node.on("click", this.onFinished, this);
        this.btnFinish.node.zIndex = -10;
        
        console.log('onLoad: got selectedStageId', this.stageId);
        cc.StageDefinition.loadFromFile(this.stageId, this.onLoadWithDefinition, this);
        
    },

    onLoadWithDefinition: function(self, definition) {
        
        console.log('onLoadWithDefinition');
        
        self.stageDefinition = definition;
            
        if (!self.stageDefinition) {
            console.log('stageDefinition is null.');
            return;
        }
        
        console.log('stageDefinition: ', JSON.stringify(self.stageDefinition.poemDefinition));
        
        if (self.stageDefinition.poemDefinition.columnCount == 5) {
            self.hintBoardNode = cc.instantiate(self.hintBoard_2_5);
        } else if (self.stageDefinition.poemDefinition.columnCount == 7) {
            self.hintBoardNode = cc.instantiate(self.hintBoard_2_7);
        }
            
        var hintBoardRenderer = self.hintBoardNode.getComponent('HintBoardRenderer');
        hintBoardRenderer.init(self.stageDefinition);
        
        //var testRenderer = self.hintBoardNode.getComponent('PuzzleBoardRenderer');
        //testRenderer.init(self.stageDefinition);
        
        self.anchorHintBoard.addChild(self.hintBoardNode);
        self.hintBoardNode.on('allclear', self.onAllClear, self);
        
        // Add PuzzleBoard on the middle
        var boardPrefab = self.puzzleBoard_Tiny;
        switch(self.stageDefinition.puzzleDefinition.boardSize) {
        
            case PuzzleBoardSize.TINY: {
                boardPrefab = self.puzzleBoard_Tiny;
                break;
            }
            case PuzzleBoardSize.SMALL: {
                boardPrefab = self.puzzleBoard_Small;
                break;
            }
            case PuzzleBoardSize.MEDIUM: {
                boardPrefab = self.puzzleBoard_Medium;
                break;
            }
            default: {
                break;
            }
        }

        console.log('boardPrefab type is:', typeof boardPrefab);

        self.puzzleBoardNode = cc.instantiate(boardPrefab);
        console.log('puzzleBoardNode:', typeof self.puzzleBoardNode);

        var puzzleBoardNodeRenderer = self.puzzleBoardNode.getComponent('PuzzleBoardRenderer');
        
        puzzleBoardNodeRenderer.init(self.stageDefinition);
        
        self.anchorPuzzleBoard.addChild(self.puzzleBoardNode);
        
        self.puzzleBoardNode.on('receivedCharacter', function(characterId) {
            var hintBoardRenderer = self.hintBoardNode.getComponent('HintBoardRenderer');
            hintBoardRenderer.onReceivedCharacter(characterId);
        });
    },

    start () {

    },

    onBackToScene: function(handle) {
        
        cc.director.loadScene("SelectStageScene");
    },

    onRefresh: function(handle) {
        
        cc.director.loadScene("MainGameScene");
    },

    onFinished: function(handle) {
        
        cc.director.loadScene("SelectStageScene");
    },

    onAllClear: function(isClear) {
    
        console.log("onAllClear: called.");

        if (isClear) {
            console.log('MainGameScene: onAllClear!!');
            this.btnFinish.node.zIndex = 10;

            var record = cc.StageRecord.loadData(this.stageId);
            record.setStatus(2);
            record.setScore(3);
            record.saveData();

        } else {
            
            console.log('MainGameScene: check and make shuffle');
            var puzzleBoardNodeRenderer = this.puzzleBoardNode.getComponent('PuzzleBoardRenderer');
            puzzleBoardNodeRenderer.checkAndMakeShuffle();
        }
    },
});
