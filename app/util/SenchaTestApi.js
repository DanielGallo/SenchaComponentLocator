Ext.define('CL.util.SenchaTestApi', {
    singleton: true,

    // Map xtypes to Sencha Test Future APIs
    futureApis: [{
        xtypes: ['button', 'splitbutton', 'segmentedbutton', 'cycle'],
        name: 'Button',
        className: 'ST.button',
        future: `ST.button('{0}')`,
        examples: [{
            description: 'Click the button',
            name: 'click',
            example: `.click()`
        }, {
            description: 'Check the button is disabled',
            name: 'disabled',
            example: `.disabled()`
        }, {
            description: 'Check the button is enabled',
            name: 'enabled',
            example: `.enabled()`
        }]
    }, {
        xtypes: ['checkbox', 'checkboxinput', 'checkboxfield'],
        name: 'CheckBox',
        className: 'ST.checkBox',
        future: `ST.checkBox('{0}')`,
        examples: [{
            description: 'Checks the checkbox',
            name: 'check',
            example: `.check()`
        }, {
            description: 'Unchecks the checkbox',
            name: 'uncheck',
            example: `.uncheck()`
        }, {
            description: 'Check the checkbox is checked',
            name: 'checked',
            example: `.checked()`
        }, {
            description: 'Check the checkbox is unchecked',
            name: 'unchecked',
            example: `.unchecked()`
        }]
    }, {
        xtypes: ['combo', 'combobox'],
        name: 'ComboBox',
        className: 'ST.comboBox',
        future: `ST.comboBox('{0}')`,
        examples: [{
            description: 'Set the selected value of the ComboBox',
            name: 'setValue',
            example: `.setValue('Hello world')`
        }]
    }, {
        xtypes: ['gridpanel', 'grid'],
        name: 'Grid',
        className: 'ST.grid',
        future: `ST.grid('{0}')`,
        examples: [{
            description: `Reference a row by the record's <code>idProperty</code>`,
            name: 'row',
            example: `.row(id)`
        }, {
            description: 'Reference a row at a particular index in the grid',
            name: 'rowAt',
            example: `.rowAt(index)`
        }, {
            description: 'Reference a row given the name of the property/field and the match value',
            name: 'rowWith',
            example: `.rowWith('name', 'Hello world')`
        }, {
            description: 'Reference a cell at a particular index in a grid row',
            name: 'cellAt',
            apiClassName: 'Row',
            example: `.rowAt(<b>rowIndex</b>)\n    .cellAt(<b>cellIndex</b>)`
        }, {
            description: 'Reference a cell given the name of the property/field and the match value within a grid row',
            name: 'cellWith',
            apiClassName: 'Row',
            example: `.rowAt(<b>rowIndex</b>)\n    .cellWith('name', 'Hello world')`
        }]
    }, {
        xtypes: ['listitem', 'simplelistitem', 'gridrow', 'pivotgridrow'],
        name: 'Component',
        className: 'ST.component',
        future: `ST.component('{0}')`,
        examples: [{
            description: 'Click the row',
            name: 'click',
            example: `.click()`
        }, {
            description: 'Reference a row at a particular index in the grid',
            name: 'rowAt',
            future: `ST.grid('{0}')`,
            apiClassName: 'Grid',
            example: `.rowAt(<b>rowIndex</b>)`
        }, {
            description: 'Reference a row given the name of the property/field and the match value',
            name: 'rowWith',
            future: `ST.grid('{0}')`,
            apiClassName: 'Grid',
            example: `.rowWith('name', 'Hello world')`
        }]
    }, {
        xtypes: ['gridcell', 'pivotgridcell', 'booleancell', 'checkcell', 'datecell', 'gridcell', 'numbercell', 'rownumberercell', 'summarycell', 'textcell', 'treecell'],
        name: 'Component',
        className: 'ST.component',
        future: `ST.component('{0}')`,
        examples: [{
            description: 'Click the cell',
            name: 'click',
            example: `.click()`
        }, {
            description: 'Assert that the <code>textContent</code> of the cell matches a particular string',
            name: 'text',
            example: `.text('Hello world')`
        }, {
            description: 'Reference a cell at a particular index in a grid row',
            name: 'cellAt',
            future: `ST.grid('{0}')`,
            apiClassName: 'Row',
            example: `.rowAt(<b>rowIndex</b>)\n    .cellAt(<b>cellIndex</b>)`
        }, {
            description: 'Reference a cell given the name of the property/field and the match value within a grid row',
            name: 'cellWith',
            future: `ST.grid('{0}')`,
            apiClassName: 'Row',
            example: `.rowAt(<b>rowIndex</b>)\n    .cellWith('name', 'Hello world')`
        }]
    }, {
        xtypes: ['panel'],
        name: 'Panel',
        className: 'ST.panel',
        future: `ST.panel('{0}')`,
        examples: []
    }, {
        xtypes: ['textfield', 'textareafield', 'textinput', 'textareainput'],
        name: 'TextField',
        className: 'ST.textField',
        future: `ST.textField('{0}')`,
        examples: [{
            description: 'Set the value of the field',
            name: 'setValue',
            example: `.setValue('Hello world')`
        }, {
            description: 'Type text in to the field. If the field already has a value, the typed text is appended to the existing value',
            name: 'type',
            example: `.focus()\n    .type('Hello world')`
        }, {
            description: 'Assert that the value of the field matches a specified value',
            name: 'value',
            example: `.value('Hello world')`
        }]
    }, {
        xtypes: ['selectfield'],
        name: 'SelectField',
        className: 'ST.select',
        future: `ST.select('{0}')`,
        examples: [{
            description: 'Expand the Select field',
            name: 'expand',
            example: `.expand()`
        }, {
            description: 'Collapse the Select field',
            name: 'collapse',
            example: `.collapse()`
        }, {
            description: 'Set the value of the field',
            name: 'setValue',
            example: `.setValue('Hello world')`
        }, {
            description: 'Assert that the value of the field matches a specified value',
            name: 'value',
            example: `.value('Hello world')`
        }]
    }, {
        xtypes: ['field'],
        name: 'Field',
        className: 'ST.field',
        future: `ST.field('{0}')`,
        examples: [{
            description: 'Set the value of the field',
            name: 'setValue',
            example: `.setValue('Hello world')`
        }, {
            description: 'Type text in to the field. If the field already has a value, the typed text is appended to the existing value',
            name: 'type',
            example: `.focus()\n    .type('Hello world')`
        }, {
            description: 'Assert that the value of the field matches a specified value',
            name: 'value',
            example: `.value('Hello world')`
        }]
    }],

    // Fallback option when there's no specific Futures API - so use ST.component
    standardFutureApis: {
        name: 'Component',
        className: 'ST.component',
        future: `ST.component('{0}')`,
        examples: [{
            description: 'Click the component',
            name: 'click',
            example: `.click()`
        }, {
            description: 'Assert that the <code>textContent</code> of the component matches a specified value',
            name: 'text',
            example: `.text('Hello world')`
        }]
    },

    // Generic common methods that apply to all Futures API
    genericFutureApis: [{
        description: 'Assert that the component is hidden',
        name: 'hidden',
        example: `.hidden()`
    }, {
        description: 'Assert that the component is visible',
        name: 'visible',
        example: `.visible()`
    }]
});