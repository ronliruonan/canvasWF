
import {Game, gameInfo} from './Game';
import GameObject from './GameObject';
import {Tool} from './Tool';
/**
 * 当前组件的信息
 */ 
//存放添加了button事件的相关的节点
let bttonEventDownList=[]
export default class Button{
    constructor(scope){
        this.componentInfo={
            constructor:null,//当初实力本组件的原型 
            self:null,//当前的作用域
        }
        this.componentInfo.constructor = scope;  
  

    }  
    /*传入Event对象*/
    /**
     * 传入canvas 与 鼠标点击的Event
     * @param{canvas} element
     * @param{event} event
     * @returns {{x: number, y: number}}
     */
    getPoint(element, event) {
        event = event || window.event;
        /*将当前的鼠标坐标值减去元素的偏移位置，返回鼠标相对于element的坐标值*/
        var x = (event.pageX*2 || event.clientX*2 + document.body.scrollLeft + document.documentElement.scrollLeft);
        x -= element.offsetLeft;
        var y = (event.pageY*2 || event.clientY*2 + document.body.scrollTop + document.documentElement.scrollTop);
        y -= element.offsetTop;
        return {
            x: x,
            y: y,
        };
    }

    /**
     * 传入 getPoint() 返回的参数
     * @param e
     * @returns {boolean} 是不是点击到相关按钮了
     */
    isClick(e,son){
        //取到相关参数 
        e.x = e.x;
        e.y = e.y;  
        
        let lfetX_ = son.x+son.width;
        let rightY_ = son.y+son.height;   
        if(e.x<=lfetX_ && e.x>=son.x  && e.y<=rightY_ && e.y>=son.y ){
            return true;
        }
        return false; 
    }
    // isClick(e){
    //     //取到相关参数
    //     let son = this.componentInfo.constructor.getToolData(); 
    //     e.x = e.x;
    //     e.y = e.y; 
        

    //     let lfetX_ = son.x+son.width;
    //     let rightY_ = son.y+son.height;   
    //     if(e.x<=lfetX_ && e.x>=son.x  && e.y<=rightY_ && e.y>=son.y ){
    //         return true;
    //     }
    //     return false;
        

    // }
    /**
     * 给精灵添加点击事件--一般的 点击事件以抬起为准
     * @param BACKFUN 回调函数
     */
    addEventClick(BACKFUN){ 
        this.addEventUp((event)=>{
            BACKFUN(event);
        })
    } 
    /**
     * 给精灵添加点鼠标按下的事件
     * @param {Function} BACKFUN 回调函数
     */
    addEventDown(BACKFUN){
        // gameInfo.drawCanvas.addEventListener('touchstart', (event) => {
        //     let pointNUm = this.getPoint(gameInfo.drawCanvas,event.changedTouches[event.changedTouches.length-1]); 
        //     if(this.isClick(pointNUm) === true){
        //         BACKFUN(event);
        //     }
        // });
        return this;

    }
    /**
     * 给精灵添加点鼠标抬起件事件
     * @param {Function} BACKFUN 回调函数
     */
    addEventUp(BACKFUN){
        // this.addEventDownFun()
        // gameInfo.drawCanvas.addEventListener('touchend', (event) => {
        //     let pointNUm = this.getPoint(gameInfo.drawCanvas,event.changedTouches[event.changedTouches.length-1]);
        //     if(this.isClick(pointNUm) === true){
        //         BACKFUN(event);
        //     }
        // });
        // return this; 
        this.addBttonEvent(this.componentInfo.constructor,BACKFUN); 
        //     gameInfo.drawCanvas.addEventListener('touchend', (event) => {
        //     let pointNum = this.getPoint(gameInfo.drawCanvas,event.changedTouches[event.changedTouches.length-1]);
        //     for (let index = 0; index < bttonEventDownList.length; index++) {
        //         const {node,callBack} = bttonEventDownList[index]; 
        //         console.log('当前遍历的次数:',index)
        //         if(this.isClick(pointNum,node.getToolData()) === true && node.activeState === true){
        //             callBack(event);
        //             break;
        //         } 
        //     } 
           
        // });
        return this; 
    } 
    /**
     * 鼠标拖动事件
     * @param {Function} BACKFUN 
     */
    addMoveEvent(BACKFUN){
        // gameInfo.drawCanvas.addEventListener('touchmove', (event) => { 
        //     let position = this.getPoint(gameInfo.drawCanvas,event.changedTouches[event.changedTouches.length-1])
        //     if(this.isClick(position, this.componentInfo.constructor.getToolData())){
        //         BACKFUN(event);
        //     }
        // });
        return this; 
    }
    /**
     * 添加傻妞妞事件
     * @param {objct} info 
     */
    addBttonEvent(node,callBack){
        let info = {
            node,
            callBack,
        }
        bttonEventDownList.unshift(info);
        // console.log('bttonEventDownList:',bttonEventDownList)
    }
    /**
     * 按钮点击的事件
     * @param {Function} event 
     */
    addEventDownFun(event){
        console.log('event:',event)
        var eventInfo = {
            activeState :this.componentInfo.constructor.activeState,   
            eventFun:event
        }
        bttonEventDownList.unshift(eventInfo); 
    }
   /**
    * 得到当前的按钮点击事件 
    */
    getEventDownFun(){
        let eventInfo = bttonEventDownList.find(eventInfo=> eventInfo.activeState === true ) 
        return eventInfo.eventFun;

    }
    
    //在初始化的过程中 开始监听按钮事件
    static initBtnEvent(){
        //订阅按钮按钮事件  
        gameInfo.drawCanvas.addEventListener('touchend', (event) => { 
            let pointNum = Tool.getPoint(gameInfo.drawCanvas,event.changedTouches[event.changedTouches.length-1]);
            //因为自己把里面的坐标都乘以了2
            pointNum={
                x:pointNum.x*2,
                y:pointNum.y*2,
            }
            // console.log('bttonEventDownList:',window.remscale,pointNum)
            for (let index = 0; index < bttonEventDownList.length; index++) {
                const {node,callBack} = bttonEventDownList[index]; 
                // console.log('当前遍历的次数:',index,node.wfPtoDoc(),pointNum)
                if(Tool.isClick(pointNum,node.getToolData()) === true && node.activeState === true){
                    callBack(event); 
                    // console.log('node:',node)
                    break;
                } 
            }  
        });
    }
}