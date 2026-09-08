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

상단 메뉴 **Host Service Management** → **Edit Config Files** → **Edit Cubrid Config** 를 선택한다.
cubrid.conf를 대상으로 한다.

.. warning::

    저장 시 문법 검사 없이 즉시 반영되니 신중하게 사용한다.

CM Config 편집
===================

상단 메뉴 **Host Service Management** → **Edit Config Files** → **Edit CM Config** 를 선택한다.
cm.conf(CMS 자체 설정 파일)를 대상으로 하며, 편집기 화면 구성과 저장 방식은 Cubrid Config 편집과 동일하다.

.. warning::

    저장 시 문법 검사 없이 즉시 반영되니 신중하게 사용한다.

Broker Config 편집은 :doc:`broker` 문서를 참고한다 (브로커 탭의 "ALL BROKERS" 메뉴에서 연다).
