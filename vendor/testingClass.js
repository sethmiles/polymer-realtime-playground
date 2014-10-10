TestingClass = function (description, fileName) {
	this.$el = $(this.el({
		description: description
	}));
	this.$el.find('h2').on('click', function () {
		var url = window.location.origin + '/test?testPath=' + fileName;
		var serverUrl = util.getParam('serverUrl');
		if(serverUrl){
			url += '&serverUrl=' + serverUrl;
		}
    window.open(url, '_blank');
	});
	this.tests = [];
	this.$completed = this.$el.find('.completed');
	this.$failed = this.$el.find('.failed');
	this.$succeeded = this.$el.find('.succeeded');
	this.continueExecution = _.bind(this.continueExecution, this);
	return this;
}

TestingClass.prototype = {

	timeout: 100,

	retryAttempts: 100,

	el: _.template('<div class="test-class"><h2><%= description %></h2><div class="stats"><span class="completed"></span><span class="failed"></span><span class="succeeded"></span></div><div class="tests"></div></div>'),

	testEl: _.template('<div class="test">' +
							'<span class="description"><%= description %></span>' +
							'<div class="test-result">' +
								'<span class="result <%= result %>"><%= result %></span>' +
							'</div>' +
							'<div class="code">' +
								'<pre>' +
									'<code class="javascript">' +
										'// Test\n' +
										'<%= run %>\n\n\n' +
										'// Assertion\n' +
										'<%= assert %>' +
									'</code>' +
								'</pre>' +
							'</div>' +
						'</div>'),

	test: function (test, index) {

		var el = $(this.testEl({
			description: test.description,
			result: 'pending',
			run: test.run.toString(),
			assert: test.assert.toString()
		}));

		test.selector = el;

		el.on('click', function () {
			$(this).find('.code').slideToggle();
		});

		hljs.highlightBlock(el.find('pre code')[0]);

		if(typeof index == 'number'){
			if(this.tests.length && this.tests[0].isSetup && index == 0){
				// Cannot insert a test before the pretest occurs
				index = 1;
			}
			if(index == 0){
				this.$el.find('.tests').prepend(el);
			} else {
				this.$el.find('.tests div:nth-child(' + (index - 1) + ')').after(el);
			}
			this.tests.splice(index, 0, test);
		} else {
			this.$el.find('.tests').append(el);
			this.tests.push(test);
		}

		return this;
	},

	reset: function (hash) {
		hash.isReset = true;
		hash.description = "Reset Test";
		this.resetTest = hash;
		return this;
	},

	setup: function (hash) {
		hash.isSetup = true;
		hash.description = "Setup Test";
		this.setupTest = hash;
		return this;
	},

	teardown: function (hash) {
		hash.isTeardown = true;
		hash.description = "Teardown Test";
		this.teardownTest = hash;
		return this;
	},

	execute: function (lib) {
		var that = this;
		this.completedTestCount = 0;
		this.successfulTests = 0;
		this.failedTests = 0;
		this.testIndex = -1;
		this.updateUI();
		this.lib = lib;
		if(this.setupTest && this.resetTest){
			this.runNonNormalTest(this.setupTest, function () {
				that.runNonNormalTest(that.resetTest, that.continueExecution);
			});
		} else if (this.setupTest) {
			this.runNonNormalTest(this.setupTest, this.continueExecution);
		} else if (this.resetTest) {
			this.runNonNormalTest(this.resetTest, this.continueExecution);
		} else {
			this.continueExecution();
		}
	},

	continueExecution: function () {
		var that = this;
		this.testIndex++;
		var test = this.tests[this.testIndex];
		var success = false;

		if(test.precondition){
			// We need to wait for this condition to exist before proceeding...
			test.precondition.description = "Precondition for " + test.description;
			this.runNonNormalTest(test.precondition, function (success) {
				if(!success){
					throw test.description + ' failed; cannot continue';
				} else {
					console.log("Test precondition met")
					test.precondition = false; // Completed the precondition
					that.testIndex--;
					that.continueExecution();
				}
			});
			return;
		}

		test.start = new Date().getTime();
		test.run.call(this);
		var callback = function (success) {
			var endTime = new Date().getTime();
			if(test.isSetup && !success){
				throw "Pretest failed, cannot continue";
				return;
			}
			$(test.selector.find('.result'))
				.text(endTime - test.start + 'ms - ' + (success ? 'passed' : 'failed'))
				.removeClass('pending')
				.addClass(success ? 'passed' : 'failed');
			that.lib.testCompleted(success);
			that.tallyTest(success);
		}
		that.attemptAssert(test, 0, callback);
	},

	runNonNormalTest: function (hash, callback) {
		var that = this;
		hash.run.call(this);
		this.attemptAssert(hash, 0, callback);
	},

	attemptAssert: function (test, attempt, callback) {
		var that = this;
		if(!test.assert){
			if(test.isSetup || test.isTeardown){
				callback();
				return;
			} else {
				throw "Test must have an assert function to evaluate test truth";
			}
		}
		console.log(test.description + " - attempt # " + attempt);
		var success;
		try {
			success = test.assert.call(this);
		} catch (e) {
			success = false;
		}
		var that = this;
		if(success || (!success && attempt == this.retryAttempts)){
			if(test.assertFor){
				this.oldRetryAttempts = this.retryAttempts;
				this.retryAttempts = Math.round(test.assertFor / this.timeout);
				if(!success){
					callback(success);
					this.retryAttempts = this.oldRetryAttempts;
					return;
				} else if (attempt == this.retryAttempts) {
					callback(success);
					this.retryAttempts = this.oldRetryAttempts;
					return;
				}
			} else if(!test.isSetup && !test.isTeardown){
				callback(success);
				return;
			} else if (test.isSetup && test.assert){
				callback(success);
				return;
			}
		}

		setTimeout(function () {
			that.attemptAssert(test, attempt + 1, callback);
		}, this.timeout);
	},

	tallyTest: function (success) {
		this.completedTestCount++;
		if(success){
			this.successfulTests++;
		} else {
			this.failedTests++;
		}
		this.updateUI();
		if (this.completedTestCount == this.getTestCount()){
			// All done
			if(this.teardownTest){
				this.attemptAssert(this.teardownTest, 0, this.lib.testClassCompleted);
			} else {
				this.lib.testClassCompleted();
			}
			return;
		}
		if(this.resetTest){
			this.runNonNormalTest(this.resetTest, this.continueExecution);
		} else {
			this.continueExecution();
		}
	},

	updateUI: function () {
		this.$completed.text('Completed Tests: '+ this.completedTestCount + '/' + this.getTestCount());
		this.$succeeded.text('Succeeded: ' + this.successfulTests);
		this.$failed.text('Failed: ' + this.failedTests);
	},

	setSynchronousTesting: function () {
		this.isSynchronous = true;
		return this;
	},

	getTestCount: function () {
		return this.tests.length;
	}
}