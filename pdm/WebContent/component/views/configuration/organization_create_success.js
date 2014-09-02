function() {
    
    return {
        IVSautoDestroy : true,
        border : false,
        tbar : ['<span class="toolbar-label" >'  + '</span>', '->', {
            btnType : 'success',
            scale : 'medium',
            text : msg('MSG_RETURN'),
            handler : function() {
            	IVS.changeView('');
            }
        }],
        autoScroll : true,
        descIcon : 'static/images/common/lightbulb.png',
        bodyPadding : '5, 200, 5, 200',
        xtype : 'form',
        items : [{
                xtype : 'header',
                headerType : 'title',
                title : msg('MSG_REGISTRATION_SUCCESS')
            }, {
                xtype : 'header',
                headerType : 'title',
                title : msg('MSG_INFO_APPLIED')
            }]
    };
    
}