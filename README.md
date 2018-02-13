# README

[Instant Runoff Voting](http://github.com/cartland/instant-runoff "IRV")


Author: Chris Cartland

Date created: 2012-04-29

Last docs update: 2012-10-05


# What is instant-runoff voting?

Wikipedia describes IRV very well. http://en.wikipedia.org/wiki/Instant-runoff_voting

In this project, IRV is a method of electing one winner. Voters rank candidates in a Google Form and the administrator runs a script with Google Apps Script to determine the winner.

## Instant-runoff voting from the voters perspective

1. You get one vote that counts. It comes from your top choice that is still eligible.
2. If a candidate gets a majority of votes, then that candidate wins.
3. If no candidate has majority of all votes, then the candidate with the least votes is removed.
4. If your top choice is removed, the next eligible candidate on your list gets a vote. The process repeats until there is a winner.

_Notes about algorithm_

* Majority means more than half of all votes. Example: candidate A gets 3 votes and candidates B, C, and D each get 1 vote. Candidate A does not have majority because 3 is not more than half of 6.
* If multiple candidates tie for least votes, then all are removed.
* It is possible that multiple candidates tie for first place, in which case the vote ends in a tie.

# Example
* [Example Spreadsheet](https://drive.google.com/open?id=1U-3sqm-SVf9kWd6mCaBNodlZWsQRT1o___9ZgUGPeD0)
* [Example Form](https://docs.google.com/forms/d/1rk46UVf-6s_jmY-NVXToq4DYwy17Pwspuif9bYYTz7w/viewform?edit_requested=true)

![Example Spreadsheet Screenshot](ExampleSpreadsheet.png)

![Example Form Screenshot](ExampleForm.png)

# Steps to run an election

Steps to run an election.
* Go to Google Drive. Create a new Google Form.
* Create questions according to instructions on GitHub -- https://github.com/cartland/instant-runoff
* From the form spreadsheet go to "Tools" -> "Script Editor..."
* Copy the code from instant-runoff.gs into the editor.
* Configure settings in the editor and match the settings with the names of your sheets.
* From the form spreadsheet go to "Instant Runoff" -> "Setup".
    * If this is not an option, run the function setup_instant_runoff() directly from the Script Editor.
* Create keys in the sheet named "Keys".
* Send out the live form for voting. If you are using keys, don't forget to distribute unique secret keys to voters.
* From the form spreadsheet go to "Instant Runoff" -> "Run".
    * If this is not an option, run the function run_instant_runoff() directly from the Script Editor.

# How to administer example election

* Go to Google Drive. Create a new Google Form.

    * https://drive.google.com
    
* Create questions according to instructions on GitHub -- https://github.com/cartland/instant-runoff

**Edit Form**

Create a title that tells voters what they are voting for.

    * Question 1 - "Secret Key", "", Text, Required
    * Question 2 - "Choice 1", "", Text, Required
    * Question 3 - "Choice 2", "", Text, Not Required
    * Question 4 - "Choice 3", "", Text, Not Required
    * Question 5 - "Choice 4", "", Text, Not Required

Create the maximum number of choices that voters can submit.

_Notes about editing questions_

    * The order that you create form questions matters. Google Forms do not allow you to move around columns, so it's best just to do this right from the beginning.
    * If you mess up it is possible to cleverly modify the questions, but it's usually time consuming and easier to start from scratch.
    * The choices must be the last questions in the form. This also means you can ask any number of questions before IRV as long as you update the settings.
    * None of the column names matter.

* From the form spreadsheet go to "Tools" -> "Script Editor..."
Go to the spreadsheet from the editor by clicking the dropdown "See responses" and clicking "Spreadsheet". "Tools" is on the top bar.
* Copy the code from instant-runoff.gs into the editor.
Save the project (may need to create a project name). 
* Configure settings in the editor and match the settings with the names of your sheets.
The settings in instant-runoff.gs should already match the example names in this README.
* From the form spreadsheet go to "Instant Runoff" -> "Setup".
    * If this is not an option, run the function setup_instant_runoff() directly from the Script Editor.
* Create keys in the sheet named "Keys".
    * A2, "secretkey1"
    * A3, "secretkey2"
    * A4, "secretkey3"
    * A5, "secretkey4"
    * A6, "secretkey5"

    *Add at least enough keys to accommodate each voter.

* Send out the live form for voting. If you are using keys, don't forget to distribute unique secret keys.
    * Find the live form under Form -> Go to live form.
* From the form spreadsheet go to "Instant Runoff" -> "Run".
    * If this is not an option, run the function run_instant_runoff() directly from the Script Editor.

# Settings

Found in [instant-runoff.gs](https://github.com/cartland/instant-runoff/blob/master/instant-runoff.gs)

* VOTE\_SHEET\_NAME must match the name of sheet containing votes. "Sheet1" will work for unmodified form sheets. The example uses "Votes".
* BASE\_ROW defines which row to contains the first voting information. Set this to 2.
* BASE\_COLUMN is the column number for the first choice. In the example the first choice is in column C, so set this to 3.
* USING\_KEYS = true if you want to use keys. The example uses keys so this is set to true.
* VOTE\_SHEET\_KEYS\_COLUMN specifies which form column contains voter submitted keys in the VOTE_SHEET. In the example the secret keys are in column B, so set this to 2.
* KEYS\_SHEET\_NAME is the name of the sheet containing the master list of valid voting keys. The examples calls this "Keys".
* USED\_KEYS\_SHEET\_NAME is the name of the sheet where used keys are recorded. The example calls this "Used Keys".

# Global Variables

* NUM\_COLUMNS is the maximum number of choices. As of October 10, 2012, the software figures this out based on the first row of the voting sheet.
