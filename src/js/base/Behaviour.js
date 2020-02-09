import game, { Game } from './Game';
import DOTween from './DOTween';
import Button from './Button';
import Collision from './Collision';

//可以被添加组件
let canAddedchiledEnumList=['Spirit','Text'];
//当前可以使用添加子组件的功能
let canUseChiledEnumList=['Spirit'];
//基础类 一些基础组件需要继承自这个
export class Behaviour {
    constructor(){
        this.TypeName = 'Behaviour'; 
        this.DOTween = null;
        this.Button = null;
        this.Collision = null;
        this.childList = [];//子游戏物体的数组
        // this.configF();
        this.updata();
  
    }
    /**
     * 更新相关的参数设置
     */
    updata(){
        //检测x数值的变价
        this.setProperty(this,'x',0,(values)=>{ 
            this.synPositionX();  
        })
        //检测y数值的变价
        this.setProperty(this,'y',0,(values)=>{ 
            this.synPositionY(); 
        })
        //检测scaleW数值的变价
        this.setProperty(this,'scaleW',0,(values)=>{ 
            this.synscaleW(); 
        })
        //检测scaleH数值的变价
        this.setProperty(this,'scaleH',0,(values)=>{ 
            this.synscaleH(); 
        }) 
        //检测rotate数值的变价 从而处理自由物体角度与position
        this.setProperty(this,'rotate',0,(values)=>{ 
            this.synRotate(); 
        }) 
    }
    /**
     *  封装使用数据驱动
     * @param {object} obj 作用域
     * @param {string} parameter 变量名字
     * @param {number} num 数值
     * @param {function} BACK 返回方法
     */
    setProperty(obj,parameter,num,BACK){  
        //玩家的当前的金币数量
        Object.defineProperty(this,parameter,{
            get(){
                return num;
            },
            set(vlue){ 
                num = vlue;
                if(BACK!=null){
                    BACK(vlue);
                 }
            }
        }) 
    }
   
    //----------------------------添加父子层级功能区-----------------------------  
    /**
     * 加入childe 子元素
     * @param{} childeObj
     */
    addChiled(childeObj){ 
        if(this.isCanAddChiled(childeObj)){
            this.WorldTochild(childeObj);//更改坐标为以父物体为主的坐标
            this.childList.push(childeObj);//添加当前子数组 
            this.synPosition();
        }else{
            Game.waringS(`您添加的${childeObj}是非法格式,需要是${canAddedchiledEnumList}的任意一种类型才可以进行添加`);
        } 
        return this;
    }  
    /**
     * 传入相关的要移除的子元素
     * @param childeObj
     */
    deleteChiled(childeObj){
        //取到当前的游戏物体的index
        let index = this.getIndex(childeObj);
      if(index === -1){
        Game.waringS('当前父物体不包含此子物体')
        return;
      }else{
        this.childList.splice(index,1);//移除数组
        this.childToWorld(childeObj);//将子坐标转为世界坐标 
       }
    }
    /**
     * 检查子类表的数量
     * @returns {number}
     */
    length(){
        return this.childList.length;
    }  
    /**
     * 得到当前子物体再父物体的第几个
     * @param {object} childeObj 
     */
    getIndex(childeObj){
        return this.childList.indexOf(childeObj);
    } 
    //关于更新子游戏物体的思路
    //当父物体再xy轴上进行移动之时 我们就直接将对应的子物体中进行相应的加减变化值。从而移动子物体（可以不适用锚点）
    //当角度发生变化的时候（再锚点的基础上）
    //大小的变换

    //第一步先实现 子物体跟随父物体进行移动
    configF(){
        console.log('----console----:',this);
    }
    /**
     * 同步xy坐标
     */
    synPosition(){
        this.synPositionX();
        this.synPositionY();
    }
     /**
     * 同步x坐标
     */
    synPositionX(){ 
        for (let index = 0; index < this.childList.length; index++) {
            this.childList[index].x = this.x + this.childList[index].childeDValue.x; 
        } 
    }
    /**
     * 同步y坐标
     */
    synPositionY(){
        for (let index = 0; index < this.childList.length; index++) { 
            this.childList[index].y = this.y + this.childList[index].childeDValue.y; 
        } 
    }
    /**
     * 更新scaleH的内容
     */
    synscaleH(){
        for (let index = 0; index < this.childList.length; index++) { 
            this.childList[index].scaleH = this.scaleH + this.childList[index].childeDValue.scaleH; 
        } 
    }
    /**
     * 更新scaleW的内容
     */
    synscaleW(){
        for (let index = 0; index < this.childList.length; index++) { 
            this.childList[index].scaleW = this.scaleW + this.childList[index].childeDValue.scaleW; 
        } 
    }
    /**
     * 旋转的角度 rotate 
     */
    synRotate(){




    } 

    /**
     * 是不是可以添加游戏物体进入子物体中
     * @param {object} childeObj 
     */
    isCanAddChiled(childeObj){
        let _bool = canAddedchiledEnumList.indexOf(childeObj.TypeName);  
        return _bool === -1 ? false : true; 
    }
    /**
     * 当前的世界坐标转为子坐标
     * @param {object} childeObj 
     */
    WorldTochild(childeObj){ 
        //将相关的插值记录起来
        let x = childeObj.x  - this.x;
        let y = childeObj.y  - this.y;
        let scaleW = childeObj.scaleW - this.scaleW;
        let scaleH = childeObj.scaleH - this.scaleH;
        childeObj.childeDValue={x,y,scaleW,scaleH};//将差值存放起来 
        childeObj.x = x;
        childeObj.y = y;
    }
    /**
     * 当前的子坐标转为世界坐标
     * @param {object} childeObj 
     */
    childToWorld(childeObj){ 
        //回复相关的参数
        childeObj.x = childeObj.childeDValue.x + this.x;
        childeObj.y = childeObj.childeDValue.y + this.y;
        childeObj.scaleW = childeObj.childeDValue.scaleW + this.scaleW;
        childeObj.scaleH = childeObj.childeDValue.scaleH + this.scaleH;
        
    } 

 //----------------------------组件添加移除区---------------------------
    /**
     * 取到当前的具体组件是什么
     * @param {string} componentName 
     */
    getComponent(componentName){
        return this._getComponent(componentName);
    }
    /**
     * 添加上当前的具体的组件是什么 
     * @param {string} componentName 
     */
    addComponent(componentName){
        if( typeof componentName != 'string'){
            game.getInstance().waring('传入的必须是string的类型'); 
        }
        //添加需要的组件
        return this._addComponent(componentName);
      }
      /**
       * 添加上当前的具体的组件是什么 私有的方法
       * @param {string} componentName 
       */
      _addComponent(componentName){
        if(componentName === 'DOTween'){
            return this.DOTween = new DOTween(this); 

        }else if(componentName === 'Button'){
            return this.Button = new Button(this); 

        }else if(componentName === 'Collision'){
            return this.Collision = new Collision(this); 

        }
      }
      /**
       * 取到当前的具体组件是什么 私有的方法
       * @param {string} componentName 
       */
      _getComponent(componentName){
          if(componentName === 'DOTween'){
              return this.DOTween;  
          }else if(componentName === 'Button'){
              return this.Button;  
          }else if(componentName === 'Collision'){
              return this.Collision;  
          }
      }
}