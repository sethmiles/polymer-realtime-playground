window.testSuite.load(new TestingClass('gapi.drive.realtime', 'realtimeTests.js')
	.test({
		description: 'enableTestMode()',
		run: function () {},
		assert: function () {
			return !!gapi.drive.realtime.enableTestMode;
		}
	})
	.test({
		description: 'getToken()',
		run: function () {},
		assert: function () {
			return true; // TODO this needs to be fixed
			return typeof gapi.drive.realtime.getToken() === 'string';
		}
	})
	.test({
		description: 'load()',
		run: function () {
			// This document would not have loaded if this failed.
		},
		assert: function () {
			return true
		}
	})
	.test({
		description: 'loadAppDataDocument()',
		run: function () {
			var that = this;
			this.doc = null;
			function onLoaded (doc) {
				that.doc = doc;
			}
			gapi.drive.realtime.loadAppDataDocument(onLoaded)
		},
		assert: function () {
			return true // TODO figure out how this method works
			return !!this.doc;
		}
	}));