

#### 1、新启动进程

```json
{
    ...

    "env": {
      "NODE_ENV": "development"
    },
    "env_production" : {
      "NODE_ENV": "production"
    }

}

// 指定使用的环境变量
pm2 start pm2.json --env production

```

#### 2、Restart or Reload 进程

```
pm2 reload pm2.json --update-env

pm2 reload pm2.json --update-env --only koa-demo

```

### 3、直接注入

```
DEBUG=* pm2 reload pm2.json --update-env

```