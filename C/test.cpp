// 1.test vscode 配置c/c++环境
// #include <iostream>
// using namespace std;
// int main() {
//   cout << "heeeee\n";
//   printf("hello world123\n");
//   getchar();
//   return 0;
// }

// #include <stdio.h>
// void test(int x) {
//   x=1024;
//   printf("000 x=%d\n", x);
// }

// int main() {
//   int x = 1;
//   printf("ttt x=%d\n", x);
//   test(x);
//   printf("ttxxxt x=%d\n", x);
//   getchar();
//   return 0;
// }

// 2.顺序表固定分配内存空间和初始化
// #include <stdio.h>
// #define MaxSize 10
// typedef struct {
//   int data[MaxSize];
//   int length;
// } SqList;

// void InitList(SqList &L) {
//   for (int i = 0; i < MaxSize; i++)
//   {
//     /* code */
//     L.data[i] = 0;
//   }
//   L.length = 0;
// }

// int main() {
//   SqList L;
//   InitList(L);
//   for (int i = 0; i < MaxSize; i++)
//   {
//     /* code */
//     printf("data[%d]=%d\n", i, L.data[i]);
//   }
//   getchar();
//   return 0;
// }

// 3.线性表动态分配内存空间（增加长度）
// #include <stdio.h>
// #include <stdlib.h>
// #define InitSize 10
// typedef struct {
//   int *data;
//   int MaxSize;
//   int length;
// } SeqList;

// void InitList(SeqList &L) {
//   L.data = (int *)malloc(InitSize*sizeof(int));
//   L.length = 0;
//   L.MaxSize = InitSize;
// }

// void IncreaseSize(SeqList &L, int len){
//   int *p = L.data;
//   L.data = (int *)malloc((L.MaxSize+len)*sizeof(int));
//   for (int i = 0; i < L.length; i++)
//   {
//     /* code */
//     L.data[i] = p[i];
//   }
//   L.MaxSize = L.MaxSize+len;
//   free(p);
// }

// int GetElem(SeqList L, int i) {
//   return L.data[i-1];
// }

// int main () {
//   SeqList L;
//   InitList(L);
//   IncreaseSize(L, 5);
//   return 0;
// }

// 4.顺序表的插入和删除
// #include <stdio.h>
// #define MaxSize 10
// typedef struct {
//   int data[MaxSize];
//   int length;
// } SqList;

// void InitList(SqList &L) {
//   for (int i = 0; i < MaxSize; i++)
//   {
//     /* code */
//     L.data[i] = 0;
//   }
//   L.length = 0;
// }

// bool ListInsert(SqList &L, int i, int e) {  // ***
//   if (i < 1 || i > L.length + 1) return false;
//   if (L.length >= MaxSize) return false;
//   for (int j = L.length; j>=i; j--)
//   {
//     /* code */
//     L.data[j] = L.data[j-1];
//   }
//   L.data[i-1] = e;
//   L.length++;
//   return true;
//   // 平均时间复杂度 n/2
// }

// bool ListDelete(SqList &L, int i, int &e) { // ***
//   if (i < 1 || i > L.length) return false;
//   e = L.data[i-1];
//   for (int j = i; j < L.length; j++)
//   {
//     /* code */
//     L.data[j-1] = L.data[j];
//   }
//   L.length--;
//   return true;
//   // 平均时间复杂度n-1/2
// }

// int GetElem(SqList L, int i) { // 按位查找
//   return L.data[i-1];
//   // 平均时间复杂度 1
// }

// int LocateElem(SqList L, int e) {
//   for (int i = 0; i < L.length; i++)
//   {
//     /* code */
//     if(L.data[i] == e) {
//       return i+1;
//     }
//     return 0;
//   }
//   // 平均时间复杂度 n+1/2
// }

// int main() {
//   SqList L;
//   InitList(L);
//   ListInsert(L, 3, 3);
//   int e = -1;
//   if(ListDelete(L, 3, e)) {
//     printf("delete=%d\n", e);
//   } else {
//     printf("delete fail\n");
//   }
//   getchar();
//   return 0;
// }


// 5.
// #include <stdio.h>
// #define MaxSize 7
// typedef struct {
//   int data[MaxSize];
//   int length;
// } SqList;

// void InitList(SqList &L) {
//   L.data[0] = 1;
//   L.data[1] = 2;
//   L.data[2] = 2;
//   L.data[3] = 2;
//   L.data[4] = 3;
//   L.data[5] = 3;
//   L.data[6] = 4;
//   L.length = 7;
// }
// bool Delete_Same(SqList &L) {
//   if (L.length == 0) return false;
//   int i,j;
//   for (i = 0, j=1; i < L.length; j++)
//   {
//    if (L.data[i]!=L.data[j])
//    {
//      L.data[++i] = L.data[j];
//    }
//   }
//   L.length = i +1;
//   return true;
// }

// int search(int[7] L, int target) {

// }

#include <iostream>
using namespace std;


int main() {
  cout<<sizeof(double)<<endl;
  getchar();
  return 0;
}