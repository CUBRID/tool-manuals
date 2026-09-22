***************
브로커 관리
***************

.. image:: /images/broker-tree.png

사이드바의 브로커 탭-스위처 아이콘을 클릭하면 트리가 데이터베이스와 브로커 사이를 전환한다.

* 브로커를 더블클릭하면 상태 탭이 열린다.

.. image:: /images/broker-context-menu.png
   :width: 480px

* 우클릭 시 위와 같이 대상 브로커의 현재 상태에 따라 **브로커 중지(Stop Broker)** 또는 **브로커 시작(Start Broker)**\ 이 표시된다.

.. image:: /images/broker-all-menu.png
   :width: 480px

* 탭-스위처 아이콘 자체를 우클릭하면 위와 같이 "ALL BROKERS" 메뉴(Start All / Stop All / Restart All /
  **브로커 설정 편집(Edit Broker Config)** / **상태 보기(Show Status)** 등)가 나온다. **상태 보기(Show Status)** 는
  :ref:`broker-status-dashboard` 에서 따로 설명한다.

.. note::

    이 호스트에서 다른 작업(백업, 데이터베이스 생성 등)이 진행 중이면 브로커 시작/중지 메뉴 전체가
    비활성화된다. CUBRID 엔진 자체의 제약이 아니라, 동시 요청으로 인한 충돌을 막기 위한 NCA 쪽 정책이다.

``cubrid_broker.conf`` 파일 전체를 여는 **브로커 설정 편집(Edit Broker Config)** 화면은 :ref:`broker-config-edit`
에서 따로 설명한다.

.. _broker-properties:

브로커 속성(Properties)
=========================

.. image:: /images/broker-properties.png

브로커 우클릭 → **속성(Properties)** 를 선택하면 열린다. :ref:`broker-config-edit` 이
``cubrid_broker.conf`` 파일 전체를 텍스트로 편집하는 화면인 것과 달리, 이 화면은 우클릭한 브로커 한 개의
파라미터만 표 형태로 보여주고 수정하는 구조화된 편집기이다. 저장 시에도 그 브로커의 섹션에만 값이 반영되고,
파일의 다른 브로커나 공통 ``[broker]`` 섹션은 건드리지 않는다.

.. list-table::
    :header-rows: 1
    :widths: 25 75

    * - 항목
      - 설명
    * - 탭 구성
      - **일반(Common)** 11개, **고급(Advanced)** 16개, 총 27개 파라미터. NCA가 미리 정의한 고정 목록이며,
        실제 conf 파일에 없는 값은 CUBRID 기본값으로 채워져 표시된다.
    * - 입력 방식
      - 옵션 집합이 정해진 파라미터(예: ON/OFF)는 드롭다운, 그 외에는 텍스트/숫자 입력으로 표시된다.
    * - 변경 표시
      - 값을 바꾼 파라미터는 표에서 강조 표시되고 상단에 변경된 개수가 배지로 표시된다. 하나 이상 바뀌어야
        **적용(Apply)** 버튼이 활성화된다.
    * - 초기화(Reset)
      - 값을 하나라도 바꾼 뒤에만 나타나며, 변경 사항을 되돌린다.

.. warning::

    한 번 적용하면 롤백할 수 없으므로 신중하게 사용한다.

로그 뷰어(Log Viewer)
======================

.. image:: /images/broker-log-viewer.png

브로커의 **SQL 로그(SQL Log)** 폴더를 확장하고 파일을 더블클릭하면 Log Viewer 탭이 열린다.
모드 전환 버튼 3개(**원시 로그(Raw Log)** / **파싱된 SQL(Parsed SQL)** / **Top SQL**)로 보기 방식을 바꿀 수 있다.
