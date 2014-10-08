
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
    mimeType: 'application/vnd.google-apps.drive-sdk',

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
    this.createRealtimeFile = this.createRealtimeFile.bind(this);
  },

  authorize: function (onAuthComplete, usePopup) {
    this.authorizer.start(onAuthComplete, usePopup);
  },

  mergeOptions: function (options) {
    for(option in options){
      this.options[option] = options[option];
    }
  },

  // Check the url to see if we have a document id
  getDocumentIdFromUrl: function() {
    var params = {};
    var hashFragment = window.location.hash;
    if(hashFragment){
      return hashFragment.replace('#','');
    }
    
    return false;
  },

  createRealtimeFile: function(title, callback) {
    var that = this;
    window.gapi.client.load('drive', 'v2', function() {
      window.gapi.client.drive.files.insert({
        'resource': {
          mimeType: that.options.mimeType,
          title: title
        }
      }).execute(callback);
    });
  },

  load: function(documentId, onFileLoaded, initializeModel) {
    window.gapi.drive.realtime.load(documentId, onFileLoaded, initializeModel, this.onError);
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
  }
  
}




Authorizer = function (util) {
  this.util = util;
  this.handleAuthResult = this.handleAuthResult.bind(this);
  this.token = null;
}

Authorizer.prototype = {
  start: function(onAuthComplete, usePopup) {
    var that = this;
    window.gapi.load('auth:client,drive-realtime,drive-share', function() {
      that.authorize(usePopup, onAuthComplete);
    });
  },

  authorize: function (usePopup, onAuthComplete) {
    this.onAuthComplete = onAuthComplete;
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
    }
    this.onAuthComplete(authResult);
  }
}