c < log2N < n < n * Log2N < n^2 < n^3 < 2^n < 3^n < n!

## C基础
4种基本类型
char 字符型 1字节
int 整型，用来装整数 4字节
float 单精度浮点型 4字节
double 双精度浮点型 8字节

short 使int型尽可能的变短 2字节
long 使int型尽可能的变长

```cpp
#include <iostream>
using namespace std;
int main() {
  cout<<sizeof(double)<<endl;
  cout<<sizeof(10.0)<<endl; // 默认double
  cout<<sizeof(10.0f)<<endl; // float
  cout<<31<<endl;  // 10 进制
  cout<<037<<endl; // 8进制
  cout<<0x1f<<endl; // 16进制
  getchar();
  return 0;
}
```

类型转换
短的向长的转换
short  char 
   int
unsigned  int 
float   long
   double

强制转换   （类型名）表达式
（float） a
（double） a

函数返回默认返回int型

静态变量 static 不会被回收
```cpp
void f() {
  static int a = 0;
  ++a;
  cont<<a<<endl;
}
int main() {
  for(int i = 0; i <= 5; ++i) {
    f();
  }
  getchar()
  return 0;
}
// 输出 1 2 3 4 5 6
```

```cpp
#include <iostream>
using namespace std;

int main() {
  int a[10] = {1,2,3,4,5,6,7,8,9,10};
  int *p = a;
  for(int i = 0; i < 10; ++i) {
    cout<<*(p+i)<<" ";
    cout<<endl;
    getchar()
    return 0;
  }
}
// 1 2 3 4 5 6 7 8 9 10
```

```cpp
int add(int a, int b) {
  return a+b;
}
int minu(int a, int b) {
  return a-b;
}
int main() {
  int (*p)(int int);
  char op = "-";
  if(op == "+") {
    p = add;
  } else {
    p = minu;
  }
  cout<<p(3,4)<<endl;
  return 0;
}
```

类型定义（typedef）
typedef int MYINT
MYINT a = 1;
// 相当于 int a = 1;

struct {int x;int y;} point;
point.x = 10;
point.y = 11;

typedef struct {
  int x;
  int y;
} Point;

int main() {
  Point point;
  point.x = 10;
  point.y = 11;
  return 0;
}

## 线性表
- 线性表是具有相同数据类型的n个数据元素的有限序列

### 顺序表（顺序存储）
- 用顺序存储的方式实现线性表顺序存储
- 把逻辑上相邻的元素存储在物理位置上也相邻的存储单元中
1. 随机访问 （查的时候）
2. 存储密度高（占用连续的存储空间）
3. 扩展容量不方便
4. 插入删除数据元素性能相对较低
```cpp 
// 静态分配
#define MaxSize 10
typedef struct {
  ElemType data[MaxSize];
  int length
} SqList;

// 初始化顺序表
void InitList(SqList &L) {
  for(int i = 0; i < MaxSize; i++) {
    L.data[i] = 0; // 初始化顺序表不置为0的话，可能会有脏数据
  }
  L.length = 0;
}

// 插入操作         L       3    3
bool ListInsert(SqList &L, int i, int e) {
  if (i < 1 || i > L.length + 1) return false; // 判断i是否有效
  if (L.length >= MaxSize) return false; // 判断是否存满
  for(int j=L.length; j>=i; j--) {
    L.data[j] = L.data[j-1];  // [j -i 1]为2
  }
  L.data[i-1]=e; // [i - 1]为2
  L.length++;
  return true
}

// 删除操作
bool ListDelete(SqList &L, int i, int e) {
  if (i < 1 || i > L.length + 1) return false; // 判断i是否有效
  e = L.data[i-1];
  for(int j=i; j<L.length; j++) {
    L.data[j-1] = L.data[j];
  }
  L.length--;
  return true;
}

// 按号查找
ElemType GetElem(SqList L, int i) {
  return L.data[i - 1];
}

// 查值查找
int LocateElem(SqList L, ElemType e) {
  int i;
  for(i = 0; i < L.length; i++) {
    if (L.data[i] == e) {
      return i + 1; // 下标为i，位序i+1
    }
    return 0;
  }
}

int main() {
  SqList L;
  InitList(L);
  ListInsert(L, 3, 3)

  int e = -1;
  ListDelete(L, 3, e)
  return 0;
}
```

