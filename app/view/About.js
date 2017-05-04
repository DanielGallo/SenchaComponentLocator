Ext.define('CL.view.About', {
    extend: 'Ext.container.Container',
    xtype: 'aboutpanel',

    padding: 16,

    scrollable: true,

    html: `<h2>Sencha Component Locator</h2>
            
            <p>
                This extension enables you to easily find Sencha Ext JS Components from DOM elements and generates 
                various locators for them.
            </p>
            
            <p>
                Simply inspect elements on the page, and the Component Locator will try and find the associated Ext JS 
                Component and suggest a variety of different locators.
            </p>

            <p>
                This extension is useful if you're writing end-to-end tests with Sencha Test, as it provides you with 
                a variety of locators for the Component that's associated with a given element, and suggests example
                usage of the captured locators within the Sencha Test Futures API.
            </p>
            
            <p>
                You may also find it useful if you're just wanting to figure out how to reference a Component when 
                writing an Ext JS Component Query.
            </p>

            <p>
                The Component Locator supports Ext JS 4 and above.
            </p>
                
            <h2>Technical Details</h2>
                
            <p>Created by <a href="https://github.com/DanielGallo" target="STComponentLocator">Daniel Gallo</a> using:
                <ul>
                    <li><a href="https://www.sencha.com/products/extjs" target="STComponentLocator">Sencha Ext JS</a> (GPLv3)</li>
                    <li><a href="https://highlightjs.org/" target="STComponentLocator">highlight.js</a></li>
                    <li><a href="https://clipboardjs.com/" target="STComponentLocator">clipboard.js</a></li>
                </ul>
            </p>
            
            <p>
                The source code for the Component Locator extension is available in 
                <a href="https://github.com/DanielGallo/SenchaComponentLocator" target="STComponentLocator">this repository</a>.
            </p>`
});