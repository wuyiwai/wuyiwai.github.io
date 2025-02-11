---
title: Git常用命令
date: 2024-07-31
summary: 记录git的一些常用命令
tags: ["技术", "git"]
---
#### 配置
```
# 查看全局配置列表
git config --global -l
```

#### 管理仓库
```
# 查看远程仓库服务器, 一般打印 origin , 这是 Git 给你克隆的仓库服务器的默认名字
# 一般只会显示 origin , 除非你有多个远程仓库地址
git remote

# 指定-v, 查看当前远程仓库地址
git remote -v
```

#### 暂存文件
```
# 暂存所有
git add -A

# 暂存某个文件
git add ./README.md

# 暂存当前目录所有改动文件
git add .

# 暂存一系列文件
git add 1.txt 2.txt ...
```

#### 提交文件
```
# -m 提交的描述信息
git commit -m "changes log"

# 只提交某个文件
git commit README.md -m "message"

# 重写上一次提交信息，确保当前工作区没有改动
git commit --amend -m "新的提交信息"
```

#### 推送远端
```
# 默认推送当前分支
# 等价于 git push origin, 实际上推送到一个叫 origin 默认仓库名字
git push

# 推送到主分支
git push -u origin main

# 本地分支推送到远程分支， 本地分支:远程分支
git push origin <branchName>:<branchName>

# 强制推送, --force 缩写
git push -f
```

#### 查看分支
```
# 查看所有分支
git branch -a

# 查看本地分支
git branch

# 查看远端分支
git branch -r

# 查看本地分支所关联的远程分支
git branch -vv

# 查看本地 main 分支创建时间
git reflog show --date=iso main

# 搜索分支, 借助 grep 命令來搜索, 包含关键字 dev
git branch -a | grep dev
```

#### 关了分支
```
# 创建一个名为 develop 本地分支
git branch develop

# 强制创建分支, 不输出任何警告或信息
git branch -f develop

# 创建本地 develop 分支并切换
git checkout -b develop

# 创建远程分支, 实际上创建本地分支然后推送到远端
git checkout -b develop
git push origin develop

# 删除本地分支
$ git branch -d <branchName>
```

#### 临时保存
```
# 保存当前修改工作区内容
git stash

# 保存时添加注释, 推荐使用此命令
git stash save "修改了#28 Bug"

# 保存包含没有被git追踪的文件
git stash -u

# 查看当前保存列表
git stash list

# 恢复修改工作区内容, 会从 git stash list 移除掉
git stash pop # 恢复最近一次保存内容到工作区, 默认会把暂存区的改动恢复到工作区
git stash pop stash@{1} # 恢复指定 id， 通过 git stash list 可查到
git stash pop --index # 恢复最近一次保存内容到工作区, 但如果是暂存区的内容同样恢复到暂存区

# 与 pop 命令一致, 唯一不同的是不会移除保存列表
git stash apply

# 清空所有保存
git stash clear

# 清空指定 stash id, 如果 drop 后面不指定id清除最近的一次
git stash drop stash@{0}
git stash drop  # 清除最近一次

# 查看已保存的修改文件内容
git stash show -p stash@{0}
```

##### 文件状态
```
# 完整查看文件状态
git status

# 以短格式给出输出
git status -s
```

#### 日志
```
# 查看完整历史提交记录
git log

# 查看前N次提交记录 commit message
git log -2

# 从 commit 进行搜索, 可以指定 -i 忽略大小写
git log -i --grep="fix: #28"

查看某个分支的merge记录
git log --oneline --merges --pretty=format:"%Cred hash[ %h] %Cgreen人[%an] %Cblue time[%ad] %Creset msg[%s]" --date=format:'%Y-%m-%d %H:%M:%S' <branch>

# 查看指定作者历史记录
git log --author=xjh22222228

# 只显示合并日志
git log --merges

# 以倒序查看历史记录
git log --reverse
```

#### 合并
feature/v1.0.0 分支代码合并到 develop
```
git checkout develop
git merge feature/v1.0.0
```

合并分支后不进行提交
```
git merge develop --no-commit
```

退出合并，恢复到合并之前的状态
```
git merge --abort
```

#### 还原
```
# 撤销工作区文件修改, 不包括新建文件
git restore README.md # 一个文件
git restore README.md README2.md # 多个文件
git restore . # 当前全部文件

# 从暂存区回到工作区
git restore --staged README.md
```

#### 比较差异
```
# 查看所有文件工作区与暂存区的差异
git diff

# 查看指定文件工作区与暂存区差异
git diff README.md

# 查看指定 commit 内容差异
git diff dce06bd

# 对比2个commit之间的差异
git diff e3848eb dce06bd

# 比较2个分支最新提交内容差异, develop分支与main分支, 如果没有差异返回空
git diff develop main

# 比较2个分支指定文件内容差异, develop 和 main READNE.md 文件差异
git diff develop main README.md README.md

# 查看工作区冲突文件差异
git diff --name-only --diff-filter=U

# 查看上一次修改了哪些文件
git diff --name-only HEAD~
git diff --name-only HEAD~~ # 前2次...
```

