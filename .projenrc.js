const { cdk } = require('projen');
const project = new cdk.JsiiProject({
  author: 'Matthew Thomas',
  authorAddress: 'matthewthomasgb@gmail.com',
  defaultReleaseBranch: 'main',
  name: 'projen-cdk-app-project-jsii',
  repositoryUrl: 'https://github.com/matthewthomasgb/projen-cdk-app-project-jsii.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();