Ext.define('component.document.fileexplorer.ActionProvider', {
    extend : 'FileExplorer.ActionProvider',
    extraPreconditions : {},
    //private
    init : function() {
        Ext.applyIf(this.preconditions, this.extraPreconditions);
        this.callParent();
    },
    preconditions : {
        //USAGE:check current user's permission on this object.
        //<preconditions>
        //	<precondition ref='permit'>
        //		<permit>Read</permit>
        //	</precondition>
        //</preconditions>
        permit : function(rec, config) {
            return rec.raw.PERMISSIONS.indexOf(config.text()) != -1;
        },
        //USAGE:check if all aspects are attached to this object.
        //<precondition ref='aspect'>
        //	<aspect>cm:titled,cm:</aspect>
        //</precondition>
        aspectAllMatch : function(rec, config) {
            var arr = config.text().split(',');
            for (var i = 0; i < arr.length; i++) {
                if (Ext.isEmpty(arr[i])) continue;
                if (rec.raw.ASPECTS.indexOf(arr[i]) == -1) return false;
            }
            return true;
        },
        //USAGE:check if any aspect is attached to this object.
        //<precondition ref='aspectAnyMatch'>
        //	<aspect>cm:titled,cm:</aspect>
        //</precondition>
        aspectAnyMatch : function(rec, config) {
            var arr = config.text().split(',');
            for (var i = 0; i < arr.length; i++) {
                if (Ext.isEmpty(arr[i])) continue;
                if (rec.raw.ASPECTS.indexOf(arr[i]) != -1) return true;
            }
            return false;
        },
        //USAGE:make sure that this object has not contains any of these aspects.
        //<precondition ref='aspectNotContain'>
        //  <aspect>cm:titled,cm:</aspect>
        //</precondition>
        aspectNotContain : function(rec, config) {
            var arr = config.text().split(',');
            for (var i = 0; i < arr.length; i++) {
                if (Ext.isEmpty(arr[i])) continue;
                if (rec.raw.ASPECTS.indexOf(arr[i]) != -1) return false;
            }
            return true;
        },
        //USAGE:check if all properties are matched.
        //<precondition ref='propertyAllMatch'>
        //	<property>edm:state</property>
        //	<value>Filed</value>
        //	<property>edm:state</property>
        //	<value>Filed</value>
        //	//etc.
        //</precondition>
        propertyAllMatch : function(rec, config) {
            var propEle = config.filter('property');
            var valueEle = config.filter('value');

            if (propEle.length != valueEle.length) return false;

            for (var i = 0; i < propEle.length; i++) {
                var prop = $(propEle.get(i)).text();

                var value = rec.raw[prop];
                if (value == null || value != $(valueEle.get(i)).text()) return false;
            }

            return true;
        },
        //USAGE:check if any property is matched.
        //<precondition ref='propertyAnyMatch'>
        //	<property>edm:state</property>
        //	<value>Filed</value>
        //	<property>edm:state</property>
        //	<value>Filed</value>
        //	//etc.
        //</precondition>
        propertyAnyMatch : function(rec, config) {
            var propEle = config.filter('property');
            var valueEle = config.filter('value');

            if (propEle.length != valueEle.length) return false;

            for (var i = 0; i < propEle.length; i++) {
                var prop = $(propEle.get(i)).text();

                var value = rec.raw[prop];
                if (value != null && value == $(valueEle.get(i)).text()) return true;
            }

            return false;
        },
        //USAGE:check if this object is not checked out.
        //<precondition ref='notcheckedout' />
        notcheckedout : function(rec, config) {
            return rec.raw['cm:lockOwner'] == null;
        },
        //USAGE:check if this object is checked out.
        //<precondition ref='checkedout' />
        checkedout : function(rec, config) {
            return rec.raw['cm:lockOwner'] != null;
        },
        //USAGE:check if this object is checked out&current user can check it in.
        //<precondition ref='checkinable' />
        checkinable : function(rec, config) {
            return rec.raw['cm:lockOwner'] == userLoginId;
        },
        unfreezeable : function(rec, config) {
            return rec.raw['edm:frozenBy'] == userLoginId;
        },
        hascontent : function(rec, config) {
            return rec.raw['cm:content'] != null;
        }
    }
});
