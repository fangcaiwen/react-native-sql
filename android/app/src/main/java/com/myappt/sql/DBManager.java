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
