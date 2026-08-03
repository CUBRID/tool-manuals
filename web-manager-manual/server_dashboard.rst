**************************
서버 / 서비스 대시보드
**************************

Server Dashboard
=================

.. image:: /images/server-dashboard.png

호스트를 더블클릭하면 열리며, 5개 섹션(Storage Volumes, Broker Status, System Status, Databases, Environment Details)으로 구성된다.

.. warning::

    Databases 섹션의 "Auto Startup" 토글은 실제 cubrid.conf의 자동시작 목록을 즉시 수정한다.

Service Dashboard (전체 현황)
==============================

.. image:: /images/service-dashboard.png

상단 메뉴 **Host Service Management** → **Service Dashboard** 를 선택한다. 등록된 모든 호스트 목록과
HA 필터(All/Master/Slave/Replica)를 확인할 수 있다.

Cubrid Config 편집
===================

상단 메뉴 **Host Service Management** → **Config Param** → **Edit Cubrid Config** 를 선택한다.

.. warning::

    저장 시 문법 검사 없이 즉시 반영되니 신중하게 사용한다.
