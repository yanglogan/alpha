function() {

	var formP = {
		width : 1000,
		border : false,
		autoScroll : true,
		itemId : 'creatOrganizationForm',
		descIcon : 'static/images/common/lightbulb.png',
		bodyPadding : 5,
		xtype : 'form',
		layout : 'column',
		defaults : {
			xtype : 'placeholderfield'
		},
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
			name : 'cm:authorityDisplayName'
		}, {
			xtype : 'textfield',
			columnWidth : 1,
			fieldLabel : msg('MSG_TRADING_NAME'),
			allowBlank : false,
			name : 'edm:tradingName'
		}, {
			xtype : 'textfield',
			columnWidth : 1,
			fieldLabel : msg('MSG_ORG_ABBREVIATION'),
			allowBlank : false,
			name : 'edm:orgAbbreviation'
		}, {
			xtype : 'textfield',
			columnWidth : 1,
			fieldLabel : msg('MSG_ORG_REGISTRATION_NO'),
			allowBlank : false,
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
			name : 'edm:postalAddress'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_CITY'),
			itemId : 'pCity',
			allowBlank : false,
			columnWidth : .5,
			name : 'edm:pCity'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_COUNTY'),
			itemId : 'pCounty',
			columnWidth : .5,
			name : 'edm:pCounty'
		}, {
			xtype : 'combo',
			fieldLabel : msg('MSG_COUNTRY'),
			itemId : 'pCountry',
			allowBlank : false,
			columnWidth : .5,
			name : 'edm:pCountry'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_POSTCODE'),
			itemId : 'pPostcode',
			columnWidth : .5,
			maxLength : 10,
			enforceMaxLength : true,
			regex : /^\d{6}?$/,
			regexText : msg('MSG_POSTCODE_FORMAT'),
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
			name : 'edm:deliveryAddress'
		}, {
			xtype : 'checkbox',
			columnWidth : 1,
			fieldLabel : msg('MSG_SAME_AS_ABOVE'),
			checked : false,
			listeners : {
				'change' : function(obj, ischecked) {
					var postalAddress = this.ownerCt.getComponent('postalAddress');
					var pCity = this.ownerCt.getComponent('pCity');
					var pCounty = this.ownerCt.getComponent('pCounty');
					var pCountry = this.ownerCt.getComponent('pCountry');
					var pPostcode = this.ownerCt.getComponent('pPostcode');

					var deliveryAddress = this.ownerCt.getComponent('deliveryAddress');
					var dCity = this.ownerCt.getComponent('dCity');
					var dCounty = this.ownerCt.getComponent('dCounty');
					var dCountry = this.ownerCt.getComponent('dCountry');
					var dPostcode = this.ownerCt.getComponent('dPostcode');
					if(ischecked) {
						deliveryAddress.setValue(postalAddress.getValue());
						dCity.setValue(pCity.getValue());
						dCounty.setValue(pCounty.getValue());
						dCountry.setValue(pCountry.getValue());
						dPostcode.setValue(pPostcode.getValue());
					} else {
						deliveryAddress.setValue('');
						dCity.setValue('');
						dCounty.setValue('');
						dCountry.setValue('');
						dPostcode.setValue('');
					}
				}
			}
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_CITY'),
			itemId : 'dCity',
			allowBlank : false,
			columnWidth : .5,
			name : 'edm:dCity'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_COUNTY'),
			itemId : 'dCounty',
			columnWidth : .5,
			name : 'edm:dCounty'
		}, {
			xtype : 'combo',
			fieldLabel : msg('MSG_COUNTRY'),
			itemId : 'dCountry',
			allowBlank : false,
			columnWidth : .5,
			name : 'edm:dCountry'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_POSTCODE'),
			itemId : 'dPostcode',
			columnWidth : .5,
			maxLength : 10,
			enforceMaxLength : true,
			regex : /^\d{6}?$/,
			regexText : msg('MSG_POSTCODE_FORMAT'),
			name : 'edm:dPostcode'
		}, {
			//TODO SEP
			xtype : 'header',
			columnWidth : 1,
			headerType : 'splitter'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_PHONE'),
			itemId : 'orgPhone',
			allowBlank : false,
			columnWidth : .5,
			regex : /\d{3}-\d{8}|\d{4}-\d{7}/,
			regexText : msg('MSG_PHONE_FORMAT'),
			name : 'edm:orgPhone'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_FAX'),
			itemId : 'orgFax',
			columnWidth : .5,
			name : 'edm:orgFax'
		}, {
			itemId : 'orgWeb',
			columnWidth : 1,
			xtype : 'textfield',
			fieldLabel : msg('MSG_WEBSITE'),
			name : 'edm:orgWebsite'
		}, {
			itemId : 'orgEmail',
			columnWidth : 1,
			xtype : 'textfield',
			fieldLabel : msg('MSG_EMAIL_ADDRESS'),
			allowBlank : false,
			vtype : 'email',
			name : 'edm:orgEmail'
		},

		//USER INFO
		{
			xtype : 'header',
			columnWidth : 1,
			headerType : 'title',
			title : msg('MSG_USER_INFO')
		}, {
			xtype : 'combo',
			columnWidth : .5,
			triggerAction : 'all',
			fieldLabel : msg('MSG_TITLE'),
			allowBlank : false,
			mode : 'local',
			displayField : 'label',
			valueField : 'value',
			value : 'm',
			editable : false,
			store : {
				fields : ['label', 'value'],
				data : [{
					value : 'm',
					label : msg('MSG_MR')
				}, {
					value : 'f',
					label : msg('MSG_MISS')
				}]
			},
			name : 'edm:uTitle'
		}, {
			columnWidth : .5
		}, {
			xtype : 'textfield',
			columnWidth : .5,
			fieldLabel : msg('MSG_USER_FIRSTNAME'),
			allowBlank : false,
			name : 'edm:uFirstName'
		}, {
			columnWidth : .5
		}, {
			xtype : 'textfield',
			columnWidth : .5,
			fieldLabel : msg('MSG_USER_LASTNAME'),
			allowBlank : false,
			name : 'edm:uLastName'
		}, {
			columnWidth : .5
		}, {
			xtype : 'combo',
			columnWidth : .5,
			fieldLabel : msg('MSG_JOB_FUNCTION'),
			allowBlank : false,
			name : 'edm:uJobFunction'
		}, {
			columnWidth : .5
		}, {
			//TODO SEP
			xtype : 'header',
			columnWidth : 1,
			headerType : 'splitter'
		}, {
			xtype : 'textfield',
			columnWidth : .5,
			fieldLabel : msg('MSG_LOGIN_NAME'),
			allowBlank : false,
			name : 'edm:uLoginName'
		}, {
			columnWidth : .5
		}, {
			xtype : 'textfield',
			columnWidth : .5,
			inputType : 'password',
			itemId : 'password',
			fieldLabel : msg('MSG_PASSWORD'),
			allowBlank : false,
			name : 'password'
		}, {
			columnWidth : .5
		}, {
			xtype : 'textfield',
			columnWidth : .5,
			inputType : 'password',
			itemId : 'passwordconfirm',
			fieldLabel : msg('MSG_PASSWORD_CONFIRM'),
			allowBlank : false,
			name : 'passwordconfirm'
		}, {
			columnWidth : .5
		}, {
			xtype : 'textfield',
			columnWidth : 1,
			fieldLabel : msg('MSG_SECURITY_QUESTION'),
			itemId : 'securityquestion',
			allowBlank : false,
			name : 'securityquestion'
		}, {
			xtype : 'textfield',
			columnWidth : 1,
			fieldLabel : msg('MSG_SECURITY_ANSWER'),
			itemId : 'securityanswer',
			allowBlank : false,
			name : 'securityanswer'
		}, {
			//TODO SEP
			xtype : 'header',
			columnWidth : 1,
			headerType : 'splitter'
		}, {
			xtype : 'textfield',
			columnWidth : 1,
			fieldLabel : msg('MSG_USER_ADDRESS'),
			itemId : 'uAddress',
			allowBlank : false,
			name : 'edm:uAddress'
		}, {
			xtype : 'checkbox',
			columnWidth : 1,
			fieldLabel : msg('MSG_SAME_AS_ABOVE'),
			checked : false,
			listeners : {
				'change' : function(obj, ischecked) {
					var postalAddress = this.ownerCt.getComponent('postalAddress');
					var pCity = this.ownerCt.getComponent('pCity');
					var pCounty = this.ownerCt.getComponent('pCounty');
					var pCountry = this.ownerCt.getComponent('pCountry');
					var pPostcode = this.ownerCt.getComponent('pPostcode');

					var uAddress = this.ownerCt.getComponent('uAddress');
					var uCity = this.ownerCt.getComponent('uCity');
					var uCounty = this.ownerCt.getComponent('uCounty');
					var uCountry = this.ownerCt.getComponent('uCountry');
					var uPostcode = this.ownerCt.getComponent('uPostcode');
					if(ischecked) {
						uAddress.setValue(postalAddress.getValue());
						uCity.setValue(pCity.getValue());
						uCounty.setValue(pCounty.getValue());
						uCountry.setValue(pCountry.getValue());
						uPostcode.setValue(pPostcode.getValue());
					} else {
						deliveryAddress.setValue('');
						dCity.setValue('');
						dCounty.setValue('');
						dCountry.setValue('');
						dPostcode.setValue('');
					}
				}
			}
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_CITY'),
			itemId : 'uCity',
			allowBlank : false,
			columnWidth : .5,
			name : 'edm:uCity'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_COUNTY'),
			itemId : 'uCounty',
			columnWidth : .5,
			name : 'edm:uCounty'
		}, {
			xtype : 'combo',
			fieldLabel : msg('MSG_COUNTRY'),
			itemId : 'uCountry',
			allowBlank : false,
			columnWidth : .5,
			name : 'edm:uCountry'
		}, {
			xtype : 'textfield',
			fieldLabel : msg('MSG_POSTCODE'),
			itemId : 'uPostcode',
			columnWidth : .5,
			maxLength : 10,
			regex : /^\d{6}?$/,
			regexText : msg('MSG_POSTCODE_FORMAT'),
			name : 'edm:uPostcode'
		}, {
			//TODO SEP
			xtype : 'header',
			columnWidth : 1,
			headerType : 'splitter'
		}, {
			xtype : 'textfield',
			columnWidth : .5,
			fieldLabel : msg('MSG_PHONE'),
			itemId : 'uPhone',
			allowBlank : false,
			regex : /\d{3}-\d{8}|\d{4}-\d{7}/,
			regexText : msg('MSG_PHONE_FORMAT'),
			name : 'edm:uPhone'
		}, {
			xtype : 'textfield',
			columnWidth : .5,
			fieldLabel : msg('MSG_FAX'),
			itemId : 'uFax',
			name : 'edm:uFax'
		}, {
			xtype : 'checkbox',
			columnWidth : 1,
			fieldLabel : msg('MSG_SAME_AS_ABOVE'),
			checked : false,
			listeners : {
				'change' : function(obj, ischecked) {
					var orgPhone = this.ownerCt.getComponent('orgPhone');
					var orgFax = this.ownerCt.getComponent('orgFax');
					var orgEmail = this.ownerCt.getComponent('orgEmail');

					var uPhone = this.ownerCt.getComponent('uPhone');
					var uFax = this.ownerCt.getComponent('uFax');
					var uEmail = this.ownerCt.getComponent('uEmail');
					if(ischecked) {
						uPhone.setValue(orgPhone.getValue());
						uFax.setValue(orgFax.getValue());
						uEmail.setValue(orgEmail.getValue());
					} else {
						uPhone.setValue('');
						uFax.setValue('');
						uEmail.setValue('');
					}
				}
			}
		}, {
			xtype : 'textfield',
			columnWidth : 1,
			fieldLabel : msg('MSG_EMAIL_ADDRESS'),
			itemId : 'uEmail',
			allowBlank : false,
			vtype : 'email',
			name : 'edm:uEmail'
		}, {
			xtype : 'textfield',
			columnWidth : 1,
			fieldLabel : msg('MSG_MOBILE'),
			itemId : 'uMobile',
			name : 'edm:uMobile'
		}]
	};

	return {
		IVSautoDestroy : true,
		border : false,
		bodyPadding : 5,
		autoScroll : true,
		layout : {
			type : 'vbox',
			align : 'center'
		},
		bodyCls : 'form-body',
		tbar : Ext.create('core.toolbar.NavToolbar', {
			title : msg('MSG_CREATE_ORGANIZATION'),
			items : [{
				text : msg('MSG_APPLY'),
				btnType : 'info',
				actionBtn : true,
				handler : function() {
					var orgDetailForm = this.ownerCt.ownerCt.items.get(0);
					if(orgDetailForm.getComponent('password').getValue() != orgDetailForm.getComponent('passwordconfirm').getValue()) {
						Utils.error(msg('MSG_PASSWORD_CONFIRM_FAIL'));
						return;
					}

					Utils.request_FORM(orgDetailForm.form, Utils.getCDAUrl('ObjectCrud', 'create'), {
						TYPE : 'edm:organization'
					}, function(resp, opts) {
						Utils.error(msg('MSG_CREATE_SUCCESS'));
						IVS.changeView('configuration.organization_create_success');
					});
				}
			}]
		}),
		items : formP
	};

}