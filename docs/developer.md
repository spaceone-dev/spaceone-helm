# This is for developer use.

If you want to deploy custom configuration, we can edit helm template like

```
$ git clone https://github.com/spaceone-dev/spaceone-helm.git
$ 
$ # Create your own vaules.yaml file
$ # Update values.yaml
$ $ Update any template
$
$ helm install sp -f values.yaml spaceone-helm
```

# Add marketplace

To register public marketplace, update like

File: files/initialize-spaceone/spacectl/main.yaml

* comment register_plugins.yaml
* comment schema.yaml
* uncomment marketplace.yaml
* uncomment developer.yaml
* update marketplace_token

To get marketplace token email to support@spaceone.dev

```
import:
  - mongo.yaml
  - root_domain.yaml
  - repository.yaml
#  - register_plugins.yaml
  - marketplace.yaml
  - developer.yaml
#  - schema.yaml
  - monitoring.yaml
  - statistics.yaml
  - plugin_endpoint.yaml

var:
  domain_name: root
  domain_owner: admin
  username: admin
  marketplace_token: <TOKEN VALUE FROM admin@spaceone.dev>
  mongo_init_path: init_db.js

tasks: []
```

# Register your ECR repository

To register your private ECR repo as local repository

update values.yaml

```
    repository:
      enabled: true
      image: spaceone/repository:1.5.1
      endpoint: repository:50051
      service:
        type: ClusterIP
        annotations:
          nil: nil
        ports:
          - name: grpc
            port: 50051
            targetPort: 50051
            protocol: TCP
      ECR:
        enabled: true
        host: https://<your ECR url>>
```

# Apply new configuration

```
$ helm install sp -f values.yaml spaceone-helm
```

# Example values.yaml

```

