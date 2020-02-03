// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


class StageRecord {
    
    constructor() {

        // Data: status=0/1/2 score=0/1/2/3
        this._data = {};
        this._stageId = 0;
    }
    
    hasFinished() {
        return this._data.status == 2;
    }
    
    isLocked() {
        return this._data.status == 0;
    }
    
    getScore() {
        return this.score;
    }
    
    setStatus(status) {
        this._data.status = status;
    }

    setScore(score) {
        this._data.score = score;
    }

    static createTest() {
        
        var record = new cc.StageRecord();
        record.hasFinished = false;
        record.score = 3;

        return record;
    }

    static loadData(stageId) {

        var loadedData = JSON.parse(cc.sys.localStorage.getItem('stage_' + stageId));
       
        if (loadedData == undefined || loadedData.score == undefined) {
            loadedData = { "status": 0, "score": 0 };
        }

        var record = new cc.StageRecord();
        record.stageId = stageId;
        record._data = loadedData;

        return record;
    }

    saveData() {
        cc.sys.localStorage.setItem("stage_" + stageId, JSON.stringify(this._data));
    }
};

cc.StageRecord = StageRecord;
