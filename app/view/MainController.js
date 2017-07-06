Ext.define('CL.view.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    docsUrl: 'https://docs.sencha.com/sencha_test/2.1.1/api/ST.future.{0}.html',
    methodSuffix: '#method-{0}',

    clipboard: null,
    gridClipboard: null,

    init: function() {
        var me = this;

        if (chrome.devtools) {
            chrome.devtools.panels.elements.onSelectionChanged.addListener(me.getElementData.bind(me));

            me.getElementData();
        }
    },

    getElementData: function () {
        var me = this;

        chrome.devtools.inspectedWindow.eval("new (" + ComponentLocator.toString() + ")($0)", me.processElementData.bind(me));
    },

    processElementData: function(result) {
        var me = this,
            view = me.getView(),
            locatorStore = Ext.getStore('locatorStore'),
            configStore = Ext.getStore('configStore'),
            locatorCombo = me.lookupReference('locatorCombo'),
            statusMessage = me.lookupReference('statusMessage');

        statusMessage.setHtml('');
        me.resetApiExample();

        if (me.gridClipboard) {
            // Destroy the clipboard plugin that's bound to the copy buttons in the Locators grid
            me.gridClipboard.destroy();
            me.gridClipboard = null;
        }

        locatorStore.removeAll();
        configStore.removeAll();

        if (!result) {
            view.setActiveItem(0);
            statusMessage.setHtml('No Sencha component associated with the selected element. Please select a different element.');
            return;
        }

        if (result.locators) {
            view.setActiveItem(1);

            locatorStore.loadData(result.locators);
            configStore.loadData(result.configs);

            if (locatorStore.count() > 0) {
                locatorCombo.setValue(locatorStore.getAt(0).getId());
            }
        } else {
            view.setActiveItem(0);

            if (result.error) {
                statusMessage.setHtml(Ext.String.htmlEncode(result.error));
            } else {
                statusMessage.setHtml('An unhandled error occurred. Please try selecting a different element.');
            }
        }
    },

    resetApiExample: function () {
        var me = this,
            view = me.getView(),
            apiView = view.down('apipanel'),
            codeBlock = apiView.down('container'),
            buttons = Ext.ComponentQuery.query('button[cls="clipboard-button"]');

        if (me.clipboard) {
            // Destroy the clipboard plugin that's bound to the copy buttons in the API Usage tab
            me.clipboard.destroy();
            me.clipboard = null;
        }

        // Destroy the clipboard copy buttons, as these aren't managed by the containing view and will start to build
        // up in memory.
        Ext.destroy(buttons);
        buttons = null;

        // Clear the code samples on API Usage tab
        codeBlock.setHtml('');
    },

    generateApiExample: function (id) {
        var me = this,
            view = me.getView(),
            locatorStore = Ext.getStore('locatorStore'),
            locator = locatorStore.getById(id),
            apiView = view.down('apipanel'),
            codeBlock = apiView.down('container'),
            xtypes, html, baseExample, additionalExamples, codeElements, copyButton, docsUrl, exampleDocsUrl,
            methodSuffix, api, examples, subExample, owningComponentLocator, skip;

        if (locator) {
            xtypes = locator.get('xtypes');

            // Use Grid xtype before all others (otherwise examples will be based on standard Panel or Component)
            if (xtypes.indexOf('grid') >= 0) {
                xtypes.splice(0, 0, xtypes.splice(xtypes.indexOf('grid'), 1)[0]);
            }

            if (xtypes.indexOf('treepanel') >= 0) {
                xtypes.splice(0, 0, xtypes.splice(xtypes.indexOf('treepanel'), 1)[0]);
            }

            xtypesSearch:
            for (let xtype of xtypes) {
                for (let futureApi of CL.util.SenchaTestApi.futureApis) {
                    if (futureApi.xtypes.includes(xtype)) {
                        api = futureApi;
                        break xtypesSearch;
                    }
                }
            }

            if (!api) {
                api = CL.util.SenchaTestApi.standardFutureApis;
            }

            baseExample = Ext.String.format(api.future, Ext.String.htmlEncode(locator.get('locator').replace("'", "\\'")));
            owningComponentLocator = locator.get('owningComponentLocator');
            additionalExamples = ``;

            docsUrl = Ext.String.format(me.docsUrl, api.name);

            if (api.examples) {
                examples = api.examples.concat(CL.util.SenchaTestApi.genericFutureApis);

                examples.sort(function(exampleA, exampleB) {
                    var nameA = exampleA.name.toUpperCase();
                    var nameB = exampleB.name.toUpperCase();

                    if (nameA < nameB) {
                        return -1;
                    }

                    if (nameA > nameB) {
                        return 1;
                    }

                    return 0;
                });

                for (let example of examples) {
                    methodSuffix = Ext.String.format(me.methodSuffix, example.name);
                    skip = false;
                    
                    // This method belongs to a different class, so alter the docs URL
                    if (example.apiClassName) {
                        exampleDocsUrl = Ext.String.format(me.docsUrl, example.apiClassName);
                    } else {
                        exampleDocsUrl = docsUrl;
                    }

                    // Using a different Future API class for this example
                    if (example.future) {
                        if (owningComponentLocator) {
                            subExample = Ext.String.format(example.future, Ext.String.htmlEncode(owningComponentLocator));
                        } else {
                            skip = true;
                        }
                    } else {
                        subExample = baseExample;
                    }

                    if (!skip) {
                        additionalExamples += `<h3 style="font-family: Courier;"><a href="${exampleDocsUrl}${methodSuffix}" target="STApiDocs">${example.name}</a></h3>
                                                   <p>${example.description}</p>
                                                   <p><pre style="min-height: 42px;"><code class="javascript">${subExample}<br>    ${example.example};</code></pre></p>`;
                    }
                }
            }

            html = `<h2>Futures API (<a href="${docsUrl}" target="STApiDocs"><span style="font-family: Courier;">${api.className}</span></a>)</h2>

                    <p>Below is an example of using the selected locator in the Sencha Test Futures API. This basic example returns a reference to the component and is a useful mechanism for validating that a component exists. If the component is not located within the default timeout period, the test/spec will fail.</p>
                    <p><pre style="min-height: 42px;"><code class="javascript">${baseExample};</code></pre></p>
                    
                    <p>This example shows the above code used within the context of a Jasmine test suite:</p>
                    
                    <p><pre style="min-height: 42px;"><code class="javascript">describe('MyTestSuite', function() \{\n    it('Should find the component', function() \{\n        ${baseExample};\n    \});\n\});</code></pre></p>
                    
                    <h2>Common Examples</h2>
                    ${additionalExamples}`;

            codeBlock.setHtml(html);

            codeElements = codeBlock.getEl().query('pre');

            for (let codeElement of codeElements) {
                hljs.highlightBlock(codeElement);

                copyButton = Ext.create('Ext.button.Button', {
                    renderTo: codeElement,
                    iconCls: 'x-fa fa-clipboard',
                    cls: 'clipboard-button',
                    tooltip: 'Copy to clipboard',
                    floating: true,
                    shadow: false
                });

                me.alignCopyButton(copyButton, codeElement);
            }

            me.clipboard = new Clipboard('.clipboard-button', {
                target: function(trigger) {
                    return trigger.parentNode;
                }
            });

            me.clipboard.on('success', function(e) {
                e.clearSelection();

                Ext.toast('Copied to clipboard!');
            });
        }
    },

    alignCopyButton: function(button, elementToAlign) {
        button.alignTo(elementToAlign, 'tr-tr', [-5, 5]);
    },

    onLocatorChange: function(combobox, value) {
        var me = this,
            examplesContainer = me.lookupReference('examplesContainer');

        me.resetApiExample();
        me.generateApiExample(value);

        examplesContainer.hide();
        Ext.Function.defer(me.scrollExamplesToTop, 1, me);
    },

    scrollExamplesToTop: function() {
        var me = this,
            examplesContainer = me.lookupReference('examplesContainer');

        examplesContainer.scrollTo(0, 0);
        examplesContainer.show();
    },

    onGridRefresh: function() {
        var me = this;

        me.gridClipboard = new Clipboard('.grid-clipboard-button', {
            text: function(trigger) {
                return trigger.parentNode.parentNode.parentNode.children[1].firstChild.innerText;
            }
        });

        me.gridClipboard.on('success', function(e) {
            e.clearSelection();

            Ext.toast('Copied to clipboard!');
        });
    },

    onApiTabAfterLayout: function() {
        var me = this,
            view = me.getView(),
            apiView = view.down('apipanel'),
            codeBlock = apiView.down('container'),
            codeElements = codeBlock.getEl().query('pre'),
            copyButtons = Ext.ComponentQuery.query('button[cls="clipboard-button"]');

        if (codeElements.length === copyButtons.length) {
            for (var copyButton of copyButtons) {
                me.alignCopyButton(copyButton, codeElements[copyButtons.indexOf(copyButton)]);
            }
        }
    }
});