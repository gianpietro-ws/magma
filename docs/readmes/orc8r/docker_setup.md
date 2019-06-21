---
id: docker_setup
title: Docker Setup
---
## Container setup

Orc8r consists of 2 containers: one for the proxy, and one for all the
controller services. We use supervisord to spin multiple services within
these containers.

NOTE: The multiple services per container model was adopted to model the
legacy Vagrant setup and for easier migration, and we will soon migrate to
one container per microservice model which is more appropriate.

For development, we use a postgresql container as the datastore. For
production, it is advisable to use a hosted solution like AWS RDS.

NOTE: This guide assumes that you are running the commands inside 
the `magma/orc8r/cloud/docker` directory in your host.

## How to build the images

Since orc8r can include modules outside the magma codebase, we use a wrapper
python script which creates a temporary folder as the docker build context.
The temporary folder contains all the modules necessary, and is created based
on the module.yml config.

Build the docker images using:
```
./build.py
```
To use a different module.yml file, run something similar to:
```
MAGMA_MODULES_FILE=../../../modules.yml ./build.py
```

NOTE: If you are running on Mac, you may need to increase the memory
limit of the docker daemon to build the images. Otherwise, you may see an error 
message similar to this:
`/usr/local/go/pkg/tool/linux_amd64/link: signal: killed`.

## How to run

To run and manage the containers, use the following commands:
```
docker-compose up -d
docker-compose ps
docker-compose down
```
To tail the logs from the containers, use one of these commands:
```
docker-compose logs -f
docker-compose logs -f controller
```
To create a shell inside a container, run:
```
docker-compose exec controller bash
```

## How to run unit tests
We use a `test` container for running the go unit tests. Use one of the
following commands to run the tests in a clean room environment:
```
./build.py --tests
./build.py -t
```
The `--mount` option in `build.py` can be used to spin a test container
with the code from individual modules mounted, so that we can individual
unit tests.

*NOTE: make sure to run `precommit` using mount before submitting a patch* 

```
./build.py -m
[container] /magma/orc8r/cloud# make precommit
```

## How to generate code after Protobuf and Swagger changes
The `--mount` option can also be used to run the codegen scripts for swagger
and protobufs, after any changes in those files.
```
./build.py -m
[container] /magma/orc8r/cloud# make gen
```

## Publishing the images

To push the images to a private docker registry, use the following script:
```
../../tools/docker/publish.sh -r REGISTRY -i proxy
../../tools/docker/publish.sh -r REGISTRY -i controller

../../tools/docker/publish.sh -r REGISTRY -i proxy -u USERNAME -p /tmp/password
```