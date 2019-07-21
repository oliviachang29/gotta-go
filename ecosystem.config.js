module.exports = {
  apps: [{
    name: 'gotta-go',
    script: './server.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-184-73-67-34.compute-1.amazonaws.com',
      key: '~/.ssh/gotta-go.pem',
      ref: 'origin/master',
      repo: 'git@github.com:oliviachang29/gotta-go.git',
      path: '/home/ubuntu/gotta-go',
      'post-deploy': 'yarn && pm2 startOrRestart ecosystem.config.js'
    }
  }
}