## Recall the MCU architecture

<img width="706" alt="Pasted image 20240601012031" src="https://github.com/owjxyz/EECE372/assets/89694988/f1f8ec34-7bec-4e94-b96d-510c2a6537a2">

<img width="753" alt="Pasted image 20240601012043" src="https://github.com/owjxyz/EECE372/assets/89694988/1c48c042-dd43-4ca5-b352-6d8ce3875245">

<img width="740" alt="Pasted image 20240601012051" src="https://github.com/owjxyz/EECE372/assets/89694988/66297090-b069-4513-b7c3-e7ea728ef897">

NVIC: 인터럽트 효율적

WIC: Optional Wakeup Interrupt Controller

## Exceptions and Interrupts

Exception은 코어 내부 예외처리

Interrupt는 코어 외부 예외처리

하드웨어와 소프트웨어의 동시적인 작동을 지원하면서 임베디드 시스템의 응답성을 높이기 위한 주요 도구

ARM에서 Interrupt는 exception의 한 종류

"프로세스는 다음 일련의 과정을 거쳐 Exception을 수행한다."
- 프로그램 중지
- 구문 정보를 저장(레지스터, 현재 프로그램에서 다음 번에 실행될 명령어 저장)
- 어떤 handler(service routine)를 실행할지 결정
- handler를 위한 코드를 실행
- 이전에 저장한 구문 정보를 복구
- exception 처리가 끝난 후, 다시 현재 프로그램 실행

빠른 응답을 위해서
- Hardware-based supporting system
- Software-based handling system
Efficient event-based processing
- 전통적인 polling은 사이클을 기다리는 상황을 야기함
- Exceptions는 프로그램 복잡도, 위치, 프로세서 상태와 관계없이 발생하여 빠른 응답을 제공함
대부분의 interrupt와 exception은 비동기로 작동
- 어느 곳에서나 실행됨
프로그램의 일부는 interrupt를 일시적으로 비활성화 시킬 수 있다.

(-> Interrupt service routine; ISR)

## CPU exception handling behavior

Handler mode and stack pointers

- R13이 Stack Pointer
	- Main stack pointer, MSP
	- Process stack pointer, PSP
- 간단한 어플리케이션은 보통 MSP사용
- 커널이나 OS는 둘다 사용
- CPU는 둘 중 한 모드만 작동시킬 수 있다
	- 일반적으로 Thread mode로 작동
	- 예외 처리시에 Handler mode로 작동
 - 모드가 어떠한 스택 포인터가 사용되는지 결정한다.
	- 핸들러 모드는 MSP
	- 쓰레드 모드는 MSP, PSP

#### Entering a handler

1. 현재 실행중인 명령을 끝까지 완료한다.
2. 프로세서의 현재 구문을 현재의 Stack(MSP or PSP)에 PUSH 해준다. 
- 8개의 32bit 레지스터가 push가 일어남 <- (xPSR, PC, LR, R12, R3, R2, R1, R0)
3. 프로세서 모드를 Handler 모드로 변경하고 MSP 를 사용하기 시작한다.
4. exception 타입에 따라 벡터 테이블에서 handler의 주소를 PC로 load
5. 예외 처리가 완료된 이후에 어떤 모드와 스택을 사용할 지 EXC_RETURN 코드를 LR로 load
6. 예외 처리 번호를 IPSR(Interrupt Program Status Register)로 load

<img width="514" alt="Pasted image 20240604114624" src="https://github.com/owjxyz/EECE372/assets/89694988/3db21528-9d0d-4be2-8666-5f0e8426b603">

<img width="667" alt="Pasted image 20240601020517" src="https://github.com/owjxyz/EECE372/assets/89694988/2987350b-7116-4fcb-a006-5a5a7dcd5466">

#### Exiting a Handler

1. Exception 복귀 프로세싱을 시작해주는 명령어를 실행한다. PC에 업데이트를 직접적으로 해준다. BX LR or POP PC
2. Exception 복귀 코드의 기초에서, CPU가 MSP와 PSP 중 선택하여 Handler 또는 Thread 모드를 선택한다.
3. 스택에 저장된 구문을 CPU에 복원한다. 이전에 저장해둔 레지스터는 xPSR, PC, LR, R12, R3, R2, R1, R0이다.
4. CPU가 모든 복귀 과정이 수행되었고, PC에 저장된 주소에서 코드의 실행을 계속해준다.

<img width="726" alt="Pasted image 20240601025849" src="https://github.com/owjxyz/EECE372/assets/89694988/460c54ba-4d8e-4dd0-9a24-70e42cc34a3c">

## Hardware for interrupts and exceptions

<img width="765" alt="Pasted image 20240601025948" src="https://github.com/owjxyz/EECE372/assets/89694988/a8b1bae6-0ae8-4ee7-b003-b495a1450ee2">

**Exception sources**

