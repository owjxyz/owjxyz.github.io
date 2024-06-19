---
layout: post
title: Lec. 8. ARM Cortex-M0+ Core Pt.1
related_posts:
  # Specify via the path in the file system
  # - category/_posts/2020-01-01-other-post.md
  # Can also use the url of the post,
  # but this will break when changing the `permalink` setting!
  - /microprocessor/2024-04-06-Lec-9-ARM-Cortex-M0+-Core-Pt.2/
  - /microprocessor/2024-04-07-Lec-10-C-in-Assembly-Language/
  - /microprocessor/2024-05-25-Lec-13-General-Purpose-Input-Output-Pt.1/
sitemap: false
hide_last_modified: true
---

ARM Cortex-M0+ Core

<img width="700" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/002b101a-7858-404c-a243-e367c49a0bf4">

## Basic terminology
- Instruction - 명령어의 집합
- operation - 연산자(명령문)
- operand - 피연산자

## CPU core
#### Simplified Structure

<img width="671" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/23d2b5a9-f7f6-48f2-9bb5-8883f1277fff">

- Program memory(PM)
	- 연속된 instruction 다발이 저장되는 장소
- Program counter(PC)
	- PM에서 다음으로 실행할 instruction의 주소를 가리키는 특수목적 레지스터
- Arithmetic/Logical Unit(ALU)
	- 연산장치
	- 연산자를 이용해서 데이터 처리를 수행함
	- ex) addition, subtraction, logic operation(AND, OR, XOR, ...)
	- 레지스터 파일로부터 명령어에 요구되는 피연산자를 가져옴
- Resister file
	- ALU가 처리해줄 또는 처리한 정보를 일시적으로 저장하는 저장공간
	- 쉽게 접근 가능하지만, 그 크기가 작아 적은 수의 item만 hold 할 수 있다.
- Data memory(DM)
	- long-term동안 data를 저장할 수 있는 공간
	- MB 또는 이상의 단위를 가짐.
	- 그러나 속도가 느리고, 접근이 복잡하다
- Control logic
	- 불러온 instruction을 다양한 컨트롤 및 데이터 시퀀스로 디코딩해준다

#### Instruction processing

1. CPU가 PC에서 지정한 PM 주소로부터 instruction을 읽어온다.
2. Control logic이 읽어온 명령어를 디코딩 하고 Control signal을 생성한다.
	- 레지스터 파일 내 어떤 레지스터를 Source operand로 읽어들일지
	- 어떻게 다른 피연산자를 생성할지(DM에서 어떻게 register로 operand를 불러올지)
	- ALU가 연산을 수행할 지, 또는 메모리가 접근할지에 여부
	- 레지스터 파일 내의 어떤 레지스터에 결과를 저장할지
	- PC에 상황을 업데이트 하는 방법

## Architecture

아키텍처는 프로세서의 몇 가지 특성을 정의한다.
- Programmer's model: operating modes, registers, memory map
- Instruction set architecture: instructions, addressing modes, data type
- Exception model: interrupt handling
- Debug architecture: debug features

ARM Cortex-M0+ 프로세서는 ARMv6 아키텍처를 구현한다
- 레지스터 파일에 있는 데이터만 처리 가능하다.
- DM에 있는 데이터는 즉시 처리될 수 없고, 레지스터 파일에 적재되어야 하고 나중에 다시 저장되어야 할 수 있다.
	- load/store architecture -> 하드웨어 디자인을 간단하게 한다.
- native data type: ALU와 레지스터들에 사용되는 Primary data type으로 ARM Cortex-M 시리즈의 경우 32-bit integer 형을 가진다.

## Registers in Programmer's model

<img width="680" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/765eb034-b6cf-48a2-a5bb-93811b8e292c">

- 다수의 32-bit 레지스터
- General purposed registers(GPRs)
	- R0~R12: general purposed registers for data processing
	- R13: stack pointer(SP)
	- R14: link register(반환해줄 address를 hold 하고 있음)
	- R15: Program counter(다음 instruction의 주소를 hold 하고 있음)
- Special Purposed registers(SPRs)
	- Program status register(PSR): 세가지 다른 관점
	- <img width="645" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/2b61f989-5e1f-438a-be4a-625ddefd505d">

		- Application PSR(APSR): condition code flag를 보여준다
			- Condition code flag: instruction의 결과가 음수면 N, 0이면 Z, 또는 결과에서 Carry(C)나 Overflow(V)가 발생했는지를 나타냄
		- Inturrupt PSR(IPSR): exception number를 저장 // similar with error code
		- Execution PSR(EPSR): Thumb mode의 활성화를 가리킴
			- ARM mode: 32-bit instruction mode
			- Thumb mode: 16-bit instruction mode / 보다 효율적인 메모리 사용 가능
	- PRIMASK register
		- 여러 종류의 interrupt가 존재하는데 원하는 inturrupt만을 취하도록 하기 위해 bit를 Masking해줌
	- CONTROL register
		- SPSEL이라고 불리는 하나의 field를 포함하고 있는데, 이는 어떠한 stack pointer가 사용되는지를 결정해준다.

## Memory

#### Memory map

ARMv6-M architecture: 32-bit 주소 공간을 지원하고, 2^32개의 위치가 주소화될 수 있다.

주소는 특정 바이트를 나타낸다 -> byte-addressable

> 2^32 = 4GB의 메모리. 따라서 32bit는 최대 4GB의 메모리를 사용할 수 있음

주소 공간은 각각의 사용 목적에 따라 여러 개의 구역으로 나뉜다.
- Code memory
- On/off-chip SRAM for storing data
- On/off-chip peripheral device control/status registers
- Private bus with fast access to peripherals
- Space for system control/status registers

<img width="702" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/9032cec0-b058-40d1-83ce-5cb2dd9b2cb0">

KL25Z128VLK4에서는 128KB의 공간을 code 저장을 위한 ROM flashing 에 사용하고, 16KB 공간을 read/write memory(SRAM)에 사용

## Endianness

<img align="right" width="232" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/245ae1bc-f59b-4c94-923c-286790f40f2c">

- endianness
	- multi-byte 구조를 1차원의 메모리에 저장하는 순서를 의미한다.
- little-endian
	- Least-significant byte가 메모리에 먼저 저장된다.
- least-significant
	- 2바이트의 경우 0~255를 나타내는 앞쪽 바이트(작은 자리수)를 의미한다. 
- big-endian
	- Most-significant byte가 메모리에 먼저 저장된다.
- most-significant
	- 2바이트의 경우 256~65280을 나타내는 뒤쪽 바이트(큰 자리수)를 의미한다.

ARMv6-M 아키텍처의 경우 instruction이 항상 little endian이다. endianness는 CPU 구현방식에 따라 다르다.
