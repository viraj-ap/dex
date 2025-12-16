#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
  const logo = `
██████╗ ███████╗██╗  ██╗
██╔══██╗██╔════╝╚██╗██╔╝
██║  ██║█████╗   ╚███╔╝ 
██║  ██║██╔══╝   ██╔██╗ 
██████╔╝███████╗██╔╝ ██╗
╚═════╝ ╚══════╝╚═╝  ╚═╝
`;
  console.log(chalk.bold.cyan("Welcome to Dex!"));
  console.log(chalk.bold.cyan(logo));

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is the name of your project? :",
      default: "my-dex-project",
      validate: (input: string) => {
        if (/^([a-z0-9\-\_\.]+)$/.test(input)) return true;
        return "Project name may only include lower-case letters, numbers, hashes, dots and underscores.";
      },
    },
    {
      type: "list",
      name: "language",
      message: "Which language do you want to use?",
      choices: ["JavaScript", "TypeScript"],
      default: "JavaScript",
    },
    {
      type: "list",
      name: "packageManager",
      message: "Which package manager do you want to use?",
      choices: ["npm", "pnpm", "yarn", "bun"],
      default: "npm",
    },
    {
      type: "confirm",
      name: "useMongo",
      message: "Do you want to use MongoDB with Mongoose?",
      default: false,
    },
  ]);

  const { projectName, language, useMongo, packageManager } = answers;
  const targetDir = path.join(process.cwd(), projectName);
  const templateName = language === "TypeScript" ? "ts" : "js";
  const templateDir = path.join(__dirname, "..", "templates", templateName);

  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`Directory ${projectName} already exists!`));
    process.exit(1);
  }

  console.log(chalk.blue(`\nScaffolding project in ${targetDir}...`));

  // Copy template
  try {
    await fs.copy(templateDir, targetDir);

    if (await fs.pathExists(path.join(targetDir, "_gitignore"))) {
      await fs.move(
        path.join(targetDir, "_gitignore"),
        path.join(targetDir, ".gitignore")
      );
    }
  } catch (err) {
    console.error(chalk.red("Error copying template files:"), err);
    process.exit(1);
  }

  // Handle MongoDB logic
  if (useMongo) {
    console.log(chalk.blue("Setting up MongoDB..."));
    const dbFileExt = language === "TypeScript" ? "ts" : "js";
    const dbPath = path.join(targetDir, "src", "db", `index.${dbFileExt}`);

    const dbCode =
      language === "TypeScript"
        ? `import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(\`\${process.env.MONGODB_URI}\`);
        console.log(\`MongoDB connected successfully!\`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDB;`
        : `import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(\`\${process.env.MONGODB_URI}\`);
        console.log(\`MongoDB connected successfully!\`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDB;`;

    await fs.outputFile(dbPath, dbCode);

    const serverFile = path.join(targetDir, "src", `server.${dbFileExt}`);
    const serverCode =
      language === "TypeScript"
        ? `import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
});

const app: Express = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

// routes declaration

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(\`Server running on port \${process.env.PORT || 5000}\`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed! ", err);
});`
        : `import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
});

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

// routes declaration


connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(\`Server running on port \${process.env.PORT || 5000}\`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});`;

    await fs.outputFile(serverFile, serverCode);
  }

  const pkgJsonPath = path.join(targetDir, "package.json");
  const pkgJson = await fs.readJson(pkgJsonPath);

  pkgJson.name = projectName;

  if (useMongo) {
    console.log(chalk.blue("Adding mongoose..."));
    pkgJson.dependencies = pkgJson.dependencies || {};
    pkgJson.dependencies.mongoose = "^8.0.0";
  }

  await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 2 });

  // Generate .env file dynamically
  const envContent = [
    "PORT=5000",
    "CORS_ORIGIN=*",
    useMongo ? `MONGODB_URI=mongodb://localhost:27017/${projectName}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await fs.outputFile(path.join(targetDir, ".env"), envContent);

  console.log(chalk.blue("Installing dependencies..."));
  try {
    const installCommand =
      packageManager === "yarn" ? "yarn" : `${packageManager} install`;
    execSync(installCommand, { stdio: "inherit", cwd: targetDir });
  } catch (err) {
    console.error(chalk.red("Error installing dependencies."), err);
  }

  console.log(chalk.green(`\nSuccess! Created ${projectName} at ${targetDir}`));
  console.log("\nInside that directory, you can run:");
  console.log(`\n  ${chalk.cyan(`${packageManager} run dev`)}`);
  console.log("    Starts the development server.");
  console.log("\nWe suggest that you begin by typing:");
  console.log(`\n  ${chalk.cyan("cd")} ${projectName}`);
  console.log(`  ${chalk.cyan(`${packageManager} run dev`)}`);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
