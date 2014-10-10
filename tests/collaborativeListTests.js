
window.testSuite.load(new TestingClass('Collaborative List', 'collaborativeListTests.js')
	.setSynchronousTesting()
	.reset({
		run: function () {
			testDocument1.list.clear();
		},
		assert: function () {
			return testDocument1.list.length == 0 &&
				testDocument2.list.length == 0;
		}
	})
	.test({
		description: 'push()',
		run: function () {
			testDocument1.list.push('a');
		},
		assert: function () {
			return testDocument1.list.length == 1 &&
				testDocument2.list.length == 1 &&
				testDocument1.list.asArray().toString() == 'a';
				testDocument2.list.asArray().toString() == 'a';
		}
	})
	.test({
		description: 'pushAll()',
		run: function () {
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
		description: 'removeValue()',
		run: function () {
			testDocument1.list.pushAll(['a','b']);
			this.wasRemoved = testDocument1.list.removeValue('a');
		},
		assert: function () {
			return testDocument1.list.length == 1 &&
				testDocument2.list.length == 1 &&
				testDocument1.list.asArray().toString() == 'b';
				testDocument2.list.asArray().toString() == 'b';
		}
	})
	.test({
		description: 'removeRange()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c','d','e'])
			testDocument1.list.removeRange(2,3)
		},
		assert: function () {
			return testDocument1.list.length == 4 &&
				testDocument2.list.length == 4 &&
				testDocument1.list.asArray().toString() == 'a,b,d,e';
				testDocument2.list.asArray().toString() == 'a,b,d,e';
		}
	})
	.test({
		description: 'insert()',
		run: function () {
			testDocument1.list.push('a');
			testDocument1.list.insert(0, 'b');
		},
		assert: function () {
			return testDocument1.list.length == 2 &&
				testDocument2.list.length == 2 &&
				testDocument1.list.asArray().toString() == 'b,a';
				testDocument2.list.asArray().toString() == 'b,a';
		}
	})
	.test({
		description: 'remove()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c'])
			testDocument1.list.remove(1)
		},
		assert: function () {
			return testDocument1.list.length == 2 &&
				testDocument2.list.length == 2 &&
				testDocument1.list.asArray().toString() == 'a,c';
				testDocument2.list.asArray().toString() == 'a,c';
		}
	})
	.test({
		description: 'clear()',
		assertFor: 2000,
		run: function () {
			testDocument1.list.pushAll(['a','b','c'])
			testDocument1.list.clear();
		},
		assert: function () {
			return testDocument1.list.length == 0 &&
				testDocument2.list.length == 0;
		}
	})
	.test({
		description: 'insertAll()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
			testDocument1.list.insertAll(1,['d','e']);
		},
		assert: function () {
			return testDocument1.list.length == 5 &&
				testDocument2.list.length == 5 &&
				testDocument1.list.asArray().toString() == 'a,d,e,b,c';
				testDocument2.list.asArray().toString() == 'a,d,e,b,c';
		}
	})
	.test({
		description: 'get()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
		},
		assert: function () {
			return testDocument1.list.get(1) == 'b' &&
				testDocument2.list.get(1) == 'b';
		}
	})
	.test({
		description: 'asArray()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
		},
		assert: function () {
			return testDocument1.list.asArray() instanceof Array &&
				testDocument1.list.asArray().toString() == 'a,b,c';
		}
	})
	.test({
		description: 'indexOf()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
		},
		assert: function () {
			return testDocument1.list.indexOf('c') == 2 &&
				testDocument2.list.indexOf('c') == 2 &&
				testDocument1.list.indexOf('g') == -1;
		}
	})
	.test({
		description: 'lastIndexOf()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c','b']);
		},
		assert: function () {
			return testDocument1.list.lastIndexOf('b') == 3 &&
				testDocument2.list.lastIndexOf('b') == 3 &&
				testDocument1.list.lastIndexOf('g') == -1;
		}
	})
	.test({
		description: 'move()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
			testDocument1.list.move(2, 0);
		},
		assert: function () {
			return testDocument1.list.asArray().toString() == 'c,a,b' &&
				testDocument2.list.asArray().toString() == 'c,a,b';
		}
	})
	.test({
		description: 'replaceRange()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c','d','e']);
			testDocument1.list.replaceRange(1,['f','g']);
		},
		assert: function () {
			return testDocument1.list.asArray().toString() == 'a,f,g,d,e' &&
				testDocument2.list.asArray().toString() == 'a,f,g,d,e';
		}
	})
	.test({
		description: 'set()',
		run: function () {
			testDocument1.list.pushAll(['a','b','c']);
			testDocument1.list.set(1,'z');
		},
		assert: function () {
			return testDocument1.list.asArray().toString() == 'a,z,c' &&
				testDocument2.list.asArray().toString() == 'a,z,c';
		}
	})
	.test({
		description: 'addEventListener() - VALUES_ADDED',
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
			testDocument1.list.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.alpha_callback);
			testDocument2.list.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.beta_callback);
			testDocument1.list.push('a');
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.betaEvents.length == 1;
		}
	})
	.test({
		description: 'removeEventListener() - VALUES_ADDED',
		assertFor: 2000,
		run: function () {
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.alpha_callback)
			testDocument2.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, this.beta_callback)
			testDocument1.list.push('a');
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.betaEvents.length == 0;
		}
	})
	.test({
		description: 'addEventListener() - VALUES_SET',
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
			testDocument1.list.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.alpha_callback);
			testDocument2.list.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.beta_callback);
			testDocument1.list.push('a');
			testDocument1.list.set(0, 'b');
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.betaEvents.length == 1;
		}
	})
	.test({
		description: 'removeEventListener() - VALUES_SET',
		assertFor: 2000,
		run: function () {
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.alpha_callback)
			testDocument2.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_SET, this.beta_callback)
			testDocument1.list.push('a');
			testDocument1.list.set(0, 'b');
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.betaEvents.length == 0;
		}
	})
	.test({
		description: 'addEventListener() - VALUES_REMOVED',
		precondition: {
			run: function () {
				testDocument1.list.push('a');
			},
			assert: function () {
				return testDocument1.list.length == 1 &&
					testDocument2.list.length == 1;
			}
		},
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
			testDocument1.list.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.alpha_callback);
			testDocument2.list.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.beta_callback);
			testDocument1.list.remove(0);
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.betaEvents.length == 1;
		}
	})
	.test({
		description: 'removeEventListener() - VALUES_REMOVED',
		assertFor: 2000,
		precondition: {
			run: function () {
				testDocument1.list.push('a');
			},
			assert: function () {
				return testDocument1.list.length == 1 &&
					testDocument2.list.length == 1;
			}
		},
		run: function () {
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.alpha_callback)
			testDocument2.list.removeEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, this.beta_callback)
			testDocument1.list.remove(0);
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.betaEvents.length == 0;
		}
	}));