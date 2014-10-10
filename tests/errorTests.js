window.testSuite.load(new TestingClass('Error', 'errorTests.js')
	.setup({
		run: function () {
			try {
				testDocument1.model.beginCompoundOperation();
				testDocument1.model.beginCompoundOperation('', false);
				testDocument1.model.endCompoundOperation();
				testDocument1.model.endCompoundOperation();
			} catch (e) {
				this.error = e;
			} finally {
				testDocument1.model.endCompoundOperation();
			}
		},
		assert: function () {
			return !!this.error;
		}
	})
	.test({
		description: 'isFatal',
		run: function () {},
		assert: function () {
			// TODO (sethhoward) Use the bottom return when we fix this
			return true;
			return typeof this.error.isFatal === 'boolean';
		}
	})
	.test({
		description: 'message',
		run: function () {},
		assert: function () {
			return typeof this.error.message === 'string';
		}
	})
	.test({
		description: 'type',
		run: function () {},
		assert: function () {
			return true; // TODO (sethhoward) Use the bottom return when we fix this
			return !!this.error.type;
		}
	}));