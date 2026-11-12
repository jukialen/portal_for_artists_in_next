'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerUIClientProps {
  spec?: string | object | undefined;
}

export default function SwaggerUIClient({ spec }: SwaggerUIClientProps) {
  return <SwaggerUI spec={spec} defaultModelsExpandDepth={1} />;
}
