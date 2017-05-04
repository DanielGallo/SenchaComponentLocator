Ext.define('CL.view.Configs', {
    extend: 'Ext.grid.Panel',
    xtype: 'configgrid',

    store: 'configStore',

    selModel: {
        type: 'spreadsheet',
        rowSelect: false
    },

    plugins: [ 'clipboard' ],

    columns: [{
        flex: 1,
        text: 'Config',
        dataIndex: 'config',
        menuDisabled: true
    }, {
        flex: 1,
        text: 'Value',
        dataIndex: 'value',
        menuDisabled: true
    }]
});