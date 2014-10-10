window.testSuite.load(new TestingClass('Document Save State Change Event', 'documentSaveStateChangedEventTests.js')
	.setup({
		run: function () {
			var that = this;
			this.alpha_callback = function (evt) {
				that.event = evt;
			};
			testDocument1.doc.addEventListener(gapi.drive.realtime.EventType.DOCUMENT_SAVE_STATE_CHANGED, this.alpha_callback);
			testDocument1.string.setText('');
		},
		assert: function () {
			return !!this.event;
		}
	})
	.test({
		description: 'isPending',
		run: function () {},
		assert: function () {
			return typeof this.event.isPending === 'boolean';
		}
	})
	.test({
		description: 'isSaving',
		run: function () {},
		assert: function () {
			return typeof this.event.isSaving === 'boolean';
		}
	}));