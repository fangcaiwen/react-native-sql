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
    NativeModules,
    requireNativeComponent
} from 'react-native';
import PropTypes from 'prop-types';


type Props = {};
export default class Realm extends Component<Props> {
    constructor(props) {
        super(props);
        this.state={
            name:'',
            srcString:''
        };
    }

    componentDidMount() {
    }

    // 开始扫描
    startScan = () => {
        NativeModules.QrcodeModule.startScan((text) => {
            alert("扫描结果："+text);
        });
    };

    bothQrCode = () => {
        this.setState({
            srcString:this.state.name
        });
    };




    render() {
        const {
            name,
            srcString
        } = this.state;

        return (
            <View style={styles.container}>

                <TouchableOpacity onPress={() => this.startScan()}>
                    <View style={{width:300,height:50,marginTop:100,marginBottom:60,alignItems: 'center',justifyContent:'center',backgroundColor:'#00b7e3',borderRadius:4}}>
                        <Text style={{color:'#fff',fontSize:18}}>开始扫描</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.row}>
                    <Text>姓11名：</Text>
                    <TextInput
                        style={{width:280}}
                        value={name}
                        onChangeText ={(name) => this.setState({name})}/>
                </View>


                <TouchableOpacity onPress={() => this.bothQrCode()} style={{marginTop:20}}>
                    <View style={{width:300,height:50,alignItems: 'center',justifyContent:'center',backgroundColor:'#00b7e3',borderRadius:4}}>
                        <Text style={{color:'#fff',fontSize:18}}>生成二维码</Text>
                    </View>
                </TouchableOpacity>

                {srcString.length>0? <QrImageView
                    style={{width:300,height:300}}
                    size={230}
                    imageSrc={srcString}
                /> :null}

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

const QrImageView1 = {
    name:"QrImageView",
    propTypes:{
        "size":PropTypes.number,
        "imageSrc":PropTypes.string,
        ...View.propTypes
    }
}

const RCTQrImageView = requireNativeComponent('QrImageView',QrImageView1,{
});

class QrImageView extends Component {
    render() {
        return (
            <RCTQrImageView {...this.props} />
        );
    }
}