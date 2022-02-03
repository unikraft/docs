---
title: GCP
date: 2020-01-11T14:09:21+09:00
draft: false
weight: 522
---


## Unikraft on Google Cloud Platform

Google Cloud Platform (GCP) is a suite of cloud computing services that provides a series of modular services including computing, data storage, data analytics, and machine learning.

Unikraft KVM images can easily be deployed to GCP by using the deployment script found in the [`plat-gcp`](https://github.com/unikraft/plat-gcp) repository.

## Getting Started

As a prerequisite, it is expected that a Unikraft structure is initialized on your machine with the following structure:

```
~/.unikraft
├── apps
├── archs
├── libs
├── plats
└── unikraft
```

### Create a Unikraft KVM Image

Open a terminal window and access the `/apps` directory:

```
$ cd ~/.unikraft/apps
```

Initialize the `helloworld` application:

```
$ kraft init -t helloworld helloworld && \
cd helloworld/
```

Configure the Unikraft image to target KVM:

```
$ kraft configure -p kvm -m x86_64
```

Build the application:

```
$ kraft build
```

Our built Unikraft image can now be found within the `/build`-directory and can be tested locally with:

```
$ kraft run
```

### Initialize GCP

Before installing any GCP-related tools, make sure to register a Google Cloud account [here](https://cloud.google.com/).

After you've successfully created a new Google Cloud account, make sure to download the `gcloud CLI` by following the [Installation Guide](https://cloud.google.com/sdk/docs/install). Once the `gcloud CLI` is installed you need to connect it to your Google Cloud account:

```
$ gcloud init
```

### Use the Unikraft Cloud Script

Use the terminal to go to your `/plats` directory:

```
$ cd ~/.unikraft/plats
```

Clone the [`plat-gcp`](https://github.com/unikraft/plat-gcp.git) repository:

```
$ git clone https://github.com/unikraft/plat-gcp.git && \
cd plat-gcp
```

Make `deploy-unikraft-gcp.sh` into an executable:

```
$ chmod +x scripts/deploy-unikraft-gcp.sh
```

Use `--help` to better understand the capabilities of the script:

```
$ ./scripts/deploy-unikraft-gcp.sh --help
./scripts/deploy-unikraft-gcp.sh: illegal option -- -
usage: ./scripts/deploy-unikraft-gcp.sh [-h] [-v] -k <unikernel> -b <bucket> [-n <name>]
       [-z <zone>] [-i <instance-type>] [-t <tag>] [-v] [-s]

Mandatory Args:
<unikernel>: 	  Name/Path of the unikernel.(Please use "KVM" target images) 
<bucket>: 	      GCP bucket name

Optional Args:
<name>: 	      Image name to use on the cloud (default: unikraft)
<zone>: 	      GCP zone (default: europe-west3-c)
<instance-type>:  Specify the type of the machine on which you wish to deploy the unikernel (default: f1-micro) 
<tag>:		      Tag is used to identify the instances when adding network firewall rules (default: http-server)
<-v>: 		      Turns on verbose mode
<-s>: 		      Automatically starts an instance on the cloud
```

### Deploy to GCP

Now that everything is initialized and configured, we are ready to deploy our KVM image to GCP. Use the script to deploy the image:

```
$ ./scripts/deploy-unikraft-gcp.sh -k ~/.unikraft/apps/helloworld/build/helloworld_kvm-x86_64 -b unikraft-helloworld
Deploying unikraft-1643910092.img on Google Cloud...
Name  : unikraft-1643910092
Bucket: unikraft-helloworld
Zone  : europe-west3-c

Creating disk partitions.................[OK]
Installing boot loader...................[OK]
Creating bootable disk image.............[OK]
Uploading disk to the cloud..............[OK]
Creating image on the cloud..............[OK]
Cleaning temporary files.................[OK]

To run the instance on GCP, use following command-
gcloud compute instances -q create unikraft-1643910092 --image unikraft-1643910092 --machine-type f1-micro --zone europe-west3-c --tags http-server 

NOTE:
1) To see the GCP system console log, use following command-
 gcloud compute instances get-serial-port-output unikraft-1643910092 --zone=europe-west3-c 
2) GCP takes some time to initialise the instance and start the booting process, If there is no output on serial console, Please run it again in few secs
3) Don't forget to customise GCP with proper firewall settings (if no --tags are given),
as the default one won't let any inbound traffic in.
```

The image can now be found within the [Images page on Compute Engine](https://console.cloud.google.com/compute/images?tab=images).

To run the instance on GCP use the command found in the output from the previous command. In our case this is:

```
$ gcloud compute instances -q create unikraft-1643910092 --image unikraft-1643910092 --machine-type f1-micro --zone europe-west3-c --tags http-server

Created [https://www.googleapis.com/compute/v1/projects/<project-name>/zones/europe-west3-c/instances/unikraft-1643910092].
NAME                 ZONE            MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP   STATUS
unikraft-1643910092  europe-west3-c  f1-micro                   10.156.0.2   34.159.64.25  RUNNING
```

A new instance is now running on GCP and can be found under [VM Instances in the Compute Engine](https://console.cloud.google.com/compute/instances).

A complementary [Disk](https://console.cloud.google.com/compute/disks) has also been created.

### Cleaning Up

In order to avoid running costs, it is important to clean up our experiments:

1. Stop running instance at https://console.cloud.google.com/compute/instances
2. Delete the stopped instance
3. Delete the image from at https://console.cloud.google.com/compute/images?tab=images
