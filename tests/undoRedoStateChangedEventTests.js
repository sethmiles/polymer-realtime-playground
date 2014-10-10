
window.testSuite.load(new TestingClass('Undo Redo State Changed Event','undoRedoStateChangedEventTests.js')
	.reset({
		run: function () {
			if(this.testDocument3){
				this.testDocument3.doc.close();
				this.testDocument3 = null;
			}
			var that = this;
			function handleErrors () {}

		    function initModel(model) {}

		    function onFileLoaded(doc) {
		    	that.testDocument3 = new TestDocument(doc.getModel(), 'gamma');
		    	that.testDocument3.doc = doc;
		    }

			gapi.drive.realtime.load(window.fileId, onFileLoaded, initModel, handleErrors);
		},
		assert: function () {
			return !!this.testDocument3;
		}
	})
	.test({
		precondition: {
			run: function () {
				var that = this;
				that.alphaEvents = [];
				that.alpha_callback = function (evt) {
					that.alphaEvents.push(evt);
				};
				that.testDocument3.model.addEventListener(gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED, this.alpha_callback);
				that.testDocument3.string.setText('');
				that.testDocument3.model.undo();
			},
			assert: function () {
				return this.alphaEvents.length == 2
			}
		},
		description: 'canRedo',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvents[0].canRedo === 'boolean' &&
				typeof this.alphaEvents[1].canRedo === 'boolean';
		}
	})
	.test({
		description: 'canUndo',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvents[0].canRedo === 'boolean' &&
				typeof this.alphaEvents[1].canRedo === 'boolean';
		}
	}));