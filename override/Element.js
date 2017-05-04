Ext.define('ExtOverride.dom.Element', {
    override: 'Ext.dom.Element',

    inheritableStatics: {
        getViewportScale: function () {
            var top = window;

            return ((Ext.isiOS || Ext.isAndroid) ? 1 :
                    (top.devicePixelRatio || // modern browsers
                    top.screen.deviceXDPI / top.screen.logicalXDPI)) // IE10m
                * this.getViewportTouchScale();
        },

        getViewportTouchScale: function (forceRead) {
            var scale = 1,
                hidden = 'hidden',
                top = window,
                cachedScale;

            if (!forceRead) {
                cachedScale = this._viewportTouchScale;

                if (cachedScale) {
                    return cachedScale;
                }
            }

            if (Ext.isIE10p || Ext.isEdge || Ext.isiOS) {
                scale = docEl.offsetWidth / WIN.innerWidth;
            } else if (Ext.isChromeMobile) {
                scale = top.outerWidth / top.innerWidth;
            }

            return scale;
        }
    }
});