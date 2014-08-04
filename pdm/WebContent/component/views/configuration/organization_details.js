function() {
    var fp = new Ext.form.Panel();
    Utils.request_FORM(fp.form, Utils.getCDAUrl('ObjectCrud', 'retrieve'), {
            TYPE : 'edm:organization'
        }, function(form, action) {
            var json = action.result.msg;
            init(json);
            fp.destroy();
     }, function(form, action){
         Utils.error('', action.result.msg);
         Utils.pageBack();
         fp.destroy();
     });
     var orgdetialpanel = Ext.create('Ext.panel.Panel', {
         IVSautoDestroy : true
     });
     return orgdetialpanel;
     
    function init(json){
        var attributes = json['_OBJECT_'];
        orgdetialpanel.add({
            border : false,
            tbar : {
            style : 'background-color:#F3F3F3;border-bottom:1px #C0C0C0 solid!important;',
            items : [{
                    xtype : 'label',
                    text :  msg('MSG_ORGANIZATION_DETAILS'),
                    scale : 'medium'
                }, '->', {
                    btnType : 'success',
                    scale : 'medium',
                    text : msg('MSG_ADD_USER'),
                    handler : function() {
                        Utils.openLocator('attributelocator', {
                            callback : function(locator, recs) {
                                if (recs.length == 0) {
                                    return false;
                                }
                            }
                        });
                    }
                }, {
                    btnType : 'success',
                    scale : 'medium',
                    text : msg('MSG_ASSIGN_USER'),
                    handler : function() {}
                }, {
                    btnType : 'success',
                    scale : 'medium',
                    text : Utils.msg('MSG_SAVE'),
                    handler : function() {
                        var orgDetailForm = this.ownerCt.ownerCt;
                        Utils.request_FORM(orgDetailForm.form, Utils.getCDAUrl('ObjectCrud', 'update'), {
                                TYPE : 'edm:organization',
                                objectId : attributes['sys:node-uuid']
                            }, function(resp, opts) {
                                Utils.success(msg('MSG_UPDATE_SUCCESS'));
                            });
                    }
                }]  
            },
            autoScroll : true,
            itemId : 'OrganizationDetailForm',
            descIcon : 'static/images/common/lightbulb.png',
            bodyPadding : '5, 200, 5, 200',
            xtype : 'form',
            layout : 'column',
            items : [{
                xtype : 'header',
                columnWidth : 1,
                headerType : 'title',
                title : msg('MSG_ORG_INFO')
            }, {
                xtype : 'textfield',
                columnWidth : 1,
                fieldLabel : msg('MSG_ORG_NAME'),
                allowBlank : false,
                anchor : '50%',
                value : attributes ? attributes['cm:authorityDisplayName'] : '',
                name : 'cm:authorityDisplayName'
            }, {
                xtype : 'textfield',
                columnWidth : 1,
                fieldLabel : msg('MSG_TRADING_NAME'),
                allowBlank : false,
                anchor : '50%',
                value : attributes ? attributes['edm:tradingName'] : '',
                name : 'edm:tradingName'
            }, {
                xtype : 'textfield',
                columnWidth : 1,
                fieldLabel : msg('MSG_ORG_ABBREVIATION'),
                allowBlank : false,
                anchor : '50%',
                value : attributes ? attributes['edm:orgAbbreviation'] : '',
                name : 'edm:orgAbbreviation'
            }, {
                xtype : 'textfield',
                columnWidth : 1,
                fieldLabel : msg('MSG_ORG_REGISTRATION_NO'),
                allowBlank : false,
                anchor : '50%',
                value : attributes ? attributes['edm:orgRegistrationNo'] : '',
                name : 'edm:orgRegistrationNo'
            }, {
                //TODO SEP
                xtype : 'header',
                columnWidth : 1,
                headerType : 'splitter'
            }, {
                xtype : 'textfield',
                columnWidth : 1,
                fieldLabel : msg('MSG_POSTAL_ADDRESS'),
                itemId : 'postalAddress',
                allowBlank : false,
                anchor : '50%',
                value : attributes ? attributes['edm:postalAddress'] : '',
                name : 'edm:postalAddress'
            }, {
                xtype : 'textfield',
                fieldLabel : msg('MSG_CITY'),
                itemId : 'pCity',
                allowBlank : false,
                columnWidth : .5,
                value : attributes ? attributes['edm:pCity'] : '',
                name : 'edm:pCity'
            }, {
                xtype : 'textfield',
                fieldLabel : msg('MSG_COUNTY'),
                itemId : 'pCounty',
                labelStyle : 'margin-left:10px',
                columnWidth : .5,
                value : attributes ? attributes['edm:pCounty'] : '',
                name : 'edm:pCounty'
            }, {
                xtype : 'combo',
                fieldLabel : msg('MSG_COUNTRY'),
                itemId : 'pCountry',
                allowBlank : false,
                columnWidth : .5,
                value : attributes ? attributes['edm:pCountry'] : '',
                name : 'edm:pCountry'
            }, {
                xtype : 'textfield',
                fieldLabel : msg('MSG_POSTCODE'),
                itemId : 'pPostcode',
                labelStyle : 'margin-left:10px',
                columnWidth : .5,
                value : attributes ? attributes['edm:pPostcode'] : '',
                name : 'edm:pPostcode'
            }, {
                //TODO SEP
                xtype : 'header',
                columnWidth : 1,
                headerType : 'splitter'
            }, {
                xtype : 'textfield',
                columnWidth : 1,
                fieldLabel : msg('MSG_DELIVERY_ADDRESS'),
                itemId : 'deliveryAddress',
                allowBlank : false,
                anchor : '50%',
                value : attributes ? attributes['edm:deliveryAddress'] : '',
                name : 'edm:deliveryAddress'
            }, {
                xtype : 'textfield',
                fieldLabel : msg('MSG_CITY'),
                itemId : 'dCity',
                allowBlank : false,
                columnWidth : .5,
                value : attributes ? attributes['edm:dCity'] : '',
                name : 'edm:dCity'
            }, {
                xtype : 'textfield',
                fieldLabel : msg('MSG_COUNTY'),
                itemId : 'dCounty',
                labelStyle : 'margin-left:10px',
                columnWidth : .5,
                value : attributes ? attributes['edm:dCounty'] : '',
                name : 'edm:dCounty'
            }, {
                xtype : 'combo',
                fieldLabel : msg('MSG_COUNTRY'),
                itemId : 'dCountry',
                allowBlank : false,
                columnWidth : .5,
                value : attributes ? attributes['edm:dCountry'] : '',
                name : 'edm:dCountry'
            }, {
                xtype : 'textfield',
                fieldLabel : msg('MSG_POSTCODE'),
                itemId : 'dPostcode',
                labelStyle : 'margin-left:10px',
                columnWidth : .5,
                value : attributes ? attributes['edm:dPostcode'] : '',
                name : 'edm:dPostcode'
            }, {
                //TODO SEP
                xtype : 'header',
                headerType : 'splitter'
            }, {
                xtype : 'textfield',
                fieldLabel : msg('MSG_PHONE'),
                itemId : 'orgPhone',
                allowBlank : false,
                columnWidth : .5,
                value : attributes ? attributes['edm:orgPhone'] : '',
                name : 'edm:orgPhone'
            }, {
                xtype : 'textfield',
                fieldLabel : msg('MSG_FAX'),
                itemId : 'orgFax',
                labelStyle : 'margin-left:10px',
                columnWidth : .5,
                value : attributes ? attributes['edm:orgFax'] : '',
                name : 'edm:orgFax'
            }, {
                itemId : 'orgWeb',
                columnWidth : 1,
                xtype : 'textfield',
                fieldLabel : msg('MSG_WEBSITE'),
                anchor : '50%',
                value : attributes ? attributes['edm:orgWebsite'] : '',
                name : 'edm:orgWebsite'
            }, {
                itemId : 'orgEmail',
                columnWidth : 1,
                xtype : 'textfield',
                fieldLabel : msg('MSG_EMAIL_ADDRESS'),
                allowBlank : false,
                anchor : '50%',
                vtype: 'email',
                value : attributes ? attributes['edm:orgEmail'] : '',
                name : 'edm:orgEmail'
            }]
        });
    }
    
    
}