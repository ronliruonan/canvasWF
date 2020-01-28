import "./index.css"; 

// import $ from '../node_modules/zepto-webpack'
// import "./js/zeptoFx.js"
 
 

import {Game} from './js/base/Game';//引入Game脚本
import {Ease,loopType} from './js/base/DOTween'//引入Ease loopType用于设置动画组件 
import {ResList} from './ResList'; 

class Demo   {
    constructor(){
        this.game = null;//game的上下文 
        this.init();  
    }
    init(){
        //canvas的配置设置
        let gameoConfig={
            // width:750/2,//设置canvas的宽
            // height:1334/2 ,//设置canvas的高
            canvasId:'demo',//设置canvas的id
            type:'canvas',//使用的类型 目前就这一个选项 后期可能会添加webgl
            create:this.create,//资源加载完毕后加载的方法 
            // updata:this.updata,//实时更新函数 --不是用可以不写，节省性能
            actionScope:this,//作用域传入 当前的作用域传入
        }
        this.game =  Game.getInstance(gameoConfig);//取到game单利  
        this.game.loadRes(ResList);//将资源列表中的资源添加进来 
    }
    create(){ 
        //创建一幢背景图的素材
        this.Bg = this.game.createSprite(0,0,'bg');//创建一个单一游戏体的背景图片
        let  bgButton = this.Bg.addComponent('Button'); //给背景图添加上button的按钮时间
        bgButton.addEventClick(()=>{
            console.log('点击了按钮的事件')
        })

        this.c1 = this.game.createSprite(50,200,'c1');//创建一个小人
        let c1Collision = this.c1.addComponent('Collision');//添加碰撞检测事件
        let c1Aniamtion = this.c1.addComponent('DOTween');//添加DOTween动画

        this.c2 = this.game.createSprite(600,200,'c2');//创建另外一个小人
        this.c2.scale(-1,1);//将以Y轴进行反转
        //使用碰撞组件上的相关方法
        c1Collision.collisionTarget(this.c2)//碰撞的目标
            .onBeginContact(()=>{ console.log('相撞了'); })//三种回调事件
            .incollision(()=>{console.log('正在重叠')})
            .onEndContact(()=>{console.log('碰撞结束')})
            .DO();//执行碰撞检测事件
        //使用x的DOTween动画
        c1Aniamtion.DOMoveX().from().to(700)
            .setEase(Ease.Quad.easeInOut)
            .setUseTime(1000)
            .setLoops(2,loopType.pingqang) 
            .DOAnimation();
        //将建一个字体  this.game.createSprite = Game.createFontS（静态方法）
        let text = Game.createFontS(376,200,'text');
        text.fontContent("测试位置");//设置字体的内容
        text.fontSize(60).fontColor('#000000');//字体的色号
        text.fontTextAlign('center'); //水平的模式
        let textAnimaiton = text.addComponent('DOTween');//给字体使用DOTween动画
        textAnimaiton.DOScale().from({x:0.5,y:0.5}).to({x:1.5,y:1.5}).setEase(Ease.Quad.easeInOut)
            .setUseTime(1000)
            .setLoops(2,loopType.pingqang) 
            .setDelayed(0)
            .onComplete(()=>{console.log('当前的动画执行完毕了!',text.x)})//当前的动画执行完毕的回调
            .everyFrame((index)=>{console.log(index)})//期间的每帧动画的回调
            .DOAnimation();

        this.game.showCanvasWH();//展示当前屏幕的相关信息 
    }
    //帧更新函数 这个需要的话可以使用，不需要的话，可以不使用 
    updata(){   
    }
}
new Demo();
 