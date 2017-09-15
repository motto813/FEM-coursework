# Exercise 3

1. This exercise is a work-log (aka timesheet) application. Run the fixed version of the exercise ("ex3-fixed.html") in your browser and play around to see the expected behavior.

2. For this exercise, you should only need to make changes to "ex3.js", not the HTML or CSS. You should only need to do minor reorganization of code for this exercise.

3. There are several things that can be improved in "ex3.js", including:

	- are there function expressions that should be function declarations instead?
	- can function hoisting be leveraged to improve readability by relocating executable code?

4. **BONUS:** How would you describe to a coworker or boss the improvements in readability after applying your knowledge of hoisting to this code? Write out a few sentences.

    - Handle click is now a function declaration, which hoists it and allows it to be called earlier in the init UI function where a reader is likelier to see it sooner.  The part of handle click that submits the work entry is wrapped in a nested function declaration which separates concerns nicely and makes it easy for a reader to see when that is getting called.
    - MODIFIED: moved handle click function out of init UI scope, no reason for it to be there.  
