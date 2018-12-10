module.exports = {
  apps : [{
    name      : 'Web App',
    script    : './build/server/index.js',
    cwd: '/home/coinstats/web-app-ssr/',
    env: {
      NODE_ENV: 'development',
      PORT: 1337,
    },
    env_production : {
      NODE_ENV: 'production',
      PORT: 3030,
    },
  }],

  deploy : {
    development : {
      key  : './keys/coin-stats-development.pem',
      user : 'coinstats',
      host : 'ec2-34-219-107-132.us-west-2.compute.amazonaws.com',
      ref  : 'origin/development',
      repo : 'git@bitbucket.org:inomma/coin-stats-react-ssr.git',
      path : '/home/coinstats/web-app-ssr/',
      'post-deploy' : 'git submodule update --init --recursive && npm install && npm run build:dev && pm2 reload ecosystem.config.js --env development'
    },
    production : {
      key  : './keys/coin-stats.pem',
      user : 'coinstats',
      host : 'ec2-52-24-134-234.us-west-2.compute.amazonaws.com',
      ref  : 'origin/master',
      repo : 'git@bitbucket.org:inomma/coin-stats-react-ssr.git',
      path : '/home/coinstats/web-app-ssr/',
      'post-deploy' : 'git submodule update --init --recursive && npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
