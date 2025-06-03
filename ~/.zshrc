# 设置主题
ZSH_THEME="robbyrussell"

# 启用插件
plugins=(
    git
    zsh-autosuggestions
    zsh-syntax-highlighting
    npm
    node
    macos
)

# 设置语言环境
export LANG=en_US.UTF-8

# 设置编辑器
export EDITOR='vim'

# Anaconda 配置
export ANACONDA_HOME=/opt/homebrew/anaconda3
export PATH="$ANACONDA_HOME/bin:$PATH"
export CONDA_AUTO_ACTIVATE_BASE=false

# 初始化 conda
__conda_setup="$('$ANACONDA_HOME/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "$ANACONDA_HOME/etc/profile.d/conda.sh" ]; then
        . "$ANACONDA_HOME/etc/profile.d/conda.sh"
    else
        export PATH="$ANACONDA_HOME/bin:$PATH"
    fi
fi
unset __conda_setup

# MongoDB 配置
export MONGODB_HOME=$HOME/mongodb
export PATH=$MONGODB_HOME/bin:$PATH
export MONGO_DATA_PATH=$HOME/data/db

# 一些有用的别名
alias zshconfig="vim ~/.zshrc"
alias ll="ls -la"
alias ..="cd .."
alias ...="cd ../.."
alias mongod="mongod --dbpath $MONGO_DATA_PATH"

# Conda 快捷命令
alias cenv="conda env list"
alias cact="conda activate"
alias cdea="conda deactivate"