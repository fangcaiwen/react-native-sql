/**
 * Created by 208439 on 2019/3/5
 *
 * Author: wind
 *
 * Content:数据管理
 */
const Realm = require('realm');

class RealmHelper {

    // 新建表模型
   PersonSchema = {
        name: 'Person',
        properties: {
            studentName: 'string',
            schoolName: 'string',
            className: 'string'
        }
    };

  constructor(){
      this.realm = new Realm({schema: [this.PersonSchema]});
  }

  // 增加数据
  addData = (params) => {
    this.realm.write(() => {
        this.realm.create('Person',{...params});
    });
  };

  // 查询所有数据
  getAllList = () => {
      return this.realm.objects('Person');
  };

  // 查询单个数据
  getSingleData = (str) => {
      // 获取Person对象
      let Persons = this.realm.objects('Person');
      return Persons.filtered(str);
  };

  // 更新数据
  upData = (str,params) => {
      this.realm.write(() => {
          // 方式一
          // this.realm.create('Person', {id: 0, name: '皮皮虾,我们走', tel_number: '156xxxxxxxx', city: 'xx省xx市xxxxxx'}, true);

          // // 方式二:如果表中没有主键,那么可以通过直接赋值更新对象
          // // 获取Person对象
          let Persons = this.realm.objects('Person');
          // 设置筛选条件
          let person = Persons.filtered(str);
          // 更新数据
          Object.assign(person,params);
      })
  };

  // 删除数据
    removeAllData = () => {
        this.realm.write(() => {
            // 获取Person对象
            let Persons = this.realm.objects('Person');
            // 删除
            this.realm.delete(Persons);
        })
    }

};

const RealmModal = new RealmHelper();
export default RealmModal;