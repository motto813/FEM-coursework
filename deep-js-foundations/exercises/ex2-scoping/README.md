# Exercise 2

1. This exercise is a work-log (aka timesheet) application. Run the fixed version of the exercise ("ex2-fixed.html") in your browser and play around to see the expected behavior.

2. For this exercise, you should only need to make changes to "ex2.js", not the HTML or CSS. You should not need to create new functions or reorganize significant chunks of code for this exercise; only a few spot changes and a few lines of code are necessary.

3. There are several things that can be improved in "ex2.js", including:

	- are there anonymous function expressions which could be improved with a lexical name?
	- are there usages of `var` which are more appropriate to be declared with `let` or `const`? Do any literal values need to be made into `const`ant declarations?
	- should certain variable declarations be contained in explicit blocks of scope?

4. **BONUS:** How would you describe to a coworker or boss the improvements in readability after applying your knowledge of scoped declarations to this code? Write out a few sentences.

    - Using the block scope where the projectId is saved to the project entry object lets the reader know that the projectId indeed just has that purpose.
    - Using consts for the literal values tells the reader what the literal value means when it occurs in the code.  Consts for the html templates makes sense as they are strings and shouldn't ever change.
    - Using the block scope for handleClick makes it obvious where it's used in initUI.  Naming the callback function for handleClick describes exactly what it's doing.
