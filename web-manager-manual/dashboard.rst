*************************************
데이터베이스 대시보드 / 정보 모달
*************************************

Database Dashboard
===================

.. image:: /images/database-dashboard.png

데이터베이스를 더블클릭하면 열리며, 6개 섹션으로 구성된다 (각 섹션은 헤더를 클릭해 접고 펼 수 있다).

#. **Performance Metrics** — CPU, Memory, TPS, QPS, Buffer Hit 등 실시간 지표
#. **Storage Volumes** — 볼륨별 종류/용도/사용량/경로
#. **File Distribution** — 파일 종류별 분포
#. **CAS Brokers** — 브로커별 상태, 행마다 Restart CAS / SQL Logs / Slow Query Logs 실행 가능
#. **Lock and Transaction** — 락/트랜잭션 목록
#. **Job automation** — Backup Plan / Query Plan 요약

Database Info
=============

우클릭 → **Database Info** 하위에 아래 항목들이 있다. Locking Information/Transaction information/Plan Dump는
데이터베이스가 실행 중일 때만 활성화된다 (실시간 서버 상태 조회이므로).

* **Properties** — 접속/서버 파라미터 조회 및 수정
* **Param Dump** — 파라미터 값 비교

  .. image:: /images/database-param-dump.png

* **Locking Information** — 잠금 세션/객체/에스컬레이션 정보

  .. image:: /images/database-lock-info.png

* **Transaction information** — 활성 트랜잭션 목록, 트랜잭션 강제 종료 가능

  .. image:: /images/database-transaction-info.png

* **Plan Dump** — 쿼리 실행 계획 캐시 덤프

  .. image:: /images/database-plan-dump.png

.. warning::

    Properties의 "Apply Changes"는 실제 호스트의 cubrid.conf를 즉시 덮어쓴다.
