Ext.define('CL.data.ConfigStore', {
    extend: 'Ext.data.Store',

    storeId: 'configStore',

    fields: ['config', 'value'],

    sorters: ['config']
});