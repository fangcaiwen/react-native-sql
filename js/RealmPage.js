/**
 * Created by 208439 on 2019/3/5
 *
 * Author: wind
 *
 * Content:Realm
 */
import React, { Component } from 'react';
import {
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




type Props = {};
export default class Realm extends Component<Props> {
    constructor(props) {
        super(props);
        this.state={
            name:'',
            school:'',
            classM:'',
            mListData:[]
        };
        this.tableName = 'Student2'
    }

    componentDidMount() {
        this.loadData();
        NativeModules.SqlModule.creatTable({
            studentName:"",
            schoolName:"",
            className:""
        },this.tableName).then((value) => {
            if(JSON.parse(value).result==1){
                ToastAndroid.show("表创建成功", ToastAndroid.SHORT);
            }else{
                ToastAndroid.show("表创建失败", ToastAndroid.SHORT);
            }
        });
    }

    // 新增数据
    submit = () => {
        const {name,school,classM} = this.state;
        if(name.length==0||school.length==0||classM.length==0){
            ToastAndroid.show("请填写完整", ToastAndroid.SHORT);
            return;
        }
        let params = [
            {
                studentName:name,
                schoolName:school,
                className:classM
            }
        ];

        NativeModules.SqlModule.addData(params,this.tableName).then((value) => {
            if(JSON.parse(value).result==1){
                ToastAndroid.show("保存成功", ToastAndroid.SHORT);
                this.setState({
                    name:'',
                    school:'',
                    classM:'',
                });
                this.loadData();
            }else{
                ToastAndroid.show("添加失败", ToastAndroid.SHORT);
            }
        });
    };

    renderItem = ({item}) => {
        return (
            <View style={{
                width:300,
                height:40,
                flexDirection:'row',
                alignItems:'center',
                backgroundColor:'#00b7e3',
                marginTop:2
            }}
            >
                <Text>{`姓名：${item.studentName}`}</Text>
                <Text style={{marginLeft:20}}>{`学校：${item.schoolName}`}</Text>
                <Text style={{marginLeft:20}}>{`班级：${item.className}`}</Text>
            </View>
        );

    };

    // 查询数据
    loadData = () => {
        NativeModules.SqlModule.quaryData(null,this.tableName).then((value) => {
            console.log("========++++======",value);
            if(value){
                this.setState({
                    mListData:JSON.parse(value).data
                });
            }
        });
    };

    // 编辑数据
    editData = () => {
        NativeModules.SqlModule.updateData({schoolName:"一中222",className:"haha222"},{schoolName:"一中",className:"haha"},this.tableName).then((value) => {
            if(JSON.parse(value).result==1){
                ToastAndroid.show("编辑成功", ToastAndroid.SHORT);
                this.loadData();
            }else{
                ToastAndroid.show("编辑失败", ToastAndroid.SHORT);
            }
        });
    };

    // 删除数据
    deleteData =() => {
        NativeModules.SqlModule.deleData([{studentName:"中国"},{studentName:"99999",schoolName:"555"}],this.tableName).then(value => {
            if(JSON.parse(value).result==1){
                ToastAndroid.show("删除成功", ToastAndroid.SHORT);
            }else{
                ToastAndroid.show("删除失败", ToastAndroid.SHORT);
            }
            this.loadData();
        });
    };

    // 自定义执行语句
    executeUpdate = () => {
        NativeModules.SqlModule.executeUpdate("delete from Student2 where studentName='传智'").then(value => {
            console.log("====result====",value);
        });
    };

    render() {
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
                        <Text style={{color:'#fff',fontSize:18}}>提交</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.deleteData()} style={{marginTop:20}}>
                    <View style={{width:300,height:50,alignItems: 'center',justifyContent:'center',backgroundColor:'#00b7e3',borderRadius:4}}>
                        <Text style={{color:'#fff',fontSize:18}}>删除数据</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.editData()} style={{marginTop:20}}>
                    <View style={{width:300,height:50,alignItems: 'center',justifyContent:'center',backgroundColor:'#00b7e3',borderRadius:4}}>
                        <Text style={{color:'#fff',fontSize:18}}>编辑数据</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.executeUpdate()} style={{marginTop:20}}>
                    <View style={{width:300,height:50,alignItems: 'center',justifyContent:'center',backgroundColor:'#00b7e3',borderRadius:4}}>
                        <Text style={{color:'#fff',fontSize:18}}>自定义执行语句</Text>
                    </View>
                </TouchableOpacity>

                <View style={{width:300,height:50,alignItems: 'center',justifyContent:'center'}}>
                    <Text style={{color:'#00b7e3',fontSize:18}}>列表如下</Text>
                </View>
                <FlatList
                    data={mListData}
                    renderItem={this.renderItem}
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