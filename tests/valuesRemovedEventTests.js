window.testSuite.load(new TestingClass('Values Removed Event','valuesRemovedEventTests.js')
	.setup({
		run: function () {
			testDocument1.list.clear();
			testDocument1.list.pushAll(['a','b']);
		},
		assert: function () {
			return testDocument1.list.length == 2 &&
				testDocument2.list.length == 2 &&
				testDocument1.list.asArray().toString() == 'a,b';
				testDocument2.list.asArray().toString() == 'a,b';
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
				testDocument1.list.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.alpha_callback);
				testDocument2.list.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.beta_callback);
				testDocument2.list.remove(1);
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
			return typeof this.alphaEvent.type === 'string' &&
				this.alphaEvent.type === 'values_removed';
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
		description: 'values',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.values === 'object' &&
				this.alphaEvent.values instanceof Array &&
				this.alphaEvent.values.toString() == 'b';
		}
	}));