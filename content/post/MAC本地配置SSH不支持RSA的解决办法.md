---
title: 'MAC本地配置SSH不支持RSA的解决办法'
date: '2024-03-31'
summary: "mac换电脑后，本地配置SSH不支持RSA的解决办法"
tags: ["技术", "环境配置"]
---
> 由于之前买了多台机子生成了多份ssh密钥，都堆在`~/.ssh`目录下，太乱了，重新梳理配置下，记录下踩坑

# 生成 ssh key
- 命令: `ssh-keygen -t rsa -C "xx@xx.com"`
- 解释:
	- `-t rsa` 指定 `rsa` 算法
	- `-C "xx email"` 指定 邮箱
- 注意点：如果生成的过程要用到密码，注意记住密码

如果使用到了密码，在 `iterm2` 等工具下最好配置一下默认启动的配置加载ssh `~./zshrc`
也可以写个简单的 `.sh`
```
set password xxx
spawn ssh-add ~/.ssh/example
expect "*passphrase for*"
send "$password\r"
interact
```

# ssh 登录踩坑

在我的mac升级成Sonoma之后，本地的ssh的配置就更新了，默认不支持 `ssh-rsa`，所以会出现类似`Unable to negotiate with  port xxx: no matching host key type found. Their offer: ssh-dss,ssh-rsa`的报错。

**解决办法:**：在 `~/.ssh` 目录下的 `config` 文件中配置
```
Host *
	HostKeyAlgorithms +ssh-rsa
    PubkeyAcceptedKeyTypes +ssh-rsa
```
用来支持 `rsa`

**额外注意**: `~/.ssh` 目录下有个 `known_hosts` 和 `known_hosts.old` 的文件，配置了 `config` 文件后最好先备份下 `known_hosts` 的两个文件以防万一，然后删除这两个文件，这样重新使用ssh登录或者验证时会重新生成fingerprint

或者参考这个
[启用通过 HTTPS 的 SSH 连接](https://docs.github.com/zh/authentication/troubleshooting-ssh/using-ssh-over-the-https-port#enabling-ssh-connections-over-https)