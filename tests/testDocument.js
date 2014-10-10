
var TestDocument = function (model, tag) {
  this.tag = tag;
  this.model = model;
  this.root = this.model.getRoot();
  this.events = [];
  this.setup();
}

TestDocument.prototype = {

  setup: function () {
    this.onEvent = this.bind(this.onEvent, this);
    this.onStringKeyup = this.bind(this.onStringKeyup, this);
    this.createString();
    this.createMap();
    this.createList();
    // this.createCustomObject();
    // this.createCollaborator();
  },

  // CREATE METHODS

  createString: function () {
    this.string = this.getOrCreate('createString', 'string');
    this.addEventListeners(this.string,
      ['TEXT_INSERTED','TEXT_DELETED'])
  },

  createMap: function () {
    this.map = this.getOrCreate('createMap', 'map');
    this.addEventListeners(this.map,
      ['VALUE_CHANGED']);
  },

  createList: function () {
    this.list = this.getOrCreate('createList', 'list');
    this.addEventListeners(this.list,
      ['VALUES_ADDED', 'VALUES_REMOVED', 'VALUES_SET']);
  },

  createCustomObject: function () {
    this.customObject = this.getOrCreateCustomObject();
    this.addEventListeners(this.customObject,
      ['VALUE_CHANGED']);
  },

  // EVENT HANDLERS
  onEvent: function (evt) {
    this.events.push(evt);
    console.log(this.tag + ' event received', evt);
  },

  // UTILITY METHODS

  getOrCreate: function (createMethodName, key) {
    if(!this.root.get(key)){
      var collaborativeObject = this.model[createMethodName](key);
      this.root.set(key, collaborativeObject);
    }
    return this.root.get(key);
  },

  getOrCreateUI: function (id, elType) {
    var el = document.getElementById(id);
    if(!el){
      el = document.createElement(elType);
      document.body.appendChild(el);
      return el;
    }
  },

  getOrCreateCustomObject: function () {
    if(!this.root.get('collaborativeCustomObject')){
      this.customObject = function () {};
      this.customObject.prototype.initialize = function () {
        this.fname = "Seth";
        this.lname = "Howard";
      }
      var custom = gapi.drive.realtime.custom;
      custom.registerType(this.customObject,'customObject');
      this.customObject.prototype.fname = custom.collaborativeField('fname');
      this.customObject.prototype.lname = custom.collaborativeField('lname');
      custom.setInitializer(this.customObject, this.customObject.prototype.initialize);

      var collaborativeObject = this.model.create(this.customObject);
      this.root.set('collaborativeCustomObject', collaborativeObject);
    }
    return this.root.get('collaborativeCustomObject');
  },

  clearEvents: function () {
    this.events = [];
  },

  createHTML: function (html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.children[0];
  },

  addEventListeners: function (collaborativeObject, events) {
    for (var i = events.length - 1; i >= 0; i--) {
      collaborativeObject.addEventListener(gapi.drive.realtime.EventType[events[i]], this.onEvent);
    };
  },

  bind: function (fn, ctx) {
    return function () {
      fn.apply(ctx, arguments);
    }
  }

}