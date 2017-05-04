Ext.define('CL.view.Locators', {
    extend: 'Ext.grid.Panel',
    xtype: 'locatorgrid',

    store: 'locatorStore',

    bufferedRenderer: false,

    viewConfig: {
        listeners: {
            refresh: {
                fn: 'onGridRefresh',
                buffer: 25
            }
        }
    },

    columns: [{
        xtype: 'widgetcolumn',
        width: 52,
        text: '',
        sortable: false,
        menuDisabled: true,
        draggable: false,
        widget: {
            xtype: 'button',
            iconCls: 'x-fa fa-clipboard',
            cls: 'grid-clipboard-button',
            tooltip: 'Copy to clipboard'
        }
    }, {
        flex: 1,
        text: 'Locator',
        dataIndex: 'locator',
        sortable: false,
        menuDisabled: true,
        draggable: false,
        renderer: function(value, metaData) {
            metaData.tdStyle = 'font-family: Courier;';
            return Ext.String.htmlEncode(value);
        }
    }, {
        width: 125,
        text: 'Matches',
        dataIndex: 'matches',
        sortable: false,
        menuDisabled: true,
        draggable: false,
        renderer: function(value, metaData) {
            if (value > 1) {
                metaData.tdStyle = 'color: red; font-weight: bold;';
            }
            return value;
        }
    }]
});