/**
 * Created by lhr on 2016/10/27.
*/
module.exports = {
    create_full_sync_fill:function (xml_data)
    {
                var HOME = require('./dip_home').dip_home;
                var http = require('http');
                var fs = require('fs');
                var xml = require('xml2js');
                var xmlParser = new xml.Parser({explicitArray: false}); // xml -> js
                var builder = new xml.Builder();//js ->xml
                xmlParser.parseString(xml_data, function (err, result) {
                    if (err)  throw err;
                    var fullsync = {
                        full_sync: {
                            db_file_multiblock_read_count: 128,
                            hash_multiblock_io_count: 1,
                            serial_direct_read: 'yes',
                            sort_area_size: 100,
                            sort_area_retained_size: 50,
                            sort_multiblock_read_count: 32,
                            sync_file_size: 32,
                            same_tablespace : 'no',
                            use_etl_rules : 0,
                        }
                    };
                    fullsync_fill = fullsync.full_sync;
                    result = result.dip_command.command_data;

            /*生成fullsync.xml文件*/
            if (result.export_dict_only === '1')
            {
                fullsync_fill.unload_start = 'yes';
                fullsync_fill.load_start = 'yes';
                fullsync_fill.unload_process = 1;
                fullsync_fill.load_process = 1;
                fullsync_fill.parallel_count = 1;
                fullsync_fill.parallel_unload = "no";
                fullsync_fill.truncate_table = 'no';
                fullsync_fill.create_table = result.create_table;
                fullsync_fill.create_index = 'yes';
                fullsync_fill.unload_string = 'no';
                fullsync_fill.file_backup = 'no';
                fullsync_fill.write_load_log = 'no';
                fullsync_fill.dip_nls_lang = "AMERICAN_AMERICA.ZHS16GBK";
                fullsync_fill.loader_name = result.component_name;
                fullsync_fill.export_dict_only = result.export_dict_only;
            }
            else
            {
                if (result.exp_task_num === 0) {
                    fullsync_fill.unload_start = 'no';
                }
                else {
                    fullsync_fill.unload_start = 'yes';
                }
                if (result.load_task_num === 0) {
                    fullsync_fill.load_start = "no";
                }
                else {
                    fullsync_fill.load_start = "yes";
                }
                fullsync_fill.unload_process = result.exp_task_num;
                fullsync_fill.load_process = result.load_task_num;
                fullsync_fill.parallel_count = result.table_task_num;
                if (result.table_task_num > 1) {
                    fullsync_fill.parallel_unload = 'yes';
                }
                else {
                    fullsync_fill.parallel_unload = 'no';
                }
                if ((result.nls_charset === "UTF-8") || (result.nls_charset === '')) {
                    fullsync_fill.dip_nls_lang = 'AMERICAN_AMERICA.UTF8';
                }
                else {
                    fullsync_fill.dip_nls_lang = 'AMERICAN_AMERICA.' + 'nls_charset';
                }
                fullsync_fill.truncate_table = result.clean_data;
                fullsync_fill.create_table = result.create_table;
                fullsync_fill.create_index = result.create_index;
                fullsync_fill.unload_string = result.unload_string;
                if (result.del_exp_data === "yes") {
                    fullsync_fill.file_backup = "no";
                }
                else {
                    fullsync_fill.file_backup = "yes";
                }
                fullsync_fill.write_load_log = result.write_load_log;
                fullsync_fill.loader_name = result.component_name;
                fullsync_fill.export_dict_only = result.export_dict_only;
            }

            if (result.create_table === 'yes')
            {
                if (result.keep_exists_table === 'yes') {
                    fullsync_fill.keep_exists_table = 'no';
                }
                else {
                    fullsync_fill.keep_exists_table = 'yes';
                }
            }
            else {
                fullsync_fill.keep_exists_table = 'no';
            }

            fs.writeFile('./createFile.xml', builder.buildObject(fullsync));

            /*生成fullsync_object.xml*/
            if ((result.flag === '1') || (result.flag === '0')) {
                var i = 0;
                var j = 0;
                var k = 0;
                var l = 0;
                var m = 0;
                var n = 0;
                var grp = result.group;
                var component = result.component_name;
                var create_object = {sync_objects: {record:[]}};
                var apply_name = HOME + 'etc/' + grp + '/apply_'　+ component +'.xml';
                //var apply_name = './apply_l.xml'
                fs.readFile(apply_name,'utf-8',function(err,data) {
                    if (err) throw err;
                    xmlParser.parseString(data, function (err, apply_data) {
                    var apply = apply_data.apply_config;
                    while (result.record[j]) {
                        /*替换schema*/
                        var schema = result.record[j].owner.toString();
                        var a = apply.filters.filter[0];
                        //console.log(a.schema[k].name);
                        while (a.schema[k]) {
                            if(schema === a.schema[k].name)
                            {
                                console.log(k);
                                break;
                            }
                            k++;
                        }

                        if (a.schema[k].mapping_name !== undefined) {

                            result.record[j].owner = a.schema[k].mapping_name;
                        }
                        /*替换Table*/
                        while (result.record[j].table_name.list[l]) {
                            console.log(result.record[j].table_name.list[l]);
                            var table = result.record[j].table_name.list[l].table.toString();
                            while ('TABLE' !== a.schema[k].object_type[m]) {
                                m++;
                            }
                            while (table !== a.schema[k].object_type[m].object[n].name) {
                                n++;
                            }
                            if (a.schema[k].object_type[m].object[n].mapping_name !== undefined) {
                                result.record[j].table_name.table.list[l].table =
                                    a.schema[k].object_type[m].object[n].mapping_name;
                            }
                            l++;
                        }
                        j++;
                    }
                  });
                });
                while (result.record[i]) {
                    create_object.sync_objects.record[i] = result.record[i];
                    i++;
                }
                fs.writeFile('./create_object.xml', builder.buildObject(create_object));
            }
        });
    }
}