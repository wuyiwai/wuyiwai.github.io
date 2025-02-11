---
title: docker速记
date: 2024-08-27
summary: 记录docker的一些快查命令
tags: ["技术", "docker"]
---
#### 进入一个服务的 terminal
```
# 进入服务的terminal
$ docker exec -it $(docker ps -q -f name=<containerId>) /bin/bash
$ docker exec -it $(docker ps -q -f name=shops-xdebug) /bin/bash && cd ./reli-prof

php ./reli i:memory -p 7 >7.memeory_dump.json
php ./reli i:memory -p 10 >10.memeory_dump.json
nohup php TestReli.php > output.log 2>&1 &
./reli i:trace -p 12

```
或者一个简单的 shell
```
#!/bin/bash

# 获取所有名为"shops"的容器ID列表
container_ids=$(docker ps -q -f name=shops)

# 检查是否有容器ID被找到
if [ -z "$container_ids" ]; then
    echo "No containers found with name shops."
    exit 1
fi

# 进入第一个找到的容器
docker exec -it $(echo "$container_ids" | head -n 1) /bin/sh
```