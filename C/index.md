c < log2N < n < n * Log2N < n^2 < n^3 < 2^n < 3^n < n!

## 线性表
- 线性表是具有先沟通数据类型的n个数据元素的有限序列

### 顺序表（顺序存储）
- 用顺序存储的方式实现线性表顺序存储
- 把逻辑上相邻的元素存储在物理位置上也相邻的存储单元中
1. 随机访问 （查的时候）
2. 存储密度高
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

// 查
ElemType GetElem(SqList L, int i) {
  return L.data[i - 1];
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

// 下表 查询
ElemType GetElem(SeqList L, int i) {
  return L.data[i - 1];
}

// 值 查询 返回其位序
int LocateElem(SeqList L, int e) {
  for(int i = 0; i < L.length; i ++) {
    if (L.data[i] == e) {
      return i + 1;
    }
  }
  return 0;
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

// InsertNextNode(p, e)
bool InsertNextNode(LNode *p, ElemType e) {
  if (p == NULL) return false;
  LNode *s = (LNode *)malloc(sizeof(LNode));
  if (s == NULL) return false; // 内存分配失败
  s -> data = e;
  s -> next = p -> next;
  p -> next = s;
  return true
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

// void GetElem(L, i-1)

// struct LNode * p = (struct LNode *)malloc(sizeof(struct LNode));

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

// 插入 O(n)
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
  InsertNextNode(p, e)
  // if (p == NULL) return false;
  // LNode *s = (LNode *)malloc(sizeof(LNode));
  // s -> data = e;
  // s -> next = p -> next;
  // p -> next = s;
  // return true
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

// 尾插法创建链表
bool ListTailnsert(LinkList &L) {
  LNode *s, *r = L;
  // ...
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
    
    // ..
  }
  // ..
}

void test () {
  LinkList L;
  InitList(L);
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



```cpp
```



```cpp
struct LNode * p = (struct LNode*) malloc(sizeof(LNode))
```

```js
function Node() {
  this.data = null;
  this.next = null
}
function insertNode()
```