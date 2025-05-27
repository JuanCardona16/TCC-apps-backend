import { build, type BuildOptions } from 'esbuild';
import { copyFileSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// 👉 Tipado fuerte para la configuración
interface BuildConfig extends BuildOptions {
  external: string[];
  define: Record<string, string>;
}

// Define __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 👉 Configuración con alias (solo para desarrollo)
const aliasPlugin = {
  name: 'alias',
  setup(build) {
    const aliasPath = path.resolve(__dirname, 'src'); // Alias para la carpeta src
    build.onResolve({ filter: /^@\// }, (args) => ({
      path: path.join(aliasPath, args.path.slice(2)), // Resuelve rutas que comienzan con "@/”
    }));
  },
};

// 👉 Configuración de producción
const productionConfig: BuildConfig = {
  entryPoints: ['./src/core/index.ts'],
  outfile: './dist/index.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  sourcemap: false,
  minify: true,
  treeShaking: true,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  format: 'esm',
  external: [
    'express',
    'mongoose',
    'mongodb',
    '@mapbox/node-pre-gyp',
    'aws-sdk',
    'mock-aws-s3',
    'nock',
    'bcrypt',
    'jsonwebtoken',
    'cors',
    'helmet',
    'winston',
  ],
  loader: {
    '.html': 'text',
    '.ejs': 'text',
    '.ts': 'ts',
  },
  tsconfig: './tsconfig.json',
  logLevel: 'info',
  metafile: true,
  banner: {
    js: `import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);`,
  },
  resolveExtensions: ['.ts', '.js'], // Resuelve extensiones automáticamente
  plugins: process.env.NODE_ENV === 'development' ? [aliasPlugin] : [], // Aplica alias solo en desarrollo
};

// 👉 Función para copiar archivos de producción
const copyProductionFiles = (): void => {
  const filesToCopy: [string, string][] = [
    ['./package.json', './dist/package.json'],
    ['./.env.production', './dist/.env'],
    ['./src/types/*', './dist/types/'],
  ];

  filesToCopy.forEach(([origin, dest]) => {
    try {
      copyFileSync(origin, dest);
    } catch (err) {
      console.warn(`⚠️ No se pudo copiar ${origin} a ${dest}:`, (err as Error).message);
    }
  });
};

// 👉 Ejecución del build con manejo de errores tipado
build(productionConfig)
  .then(() => {
    console.log('✅ Build completado');
    copyProductionFiles();
  })
  .catch((err: Error) => {
    console.error('❌ Error en el build:', err.message);
    process.exit(1);
  });