```cpp
// 动态分配
#define InitSize 10
typedef struct {
  int *data;
  int length, MaxSize;
} SeqList;

void InitList(SeqList &L) {
// 用malloc函数申请一片连续的存储空间
  L.data = (int *)malloc(InitSize * sizeof(int));
  L.length = 0;
  L.MaxSize = InitSize;
}

void IncreaseSize(SeqList &L, int len) {
  int *p = L.data;
  L.data = (int *)malloc((L.MaxSize + len) * sizeof(int));
  for(int i = 0; i < L.length; i++) {
    L.data[i] = p[i]
  }
  L.MaxSize = L.Maxsize + len;
  free(p);
}

int main() {
  SeqList L;
  InitList(L);
  IncreaseSize(L, 5)
  return 0;
}
```

## 链表（链式存储）
1. 单链表（带头节点和不带头节点）
- 不需要大片连续空间，改变容量方便
- 不可随机存取，要耗费一定空间存放指针

```cpp
typedef struct LNode {
  ElemType data;
  struct LNode *next;
}LNode, *LinkList; // 强调LNode是节点，LinkList是链表

// 头 / 尾插法创建链表
/** 尾插法可和输入插入的顺序一样 */
bool ListTailnsert(LinkList &L) {
  LNode *s;
  int x;
  L=(LinkList)maclloc(sizeof(LNode));
  L->next = NULL;
  // x为输入的数
  while(x != 9999) {
    s = (LNode *)malloc(sizeof(LNode));
    s -> data = x;
      /**
      * 头插法
      * s -> next = L -> next;
      * L -> next = s;
      */
    r -> next = s;
    r =s 
  }
  // 尾插法尾节点指针置空
  r ->next =NULL
  return L;
}

// 按号查询
int GetElem(LinkList L, int i) {
  int j=1;
  LNode *p = L->next;
  if (i == 0) return L;
  if(i<1) return NULL;
  while(p!=NULL && j<i) {
    j++;
    p = p->next;
  }
  return p;
}
// 按值查找
int LocateElem(LinkList L, ElemType e) {
  LNode *p = L->next;
  while(p!=NULL && p->data == e) {
    p = p->next;
  }
  return p;
}

// InsertPriorNode(LNode *p, ElemType e) 在p节点之前插入
bool InsertPriorNode(LNode *p, ElemType e) {
  if(p == NULL) return false;
  LNode *s = (LNode *)malloc(sizeof(LNode));
  if (s == NULL) return false;
  // s变成p，p变成要插入的元素
  s -> next = p -> next; 
  p -> next = s;
  s -> data = p -> data; // p的值给s
  p -> data = e;
  return true;
}
// 往后插入 O(n)
bool ListInsert(LinkList &L, int i, ElemType e) {
  if(i<1) return false;
  // if(i == 1) { // 不带头节点要多加个处理
  //   LNode *s = (LNode *)malloc(sizeof(LNode));
  //   s -> data = e;
  //   s -> next = L;
  //   L = s;
  //   return true;
  // }
  LNode *p;
  int j = 0;
  p = L;
  while (p != NULL && j < i-1) {
    p = p -> next;
    j++
  };
  if (p == NULL) return false;
  LNode *s = (LNode *)malloc(sizeof(LNode));
  s -> data = e;
  s -> next = p -> next;
  p -> next = s;
  return true
}

// 删除
bool LIstDelete(LinkList &L, int i, ElemType &e) {
  if(i < 1) return false;
  LNode *p;
  int j = 0;
  p = L;
  while (p != NULL && j < i-1) {
    p = p -> next;
    j++
  };
  if (p == NULL) return false;
  if (p -> next == NULL) return false;
  LNode *q = p -> next; // 要被删除的节点 p q ?
  e = q -> data;
  p -> next = q -> next; // 将 q节点断开  p ?
  free(q);
  return true;
}
// 删除指定节点 p
bool DeleteNode(LNode *p) {
  if (p == NULL) return false;
  LNode *q = p -> next; // p q ? 
  p -> data = p -> next -> data; // q的数据给p
  p -> next = q -> next; // p的下一个指向?   此时q的数据被搬移到了p，p被q覆盖，此时的q是多余的
  free(q);
  return true;
}
// 不带头节点
bool InitList(LinkList &L) {
  L = NULL;
  return true
}
// 带头节点
bool InitList(LinkList &L) {
  L = (LNode *)malloc(sizeof(LNode));
  if(L == NULL) { // 内存不足分配失败
    return false
  };
  L -> next = NULL;
  return true;
}
```

