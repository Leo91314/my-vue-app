# macOS 开发环境配置指南

本项目记录了在 macOS（Apple Silicon）上搭建完整开发环境的步骤和配置详情。

## 环境概览

- 操作系统：macOS (darwin 24.5.0)
- 处理器架构：Apple Silicon (arm64)
- 默认 Shell：/bin/zsh

## 数据库配置

### MongoDB

1. 通过 Homebrew 安装：
```bash
brew install mongodb-community
```

2. 启动 MongoDB 服务：
```bash
brew services start mongodb-community
```

### Redis

1. 通过 Homebrew 安装：
```bash
brew install redis
```

2. 启动 Redis 服务：
```bash
brew services start redis
```

3. 验证安装：
```bash
redis-cli ping
```

## Shell 环境配置

### Oh My Zsh

1. 安装 Oh My Zsh：
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

2. 已配置插件：
- git
- zsh-autosuggestions
- zsh-syntax-highlighting
- npm
- node
- macos

## Python 开发环境

### Anaconda

1. 安装 Anaconda（通过官网下载 Apple Silicon 版本）

2. 创建 PyTorch 环境：
```bash
conda create -n pytorch2023 python=3.9
conda activate pytorch2023
```

3. 安装 PyTorch（支持 Apple Silicon MPS）：
```bash
conda install pytorch torchvision torchaudio -c pytorch
```

4. 数据科学包配置：
- Jupyter Notebook
- NumPy
- Pandas
- Matplotlib
- Scikit-learn

## IDE 配置

### PyCharm Community Edition

1. 通过 Homebrew 安装：
```bash
brew install --cask pycharm-ce
```

## 版本控制

### Git

1. 通过 Homebrew 安装：
```bash
brew install git
```

2. 基础配置：
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 注意事项

1. 所有软件均已针对 Apple Silicon (arm64) 架构优化
2. MongoDB 和 Redis 服务已配置为开机自启动
3. Python 环境已针对机器学习和数据科学进行优化

## 维护说明

如需更新各组件：

1. Homebrew 包更新：
```bash
brew update && brew upgrade
```

2. Conda 环境更新：
```bash
conda update --all
```

3. Oh My Zsh 更新：
```bash
omz update
```
