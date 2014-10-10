
window.testSuite.load(new TestingClass('IndexReference', 'indexReferenceTests.js')
	.reset({
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
		description: 'CollaborativeList.registerReference() - canBeDeleted false',
		run: function () {
			this.indexReference = testDocument1.list.registerReference(3, false);
			testDocument2.list.removeRange(2,4);
		},
		assert: function () {
			return this.indexReference.index == 2 &&
				this.indexReference.canBeDeleted == false;
		}
	})
	.test({
		description: 'CollaborativeList.registerReference() - canBeDeleted true',
		run: function () {
			this.indexReference = testDocument1.list.registerReference(3, true);
			testDocument2.list.removeRange(2,4);
		},
		assert: function () {
			return this.indexReference.index == -1 &&
				this.indexReference.canBeDeleted == true;
		}
	})
	.test({
		description: 'addEventListener() - REFERENCE_SHIFTED',
		run: function () {
			var that = this;
			this.alphaEvents = [];
			this.alpha_callback = function (evt) {
				that.alphaEvents.push(evt);
			};
			this.indexReference = testDocument1.list.registerReference(3, true);
			this.indexReference.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.alpha_callback);
			testDocument2.list.insert(0,'z');
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.indexReference.index == 4;
		}
	})
	.test({
		description: 'removeEventListener() - REFERENCE_SHIFTED',
		assertFor: 2000,
		precondition: {
			run: function () {
				var that = this;
				this.alphaEvents = [];
				this.alpha_callback = function (evt) {
					that.alphaEvents.push(evt);
				};
				this.indexReference = testDocument1.list.registerReference(3, true);
				this.indexReference.addEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.alpha_callback);
				testDocument2.list.insert(0,'z');
			},
			assert: function () {
				return this.alphaEvents.length == 1 &&
					this.indexReference.index == 4;
			}
		},
		run: function () {
			this.alphaEvents = [];
			this.indexReference.removeEventListener(gapi.drive.realtime.EventType.REFERENCE_SHIFTED, this.alpha_callback)
			testDocument2.list.insert(0,'z');
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.indexReference.index == 5;
		}
	}));