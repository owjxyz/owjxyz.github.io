## Direct memory access
프로그램 명령어 없이 주변 하드웨어에 의해 수행되는 메모리 접근
**Basic DMA operations**
1. **전송 시작**: 트리거 이벤트가 전송을 시작합니다. (일반적으로 소프트웨어에 의해 관리됨)
2. **데이터 읽기**: DMA 컨트롤러가 MCU의 주소 및 데이터 버스를 제어하여 소스 위치에서 데이터를 읽습니다. (소스 주소 레지스터에 의해 지정되며, 이 주소는 메모리나 주변 장치일 수 있음)
3. **데이터 쓰기**: DMA 컨트롤러는 주소 및 데이터 버스를 사용하여 데이터를 목적지 위치에 씁니다. (목적지 주소 레지스터에 의해 지정됨)
4. **버스 해제**: DMA 컨트롤러는 CPU가 버스를 사용할 수 있도록 버스를 해제합니다. (선택 사항)
5. **주소 증가**: DMA 컨트롤러는 다음 전송을 위해 소스 및 목적지 주소 레지스터를 증가시킵니다.
6. **카운트 업데이트**: DMA 컨트롤러는 전송된 항목 수를 추적하는 카운트 레지스터를 업데이트합니다. 전송할 항목이 더 있는 경우, 이 과정은 2단계부터 반복됩니다.
7. **전송 완료 알림**: DMA 컨트롤러는 최종 전송이 완료되었음을 상태 플래그를 설정하고 인터럽트를 트리거함으로써 알립니다. (인터럽트가 활성화된 경우) -> 다른 작업 가능
Variations
- 특정 경우에는 DMA 컨트롤러가 동일한 값을 모든 목적지에 복사하거나, 동일한 소스로부터 연속적인 값을 읽어들이기를 원할 수 있음
- Two transfer modes
	- continuous (burst) mode: 트리거되면 DMA 컨트롤러가 버스를 점유하여 전송이 완료될 때까지 데이터 전송을 멈추지 않고 계속합니다.
	- cycle-stealing(time-sharing) mode: DMA 컨트롤러가 MCU와 버스를 공유한다. 매 트리거마다 버스를 제어하여 하나의 항목을 전송한 후 버스를 MCU에 양보한다.
Using DMA operation
- 버퍼를 지운다 
- 데이터 구조를 초기화한다
- 프레임버퍼에 이미지를 복사한다
DMA 컨트롤러가 다른 peripheral 모듈과 함께 사용되면 문제가 발생할 수 있다
DMA operation을 사용해서 전체적인 전력 소모를 줄여줄 수 있다.(CPU가 sleep이나 low frequency 모드가 되는 것을 허용)

## KL25Z DMA Controller
<img width="622" alt="Pasted image 20240601223601" src="https://github.com/owjxyz/EECE372/assets/89694988/34389436-9894-4dc1-b0c0-488ee34311e2">

<img width="688" alt="Pasted image 20240601224350" src="https://github.com/owjxyz/EECE372/assets/89694988/7aa2d875-e162-485f-b09d-869cbd7a486f">

DMA 전송은 소프트웨어의 쓰기 동작 또는 하드웨어의 트리거 이벤트에 의해 발생한다.
- DMA_MUX 하드웨어 트리거에 맞는 적절한 input 설정
- DMAMUXx_CHCFGn control register (x=0,1,2,3)
	 <img width="683" alt="Pasted image 20240601223812" src="https://github.com/owjxyz/EECE372/assets/89694988/8e48f76c-81e7-4635-9f31-038e38f49fd1">

	- ENBL: 1인 경우 DMA 채널 활성화
	- TRIG: 1인 경우 DMA 채널의 트리거링을 활성화
	- SOURCE: 트리거 소스들 중 하나를 선택
Controller uses a number of registers for the basic operation.
- Source address register (SAR)
- Destination address register (DAR)
- DMA_DCRn register: DMA 명령을 정의해준다.
- <img width="688" alt="Pasted image 20240601224350" src="https://github.com/owjxyz/EECE372/assets/89694988/4e77fbbc-12d2-4fbe-b2c9-60a35956abee">

- DMA_DSR_BCRn register: byte count register
- <img width="697" alt="Pasted image 20240601224414" src="https://github.com/owjxyz/EECE372/assets/89694988/a027caf6-e34d-489f-94ab-fb20a70fa831">

