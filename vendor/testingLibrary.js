FunctionalTesting = function (title) {
	this.testsCompleted = 0;
	this.successfulTests = 0;
	this.failedTests = 0;
	this.$tests = $(this.testsContainer);
	this.$el = $(this.container).append(this.$tests);
	this.$header = this.$el.find('.header');
	this.$header.find('.title').text(title);
	this.$completed = this.$header.find('.completed');
	this.$failed = this.$header.find('.failed');
	this.$succeeded = this.$header.find('.succeeded');
	this.progressBubbles = new ProgressBubbles(this.totalTests);
	this.$header.find('.right').append(this.progressBubbles.el);
	this.testClassCompleted = _.bind(this.testClassCompleted, this);

	hljs.configure({
	  tabReplace: '    ', // 4 spaces
	  classPrefix: ''     // don't append class prefix
	});

}

FunctionalTesting.prototype = {

	container: 	'<div class="testing-container">' +
								'<div class="header">' +
									'<div class="left">' +
										'<div class="title"></div>' +
										'<div class="loader"></div>' +
										'<div class="totalResults">' +
											'<span class="completed"></span><span class="failed"></span><span class="succeeded"></span>' +
										'</div>' +
									'</div>' +
									'<div class="right"></div>' +
								'</div>' +
							'</div>',

	testsContainer: 	'<div class="tests"></div>',

	passedClassName: 'passed',

	failedClassName: 'failed',

	totalTests: 0,

	testingClasses: [],

	load: function (testingClass) {
		this.testingClasses.push(testingClass);
		this.totalTests += testingClass.getTestCount();
		this.$tests.append(testingClass.$el);
		this.updateUI();
		this.progressBubbles.updateTestCount(this.totalTests);
	},

	execute: function () {
		this.index = -1;
		$(this.progressBubbles.el).fadeIn();
		this.$header.find('.loader').fadeOut();
		this.next();
	},

	next: function () {
		this.index++;
		if(this.testingClasses[this.index]){
			this.testingClasses[this.index].execute(this);
		}
	},

	testCompleted: function (success) {
		this.testsCompleted++;
		if(success){
			this.successfulTests++;
		} else {
			this.failedTests++;
		}
		this.progressBubbles.addData(success);
		this.updateUI();
	},

	testClassCompleted: function () {
		this.next();
	},

	updateUI: function () {
		this.$completed.text('Total Tests: ' + this.testsCompleted + '/' + this.totalTests);
		this.$failed.text('Failed: ' + this.failedTests);
		this.$succeeded.text('Succeeded: ' + this.successfulTests);
		if (this.failedTests) {
			this.$el.addClass('failed');
			$(document.head).find('title').text('FAILURE');
		} else if (this.totalTests == this.successfulTests){
			this.$el.addClass('success');
			$(document.head).find('title').text('Success');
		}
	}
}

