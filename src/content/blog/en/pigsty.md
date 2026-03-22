---
slug: "en/pigsty"
title: "Deploy Pigsty on Proxmox VE"
author: "Alexander Niebuhr"
date: "2026-03-22T00:00:00.000Z"
state: "experimental"
cover: "./pigsty.png"
coverAlt: "Isometric cover that shows a 3d datacenter with pigsty and proxmox."
excerpt: "Deploy Pigsty on Proxmox VE without getting lost in the docs. A practical WIP guide to a reproducible self-hosted PostgreSQL cluster with VMs, SSH, networking, storage, and service access. It covers the parts that usually slow people down most: node prep, Pigsty bootstrap, cluster configuration, and PostgreSQL service endpoints."
---

Pigsty seems to be a great way to self deploy postgresql. However their [v4 docs](https://pigsty.io/docs/) seem to be overly complex.

This is a WIP document documenting my steps and learning and trying to make it more reproducible.

```
It also doesn't cover all possible options and is opiniated based on our own use-case. Always conduct latest official documentation for all options.
```

Requirements: 

- _at least_ [4](https://pigsty.io/docs/deploy/planning/#four-node-setup) ssh [accesible](https://pigsty.io/docs/deploy/admin/#check-accessibility) bare Linux OS `x86_64` or `aarch64` nodes (physical machines _bare metal_ or VMs) (1 INFRA, 3 WORKER)
- one of 14 [supported](https://pigsty.io/docs/ref/linux/) maintream distributions, [use recommendations first](https://pigsty.io/docs/ref/linux/#overview). I do prefer ubuntu, than debian, than rocky.
- all nodes use the same Linux distribution, architecture, and version.
- at least 1 core and 2 gig ram (no upper limit, *parameters are automaticly tuned based on available ressources*)
- `xfs` file system
- `/data` owned by `root:root` with `755`
- attional disks mounted as `/data`, `/dataN`
- static network with fixed *internal* IPv4 address
- outbund internet access
- locale set to `en_US` with collation to `C.UTF-8` (PostgreSQL logs are in English)

First, prepare hardware, nodes, disks, network, VIP, domain, software, and filesystems _["Preparation"](https://pigsty.io/docs/deploy/prepare/)_

Steps: 

1.  Create VMs (e.g. 2c8ram)

2.  Install OS with fixed internal IPv4

3.  Update OS (make sure `tar` & `acl` installed)

<!-- SETUP SSH KEY FOR ROOT ON INFRA NODE-->
<!-- LOGIN AS ROOT -->

5.  Install pigsty on `INFRA` node

    ```shell
    curl -fsSL https://repo.pigsty.io/get | bash;
    cd ~/pigsty 
    ```

6.  Configure deployment *needs manual adjustment*

    _Pigsty provides a configure script as a configuration wizard that automatically generates an appropriate pigsty.yml configuration file based on your current environment.

    This is an optional script: if you already understand how to configure Pigsty, you can directly edit the pigsty.yml configuration file and skip the wizard._

    ```shell
    ./configure -s -g -c ha/full
    sudo vi pigsty.yml
    ```

    *Edit IP addresses, Network Interfaces, PG Cluster & PG Database*

<!-- SETUP ROOT SSH KEY FOR ALL NODES -->

4.  Check [admin requirements](https://pigsty.io/docs/deploy/admin/#create-admin-user)

    ```shell
    ./node.yml -k -K -t node_admin -e ansible_user=admin -e node_admin_username=pigsty-admin node_admin_uid=888
    ```

<!-- SETUP SSH KEY FOR NEW ADMIN ON INFRA NODE -->
<!-- RUN BELOW AS NEW ADMIN NODE -->

7. Deploy to VMs

    ```shell
    ./deploy.yml
    # ./deploy.yml -k -K
    ```

8.  Access [Endpoints](https://pigsty.io/docs/setup/webui/#endpoints)

    - [Web GUI](http://192.168.1.61:80)
    - [Grafana](http://192.168.1.61:80/ui)

9. _(Optional)_ configure [custom domain](https://pigsty.io/docs/setup/webui/#domain-access)

10. Use [Service](https://pigsty.io/docs/pgsql/service/#service-overview) to access PG

    - Read-write service (primary): Write data: Only carried by the primary.
    - Read-only service (replica): Read data: Can be carried by replicas, but can also be carried by the primary if no replicas are available
    - Default direct access service (default): Service that allows (admin) users to bypass the connection pool and directly access the database
    - Offline replica service (offline): Dedicated replica that doesn’t handle online read-only traffic, used for ETL and analytical queries
    - Synchronous replica service (standby): Read-only service with no replication delay, handled by [synchronous standby](https://pigsty.io/docs/pgsql/config#sync-standby)/primary for read-only queries
    - Delayed replica service (delayed): Access older data from the same cluster from a certain time ago, handled by [delayed replicas](https://pigsty.io/docs/pgsql/config#delayed-cluster)

    https://pigsty.io/docs/pgsql/service/#default-service.  

Notes:

- [IaC](https://pigsty.io/docs/concept/iac/)  
- [Inventory](https://pigsty.io/docs/concept/iac/inventory/)  