# React Bike Rentals App

A full-featured Bike Rental application built with **React** as part of a professional technical evaluation. The app simulates a real-life bike rental platform with role-based access, filtering, and reservation logic.

## Features

### 🚲 Bike Management

- Each bike includes:
  - Model
  - Color
  - Location
  - Average Rating
  - Availability status

### 👤 Roles

#### Manager

- Create, Read, Update, and Delete (CRUD) bikes
- CRUD users and other managers
- View which users reserved which bikes and for how long
- View all reservations made by a particular user

#### User

- Sign up and log in to the platform
- View all available bikes for specific dates
- Filter bikes by model, color, location, and rating
- Reserve a bike for a selected period
- Cancel existing reservations
- Rate bikes (1 to 5 stars)

## Tech Stack

- **Frontend**: React
- **Authentication & Backend**: Firebase (or compatible backend with REST API design)

## Key Highlights

- Real-world architecture with role-based access
- Data-driven UI with dynamic filters and validations
- Clean state management and modular component design
- Responsive layout and intuitive UX prioritizing functionality over styling

---

> This project was completed as part of a technical evaluation and showcases my skills in building production-grade React applications with full CRUD functionality and user role management.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