2. 双链表
- 
```cpp
typedef struct DNode {
  ElemType data;
  struct DNode *prior, *next;
}DNode, *DLinkList;

// 初始化双链表
bool InitDLinkList(DLinklist &L) {
  L = (DNode *)malloc(sizeof(DNode));
  if (L == NULL) return false;
  L -> prior = NULL;
  L -> next = NULL;
  return true;
}

// 在p节点之后插入s节点
bool InsertNextDNode(DNode *p, DNode *s) {
  s -> next = p -> next;
  if(p -> next != NULL) { // 如果p节点有后继节点
    p -> next -> prior = s;
  }
  s -> prior = p;
  p -> next = s;
}

// 删除 
// p -> next = q -> next;
// q -> next -> prior = p;
// free(q)
```

## 顺序表vs链表
- 都属于线性表，都是线性结构

- 顺序表 优：查
优点: 支持随机存取，存储密度高
缺点：大片连续空间分配不方便，改变容量不方便

- 链表  优：创 增 删
优点：离散的小空间分配方便，改变容量方便
缺点：不可随机存取，存储密度低

## 栈 （先进后出）
- 只允许在一端进行插入或者删除操作的线性表

```cpp
#define MaxSize 10
typedef struct {
  ElemType data[MaxSize];
  int top; // 栈顶指针
}SqStack;

// 初始化
void InitStack(SqStack &S) {
  S.top = -1;
}
// 新元素入栈
bool Push(SqStack &S, ElemType x) {
  if (S.top == MaxSize-1) return false;
  // S.top = S.top + 1;
  // S.data[S.top] = x;
  S.data[++S.top] = x;
  return true
}
// 出栈
bool Pop(SqStack &S, ElemType &x) {
  if (S.top == -1) return false;
  // x = S.data[S.top];
  // S.top = S.top - 1;
  x = S.data[S.top--];
  return true
}
```

### 链栈
- 入栈/出栈 - 头部插入/头部删除（带头节点和不带头节点）

## 队列（先进先出）
```cpp
// 顺序存储
#define MaxSize 10
typedef struct {
  ElemType data[MaxSize];
  int front, rear; // 队头指针和队尾指针
} SqQueue;
// 初始化队列
void InitQueue(SqQueue &Q) {
  Q.rear=Q.front=0;
}
// 判队空
bool isEmpty(SqQueue Q) {
  if (Q.rear == Q.front) return true;
  else return false;
}
// 入队
bool EnQueue(SqQueue &Q, ElemType x) {
  if ((Q.rear+1) % MaxSize == Q.front) return false;
  Q.data[Q.rear] = x; // 插入队尾
  Q.rear=(Q.rear + 1)%MaxSize; // 指针后移
  return true;
}
// 出队
bool DeQueue(SqQueue &Q, ElemType &x) {
  if (Q.rear == Q.front) return false; // 队空
  x = Q.data[Q.front];
  Q.front=(Q.front + 1)%MaxSize; // 指针后移
  return true;
}


// 循环队列
// 队列判空：if(Q.rear == Q.front)
// 入队
// Q.data[Q.rear] = x;
// Q.rear=(Q.rear + 1)%MaxSize; // 队尾指针加一取模
// 出队
// x=Q.data[Q.front];
// Q.front = (Q.front+1)%MaxSize;
// 牺牲一个单元
// 队满条件： (Q.rear+1)%MaxSize == Q.front

// 如果不想牺牲一个单元的话，得加一个标记 size来记录入队出队++--
```
### 链队
- 用一个尾指针
- 入队/出队 - 头部删除/尾部插入（带头节点和不带头节点）

