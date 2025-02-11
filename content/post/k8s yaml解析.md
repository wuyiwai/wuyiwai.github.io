---
title: 'k8s yaml解析'
date: '2023-01-29'
summary: "记录k8s yaml配置相关"
tags: ["技术", "k8s"]
---
### 基础
- [管理k8s集群工具](https://xmkm.yuque.com/armee3/dzbqgm/xbvubs)
- [kebeadm](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
  - 配置目录: $HOME/.kube/config
  - 常用命令:
    - 查看配置列表：`kubecm list`
    - 切换集群:`kubecm switch`
    - 切换命名空间: `kubecm namespace`
- 集群管理
  - [k9s]()

### 参考文档:
- [API约定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#metadata)
- [k8s官方文档](https://kubernetes.io/zh-cn/)

### yaml配置
##### apiVersion: 创建对象使用的 Kubernetes API 版本
- 参考文档：
  - [Which Kubernetes apiVersion Should I Use?](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-apiversion-definition-guide.html)
  - [segmentfault](https://segmentfault.com/a/1190000017134399)
- 常用值
  - apps/v1: 包含一些通用的应用层的api组合
   - v1: Kubernetes API的稳定版本，包含很多核心对象：pod、service等
     - batch/v1beta1: 代表job相关的api组合
##### kind:创建的对象的类型
- 常用值
  - Deployment: 一个定义多副本应用（即多个副本 Pod）的对象 - [参考](https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/deployment/)
  - HorizontalPodAutoscaler: 自动更新工作负载资源，目的是自动扩缩工作负载以满足需求 - [参考](https://kubernetes.io/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)
  - Ingress: 是对集群中服务的外部访问进行管理的 API 对象，典型的访问方式是 HTTP - [参考](https://kubernetes.io/zh-cn/docs/concepts/services-networking/ingress/)
  - Service: 是一种可以访问 Pod逻辑分组的策略 - [参考](https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/)
  - CronJob: 创建基于时隔重复调度的Job - [参考](https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/cron-jobs/)
  - Secret: 是一种包含少量敏感信息例如密码、令牌或密钥的对象 - [参考](https://kubernetes.io/zh-cn/docs/concepts/configuration/secret/)

##### metadata： 元数据 - [参考](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#metadata)
- name: 名称 - [参考](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names)
- namespace: 命名空间 - [参考](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)
- labels: 标签旨在用于指定对用户有意义且相关的对象的标识属性，但不直接对核心系统有语义含义 - [参考](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
- status: 描述了对象的当前状态 - [参考](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
- spec: 包含对象希望达成的状态 - [参考](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
  - selector: 供 Pod 所用的标签选择算符。通过此字段选择现有 ReplicaSet 的 Pod 集合， 被选中的 ReplicaSet 将受到这个 Deployment 的影响。此字段必须与 Pod 模板的标签匹配
    - matchLabels: 对一组资源的标签查询 - [参考](https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/common-definitions/label-selector/)
  - replicas：预期 Pod 的数量。这是一个指针，用于辨别显式零和未指定的值。默认为 1。 - [参考](https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/#multiple-replicas)
  - strategy: 描述如何将现有 Pod 替换为新 Pod
    - type: 部署的类型。默认为 RollingUpdate。常用值如下:
      - RollingUpdate: 滚动更新这些配置参数
      - Recreate: 重新创建
  - template: `.spec.template` 是一个 [Pod 模板](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/#pod-templates)。 它和 [Pod](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/) 的语法规则完全相同。 只是这里它是嵌套的，因此不需要 `apiVersion` 或 `kind
    - spec:
      - nodeSelector: 提供了一种最简单的方法来将 Pod 约束到具有特定标签的节点上
      - containers: 容器
        - imagePullPolicy - [参考](https://kubernetes.io/zh-cn/docs/concepts/containers/images/#image-pull-policy): 镜像拉取策略， 常用值如下:
          - IfNotPresent: 只有当镜像在本地不存在时才会拉取
          - Always: 每当 kubelet 启动一个容器时，kubelet 会查询容器的镜像仓库， 将名称解析为一个镜像摘要。 如果 kubelet 有一个容器镜像，并且对应的摘要已在本地缓存，kubelet 就会使用其缓存的镜像； 否则，kubelet 就会使用解析后的摘要拉取镜像，并使用该镜像来启动容器。
          - Never: Kubelet 不会尝试获取镜像。如果镜像已经以某种方式存在本地， kubelet 会尝试启动容器；否则，会启动失败。
        - image：镜像 - [参考](https://kubernetes.io/zh-cn/docs/concepts/containers/images/)
        - command：为Pod中容器设置启动时要执行的命令及其参数 - [参考](https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-command-argument-container/#define-a-command-and-arguments-when-you-create-a-pod)
        - lifecycle: pod的生命周期 - [参考](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/)
          - preStop: 如果容器配置了 `preStop` 回调，则该回调会在容器进入 `Terminated` 状态之前执行 - [参考](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)
            - exec:
              - command:
        - env: 定义了一组环境变量 - [参考](https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/#define-an-env-variable-for-a-container)
        - volumeMounts: 声明卷在容器中的挂载位置 - [参考](https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/#background)
          - mountPropagation: 卷的挂载传播特性 - [参考](https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/#mount-propagation), 常用值如下:
            - None: 此卷挂载将不会感知到主机后续在此卷或其任何子目录上执行的挂载变化。 类似的，容器所创建的卷挂载在主机上是不可见的。这是默认模式
            - HostToContainer: 此卷挂载将会感知到主机后续针对此卷或其任何子目录的挂载操作。换句话说，如果主机在此挂载卷中挂载任何内容，容器将能看到它被挂载在那里
            - Bidirectional: 这种卷挂载和 HostToContainer 挂载表现相同。 另外，容器创建的卷挂载将被传播回至主机和使用同一卷的所有 Pod 的所有容器
        - resources: 为容器分配资源 - [参考](https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
          - requests: 为容器指定内存请求 - [参考](https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/#specify-a-memory-request-and-a-memory-limit)
            - cpu: CPU单位 - [参考](https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/#cpu-units)
            - memory: 内存单位 - [参考](https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/#memory-units)
            - ephemeral-storage: 对给定命名空间下的存储资源总量进行限制 - [参考](https://kubernetes.io/zh-cn/docs/concepts/policy/resource-quotas/#storage-resource-quota)
          - limits: 为容器限定资源
        - readinessProbe: 指示容器是否准备好为请求提供服务。如果就绪态探测失败， 端点控制器将从与 Pod 匹配的所有服务的端点列表中删除该 Pod 的 IP 地址。 初始延迟之前的就绪态的状态值默认为 Failure。 如果容器不提供就绪态探针，则默认状态为 Success - [参考](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)。
          - exec:
            - command:
          - periodSeconds: 指定了 kubelet 每隔 n 秒执行一次存活探测
          - initialDelaySeconds: 指定 kubelet 在执行第一次探测前应该等待 n 秒
        - livenessProbe: 指示容器是否正在运行。如果存活态探测失败，则 kubelet 会杀死容器， 并且容器将根据其重启策略决定未来。如果容器不提供存活探针， 则默认状态为 Success - [参考](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)
        - startupProbe: 指示容器中的应用是否已经启动。如果提供了启动探针，则所有其他探针都会被 禁用，直到此探针成功为止。如果启动探测失败，kubelet 将杀死容器， 而容器依其重启策略进行重启。 如果容器没有提供启动探测，则默认状态为 Success - [参考](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)
        - securityContext: 为 Pod 设置安全性上下文 - [参考](https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)
          - capabilities: 为容器设置权限 - [参考](https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/security-context/#set-capabilities-for-a-container)
          - allowPrivilegeEscalation - [参考](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/no-new-privs.md#changes-of-securitycontext-objects)
      - tolerations: Pod 容忍度，容忍度允许调度器调度带有对应污点的 Pod。 容忍度允许调度但并不保证调度 - [参考](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
      - volumes: 卷
        - hostPath: hostPath 卷能将主机节点文件系统上的文件或目录挂载到你的 Pod 中 - [参考](https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/#hostpath)