Fields for defining the basic aspects of the transfer
- BCR (DMA_DSR_BCRn 19~0)
	- 전송해줄 바이트의 개수
	- 각각의 DMA 전송 이후에, 하드웨어는 전송된 바이트 개수만큼 BCR을 감소시킨다.
- SSIZE / DSIZE (DMA_DCRn)
	- source/destination의 데이터 크기를 설정
	- 00 -> 32bit
	- 10 -> 16bit
	- 01 -> 8bit
- SINC / DINC: SAR DAR을 데이터 사이즈(SSIZE/DSIZE)만큼 증가할지 말지 결정(1->증가 0 -> x)
- SMOD / DMOD (DMA_DCRn)
	- 0이 아닌 값의 경우, 원형 버퍼를 제공하기 위해 이동시켜주어야 하는 주소의 크기를 정의함.
	- Circular buffer의 크기를 정의
- CS (DMA_DCRn)
	- 전송모드 설정 (cycle-stealing(1) 또는 continuous mode(0))
- AA (DMA_DCRn)
	- 하드웨어가 주소를 자동적으로 정렬하게끔 허락한다.
	- CPU가 32bit 연산이 제일 빠르기 때문에 4byte씩 정보를 처리해주는데 이를 위해서 자동적으로 정렬 과정을 수행해줌
	- <img width="621" alt="Pasted image 20240601230048" src="https://github.com/owjxyz/EECE372/assets/89694988/150edfd7-3fd1-4e9f-a85e-a9912a13b826">
	- <img width="621" alt="Pasted image 20240601230313" src="https://github.com/owjxyz/EECE372/assets/89694988/7c5c3b72-07f9-490f-be08-9b78b935da0b">

Fields for starting the transfer
- ERQ() - enable request
	- 1 -> 하드웨어 트리거에 대해서 peripheral 이 전송시작을 요구하는 것을 가능하게 함
- START()
	- 1 -> 소프트웨어 트리거 전송 시작
Fields for indicating errors
- CE (in DMA_DSR_BCRn)
	- Configuration error 설정 에러 발생
- BES/BED (in DMA_DSR_BCRn)
	- source/destination의 버스 에러
Fields for indicating the current progress
- REQ (in DMA_DSR_BCRn)
	- 1 -> 전송이 요청됐지만 시작되지 않음
- BSY (in DMA_DSR_BCRn)
	- 1 -> 채널이 전송을 시작한 시간부터 끝난 시간까지 1
- DONE (in DMA_DSR_BCRn)
	- 모든 전송을 완료하면 1이됨
	- DMA가 인터럽트를 발생시킬 때, ISR에 의해 클리어된다.
Fields for the interrupt
- EINT (DMA_DCRn) - enable interrupt
	- 전송이 끝난 다음에 DMA 인터럽트를 활성화해줌
Fields for the linked (or triggered) channel
- CH0은 cycle-stealing 전송 이후에 CH1을 트리거
- CH1은 CH1의 BCR이 0에 도달하면 CH2를 트리거
- LINKCC (in DMA_DCRn)
	- 채널들을 어떻게 연결해줄지 표현
- LCH1 / LCH2 (in DMA_DCRn)
	- CH1, CH2 트리거 bit

## Basic DMA configuration and use
**Basic configuration**
1. **DMA 모듈의 클럭 게이팅 활성화**:
    - SIM->SCGC7에서 DMA 모듈로의 클럭 게이팅을 활성화합니다.
2. **하드웨어 트리거링 사용 시, DMAMUX 모듈의 클럭 게이팅 활성화**:
    - 하드웨어 트리거링이 사용되는 경우, SIM->SCGC6에서 DMAMUX(DMA Multiplexer) 모듈로의 클럭 게이팅을 활성화합니다.
3. **하드웨어 트리거링 사용 시, DMA 채널 비활성화**:
    - 하드웨어 트리거링이 사용되는 경우, DMAMUX0의 채널의 CHCFG필드를 0으로 설정하여 DMA 채널을 잠시 비활성화합니다. -> 나중에 다시 활성화 해줌
4. **DMA 채널 n의 제어 레지스터 초기화**:
    - DMA 채널 n에 대한 제어 레지스터를 초기화합니다.
