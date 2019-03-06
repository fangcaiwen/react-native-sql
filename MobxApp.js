/**
 * Created by 208439 on 2019/2/13
 *
 * Author: wind
 *
 * Content:
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ToastAndroid,
    NativeModules,
    FlatList,
    RefreshControl
} from 'react-native';

/*
 * 引入这个两个头文件
 * */
import {observable, action} from 'mobx';
import {observer} from 'mobx-react/native';

/*
* 假数据
* */
const datas = [
    {studentName:'苹果',schoolName:0,className:203},
    {studentName:'梨',schoolName:0,className:2034},
    {studentName:'香蕉',schoolName:0,className:2035},
    {studentName:'草莓',schoolName:0,className:2036},
    {studentName:'橘子',schoolName:0,className:2037},
];



type Props = {};
/*
* 对整个列表添加观察，观察列表个数的变化
* */
@observer
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            name:'',
            school:'',
            classM:'',
            mListData:[]
        }
    }

    /*
   * 数据管理器
   * */
    dataManager = new DataSource();

    componentWillMount() {
        // this.loadData();
        /*
      * 赋值初始数据
      * */
        this.dataManager.replace(datas);
        // this.setState({
        //     mListData:this.dataManager.dataSource
        // });
    }

    submit = () => {
        const {name,school,classM} = this.state;
        if(name.length==0||school.length==0||classM.length==0){
            ToastAndroid.show("请填写完整", ToastAndroid.SHORT);
            return;
        }

        let item =  {studentName:'新添加'+name,schoolName:school,className:classM};
        this.dataManager.addItem(item);
        ToastAndroid.show("保存成功", ToastAndroid.SHORT);

        // NativeModules.DBManagerModule.saveStudent(name,school,classM,(value) => {
        //     if(value){
        //         ToastAndroid.show("保存成功", ToastAndroid.SHORT);
        //         this.setState({
        //             name:'',
        //             school:'',
        //             classM:'',
        //         });
        //         this.loadData();
        //     }
        // });
    };

    renderItem = ({item}) => {
        console.log("single====",item);
        return (
            <View style={{
                width:300,
                height:40,
                flexDirection:'row',
                alignItems:'center',
                backgroundColor:'#00b7e3',
                marginTop:2
            }}
                  key={item.studentName}
            >
                <Text>{`姓名：${item.studentName}`}</Text>
                <Text style={{marginLeft:20}}>{`学校：${item.schoolName}`}</Text>
                <Text style={{marginLeft:20}}>{`班级：${item.className}`}</Text>
            </View>
        );

    };

    loadData = () => {
        console.log("result",this.dataManager.dataSource);
        // NativeModules.DBManagerModule.getStudentAll((mList) => {
        //     console.log("mList====",mList);
        //     if(!mList){
        //         return;
        //     }
        //     this.setState({
        //         mListData:JSON.parse(mList)
        //     });
        // });
    };

    deleteData =() => {
        this.dataManager.deleteItem(0);

        // NativeModules.DBManagerModule.deleteStudentAll((tag) => {
        //     if(tag){
        //         ToastAndroid.show("删除成功", ToastAndroid.SHORT);
        //         this.setState({
        //             mListData:[]
        //         });
        //     }
        // });
    };

    render() {
        console.log("xxxxppppp",this.dataManager.dataSource);
        const {
            mListData,
            name,
            school,
            classM
        } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text>姓名：</Text>
                    <TextInput
                        style={{width:280}}
                        value={name}
                        onChangeText ={(name) => this.setState({name})}/>
                </View>
                <View style={styles.row}>
                    <Text>学校：</Text>
                    <TextInput
                        style={{width:280}}
                        value={school}
                        onChangeText ={(school) => this.setState({school})}/>
                </View>
                <View style={styles.row}>
                    <Text>班级：</Text>
                    <TextInput
                        style={{width:280}}
                        value={classM}
                        onChangeText ={(classM) => this.setState({classM})}/>
                </View>
                <TouchableOpacity onPress={() => this.submit()}>
                    <View style={{width:300,height:50,alignItems: 'center',justifyContent:'center',backgroundColor:'#00b7e3',borderRadius:4}}>
                        <Text style={{color:'#fff',fontSize:18}}>提1交</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.deleteData()} style={{marginTop:20}}>
                    <View style={{width:300,height:50,alignItems: 'center',justifyContent:'center',backgroundColor:'#00b7e3',borderRadius:4}}>
                        <Text style={{color:'#fff',fontSize:18}}>清空所有数据</Text>
                    </View>
                </TouchableOpacity>

                <View style={{width:300,height:50,alignItems: 'center',justifyContent:'center'}}>
                    <Text style={{color:'#00b7e3',fontSize:18}}>列表如下</Text>
                </View>
                <FlatList
                    data={this.dataManager.dataSource.slice(0)}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index)=>index+"ppp"}
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.loadData}
                            refreshing={false}
                        />
                    }
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    row:{
        width:300,
        height:40,
        flexDirection:'row',
        alignItems:'center',
    }
});

/*
 * 整个列表页数据管理器
 * */
class DataSource {
    // 本地数据源
    @observable
    dataSource = [];

    // 添加初始数据
    @action
    replace = (items) => {
        // 1. 清空原数据
        this.dataSource.splice(0, this.dataSource.length);

        // 2. 加载新数据
        items.map((item, i) => {
            this.dataSource.push(new Item(item));
        });
    };

    // 添加新数据
    @action
    addItem = (item) => {
        this.dataSource.unshift(new Item(item));
    };


    // 删除一条数据
    @action
    deleteItem = (idx) => {
        this.dataSource.splice(idx, 1);
    };
}


/*
 * 单条Item数据管理器
 * */
class Item {

    /*
    * 商品名称（此值是不变的所以不需要检测此值）
    * */
    studentName;

    /*
    * 监控商品个数
    * */
    schoolName;

    className;


    constructor(item) {
        this.studentName = item.studentName;
        this.schoolName = item.schoolName;
        this.className = item.className;
    };

    /*
    * 商品个数+1
    * */
    @action
    add = () => {
        this.schoolName += 1;
    };

    /*
    * 商品个数-1
    * */
    @action
    dec= () => {
        this.schoolName > 0 && (this.schoolName -= 1);
    };
}

