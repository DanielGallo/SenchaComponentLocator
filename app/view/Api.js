Ext.define('CL.view.Api', {
    extend: 'Ext.form.Panel',
    xtype: 'apipanel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        afterlayout: 'onApiTabAfterLayout'
    },
    
    items: [{
        xtype: 'combobox',
        padding: '10 16 0 16',
        fieldLabel: 'Locator',
        store: 'locatorStore',
        queryMode: 'local',
        displayField: 'locator',
        valueField: 'id',
        reference: 'locatorCombo',
        editable: false,
        fieldStyle: 'font-family: Courier;',
        listConfig: {
            itemTpl: [
                '<div style="font-family: Courier; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">{locator:htmlEncode}</div>'
            ]
        },
        listeners: {
            change: 'onLocatorChange'
        }
    }, {
        xtype: 'container',
        reference: 'examplesContainer',
        flex: 1,
        style: 'padding: 16px;',
        scrollable: 'vertical'
    }]
});