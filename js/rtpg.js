window.realtimeOptions = {
  /**
   * Client ID from the console.
   */
  ,

  /**
   * Function to be called when a Realtime model is first created.
   */
  initializeModel: function (model) {
    this.model = model;
    for(var i = 0; i < this.demos.length; i++){
      this.demos[i].initialize(model);
    }
  },

  /**
   * Autocreate files right after auth automatically.
   */
  autoCreate: false,

  /**
   * The name of newly created Drive files.
   */
  defaultTitle: "New Realtime Quickstart File",

  /**
   * The MIME type of newly created Drive Files. By default the application
   * specific MIME type will be used:
   *     application/vnd.google-apps.drive-sdk.
   */
  newFileMimeType: null, // Using default.

  /**
   * Function to be called every time a Realtime file is loaded.
   */
  onFileLoaded: function (doc) {
    this.doc = doc;
  },

  /**
   * Function to be called to inityalize custom Collaborative Objects types.
   */
  registerTypes: null, // No action.

  /**
   * Function to be called after authorization and before loading files.
   */
  afterAuth: null // No action.

}