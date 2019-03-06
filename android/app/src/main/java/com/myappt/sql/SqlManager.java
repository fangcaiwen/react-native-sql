package com.myappt.sql;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Map;

public class SqlManager {

    private SqlHelper sqlHelper;


    public SqlManager(Context context,String tableName){
        this.sqlHelper = new SqlHelper(context,tableName);
    }


    // 创建表
    public Boolean creatTable(ReadableMap mObject){
        return this.sqlHelper.createTable(mObject);
    }

    // 新增数据
    public Boolean addNewData(ReadableArray mArray){
        SQLiteDatabase db = null;
        boolean result = false;
        try {
            db = sqlHelper.getWritableDatabase();
            int length = mArray.size();
            for(int i=0;i<length;i++){
                ReadableMap mObject = mArray.getMap(i);
                ContentValues cv = new ContentValues();
                for(Map.Entry<String,Object> entry:mObject.toHashMap().entrySet()){
                    cv.put(entry.getKey(),entry.getValue().toString());
                }
                long id = db.insert(SqlHelper.TABLE_NAME, null, cv);
                if(id == -1){ // 添加失败
                    result = false;
                    break;
                }else{
                    result = true;
                }
            }
        } catch (Exception e) {
            Log.d("sqlDb===",e.getMessage());
            result = false;
        } finally {
            if (db != null) {
                db.close();
            }
        }
        return result;
    }

    // 删除数据
    public Boolean deleteData(ReadableArray mArray){

        SQLiteDatabase db = null;
        boolean result = false;
        try {
            db = sqlHelper.getWritableDatabase();
            if(mArray==null){ // 为空，全删
                db.delete(SqlHelper.TABLE_NAME, null,null);
                result = true;
            }else{ // 删对应条件的数据
                int length = mArray.size();
                for(int i=0;i<length;i++){
                    ReadableMap mObject = mArray.getMap(i);
                    String ifString = "";
                    ArrayList<String> valueArray = new ArrayList<String> ();

                    for(Map.Entry<String,Object> entry:mObject.toHashMap().entrySet()){
                        ifString = ifString+entry.getKey()+"=? and ";
                        valueArray.add(entry.getValue().toString());
                    }
                    String[] arrayResult=new String[valueArray.size()];
                    for(int j=0;j<valueArray.size();j++){
                        arrayResult[j] = valueArray.get(j);
                    }

                    int reId = db.delete(SqlHelper.TABLE_NAME,ifString.substring(0,ifString.length()-5), arrayResult);
                    if(reId==0){ // 删除失败，没有找到符合条件的数据
//                        result = false;
//                        break;
                    }else{
                        result = true;
                    }
                }
            }
        } catch (Exception e) {
            Log.d("sqlDb===",e.getMessage());
            result = false;
        } finally {
            if (db != null) {
                db.close();
            }
        }
        return result;
    }

    // 更新数据
    public Boolean upDateData(ReadableMap newMap,ReadableMap quaryMap){
        boolean result = false;
        if(newMap==null||quaryMap==null){
            return result;
        }
        SQLiteDatabase db = null;
        try {
            db = sqlHelper.getWritableDatabase();
            String ifString = "";
            ArrayList<String> valueArray = new ArrayList<String> ();

            // 循环条件
            for(Map.Entry<String,Object> entry:quaryMap.toHashMap().entrySet()){
                ifString = ifString+entry.getKey()+"=? and ";
                valueArray.add(entry.getValue().toString());
            }
            String[] arrayResult=new String[valueArray.size()];
            for(int j=0;j<valueArray.size();j++){
                arrayResult[j] = valueArray.get(j);
            }

            ContentValues contentValues = new ContentValues();

            // 循环更改的字段
            for(Map.Entry<String,Object> entry:newMap.toHashMap().entrySet()){
                contentValues.put(entry.getKey(),entry.getValue().toString());
            }

            int reId = db.update(SqlHelper.TABLE_NAME,contentValues,ifString.substring(0,ifString.length()-5), arrayResult);
            if(reId==0){
                // 删除失败，没有找到符合条件的数据
                  result = false;
            }else{
                result = true;
            }
        } catch (Exception e) {
            Log.d("sqlDb===",e.getMessage());
            result = false;
        } finally {
            if (db != null) {
                db.close();
            }
        }
        return result;
    }



    // 查询数据
    public JSONArray getAllData(ReadableMap mObject){
        SQLiteDatabase db = null;
        Cursor cursor = null;
        JSONArray mJsonArray = new JSONArray();
        try {
            db = sqlHelper.getWritableDatabase();

            if(mObject==null){ // 条件为空，返回所有的值
                cursor = db.query(SqlHelper.TABLE_NAME, null, null, null, null, null, null);
                while (cursor.moveToNext()){
                    int length = cursor.getColumnNames().length;
                    JSONObject mJsonObject = new JSONObject();
                    for(int i=0;i<length;i++){
                        mJsonObject.put(cursor.getColumnName(i),cursor.getString(i));
                    }
                    mJsonArray.put(mJsonObject);
                }
            }else{ // 否则返回指定条件的值
                String ifString = "";
                ArrayList<String> valueArray = new ArrayList<String> ();
                for(Map.Entry<String,Object> entry:mObject.toHashMap().entrySet()){
                    ifString = ifString+entry.getKey()+"=? and ";
                    valueArray.add(entry.getValue().toString());
                }

                String[] arrayResult=new String[valueArray.size()];
                for(int j=0;j<valueArray.size();j++){
                    arrayResult[j] = valueArray.get(j);
                }

                cursor = db.query(SqlHelper.TABLE_NAME, null, ifString.substring(0,ifString.length()-5), arrayResult, null, null, null);
                while (cursor.moveToNext()){
                    int length = cursor.getColumnNames().length;
                    JSONObject mJsonObject = new JSONObject();
                    for(int i=0;i<length;i++){
                        mJsonObject.put(cursor.getColumnName(i),cursor.getString(i));
                    }
                    mJsonArray.put(mJsonObject);
                }

            }
        } catch (Exception e) {
            Log.d("sqlDb===",e.getMessage());
        } finally {
            if (db != null) {
                db.close();
            }
        }
        return mJsonArray;
    }

    // 自定义语句
    public Boolean executeUpdate(String sqlStr){
        boolean result = false;
        SQLiteDatabase db = null;
        try {
            db = sqlHelper.getWritableDatabase();
            db.execSQL(sqlStr);
            result = true;
        } catch (Exception e) {
            Log.d("sqlDb===",e.getMessage());
            result = false;
        } finally {
            if (db != null) {
                db.close();
            }
        }
        return result;
    }



}
