module.exports = {
  apps: [
    {
      name: 'dua-me-backend',
      cwd: './backend',
      script: 'src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 4000 }
    }
  ]
};
