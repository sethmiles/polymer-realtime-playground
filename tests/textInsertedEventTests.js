window.testSuite.load(new TestingClass('Text Inserted Event', 'textInsertedEventTests.js')
	.setup({
		run: function () {
			testDocument2.string.setText('test');
		},
		assert: function () {
			return testDocument1.string.getText() == 'test' &&
				testDocument2.string.getText() == 'test';
		}
	})
	.test({
		precondition: {
			run: function () {
				var that = this;
				this.alpha_callback = function (evt) {
					that.alphaEvent = evt;
				};
				this.beta_callback = function (evt) {
					that.betaEvent = evt;
				}
				testDocument1.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.alpha_callback);
				testDocument2.string.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, this.beta_callback);
				testDocument2.string.insertString(1, 't')
			},
			assert: function () {
				return this.alphaEvent && this.betaEvent;
			}
		},
		description: 'bubbles',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.bubbles === 'boolean';
		}
	})
	.test({
		description: 'isLocal - false',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.isLocal === 'boolean' &&
				this.alphaEvent.isLocal === false;
		}
	})
	.test({
		description: 'isLocal - true',
		run: function () {},
		assert: function () {
			return typeof this.betaEvent.isLocal === 'boolean' &&
				this.betaEvent.isLocal === true;
		}
	})
	.test({
		description: 'sessionId',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.sessionId === 'string';
		}
	})
	.test({
		description: 'userId',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.userId === 'string';
		}
	})
	.test({
		description: 'type',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.type === 'string';
		}
	})
	.test({
		description: 'index',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.index === 'number' &&
				this.alphaEvent.index == 1;
		}
	})
	.test({
		description: 'text',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.text === 'string' &&
				this.alphaEvent.text == 't';
		}
	}));