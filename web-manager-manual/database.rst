************************
데이터베이스 관리
************************

.. toctree::
    :hidden:

    dashboard.rst
    db_user.rst
    automation.rst
    database_operations.rst

.. image:: /images/database-tree.png

데이터베이스 노드를 펼치면 **사용자(Users)**, **작업 자동화(Job automation)**, **공간(Space)** 하위 노드가 나타난다.

로그인 여부 표시
================

데이터베이스 트리의 각 행 이름 옆에 자물쇠 아이콘이 표시된다: 열린 자물쇠(밝은 녹색)는 로그인된 상태, 닫힌 자물쇠(회색)는
로그인되지 않은 상태를 뜻한다. 로그인 방법은 :doc:`database_operations` 참고.

.. important::

    **해당 데이터베이스에 로그인하지 않은 상태에서는 우클릭 메뉴의 어떤 기능도 실행할 수 없다** (Manage Database,
    Database Info, Space 하위 기능 포함). 로그인 안 된 상태에서는 메뉴 항목 자체가 비활성화된다.

프로필 저장 여부 표시
======================

서버에 저장된 데이터베이스 로그인 프로필이 있으면 자물쇠 아이콘 옆에 열쇠 아이콘이 뜨고, 없으면 뜨지 않는다.

HA 상태 표시
============

HA로 구성된 데이터베이스는 트리에 **HA** 배지와 복제 상태 배지가 함께 표시된다. 배지가 뜨는 조건과 각 상태의
의미는 :doc:`ha` 참고.

데이터베이스를 우클릭하면 **데이터베이스 관리(Manage Database)** 하위에서 사용할 수 있는 기능은 다음과 같다
(로그인 상태여야 실행할 수 있다. 각 기능의 실제 사용법은 :doc:`database_operations` 참고).

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - 기능
      - 설명
    * - 데이터베이스 언로드(Unload Database)
      - 스키마/데이터를 파일로 내보낸다
    * - 데이터베이스 로드(Load Database)
      - 언로드된 파일을 데이터베이스에 적재한다
    * - 데이터베이스 검사(Check Database)
      - 데이터베이스 정합성을 검사한다
    * - 데이터베이스 공간 정리(Compact Database)
      - 사용하지 않는 공간을 정리한다
    * - 데이터베이스 볼륨 추가(Add Database Volume)
      - 저장 공간(볼륨)을 추가한다
    * - 데이터베이스 최적화(Optimize Database)
      - 클래스 통계 정보를 갱신한다
    * - 데이터베이스 복사(Copy Database)
      - 데이터베이스 전체를 다른 이름으로 복제한다
    * - 데이터베이스 이름 변경(Rename Database)
      - 데이터베이스 이름을 바꾼다
    * - 데이터베이스 복구(Restore Database)
      - 백업으로부터 데이터베이스를 복원한다
    * - 데이터베이스 백업(Backup Database)
      - 데이터베이스를 백업한다
    * - 데이터베이스 삭제(Delete Database)
      - 데이터베이스를 영구히 삭제한다

.. note::

    데이터베이스 로드/최적화/복사/이름 변경/복구/삭제는 데이터베이스가 실행 중이면 비활성화된다. 먼저 중지해야 한다.
    반대로 **데이터베이스 정보(Database Info)** 하위의 잠금 정보/트랜잭션 정보/질의 수행 계획은 실행 중일 때만
    활성화된다.

데이터베이스 정보(Database Info)
===================================

우클릭 → **데이터베이스 정보(Database Info)** 하위에 아래 항목들이 있다.

* **속성(Properties)** — 접속/서버 파라미터 조회 및 수정.

.. image:: /images/database-param-dump.png

* **파라미터 덤프(Param Dump)** — 파라미터 값 비교.

.. image:: /images/database-lock-info.png

* **잠금 정보(Locking Information)** — 잠금 세션/객체/에스컬레이션 정보.

.. image:: /images/database-transaction-info.png

* **트랜잭션 정보(Transaction information)** — 활성 트랜잭션 목록, 트랜잭션 강제 종료 가능.

.. image:: /images/database-plan-dump.png

* **질의 수행 계획(Plan Dump)** — 쿼리 실행 계획 캐시 덤프.

.. warning::

    Properties의 "Apply Changes"는 실제 호스트의 cubrid.conf를 즉시 덮어쓴다.

.. important::

    Properties가 편집하는 대상은 **여는 경로에 따라 다르다.** 특정 데이터베이스를 우클릭해서 열면 cubrid.conf의
    ``[@데이터베이스명]`` 섹션(그 데이터베이스만의 개별 설정)을 편집한다. 반면 위 "전체 데이터베이스 메뉴"처럼
    특정 데이터베이스가 선택되지 않은 상태(데이터베이스 트리 루트)에서 Properties를 열면 ``[common]`` 섹션
    (호스트 전체 기본값)을 편집한다 — 둘은 서로 다른 섹션이니 어느 쪽을 열었는지 화면 제목에서 확인한다.

