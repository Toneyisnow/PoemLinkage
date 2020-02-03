// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

class PoemDefinition {
    
    constructor() {
        
        this.id = 0;
        
        this.title = [];
        this.author = [];
        this.content = [];
        this.lineCount = 0;
        this.columnCount = 0;
    }
    
    static loadFromJsonText(jsonObject) {
        
        var poem = new cc.PoemDefinition();
        
        poem.id = jsonObject.id;
        poem.title = jsonObject.title;
        poem.author = jsonObject.author;
        poem.content = jsonObject.content;
        poem.lineCount = jsonObject.line_count;
        poem.columnCount = jsonObject.column_count;
        
        return poem;
    }  
};

cc.PoemDefinition = PoemDefinition;
