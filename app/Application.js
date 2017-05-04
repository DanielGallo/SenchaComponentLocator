Ext.application({
    name: 'CL',

    stores: [
        'CL.data.LocatorStore',
        'CL.data.ConfigStore'
    ],
    
    launch: function () {
        Ext.create('CL.view.Main', {
            renderTo: Ext.getBody(),
            plugins: 'viewport'
        });
    }
});