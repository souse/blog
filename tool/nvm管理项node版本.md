##### [nvm](https://github.com/creationix/nvm)
**1. 执行次命令会在 ～/.bashrc 新增一条判断.nvmrc的语句，
根据此语句来切换已经存在的node版本或者下载.nvmrc中指定的node版本**
```shell
echo 'alias cd='\''cdnvm(){ cd $@; if [[ -f .nvmrc && -s .nvmrc && -r .nvmrc ]]; then <.nvmrc nvm install; elif [[ $(nvm current) != $(nvm version default) ]]; then nvm use default; fi; };cdnvm'\''' >> ~/.bashrc
```

**2. 或者在.bashrc中直接添加下面代码**
```shell
cdnvm(){
  cd $@
  if [[ -f .nvmrc && -s .nvmrc && -r .nvmrc ]]; then
    <.nvmrc nvm install;
  elif [[ $(nvm current) != $(nvm version default) ]]; then
    nvm use default;
  fi
}
alias cd='cdnvm'
```