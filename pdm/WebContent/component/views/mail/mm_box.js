function() {


	var currentProj = getCurrentProject();


	 String.prototype.startWith = function(s){
	  if (s == null || s == "" || this.length == 0 || s.length > this.length)
	   return false;
	  if (this.substr(0, s.length) == s)
	     return true;
	  else
	     return false;
	  return true;
	 };
    Ext.define('mm.searchDateItem', {
        extend : 'Ext.form.FieldContainer',
        columnWidth : 1,
        layout : 'hbox',
        initComponent : function() {
            var me = this;
            this.items = [{
                xtype : 'combo',
                width : '20%',
                displayField : 'name',
                valueField : 'value',
                store : Ext.create('Ext.data.Store', {
                    fields : ['value', 'name'],
                    data : [{
                        "value" : "active",
                        "name" : msg('MSG_DRAFT')
                    }, {
                        "value" : "draft",
                        "name" : msg('MSG_ACTIVE')
                    }]
                })
            }, {
                xtype : 'combo',
                width : '20%',
                displayField : 'name',
                valueField : 'value',
                store : Ext.create('Ext.data.Store', {
                    fields : ['value', 'name'],
                    data : [{
                        "value" : "active",
                        "name" : msg('MSG_DRAFT')
                    }, {
                        "value" : "draft",
                        "name" : msg('MSG_ACTIVE')
                    }]
                })
            }, {
                xtype : 'datefield',
                width : '20%'
            }, {
                xtype : 'datefield',
                width : '20%'
            }, Ext.create('Ext.Img', {
                itemId : 'img',
                padding : '3 3 0 0',
                src : 'static/images/common/delete.png',
                listeners : {
                    render : function() {
                        Ext.fly(this.el).on('click', function(e, t) {
                            me.ownerCt.remove(me);
                        });
                    }
                }

            })];
            this.callParent();
        },
        afterRender : function() {
            this.callParent();
        },
        getValue : function() {
            var data = {
            };
            data.c1 = this.getComponent(0).getValue();
            data.c2 = this.getComponent(1).getValue();
            data.d1 = this.getComponent(2).getValue();
            data.d2 = this.getComponent(3).getValue();
            return data;
        }
    });

    Ext.define('mm.searchDateRanage', {
        extend : 'Ext.form.FieldContainer',
        layout : 'column',
        labelStyle : 'margin-top : 10px',
        fieldLabel : msg('MSG_DATE_RANGE'),
        initComponent : function() {
            var me = this;
            this.items = [{
                columnWidth : 1,
                padding : '0 0 0 0',
                layout : 'column',
                xtype : 'panel',
                items : [{
                    columnWidth : 1,
                    xtype : 'panel',
                    layout : 'column',
                    items : [Ext.create('mm.searchDateItem', {})]
                }]
            }, {
                columnWidth : 1,
                xtype : 'label',
                text : msg('MSG_ADD_ANOTHER_DATE_QUERY'),
                listeners : {
                    render : function() {
                        var me = this;
                        Ext.fly(this.el).on('click', function(e, t) {
                            me.ownerCt.getComponent(0).add(Ext.create("mm.searchDateItem", {
                            }));
                            me.ownerCt.doLayout();
                        });
                    }
                }
            }];
            this.callParent();
        },
        afterRender : function() {
            this.callParent();
        },
        getValue : function() {
            var res = [];
            var cons = this.getComponent(0).query('fieldcontainer');
            Ext.each(cons, function(item) {
                res.push(item.getValue());
            });
            return Ext.encode(res);
        }
    });

    function request_AJAX(url, arguments, successHandler, hideMsgBox) {
        Ext.Ajax.request({
            url : url,
            params : arguments,
            method : 'POST',
            async : false,
            success : function(resp, opts) {
                function filterAjaxError(resp) {
                    var responseText = resp.responseText;

                    try {
                        var json = Ext.decode(responseText);
                    } catch (e) {
                        return true;
                    }
                    if (json.success == false) {
                        var action = Ext.decode('{"result":' + responseText + '}');
                        Utils.handleFormError(action);
                        return false;
                    }

                    return true;
                }

                if (filterAjaxError(resp)) {
                    if (successHandler) {
                        successHandler.apply(successHandler, [resp, opts]);
                    }
                }
            },
            failure : function(resp, opts) {
                Utils.handleFormError({
                    result : Ext.decode(resp.responseText)
                });
            }
        });
    }
    
	Ext.define('searchPanel', {
		extend : 'Ext.form.Panel',
		requires : ['Ext.form.Panel'],
		bodyPadding : '5, 200, 5, 200',
		fieldDefaults : {
			labelAlign : 'left',
			labelWidth : 100,
		},
		defaults : {
			margin : '0 0 5 0',
			bodyStyle : 'background-color:transparent;',
			layout : 'column'
		},

		initComponent : function() {
				this.items = [{
	            items : [{
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_MAIL_NO'),
	                columnWidth : .5,
	                name : 'cm:name'
	            }, {
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_SUBJECT'),
	                columnWidth : .5,
	                name : 'edm:mailSubject'
	            }]
	        }, {
	            items : [{
	                xtype : 'combo',
	                fieldLabel : msg('MSG_MAIL_TYPE'),
	                name : 'edm:mailType',
	                columnWidth : .5
	            }, {
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_CONTENT'),
	                name : 'cm:content',
	                columnWidth : .5
	            }]
	        }, {
	            items : [{
	                xtype : 'combo',
	                fieldLabel : msg('MSG_STATUS'),
	                name : 'edm:mailStatus',
	                columnWidth : .5
	            }, {
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_ATTRIBUTE1'),
	                columnWidth : .5,
	                name : 'edm:attribute1'
	            }]
	        }, {
	            items : [{
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_ATTRIBUTE2'),
	                columnWidth : .5,
	                name : 'edm:attribute2'
	            }, {
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_ATTRIBUTE3'),
	                columnWidth : .5,
	                name : 'edm:attribute3'
	            }]
	        }, {
	            items : [{
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_SENT_TO'),
	                columnWidth : .5,
	                name : 'edm:sentTo'
	            }, {
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_FROM_ORGANIZATION'),
	                columnWidth : .5,
	                name : 'edm:toOrganization'
	            }]
	        }, {
	            items : [{
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_SENT_FROM'),
	                columnWidth : .5,
	                name : 'edm:sentFrom'
	            }, {
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_COMMENT'),
	                columnWidth : .5,
	                name : 'edm:mailComment'
	            }]
	        }, {
	            items : [{
	                xtype : 'textfield',
	                fieldLabel : msg('MSG_REASON_FOR_ISSUE'),
	                columnWidth : .5,
	                name : 'edm:mailReasonForIssue'
	            }]
	        }, {
	            items : Ext.create("mm.searchDateRanage", {
	                columnWidth : 1,
	                name : 'dateRanage'
	            })
	
	        }, {
	            items : [{
	                columnWidth : 1,
	                xtype : 'fieldcontainer',
	                fieldLabel : msg('MSG_SUPER_SEARCH'),
	                layout : 'hbox',
	                items : [{
	                    xtype : 'textfield',
	                    name : 'advSearch',
	                    width : '70%'
	                }, {
	                    xtype : 'displayfield',
	                    value : '<font color="black">' + msg('MSG_SEARCH_TIPS') + '</font>'
	                }]
	            }]
	
	        }];

			this.callParent();
		},
		afterRender : function() {
			this.callParent();
		}
	});
	
    var inboxStore = new Ext.data.Store({
        groupField : 'edm:mail',
        fields : ['sys:node-uuid', 'cm:name', 'edm:mailSubject', 'edm:sentFrom', 'edm:dateReceived', 'edm:fromOrganization', 'edm:sentTo', 'edm:mailStatus', 'edm:mailType'],
        pageSize : 20,
        proxy : {
            type : 'ajax',
            actionMethods : {
                method : 'POST'
            },
            url : Utils.getCDAUrl('Mail', 'searchMail'),
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'total'
            },
            extraParams : {
                
            }
        }
    });
	var draftStore = new Ext.data.Store({
        groupField : 'edm:mail',
        fields : ['sys:node-uuid', 'cm:name', 'edm:mailSubject', 'edm:sentFrom', 'edm:dateReceived', 'edm:fromOrganization', 'edm:sentTo', 'edm:mailStatus', 'edm:mailType'],
        pageSize : 20,
        proxy : {
            type : 'ajax',
            actionMethods : {
                method : 'POST'
            },
            url : Utils.getCDAUrl('Mail', 'searchMail'),
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'total'
            },
            extraParams : {
                
            }
        }
    });
    var sentStore = new Ext.data.Store({
        groupField : 'edm:mail',
        fields : ['sys:node-uuid', 'cm:name', 'edm:mailSubject', 'edm:sentFrom', 'edm:dateReceived', 'edm:fromOrganization', 'edm:sentTo', 'edm:mailStatus', 'edm:mailType'],
        pageSize : 20,
        proxy : {
            type : 'ajax',
            actionMethods : {
                method : 'POST'
            },
            url : Utils.getCDAUrl('Mail', 'searchMail'),
            reader : {
                type : 'json',
                root : 'results',
                totalProperty : 'total'
            },
            extraParams : {
                
            }
        }
    });

    function getSearchStr(tab) {
		var values = Ext.getCmp(tab).form.getFieldValues();
		var condition = '';
		switch (tab) {
			case 'inboxTab' :  
				condition = "NOT @edm\\:mailStatus:\"" + "Draft\" AND " + "@edm\\:sentTo:\"" + "*" + userLoginId + "*\"";
				break;
			case 'draftboxTab' : 
				condition = "@edm\\:mailStatus:\"" + "Draft\" AND " + "@edm\\:sentFrom:\"" + "" + userLoginId + "\"";
				break;
			case 'sentboxTab' : 
				condition = "@edm\\:sentFrom:\"" + "" + userLoginId + "\" AND " + "NOT @edm\\:mailStatus:\"" + "Draft\"";
				break;
		}
	    for (var key in values) {
	        if (!values[key] || !(key.startWith('cm:') || key.startWith('edm:'))) {
	            continue;
	        }
	
	        if (condition.trim() != '') {
	            condition += ' and ';
	        }
	        condition += '@' + key.replace(':', '\\:') + ':\"*' + values[key] + '*\"';
	    }
	    return condition;
    }
    Ext.define('mm.toolsbtn', {
        extend : 'Ext.Button',
        text : msg('MSG_TOOLS'),
		btnType : 'info',
		scale : 'small',
        initComponent : function() {
            var me = this;
            this.menu = {
    			items : [{
    				text : msg('MSG_TOOLS1'),
    				handler : function() {
    					//TODO
    				}
    			}, {
    				text : msg('MSG_TOOLS2'),
    				handler : function() {
    					//TODO
    				}
    			}]
    		};
            this.callParent();
        },
        afterRender : function() {
            this.callParent();
        }
    });
    Ext.define('mm.reportsbtn', {
        extend : 'Ext.Button',
        text : msg('MSG_REPORTS'),
		btnType : 'info',
		scale : 'small',
        initComponent : function() {
            var me = this;
            this.menu = {
    			items : [{
    				text : msg('MSG_REPORTS1'),
    				handler : function() {
    					//TODO
    				}
    			}, {
    				text : msg('MSG_REPORTS2'),
    				handler : function() {
    					//TODO
    				}
    			}]
    		};
            this.callParent();
        },
        afterRender : function() {
            this.callParent();
        }
    });

    var inboxResultGrid = Ext.create('Ext.grid.Panel', {
        selType : 'checkboxmodel',
        store : inboxStore,
        region : 'center',
        tbar : {
            items : [Ext.create('Ext.Img', {
                width : 16,
                height : 16,
                itemId : 'img',
                src : 'static/images/up.png',
                listeners : {
                    render : function() {
                        var me = this;
                        Ext.fly(this.el).on('click', function(e, t) {
                            var a = me.el.getAttribute('src');
                            if (a == 'static/images/up.png') {
                                me.setSrc('static/images/down.png');
                                Ext.getCmp('searchPanel').hide();
                            } else {
                                me.setSrc('static/images/up.png');
                                Ext.getCmp('searchPanel').show();
                            }
                        });
                    }
                }

            }), Ext.create('mm.toolsbtn', {}), Ext.create('mm.reportsbtn', {}), '->', {
                text : msg('MSG_CLEAR'),
                handler : function() {
					inboxStore.removeAll();
					Ext.getCmp('inboxTab').getForm().reset();
					Ext.getCmp('inboxTab').show();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc('static/images/up.png');
					
				}
            }, {
                text : msg('MSG_SEARCH'),
                handler : function() {
                	
                	var param = Ext.getCmp('inboxTab').getValues();
                    var condition = getSearchStr('inboxTab');
                    //param.dateRange = Ext.getCmp('dateRanage').getValue();
                    param.condition = condition;
                    inboxStore.load({
                        params : param
                    });
                    this.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc('static/images/down.png');
                }
            }]
        },
        columns : [{
            dataIndex : 'sys:node-uuid',
            hidden : true
        }, {
            text : msg('MSG_MAIL_NO'),
            dataIndex : 'cm:name',
            width : '18%'
        }, {
            text : msg('MSG_SUBJECT'),
            dataIndex : 'edm:mailSubject',
            width : '15%'
        }, {
            text : msg('MSG_SENT_FROM'),
            dataIndex : 'edm:sentFrom',
            width : '10%'
        }, {
            text : msg('MSG_RECEIVE_DATE'),
            dataIndex : 'edm:dateReceived',
            width : '15%',
			renderer : function(value) {
                if (value) {
                    value = Utils.parseDateStr(value, 'Y-m-d H:i:s');
                }
                return Utils.getValueWithToolTip(value);
            }
        }, {
            text : msg('MSG_FROM_ORG'),
            dataIndex : 'edm:fromOrganization',
            width : '10%'
        }, {
            text : msg('MSG_SNET_TO'),
            dataIndex : 'edm:sentTo',
            width : '10%'
        }, {
            text : msg('MSG_MAIL_STATUS'),
            dataIndex : 'edm:mailStatus',
            width : '10%'
        }, {
            text : msg('MSG_MAIL_TYPE'),
            dataIndex : 'edm:mailType',
            width : '10%'
        }, {
            text : msg('MSG_ACTIONS'),
            menuDisabled : true,
            sortable : false,
            width : '5%',
            xtype : 'actioncolumn',
            menuText : msg('MSG_ACTIONS'),
            items : [{
                icon : 'static/images/look-for-history.png',
                tooltip : '',
                handler : function(grid, rowIndex, colIndex) {
                }
            }]
        }]

    });

    var draftResultGrid = Ext.create('Ext.grid.Panel', {
        selType : 'checkboxmodel',
        store : draftStore,
        region : 'center',
        tbar : {
            items : [Ext.create('Ext.Img', {
                width : 16,
                height : 16,
                itemId : 'img',
                src : 'static/images/up.png',
                listeners : {
                    render : function() {
                        var me = this;
                        Ext.fly(this.el).on('click', function(e, t) {
                            var a = me.el.getAttribute('src');
                            if (a == 'static/images/up.png') {
                                me.setSrc('static/images/down.png');
                                Ext.getCmp('searchPanel').hide();
                            } else {
                                me.setSrc('static/images/up.png');
                                Ext.getCmp('searchPanel').show();
                            }
                        });
                    }
                }

            }), Ext.create('mm.toolsbtn', {}), Ext.create('mm.reportsbtn', {}), '->', {
                text : msg('MSG_CLEAR'),
                handler : function() {
					draftStore.removeAll();
					Ext.getCmp('draftboxTab').getForm().reset();
					Ext.getCmp('draftboxTab').show();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc('static/images/up.png');
					
				}
            }, {
                text : msg('MSG_SEARCH'),
                handler : function() {
                	
                	var param = Ext.getCmp('draftboxTab').getValues();
                    var condition = getSearchStr('draftboxTab');
                    //param.dateRange = Ext.getCmp('dateRanage').getValue();
                    param.condition = condition;
                    draftStore.load({
                        params : param
                    });
                    this.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc('static/images/down.png');
                }
            }]
        },
        columns : [{
            dataIndex : 'sys:node-uuid',
            hidden : true
        }, {
            text : msg('MSG_MAIL_NO'),
            dataIndex : 'cm:name',
            width : '18%'
        }, {
            text : msg('MSG_SUBJECT'),
            dataIndex : 'edm:mailSubject',
            width : '15%'
        }, {
            text : msg('MSG_SENT_FROM'),
            dataIndex : 'edm:sentFrom',
            width : '10%'
        }, {
            text : msg('MSG_RECEIVE_DATE'),
            dataIndex : 'edm:dateReceived',
            width : '15%',
			renderer : function(value) {
                if (value) {
                    value = Utils.parseDateStr(value, 'Y-m-d H:i:s');
                }
                return Utils.getValueWithToolTip(value);
            }
        }, {
            text : msg('MSG_FROM_ORG'),
            dataIndex : 'edm:fromOrganization',
            width : '10%'
        }, {
            text : msg('MSG_SNET_TO'),
            dataIndex : 'edm:sentTo',
            width : '10%'
        }, {
            text : msg('MSG_MAIL_STATUS'),
            dataIndex : 'edm:mailStatus',
            width : '10%'
        }, {
            text : msg('MSG_MAIL_TYPE'),
            dataIndex : 'edm:mailType',
            width : '10%'
        }, {
            text : msg('MSG_ACTIONS'),
            menuDisabled : true,
            sortable : false,
            width : '5%',
            xtype : 'actioncolumn',
            menuText : msg('MSG_ACTIONS'),
            items : [{
                icon : 'static/images/look-for-history.png',
                tooltip : '',
                handler : function(grid, rowIndex, colIndex) {
                }
            }]
        }]

    });
    var sentResultGrid = Ext.create('Ext.grid.Panel', {
        selType : 'checkboxmodel',
        store : sentStore,
        region : 'center',
        tbar : {
            items : [Ext.create('Ext.Img', {
                width : 16,
                height : 16,
                itemId : 'img',
                src : 'static/images/up.png',
                listeners : {
                    render : function() {
                        var me = this;
                        Ext.fly(this.el).on('click', function(e, t) {
                            var a = me.el.getAttribute('src');
                            if (a == 'static/images/up.png') {
                                me.setSrc('static/images/down.png');
                                Ext.getCmp('searchPanel').hide();
                            } else {
                                me.setSrc('static/images/up.png');
                                Ext.getCmp('searchPanel').show();
                            }
                        });
                    }
                }

            }), Ext.create('mm.toolsbtn', {}), Ext.create('mm.reportsbtn', {}), '->', {
                text : msg('MSG_CLEAR'),
                handler : function() {
					sentStore.removeAll();
					Ext.getCmp('sentboxTab').getForm().reset();
					Ext.getCmp('sentboxTab').show();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/up.png");
					
				}
            }, {
                text : msg('MSG_SEARCH'),
                handler : function() {
                	
                	var param = Ext.getCmp('sentboxTab').getValues();
                    var condition = getSearchStr('sentboxTab');
                    //param.dateRange = Ext.getCmp('dateRanage').getValue();
                    param.condition = condition;
                    sentStore.load({
                        params : param
                    });
                    this.ownerCt.ownerCt.ownerCt.getComponent(0).hide();
					this.ownerCt.ownerCt.getDockedComponent(1).getComponent(0).setSrc("static/images/down.png");
                }
            }]
        },
        columns : [{
            dataIndex : 'sys:node-uuid',
            hidden : true
        }, {
            text : msg('MSG_MAIL_NO'),
            dataIndex : 'cm:name',
            width : '18%'
        }, {
            text : msg('MSG_SUBJECT'),
            dataIndex : 'edm:mailSubject',
            width : '15%'
        }, {
            text : msg('MSG_SENT_FROM'),
            dataIndex : 'edm:sentFrom',
            width : '10%'
        }, {
            text : msg('MSG_RECEIVE_DATE'),
            dataIndex : 'edm:dateReceived',
            width : '15%',
			renderer : function(value) {
                if (value) {
                    value = Utils.parseDateStr(value, 'Y-m-d H:i:s');
                }
                return Utils.getValueWithToolTip(value);
            }
        }, {
            text : msg('MSG_FROM_ORG'),
            dataIndex : 'edm:fromOrganization',
            width : '10%'
        }, {
            text : msg('MSG_SNET_TO'),
            dataIndex : 'edm:sentTo',
            width : '10%'
        }, {
            text : msg('MSG_MAIL_STATUS'),
            dataIndex : 'edm:mailStatus',
            width : '10%'
        }, {
            text : msg('MSG_MAIL_TYPE'),
            dataIndex : 'edm:mailType',
            width : '10%'
        }, {
            text : msg('MSG_ACTIONS'),
            menuDisabled : true,
            sortable : false,
            width : '5%',
            xtype : 'actioncolumn',
            menuText : msg('MSG_ACTIONS'),
            items : [{
                icon : 'static/images/look-for-history.png',
                tooltip : '',
                handler : function(grid, rowIndex, colIndex) {
                }
            }]
        }]

    });
	var inboxTab = Ext.create('Ext.panel.Panel', {
		title : msg('MSG_INBOX'),
		autoScroll : true,
		layout : 'border',
		items : [Ext.create('searchPanel', {
			id : 'inboxTab',
			height : 250,
			autoScroll : true,
			region : 'north'
		}), inboxResultGrid, {
			region : 'south',
			bbar : {
				cls : 'border-top',
				xtype : 'pagingtoolbar',
				displayInfo : true,
				store : inboxStore
			}
		}]
	});
	var draftTab = Ext.create('Ext.panel.Panel', {
		title : msg('MSG_DRAFTBOX'),
		autoScroll : true,
		layout : 'border',
		items : [Ext.create('searchPanel', {
			id : 'draftboxTab',
			height : 250,
			autoScroll : true,
			region : 'north'
		}), draftResultGrid, {
			region : 'south',
			bbar : {
				cls : 'border-top',
				xtype : 'pagingtoolbar',
				displayInfo : true,
				store : draftStore
			}
		}]
	});
	var sentTab = Ext.create('Ext.panel.Panel', {
		title : msg('MSG_SENTBOX'),
		autoScroll : true,
		layout : 'border',
		items : [Ext.create('searchPanel', {
			id : 'sentboxTab',
			height : 250,
			autoScroll : true,
			region : 'north'
		}), sentResultGrid, {
			region : 'south',
			bbar : {
				cls : 'border-top',
				xtype : 'pagingtoolbar',
				displayInfo : true,
				store : sentStore
			}
		}]
	});
	var searchTab = Ext.create('Ext.tab.Panel', {
		width : '100%',
		plain : true,
		items : [inboxTab, sentTab, draftTab]
	});
	
    var mailSearchPanel = Ext.create('Ext.panel.Panel', {
        IVSautoDestroy : true,
        border : false,
        bodyPadding : '5 0 0 0',
        layout : 'fit',
        tbar : {
            cls : 'toolbar-shadow',
            items : [{
                xtype : 'label',
                text : msg('MSG_PANELTITLE')
            }, '->', {
                btnType : 'info',
                scale : 'medium',
                text : msg('MSG_SAVE_SEARCH_AS'),
                handler : function() {
                }
            }, {
                xtype : 'combo',
                emptyText : msg('MSG_SAVE_SEARCH_SELECT_EMPTY')
            }]
        },
        items : {
            layout : 'fit',
            items : [searchTab]
        }
    });
	
		
    return mailSearchPanel;

}
