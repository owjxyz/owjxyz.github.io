## Overview

어떻게 임베디드 프로세서가 외부 환경을 인식하고 외부 장치를 그 응답으로 조절할 수 있을까?

-> 다양한 인터페이스가 존재한다 ex) usb serial 3.5mm ...

## GPIO

Peripherals with digital input and output bits

디지털 입출력 신호로 상호작용 하는 주변기기

## Outside the MCU

mcu는 0또는 1로 이루어짐

어떻게 binary bit로 입력? 어떻게 binary bit MCU 출력?

외부: 전력 공급 전압과 관련된 특정한 범위의 전압 (Vdd)

내부: 외부 장치와의 연결을 제외하고 실제 전압 값을 고려하지 않음

## Input Signals

입력 전압의 유효한 범위를 가진다.

<img width="699" alt="Pasted image 20240531224128" src="https://github.com/owjxyz/EECE372/assets/89694988/5b00754f-8f28-47ac-93b0-067841b66a57">

입력 전압 => VDD에 대한 함수 (Logic 0, Logic 1)

Invalid region은 Overvoltage와 undefined 두 가지 존재

입력 전류 => 1uA보다 커지지 않음(상온에서 25nA)

## Output signal

출력 전압: 공급레일의 특전 전압 범위 내

Voh = 1 -> high -> Vdd-0.5V~Vdd

Vol = 0 -> low -> 0~0.5V

출력 전류의 양은 한정되어 있음
- 전류가 증가 -> 출력의 전압 강하가 심하다 -> 0과 1을 표현하는 전압 값이 비슷해짐.
- 많은 양의 전류 ->  외부 트랜지스터를 손상시킬 수 있다.
- 많은 MCU에서 각 전류 값이 5mA 이하.
	- 강력한 트랜지스터로 더 높은 전류 공급 가능
- VDD를 낮춰주면 -> 출력 전류의 제한이 심해짐 (=>VDD-I\*R)

## Interfacing examples
1. 스위치 입력
	- 풀업 저항을 사용하면 -> 스위치가 off 일때, 높은 전압
	- 스위치 on -> 0V
	- 전류 소비를 최소화하기 위해서 높은 값의 풀업 저항을 일반적으로 사용해준다. 
2. LED 출력
	- GPIO 포트는 2개의 출력 전압을 가진다. 
	- VDD랑 거의 0V
	- 0V -> led off
	- VDD -> led on
	- 전류 제한에 맞춰서 출력 저항을 알맞게 연결

$$
R = \frac {V_{DD} - V_F} {I_{LED}}
$$

## Inside the MCU

MCU 핀에 간단한 장치들을 어떻게 연결?
- 핀들과 프로그램이 어떻게 상호작용 하도록?
- 프로그램에서 CPU랑 핀들 사이의 경로를 연결해주는 내부 하드웨어 설정할 수 있다.
- 프로그램이 핀들로 R/W 동작
- 다른 MCU 군에서 다르게 동작 -> 새로운 설계 필요로 함

## Memory-mapped I/O

어떻게 I/O 모듈을 조절해줄 수 있을까?

<img width="665" alt="Pasted image 20240531230933" src="https://github.com/owjxyz/EECE372/assets/89694988/3f9a7d80-dae6-4116-ab5b-be73689d6925">

메모리랑 I/O의 버스를 묶어서 Control / Address / Data line을 공유한다.

프로세서는 입출력 장치의 주소를 메모리 주소처럼 접속할 수 있다.

connection 개수 줄임. -> 높은 범용성을 위해서는 몇 가지 제어 신호가 더 필요할 수 있습니다.

프로세서로 데이터 송/수신 과정 표준화 ->  비동기식 동기화가 메모리에서는 Option, I/O장치에서는 필수(GPIO는 Ascynchronous)

<img width="801" alt="Pasted image 20240531231308" src="https://github.com/owjxyz/EECE372/assets/89694988/9541fc66-ae4c-45ea-b688-74b4f18f8f78">

=> memory mapped i/o 를 사용하는 컴퓨터의 주소 공간 -> i/o 레지스터 주소를 일부분 포함

## Control registers and C code

주변 장치는 제어 레지스터로 구성된다
- 주변기기 동작을 설정해주고
- 주변기기 상태 체크
- 주변기기로 데이터 이동

System Integration Module

<img width="714" alt="Pasted image 20240531232033" src="https://github.com/owjxyz/EECE372/assets/89694988/1f0bfe22-c79b-4ff8-86a4-9537d08c7972">

1. **System Options Registers (SIM_SOPT1, SIM_SOPT1CFG, SIM_SOPT2, 등)**:
    - 시스템 옵션 설정
    - MCU의 다양한 기능과 옵션을 설정하는 데 사용됩니다.
2. **System Device Identification Register (SIM_SDID)**:
    - 시스템 디바이스 식별
    - MCU의 디바이스 식별 정보를 제공하는 레지스터입니다.
3. **System Clock Gating Control Registers (SIM_SCGC4, SIM_SCGC5, 등)**:
    - 시스템 클럭 게이팅 제어
    - 특정 주변 장치의 클럭을 활성화하거나 비활성화하는 데 사용됩니다.

## Using CMSIS to access hardware registers with C code

하드웨어 제어 레지스터를 위한 모든 주소를 다 기억하는 것은 불가능함. 

CMSIS(Cortex Microcontroller Software Interface Standard)
- Cortex processor에서는 어떠한 PIN이나 Interface를 사용할지를 규약해둠.
- Cortex-M 프로세서가 C언어에서 프로세서 코어랑 주변기기에 상호작용 하기 위해서 제공하는 하드웨어 추상화 계층

ex) SIM_SCGC5 register에 접속하고 싶으면 SIM의 주소값을 미리 박아두고, 포인터를 통해 해당 값에 접속할 수 있다.

SIM->SCGC5를 통해, SIM_SCGC5 register에 접속 가능.

<img width="809" alt="Pasted image 20240531232809" src="https://github.com/owjxyz/EECE372/assets/89694988/d10c18d0-32da-4d4a-a381-71a839a27dd8">
