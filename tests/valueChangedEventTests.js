window.testSuite.load(new TestingClass('Value Changed Event', 'valueChangedEventTests.js')
	.setup({
		run: function () {
			testDocument1.map.set('key1', 1);
			testDocument1.map.set('key2', 2);
		},
		assert: function () {
			return testDocument1.map.get('key1') == 1 &&
				testDocument2.map.get('key1') == 1;
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
				testDocument1.map.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.alpha_callback);
				testDocument2.map.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.beta_callback);
				testDocument2.map.set('key1', 3);
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
		description: 'newValue',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.newValue === 'number' &&
				this.alphaEvent.newValue == 3;
		}
	})
	.test({
		description: 'oldValue',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.oldValue === 'number' &&
				this.alphaEvent.oldValue == 1;
		}
	})
	.test({
		description: 'property',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.property === 'string' &&
				this.alphaEvent.property === 'key1';
		}
	}));