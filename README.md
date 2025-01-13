# Personal Portfolio Project

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Contact](#contact)

## Introduction

This is a personal portfolio project built as a monorepo. It is a solution to [the 'Odin Book' project](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book) from [The Odin Project curriculum.](https://www.theodinproject.com) It includes a React-based frontend and a Node.js-based backend. The project showcases my skills and abilities for full-stack development.

This project's frontend is deployed on Netlify, and its backend is deployed on Railway.

[**See live preview here.**](https://castordisaster-odin-book.netlify.app)

## Features

- Responsive design
- Interactive UI
- RESTful API
- Authentication and Authorization
- Project showcase
- Contact form

## Technologies Used

### Frontend

- React
- React Router
- CSS
- Fetch API
- Netlify

### Backend

- Node.js
- Express
- PostgreSQL
- JWT
- Prisma ORM
- Railway

## Installation

1. Clone the repository:

```sh
git clone https://github.com:Neo319/ODIN-BOOK.git
```

2. Navigate to the project directory:

```sh
cd odin-book
```

3. Install dependencies for both frontend and backend:

```sh
npm install
cd ./docs/project-odin-book
npm install
cd ../Backend_App
npm install
```

## Usage

1. Start the backend server:

```sh
cd Backend_App
npm start
```

2. Start the frontend development server:

```sh
cd ../docs/project-odin-book
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
your-repo-name/
├── docs/
│   ├── project-odin-book/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── App.js
│   │   │   ├── components/
│   │   │   ├── routes/
│   │   │   └── routes/
│   │   └── package.json
│   └── ...
└── ...

├── Backend_App/
│   ├── controllers/
│   ├── prisma/
│   ├── routes/
│   ├── package.json
│   └── ...
├── package.json
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

- Email: alexmnevins@gmail.com
- LinkedIn: [Alex Nevins](https://www.linkedin.com/in/alex-nevins-489488282/)
