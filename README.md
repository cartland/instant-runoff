# README  

[Instant Runoff Voting](http://github.com/cartland/instant-runoff "IRV").   


Author: Chris Cartland   
Date created: 2012-04-29   
Last update: 2012-06-01   


To be used with Google Apps Script and Google Spreadsheets.   


1. Create a new Google Form.   
2. Create questions as defined in "Voting Form".   
3. From the form spreadsheet go to "Tools" -> "Script Editor..."   
4. Copy the code from instant-runoff.js into the editor.   
5. Configure settings in the editor and match the spreadsheet names with the settings.   


# Voting Form #

The order that you create form questions matters. Google Forms do not allow you to move around columns, so it's best just to do this right from the beginning.   

_Note: If you mess up it is possible to cleverly modify the questions, but it's usually time consuming and easier to start from scratch._  

* The choices must be the last questions in the form.  
* None of the column names matter.  

## Example - Allow 4 choices and use secret keys  

### Edit Form  

* Question 1 - "Secret Key", "", Text, Required
* Question 2 - "Choice 1", "", Text, Required
* Question 3 - "Choice 2", "", Text, Not Required
* Question 4 - "Choice 3", "", Text, Not Required
* Question 5 - "Choice 4", "", Text, Not Required

### Sheet  

* A1, Column=1, "Timestamp"
* B1, Column=2, "Secret Key"
* C1, Column=3, "Choice 1"
* D1, Column=4, "Choice 2"
* E1, Column=5, "Choice 3"
* F1, Column=6, "Choice 4"


# Vote Settings  

Found in [instant-runoff.js](https://github.com/cartland/instant-runoff/blob/master/instant-runoff.js "instant-runoff.js")  

* VOTE\_SHEET must match the name of sheet containing votes ("Sheet1" will work by default)  
* BASE\_ROW = 2  
* BASE\_COLUMN is the column number for the first choice ('3', "Choice 1" in the example)  
* NUM\_COLUMNS is the maximum number of choices ('4' in the example)  


# Key Settings  

* USING\_KEY = true if you want to use keys  
* KEYS\_SHEET is the name of the sheet containing the master list of valid voting keys
* KEY\_COLUMN specifies which form column contains voter submitted keys ('2' in the example)
* KEYS\_USED\_SHEET is the name of the sheet where used keys are recorded



