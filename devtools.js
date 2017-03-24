class ComponentLocator {
    constructor() {
        /*
            Store a reference to the window object
         */
        this.win = $0.ownerDocument.defaultView || window;

        /*
            `locators` will hold an array of the valid locators, looking something like this:

                 [{
                    locator: 'main button[itemId=logout]',
                    priority: 1
                 }, {
                    locator: 'button[itemId=logout]',
                    priority: 2
                 }, {
                    locator: 'button',
                    priority: 3
                 }]

            The `priority` can be any value from 1 to 4, with 1 being highest priority (most specific), so those
            locators should be grouped first in the valid list of locators.
        */
        this.locators = [];

        // Default types from which we can build valid Component Queries/Locators from
        this.configureSupportedConfigs();

        return this.getComponentLocators();
    }

    configureSupportedConfigs() {
        var configs = [{
            prop: 'dataIndex'
        }, {
            prop: 'record'
        }, {
            prop: 'iconCls'
        }, {
            prop: 'itemId'
        }, {
            prop: 'label'
        }, {
            prop: 'name'
        }, {
            prop: 'reference'
        }, {
            prop: 'text'
        }, {
            prop: 'title'
        }, {
            prop: 'type'
        }], getter;

        // Populate getter function names for the above configs.
        for (let supportedConfig of configs) {
            if (supportedConfig.prop.charAt(0) != '$') {
                getter = 'get' + supportedConfig.prop.charAt(0).toUpperCase() + supportedConfig.prop.slice(1);
                supportedConfig.getter = getter;
            }
        }

        this.supportedConfigs = configs;
    }

    isSupportedApp() {
        if (this.win.Ext) {
            var ext = this.win.Ext;

            if (ext.versions && ext.versions.extjs && ext.versions.extjs.major && ext.versions.extjs.major >= 4) {
                return true;
            }
        }

        return false;
    }

    addLocator(locator, container, priority) {
        var me = this,
            containerEl;

        if (container && container.xtype) {
            containerEl = container.el;

            if (container.getItemId && container.getItemId() != null && container.getItemId() != ''
                && containerEl && containerEl.id != container.getItemId()) {
                locator = container.xtype + '#' + container.getItemId() + ' ' + locator;
            } else {
                locator = container.xtype + ' ' + locator;
            }
        } else if (container === undefined) {
            // Container has explicitly been passed in, but it's undefined (no container)
            return;
        }

        me.locators.push({
            locator: locator,
            priority: priority
        });
    }

    getComponentLocators() {
        var me = this,
            element = $0,
            formattedLocators = {},
            locatorCount = 0,
            cmp, container, container2, grid, list, tabpanel, panel, config, data, locator, locatorValue, record, xtypes, locatorExtra;

        if (!me.isSupportedApp()) {
            return {
                error: 'The Component Locator only supports apps developed with Ext JS 4 or higher.'
            };
        } else {
            // Traverse up the DOM a maximum of 10 parent nodes to find an element that has an associated Ext JS component.
            for (var i = 0; i < 10; i++) {
                cmp = (element && element.id) ? Ext.getCmp(element.id) : null;

                // If we find a component, then break out of the loop
                if (cmp) {
                    break;
                } else {
                    // Otherwise, reference the parent element, so the next iteration of the loop checks that element for an
                    // associated component.
                    if (element.parentElement) {
                        element = element.parentElement;
                    } else {
                        break;
                    }
                }
            }

            if (!cmp) {
                return {
                    error: 'No valid component found from selected element.'
                };
            }

            grid = cmp.up('grid');
            list = cmp.up('list');
            tabpanel = cmp.up('tabpanel');
            panel = cmp.up('panel');

            config = cmp.config || {};
            data = {};

            // Find different types of container for the item, like grid/list, otherwise default to a containing component
            if (grid) {
                container = grid;
            } else if (list) {
                container = list;
            } else if (tabpanel) {
                container = tabpanel;
            } else if (panel) {
                container = panel;
            } else if (cmp.getField) {
                container = cmp.getField();
            } else {
                container = cmp.up('component');
            }

            // Widget doesn't have "getXTypes()"
            if (cmp.getXTypes) {
                xtypes = cmp.getXTypes().split('/');
            } else {
                xtypes = [ cmp.xtype ];
            }

            for (let supportedConfig of me.supportedConfigs) {
                try {
                    if (cmp[supportedConfig.getter]) {
                        locatorValue = cmp[supportedConfig.getter]();
                    } else {
                        locatorValue = config[supportedConfig.prop];
                    }
                } catch(e) {
                    locatorValue = null;
                }

                // If the returned itemId matches the element's id, it's just an auto-generated id, so we should ignore it.
                // And if the locator value is null or an empty string, ignore it.
                if ((supportedConfig.prop == 'itemId' && locatorValue == element.id)
                    || (locatorValue == null || locatorValue == '')) {
                    continue;
                } else if ((xtypes.indexOf('listitem') >= 0
                    || xtypes.indexOf('simplelistitem')  >= 0
                    || xtypes.indexOf('gridrow') >= 0
                    || xtypes.indexOf('pivotgridrow') >= 0
                    || xtypes.indexOf('pivotgridcell') >= 0
                    || xtypes.indexOf('gridcell') >= 0
                    || xtypes.indexOf('booleancell') >= 0
                    || xtypes.indexOf('checkcell') >= 0
                    || xtypes.indexOf('datecell') >= 0
                    || xtypes.indexOf('gridcell') >= 0
                    || xtypes.indexOf('numbercell') >= 0
                    || xtypes.indexOf('rownumberercell') >= 0
                    || xtypes.indexOf('summarycell') >= 0
                    || xtypes.indexOf('textcell') >= 0
                    || xtypes.indexOf('treecell') >= 0
                    || xtypes.indexOf('widgetcell') >= 0)
                    && supportedConfig.prop == 'record' && cmp.getRecord) {
                    // In the Modern toolkit, ListItem and SimpleListItem are Components.

                    record = cmp.getRecord();

                    if (record) {
                        var recordId = record.getId(),
                            recordName = record.get('name'),
                            recordText = record.get('text');

                        locatorExtra = '';

                        // This is a Modern grid cell, so get the dataIndex of the cell
                        if ((xtypes.indexOf('gridcell') >= 0
                            || xtypes.indexOf('pivotgridcell') >= 0
                            || xtypes.indexOf('booleancell') >= 0
                            || xtypes.indexOf('checkcell') >= 0
                            || xtypes.indexOf('datecell') >= 0
                            || xtypes.indexOf('gridcell') >= 0
                            || xtypes.indexOf('numbercell') >= 0
                            || xtypes.indexOf('rownumberercell') >= 0
                            || xtypes.indexOf('summarycell') >= 0
                            || xtypes.indexOf('textcell') >= 0
                            || xtypes.indexOf('treecell') >= 0
                            || xtypes.indexOf('widgetcell') >= 0)
                            && cmp.dataIndex && cmp.dataIndex != '') {

                            // Tag on the dataIndex, and also check the "_record" object exists - it appears it
                            // may not exist on all cells, which could cause an exception due to referencing
                            // the "id" when "_record" is null
                            locatorExtra = '[dataIndex=' + cmp.dataIndex + ']{_record}';
                        }

                        if (typeof(recordId) == 'string') {
                            locator = cmp.xtype + locatorExtra + '{_record.id=="' + recordId + '"}';
                        } else {
                            locator = cmp.xtype + locatorExtra + '{_record.id==' + recordId + '}';
                        }

                        me.addLocator(locator, container, 1);
                        me.addLocator(locator, null, 2);

                        if (recordName) {
                            locator = cmp.xtype + locatorExtra + '{_record.data.name=="' + recordName.replace('"', '\\\\"').replace(',', '\\\\,') + '"}';
                            me.addLocator(locator, container, 1);
                            me.addLocator(locator, null, 2);
                        }

                        if (recordText) {
                            locator = cmp.xtype + locatorExtra + '{_record.data.text=="' + recordText.replace('"', '\\\\"').replace(',', '\\\\,') + '"}';
                            me.addLocator(locator, container, 1);
                            me.addLocator(locator, null, 2);
                        }

                        if ((xtypes.indexOf('listitem') >= 0
                            || xtypes.indexOf('simplelistitem')  >= 0
                            || xtypes.indexOf('gridrow') >= 0
                            || xtypes.indexOf('pivotgridrow') >= 0)
                            && cmp.$dataIndex) {

                            locator = cmp.xtype + '[$dataIndex=' + cmp.$dataIndex + ']';
                            me.addLocator(locator, container, 1);
                            me.addLocator(locator, null, 2);
                        } else {
                            container2 = cmp.parent;

                            // `container2` is a grid row, which should have a numeric `$dataIndex`.
                            if (container2 && container2.$dataIndex) {
                                if (typeof(recordId) == 'string') {
                                    locator = container2.xtype + '[$dataIndex=' + container2.$dataIndex + '] ' + cmp.xtype + '[dataIndex=' + cmp.dataIndex + ']';
                                } else {
                                    locator = container2.xtype + '[$dataIndex=' + container2.$dataIndex + '] ' + cmp.xtype + '[dataIndex=' + cmp.dataIndex + ']';
                                }

                                me.addLocator(locator, container, 1);
                                me.addLocator(locator, null, 2);
                            }
                        }
                    }
                } else if (supportedConfig.prop == 'itemId') {
                    locator = cmp.xtype + '#' + locatorValue;

                    me.addLocator(locator, container, 1);
                    me.addLocator(locator, null, 2);
                } else if (supportedConfig.prop != 'record') {
                    locator = cmp.xtype + '[' + supportedConfig.prop + '=' + locatorValue + ']';

                    me.addLocator(locator, container, 1);
                    me.addLocator(locator, null, 2);
                }
            }

            me.addLocator(cmp.xtype, container, 3);
            me.addLocator(cmp.xtype, null, 4);

            for (var key in config) {
                if (config.hasOwnProperty(key)) {
                    var value = config[key];

                    if (value != null
                        && typeof value != 'undefined'
                        && !Ext.isObject(value)
                        && !Ext.isArray(value)
                        && !Ext.isFunction(value)) {
                        data[key] = value.toString();
                    }
                }
            }

            // Let user see the list of configured `config` properties
            formattedLocators['_configProperties'] = data;

            // If this component has an associated record, show the record's `data` object to the user
            if (record) {
                formattedLocators['_recordData'] = record.data;
            }

            // Sort the locators in order of priority, with most specific first.
            me.locators.sort((locatorA, locatorB) => locatorA.priority - locatorB.priority);

            for (let loc of me.locators) {
                formattedLocators['locator' + locatorCount] = loc.locator;
                locatorCount ++;
            }

            return formattedLocators;
        }
    }
}

chrome.devtools.panels.elements.createSidebarPane(
    "Sencha Component Locator",
    function (sidebar) {
        function updateComponentProperties() {
            sidebar.setExpression("new (" + ComponentLocator.toString() + ")()");
        }

        updateComponentProperties();

        chrome.devtools.panels.elements.onSelectionChanged.addListener(updateComponentProperties);
    });
