***
HA
***

이 장은 CUBRID HA(복제) 구성을 NCA에서 다룰 때 알아야 할 것만 정리한다. HA 복제 자체의 원리·설정 방법은
`CUBRID 매뉴얼 HA 장 <https://www.cubrid.org/manual/ko/11.4/ha.html>`_ 을 참고한다.

.. _ha-badges:

HA 배지와 복제 상태
======================

호스트가 HA로 구성되어 있고 해당 데이터베이스가 ``cubrid_ha.conf`` 의 ``ha_db_list`` 에 있으면, :ref:`database-ha-status`
에서 보듯 데이터베이스 트리의 이름 옆에 **HA** 배지가 표시된다(로케일과 무관하게 항상 "HA"로만 표시된다).

이 배지 옆에는 그 데이터베이스 서버 프로세스 자체의 복제 상태(CUBRID 엔진의 ``HA_SERVER_STATE``)를 보여주는
배지가 하나 더 붙는다 — 마스터/슬레이브/레플리카 같은 노드 단위 역할과는 별개의 정보다.

.. list-table::
    :header-rows: 1
    :widths: 20 80

    * - 상태
      - 설명
    * - active
      - 마스터 노드에서 실행 중인 서버의 일반적인 상태. 읽기/쓰기를 포함한 모든 서비스를 제공한다.
    * - standby
      - 슬레이브·레플리카 노드에서 실행 중인 서버의 일반적인 상태. 읽기 전용 서비스만 제공한다.
    * - to-be-active
      - 장애 조치(failover) 등으로 standby 서버가 active로 전환되는 중간 상태. 기존 마스터로부터 받은
        트랜잭션 로그를 반영하며 active가 될 준비를 한다.
    * - to-be-standby
      - active 서버가 standby로 전환되는 중간 상태(to-be-active의 반대 방향).
    * - maintenance
      - 운영 편의를 위해 수동으로 전환할 수 있는 상태. csql로만 접속할 수 있고 사용자에게는 서비스를
        제공하지 않는다.
    * - idle
      - 아직 역할이 정해지지 않은 초기 상태.
    * - dead
      - 서버가 죽은 것으로 간주되는 가상 상태 — 실제로 그 상태로 실행 중인 프로세스가 있는 것은 아니다.

두 배지 모두 호스트의 HA 하트비트 데이터가 있어야 표시되며, 이 데이터는 HA로 알려진 호스트에 접속하면 자동으로
조회된다. :ref:`server-dashboard-section` 의 Databases 목록에도 동일한 배지가 표시된다.

.. _ha-in-dashboard:

대시보드에서 HA 확인하기
==========================

.. image:: /images/server-dashboard.png

HA로 구성된 호스트를 더블클릭해 :ref:`server-dashboard-section` 를 열면, 맨 위에 **HA 클러스터 상태** 카드가
추가로 나타난다(HA가 아닌 호스트에는 나타나지 않는다). 클러스터에 속한 각 노드의 호스트명과 역할
(MASTER/SLAVE/REPLICA)을 배지로 보여주며, 응답하지 않는 노드는 빨간 점으로 표시된다.

여러 호스트를 한 화면에서 비교하는 :ref:`service-dashboard-section` 에는
HA 필터(All/Master/Slave/Replica)가 있어, 특정 역할의 호스트만 걸러 볼 수 있다.

.. _ha-start-stop-difference:

시작/중지의 차이
==================

HA로 구성된 데이터베이스라고 해서 시작/중지 조작이 달라지지는 않는다. 데이터베이스를 하나씩 시작/중지할 때는
물론, **전체 데이터베이스 시작/중지(ALL DATABASES)** 메뉴에서도 현재 중지된(또는 활성) 데이터베이스마다
개별적으로 시작/중지가 실행되며, HA 여부에 따라 여러 데이터베이스를 하나로 묶어 처리하지 않는다.

.. _ha-restricted-operations:

제한되는 작업
==============

:doc:`database_operations` 의 아래 다섯 작업은 HA 환경에서 막혀 있다. 시도하면 오류가 표시되며, 막는 기준이
서로 다르다는 점에 주의한다.

.. list-table::
    :header-rows: 1
    :widths: 25 20 55

    * - 작업
      - 막히는 기준
      - 이유
    * - 데이터베이스 생성(Create Database)
      - 호스트 (``cubrid.conf`` 의 ``ha_mode`` 가 켜져 있는 호스트 전체)
      - 새로 만들 데이터베이스 이름과 무관하게, HA로 설정된 호스트에서는 생성 자체가 막힌다.
    * - 데이터베이스 삭제(Delete Database)
      - 호스트 (위와 동일)
      - 위와 동일하게, HA로 설정된 호스트에서는 어떤 데이터베이스도 이 화면으로 삭제할 수 없다.
    * - 데이터베이스 로드(Load Database)
      - 데이터베이스 (``cubrid_ha.conf`` 의 ``ha_db_list`` 에 있는 데이터베이스만)
      - ``loaddb`` 는 항상 SA 모드로 실행되는데, SA 모드 프로세스는 시작 시 HA 모드를 내부적으로 꺼버린다.
        그 상태로 적재한 내용은 반대쪽 노드로 복제되지 않아 마스터/슬레이브가 조용히 어긋나게 된다.
    * - 이름 변경(Rename Database)
      - 데이터베이스 (위와 동일)
      - ``renamedb`` 는 로컬 ``databases.txt`` 항목과 볼륨 파일만 바꿀 뿐 ``cubrid_ha.conf`` 나 반대쪽
        노드는 전혀 모른다. 이름을 바꾸면 HA 짝(peer)이 옛 이름을 계속 참조하게 되어 HA 구성이 깨진다.
    * - 데이터베이스 복구(Restore Database)
      - 데이터베이스 (위와 동일)
      - 일반 ``restoredb`` 는 HA 복제 재개 위치를 기록하는 ``ha_apply_info`` 카탈로그를 갱신하지 않아,
        복원 후 반대쪽 노드의 복제 적용 위치가 어긋난다.

Restore가 꼭 필요하다면 호스트에 직접 접속해 콘솔에서 ``restoreslave`` 유틸리티를 사용해야 한다. Load/Rename은
NCA·CA를 통틀어 대체 수단이 없으며, 반드시 그 데이터베이스를 HA 구성에서 먼저 제외한 뒤 진행해야 한다.
