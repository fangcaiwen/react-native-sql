/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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



type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state={
          name:'',
          school:'',
          classM:'',
          mListData:[]
        }
    }

    componentDidMount() {
        this.loadData();
    }

    submit = () => {
      const {name,school,classM} = this.state;
      if(name.length==0||school.length==0||classM.length==0){
          ToastAndroid.show("请填写完整", ToastAndroid.SHORT);
          return;
      }
       NativeModules.DBManagerModule.saveStudent(name,school,classM,(value) => {
         if(value){
             ToastAndroid.show("保存成功", ToastAndroid.SHORT);
             this.setState({
                 name:'',
                 school:'',
                 classM:'',
             });
             this.loadData();
         }
       });
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
             >
                <Text>{`姓名：${item.studentName}`}</Text>
                <Text style={{marginLeft:20}}>{`学校：${item.schoolName}`}</Text>
                <Text style={{marginLeft:20}}>{`班级：${item.className}`}</Text>
            </View>
        );

    };

    loadData = () => {
        NativeModules.DBManagerModule.getStudentAll((mList) => {
          console.log("mList====",mList);
          this.setState({
               mListData:JSON.parse(mList)
              });
        });
    };

    deleteData =() => {
        NativeModules.DBManagerModule.deleteStudentAll((tag) => {
            if(tag){
                ToastAndroid.show("删除成功", ToastAndroid.SHORT);
                this.setState({
                    mListData:[]
                });
            }
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
                  <Text style={{color:'#fff',fontSize:18}}>清空所有数据</Text>
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
