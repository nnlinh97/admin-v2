module.exports = {
  apps : [{
    name: 'admin',
    script: './scripts/start.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : 'ec2-54-255-147-205.ap-southeast-1.compute.amazonaws.com',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/admin-v2',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
