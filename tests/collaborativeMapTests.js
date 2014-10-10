
window.testSuite.load(new TestingClass('Collaborative Map', 'collaborativeMapTests.js')
	.reset({
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
		description: 'clear()',
		run: function () {
			testDocument1.map.clear();
		},
		assert: function () {
			return testDocument1.map.isEmpty() == true &&
				testDocument2.map.isEmpty() == true &&
				testDocument1.map.values().length == 0 &&
				testDocument2.map.values().length == 0;
		}
	})
	.test({
		description: 'delete()',
		run: function () {
			testDocument1.map.delete('key2');
		},
		assert: function () {
			return testDocument1.map.values().length == 1 &&
				testDocument2.map.values().length == 1 &&
				testDocument1.map.has('key1') &&
				testDocument2.map.has('key1');
		}
	})
	.test({
		description: 'get()',
		run: function () {
		},
		assert: function () {
			return testDocument1.map.get('key1') == 1 &&
				testDocument2.map.get('key1') == 1;
		}
	})
	.test({
		description: 'has()',
		run: function () {

		},
		assert: function () {
			return testDocument1.map.has('key1') == true &&
				testDocument2.map.has('key1') == true;
		}
	})
	.test({
		description: 'isEmpty()',
		run: function () {
			testDocument1.map.clear();
		},
		assert: function () {
			return testDocument1.map.isEmpty() == true &&
				testDocument2.map.isEmpty() == true;
		}
	})
	.test({
		description: 'items()',
		run: function () {

		},
		assert: function () {
			var items = testDocument1.map.items();
			var items2 = testDocument2.map.items();

			return 	items[0] instanceof Array &&
					items[1] instanceof Array &&
					items2[0] instanceof Array &&
					items2[1] instanceof Array &&
					(items.toString() == 'key2,2,key1,1' || items.toString() == 'key1,1,key2,2') &&
					(items2.toString() == 'key2,2,key1,1' || items2.toString() == 'key1,1,key2,2');
		}
	})
	.test({
		description: 'keys()',
		run: function () {

		},
		assert: function () {
			var key1 = testDocument1.map.keys().toString();
			var key2 = testDocument2.map.keys().toString();
			return (key1 == 'key2,key1' || key1 == 'key1,key2') &&
				(key2 == 'key2,key1' || key2 == 'key1,key2')
		}
	})
	.test({
		description: 'set()',
		run: function () {
			testDocument1.map.set('key2', 3);
		},
		assert: function () {
			return testDocument1.map.get('key2') == 3 &&
				testDocument2.map.get('key2') == 3;
		}
	})
	.test({
		description: 'values()',
		run: function () {
		},
		assert: function () {
				values1 = testDocument1.map.values().toString();
				values2 = testDocument2.map.values().toString()
			return (values1 == '2,1' || values1 == '1,2') &&
				(values2 == '2,1' || values2 == '1,2');
		}
	})
	.test({
		description: 'addEventListener() - VALUE_CHANGED',
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
			testDocument1.map.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.alpha_callback);
			testDocument2.map.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.beta_callback);
			testDocument1.map.set('key1', 'z');
		},
		assert: function () {
			return this.alphaEvents.length == 1 &&
				this.betaEvents.length == 1;
		}
	})
	.test({
		description: 'removeEventListener() - VALUE_CHANGED',
		assertFor: 2000,
		run: function () {
			this.alphaEvents = [];
			this.betaEvents = [];
			testDocument1.map.removeEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.alpha_callback)
			testDocument2.map.removeEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, this.beta_callback)
			testDocument1.map.set('key1', 'z');
		},
		assert: function () {
			return this.alphaEvents.length == 0 &&
				this.betaEvents.length == 0;
		}
	}));