5. **소스 및 목적지 주소 레지스터(SARn, DARn) 로드**:
    - SARn와 DARn에 소스 및 목적지 주소를 로드합니다.
6. **전송할 바이트 수를 BCRn에 로드**:
    - BCRn에 전송할 바이트 수를 로드합니다.
7. **DSRn의 DONE 플래그를 클리어하여 컨트롤러 초기화**:
    - DSRn의 DONE 플래그를 클리어하여 DMA 컨트롤러를 초기화합니다.
8. **하드웨어 트리거링 사용 시**:
    1. **DMA 채널 활성화**:
        - DMAMUX0의 채널의 CHCFG 필드에 트리거 소스 번호를 써서 DMA 채널을 활성화합니다.
    2. **주변 장치 트리거 활성화**:
        - ERQ 플래그를 1로 설정하여 주변 장치 트리거를 활성화합니다.
9. **인터럽트 사용 시, EINT 플래그 설정**:
    - 인터럽트가 사용되는 경우, EINT 플래그를 1로 설정합니다.
10. **소프트웨어 트리거 DMA 사용 시, START 플래그 설정**:
    - 소프트웨어 트리거 DMA를 사용하는 경우, START 플래그를 설정하여 DMA 채널을 트리거합니다.

<img width="586" alt="Pasted image 20240601233758" src="https://github.com/owjxyz/EECE372/assets/89694988/f6fb3718-306b-4eb5-a56b-a13ae54701be">

<img width="710" alt="Pasted image 20240601233848" src="https://github.com/owjxyz/EECE372/assets/89694988/a3e6a33f-6b85-4b86-be6a-bb2c9aaeaa8e">

- `Init_DMA_To_Copy(void)` : DMA 설정을 초기화하는 함수입니다.
    - `SIM->SCGC7 |= SIM_SCGC7_DMA_MASK;` : DMA 모듈의 클록을 활성화합니다.
    - `DMA0->DMA[0].DCR = DMA_DCR_SINC_MASK | DMA_DCR_SSIZE(0) | DMA_DCR_DINC_MASK | DMA_DCR_DSIZE(0);` : DMA 제어 레지스터(DCR)를 설정합니다. 여기서는 소스 주소 증가, 소스 크기 설정, 목적지 주소 증가, 목적지 크기 설정 등의 옵션을 설정합니다.
    - SIZE(0)->32bit
- `Copy_Longwords(uint32_t *source, uint32_t *dest, uint32_t count)` : DMA를 사용하여 데이터를 복사하는 함수입니다.
    - `DMA0->DMA[0].SAR = DMA_SAR_SAR((uint32_t) source);` : 소스 주소 레지스터(SAR)를 소스 배열의 시작 주소로 설정합니다.
    - `DMA0->DMA[0].DAR = DMA_DAR_DAR((uint32_t) dest);` : 목적지 주소 레지스터(DAR)를 목적지 배열의 시작 주소로 설정합니다.
    - `DMA0->DMA[0].DSR_BCR = DMA_DSR_BCR_BCR(count * 4);` : 전송할 데이터의 총 바이트 수를 설정합니다.
	    - count\*4 : 4바이트
    - `DMA0->DMA[0].DSR_BCR &= ~DMA_DSR_BCR_DONE_MASK;` : 완료 플래그를 클리어합니다.
    - `DMA0->DMA[0].DCR |= DMA_DCR_START_MASK;` : DMA 전송을 시작합니다.
    - `while (!(DMA0->DMA[0].DSR_BCR & DMA_DSR_BCR_DONE_MASK));` : 전송이 완료될 때까지 대기합니다.
<img width="388" alt="Pasted image 20240601233859" src="https://github.com/owjxyz/EECE372/assets/89694988/c1cf4783-6cd8-437c-9243-2eaf9352a1a3">

- `Test_DMA_Copy(void)` : DMA 복사를 테스트하는 함수입니다.
    - `Init_DMA_To_Copy();` : DMA 설정을 초기화합니다.
    - `for (i=0; i<ARR_SIZE; i++) { s[i] = i; d[i] = 0; }` : 소스 배열 `s`는 인덱스 값으로 초기화하고, 목적지 배열 `d`는 0으로 초기화합니다.
    - `Copy_Longwords(s, d, ARR_SIZE);` : `s` 배열의 데이터를 `d` 배열로 복사합니다.