```cpp
// 带头节点的初始化
Q.front=Q.rear=(LinkNode *)malloc(sizeof(LinkNode));
Q.front->next=NULL;
// 带头判空
if(Q.rear == Q.front)
// 带头入队
LinkNode *s = (LinkNode *)malloc(sizeof(LinkNode));
s->data = x;
s->next = NULL;
Q.rear->next = s;
Q.rear = s; // 修改rear指针
// 带头出队
bool DeQueue(LinkQueue &Q, ElemType &x) {
  if(Q.front == Q.rear) return false; // 空队
  LinkNode *p = Q.front->next;
  x = p->data; // 返回队头元素
  Q.front->next = p->next; // 修改头节点的next指针
  if(Q.rear == p) Q.rear=Q.front; // 队列只剩最后一个元素 修改rear指针
  free(p);
  return true;
}

// 不带头节点的初始化
Q.front = NULL;
Q.rear = NULL;
// 不带头判空
if(Q.front == NULL)
// 不带头出队
bool DeQueue(LinkQueue &Q, ElemType &x) {
  if(Q.front == NULL) return false; // 空队
  LinkNode *p = Q.front;
  x = p->data; // 返回队头元素
  Q.front = p->next; // 修改头节点的next指针
  if(Q.rear == p) Q.rear=Q.front=NULL; // 队列只剩最后一个元素 修改rear指针
  free(p);
  return true;
}
```

- 双端队列
若数据元素输入序列为1，2，3，4，则哪些输出序列的合法的，哪些是非法的？
卡特兰数：1/(n+1) * C n/2n;

## 栈的应用
1. 括号匹配
2. 表达式求值应用。由三部分组成：操作数，运算符，界限符。
  - 后缀表达式
  - 前缀表达式

## 队列的应用
1. 对树的层次遍历
2. 图的广度优先遍历
3. CPU资源的分配
4. 打印数据缓冲区

## 特殊矩阵的压缩存储
- 出题方式和条件
1. 存储上三角？下三角？
2. 行优先？列优先？
3. 矩阵元素的下标从0？1？开始
3. 数组元素的下标从0？1？开始

三角矩阵
稀疏矩阵

## 串，既字符串
```cpp
#define MAXLEN 255
typedef struct {
  char ch[MAXLEN];
  int length;
}SString;
```

### KMP算法

```cpp
struct LNode * p = (struct LNode*) malloc(sizeof(LNode))
```

```js
function test() {
  var arr = [1,2,3,4,5];
  for (let i = 0, j = arr.length-1; i<j; i++, j--) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j]=temp;
  }
  return arr;
}
console.log(test())
```


```cpp
int findAndDelete(LNode *C, int x) {
  LNode *p, *q;
  p = C;
  while(p -> next != NULL) {
    if (p -> next -> data == x) {
      break
    }
    p = p -> next;
  }
  if (p -> next == NULL) return false;
  q = p -> next;
  p -> next = p -> next -> next;
  free(q);
  return true
}
```

### 二叉排序树
```cpp
// 二叉排序树非递归查找
BSTNode *BST_Search(BiTree T, ElemType key) {
  while (T != NULL && key != T->data) {
    if (key < T->data) {
      T = T->lchild;
    } else {
      T = T->rchild;
    }
    return T;
  }
}
// 二叉排序树插入操作
int BST_Insert(BiTree &T, KeyType k) {
  if (T == NULL) { // 原树空
    T = (BiTree).malloc(sizeof(BSTNode));
    T->key = k;
    T->lchild = T->rchild = NULL;
    return 1;
  }
  else if (k == T->key) {
    return 0; // 树中存在节点，插入失败
  }
  else if (k < T->key) {
    return BST_Insert(T->lchild, k);
  }
  else {
    return BST_Insert(T->rchild, k);
  }
}
// 构造二叉排序树
void Creat_BST(BiTree &T, KeyType str[], int n) {
  T=NULL;
  int i = 0;
  while(i < n) {
    BST_Insert(T, str[i]);
    i++;
  }
}
```