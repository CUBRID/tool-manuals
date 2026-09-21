*************************************
데이터베이스 대시보드 / 정보 대화창
*************************************

Database Dashboard
===================

.. image:: /images/database-dashboard.png

데이터베이스를 더블클릭하면 열리며, 6개 섹션으로 구성된다 (각 섹션은 헤더를 클릭해 접고 펼 수 있다).

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 섹션
      - 설명
    * - 성능 지표(Performance Metrics)
      - CPU, Memory, TPS, QPS, Buffer Hit 등 실시간 지표
    * - 스토리지 볼륨(Storage Volumes)
      - 볼륨별 종류/용도/사용량/경로
    * - 파일 분포(File Distribution)
      - 파일 종류별 분포
    * - CAS 브로커(CAS Brokers)
      - 브로커별 상태. 행마다 Restart CAS / SQL Logs / Slow Query Logs 실행 가능
    * - 잠금 및 트랜잭션(Lock and Transaction)
      - 락/트랜잭션 목록
    * - 작업 자동화(Job automation)
      - Backup Plan / Query Plan 요약

Database Info
=============

우클릭 → **데이터베이스 정보(Database Info)** 하위에 아래 항목들이 있다. Locking Information/Transaction information/Plan Dump는
데이터베이스가 실행 중일 때만 활성화된다 (실시간 서버 상태 조회이므로).

* **속성(Properties)** — 접속/서버 파라미터 조회 및 수정
* **파라미터 덤프(Param Dump)** — 파라미터 값 비교

  .. image:: /images/database-param-dump.png

* **잠금 정보(Locking Information)** — 잠금 세션/객체/에스컬레이션 정보

  .. image:: /images/database-lock-info.png

* **트랜잭션 정보(Transaction information)** — 활성 트랜잭션 목록, 트랜잭션 강제 종료 가능

  .. image:: /images/database-transaction-info.png

* **질의 수행 계획(Plan Dump)** — 쿼리 실행 계획 캐시 덤프

  .. image:: /images/database-plan-dump.png

.. warning::

    Properties의 "Apply Changes"는 실제 호스트의 cubrid.conf를 즉시 덮어쓴다.

.. important::

    Properties가 편집하는 대상은 **여는 경로에 따라 다르다.** 특정 데이터베이스를 우클릭해서 열면 cubrid.conf의
    ``[@데이터베이스명]`` 섹션(그 데이터베이스만의 개별 설정)을 편집한다. 반면 :doc:`database` 의 "전체
    데이터베이스 메뉴"처럼 특정 데이터베이스가 선택되지 않은 상태(데이터베이스 트리 루트)에서 Properties를 열면
    ``[common]`` 섹션(호스트 전체 기본값)을 편집한다 — 둘은 서로 다른 섹션이니 어느 쪽을 열었는지 화면 제목에서
    확인한다.

자동 새로고침 간격 설정
========================

.. image:: /images/monitoring-refresh-interval.png

Database Dashboard를 비롯해 실시간 데이터를 보여주는 화면들(Server Dashboard, Broker Status, Space/Volume
모니터 등) 우측 상단의 타이머 아이콘을 클릭하면 새로고침 간격 설정 팝오버가 열린다. **대시보드(Dashboard)**\ (데이터베이스
처리량/디스크 I/O 지표)와 **브로커(Broker)**\ (브로커 연결/부하 상태) 두 항목을 독립적으로 설정한다.

* 각 항목마다 **꺼짐(Off)** / 1s / 3s / 5s / 10s / 30s 프리셋 버튼과, 직접 초 단위 숫자를 입력하는 커스텀 입력란(0~86400초,
  즉 최대 24시간)이 있다.
* **적용(Apply)** 를 눌러야 반영되며, 설정은 사용자 계정에 저장되어 다음 로그인에도 유지된다.
* 하나라도 0(Off)보다 크게 설정되어 있으면 타이머 아이콘에 초록 점이 표시된다.
