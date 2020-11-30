# 🚀 SpaceONE Helm Chart ![version_info](https://helm.stargate.spaceone.dev/media/version_info.svg)

> a [SpaceONE](https://github.com/spaceone-dev) chart for Helm 3 to deploy [SpaceONE](https://github.com/spaceone-dev) on K8s Cluster. 

Manage your infrastructure with SpaceONE. It doesn't matter what your infrastructure is based on. SpaceONE supports AWS, GCP, Azure, IDC, ...etc.

![preview](https://helm.stargate.spaceone.dev/media/preview.png)

# ⭐️ Installation

### Requirements

* a `Kubernetes` Cluster.(minikube, EKS, ...)
* port-forwarded environments(Recommendations - `kubefwd` or `kubectl`)
* ❗️ Some configurations in `values.yaml`
  * AWS Credentials for AWS SecretManager in `backend.services.secret.awsSecretManagerConnector`
  * `console-api` endpoint in `frontend.consoleApi.endpoint`
  * console-api protocol(e.g. `http` or `https`) in `frontend.consoleApi.protocol`

### Commands

```
$ helm repo add spaceone https://helm.stargate.spaceone.dev/charts
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

You can see the console page via `default:service/console`

## Configuration examples

### 1. Deploy the whole SpaceONE service with this chart.

What you should do is only to input your aws credentials in `values.yaml`

```
# values.yaml
...
backend:
  services:
    secret:
      awsSecretManagerConnector:
        awsAccessKeyId: PLEASE_INPUT_YOUR_AWS_ACCESS_KEY_ID
        awsSecretAccessKey: PLEASE_INPUT_YOUR_AWS_SECRET_ACCESS_KEY
        regionName: PLEASE_INPUT_YOUR_AWS_REGION_NAME
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

### How to expose your SpaceONE

> We will omit the configuration for `backend.services.secret.awsSecretManagerConnector` in `values.yaml` for convenience BUT you should configure it in your `values.yaml`.

You can use `kubectl port-forward`, `kubefwd`, `NLB`, or `Ingress`. If you need the customized codes for your environemnts, try ` helm get notes sp`. 

**The Default Example Environment**

| repository | namespace | release |
| ---------- | --------- | ------- |
| spaceone   | default   | sp      |

#### Option a. `kubectl port-forward`, the most common method

| console.host   | console-api.endpoint |
| -------------- | -------------------- |
| localhost:8080 | localhost:9090       |

```
# values.yaml
backend:
  ... # omitted for convenience
frontend:
  console:
    host: localhost:8080
  consoleApi:
    endpoint: localhost:9090
    protocol: http
```

```
$ helm install sp spaceone/spaceone -n default -f values.yaml
$ kubectl port-forward -n default svc/console 8080:80
$ kubectl port-forward -n default svc/console-api 9090:80
```

🌟 Then access to http://localhost:8080

#### Option b. `kubefwd`, the easiest and the most convenient method

> This requires [`kubefwd`](https://github.com/txn2/kubefwd) )

| console.host | console-api.endpoint |
| ------------ | -------------------- |
| console      | console-api          |

```
# values.yaml

backend:
  ... # omitted for convenience
```

``` 
$ helm install sp spaceone/spaceone -n default -f values.yaml
$ sudo kubefwd svc -n default
```

🌟 Then access to http://console

#### Obtion c. NLB

> You can either enable or disable tls by using annotations. You can see detailed contents in the [kubernetes official docs](https://kubernetes.io/ko/docs/concepts/services-networking/service/#ssl-support-on-aws).

| console.host                      | consoleApi.endpoint              | ssl port | ELB type |
| --------------------------------- | -------------------------------- | -------- | -------- |
| root.console.example.spaceone.dev | console-api.example.spaceone.dev | 443      | nlb      |

```
# values.yaml
backend: 
  ... # some configurations
frontend:
  console:
    host: root.console.example.spaceone.dev # This should be replaced with your domain name.
    service:
      type: LoadBalancer
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
        service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:... # This should be replaced with your Certificate arn
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
      extraSpec: # extra spec for the service if you need
        # loadBalancerSourceRanges: [YOUR_DESIRED_CIDRS]
  consoleApi:
    endpoint: console-api.example.spaceone.dev  # This should be replaced with your domain name.
    protocol: https # http, the protocol that your console will use.
    service:
      type: LoadBalancer
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
        service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:... # This should be replaced with your Certificate arn
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
      extraSpec: # extra spec for the service if you need
        # loadBalancerSourceRanges: [YOUR_DESIRED_CIDRS]
```

```
$ helm install sp spaceone/spaceone -n default -f values.yaml

# create Route53 record for your new allocated NLB.
```

🌟 Then access to your domain you configured in `console.host`.(e.g. https://root.console.example.spaceone.dev)

#### Option d. Ingress

> You should install `alb-controller` ahead. `console` and `console-api` services should be set as `NodePort` service.
>
> You can either enable or disable `tls`. Annotations and ingress class depends on your environments.

| console.host                      | consoleApi.endpoint              | consoleApi.protocol | SSL port | Ingress class | Certificate | Inbound            |
| --------------------------------- | -------------------------------- | ------------------- | -------- | ------------- | ----------- | ------------------ |
| root.console.example.spaceone.dev | console-api.example.spaceone.dev | Https               | 443      | ALB           | AWC ACM     | 123.123.123.123/32 |

```
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS":443}]'
    alb.ingress.kubernetes.io/actions.ssl-redirect: '{"Type": "redirect", "RedirectConfig": { "Protocol": "HTTPS", "Port": "443", "StatusCode": "HTTP_301"}}'
    alb.ingress.kubernetes.io/inbound-cidrs: 123.123.123.123/32 # replace or leave out
    alb.ingress.kubernetes.io/scheme: "internet-facing" # internet-facing
    alb.ingress.kubernetes.io/target-type: instance # Your console and console-api should be NodePort for this configuration.
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:... # This should be replaced with your cert arn.

frontend:
  console:
    host: root.console.example.spaceone.dev
    service:
      type: NodePort
  consoleApi:
    endpoint: console-api.example.spaceone.dev
    protocol: https # or http
    service:
      type: NodePort
```

```
$ helm install sp spaceone/spaceone -n default -f values.yaml

# # create Route53 record for your new allocated ALB.
```

🌟 Then access to your domain you configured in `console.host`.(e.g. https://root.console.example.spaceone.dev)

## Configurations

This will be appended soon.

## Release History

* 1.2.2
  * Replace initialize codes using `spaceone-tester` with codes using `spacectl`
  * Remove `templates/tester-conf.yml`

- 1.2.1
  - reflect change of `supervisor-conf`
  - specify the version of docker images from `latest`
- 1.1.4
  - no need to set console hostname as `root`.
  - Trigger `initialize-spaceone` automatically
    - waits for microservices are ready and then execute the initalizing job.
    - introduced multiple inventory worker
  - ingress and nlb is supported. ( for `console`, `console-api`)
  - Changed names of objects 
    - `wconsole-client` => `console`
    - `wconsole-server`=>`console-api`
    - `initialize-conf`=>`initialize-spaceone-conf`, `tester-conf`, `spacectl-conf`
  - a specified tag for image (only `console`)
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

## Maintainers

[@umi0410](https://github.com/umi0410) – bo314@naver.com

## Contributing

1. Fork it (https://github.com/spaceone/spacoene-helm)
2. Create your branch (`git checkout -b foo`)
3. Commit your changes
4. Push to your branch
5. Create a new Pull Request (https://github.com/spaceone/spaceone-helm)
