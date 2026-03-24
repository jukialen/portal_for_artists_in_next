'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { Json } from 'types/database.types';

interface SwaggerUIClientProps {
  spec: Json;
}

export default function SwaggerUIClient({ spec }: SwaggerUIClientProps) {
  return <SwaggerUI spec={spec} defaultModelsExpandDepth={1} />;
}
