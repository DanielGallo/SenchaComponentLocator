class ComponentLocator {
    constructor(element) {
        var me = this;

        /*
         Store a reference to the window object
         */
        me.win = element.ownerDocument.defaultView || window;

        me.element = element;

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
        me.locators = [];

        // Default types from which we can build valid Component Queries/Locators from
        me.configureSupportedConfigs();

        return me.getComponentLocators();
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

    addLocator(xtypes, locator, container, priority, owningComponent) {
        var me = this,
            owningComponentLocator = null,
            containerEl, owningComponentEl, locatorTestString, queryResults, xtype;

        if (container && container.xtype) {
            containerEl = container.el;

            // Properly escape and handle XTypes with dots on the containing component
            xtype = container.xtype.replace('.', '\\\\.');

            if (container.getItemId && container.getItemId() != null && container.getItemId() != ''
                && containerEl && containerEl.id && containerEl.id != container.getItemId()
                && container.autoGenId == false) {
                locator = xtype + '#' + container.getItemId() + ' ' + locator;
            } else {
                locator = xtype + ' ' + locator;
            }
        } else if (container === undefined) {
            // Container has explicitly been passed in, but it's undefined (no container)
            return;
        }

        if (owningComponent && owningComponent.xtype) {
            owningComponentEl = owningComponent.el;
            xtype = owningComponent.xtype.replace('.', '\\\\.');

            if (owningComponent.getItemId && owningComponent.getItemId() != null && owningComponent.getItemId() != ''
                && owningComponentEl && owningComponentEl.id && owningComponentEl.id != owningComponent.getItemId()
                && owningComponent.autoGenId == false) {
                owningComponentLocator = xtype + '#' + owningComponent.getItemId();
            } else {
                owningComponentLocator = xtype;
            }
        }

        locatorTestString = locator.replace('\\\\', '\\');

        // Test the generated locator to ensure its validity
        queryResults = Ext.ComponentQuery.query(locatorTestString);

        // If there's at least 1 match, include it in the results
        if (queryResults.length > 0) {
            me.locators.push({
                locator: locator,
                owningComponentLocator: owningComponentLocator,
                priority: priority,
                matches: queryResults.length,
                xtypes: xtypes
            });
        }
    }

    getComponentLocators() {
        var me = this,
            element = me.element,
            formattedLocators = {},
            cmp, container, container2, grid, list, tabpanel, panel, config, configs, locator, locatorValue,
            record, xtypes, locatorExtra, xtype;

        if (!me.isSupportedApp()) {
            return {
                error: 'The Component Locator only supports apps developed with Sencha Ext JS 4 or higher.'
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
                    error: 'No Sencha component associated with the selected element. Please select a different element.'
                };
            }

            grid = cmp.up('grid');
            list = cmp.up('list');
            tabpanel = cmp.up('tabpanel');
            panel = cmp.up('panel');

            config = cmp.config || {};

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

            // Create an array of XTypes. (Widget doesn't have "getXTypes()")
            if (cmp.getXTypes) {
                xtypes = cmp.getXTypes().split('/');
            } else {
                xtypes = [ cmp.xtype ];
            }

            // Properly escape and handle XTypes with dots
            xtype = cmp.xtype.replace('.', '\\\\.');

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

                // Make sure the locator value is suitable for use in a locator
                if (locatorValue != null
                    && typeof locatorValue !== 'undefined'
                    && !Ext.isObject(locatorValue)
                    && !Ext.isArray(locatorValue)
                    && !Ext.isFunction(locatorValue)) {

                    // If the returned itemId matches the element's id, it's just an auto-generated id, so we should ignore it.
                    // And if the locator value is null or an empty string, ignore it.
                    if ((supportedConfig.prop == 'itemId' && locatorValue == element.id)
                        || (locatorValue == null || locatorValue == '')) {
                        continue;
                    } else if ((xtypes.indexOf('listitem') >= 0
                        || xtypes.indexOf('simplelistitem') >= 0
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
                                locatorExtra = '[dataIndex=' + cmp.dataIndex + ']';
                            }

                            locatorExtra += '{_record}';

                            if (typeof(recordId) == 'string') {
                                locator = xtype + locatorExtra + '{_record.id=="' + recordId + '"}';
                            } else {
                                locator = xtype + locatorExtra + '{_record.id==' + recordId + '}';
                            }

                            me.addLocator(xtypes, locator, container, 1, container);
                            me.addLocator(xtypes, locator, null, 2, container);

                            if (recordName) {
                                locator = xtype + locatorExtra + '{_record.data.name=="' + recordName.replace('"', '\\\\"').replace(',', '\\\\,') + '"}';
                                me.addLocator(xtypes, locator, container, 1, container);
                                me.addLocator(xtypes, locator, null, 2, container);
                            }

                            if (recordText) {
                                locator = xtype + locatorExtra + '{_record.data.text=="' + recordText.replace('"', '\\\\"').replace(',', '\\\\,') + '"}';
                                me.addLocator(xtypes, locator, container, 1, container);
                                me.addLocator(xtypes, locator, null, 2, container);
                            }

                            if ((xtypes.indexOf('listitem') >= 0
                                || xtypes.indexOf('simplelistitem') >= 0
                                || xtypes.indexOf('gridrow') >= 0
                                || xtypes.indexOf('pivotgridrow') >= 0)
                                && cmp.$dataIndex) {

                                locator = xtype + '[$dataIndex=' + cmp.$dataIndex + ']';
                                me.addLocator(xtypes, locator, container, 1, container);
                                me.addLocator(xtypes, locator, null, 2, container);
                            } else {
                                container2 = cmp.parent;

                                // `container2` is a grid row, which should have a numeric `$dataIndex`.
                                if (container2 && container2.$dataIndex) {
                                    if (typeof(recordId) == 'string') {
                                        locator = container2.xtype + '[$dataIndex=' + container2.$dataIndex + '] ' + xtype + '[dataIndex=' + cmp.dataIndex + ']';
                                    } else {
                                        locator = container2.xtype + '[$dataIndex=' + container2.$dataIndex + '] ' + xtype + '[dataIndex=' + cmp.dataIndex + ']';
                                    }

                                    me.addLocator(xtypes, locator, container, 1, container);
                                    me.addLocator(xtypes, locator, null, 2, container);
                                }
                            }
                        }
                    } else if (supportedConfig.prop == 'itemId') {
                        locator = xtype + '#' + locatorValue;

                        me.addLocator(xtypes, locator, container, 1, container);
                        me.addLocator(xtypes, locator, null, 2, container);
                    } else if (supportedConfig.prop != 'record') {
                        locator = xtype + '[' + supportedConfig.prop + '=' + locatorValue + ']';

                        me.addLocator(xtypes, locator, container, 1, container);
                        me.addLocator(xtypes, locator, null, 2, container);
                    }
                }
            }

            me.addLocator(xtypes, xtype, container, 3, container);
            me.addLocator(xtypes, xtype, null, 4, container);

            configs = [];

            for (var key in config) {
                if (config.hasOwnProperty(key)) {
                    var value = config[key];

                    if (value != null
                        && typeof value != 'undefined'
                        && !Ext.isObject(value)
                        && !Ext.isArray(value)
                        && !Ext.isFunction(value)) {
                        configs.push({
                            config: key,
                            value: value.toString()
                        });
                    }
                }
            }

            // Let user see the list of configured `config` properties
            formattedLocators['configs'] = configs;

            // If this component has an associated record, show the record's `data` object to the user
            if (record) {
                formattedLocators['recordData'] = record.data;
            }

            // Sort the locators in order of priority, with most specific first.
            me.locators.sort((locatorA, locatorB) => locatorA.priority - locatorB.priority);

            formattedLocators['locators'] = me.locators;

            return formattedLocators;
        }
    }
}
