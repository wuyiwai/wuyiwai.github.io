---
title: 阿里云机器部署wordpress、typecho记录
date: 2025-02-11
pubDatetime: 2025-02-11
description: 记录了用阿里云机器部署wordpress、typecho的详细过程
summary: 记录了用阿里云机器部署wordpress、typecho的详细过程
tags: ["技术", "博客", "linux"]
---

## 部署目的及机器选择
- 目的：部署个人网站、个人项目（以下的所有配置选项都是基于该目的）
- 机器选择：
	- 服务器类型：ECS(弹性计算服务)：适合个人项目、博客网站和智能家居项目
	- 地域和可用区：选择离你用户群体最近的地域，一般在中国主要选择华东1（杭州）**或华北2（北京）
	- CPU和内存：1核2G或者2核4G即可
	- 存储：40-100G绰绰有余
	- 操作系统：
		- [x] aliyun发行版（不想多思考可以选这个）
		- 如果想做智能家居项目，运行一些特定的物联网框架（如Home Assistant、Node-RED等），建议选择 **Ubuntu** 或 **Debian**，这些可能支持更好一点
		- 不推荐选择LTS版本或者已经停止维护的发行版
	- 带宽：固定带宽 + （1Mbps到5Mbps），注意：99元套餐3Mbps也够用了
	- 安全组：配置安全组规则，确保只开放必要的端口（如HTTP 80、HTTPS 443、SSH 22）等
	- 云监控：记得开，监控内存和cpu等，还可以配置告警规则
	- ssl证书：免费的也能用
	- DDoS：启用DDoS防护服务

## 配置远程登录
建议：使用`ssh`登录，禁用密码登录

### 在本地先生成ssh秘钥
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
默认会保存在 `~/.ssh/id_rsa`,其中` id_rsa` 是私钥(不要分享给别人),`id_rsa.pub`是公钥

### 将公钥上传到阿里云ECS实例
- [登录阿里云控制台](https://www.aliyun.com/)
- 进入ECS管理台
- 找到你的 ECS 实例，点击实例名称进入详情页
- 在左侧菜单中，点击 **本实例密钥对**
- 点击 **绑定密钥对**，选择 **使用已有密钥对** 或 **创建新密钥对**
- 选择 **使用已有密钥对**，将你的公钥内容（`id_rsa.pub` 文件内容）粘贴到输入框中
- 点击 **确定**，完成绑定

### 配置本地SSH登录
在本地配置了`iterm2`+`zsh`的情况下：
```bash
vim ~/.zshrc
# 添加以下内容
ssh-add /Users/username/.ssh/aliyun_rsa
alias aliyun='ssh root@your_server_ip'

source ~/.zshrc
```
接下来就可以用 `aliyun` 这个命令直接直接连接机器了

## 配置Nginx + PHP + Mysql

### 更新软件
```bash
sudo yum update -y
```

### 配置nginx
```bash
$ sudo yum install nginx -y
$ sudo systemctl start nginx // 启动nginx
$ sudo systemctl enable nginx // 设置为开机启动
```
编辑`nginx`配置文件
```
$ sudo vim /etc/nginx/conf.d/wordpress.conf
```

例子：
```
server {
    listen 80;
    server_name {your_domain};  # 改为你的域名或IP
    client_max_body_size 10M; // 单次请求的最大配置

    root /var/www/{your_blog_name};  # 改为你的博客目录
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass 127.0.0.1:9000;  // 这里要注意，用什么fastcgi取决于php.ini里面listen的配置
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

```bash
# 检查nginx配置文件是否正确
$ sudo nginx -t

# 重启nginx
$ sudo systemctl restart nginx
```