***************
브로커 관리
***************

.. image:: /images/broker-tree.png

사이드바의 브로커 탭-스위처 아이콘을 클릭하면 트리가 데이터베이스와 브로커 사이를 전환한다.

* 브로커를 더블클릭하면 상태 탭이 열린다.
* 우클릭 시 **브로커 중지(Stop Broker)** 와 **브로커 시작(Start Broker)** 중 정확히 하나만 표시된다.
* 탭-스위처 아이콘 자체를 우클릭하면 "ALL BROKERS" 메뉴(Start All / Stop All / Restart All / **브로커 설정 편집(Edit Broker Config)** /
  **상태 보기(Show Status)** 등)가 나온다.

전체 브로커 상태 보기 (Show Status)
=====================================

.. image:: /images/broker-show-status.png

탭-스위처 아이콘 우클릭 → "ALL BROKERS" 메뉴 → **상태 보기(Show Status)** 를 선택하면(또는 개별 브로커 우클릭 →
**상태 보기(Show Status)** 로 그 브로커 하나만) 브로커 상태 탭이 열린다.

* 표 컬럼: **이름(Name)**, **상태(Status)**, PID, Port, AS(Application Server 수), JQ(Job Queue), REQ(요청 수), TPS, QPS,
  장기 트랜잭션 수/시간, 장기 쿼리 수/시간, 오류 쿼리 수.
* 행을 클릭하면 해당 브로커 하나만 보는 상태 탭이 열린다.
* 우측 상단에 새로고침 버튼과 :doc:`dashboard` 문서에서 설명한 자동 새로고침 설정 팝오버가 있다 — 이 화면의
  자동 새로고침은 Dashboard/Broker 간격 설정 중 **브로커(Broker)** 간격을 따른다. 간격이 0보다 크면 헤더에 LIVE
  배지, 0(Off)이면 PAUSED 배지가 표시된다.

Broker Config 편집
===================

.. note::

    이 화면은 값을 직접 편집하는 속성 편집기이며, 필수로 표시되는 항목은 없다 (모든 값은 선택 입력이고 비워두면
    CUBRID의 기본값이 적용된다). 값을 하나라도 변경해야 **적용(Apply)** 버튼이 활성화된다.

.. warning::

    Save는 실제 cubrid_broker.conf에 미리보기 없이 즉시 반영된다. 신중하게 사용한다.

브로커 속성 (Properties)
==========================

.. image:: /images/broker-properties.png

브로커 우클릭 → **속성(Properties)** 를 선택하면 열린다. 위 "Broker Config 편집"이 ``cubrid_broker.conf`` 파일
전체를 텍스트로 편집하는 화면인 것과 달리, 이 화면은 우클릭한 브로커 한 개의 파라미터만 표 형태로 보여주고
수정하는 구조화된 편집기이다. 저장 시에도 그 브로커의 섹션에만 값이 반영되고, 파일의 다른 브로커나 공통
``[broker]`` 섹션은 건드리지 않는다.

* **일반(Common)** / **고급(Advanced)** 두 탭에 파라미터가 나뉘어 있다(Common 11개, Advanced 16개, 총 27개). 목록은
  웹매니저가 미리 정의한 고정 목록이며, 실제 conf 파일에 없는 값은 CUBRID 기본값으로 채워져 표시된다.
* 각 행은 파라미터 이름/타입/값으로 구성된다. 값이 정해진 옵션 집합을 갖는 파라미터(예: ON/OFF)는 드롭다운으로,
  그 외에는 텍스트/숫자 입력으로 표시된다.
* 값을 바꾼 파라미터는 표에서 강조 표시되고, 상단에 변경된 개수가 배지로 표시된다. 하나 이상 바뀌어야
  **적용(Apply)** 버튼이 활성화된다.
* **초기화(Reset)** 으로 변경 사항을 되돌릴 수 있다(값을 하나라도 바꾼 뒤에만 나타난다).

.. warning::

    **적용(Apply)** 는 실제 ``cubrid_broker.conf``\ 에 해당 브로커 섹션 값만 즉시 반영한다. 신중하게 사용한다.

로그 뷰어
=========

.. image:: /images/broker-log-viewer.png

브로커의 **SQL 로그(SQL Log)** 폴더를 확장하고 파일을 더블클릭하면 Log Viewer 탭이 열린다.
모드 전환 버튼 3개(**원시 로그(Raw Log)** / **파싱된 SQL(Parsed SQL)** / **Top SQL**)로 보기 방식을 바꿀 수 있다
(``Top SQL``\ 은 로케일과 무관하게 화면에 항상 영문으로만 표시된다).
