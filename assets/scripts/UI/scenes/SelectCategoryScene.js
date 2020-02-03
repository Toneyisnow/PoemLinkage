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

        btnCategoryTitle: {
            default: null,
            type: cc.Button,
        },
        
        btnLeft: {
            default: null,
            type: cc.Button,
        },
        
        btnRight: {
            default: null,
            type: cc.Button,
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
        
        this.categoryId = cc.sys.localStorage.getItem("selectedCategoryId");
        
        this.btnCategoryTitle.node.on("click", this.onTitleClicked, this);
        this.btnLeft.node.on("click", this.onLeftClicked, this);
        this.btnRight.node.on("click", this.onRightClicked, this);
        
        
    },

    start () {

    },

    
    onTitleClicked: function(button) {
        
        cc.director.loadScene("SelectStageScene");
    },
    
    onLeftClicked: function(button) {
        
        cc.director.loadScene("SelectStageScene");
    },

    onRightClicked: function(button) {
        
        cc.director.loadScene("SelectStageScene");
    },

});
