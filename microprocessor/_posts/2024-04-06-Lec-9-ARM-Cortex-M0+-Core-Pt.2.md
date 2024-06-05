---
layout: post
title: Lec. 9. ARM Cortex-M0+ Core Pt.2
description: >
  
sitemap: false
hide_last_modified: true
---

ARM Cortex-M0+ Core

## How to represent an instruction

기계어 혹은 어셈블리어로 작성된다.
- Machine language - 기계어
	- 오직 수로만 표현된 명령어 코드
	- CPU에 의해 직접 수행된다
- Assembly language - 어셈블리어
	- 기계어를 사람이 읽을 수 있도록 표현한 것
- Assembler
	- 어셈블리어로 작성된 코드를 기계어로 번역해주는 소프트웨어 도구


## Cortex-M0+ instructions

<img width="694" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/ac390883-9cd6-4d9a-9520-c1d78ee99ded">

#### Data movement instructions

MOV / MOVS
- 데이터를 GPRs로 복사해줌
- 예시
	- MOV R3, R5 -> R5 레지스터의 데이터를 R3 레지스터로 복사해줌
	- MOV R2, #151 -> 151이라는 값을 레지스터 R2로 복사해줌
- #0~255 까지(8bit가 커버하는 숫자 범위)는 값을 즉시 레지스터로 load해줄 수 있음.
- 그보다 더 큰 값은 LDR instruction을 사용해서 메모리로부터 load 해주어야 한다.
- MOVS instruction은 MOV instruction과 같은 operation을 수행해주지만, N과 Z flag를 업데이트 해줄 수 있다.

MRS / MSR
- CONTROL, PRIMASK, xPSR와 같은 SPRs에 있는 값을 복사하는 명령어
- MRS는 SPRs에 위치한 데이터를 GPRs로 복사해준다.
- MSR은 MRS와 반대로 GPRs에 있는 데이터를 SPRs로 복사해준다.

#### Data processing instructions

수학과 논리적 operation을 모두 수행한다
- 하나 또는 여러 개의 32-bit 데이터를 타겟으로 한다.
- 두 개의 레지스터를 쓰거나 한 개의 레지스터와 즉각적인 상수로 구성되어 작업을 수행한다.

Math operations
- Addition(합), Subtraction(차), Subtraction with reversed operands(뒤 operand에서 앞 operand를 빼줌) Multiplication(곱)
- ex) ADDS R0, R1, R2 -> R1과 R2 레지스터에 저장된 값을 더해서 그 결과를 R0 레지스터에 저장한다. Condition code flag를 APSR에 업데이트 해준다.

Logic operations
- Bitwise 연산(AND, OR)
- Complement가 있는 Bitwise 연산(NAND, NOR)
- Exclusive(XOR)
- Complement(NOT)
- Test(AND 연산을 수행하여 그 결과가 0이면 Z flag 지정, 0이 아니면 Z flag clear)
- ex) ANDS R4, R3, R7 -> R3, R7 레지스터에 위치한 레지스터를 AND 연산하여 그 결과를 R4 레지스터에 저장해주고 condition code flag를 APSR에 업데이트 한다.

Compare(Test)
-  두 operands 사에 다른 부분이 있는지 계산하고 그에 따른 condition code flags를 설정해준다. 그러나 계산된 값은 저장되지 않는다. (Test: Logical AND)
- ex) CMP R3, R5 -> R3 - R5 연산을 수행하고 그 결과에 따른 flag를 지정해준다.

Shift(Rotate)
- word를 왼쪽 또는 오른쪽으로 특정 bit 수 만큼 shift를 수행해준다. 논리/수학 operation을 모두 지원한다.
- ex) LSRS R1, #1 -> 레지스터 R1에 위치한 값을 한 비트만큼 오른쪽으로 이동시켜준다. 이는 logical shift이므로 MSB(최상단 비트)가 0으로 채워짐
- ASRS - MSB를 기존의 MSB에 위치한 값을 복사해서 채워줌
- LSRS - MSB를 무조건 0으로 채워줌
- LSLS - LSB를 무조건 0으로 채워줌. ASLS도 결국에는 bit를 0으로 채워줄 것이기 때문에 구분할 필요 없이 이 instruction을 사용해줌
- RORS - 오른쪽으로 bit shift 해주면서 LSB의 값을 MSB로 채워줌

Extend
- 8-bit 또는 16-bit 의 값을 32-bit 레지스터에 채워주기 위해 변환시켜줌
- 두 가지 방법으로 채워질 수 있는데, 이는 본래의 값이 Signed인지 Unsigned인지에 따라서 달라짐
- Unsigned extension: UXTB, UXTH (0으로 채움)
- Signed extension: SXTB, SXTH (sign 값으로 채움)

Reverse
- 바이트 순서를 역순으로 뒤집어주는 연산을 수행해준다.
- 32-bit word 전체에 대해서 수행해주거나, 16-bit words 2개로 나누어 수행해줄 수 있다.
- 이는 little-endian과 big-endian 데이터 사이의 변환을 제공한다.

#### Memory access instructions

메모리에 있는 데이터가 처리되기 전에 반드시 레지스터에 load 되어야(불러와져야) 한다. 연산이 수행된 후 메모리로 다시 저장되는 과정이 필요할 수 있다.

