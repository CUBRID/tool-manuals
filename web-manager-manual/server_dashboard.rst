**************************
서버 / 서비스 대시보드
**************************

Server Dashboard
=================

.. image:: /images/server-dashboard.png

호스트 하나의 전체 운영 현황을 한 화면에 모아 보여주는 대시보드이다. 호스트를 더블클릭하면 열리며, 5개 섹션으로 구성된다.

.. list-table::
    :header-rows: 1
    :widths: 25 75

    * - 섹션
      - 설명
    * - Storage Volumes
      - 이 호스트에 있는 모든 데이터베이스의 볼륨 사용량을 데이터베이스별로 요약한다.
    * - Broker Status
      - 이 호스트에 등록된 모든 브로커의 실행 상태(ON/OFF)와 처리량을 한 번에 보여준다.
    * - System Status
      - 호스트 OS의 CPU/메모리 사용률 등 시스템 리소스 현황을 보여준다.
    * - Databases
      - 이 호스트의 데이터베이스 목록과 실행 상태를 보여준다.
    * - Environment Details
      - CUBRID 버전, 설치 경로 등 호스트 환경 정보를 보여준다 (:doc:`host` 의 "서버 버전" 절과 같은 정보다).

Service Dashboard (전체 현황)
==============================

.. image:: /images/service-dashboard.png

여러 호스트를 한 화면에서 비교하기 위한 대시보드이다. 상단 메뉴 **호스트 서비스 관리(Host Service Management)**
→ **서비스 대시보드(Service Dashboard)** 를 선택하면 열리며, 등록된 모든 호스트 목록과
HA 필터(All/Master/Slave/Replica)를 확인할 수 있다.

호스트의 ``cubrid.conf`` / ``cm.conf`` / ``cubrid_broker.conf`` 설정 파일을 NCA에서 직접 열어 편집하는
방법은 :doc:`config_editor` 문서에서 따로 설명한다.
