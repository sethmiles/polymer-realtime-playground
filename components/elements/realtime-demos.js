Polymer({
      ready: function () {
        console.log(this);
        this.util = this.$.globals.util;
        this.eventsList = [];
        this.$.drawer.selected = 0;
        this.document = null;
        this.documentTitle = "loading . . ."
      },

      documentChanged: function (evt, doc) {
        this.doc = doc;
        this.collaborators = doc.getCollaborators();

        this.stringDemo = doc.getModel().getRoot().get('demo_string');
        this.listDemo = doc.getModel().getRoot().get('demo_list');
        this.cursorsDemo = doc.getModel().getRoot().get('demo_cursors');
        this.mapDemo = doc.getModel().getRoot().get('demo_map');
        this.customDemo = doc.getModel().getRoot().get('demo_custom');

        this.setupModel();
        this.setupCollaborators();
        this.setupCollaborativeString();
        this.setupCollaborativeList();
        this.setupCollaborativeMap();
        this.setupCustomObject();
        
        this.$.drawer.selected = 1;
        this.eventsList = [];


      },

      documentIdChanged: function (evt, id) {
        console.log('the document id has changed!');
        this.$.driveFileMetadataRequest.params = JSON.stringify({
          access_token: this.util.authorizer.token
        });
        this.$.driveFileMetadataRequest.go();
      },

      handleResponse: function (resp) {
        this.documentTitle = resp.detail.response.title;
      },

      setupModel: function () {
        this.onUndoRedoStateChanged = this.onUndoRedoStateChanged.bind(this);
        this.doc.getModel().addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, this.onUndoRedoStateChanged);
        this.onUndoRedoStateChanged();
      },

      onUndoRedoStateChanged: function (evt) {
        this.addEvent(evt);
        this.canUndo = this.doc.getModel().canUndo;
        this.canRedo = this.doc.getModel().canRedo;
      },

      // Collaborator Methods
      setupCollaborators: function () {
        this.onCollaboratorChange = this.util.bind(this.onCollaboratorChange, this);
        this.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, this.onCollaboratorChange);
        this.doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, this.onCollaboratorChange);
      },

      onCollaboratorChange: function () {
        this.collaborators = this.doc.getCollaborators();
      },


      // Collaborative String Methods
      setupCollaborativeString: function () {
        this.onCollaborativeStringEvent = this.util.bind(this.onCollaborativeStringEvent, this);
        this.stringDemo.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.onCollaborativeStringEvent);
        this.stringDemo.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.onCollaborativeStringEvent);
        this.collaborativeString = this.stringDemo.getText();
      },

      onCollaborativeStringEvent: function (evt) {
        this.addEvent(evt);
        this.collaborativeString = this.stringDemo.getText();
      },

      onCollaborativeStringKeyup: function (evt) {
        this.stringDemo.setText(this.$.stringInput.inputValue);
      },



      // Collaborative List Methods
      setupCollaborativeList: function () {
        this.onListChange = this.onListChange.bind(this);
        this.listDemo.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.onListChange);
        this.listDemo.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.onListChange);
        this.listDemo.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.onListChange);
        this.collaborativeList = this.listDemo.asArray();
      },

      onListChange: function (evt) {
        this.addEvent(evt);
        this.collaborativeList = this.listDemo.asArray();
      },

      onRemoveListItemClick: function () {
        this.listDemo.remove(this.getIndex(this.selectedItem));
        this.selectedItem = null;
      },

      onAddListItemClick: function (evt) {
        this.listDemo.push(this.$.addListItemInput.value);
        this.$.addListItemInput.value = '';
      },

      onClearListClick: function () {
        this.listDemo.clear();
        this.selectedItem = null;
      },

      onSetListItemClick: function () {
        this.listDemo.set(this.getIndex(this.selectedItem), this.$.setListItemInput.value);
        this.$.setListItemInput.value = '';
      },

      onMoveListItemClick: function () {
        var oldIndex = this.getIndex(this.selectedItem);
        var newIndex = parseInt(this.$.moveListItemInput.value);

        if(newIndex < 0 || newIndex > this.listDemo.asArray().length || oldIndex == newIndex){
          return;
        }

        this.listDemo.move(oldIndex, newIndex);
        this.$.moveListItemInput.value = ''
      },

      getIndex: function (value) {
        for(var i = 0; i < this.listDemo.asArray().length; i++){
          if(value == this.listDemo.asArray()[i]){
            return i;
          }
        }
      },



      // Collaborative Map Methods
      setupCollaborativeMap: function () {
        this.onMapValueChanged = this.onMapValueChanged.bind(this);
        this.mapDemo.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.onMapValueChanged);
        this.parseCollaborativeMap();
      },

      onMapValueChanged: function (evt) {
        this.addEvent(evt);
        this.parseCollaborativeMap();
      },

      parseCollaborativeMap: function () {
        var mapArray = [];
        var keys = this.mapDemo.keys();
        for(var i = 0; i < keys.length; i++){
          mapArray.push({
            key: keys[i],
            value: this.mapDemo.get(keys[i])
          });
        }
        this.collaborativeMap = mapArray;
      },

      onMapItemClick: function (evt, no, el) {
        this.selectedMapItemKey = el.querySelector('.mapKey').textContent;
      },

      onRemoveMapItemClick: function () {
        this.mapDemo.delete(this.selectedMapItemKey);
      },

      onClearMapClick: function () {
        this.mapDemo.clear();
      },

      onAddMapItemClick: function () {
        this.mapDemo.set(this.$.addMapKeyInput.value, this.$.addMapValueInput.value);
        this.$.addMapKeyInput.value = '';
        this.$.addMapValueInput.value = '';
      },




      // Custom Object Methods
      setupCustomObject: function () {
        this.onCustomDemoChange = this.onCustomDemoChange.bind(this);
        this.customDemo.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.onCustomDemoChange);
        this.setCustomObjectValues();
      },

      onCustomDemoChange: function (evt) {
        this.addEvent(evt);
        this.setCustomObjectValues();
      },

      setCustomObjectValues: function () {
        this.name = this.customDemo.name;
        this.director = this.customDemo.director;
        this.notes = this.customDemo.notes;
        this.rating = this.customDemo.rating;
      },

      onNameKeyup: function () {
        this.customDemo.name = this.$.customNameInput.inputValue;
      },

      onDirectorKeyup: function () {
        this.customDemo.director = this.$.customDirectorInput.inputValue;
      },

      onNotesKeyup: function () {
        this.customDemo.notes = this.$.customNotesInput.inputValue;
      },

      onRatingKeyup: function () {
        this.customDemo.rating = this.$.customRatingInput.inputValue;
      },





      addEvent: function (evt) {
        if(this.eventsList > 100){
          this.eventsList.pop();
        }
        this.eventsList.unshift(evt);
      },

      openInNewTab: function () {
        var url = window.location.origin + '/#' + this.documentId;
        window.open(url, '_blank');
      },

      back: function () {
        this.fire('core-signal', { 
          name:'back'
        });
        this.$.drawer.selected = 0;
        this.shadowRoot.querySelector('core-drawer-panel').closeDrawer();
      },

      share: function () {
        console.log('trying to share...');
      },

      undo: function () {
        this.doc.getModel().undo();
      },

      redo: function () {
        this.doc.getModel().redo();
      }

    });