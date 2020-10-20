# Experiment Factory Experiment

Hi Friend! This is an Experiment that is friendly for use in the [Experiment Factory](https://expfactory.github.io/expfactory). You can run it locally by putting these files in a web server, or use the Experiment Factory to generate a reproducible container. Check out the documentation above for more information, or [post an issue](https://www.github.com/expfactory/expfactory/issues) if you have any questions.

![https://expfactory.github.io/expfactory/img/expfactoryticketyellow.png](https://expfactory.github.io/expfactory/img/expfactoryticketyellow.png)


## Want to run this offline?

1. [Download Mongoose](https://cesanta.com/binary.html) - its a web server that runs anything in the same folder. Look at "Free edition". NB: If you already have something on your computer running on port 8080 you may need to change it. Create a shortcut to mongoose and change the parameters when it runs to ` -listening_port 8181` for example
2. [Download this project](https://codeload.github.com/AceCentre/flanker-children/zip/master) - and save the folder in the same folder as Mongoose
3. Open your web browser and go to http://localhost:8080 (or http://localhost:8181 if you have changed it) and navigate to the flanker folder in the web browser.

## What does all the columns mean?

- rt: Reaction Time in ms
- key_press: Which key was pressed. 37: Left. 39: Right. -1: No key was pressed.
- block_duration: the time period of the block. Note for our test its 1500 (ms) when the fish are shown. the fixation period in between is 500. 
- trial_id: One of three things; "fixation": the bit where the cross is shown. "stim": the bit where the user selects the fish direction (the test) and "instruction": the instructional text
- trial_type: poldrack-text/instructions (instructions), poldrack-single-stim = fixation and poldrack-categorize = the test - Trial_index: the number. It allows you to graph these if you so wish
- time_elapsed: total time elapsed.
- internal_node_id: not that useful. Its what the screen was in the software.
- exp_id: all flanker (some exp js tests can have multiple tests in one output)
- full_screen: True: yes false: no
- condition: these terms relate to the images. There are 4 different conditions. See [here](https://github.com/AceCentre/flanker-children/blob/master/experiment.js#L60 ) (and the images [here](https://github.com/AceCentre/flanker-children/tree/master/images)). For more information on what all this *actually* means in regards to attention and interference [read this](http://dx.doi.org/10.1016/j.neuropsychologia.2014.10.002).

   standard-incogruent ![oddballi](https://raw.githubusercontent.com/AceCentre/flanker-children/master/images/llrll.png)

   oddball-incogruent ![standardi](https://raw.githubusercontent.com/AceCentre/flanker-children/master/images/rrlrr.png)

   oddball-congruent: ![standardc](https://raw.githubusercontent.com/AceCentre/flanker-children/master/images/rrrrr.png)

   standard-congruent: ![oddballc](https://raw.githubusercontent.com/AceCentre/flanker-children/master/images/lllll.png)

