Ext.define('core.BaseObject', {
	constructor : function (cfg) {
        Ext.apply(this, cfg);
        
        if (this.init) {
        	this.init();
        }
   },
   init : function() {}
});