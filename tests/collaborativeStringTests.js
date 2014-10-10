
window.testSuite.load(new TestingClass('Collaborative String','collaborativeStringTests.js')
	.setSynchronousTesting()
	.reset({
		run: function () {
			testDocument1.string.setText('hello world');
		},
		assert: function () {
			// Do not start any tests until this passes
			return testDocument1.string.getText() == 'hello world' &&
				testDocument2.string.getText() == 'hello world';
		}
	})
	.test({
		description: 'toString()',
		run: function () {

		},
		assert: function () {
			return testDocument1.string.toString() == 'hello world' &&
				testDocument2.string.toString() == 'hello world';
		}
	})
	.test({
		description: 'getText()',
		run: function () {},
		assert: function () {
			return testDocument1.string.getText() == 'hello world' &&
				testDocument2.string.getText() == 'hello world';
		}
	})
	.test({
		description: 'setText()',
		run: function () {
			testDocument1.string.setText('dog');
		},
		assert: function () {
			return testDocument1.string.getText() == 'dog' &&
				testDocument2.string.getText() == 'dog';
		}
	})
	.test({
		description: 'append()',
		run: function () {
			testDocument1.string.append('-append');
		},
		assert: function () {
			return testDocument1.string.getText() == 'hello world-append' &&
				testDocument2.string.getText() == 'hello world-append';
		}
	})
	.test({
		description: 'insertString()',
		run: function () {
			testDocument1
			testDocument1.string.insertString(1, '-test-')
		},
		assert: function () {
			return testDocument1.string.getText() == 'h-test-ello world' &&
				testDocument2.string.getText() == 'h-test-ello world';
		}
	})
	.test({
		description: 'removeRange()',
		run: function () {
			testDocument1.string.removeRange(1,5);
		},
		assert: function () {
			return testDocument1.string.getText() == 'h world' &&
				testDocument2.string.getText() == 'h world';
		}
	})
	.test({
		description: 'addEventListener() - text_inserted',
		run: function () {
			var that = this;
			this.alphaEvents = [];
			this.betaEvents = [];
			this.alpha_callback = function (evt) {
				that.alphaEvents.push(evt);
			};
			this.beta_callback = function (evt) {
				that.betaEvents.push(evt);
			}
			testDocument1.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.alpha_callback);
			testDocument2.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.beta_callback);
			testDocument1.string.append('-test');	// test-cat-test
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.betaEvents.length == 1;
		}
	})
	.test({
		description: 'removeEventListener() - text_inserted',
		assertFor: 2000,
		run: function () {
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.alpha_callback)
			testDocument2.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.beta_callback)
			testDocument1.string.append('-test');	// test-cat-test-test
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.betaEvents.length == 0;
		}
	})
	.test({
		description: 'addEventListener() - text_deleted',
		run: function () {
			var that = this;
			this.alphaEvents = [];
			this.betaEvents = [];
			this.alpha_callback = function (evt) {
				that.alphaEvents.push(evt);
			};
			this.beta_callback = function (evt) {
				that.betaEvents.push(evt);
			}
			testDocument1.string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.alpha_callback);
			testDocument2.string.addEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.beta_callback);
			testDocument1.string.removeRange(0, 5); // cat-test
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.betaEvents.length == 1;
		}
	})
	.test({
		description: 'removeEventListener() - text_deleted',
		assertFor: 2000,
		run: function () {
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.alpha_callback)
			testDocument2.string.removeEventListener(gapi.drive.realtime.EventType.TEXT_DELETED, this.beta_callback)
			testDocument1.string.removeRange(3, 7); // cat
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.betaEvents.length == 0;
		}
	})
	.teardown({
		run: function () {
			console.log('Running post test!');
		}
	}));
