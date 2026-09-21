**********************
쿼리 자동화 / 볼륨
**********************

이 장에서 다루는 예약 실행(Query Plan/Backup Plan과 같은 계열)과 자동 볼륨 확장은 CMS가 직접 실행한다.
따라서 NCA가 꺼져 있어도 CMS가 살아있는 호스트에서는 예약된 작업이 그대로 실행된다.

쿼리 자동 실행(Query Plan)
===========================

.. image:: /images/query-plan.png

데이터베이스 → Job automation → **질의 자동화 계획(Query Plan)** 폴더 우클릭 → **질의 자동화 계획 추가(Add Query Plan)** 을 선택한다.
Query ID, Username(기본값 "public"), Password, 실행 스케줄(주기, 시각), SQL문을 입력한다.

.. note::

    수정 시 Query ID는 읽기 전용이며, Password는 매번 빈 값으로 표시되므로(CMS가 값을 절대 돌려주지 않음) 수정할 때마다 다시 입력해야 한다.

질의 자동화 계획 수행 로그(Auto Query Log)
============================================

.. image:: /images/automation-auto-query-log.png

데이터베이스 → Job automation → **질의 자동화 계획(Query Plan)** 폴더 우클릭 → **질의 자동화 계획 수행로그(Auto Query Log)** 를 선택하면 열린다. 질의
자동화 계획이 실제로 실행된 이력을 보여주는 읽기 전용 로그 화면이다.

* 컬럼: **질의 ID(Query ID)**, **실행 시간(Execution Time)**, **설명(Description)** — 설명 칸에는 성공(초록 체크),
  자동 실행 시작(파란 재생), 오류(빨강) 상태가 아이콘으로 함께 표시된다.
* ID/설명으로 필터링, 15건 단위 페이지네이션 또는 전체 보기 전환이 가능하다.
* 현재 선택된 데이터베이스로 목록이 좁혀지며, 선택된 데이터베이스가 없으면 호스트 전체 이력("Global Query
  Execution History")을 보여준다.

볼륨 추가(Add Volume)
======================

.. image:: /images/database-add-volume.png

데이터베이스 → **공간(Space)** 폴더 우클릭 → **볼륨 추가(Add Volume)**, 또는 데이터베이스 우클릭 → Manage Database →
**데이터베이스 볼륨 추가(Add Database Volume)** — 둘 다 같은 대화창을 연다. 필드 설명(Purpose/Path/Size)과 ``addvoldb`` 유틸리티 옵션
대응 관계는 :doc:`database` 의 "볼륨 추가" 절 참고.

자동 볼륨 확장 설정(Set Automation Volume)
============================================

.. image:: /images/automation-set-volume.png

데이터베이스 → **공간(Space)** 폴더 우클릭 → **볼륨 자동 추가 설정(Set Automation Volume)** 을 선택한다.

.. important::

    이미 만들어진 데이터베이스의 자동 볼륨 확장 정책을 언제든 켜고 끄고 값을 바꿀 수 있는 화면이다. 데이터베이스
    생성 마법사에 있는 1회성 "Automatic volume extension" 단계(:doc:`database` 참고)와는 서로 다른 기능이니
    혼동하지 않는다 — 마법사 단계는 생성 시점에 값을 한 번 지정하는 것이고, 이 화면은 기존 데이터베이스에 대해
    언제든 다시 열어 값을 바꿀 수 있는 설정 화면이다.

.. list-table::
    :header-rows: 1
    :widths: 30 55 15

    * - 항목
      - 설명
      - 기본값
    * - Data + Index Volume (토글)
      - 정책 전체를 켜고 끈다. 데이터 볼륨과 인덱스 볼륨을 따로 설정할 수는 없고, 하나의 임계값/확장 크기가
        양쪽에 동일하게 적용된다
      - 꺼짐
    * - 임계값(Trigger threshold)
      - 여유 공간이 이 비율(%) 이하로 떨어지면 자동 확장이 실행된다. 5~30% 사이에서 슬라이더로 조절한다
      - 5%
    * - Expansion Size (MB)
      - 자동 확장 시 늘어나는 용량(MB). 16KB 페이지 크기 기준으로 환산한 **Extension Pages**\ (페이지 수)가
        옆에 읽기 전용으로 함께 표시된다
      - —

볼륨 자동 확장 로그(Auto Volume Log)
======================================

.. image:: /images/automation-auto-volume-log.png

데이터베이스 → **공간(Space)** 폴더 우클릭 → **볼륨 자동 확장 로그(Auto Volume Log)** 를 선택하면 열린다. 자동 볼륨 확장이 실제로
실행된 이력을 보여주는 읽기 전용 로그 화면이다.

* 컬럼: **데이터베이스(Database)**, **볼륨 이름(Volume name)**, **용도(Purpose)**, **페이지(Pages)**, **시간(Time)**, **결과(Result)** — Auto Backup Log/Auto
  Query Log와 달리 결과가 별도의 **결과(Result)** 컬럼으로 분리되어 있고, 성공/시작/실패에 따라 각각 초록/노랑/빨강
  아이콘과 색으로 표시된다.
* 볼륨 이름/결과/데이터베이스명으로 필터링, 15건 단위 페이지네이션 또는 전체 보기 전환이 가능하다.
* 현재 선택된 데이터베이스로 목록이 좁혀지며, 선택된 데이터베이스가 없으면 호스트 전체 이력("Global Volume
  Auto Expansion History")을 보여준다.
