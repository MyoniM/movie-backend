import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

const file = fs.readFileSync('./swagger.yml', 'utf8');
const swaggerSpec = YAML.parse(file);

function swaggerDocs(app: Express) {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Docs in Json format
  app.get('docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
