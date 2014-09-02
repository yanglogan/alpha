Ext.define("component.configuration.gantt.FilterField", {
    extend          : "Ext.form.TextField",
    width           : 150,
    enableKeyEvents : true,

    margin          : 0,
    border          : 0,
    fieldStyle      : 'border-left:0;border-right:0;border-bottom:0;background:#fff url(static/images/search.png) no-repeat 5px center;padding-left:25px;',
    width           : '100%',

    // The task store instance
    store           : null,

    listeners : {
        keyup      : {
            fn     : function (field, e) {
                var value = field.getValue();
                var regexp = new RegExp(Ext.String.escapeRegex(value), 'i')

                if (value) {
                    this.store.filterTreeBy(function (task) {
                        return regexp.test(task.get('Name'))
                    });
                } else {
                    this.store.clearTreeFilter();
                }
            },
            buffer : 200
        },
        specialkey : {
            fn : function (field, e) {
                if (e.getKey() === e.ESC) {
                    field.reset();

                    this.store.clearTreeFilter();
                }
            }
        }
    }
});
