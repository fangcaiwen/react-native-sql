由于上班项目紧，沉浸了很久，没更新技术文档了。整个人也被业务逻辑牢牢的套住，这不年前最后一天，抽出半天功夫，写了这个简单的demo，希望能帮到有需求的同行们，你若喜欢，就帮我点个赞，不胜感激。
话不多说，直接lol代码：
1.数据库建立，更新方法类
```
package com.myappt.sql;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DBHelper extends SQLiteOpenHelper {

    private static final String DB_NAME = "StudentDB.db"; //数据库名称
    private static final int version = 1; //数据库版本
    public static final String STUDENT_TABLE = "Student";

    public DBHelper(Context context) {
        super(context, DB_NAME, null, version);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String sql = "create table if not exists " + STUDENT_TABLE +
                " (studentName text primary key, schoolName text, className text)";
        db.execSQL(sql);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        String sql = "DROP TABLE IF EXISTS " + STUDENT_TABLE;
        db.execSQL(sql);
        onCreate(db);
    }
}
```

2.数据库增、删、查
```
package com.myappt.sql;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

public class DBManager {
    private static final String TAG = "StudentDB";
    private DBHelper dbHelper;

    private final String[] STUDENT_COLUMNS = new String[] {
            "studentName",
            "schoolName",
            "className",
    };

    public DBManager(Context context) {
        this.dbHelper = new DBHelper(context);
    }

    /**
     * 是否存在此条数据
     * @return bool
     */
    public boolean isStudentExists(String studentName) {
        boolean isExists = false;

        SQLiteDatabase db = null;
        Cursor cursor = null;
        try {
            db = dbHelper.getReadableDatabase();
            String sql = "select * from Student where studentName = ?";
            cursor = db.rawQuery(sql, new String[]{studentName});
            if (cursor.getCount() > 0) {
                isExists = true;
            }
        } catch (Exception e) {
            Log.e(TAG, "isStudentExists query error", e);
        } finally {
            if (cursor != null) {
                cursor.close();
            }
            if (db != null) {
                db.close();
            }
        }
        return isExists;
    }

    /**
     * 保存数据
     */
    public void saveStudent(String studentName, String schoolName, String className) {
        SQLiteDatabase db = null;
        try {
            db = dbHelper.getWritableDatabase();

            ContentValues cv = new ContentValues();
            cv.put("studentName", studentName);
            cv.put("schoolName", schoolName);
            cv.put("className", className);

            db.insert(DBHelper.STUDENT_TABLE, null, cv);
        } catch (Exception e) {
            Log.e(TAG, "saveStudent error", e);
        } finally {
            if (db != null) {
                db.close();
            }
        }
    }

    /**
     * 获取数据
     */
    public JSONArray getAllStudent(){
        SQLiteDatabase db = null;
        Cursor cursor = null;
        JSONArray mJsonArray = new JSONArray();
        try {
            db = dbHelper.getWritableDatabase();

            cursor = db.query(DBHelper.STUDENT_TABLE, null, null, null, null, null, null);

            while (cursor.moveToNext()){
                JSONObject mJsonObject = new JSONObject();
                mJsonObject.put("studentName",cursor.getString(0));
                mJsonObject.put("schoolName",cursor.getString(1));
                mJsonObject.put("className",cursor.getString(2));
                mJsonArray.put(mJsonObject);
            }
        } catch (Exception e) {
            Log.e(TAG, "saveStudent error", e);
        } finally {
            if (db != null) {
                db.close();
            }
        }
        return mJsonArray;
    }

    /**
     * 删除所有数据
     */
     public Boolean deleteAllData(){
         SQLiteDatabase db = null;
         boolean result = false;
         try {
             db = dbHelper.getWritableDatabase();
             db.delete(DBHelper.STUDENT_TABLE, null,null);
             result = true;
         } catch (Exception e) {
             Log.e(TAG, "saveStudent error", e);
         } finally {
             if (db != null) {
                 db.close();
             }
         }
         return result;
     }

}

```

3.暴露给react native使用的方法
```
package com.myappt.sql;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.views.view.ColorUtil;

import org.json.JSONArray;

public class DBManagerModule extends ReactContextBaseJavaModule {
    private ReactContext mReactContext;

    public DBManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DBManagerModule";
    }

    @ReactMethod
    public void saveStudent(String studentName, String schoolName, String className,Callback callback) {
        DBManager dbManager = new DBManager(mReactContext);
        if (!dbManager.isStudentExists(studentName)) {
            dbManager.saveStudent(studentName, schoolName, className);
            callback.invoke(true);
        }
    }

    @ReactMethod
    public void getStudentAll(Callback callBack){
        DBManager dbManager = new DBManager(mReactContext);
        JSONArray mArray = dbManager.getAllStudent();
        if(mArray.length()==0){
            callBack.invoke("");
        }else{
            callBack.invoke(mArray.toString());
        }

    }

    @ReactMethod
    public void deleteStudentAll(Callback callBack){
        DBManager dbManager = new DBManager(mReactContext);
        boolean tag = dbManager.deleteAllData();
        callBack.invoke(tag);
    }
}

```
4.这仅仅是一个套路（一）DBManagerPackage
```
package com.myappt.sql;


import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class DBManagerPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> nativeModules = new ArrayList<>();
        nativeModules.add(new DBManagerModule(reactContext));
        return nativeModules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}

```

5.这仅仅是一个套路（二）
```
package com.myappt;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.myappt.sql.DBManagerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          
          // =====添加这行=====
          
          new DBManagerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

```
6.react native层使用之demo
```
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

```
总体看下来，超级简单。大神轻喷，初学者可以试试，最好自己实现这个demo，你会收获不少。再啰嗦一句，觉得有用的帮我点个赞，如有疑问留言区见。
最后，老规矩，简书地址：https://www.jianshu.com/p/e8dc9bc60454
