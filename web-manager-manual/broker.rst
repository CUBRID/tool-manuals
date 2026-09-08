***************
브로커 관리
***************

.. image:: /images/broker-tree.png

사이드바의 브로커 탭-스위처 아이콘을 클릭하면 트리가 데이터베이스와 브로커 사이를 전환한다.

* 브로커를 더블클릭하면 상태 탭이 열린다.
* 우클릭 시 **Stop Broker** 와 **Start Broker** 중 정확히 하나만 표시된다.
* 탭-스위처 아이콘 자체를 우클릭하면 "ALL BROKERS" 메뉴(Start All / Stop All / Restart All / **Edit Broker Config** 등)가 나온다.

Broker Config 편집
===================

.. note::

    이 화면은 값을 직접 편집하는 속성 편집기이며, 필수로 표시되는 항목은 없다 (모든 값은 선택 입력이고 비워두면
    CUBRID의 기본값이 적용된다). 값을 하나라도 변경해야 **Apply** 버튼이 활성화된다.

.. warning::

    Save는 실제 cubrid_broker.conf에 미리보기 없이 즉시 반영된다. 신중하게 사용한다.

로그 뷰어
=========

.. image:: /images/broker-log-viewer.png

브로커의 **SQL Log** 폴더를 확장하고 파일을 더블클릭하면 Log Viewer 탭이 열린다.
모드 전환 버튼 3개(**Raw Log** / **Parsed SQL** / **Top SQL**)로 보기 방식을 바꿀 수 있다.
