import YAML from 'js-yaml';
import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const swaggerPath = join(process.cwd(), 'src/app/api/swagger.yaml');
    const fileContent = await fs.readFile(swaggerPath, 'utf8');
    const swaggerSpec = YAML.load(fileContent);

    return Response.json(swaggerSpec, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  } catch (error) {
    console.error('Error loading Swagger spec:', error);
    return Response.json(
      { error: 'Failed to load API documentation' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
