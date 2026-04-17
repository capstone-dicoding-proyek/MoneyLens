import fs from "fs";
import path from "path";

const Path = process.cwd();
 const basePath = path.join(Path,"src/services");
const name = process.argv[2];
const withValidator = process.argv.includes("--validator");

if (!name) {
  console.log("Contoh: node generate.js tes --validator");
  process.exit(1);
}

const moduleName = name.toLowerCase();
const modulePath = path.join(basePath, moduleName);

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log("📁", dir);
  }
}

function createFile(file, content) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
    console.log("📄", file);
  }
}

createDir(modulePath);

const controllerDir = path.join(modulePath, "controller");
const routesDir = path.join(modulePath, "routes");
const repoDir = path.join(modulePath, "repository");

createDir(controllerDir);
createDir(routesDir);
createDir(repoDir);


let validatorDir;
if (withValidator) {
  validatorDir = path.join(modulePath, "validator");
  createDir(validatorDir);
}


createFile(
  path.join(repoDir, `${moduleName}.repository.js`),
  `
import DatabasePool from '../../../databases/database-pool.js';
export class ${capitalize(moduleName)}Repository extends DatabasePool {
  

}
export default ${capitalize(moduleName)}Repository;
`
);


createFile(
  path.join(controllerDir, `${moduleName}.controller.js`),
  `import { ${capitalize(moduleName)}Repository } from '../repository/${moduleName}.repository.js';

const ${moduleName}Repository = new ${capitalize(moduleName)}Repository();

`
);

// validator 
if (withValidator) {
  createFile(
    path.join(validatorDir, `${moduleName}.validator.js`),
    `
import Joi from 'joi';
export const ${moduleName}Validator = Joi.object({
});
`
  );
}

// routes
createFile(
  path.join(routesDir, `${moduleName}.routes.js`),
  `import express from "express";
${withValidator ? `import { ${moduleName}Validator } from '../validator/${moduleName}.validator.js';` : ''}

const router = express.Router();

export default router;
`
);


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log("✅ Module generated:", moduleName);