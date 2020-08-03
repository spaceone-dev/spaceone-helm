# 🚀 SpaceONE Helm Chart ![version_info](https://helm.stargate.spaceone.dev/media/version_info.svg)

> a [SpaceONE](https://github.com/spaceone-dev) chart for Helm 3 to deploy [SpaceONE](https://github.com/spaceone-dev) on K8s Cluster. 

Manage your infrastructure with SpaceONE. It doesn't matter what your infrastructure is based on. SpaceONE supports AWS, GCP, Azure, IDC, ...etc.

![preview](https://helm.stargate.spaceone.dev/media/preview.png)

# ⭐️ Installation

### Requirements

* a `Kubernetes` Cluster.(minikube, EKS, ...)
* port-forwarded environments(Recommendations - `kubefwd` or `kubectl`)
* ❗️Some configurations in `values.yaml`
  * AWS Credentials for AWS SecretManager in `backend.services.secret.awsSecretManagerConnector`
  * `console-api` endpoint in `frontend.consoleApi.endpoint`
  * console-api protocol(e.g. `http` or `https`) in `frontend.consoleApi.protocol`

### Commands

```
$ helm repo add spaceone https://helm.stargate.spaceone.dev
$ helm repo update
$ helm install sp spaceone/spaceone -f values.yaml

$ sudo kubefwd svc -n default # this command can be replaced with any codes to execute the same job.
```

If you want to see some commands or instructions, use `helm get notes {{RELEASE_NAME}}`

> The NOTES in this chart includes useful and customized commands for your release.
>
> It also includes a command that lest you execute an initailizing job manually.

```
$ helm get notes sp
# OR replace sp with your release name.
...
NOTES:
```

You can see the console page via http://root

## Usage examples

### 1. Deploy the whole SpaceONE service with this chart.

What you should do is only to input your aws credentials in `values.yaml`

```
# values.yaml
...
backend:
  services:
    secret:
      awsSecretManagerConnector:
        awsAccessKeyId: PLEASE_INPUT_YOUR_AWS_CREDENTIALS
        awsSecretAccessKey: PLEASE_INPUT_YOUR_AWS_CREDENTIALS
        regionName: PLEASE_INPUT_YOUR_AWS_CREDENTIALS
```

You can also use either NLB or ALB for `console` and `console-api`.

#### Using NLB

```
# values.yaml
backend:
  services:
    secret: 
    	... # some configurations
frontend:
  console:
    host: YOUR_CONSOLE_HOST_NAME # e.g. console.xxx.xxx
    service:
      type: LoadBalancer
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
        service.beta.kubernetes.io/aws-load-balancer-ssl-cert: YOUR_ACM_CRETIFICATE_ARN
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
      extraSpec: # extra spec for the service
        # loadBalancerSourceRanges: [YOUR_DESIRED_CIDRS]
  consoleApi:
    endpoint: YOUR_CONSOLE_API_ENDPOINT # e.g. console-api.xxx.xxx
    protocol: https # the protocol that your console will use
    service:
      type: LoadBalancer
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
        service.beta.kubernetes.io/aws-load-balancer-ssl-cert: YOUR_ACM_CRETIFICATE_ARN
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
      extraSpec: # extra spec for the service
        # loadBalancerSourceRanges: [YOUR_DESIRED_CIDRS]
```

#### Using ALB

This will be appended soon.

### 2. Deploy this chart with your own SpaceONE micro services.

```
# values.yaml
# Supposing that you run identity service on your local environment.
...
backend:
  services:
    identity:
      enabled: false
      endpoint: PLEASE_INPUT_YOUR_HOST:YOUR_PORT
```

### 3. Deploy this chart with your own Databases.

```
# values.yaml
# Supposing that you run mongoDB on your local environment.
...
mongo:
  enabled: false
  username: PLEASE_INPUT_YOUR_USERNAME
  password: PLEASE_INPUT_YOUR_PASSWORD
  host: PLEASE_INPUT_YOUR_MONGO_HOST
  port: PLEASE_INPUT_YOUR_MONGO_PORT
```

TLS connection and documentDB will be supported soon.

### 4. Develop your own plugin with this chart.

This will be appended soon.

## Development guides

This will be appended soon.

## Configurations

This will be appended soon.

## Release History

- 0.1.5
  - 
- 0.1.4
  - Support extraSpec to `Service` (e.g. .spec.loadBalancerSourceRanges)
    - only available in `Frontend`
  - Update some pod commands
    - e.g. `spaceone scheduler statistics`=>`spaceone scheduler spaceone.statistics`
- 0.1.3
  - You can set frontend hosts and endpoints.
  - Serve local repository.
  - Helm refactoring - applied unified indents
  - Service annotations and types are available - ClusterIP, NodePort and LoadBalancer.
- 0.1.0
  - Initial version.

## Metadata

[@umi0410](https://github.com/umi0410) – bo314@naver.com

## Contributing

1. Fork it (https://github.com/spaceone/spacoene-helm)
2. Create your branch (`git checkout -b foo`)
3. Commit your changes
4. Push to your branch
5. Create a new Pull Request (https://github.com/spaceone/spaceone-helm)