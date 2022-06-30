import * as path from 'path';
import * as fs from 'fs-extra';
import { awscdk, Component } from 'projen';

export class AwsCdkAppProject extends awscdk.AwsCdkTypeScriptApp {
  constructor(options: awscdk.AwsCdkTypeScriptAppOptions) {
    super({
      ...options,
      cdkVersion: '2.29.1',
      sampleCode: false,
    });

    new SampleCode(this);

  }
}

class SampleCode extends Component {
  private readonly appProject: AwsCdkAppProject;

  constructor(
    project: AwsCdkAppProject,
  ) {
    super(project);
    this.appProject = project;
  }

  public synthesize() {
    const outdir = this.project.outdir;
    const srcdir = path.join(outdir, this.appProject.srcdir);

    const srcImports = new Array<string>();

    srcImports.push("import { App, Stack, StackProps } from 'aws-cdk-lib';");
    srcImports.push(
      "import { Cluster, ContainerImage, FargateTaskDefinition, LogDriver } from 'aws-cdk-lib/aws-ecs';",
    );
    srcImports.push(
      "import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';",
    );
    srcImports.push("import { Construct } from 'constructs';");

    const srcCode = `${srcImports.join('\n')}
  export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    
    const cluster = new Cluster(this, "${this.project.name}", {
      clusterName: "${this.project.name}",
      containerInsights: true,
    });

    const taskDefinition = new FargateTaskDefinition(
      this,
      "${this.project.name}TaskDefinition",
      {
        memoryLimitMiB: 512,
        cpu: 256
      } 
    );

    taskDefinition.addContainer(
      "${this.project.name}Container",
      {
        image: ContainerImage.fromRegistry("kennethreitz/httpbin"),
        containerName: "${this.project.name}",
        portMappings: [
          {
            containerPort: 80,
          },
        ],
        logging: LogDriver.awsLogs({
          streamPrefix: "${this.project.name}",
        }),
      }
    );

    new ApplicationLoadBalancedFargateService(
      this,
      "${this.project.name}Service",
      {
        cluster,
        taskDefinition,
        desiredCount: 1,
        publicLoadBalancer: true,
      }
    );
  }
}

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};
const app = new App();
new MyStack(app, '${this.project.name}', { env: env });
app.synth();`;

    fs.mkdirpSync(srcdir);
    fs.writeFileSync(path.join(srcdir, this.appProject.appEntrypoint), srcCode);

    const testdir = path.join(outdir, this.appProject.testdir);

    const testImports = new Array<string>();
    testImports.push("import { App } from 'aws-cdk-lib';");
    testImports.push("import { Template } from 'aws-cdk-lib/assertions';");

    const appEntrypointName = path.basename(
      this.appProject.appEntrypoint,
      '.ts',
    );
    const testCode = `${testImports.join('\n')}
import { MyStack } from '../src/${appEntrypointName}';
test('Snapshot', () => {
  const app = new App();
  const stack = new MyStack(app, 'test');
  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});`;

    fs.mkdirpSync(testdir);
    fs.writeFileSync(
      path.join(testdir, `${appEntrypointName}.test.ts`),
      testCode,
    );
  }
}
