## Timer/Counter peripherals
타이머: 실제 시간을 측정하는 디지털 회로
카운터: 입력 펄스의 수를 count하는 디지털 회로
일반적으로 Timer peripherals가 이벤트를 세거나, 시간을 측정한다.
- 경과된 시간 측정
- 이벤트 발생 횟수 카운트
- 고정된 시간에 이벤트 발생
- 파형 생성
- 펄스 폭과 주기 측정

## Timer circuit hardware
The circuit configurations (example)
- <img width="588" alt="Pasted image 20240601205032" src="https://github.com/owjxyz/EECE372/assets/89694988/361fe792-02e0-402b-b23a-428c04a4169f">
- 어떤 신호를 측정할지 
- 언제 시작하고 언제 끝낼지
- rising or falling edge 를 셀지
- 어느 방향을 카운트 하는지
- 오버 플로우가 발생했을때 어떠한 일이 일어날지
- Reload가 일어났는지, 어떻게 reload를 해줄지.
- 다른 레지스터에 의해 값이 capture 되는지 안되는지
- 신호나 인터럽트를 생성할지 안 할지
## Timer examples
Periodic timer tick
- 가장 많이 사용되는 기본적인 타이머: 주기적인 인터럽트 생성
- 하드웨어에 의해 제어되고, 소프트웨어 딜레이에 의해 영향을 받지 않는다.
	- 경과 시간을 측정한다.
	- wait이나 multi task operation을 위해서는 busy-waiting time delay loop를 사용해준다. (Delay 만큼 경과 했는지를 while loop 조건으로 계속해서 측정)
Watchdog timer (WDT)
- control을 벗어난 프로그램을 리셋하는데 사용되는 Hardware peripherals
- 경과 시간을 계속해서 추적하는 카운터에 사용된다(->무한루프 벗어나기 위해 필요)
- 프로그램에 의해 주기적으로 신호를 전달 받는 것을 기대한다.
- 만약 WDT가 기대된 시간에 신호가 받지 않은 경우(주기적이지 않은 신호 입력), 프로세서를 리셋해준다. 
Time and frequency measurement
- 고정된 시간동안 얼마나 많은 펄스가 발생하는지 측정
- 연속되는 rising edge 사이의 시간을 측정
- Timer peripherals는 일반적으로 이러한 측정과정을 간소화 해주기 위한 추가적인 지원 소자를 가지고 있다. 정확도를 향상시키고 소프트웨어의 과정과 복잡성을 감소시켜주기 위함
PWM signal generation
- PWM (pulse-width modulation): 1비트 이상의 정보를 하나의 디지털 라인으로 전송하기 위한 방법.
	- 정보가 논리적인 시간(시간이 듀티비로 정보를 담고 있음)으로 인코딩 된다. 
	- 노이즈에 훨씬 덜 취약하다.
	- <img width="694" alt="Pasted image 20240601212516" src="https://github.com/owjxyz/EECE372/assets/89694988/7974efe2-6eb4-4b04-913d-01c79d3dd669">
 -
	- 듀티비 D = Ton/T = 0.7(70%)
	- 타이머는 PWM 신호의 극성(0->1, 1->0)을 바꾸는데 사용된다.
## SysTick Timer in the Cortex-M0+ core
<img width="630" alt="Pasted image 20240601212848" src="https://github.com/owjxyz/EECE372/assets/89694988/229b6870-b22f-466d-8ddd-ff5e5c395a88">

시스템 동작을 위해서 Periodic tick을 제공한다.
- MCU 장치에 관계없이, 모든 Cortex-M 프로세서는 하나의 SysTick 타이머 모듈을 갖는다.
- 24bit 길이의 카운트다운을 수행하는 카운터(각각의 입력 시간 펄스를 위해)
	- 현재 값을 VAL 레지스터 필드로부터 읽어옴
	- 시작 값이 24bit LOAD 레지스터 필드로부터 로드됨
	- CTRL 레지스터가 타이머의 상태를 Control, indicate 한다.
	- <img width="721" alt="Pasted image 20240601213806" src="https://github.com/owjxyz/EECE372/assets/89694988/4204b0c5-8e1f-4e86-9ec1-9f795eb984cc">
-	- ENABLE - 카운터를 사용할지 안할지 결정한다
	- TICKINT - 0으로 카운트 다운이 완료됐을 때, SysTick Exception을 요청할지 안할지 정해주는 bit
	- CLKSOURCE: 프로세서 clock(1) or 외부 clock(0) 결정
	- COUNTFLAG: 가장 마지막으로 타이머가 설정된 이후에 0으로 카운트다운이 완료되면 새로운 설정을 적용해주기 위해 1을 return함(CTRL 레지스터의 읽기 과정이나 쓰기 과정이 일어나면 COUNTFLAG를 0으로 초기화)
	- <img width="746" alt="Pasted image 20240601215301" src="https://github.com/owjxyz/EECE372/assets/89694988/fbf82711-439d-4342-bbe0-10f8221ca32e">

## KL25Z COP watchdog timer
COP (computer operating properly) service with the watchdog timer

<img width="757" alt="Pasted image 20240601220235" src="https://github.com/owjxyz/EECE372/assets/89694988/b5de6945-1370-489d-abad-05b66103e270">
