## Coding style for accessing control bits

<img width="791" alt="Pasted image 20240531233056" src="https://github.com/owjxyz/EECE372/assets/89694988/adc4258d-d929-48b5-a27a-4f8d158cfaa0">

&n = &SIM_SCGC5; //접속

PORTA랑 PORTE를 1로 바꿔줌

-> SIM_SCGC5 = 0010_0010_0000_0000 (= 8704 = 2^13+2^9)

n = (1UL << 9) | (1UL<<13); = 8704; (UL = numeric literal 컴파일러가 부호x정수로 처리)

n = (1UL << PORTA) | (1UL << PORTE);

<img width="702" alt="Pasted image 20240531233949" src="https://github.com/owjxyz/EECE372/assets/89694988/32409441-4d18-452f-a04e-231a19d69807">

<img width="776" alt="Pasted image 20240531234217" src="https://github.com/owjxyz/EECE372/assets/89694988/d4cc1cf9-a834-428a-96f8-2711c80ff9cb">

## Reading, modifying, and writing fields in control registers

<img width="799" alt="Pasted image 20240531234351" src="https://github.com/owjxyz/EECE372/assets/89694988/dd32b356-3cc6-48d7-b18c-ff27f004e0e6">

위에 있는 MASK를 &해서 해당 위치에 있는 bit 뽑아내고  >> SHIFT 로 해당 비트를 최하위 비트로 옮겨옴

Modifying/Writing

set -> 1

clear -> 0

<img width="700" alt="Pasted image 20240531234813" src="https://github.com/owjxyz/EECE372/assets/89694988/e443718a-8116-4c60-a10a-22517799366d">

SCGC5 안에 값 다 넣어줌

<img width="718" alt="Pasted image 20240531234821" src="https://github.com/owjxyz/EECE372/assets/89694988/248c202d-10aa-41ad-a595-206556f0d34d">

SCGC5에 A랑 E만 값 SET

<img width="458" alt="Pasted image 20240531234827" src="https://github.com/owjxyz/EECE372/assets/89694988/060ee403-7405-4371-b931-42d25dcfbafc">

A만 0으로 바꿔줌

## Configuring the I/O path

많은 주변장치, 한정된 핀
- 포트가 여러개의 핀으로 구성
- 핀은 여러 개의 장치에 연결 될 수 있다.
- MCU가 활성화 된 장치를 선택할 수 있다.
- clock controller가 전력 소비 절약을 위해서 비활성화 포트들을 disable 시켜 줄 수 있다.
	- target 시스템에서 SIM 모듈이 이 명령을 수행해줄 수 있다. 

<img width="732" alt="Pasted image 20240531235604" src="https://github.com/owjxyz/EECE372/assets/89694988/55e6dda9-babb-4b92-bd1c-63145bcdd55d">

GPIO / UART / TPM2의 세 가지 방식이 있는데, 이를 SIM의 Clock signals을 통해서 선택해준다. data line이 연결됨.

## Clock gating

In Kinetis MCUs,

SIM control system clock gating이 Peripherals를 조절하기 위해  SCGC4~7을 사용한다. 

예로 SCGC5는 PORTA,B,C,D,E의 5개 포트에 대한 CG operation을 관리해준다.

포트를 비활성화 해주기 위해서 CMSIS 지원을 사용한다.

## Connecting a pin to a peripheral module

<img width="795" alt="Pasted image 20240601000827" src="https://github.com/owjxyz/EECE372/assets/89694988/6a06d75b-9a77-4b1c-8269-70cde64db98b">

PORTx_PCRn

x 번째 port의 각각의 비트가 고유한 32bit 짜리 Pin Controller Unit을 가진다.

<img width="548" alt="Pasted image 20240601001039" src="https://github.com/owjxyz/EECE372/assets/89694988/a36a0240-8103-42b4-aef1-99bf2541ed0f">

PORTx_PCRn에 MUX 값을 설정해줌으로서, 개별 bit n(n-th pin)의 연결을 바꿔줄 수 있다.

C언어 에서 PCR 접근
- CMSIS 지원을 통해서 
- 예를 들어, Specifying the PCR for bit 2: PORTA->PCR\[2]

<img width="785" alt="Pasted image 20240601003053" src="https://github.com/owjxyz/EECE372/assets/89694988/8617bc0d-81b9-4023-be76-0e3e4266cd93">

<img width="791" alt="Pasted image 20240601003259" src="https://github.com/owjxyz/EECE372/assets/89694988/dd6418c7-c2d7-4dac-833a-e9d51515b5ae">

MUX에 해당하는 부분만 정상적으로 이동될 수 있도록 &를 통해서 마스크를 진행해준다.

<img width="791" alt="Pasted image 20240601003311" src="https://github.com/owjxyz/EECE372/assets/89694988/35ff6713-ee19-4f95-8309-41ac2c3f9c35">

&= ~ -> CLEAR

|= -> SET


## GPIO peripheral

어떻게 한개의 핀으로 양방향의 전달이 가능할까?

CMSIS는 GPIO 모듈을 위한 추가적인 데이터구조(GPIOx)를 지원한다
- Data in register (GPIOx_PDIR)
- Data out register (GPIOx_PDOR)
- Data direction register (GPIOx_PDDR) -> 0-in / 1-out
- PCR을 통해 PORTA의 각각의 bit에 대해서 GPIO 모드로 설정을 진행하면
- PDDR을 통한 Data input/output 방향을 설정 해줌.

<img width="727" alt="Pasted image 20240601005545" src="https://github.com/owjxyz/EECE372/assets/89694988/5fd2aa1e-4daa-4319-911f-8ad3f947f2b6">

<img width="776" alt="Pasted image 20240601004913" src="https://github.com/owjxyz/EECE372/assets/89694988/ad09367c-45e4-4cb5-bcab-ea83003fa06f">

## GPIO module use

<img width="571" alt="Pasted image 20240601005719" src="https://github.com/owjxyz/EECE372/assets/89694988/334e5ed8-bc7c-43af-b3d5-2519f66f65e2">

입력 값은 GPIOx_PDIR 레지스터로 부터 읽어진다. 간단히 레지스터 접속 가능

출력 값은 GPIOx_PDOR 레지스터로 쓰여진다.
- 더 유용한 레지스터들이 있다.
- PSOR - SET (입력된 부분을 1로)
- PCOR - CLEAR (입력된 부분을 0으로)
- PTOR - TOGGLE (입력된 부분의 bit 0을 1로 1을 0으로)

<img width="553" alt="Pasted image 20240601010408" src="https://github.com/owjxyz/EECE372/assets/89694988/cad82f27-f4d8-4178-90d7-adf48d0399e2">
