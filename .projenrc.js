const { cdk } = require('projen');
const project = new cdk.JsiiProject({
  author: 'Matthew Thomas',
  authorAddress: 'matthewthomasgb@gmail.com',
  defaultReleaseBranch: 'main',
  name: 'aws-ecs-fargate-service-projen-template',
  repositoryUrl: 'https://github.com/matthewthomasgb/aws-ecs-fargate-service-projen-template.git',
  deps: ['projen', 'fs-extra'],
  peerDeps: ['projen'],
  projenDevDependency: true,
  bundledDeps: ['@types/jest@27.4.1', 'fs-extra'],
  devDeps: ['@types/fs-extra@^8'],
  packageName: '@ma11hewthomas/aws-ecs-fargate-service-projen-template',
  npmAccess: 'public', 
});
project.synth();