package com.myappt.sql;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

public class SqlHelper extends SQLiteOpenHelper {

    private static final String DB_NAME = "Gniot.db"; //数据库名称
    private static final int version = 1; //数据库版本
    public  static String  TABLE_NAME = "Gniot_Table";

    public SqlHelper(Context context,String tableName) {
        super(context, DB_NAME, null, version);
        TABLE_NAME = tableName;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
//         this.mDb = db;
//        String sql = "create table if not exists " + TABLE_NAME+"(studentName text primary key, schoolName text, className text)";
//        db.execSQL(sql);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int i, int i1) {
        String sql = "DROP TABLE IF EXISTS " + TABLE_NAME;
        db.execSQL(sql);
        onCreate(db);
    }

    // 手动创建数据表
    public boolean createTable(ReadableMap mObject){
        boolean result = false;
        if(!tabIsExist(this.getWritableDatabase())){
            String ifString = "";
            for(Map.Entry<String,Object> entry:mObject.toHashMap().entrySet()){
                ifString = ifString+entry.getKey()+" text,";
            }
            String sql = String.format("create table if not exists %s(%s)", TABLE_NAME, ifString.substring(0,ifString.length()-1));
            try {
                this.getWritableDatabase().execSQL(sql);
                result = true;
            }catch(Exception e){
                Log.d("sqlDb===",e.getMessage());
            }
        }
        return result;
    }


    // 判断是否存在表
    public boolean tabIsExist(SQLiteDatabase db){
        boolean result = false;
        if(TABLE_NAME == null){
            return false;
        }
        Cursor cursor = null;
        try {

            String sql = "select count(*) as c from sqlite_master where type ='table' and name ='"+TABLE_NAME.trim()+"' ";
            cursor = db.rawQuery(sql, null);
            if(cursor.moveToNext()){
                int count = cursor.getInt(0);
                if(count>0){
                    result = true;
                }
            }

        } catch (Exception e) {
        }
        return result;
    }
}
