package com.myappt.sql;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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



    // 创建表
    @ReactMethod
    public void creatTable(ReadableMap mObject,String tableName,Promise promise){
        SqlManager sqlManager = new SqlManager(mReactContext,tableName);
        boolean result = sqlManager.creatTable(mObject);
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("result",result?1:0);
            jsonObject.put("data",new JSONArray());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        promise.resolve(jsonObject.toString());
    }

    // 新增数据
    @ReactMethod
    public void addData(ReadableArray mArray,String tableName,Promise promise){
        SqlManager sqlManager = new SqlManager(mReactContext,tableName);
        boolean result = sqlManager.addNewData(mArray);
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("result",result?1:0);
            jsonObject.put("data",new JSONArray());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        promise.resolve(jsonObject.toString());
    }

    // 删除数据
    @ReactMethod
    public void deleData(ReadableArray mArray,String tableName,Promise promise){
        SqlManager sqlManager = new SqlManager(mReactContext,tableName);
        boolean result = sqlManager.deleteData(mArray);
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("result",result?1:0);
            jsonObject.put("data",new JSONArray());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        promise.resolve(jsonObject.toString());
    }

    // 更新数据
    @ReactMethod
    public void updateData(ReadableMap newObject,ReadableMap ifObject,String tableName,Promise promise){
        SqlManager sqlManager = new SqlManager(mReactContext,tableName);
        boolean result = sqlManager.upDateData(newObject,ifObject);
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("result",result?1:0);
            jsonObject.put("data",new JSONArray());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        promise.resolve(jsonObject.toString());
    }

    // 查询数据
    @ReactMethod
    public void quaryData(ReadableMap mObject,String tableName,Promise promise){
        SqlManager sqlManager = new SqlManager(mReactContext,tableName);
        JSONArray result = sqlManager.getAllData(mObject);
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("result",result.length()>0?1:0);
            jsonObject.put("data",result);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        promise.resolve(jsonObject.toString());
    }

    // 自定义执行语句
    @ReactMethod
    public void executeUpdate(String sqlString,Promise promise){
        SqlManager sqlManager = new SqlManager(mReactContext,null);
        boolean result = sqlManager.executeUpdate(sqlString);
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("result",result?1:0);
            jsonObject.put("data",new JSONArray());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        promise.resolve(jsonObject.toString());
    }

}