Memory addressing
- Offset addressing: 기준이되는 R#n 레지스터로부터 몇개 뒤에 위치하는지를 뜻하는 offset을 지정해주어 주소를 표현한다.
- offset - 다른 레지스터에 저장된 값 또는 즉각적인 상수 값
- base register는 주소 연산에 의해 수정되지 않는다.
- \[R0]:  R0 레지스터의 주소
- \[R0, #22]: R0+22, R0로 부터 22byte 뒤에 위치한 값의 주소
- \[R0, R3]: R0+n(which stored in R3), R0로 부터 R3에 저장되어 있는 상수 값 만큼의 bytes 뒤에 위치한 값의 주소

Load/Store instructions
- LDR: 32-bit word의 레지스터를 load한다. 지정된 source 주소로부터 4 byte의 값을 가져온다. 
- STR: destination 주소로 시작하는 4 byte 만큼의 레지스터 공간에 32-bit contents를 저장한다.
- ex) LDR R0, \[R4, #8] -> R4 레지스터로부터 8byte 뒤에 위치한 32-bit word line을 R0 레지스터로 load 해온다.
- ex) STR R1, \[R4, R5] -> R4 레지스터로부터 R5 레지스터에 저장되어 있는 상수 값 만큼의 byte 뒤에서부터 32-bit 공간에 R1 레지스터에 위치한 값을 저장해준다.
- 32-bit보다 작은 값에 대해서도 load/store를 수행해줄 수 있다. (STRB(1 byte), STRH(2 byte), LDRB(1 byte), LDRH(2 byte), LDRSB(signed 1 byte), LDRSH(signed 2 byte))
- ARMv6-M은 aligned data access(정렬된 값에 대한 접근)만 지원한다. -> ex) int형의 array\[n]이 선언되었을 경우,  array\[k]를 통해서나 array+4 등의 정렬된 값만 접근할 수 있고, array+1, array +3 등의 주소로부터 정렬되지 않는 int 값을 가져올 수 없다는 것을 의미한다.

Stack Instructions
- 서브 루틴의 호출/반환 시에 사용된다
- PUSH: 선택된 레지스터를 스택에 push(저장)해주고, stack pointer를 업데이트 해준다.
- ex) PUSH {R0, R5-R7} -> R0, R5, R6, R7 레지스터를 스택에 저장하고, Stack pointer에서 16(4*\4byte )를 빼준다. 빼주는 이유는 Stack 구조가 아래(주소 값이 큼)에서 부터 역순으로 쌓는 형태를 취하고 있기 때문이다. (Lec.8.의 Registers in Programmer's model의 그림 참고)
- POP: 스택으로부터 선택된 레지스터를 pop(읽기)해주고, stack pointer를 업데이트 해준다.
- ex) POP {R2, R4} -> R2, R4 레지스터를 스택으로 부터 load하고, Stack pointer에 8을 더해준다.

#### Control flow instructions

프로그램이 loop에서 코드를 반복하거나 선택된 코드 섹션에서 조건문을 수행하도록 해준다.
- PC(Program counter)값을 다른 값으로 바꾸어 준다.
- Unconditional branch: 조건 없이 항상 프로그램이 특정 목적지 주소로 이동하여 실행된다.
- ex) B Target_label -> Target_label로 이동
- Conditional branch: 주어진 조건을 만족하면 프로그램 특정 목적지 주소로 이동하여 실행된다.
- B 뒤에 특정 접미사를 추가해주어 조건을 지정해줄 수 있다. (BEQ, BNE 등등)
- <img width="640" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/30a8b927-3006-456a-979d-9910627311a2">
- ex) Branch if equal -> BEQ Target_label
- ex) Branch if not equal -> BNE Target_label
- ex) Branch if greater than -> BGT Target_label
- ex) Branch if greater than or equal -> BGE Target_label
- ex) Branch if less than -> BLT Target_label

For a subroutine call
- Branch and link (BL)
- Branch and link with ARM-Thumb exchange (BLX)

- BL/BLX가 실행되었을 때, return address가 LR(link register: 반환해줄 address hold)에 저장된다.
- return address: 서브 루틴이 종료된 후, 실행할 다음 instruction의 주소
- ex) BL Subroutine1
- ex) BLX R0
- Nested subroutine인 경우에는 stack instuction을 사용한다.
	- Nested subroutine: 하나의 서브 루틴 안에 다른 서브 루틴이 있는 것을 말함.
	- 안쪽에 위치한 서브루틴이 종료되었을 경우, 돌아갈 서브 루틴의 주소를 stack에 순차적으로 저장해주어야 정상적으로 본래의 서브루틴으로 돌아갈 수 있다.

#### Miscellaneous instructions

To control the PRIMASK register
- 수행할 interrupt와 예외처리 해줄 interrupt를 지정해준다.
- CPSID: 현재 실행 중인 프로세스의 interrupt를 비활성화 (interrupt disable)
- CPSIE: 현재 실행 중인 프로세스의 interrupt를 활성화(interrupt enable)

NOP
- 아무것도 하지 않도록 함

More additional instructions
- Debugging
- Exceptions
- Sleep mode
- Complex memory systems
- Signaling
- etc...
