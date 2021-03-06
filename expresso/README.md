# Expresso

<!-- a href = "./public/index.html">Click me!</a> for preview of the project. It will not work until you host it on a server locally or remotely.-->

## How to Run
1. Download the project
2. Make sure you have node pre installed on your pc.
3. Open command prompt and change your directory to the expresso folder Ex: "E:/Project/Expresso/"
4. Run command "npm install" to install all the depenedencies required for the project.
5. Install some side packages "npm install body-parser", "npm install morgan", "npm install errorhandler" and "npm install mocha".
6. If sqlite3 gives any error try to update it to the latest version in your pc.
7. Run command "node migration.js" to create the database and required table for the project
8. Run command "node seed.js" to intialize your database.
9. To run the project, enter "npm start" or "node server.js". This will prompt you to the port where server is listening.
10. If it uses port 4000 then open your browser and go to "http://localhost:4000/"

If you want to take a feel of the project open "index.html" in the public directory. It will not show any functionality until the project is started on a server.

## Project Overview

The Expresso internal tool allow users to:
- Create, view, update, and delete menus
- Create, view, update, and delete menu items
- Create, view, update, and delete employees
- Create, view, update, and delete employee's timesheets

## Implementation Details

To complete this project, you will need to create the database tables and API routes specified below.

To test this functionality you can run the testing suite and interact with the API via the provided front-end. If you want more data to interact with in the front-end, you can run the **seed.js** file to add data to your database.

We've provided an empty **migration.js** file for you to write table creation logic in.

In order for the tests and provided front-end to run properly, you will need to make sure to:
- Create and export your Express app from a root-level file called **server.js**
- Accept and set an optional port argument for your server to listen on from `process.env.PORT`
- If `process.env.PORT` is not set, server should run on port `4000` (this is where the provided front-end will make requests to)
- Accept and set an optional database file argument from `process.env.TEST_DATABASE` in all Express route files that open and modify your database
- Use the root-level **database.sqlite** as your API's database
- **Note:** When loading **database.sqlite** in your JavaScript files, sqlite3 will always try to load **database.sqlite** from the root directory path, `./database.sqlite`, regardless of where the current file is located. Therefore your code will always be `new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')` regardless of the file you are writing in 

### Database Table Properties

* **Employee**
  - id - Integer, primary key, required
  - name - Text, required
  - position - Text, required
  - wage - Integer, required
  - is_current_employee - Integer, defaults to `1`

* **Timesheet**
  - id - Integer, primary key, required
  - hours - Integer, required
  - rate - Integer, required
  - date - Integer, required
  - employee_id - Integer, foreign key, required

* **Menu**
  - id - Integer, primary key, required
  - title - Text, required

* **MenuItem**
  - id - Integer, primary key, required
  - name - Text, required
  - description - Text, optional
  - inventory - Integer, required
  - price - Integer, required
  - menu_id - Integer, foreign key, required

### Route Paths and Functionality

**/api/employees**
- GET
  - Returns a 200 response containing all saved currently-employed employees (`is_current_employee` is equal to `1`) on the `employees` property of the response body
- POST
  - Creates a new employee with the information from the `employee` property of the request body and saves it to the database. Returns a 201 response with the newly-created employee on the `employee` property of the response body
  - If any required fields are missing, returns a 400 response

**/api/employees/:employeeId**
- GET
  - Returns a 200 response containing the employee with the supplied employee ID on the `employee` property of the response body
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
- PUT
  - Updates the employee with the specified employee ID using the information from the `employee` property of the request body and saves it to the database. Returns a 200 response with the updated employee on the `employee` property of the response body
  - If any required fields are missing, returns a 400 response
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
- DELETE
  - Updates the employee with the specified employee ID to be unemployed (`is_current_employee` equal to `0`). Returns a 200 response.
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response

**/api/employees/:employeeId/timesheets**
- GET
  - Returns a 200 response containing all saved timesheets related to the employee with the supplied employee ID on the `timesheets` property of the response body
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
- POST
  - Creates a new timesheet, related to the employee with the supplied employee ID, with the information from the `timesheet` property of the request body and saves it to the database. Returns a 201 response with the newly-created timesheet on the `timesheet` property of the response body
  - If any required fields are missing, returns a 400 response
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response

**/api/employees/:employeeId/timesheets/:timesheetId**
- PUT
  - Updates the timesheet with the specified timesheet ID using the information from the `timesheet` property of the request body and saves it to the database. Returns a 200 response with the updated timesheet on the `timesheet` property of the response body
  - If any required fields are missing, returns a 400 response
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
  - If an timesheet with the supplied timesheet ID doesn't exist, returns a 404 response
- DELETE
  - Deletes the timesheet with the supplied timesheet ID from the database. Returns a 204 response.
  - If an employee with the supplied employee ID doesn't exist, returns a 404 response
  - If an timesheet with the supplied timesheet ID doesn't exist, returns a 404 response

**/api/menus**
- GET
  - Returns a 200 response containing all saved menus on the `menus` property of the response body
- POST
  - Creates a new menu with the information from the `menu` property of the request body and saves it to the database. Returns a 201 response with the newly-created menu on the `menu` property of the response body
  - If any required fields are missing, returns a 400 response

**/api/menus/:menuId**
- GET
  - Returns a 200 response containing the menu with the supplied menu ID on the `menu` property of the response body
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
- PUT
  - Updates the menu with the specified menu ID using the information from the `menu` property of the request body and saves it to the database. Returns a 200 response with the updated menu on the `menu` property of the response body
  - If any required fields are missing, returns a 400 response
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
- DELETE
  - Deletes the menu with the supplied menu ID from the database if that menu has no related menu items. Returns a 204 response.
  - If the menu with the supplied menu ID has related menu items, returns a 400 response.
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response

**/api/menus/:menuId/menu-items**
- GET
  - Returns a 200 response containing all saved menu items related to the menu with the supplied menu ID on the `menu items` property of the response body
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
- POST
  - Creates a new menu item, related to the menu with the supplied menu ID, with the information from the `menuItem` property of the request body and saves it to the database. Returns a 201 response with the newly-created menu item on the `menuItem` property of the response body
  - If any required fields are missing, returns a 400 response
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response

**/api/menus/:menuId/menu-items/:menuItemId**
- PUT
  - Updates the menu item with the specified menu item ID using the information from the `menuItem` property of the request body and saves it to the database. Returns a 200 response with the updated menu item on the `menuItem` property of the response body
  - If any required fields are missing, returns a 400 response
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
  - If a menu item with the supplied menu item ID doesn't exist, returns a 404 response
- DELETE
  - Deletes the menu item with the supplied menu item ID from the database. Returns a 204 response.
  - If a menu with the supplied menu ID doesn't exist, returns a 404 response
  - If a menu item with the supplied menu item ID doesn't exist, returns a 404 response
