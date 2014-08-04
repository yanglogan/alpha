Ext.define('core.buttons.UploadButton', {
	extend : 'Ext.button.Button',
	getFiles : function() {
		return this.uploader.files;
	},
	start : function() {
		this.uploader.start();
	},
	stop : function() {
		this.uploader.stop();
	},
	setUploadUrl : function(url) {
		this.uploader.settings.url = url;
	},
	onInited : function() {
		this.log('uploadbtn inited');
	},
	onFilesAdded : function(files) {
		this.log('files added:', files);
	},
	onUploadProgress : function(file) {
		this.log('in progress:', file.name + '--', file.percent + '%');
	},
	onFileUploaded : function(file) {
		this.log('file uploaded:', file);
	},
	beforeFileUpload : function(file) {
		this.log('before upload:', file);
	},
	onUploadComplete : function() {
		this.log('upload completed.');
	},
	onError : function(err) {
		this.log('file upload error', err);
	},
	setExtraParams : function(args) {
		if (!args) return;
		this.uploader.settings.multipart_params = args;
	},
	getDropElement : function() {return null;},
	multiSelection : false,
	uploadUrl : '#',
	chunkSize : '2mb',
	maxFileSize : '100mb',
	mimeType : [{
		title : "Image files",
		extensions : "jpg,gif,png"
	}, {
		title : "Zip files",
		extensions : "zip"
	}],
	removeFile : function(file) {
		this.uploader.removeFile(file);
	},
	//private
	log : function() {
		if( typeof console != 'undefined') {
			console.log(arguments);
		}
	},
	clear : function() {
		var me = this;
		Ext.each(Ext.apply([], this.uploader.files), function(file) {
			me.removeFile(file);
		});
	},
	afterRender : function() {
		var me = this;
		
		if (!this.multiSelection) {
			this.on('click', function() {
				this.clear();
			});
		}

		this.on('enable', function() {
			this.uploader.disableBrowse(false);
		});
		this.on('disable', function() {
			this.uploader.disableBrowse(true);
		});

		this.uploader = new plupload.Uploader({
			drop_element : this.getDropElement(),
			multi_selection : this.multiSelection,
			runtimes : 'html5,flash,silverlight,html4',
			browse_button : this.el.id, // you can pass in id...
			container: this.el.parent().dom, // ... or DOM Element itself
			url : me.uploadUrl,
			flash_swf_url : base + 'static/ext/plupload/Moxie.swf',
			silverlight_xap_url : base + 'static/ext/plupload/Moxie.xap',
			multipart_params : {},
			unique_names : true,
			chunk_size : me.chunkSize,

			filters : {
				max_file_size : me.maxFileSize,
				mime_types : me.mimeTypes
			},

			init : {
				PostInit : function() {
					me.onInited();
				},
				FilesAdded : function(up, files) {
					me.onFilesAdded(files);
				},
				UploadProgress : function(up, file) {
					me.onUploadProgress(file);
				},
				Error : function(up, err) {
					me.onError(err);
				},
				FileUploaded : function(up, file) {
					me.onFileUploaded(file);
				},
				BeforeUpload : function(up, file) {
					me.beforeFileUpload(file);
				},
				UploadComplete : function(up, files) {
					me.clear();
					me.onUploadComplete();
				}
			}
		});

		this.uploader.disableBrowse(this.disabled);
		this.uploader.init();
		this.callParent();
	}
});
