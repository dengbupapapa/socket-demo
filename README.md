# socket-demo
### 功能：
###### 1.支持群发
###### 2.单点推送(/chat/:user)
### bb两句：
###### 1.访问端口号8000
###### 2.若访问时带querystring user 则该用户服务session为uservalue,不设置则为默认的'none'
###### 3.node server和socket server是通过session关联上的并记录在变量userKeyForSockets中进行一一对应的键值对
###### 4./chat/:user 是单点推送的一个小例子，虽然糙了点。。。。但是大概就是这个意思。。
### 使用：
###### 1.npm install
###### 2.npm start
