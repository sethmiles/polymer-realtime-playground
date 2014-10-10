
window.testSuite.load(new TestingClass('IndexReference', 'referenceShiftedEventTests.js')
	.setup({
		run: function () {
			testDocument1.list.clear();
			testDocument1.list.pushAll(['a','b','c','d']);
		},
		assert: function () {
			return testDocument1.list.length == 4 &&
				testDocument2.list.length == 4 &&
				testDocument1.list.asArray().toString() == 'a,b,c,d' &&
				testDocument2.list.asArray().toString() == 'a,b,c,d';
		}
	})
	.test({
		description: 'bubbles',
		precondition: {
			run: function () {
				var that = this;
				this.alpha_callback = function (evt) {
					that.alphaEvent = evt;
				}
				this.beta_callback = function (evt) {
					that.betaEvent = evt;
				}
				this.indexReference = testDocument1.list.registerReference(3, false);
				this.indexReference2 = testDocument2.list.registerReference(3, false);
				this.indexReference.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.alpha_callback);
				this.indexReference2.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.beta_callback);
				testDocument2.list.insertAll(0,['x','y']);
			},
			assert: function () {
				return this.alphaEvent && this.betaEvent;
			}
		},
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
		description: 'newIndex',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.newIndex === 'number';
		}
	})
	.test({
		description: 'newObjectId',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.newObject === 'object';
		}
	})
	.test({
		description: 'oldIndex',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.oldIndex === 'number';
		}
	})
	.test({
		description: 'oldObjectId',
		run: function () {},
		assert: function () {
			return typeof this.alphaEvent.oldObject === 'object';
		}
	}));