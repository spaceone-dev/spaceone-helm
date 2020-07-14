# 🚀 SpaceONE Helm Chart

> a [SpaceONE](https://github.com/spaceone-dev) chart for Helm 3 to deploy it on K8s Cluster.
>
> Current latest version ![version_info](https://helm.stargate.spaceone.dev/media/version_info.png)

Manage your infrastructure with SpaceONE. It doesn't matter what your infrastructure is based on. SpaceONE can handle AWS, GCP, Azure, IDC, ...etc.

![preview](https://helm.stargate.spaceone.dev/media/preview.png)

# ⭐️ Installation

### Requirements

* `kubefwd` or any environments provided `port-forward`
* a `Kubernetes` Cluster.(minikube, EKS, ...)
* Configurations for AWS Credentials in `values.yaml`-`backend.services.secret.awsSecretManagerConnector`

### Commands

> Some initializing codes will be appended soon.

You should input your aws credentials which has permissions for AWS Secret Mananger in `values.yaml`

```
$ helm repo add spaceone https://helm.stargate.spaceone.dev
$ helm repo update
$ helm install sp spaceone/spaceone -f values.yaml

$ sudo kubefwd svc -n default # this command can be replaced with any codes to execute the same job.

# then execute some initializing codes, please.
```

You can see the console page via http://console-client

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

### 3. Deploy this chart with your own Databases

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

### 4. Develop your own plugin with this chart

This will be appended soon.

## Development guides

This will be appended soon.

## Configurations

This will be appended soon.

## Release History

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