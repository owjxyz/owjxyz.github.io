---
layout: post
title: Lec. 10. C in Assembly Language
related_posts:
  # Specify via the path in the file system
  # - category/_posts/2020-01-01-other-post.md
  # Can also use the url of the post,
  # but this will break when changing the `permalink` setting!
  - /microprocessor/2024-05-25-Lec-13-General-Purpose-Input-Output-Pt.1/
  - /microprocessor/2024-05-26-Lec-14-General-Purpose-Input-Output-Pt.2/
  - /microprocessor/2024-05-27-Lec-15-Interrupts-Pt.1/
sitemap: false
hide_last_modified: true
---

C in Assembly Language

## Resource

[Online ARM converter (assembler)](https://armconverter.com)
Reference for study

<https://azeria-labs.com/writing-arm-assembly-part-1/>

<https://developer.arm.com/documentation/dui0662/b/The-Cortex-M0--Instruction-Set>

## Program build tools

<img width="688" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/66ad150b-db39-4428-bf0b-deb3639560dc">

Compiler: c나 header파일로 저장된 source file를 Assembly file로 변환

Assembler: compile된 assembly file을 기계어로 변환

Linker/Loader: 기계어 코드를 기존의 library file들과 link해줌

## Assembler

사람이 읽을 수 있는 assembly language module을 object 모듈로 변환

## If/Else

<img width="100" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/ab1886c5-c52b-4a60-a38b-a30cca5e48c6">

<img width="500" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/f948f032-f9e0-4c37-9c6a-b2d0b23dede4">

코드의 line number는 2자리씩 차이나는데 이는 어셈블리 코드가 2바이트씩 자리를 띄운다고 생각하면 된다.

2900, d001(16-bit Thumb mode)등의 code가 기계어 명령어 인데, 명령이 처리해주는 레지스터의 주소에 따라 같은 어셈블리 명령어라도 code가 달라지기도 한다. 

<img width="500" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/dc14c1d2-81a8-45db-b5b0-a3e5b5e93351">

방금 전의 조건문을 diagram으로 표현하면 위 그림과 같다.

## Switch

<img width="170" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/9e1b4077-7d82-48f0-9d31-70b53e9271c5">
<img width="500" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/b03b91cc-7a43-4bf5-85d2-c9bcc558e783">

<img width="713" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/c4d85c9c-86e9-4e49-93d8-21e2f78198b8">

## Do while
<img width="500" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/68bca063-98a9-45bf-9b47-4d0c04f88ceb">

CMP는 r1 레지스터의 값과 0x14를 빼준 결과의 flag를 업데이트하고,

BCC는 C(Carry) flag를 check 해준다.

CMP의 Carry가 0이면 작은 경우이고 Carry가 1이면 크거나 같은 경우이다. 

CMP를 수행해줄 때, 두 수를 Unsigned 취급해서 수행해준다.

0x14 = 20을 two's complement로 빼 주었을 때, -20 = 1110\~~와  x를 더했을 때, 결과의 앞자리의 bit가 0이라면 carry가 발생하였다는 것을 말하고, x가 더 크다는 뜻이므로, C = 1이면 x가 더 크다. 반대로 앞 자리의 bit가 1이라면 carry가 발생하지 않은 경우(C = 0)이고, 결과가 음수이게 되므로 x가 더 작다는 것을 뜻하게 된다.

<img width="400" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/f3f93947-79d1-4bdd-bb87-e6eb51668f17">

## While

<img width="600" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/5bf7355e-0caf-499a-b450-1c3592cb5182">

While은 Do while과는 달리 먼저 조건을 check를 해주는 link로 넘어가서, 조건을 만족하는 경우에만 code가 실행되도록 해준다.

<img width="400" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/970027d7-4d31-47cd-8d9e-ace559ff1e42">

## FOR

<img width="700" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/32301a6a-cc70-4e96-a708-e1f17d30480e">

For문은 먼저 초기화를 수행해준 후에 While문과 비슷하게 조건을 check하고, 만족하는 경우 반복문 내의 code를 수행해주도록 한다.

<img width="600" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/f512a354-bffe-4b88-970f-4fd6e657d000">

## Calling Subroutines

C언어에서의 Function의 경우 subroutine을 통해서 구현된다.

<img width="600" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/49f51af1-8ea9-47f3-948e-e901e947e224">

함수 호출이 일어나면 MOVS를 통해서 함수에 전달해주는 값을 레지스터에 복사를 시켜준다. 이후 fun5라는 function을 호출하고 함수가 수행되는 곳으로 jump를 해주게 되는데 현재 위치(함수의 반환주소, 위 코드의 경우 STR 문의 주소)를 LR(link register)에 저장해준다.

fun5 함수가 끝나고 반환주소로 돌아오게 되면 r0라는 곳에 저장된 결과값을 스택 포인터의 첫번째 주소가 가리키는 곳에 저장해준다. 

## Register use convention

레지스터는 마음대로 저장해줄 수 있지만, 레지스터를 사용하는 것에 전통적인 규칙이 있다.

<img width="687" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/cc2a062f-a0fa-4a07-a4ce-657271fb77e2">

PC는 현재 실행되는 위치

LR은 주로 BL과 BLX에 의해 반환 주소가 저장된다.

SP는 Stack pointer의 top 주소

R0\~R3는 주로 함수의 입력 값을 저장한다. R0, R1은 주로 함수의 반환 값이 저장되고, R0~R3는 함수가 끝났을 때 원래의 값으로 다시 복원해줄 필요가 없다.

R4\~R11까지의 레지스터는 함수가 끝났을 때, 원래의 값이 복구되는 것을 암묵적으로 약속하고 있기 때문에 구현시에 유의하여 이와 관련한 구문을 포함해주어야 한다.

## Function arguments / Return values

argument는 레지스터(4개로 제한)나 메모리에 의해 전달된다. 레지스터의 속도가 빠르기 때문에, compiler는 주로 레지스터를 활용해서 argument를 전달할 수 있도록 assembly code를 작성한다.
- 4 byte의 배수 길이로 argument를 사용
- 64bit arguments 짝수 개수의 레지스터를 사용해서 전달 (작은 부분은 R0, R2, 큰 부분은 R1, R3에 저장)
- 레지스터의 개수를 넘치는 경우 stack을 사용한다.

Function의 return value는 r0, r1, stack 을 통해 전달받는다. 64bit return값도 32bit 씩 나누어 전달을 받는다.

## Prolog and Epilog

<img width="500" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/2af39530-bc69-42a6-a64a-c4bd26beca10">

함수가 실행될 때를 prolog, 함수가 끝날 때를 Epilog라고 한다.

<img width="691" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/d178deaf-e036-4ef1-88da-e245566a8580">

#### Prolog
1. 보존해주어야 할 레지스터를 저장해준다. 
	- 위 fun4의 경우 r4를 사용하려고 하므로 원래의 값을 stack에 저장해주고 있다. 또한 LR(link register)에 함수 실행 이후 돌아갈 주소를 저장해주었으므로 해당 값 또한 stack에 저장해준다. 이는 함수 내에 다른 함수가 호출되었을 경우 LR이 수정되기 때문에 이러한 경우 반환 주소가 유실되는 것을 방지해주기 위해 필요하다.
2. Stack을 call 해서 activation record를 설정한다.
	- 이는 함수 내 지역변수를 위한 공간을 마련한다는 뜻이다. -> SUB sp, sp, \#0x20 = int x\[8]
	- 이렇게 선언된 변수의 경우 \[sp, \#0], \[sp, \#4] 등을 통해 x\[0], x\[1]에 접근해준다.
3. 필요한 경우 automatic variable에 대한 initializing이 필요하다.

<img width="684" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/96a5be7d-76a9-47f3-994b-bb85ce7998eb">

A - \#n 을 통해 주소를 보여주고 있다. 지정해준 순서대로 stack에 정보가 저장되게 된다.

위 일련의 과정을 통해 Prolog가 끝나게 된다. 함수가 끝나게 되면 A라는 초기 위치로 돌아와야 하는데, 이 과정을 Epilog에서 수행해준다.

#### Epilog
<img width="703" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/4ba2f316-a97a-4989-b2d1-104e5b669730">

1. 반환 값을 적절한 위치에 저장해준다.
2. 복원해주어야 하는 레지스터 값을 복구시켜준다.
3. 호출한 함수로 이동한다.

<img width="678" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/e37b1105-a9a5-41ee-98c0-b3804089227a">

ADD sp, sp, \#0x20 을 통해 Stack pointer가 가리키는 주소를 LR이 저장되었던 곳으로 이동시키고, LR 값은 돌아갈 주소를 저장하고 있으므로, POP {r4, pc}를 통해 PC에 돌아갈 반환주소를 넣어주도록 하고, r4에 원래 있던 값을 복원해주었다.
이를 통해 원래 함수 호출 이전인 A 주소로 이동하게 되었다.

## Data memory

#### Statically allocated memory
<img width="696" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/f908dee8-acd7-4209-999f-96227144a7f1">

AREA는 섹션을 지정하기 위함 (프로그램들을 보기 쉽게 구역을 나누어 준 것)
DCD는 constant 값을 메모리에 저장하는 역할로, 이후 입력한 값의 위치를 위쪽 줄의 레이블로 지정하는 것이다. 

||siA||

	DCD 0x00000000 -> 0x00000000의 주소를 ||siA||에 저장

|L1.312|

	DCD ||siA||의 주소를 |L1.312|에 저장

;;;20 siA = 2;
- MOVS를 통해 R1에 2라는 값이 저장이 되었고, LDR를 통해 R2에 |L1.312|가 가리키고 있는 ||siA|| 라는 주소 값이 저장되게 된다. 
- STR를 통해 R2가 가리키고 있는 siA에 2라는 값이 저장되게 된다.

;;;21 aiB = siC + siA
- LDR을 통해 r1에 먼저 ||siC||의 주소를 담는다.
- LDR을 통해 r1에 ||siC||의 값을, r2에 ||siA||의 값을 각각 담는다.
- 이후 r1에 r1과 r2의 값을 더한 값을 넣어준다. 
- r1의 값을 \[sp, \#0xc]를 통해 aiB에 저장해준다.

#### Automatically allocated memory
Using stack
<img width="652" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/df55eedd-9cb9-48dd-9563-a4e804952215">

Stack을 이용하는 방법을 automatically allocated memory라고 한다.

Static은 우리가 각 포인터 변수들을 손으로 직접 지정해주었던 반면, Automatically의 경우 stack으로 일정량 을 할당해줄 수 있다. 

PUSH {r0-r3,lr}을 통해 stack에 해당 변수들을 저장한다.

이후 SUB sp, sp, \#0x10 을 통해서 변수를 저장할 공간을 할당하고, r1에 임시적으로 4, 5, 6이라는 값을 저장하여 각각 \[sp, \#8], \[sp, \#4], \[sp, \#0]에 저장한다. 

<img width="500" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/e2ba2291-c0ea-497d-93e0-acf4d4bcf506">

#### Dynamically allocated memory

<img width="678" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/12dabf7b-1fca-4f7a-92c3-0f26396873fd">

\[sp, \#0xc]의 값 (aiB)의 주소 값을 r0에 저장

r0의 값을 r1에 복사

r1 = r1 + 1을 수행

이 r1을 다시 r0에 저장

<img width="500" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/e2ba2291-c0ea-497d-93e0-acf4d4bcf506">
