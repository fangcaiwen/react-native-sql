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
