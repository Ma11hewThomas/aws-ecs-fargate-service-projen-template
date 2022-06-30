import { AwsCdkAppProject } from '../src';

test('AwsCdkAppProject cdkVersion to be 2.29.1', () => {
  const app = new AwsCdkAppProject({ cdkVersion: '1.0.0', defaultReleaseBranch: 'main', name: 'test' });
  expect(app.cdkVersion).toBe('^2.29.1');
});
