## Software for interrupts
인터럽트를 사용하는 프로그램
- 시스템을 먼저 디자인한 후에 코드를 작성하여 구현
- 시스템의 인터럽트 유형을 식별한다
- ISR과 주요 코드 간에 작업을 나누는 방법을 결정한다
- 하드웨어 부분을 설정하는 코드를 작성한다
- ISR부분의 코드를 작성한다

## Program design
어떤 종류의 인터럽트가 사용되어야 하는가?
- 간단한거 -> 장치별 특정한 인터럽트를 일반적으로 사용해준다.
코드를 작성하는 방법을 결정한다.
- ISR과 메인라인 코드를 어떻게 분리해야 하는지
- ISR 함수가 메인라인 코드에서 남은 작업들과 어떻게 상호작용하는지
Partitioning
- ISR은 빠르고 긴급한 작업만을 수행해준다.(인터럽트와 관련된)
- <img width="728" alt="Pasted image 20240601035210" src="https://github.com/owjxyz/EECE372/assets/89694988/cd066595-3749-4a41-bbb8-3d2006aab635">

Communication
- option 2/3: ISR이 즉각적으로 딜레이와 플래시 모드 변수를 업데이트한다
	- 전역변수와 같은 공유되는 변수를 사용한다.
- option 1: 복잡
	- ISR은 어떠한 스위치가 변화되었는지를 공유 변수에 저정함
	- 바깥 task 코드에서 해당 변수를 읽어 딜레이와 플래시 모드 변수를 업데이트한다.
	- 다음 입력에 대해서는 ISR은 
		- ISR) ISR의 활성화를 인식할 수 있는 플래그만 사용
		- task code) 지연/모드를 업데이트한 후 스위치 변수를 지우기
- main task 수행 전에 여러 개의 ISR 활성화가 일어남
	- 이때, task code가 처음 or 마지막?
	- 시스템이 모든 input에 대해서 작업을 필요로 하면 관련된 모든 변수를 저장해주어야 한다.
- 따라서, ISR과 main task code는  데이터를 저장하고 공간을 효율적으로 재사용하는 방법에 협동해야 한다.
- <img width="805" alt="Pasted image 20240601040958" src="https://github.com/owjxyz/EECE372/assets/89694988/1ca4c0b1-d720-4dd3-8785-b9d6e3608a52">

## Interrupt configuration
3개의 부분으로 시스템이 구성되어야 한다.
-> Peripheral, NVIC, CPU core
<img width="800" alt="Pasted image 20240601041318" src="https://github.com/owjxyz/EECE372/assets/89694988/b0e32d63-8bde-4bc0-9240-0db1261348ac">

## Writing ISR in C
- 입력 없음
- 반환 없음
- CMSIS로 정의된 벡터 테이블로부터 이름 설정
- <img width="740" alt="Pasted image 20240601042651" src="https://github.com/owjxyz/EECE372/assets/89694988/b8519038-a251-4fee-9488-0e0683f13f1e">

## Sharing data safely given preemption
Volatile data objects
- 공유 데이터를 사용하는 함수를 생성한다. -> 컴파일러가 데이터를 레지스터에 복사하는 명령을 생성함
- 공유 데이터가 함수에서 여러 번 사용된다면, 컴파일러가 해당 값을 다시 로드하는 명령을 추가적으로 수행해주기 보다 레지스터에서 값을 여러 번 사용하도록 최적화한다.  -> 자기가 알아서 최적화 해버림
- 변수의 선언 과정에서 변수형 앞에 volatile 키워드를 추가해주어, 컴파일러에게 해당 변수가 외부에서 변화가 생길 수 있음을 말해준다.
	- 이것은 컴파일러가 소스 코드에서 해당변수가 사용될 때 메모리에서 값을 다시 불러오는 과정을 수행하도록 강제한다.
Atomic object access
- 몇몇 데이터 객체는 수정되기 위해 다수의 작업을 거친다. 
- 프로그램이 이러한 작업 중에 선점이 일어나게 된다면, 데이터 객체는 부분적으로만 업데이트 된다. -> incorrect data
- atomic access 정의
- LED flasher를 예로 들자.
	- 만약 delay를 늘리고 싶다면 g_RGB_delay를 32b -> 64b로 늘려줌
	- R0만 썼다면, 이제는 r0 + r1으로 사용해야 함.
	- 따라서 값을 load하기 위해서는 아래와 같은 과정을 거침
	- 메모리에서 변수를 읽기 위해 두 번의 연속적인 load 작업이 필요
	- LRD r0, \[g_RGB_delay] → for the low word
	- LDR r1, \[g_RGB_delay+4] → for the high word
	-   만약 data race 상황이라면, critical sections을 정의함으로써 incorrect data 문제를 해결할 수 있다.
Data race: 코드의 critical section에서 부적절한 시점에서의 선점으로 인해 맞지 않은 프로그램 결과가 나오는 상황
Critical section: atomically하게 실행되지 않으면, 부적절한 결과가 나오는 코드 섹션
