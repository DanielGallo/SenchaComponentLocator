Ext.define('CL.view.Main', {
    extend: 'Ext.container.Container',

    layout: 'card',

    controller: 'main',

    items: [{
        xtype: 'container',
        padding: 16,
        reference: 'statusMessage',
        cls: 'statusMessage'
    }, {
        xtype: 'tabpanel',

        deferredRender: false,

        items: [{
            xtype: 'locatorgrid',
            title: 'Locators'
        }, {
            xtype: 'apipanel',
            title: 'Sencha Test API Usage'
        }, {
            xtype: 'configgrid',
            title: 'Component Config'
        }, {
            xtype: 'aboutpanel',
            title: 'About'
        }]
    }]
});