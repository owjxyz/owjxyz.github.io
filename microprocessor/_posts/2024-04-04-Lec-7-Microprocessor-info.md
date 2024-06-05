---
layout: post
title: Lec. 7. Microprocessor info
related_posts:
  # Specify via the path in the file system
  # - category/_posts/2020-01-01-other-post.md
  # Can also use the url of the post,
  # but this will break when changing the `permalink` setting!
  - /microprocessor/2024-04-05-Lec-8-ARM-Cortex-M0+-Core-Pt.1/
  - /microprocessor/2024-04-06-Lec-9-ARM-Cortex-M0+-Core-Pt.2/
  - /microprocessor/2024-04-07-Lec-10-C-in-Assembly-Language/
sitemap: false
hide_last_modified: true
---

Microprocessor info

## Embedded computer

- IC - integrated circuit
	- 집적 회로는 특정 기능을 수행하는 전기 회로와 반도체 소자(주로 트랜지스터)들을 하나의 칩(Chip)으로 구현한 것이다. - single piece of silicon
	- 극소형화(miniaturization), 대량생산(mass production), 비용 절감(cost reduction)
- MCU - Microcontroller unit
	- CPU, 각종 주변장치, 메모리 등이 합쳐진 IC 회로 + 메모리 버스 등등
	- 추후에 소프트웨어적으로 개발을 진행할 수 있다.
- CPU - Cental processing unit
	- Program instruction을 실행하는 하드웨어 회로
	- instruction - 명령어 조합, 하나 또는 다수의 연산자(operand)로 이루어진다.
- PCB - printed circuit board
	- 전자 소자를 붙잡아주는 판
	- 전선이 보드에 그려져 있어서 소자의 양 전극을 연결 해줌.

## Typical embedded system software operations

- Closed-loop control
	- 계속 센서 체크 피드백 받음 -> 조절
- Sequencing
	- 처음부터 끝까지 과정(step)이 모두 설계되어 있음.
- Signal conditioning and processing
	- 다수의 센서를 통해 신호 제대로 가는지 체크 -> 올바른 신호 보내주기 위해 노이즈 걸러냄.
- Communications and networking
	- 다른 subsystems 또는 other system 이랑 소통함. 패킷 전송, 디코딩 과정 등등 (ex. 드론 무선 조종) 

## Interfaces of embeded systems
- Peripheral
	- CPU 외 주변기기 전부
- analog
	- 무한한 수
- digital
	- 유한한 수
- ADC(analog-to-digital converter)
	- 아날로그를 디지털 값으로 변환
- DAC(digital-to-analog converter)
	- 디지털을 아날로그 값으로 변환

## Concurrency - 동시 발생성

- MCU가 동시에 여러 신호를 처리해 줄 수 있다.
- 특정 기능이 추가될 수록 복잡성이 증가함
	- 하나가 추가되면 여러개가 추가되기 때문
- MCU는 concurrency를 제공한다. 
	- 한번에 여러 작업 수행 가능
	- interrupt handler - 시스템 작업에 문제가 발생했을 경우 suspend시킴
		- CPU가 어떠한 작업을 실행 중일때, 우선적으로 필요한 작업이 생겨 이를 CPU에게 알리는 행위
	- 하드웨어 Peripherals가 CPU와는 관계 없이 작업을 수행함.

## Scheduler

- 명령 시스템을 이용한 Mandatory Unit
- 프로세서에서 어떠한 순서로 프로세스를 처리해줄지를 관리해줌
- 필요에 따라서 실행 context를 전환하여 올바르게 실행한다
- 동기식과 비동기식으로 나뉨

## Responsiveness - 민감성

CPU 리소스를 공유할 때, 충분한 민감도를 제공하는 것이 중요하다
- Raw processing speed
	- RAW 파일을 가공하는 속도
	- 인코딩 / 디코딩 속도
- Task scheduling
	- 치명적인 프로세싱에 집중해야 한다
- Multicore processing
- Multiple processors

## Reliability and fault handling

* Reliability
	- 사용자가 시스템을 재부팅하도록 하지 않는다 
	- 다른 문제로 연결되지 않도록, 현재 failure의 impact를 최소화 해야한다
- failure를 detect하는 방법
	- 다른 센서의 오류를 검출하기 위해서 더 많은 센서를 utilize 해야한다
	- 소프트웨어는 이러한 센서들을 run time 중에 이용하거나 실행 history(log)를 분석하는 방법으로 사용할 수 있다
	- 예기치 않는 case를 다루는 많은 양의 소프트웨어 루틴이 있다

## Diagnotics

진단 시에 기계적인 컴포넌트(단자)의 정보에 대해 쉽게 파악할 수 있도록 하는 것이 중요하다.

## Constraints - 강제/제한

chip을 제작하는데 설계자들의 option을 제한하는 요소
- Costs(비용) / Size(크기) / Weight(무게) / Power(전력) / Working range(작동 범위) / Flexibility(범용성)

## Processor(CPU) - Microcontroller - Board

CPU - ARM Cortex-M0+

<img width="565" alt="image" src="https://github.com/owjxyz/EECE372/assets/89694988/ee6c6f13-d73a-4772-89f6-fe71d98826d1">

- instructions/data/code에 대한 정보를 얻기 위해 메모리와 통신함
- AHB-Lite interface를 통해서 프로세서 외부에 있는 메모리와 통신한다
- NVIC(Nested Vectored Interrupt Controller)를 사용함
