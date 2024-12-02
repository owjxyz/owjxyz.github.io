---
layout: post
title: Arduino Keyboard 아두이노 키보드 DIY
image: 
  path: assets/img/blog/arduinokeyboard/ak(2).jpg
description: >
  아두이노 프로 마이크로 호환 보드와 3D프린터를 사용하여 기계식 키보드를 제작해보았습다.
sitemap: false
---

## 준비

디바이스마트와 네이버 스마트 스토어, Aliexpress를 통해 [아두이노 프로 마이크로 호환 보드](https://www.devicemart.co.kr/goods/view?no=1385275), [다이오드 70개](https://www.devicemart.co.kr/goods/view?no=25), [스테빌라이저](https://smartstore.naver.com/monstarkorea/products/7124535764), [기계식 스위치 70개](https://smartstore.naver.com/monstarkorea/products/5540788428), [abs 키캡](https://ko.aliexpress.com/w/wholesale-%ED%82%A4%EC%BA%A1.html?spm=a2g0o.home.search.0)의 부품을 구매 하였다. 제작에 필요한 키보드 하우징은 3D프린터([모델](https://www.thingiverse.com/thing:6360907))를 이용해 출력해주었고, 회로는 대학 동아리방에 있는 인두기와 땜납을 사용하여 직접 제작해주었다.

하우징 프린팅을 위해 모델을 고르는 과정에서, 평소 사용해보고 싶었던 해피해킹 배열의 모델링을 우선적으로 고려하여 선정하였다.

## 설계

아두이노 프로 마이크로 호환 보드에는 총 18개의 PIN이 있는데, 이들을 통해 13*5 크기의 Matrix를 구성해주어 총 65개의 key를 구현해줄 수 있었다. 가로 줄 중 하나에 High 전압을 걸어준 후 세로 줄의 전압을 순차적으로 검사하며, 만약 key가 눌린 상태라면 해당 key의 세로 줄에서 High 전압이 측정되게 된다. 순차적인 검사를 통해 key의 눌림 상태를 체크하기 때문에 서로 다른 여러 개의 위치의 key를 동시에 누르더라도, 프로그램 상으로 서로 같은 시간에 전압을 체크하지 않기 때문에 이론적으로 무한동시입력이 가능하게 된다. 이때, 하드웨어적으로 무한동시입력을 구현하기 위해서 다이오드가 필수적으로 필요한데, 다이오드가 없이 Matrix를 구성한다면 전류의 leaking이 발생하여 입력하지 않은 key에서도 High Voltage가 측정이 되어 원치 않는 Keyboard Event가 발생할 수 있기 때문이다.

## 제작

