# Dex - Fast Express Backend Scaffolding CLI

<p align="center">
  <img src="https://res.cloudinary.com/dzeuvnjmh/image/upload/v1765869170/dex_xcmsl0.png" alt="Dex Logo" width="200">
</p>

<p align="center">
  <strong>A fast CLI tool to scaffold Express.js backend projects with TypeScript or JavaScript</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Package_Managers-npm%20%7C%20pnpm%20%7C%20yarn%20%7C%20bun-CB3837?logo=npm&logoColor=white" alt="Package Managers">
</p>

---

## Features

### **Instant Project Setup**

- Interactive CLI prompts for project configuration
- Choose between **JavaScript** or **TypeScript**
- Optional **MongoDB with Mongoose** integration
- Support for **npm, pnpm, yarn, and bun** package managers

### **Smart Configuration**

- Pre-configured Express server with best practices
- CORS and body parsing middleware included
- Environment variable management with `.env` files
- Dynamic MongoDB connection strings based on project name

### **Production-Ready Structure**

- Clean, organized project structure
- Separate database configuration files
- Ready-to-use server entry point
- Proper `.gitignore` configuration

### **Developer Experience**

- Fast development server with `nodemon` (like Vite for backend!)
- TypeScript support with proper configuration
- Automatic dependency installation
- Clear next-steps instructions after setup

### **Not a Framework**

Dex is a **scaffolding tool**, not a framework. It generates a clean Express.js project with sensible defaults, giving you full control over your code without any lock-in or abstraction layers.

---

## Prerequisites

- **Node.js** 18 or higher
- **npm**, **pnpm**, **yarn**, or **bun** (your choice!)

---

## Quick Start

```bash
npm create express-dex

or

npx create-express-dex
```

That's it! The CLI will guide you through the setup process.

## Usage

When you run `npm create express-dex`, you'll be prompted with the following questions:

1. **Project Name**: Enter your project name (default: `my-dex-project`)
2. **Language**: Choose between `JavaScript` or `TypeScript`
3. **Package Manager**: Select `npm`, `pnpm`, `yarn`, or `bun`
4. **MongoDB**: Choose whether to include MongoDB with Mongoose

### Example Session

```bash
$ npm create express-dex

Welcome to Dex!

██████╗ ███████╗██╗  ██╗
██╔══██╗██╔════╝╚██╗██╔╝
██║  ██║█████╗   ╚███╔╝
██║  ██║██╔══╝   ██╔██╗
██████╔╝███████╗██╔╝ ██╗
╚═════╝ ╚══════╝╚═╝  ╚═╝

? What is the name of your project? : my-awesome-api
? Which language do you want to use? TypeScript
? Which package manager do you want to use? npm
? Do you want to use MongoDB with Mongoose? Yes

Scaffolding project in /path/to/my-awesome-api...
Setting up MongoDB...
Installing dependencies...

Success! Created my-awesome-api at /path/to/my-awesome-api

Inside that directory, you can run:

  npm run dev
    Starts the development server.

We suggest that you begin by typing:

  cd my-awesome-api
  npm run dev
```

---

## Generated Project Structure

### JavaScript Project

```
my-project/
├── src/
│   ├── db/              # MongoDB connection (if selected)
│   │   └── index.js
│   └── server.js        # Express server entry point
├── .env                 # Environment variables
├── .gitignore
├── package.json
```

### TypeScript Project

```
my-project/
├── src/
│   ├── db/              # MongoDB connection (if selected)
│   │   └── index.ts
│   └── server.ts        # Express server entry point
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Environment Variables

Dex automatically generates a `.env` file with the following variables:

### Without MongoDB

```env
PORT=5000
CORS_ORIGIN=*
```

### With MongoDB

```env
PORT=5000
CORS_ORIGIN=*
MONGODB_URI=mongodb://localhost:27017/my-project
```

---

## Package Manager Support

Dex supports all major package managers:

| Package Manager | Installation Command | Run Dev Server |
| --------------- | -------------------- | -------------- |
| **npm**         | `npm install`        | `npm run dev`  |
| **pnpm**        | `pnpm install`       | `pnpm run dev` |
| **yarn**        | `yarn`               | `yarn run dev` |
| **bun**         | `bun install`        | `bun run dev`  |

The CLI will automatically use your selected package manager for installation and display the correct commands in the success message.

---

### Project Structure (CLI Source)

```
dex/
├── src/
│   └── index.ts         # Main CLI logic
├── templates/
│   ├── js/              # JavaScript templates
│   │   ├── src/
│   │   ├── package.json
│   │   └── _gitignore
│   └── ts/              # TypeScript templates
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── _gitignore
├── bin/
│   └── index.js         # Compiled output
├── package.json
└── tsconfig.json
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">
  Made with ❤️ by the Viraj :)
</p>
