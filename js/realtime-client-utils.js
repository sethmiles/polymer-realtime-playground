
Utils = function (options) {
  this.init(options);
}

Utils.prototype = {

  options: {
    /**
     * Client ID from the console.
     */
    clientId: null,

    /**
     * Function to be called when a Realtime model is first created.
     */
    initializeModel: function (model) {
      this.model = model;
    },

    /**
     * Autocreate files right after auth automatically.
     */
    autoCreate: false,

    /**
     * The name of newly created Drive files.
     */
    defaultTitle: "New Realtime File",

    /**
     * The MIME type of newly created Drive Files.
     */
    newFileMimeType: 'application/vnd.google-apps.drive-sdk',

    /**
     * Function to be called every time a Realtime file is loaded.
     */
    onFileLoaded: function (doc) {
      this.doc = doc;
    },

    onAuthComplete: function () {
      console.log('Authentication Completed');
    },

    /**
     * Function to be called to inityalize custom Collaborative Objects types.
     */
    registerTypes: null, // No action.

    /**
     * Function to be called after authorization and before loading files.
     */
    afterAuth: null // No action.
  },

  scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly',
          'https://www.googleapis.com/auth/drive.install',
          'https://www.googleapis.com/auth/drive.file'],

  openId: 'openid',

  init: function (options) {
    this.mergeOptions(options);
    this.authorizer = new Authorizer(this);
    this.createRealtimeFile = this.bind(this.createRealtimeFile, this);
    this.getParams();
  },

  authorize: function () {
    this.authorizer.start();
  },

  mergeOptions: function (options) {
    for(option in options){
      this.options[option] = options[option];
    }
  },

  // Check the url to see if we have a document id
  getParams: function() {
    var params = {};
    var hashFragment = window.location.hash;
    if(hashFragment){
      this.documentId = hashFragment.replace('#','');
    } else {
      this.documentId = false;
    }
  },

  createRealtimeFile: function(title, callback) {
    var that = this;
    window.gapi.client.load('drive', 'v2', function() {
      window.gapi.client.drive.files.insert({
        'resource': {
          mimeType: that.options.newFileMimeType,
          title: title
        }
      }).execute(callback);
    });
  },

  load: function() {
    window.gapi.drive.realtime.load(this.documentId, this.options.onFileLoaded, this.options.initializeModel, this.onError);
  },

  onAuthComplete: function (authResult) {
    if(this.documentId){
      this.load();
    }
  },

  onError: function(e) {
    if(e.type == window.gapi.drive.realtime.ErrorType.TOKEN_REFRESH_REQUIRED) {
      authorizer.authorize();
    } else if(e.type == window.gapi.drive.realtime.ErrorType.CLIENT_ERROR) {
      alert("An Error happened: " + e.message);
      window.location.href= "/";
    } else if(e.type == window.gapi.drive.realtime.ErrorType.NOT_FOUND) {
      alert("The file was not found. It does not exist or you do not have read access to the file.");
      window.location.href= "/";
    }
  },

  bind: function (fn, context) {
    return function () {
      fn.apply(context, arguments);
    }
  }
  
}




Authorizer = function (util) {
  this.util = util;
  this.handleAuthResult = this.util.bind(this.handleAuthResult, this);
  this.token = null;
}

Authorizer.prototype = {
  start: function() {
    var that = this;
    window.gapi.load('auth:client,drive-realtime,drive-share', function() {
      that.authorize(false);
    });
  },

  authorize: function (usePopup) {
    // Try with no popups first.
    window.gapi.auth.authorize({
      client_id: this.util.options.clientId,
      scope: this.util.scopes,
      user_id: this.util.options.userId,
      immediate: !usePopup
    }, this.handleAuthResult);
  },

  handleAuthResult: function (authResult) {
    if (authResult && !authResult.error) {
      this.token = authResult.access_token;
      this.util.onAuthComplete(authResult);
      this.util.options.onAuthComplete(authResult);
    } else {
      this.authorize(true);
    }
  }
}