공간 모니터(Space)
===================

.. image:: /images/database-space-monitor.png

데이터베이스 노드 하위의 **공간(Space)** 를 더블클릭하면 데이터베이스 공간 모니터 탭이 열린다. 상단에 데이터베이스 이름,
사용/전체 용량, 여유 공간, 사용률(페이지 크기·로그 페이지 크기 포함)이 요약되고, 아래에 세 개의 표와 도넛 차트가 나온다.

.. list-table::
    :header-rows: 1
    :widths: 30 70

    * - 표
      - 설명
    * - 볼륨 분류(Volume Categorization)
      - 유형(Type)/용도(Purpose)별로 묶은 요약 표. 볼륨 개수, 사용/여유/전체 용량, 사용률이 표시되며, 유형
        배지를 클릭하면 해당 카테고리의 볼륨 카테고리 모니터가 열린다.
    * - 볼륨 구성(Physical Volume Topology)
      - 볼륨 파일 하나당 한 행으로, 유형/용도, 페이지 단위 할당량(사용/전체 페이지, 여유 비율 막대), 날짜,
        경로가 표시된다. 볼륨 이름을 클릭하면 해당 볼륨의 볼륨 정보 화면이 열린다.
    * - 파일 공간 사용량(File Space Usage)
      - 데이터 유형별 파일 개수와 사용/전체 용량.
    * - 분포(Distribution)
      - 사용/여유 비율을 보여주는 도넛 차트.

Space 하위 카테고리 노드는 다음과 같다(``Permanent Data``/``Permanent Temp``/``Temporary``/``Archive``\ 는 로케일과
무관하게 화면에 항상 영문으로만 표시된다). 각 카테고리를 펼치면 그 카테고리에 속한 개별 볼륨 파일 노드가 나타난다.

* **Permanent Data**
* **Permanent Temp**
* **Temporary**
* **로그(Log)** — 하위에 **활성(Active)**, **Archive**

.. image:: /images/database-volume-category-monitor.png

카테고리 노드(예: Permanent Data)를 더블클릭하면 볼륨 카테고리 모니터가 열린다. 해당 카테고리의 볼륨 개수, 전체 용량,
사용률 카드와 전체 사용률 막대, 그리고 볼륨별 표(볼륨 이름, 사용량 막대, 전체 용량, 페이지 수)가 표시된다.

.. image:: /images/database-volume-info-monitor.png

개별 볼륨 파일 노드를 더블클릭하면 볼륨 정보 화면이 열린다. 사용/여유 용량 막대와 함께 볼륨 이름, 위치, 용도, 페이지
크기, 총/사용/여유 페이지 수, 총 용량이 표로 표시된다.

.. note::

    세 화면 모두 헤더에 자동 새로고침 배지(LIVE/PAUSED)와 새로고침 설정 아이콘이 있다. 새로고침 간격 설정은
    :doc:`dashboard` 문서를 참고한다.

전체 데이터베이스 메뉴(ALL DATABASES)
=======================================

.. image:: /images/database-all-databases-menu.png
   :width: 260px

"Databases" 트리 루트를 우클릭하면 "ALL DATABASES" 메뉴가 나타난다. :doc:`broker` 의 "ALL BROKERS" 메뉴와 같은
성격의, 해당 호스트의 데이터베이스 전체를 대상으로 하는 일괄 작업 메뉴이다.

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - 기능
      - 설명
    * - 모든 데이터베이스 시작(Start All Databases)
      - 현재 중지된 데이터베이스를 전부 시작한다
    * - 모든 데이터베이스 중지(Stop All Databases)
      - 현재 활성 데이터베이스를 전부 중지한다
    * - 모든 데이터베이스 재시작(Restart All Databases)
      - 현재 활성 데이터베이스를 전부 중지했다가 다시 시작한다
    * - 데이터베이스 생성(Create Database)
      - :doc:`database_operations` 의 "데이터베이스 생성" 마법사를 연다
    * - 새로 고침(Refresh)
      - 데이터베이스 목록을 새로고침한다
    * - 속성(Properties)
      - 데이터베이스 속성 화면을 연다

.. image:: /images/database-start-all-confirm.png

HA로 구성된 데이터베이스가 있으면 시작/중지/재시작 범위가 달라진다 — 자세한 내용은 :doc:`ha` 참고.

데이터베이스 생성/로그인/시작·중지/백업·복원/언로드·로드 등 개별 작업의 화면별 사용법은 :doc:`database_operations`
참고.