각각의 가능한 exception source는 그에 맞는 특정한 handler를 특정할 수 있는 벡터를 갖는다.

이러한 handler들의 시작 주소는 벡터 테이블에 저장되어 있다.

<img width="743" alt="Pasted image 20240601030321" src="https://github.com/owjxyz/EECE372/assets/89694988/4067a6c9-094a-4e65-bcea-62de5ad0ea12">

<img width="645" alt="Pasted image 20240601030330" src="https://github.com/owjxyz/EECE372/assets/89694988/69dd42e4-bf69-48fa-8229-c15df123ad69">

=> 32개의 interrupt sources

Peripheral interrupt configuration
- Peripheral과 NVIC를 설정해주어야 한다. 
	- reset 이후에 프로세서 코어는 인터럽트를 받기 위한 준비가 완료된 상태이다.
- KL25Z 시스템에서는, PCR 내부에 있는 IRQC field에 의해 인터럽트가 생성될 조건이 제어된다.
- <img width="497" alt="Pasted image 20240604105547" src="https://github.com/owjxyz/EECE372/assets/89694988/bc9e1d13-fd47-41e6-b7d2-0eb3c0c03c08">
- interrupt generation condition code
- <img width="357" alt="Pasted image 20240601030903" src="https://github.com/owjxyz/EECE372/assets/89694988/33b12043-b578-491e-9c92-0006bea9c5ef">
- CMSIS 장치 드라이버에 의해 지원되는 IRQC field를 설정해준다.
- PORTD의 sw1_pos bit setting (입력신호의 rising edge에 interrupt 생성)
- <img width="612" alt="Pasted image 20240601031226" src="https://github.com/owjxyz/EECE372/assets/89694988/a5863b02-546d-4d86-918c-d72fa1e3bb3c">
- Interrupt status flag register(PORTD -> ISFR)는 해당 포트에 인터럽트가 감지되었는지를 나타낸다.
NVIC operation and configuration
- <img width="506" alt="Pasted image 20240601041930" src="https://github.com/owjxyz/EECE372/assets/89694988/404f73d8-f84c-458e-a03c-3dbe18726447">
- NVIC는 최대 32개의 interrupt sources까지 지원
- 각각의 source는 구성될 수 있다. 즉 활성, 비활성, 우선순위를 지정해 줄 수 있다.
- Enable the interrupt source
	- ISER - 인터럽트를 활성화 해주는 32b 레지스터
	- ICER - 인터럽트를 비활성화 해주는 32b 레지스터
	- <img width="607" alt="Pasted image 20240601041922" src="https://github.com/owjxyz/EECE372/assets/89694988/a7e54ed8-4a88-4bb0-9607-327847891c91">

- Priority (우선순위)
	- 동시에 요청되는 exception에 대해 순서를 지정해준다.
	- priority number가 낮은 것부터 먼저 exception이 시행된다.
	- 몇몇은 우선순위가 고정(가장 빨리 수행되도록)되어 있다. (reset, NMI(마스크 불가), hard fault(심각한 오류))
	- NVIC는 8개의 priority 레지스터(IPR0~7)를 포함한다. 각각의 레지스터는 4개의 interrupt source를 관리하여  4x8bit priority fields를 형성. -> 32개의 interrupt sources 에 대응
	- 각각의 field는 0, 64, 128, 192 중에 가능한 하나의 우선순위 레벨을 특정한다.
	- CMSIS가 우선순위에 대한 설정 프로세스를 지원한다.
	- <img width="739" alt="Pasted image 20240601041957" src="https://github.com/owjxyz/EECE372/assets/89694988/62005e4f-1027-402d-b796-321cfba24b88">

Exception masking
- 프로세서 코어는 특정 타입의 exception을 받아들일지/무시할지 설정한다.
- <img width="615" alt="Pasted image 20240601033302" src="https://github.com/owjxyz/EECE372/assets/89694988/9420cea4-4c99-4503-8689-dcce9daccc66">
- enable -> 인터럽트 활성화 (PRIMASK에 0)
- disable -> 인터럽트 비활성화 (PRIMASK에 1)
- 인터럽트 안전하게 마스킹
	- Critical section: exception/interrupt '무시'하는 프로그램 시퀀스
	- Critical section을 위해서는 이전에 disable_irq() 수행해주고 이후에 enable 수행해주어 안전하게 마스킹이 유지되도록 해준다.
	- 만약 critical section 수행 이전에도 disable 되어있는 상태라면, 이후에 enable 시켜주면 값이 달라짐.
	- masking_state = \_\_get_PRIMASK(); \_\_set_PRIMASK(masking_state); 을 통해 operation 이후에도 같은 마스킹 상태를 유지하도록 해준다.

	- <img width="779" alt="Pasted image 20240601034131" src="https://github.com/owjxyz/EECE372/assets/89694988/7cfdfe07-8f8f-49ee-b7d0-573debf41e60">
