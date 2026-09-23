*********
대시보드
*********

.. _server-dashboard-section:

호스트 대시보드(Host Dashboard)
=================================

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
      - 호스트 OS의 CPU/메모리 사용률 등 시스템 자원 현황을 보여준다.
    * - Databases
      - 이 호스트의 데이터베이스 목록과 실행 상태를 보여준다.
    * - Environment Details
      - CUBRID 버전, 설치 경로 등 호스트 환경 정보를 보여준다 (:ref:`server-version` 의 호스트 엔진 버전과 같은 정보다).

HA로 구성된 호스트는 이 5개 섹션 위에 **HA 클러스터 상태** 카드가 추가로 나타난다 — 자세한 내용은 :ref:`ha-in-dashboard` 참고.

.. _service-dashboard-section:

서비스 대시보드(Service Dashboard)
====================================

.. image:: /images/service-dashboard.png

여러 호스트를 한 화면에서 비교하기 위한 대시보드이다. 상단 메뉴 **호스트 서비스 관리(Host Service Management)**
→ **서비스 대시보드(Service Dashboard)** 를 선택하면 열리며, 등록된 모든 호스트 목록을 확인할 수 있다.
HA 필터(All/Master/Slave/Replica)에 대한 설명은 :ref:`ha-badges` 참고.

호스트의 ``cubrid.conf`` / ``cm.conf`` / ``cubrid_broker.conf`` 설정 파일을 NCA에서 직접 열어 편집하는
방법은 :doc:`config_editor` 문서에서 따로 설명한다.

데이터베이스 대시보드(Database Dashboard)
===========================================

.. image:: /images/database-dashboard.png

데이터베이스를 더블클릭하면 열리며, 6개 섹션으로 구성된다 (각 섹션은 헤더를 클릭해 접고 펼 수 있다).

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 섹션
      - 설명
    * - 성능 지표(Performance Metrics)
      - CPU, Memory, TPS, QPS, Buffer Hit 등 실시간 지표
    * - 저장소 볼륨(Storage Volumes)
      - 볼륨별 종류/용도/사용량/경로
    * - 파일 분포(File Distribution)
      - 파일 종류별 분포
    * - CAS 브로커(CAS Brokers)
      - 브로커별 상태. 행마다 Restart CAS / SQL Logs / Slow Query Logs 실행 가능
    * - 잠금 및 트랜잭션(Lock and Transaction)
      - 락/트랜잭션 목록
    * - 작업 자동화(Job automation)
      - Backup Plan / Query Plan 요약

.. _broker-status-dashboard:

전체 브로커 상태 보기(Show Status)
====================================

.. image:: /images/broker-show-status.png

호스트에 등록된 브로커들이 지금 요청을 정상적으로 처리하고 있는지 한눈에 점검하기 위한 실시간 모니터링
화면이다. 탭-스위처 아이콘 우클릭 → "ALL BROKERS" 메뉴 → **상태 보기(Show Status)** 를 선택하면 호스트의
모든 브로커가 한 표에 나열되고, 개별 브로커 우클릭 → **상태 보기(Show Status)** 를 선택하면 그 브로커
하나만 보는 상태 탭이 열린다(표 대신 브로커 하나의 상세 지표가 카드 형태로 표시된다).

전체 브로커 표의 칼럼은 다음과 같다.

.. list-table::
    :header-rows: 1
    :widths: 20 80

    * - 칼럼
      - 설명
    * - 이름(Name) / 상태(Status)
      - 브로커 이름과 현재 실행 상태(ON/OFF)
    * - PID
      - 브로커 프로세스의 OS 프로세스 ID
    * - Port
      - 브로커가 클라이언트 접속을 받는 포트 번호
    * - AS
      - Application Server(CAS) 프로세스 개수 — 이 브로커가 지금 띄우고 있는 CAS 수
    * - JQ
      - Job Queue — 처리를 기다리며 대기 중인 요청 수. 계속 쌓이면 CAS가 부족하다는 신호다
    * - REQ
      - 브로커가 시작된 뒤 지금까지 처리한 누적 요청 수
    * - TPS / QPS
      - 초당 트랜잭션 수 / 초당 질의 수 (실시간 처리량)
    * - 장기 트랜잭션 수/시간
      - 브로커 설정의 장기 트랜잭션 기준 시간을 넘겨 실행 중인 트랜잭션 수와 그 소요 시간
    * - 장기 질의 수/시간
      - 브로커 설정의 장기 질의 기준 시간을 넘겨 실행 중인 질의 수와 그 소요 시간
    * - 오류 질의 수
      - 오류로 끝난 질의의 누적 개수

행을 클릭하면 해당 브로커 하나만 보는 상태 탭이 열린다. 우측 상단에 새로고침 버튼과 :ref:`refresh-interval-settings`
에서 설명한 자동 새로고침 설정 팝오버가 있다 — 이 화면의 자동 새로고침은 Dashboard/Broker 간격 설정 중
**브로커(Broker)** 간격을 따른다. 간격이 0보다 크면 헤더에 LIVE 배지, 0(Off)이면 PAUSED 배지가 표시된다.

.. _refresh-interval-settings:

자동 새로고침 간격 설정
========================

.. image:: /images/monitoring-refresh-interval.png

위 대시보드들을 비롯해 실시간 데이터를 보여주는 화면들(Host Dashboard, Broker Status, Space/Volume
모니터 등) 우측 상단의 타이머 아이콘을 클릭하면 새로고침 간격 설정 팝오버가 열린다. **대시보드(Dashboard)**\ (데이터베이스
처리량/디스크 I/O 지표)와 **브로커(Broker)**\ (브로커 연결/부하 상태) 두 항목을 독립적으로 설정한다.

* 각 항목마다 **꺼짐(Off)** / 1s / 3s / 5s / 10s / 30s 프리셋 버튼과, 직접 초 단위 숫자를 입력하는 커스텀 입력란(0~86400초,
  즉 최대 24시간)이 있다.
* 설정은 사용자 계정에 저장되어 다음 로그인에도 유지된다.
* 하나라도 0(Off)보다 크게 설정되어 있으면 타이머 아이콘에 초록 점이 표시된다.
