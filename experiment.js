/* ************************************ */
/* Define helper functions */
/* ************************************ */
function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var changeData = function() {
		data = jsPsych.data.getTrialsOfType('text')
		practiceDataCount = 0
		testDataCount = 0
		for (i = 0; i < data.length; i++) {
			if (data[i].trial_id == 'practice_intro') {
				practiceDataCount = practiceDataCount + 1
			} else if (data[i].trial_id == 'test_intro') {
				testDataCount = testDataCount + 1
			}
		}
		if (practiceDataCount >= 1 && testDataCount === 0) {
			//temp_id = data[i].trial_id
			jsPsych.data.addDataToLastTrial({
				exp_stage: "practice"
			})
		} else if (practiceDataCount >= 1 && testDataCount >= 1) {
			//temp_id = data[i].trial_id
			jsPsych.data.addDataToLastTrial({
				exp_stage: "test"
			})
		}
	}
	/* ************************************ */
	/* Define experimental variables */
	/* ************************************ */
	// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var head_left_keys = [32,39]
var head_right_keys = [13,37]
var all_keys = [].concat(head_left_keys, head_right_keys)
window.test_stimuli = [{
	image_url: 'images/rrlrr.png',
	data: {
		correct_response: head_right_keys,
		condition: 'oddball-incogruent',
		trial_id: 'stim'
	}
}, {
	image_url: 'images/llrll.png',
	data: {
		correct_response: head_left_keys,
		condition: 'standard-incogruent',
		trial_id: 'stim'
	}
}, {
	image_url: 'images/lllll.png',
	data: {
		correct_response: head_right_keys,
		condition: 'standard-congruent',
		trial_id: 'stim'
	}
}, {
	image_url: 'images/rrrrr.png',
	data: {
		correct_response: head_left_keys,
		condition: 'oddball-congruent',
		trial_id: 'stim'
	}
}];
// define images
$.each(test_stimuli, function() {
  this.image = new Image();
  this.image.src = this.image_url
})
var practice_len = 5 //5
var exp_len = 25 //25
var practice_trials = jsPsych.randomization.repeat(test_stimuli, Math.ceil(practice_len / test_stimuli.length)).slice(0, practice_len);
var test_trials = jsPsych.randomization.repeat(test_stimuli, Math.ceil(exp_len / test_stimuli.length)).slice(0, exp_len);

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention_check"
	},
	timing_response: 180000,
	response_ends_trial: true,
	timing_post_trial: 200
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Кратко опишите, что вас просили сделать в этой задаче.</p>',
              '<p class = center-block-text style = "font-size: 20px">Есть ли у вас комментарии по поводу этой задачи?</p>'],
   rows: [15, 15],
   columns: [60,60]
};
/* define static blocks */
var feedback_instruct_text =
	'Добро пожаловать. Нажмите <strong>Enter</strong>, чтобы начать.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: "instruction"
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		"<div class = centerbox><p class = block-text>В этом эксперименте ты увидишь пять рыб в линию. Некоторые смотрят влево, а некоторые вправо. Тебе нужно покормить рыбу в середине ряда и для этого нужно отметить, в какую сторону смотрит рыбка.</p><p class = block-text>Поэтому, если ты видишь, что <strong>средняя</strong> рыба смотрит влево <img class='in-line-img' src='images/rrlrr.png' height='20' width='100'/>, нужно нажать клавишу «стрелка влево». Если <strong>средняя</strong> рыба смотрит вправо <img class='in-line-img' src='images/llrll.png' height='20' width='100'/>, нужно нажать кнопку «стрелка вправо».</p><p class = block-text>После каждого ответа ты будешь получать обратную связь о том, правильно ты определил направление или нет. Начнем с небольшой практики.</p></div>"
	],
	allow_keys: false,
	data: {
		trial_id: "instruction"
	},
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}

function compute_experiment_summary() {
  var trials = jsPsych.data.getTrialsOfType('poldrack-categorize');
  var count = 0;
  var sum_rt = 0;
  var correct_trial_count = 0;
  var correct_rt_count = 0;
  for (var i = 0; i < trials.length; i++) {
    var trial = trials[i]
    if(trial.exp_stage == "test") {
      count++;
      if(trial.correct == true) {
        correct_trial_count++;
        if(trial.rt > -1){
          sum_rt += trial.rt;
          correct_rt_count++;
        }
      }
    }
  }
  return {
    rt: Math.floor(sum_rt / correct_rt_count),
    accuracy: Math.floor(correct_trial_count / count * 100)
  }
}

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "end",
		exp_id: 'flanker'
	},
	text: function() {
    var data = compute_experiment_summary()
    return "<p>Вы ответили верно на "+data.accuracy+"%. " +
      "Ваше среднее время ответа, составило <strong>" + data.rt + "мс</strong>. Нажмите Enter для завершения "+
      "теста. Спасибо!</p>"
  },
	cont_key: [13],
	timing_post_trial: 0
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Закончим с практикой. Приступим к тестированию.</p><p class = center-block-text>Нажмите <strong>Enter</strong>, чтобы начать.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	data: {
		trial_id: "fixation"
	},
	choices: 'none',
	timing_stim: 500,
	timing_response: 500,
	timing_post_trial: 0,
	on_finish: changeData,
};

var outro_test_block = {
	type: 'poldrack-text',
	is_html: true,
	data: {
		trial_id: "test_outro"
	},
	timing_stim: 2000,
	timing_response: 2000,
	timing_post_trial: 0,
	text: '<div class = centerbox><div class="img-container"><img src="images/outro.jpg" alt="Молодец"></div></div>',
};

//Set up experiment
flanker_experiment = []
flanker_experiment.push(instruction_node);
for (i = 0; i < practice_len; i++) {
	flanker_experiment.push(fixation_block)
  var practice_trial = practice_trials[i]
	var practice_block = {
		type: 'poldrack-categorize',
		stimulus: practice_trial.image,
		key_answer: practice_trial.data.correct_response,
		correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Верно!</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Неверно</div></div>',
		timeout_message: '<div class = centerbox><div class = flanker-text>Отвечай быстрее</div></div>',
		choices: all_keys,
		data: practice_trial.data,
		timing_feedback_duration: 1000,
		show_stim_with_feedback: false,
		timing_response: 1500,
		timing_post_trial: 500,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: "practice"
			})
		}
	}
	flanker_experiment.push(practice_block)
}
flanker_experiment.push(attention_node)
flanker_experiment.push(start_test_block)

/* define test block */
for (i = 0; i < exp_len; i++) {
  var test_trial = test_trials[i];
	flanker_experiment.push(fixation_block)
	var test_block = {
		type: 'poldrack-categorize',
		stimulus: test_trial.image,
		key_answer: test_trial.data.correct_response,
		correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Верно!</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Неверно</div></div>',
		timeout_message: '<div class = centerbox><div class = flanker-text>Отвечай быстрее!</div></div>',
		choices: all_keys,
		data: test_trial.data,
		timing_feedback_duration: 1000,
		timing_response: 1500,
		show_stim_with_feedback: false,
		timing_post_trial: 500,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: "test"
			})
		}
	}
	flanker_experiment.push(test_block)
}
flanker_experiment.push(attention_node)
flanker_experiment.push(outro_test_block)
flanker_experiment.push(post_task_block)
flanker_experiment.push(end_block)
