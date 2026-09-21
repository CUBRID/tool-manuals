************************
데이터베이스 트리
************************

.. image:: /images/database-tree.png

데이터베이스 노드를 펼치면 **사용자(Users)**, **작업 자동화(Job automation)**, **공간(Space)** 하위 노드가 나타난다.
데이터베이스를 우클릭하면 **데이터베이스 관리(Manage Database)** 하위에서 사용할 수 있는 기능은 다음과 같다.

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - 기능
      - 설명
    * - 데이터베이스 언로드(Unload Database)
      - 스키마/데이터를 파일로 내보낸다 (:doc:`backup` 참고)
    * - 데이터베이스 로드(Load Database)
      - 언로드된 파일을 데이터베이스에 적재한다 (:doc:`backup` 참고)
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
      - 백업으로부터 데이터베이스를 복원한다 (:doc:`backup` 참고)
    * - 데이터베이스 백업(Backup Database)
      - 데이터베이스를 백업한다 (:doc:`backup` 참고)
    * - 데이터베이스 삭제(Delete Database)
      - 데이터베이스를 영구히 삭제한다

.. note::

    데이터베이스 로드/최적화/복사/이름 변경/복구/삭제는 데이터베이스가 실행 중이면 비활성화된다. 먼저 중지해야 한다.
    반대로 **데이터베이스 정보(Database Info)** 하위의 잠금 정보/트랜잭션 정보/질의 수행 계획은 실행 중일 때만
    활성화된다.

로그인 여부 표시
================

데이터베이스 트리의 각 행 이름 옆에 자물쇠 아이콘이 표시된다: 열린 자물쇠(밝은 녹색)는 로그인된 상태, 닫힌 자물쇠(회색)는
로그인되지 않은 상태를 뜻한다.

.. important::

    **해당 데이터베이스에 로그인하지 않은 상태에서는 우클릭 메뉴의 어떤 기능도 실행할 수 없다** (Manage Database,
    Database Info, Space 하위 기능 포함). 로그인 안 된 상태에서는 메뉴 항목 자체가 비활성화된다.

HA 상태 표시
============

호스트가 HA로 구성되어 있고 해당 데이터베이스가 ``cubrid_ha.conf``\ 의 ``ha_db_list``\ 에 있으면, 데이터베이스
이름 옆에 **HA** 배지가 표시된다(로케일과 무관하게 화면에 항상 "HA"로만 표시된다). 이 배지 옆에는 해당 데이터베이스의 실시간 복제 상태 배지가 하나 더
붙는다: **active** / **standby** / **to-be-active** / **to-be-standby** / **maintenance** / **dead** /
**idle** 중 하나이며, CUBRID 엔진의 ``HA_SERVER_STATE``\ 를 그대로 표시한 것이다 (마스터/슬레이브/레플리카
같은 노드 단위 역할과는 별개로, 이 데이터베이스 서버 프로세스 자체의 복제 상태를 뜻한다). 두 배지 모두
호스트의 HA 하트비트 데이터가 있어야 표시되며, 이 데이터는 HA로 알려진 호스트에 접속하면 자동으로
조회된다. Server Dashboard의 Databases 목록에도 동일한 배지가 표시된다.

공간 모니터 (Space)
====================

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

Space 하위에는 **Permanent Data**, **Permanent Temp**, **Temporary**, **로그(Log)**\ (하위에 **활성(Active)**, **Archive**) 카테고리
(``Permanent Data``/``Permanent Temp``/``Temporary``/``Archive``\ 는 로케일과 무관하게 화면에 항상 영문으로만 표시된다)
노드가 있으며, 각 카테고리를 펼치면 그 카테고리에 속한 개별 볼륨 파일 노드가 나타난다.

.. image:: /images/database-volume-category-monitor.png

카테고리 노드(예: Permanent Data)를 더블클릭하면 볼륨 카테고리 모니터가 열린다. 해당 카테고리의 볼륨 개수, 전체 용량,
사용률 카드와 전체 사용률 막대, 그리고 볼륨별 표(볼륨 이름, 사용량 막대, 전체 용량, 페이지 수)가 표시된다.

.. image:: /images/database-volume-info-monitor.png

개별 볼륨 파일 노드를 더블클릭하면 볼륨 정보 화면이 열린다. 사용/여유 용량 막대와 함께 볼륨 이름, 위치, 용도, 페이지
크기, 총/사용/여유 페이지 수, 총 용량이 표로 표시된다.

.. note::

    세 화면 모두 헤더에 자동 새로고침 배지(LIVE/PAUSED)와 새로고침 설정 아이콘이 있다. 새로고침 간격 설정은
    :doc:`dashboard` 문서를 참고한다.

전체 데이터베이스 메뉴 (ALL DATABASES)
========================================

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
      - 아래 "데이터베이스 생성" 마법사를 연다
    * - 새로 고침(Refresh)
      - 데이터베이스 목록을 새로고침한다
    * - 속성(Properties)
      - 데이터베이스 속성 화면을 연다

.. image:: /images/database-start-all-confirm.png

데이터베이스 생성
==================

"Databases" 트리 루트 우클릭 → **데이터베이스 생성(Create Database)** 를 선택하면 5단계 마법사가 열린다:
General Information → Additional Volume Information → Automatic volume extension → Set DBA Password → Database Information(검토).
실제로는 CUBRID의 ``createdb`` 유틸리티를 실행한다.

.. image:: /images/database-create.png

**1단계. 일반 정보(General Information)**

.. list-table::
    :header-rows: 1
    :widths: 35 65

    * - 항목
      - CLI 대응
    * - Database name(데이터베이스 이름) \*
      - —
    * - Locale (예: ``en_US.iso88591``)
      - —
    * - Page size
      - ``--db-page-size``
    * - Volume size
      - ``--db-volume-size``
    * - Volume path
      - ``-F, --file-path``
    * - Log page size
      - ``--log-page-size``
    * - Log volume size
      - ``--log-volume-size``
    * - Log path
      - ``-L, --log-path``

**Start database after creation** 은 ``createdb`` 옵션이 아니라 생성 완료 후 별도로 실행되는 단계다.

.. image:: /images/database-create-step2.png

**2단계. 추가 볼륨 정보(Additional Volume Information)** — 추가 볼륨이 필요 없으면 그대로 다음으로 진행한다 (이 단계의 볼륨
이름/크기/경로는 선택적으로 입력할 수 있다).

.. image:: /images/database-create-step3.png

**3단계. 볼륨 자동 확장(Automatic volume extension)** — 자동 확장 설정(기본값을 그대로 사용해도 된다)을 확인한다. 이 설정은
``createdb`` 의 옵션이 아니라 CMS의 별도 자동 볼륨 확장 기능이다.

.. image:: /images/database-create-step4.png

**4단계. DBA 비밀번호 설정(Set DBA Password)** — Password/Password Confirm은 선택적으로 입력할 수 있는 값이다. 둘 다 비워두면 DBA 계정에 비밀번호 없이
생성되며, 값을 입력할 경우에는 8자 이상이어야 하고 Password/Password Confirm이 서로 일치해야 다음 단계로
진행할 수 있다.

.. image:: /images/database-create-step5.png

**5단계. 검토(Database Information)** — 요약을 확인하고 **완료(Finish)** 를 클릭하면 실제 생성 작업이 시작된다.

데이터베이스 로그인
====================

.. image:: /images/database-login.png

데이터베이스를 더블클릭하면 **데이터베이스 로그인(Login Database)** 대화창이 열린다. User name(기본값 "dba")과 Password를 입력한다.
**비밀번호 저장(Save Password)** 를 켜두면 다음부터 다시 입력하지 않아도 된다.

.. note::

    User name이 비어 있으면 로그인 버튼을 눌러도 아무 반응이 없다 (오류 메시지 없이 조용히 무시된다). Password는
    화면 자체에는 필수 표시가 없다 — 비밀번호가 없는 계정(예: public)은 비워두고 로그인할 수 있으며, 값이 틀리면
    CMS 인증 단계에서 오류가 표시된다.

로그아웃 / 저장된 자격증명 관리
================================

.. image:: /images/database-logout-confirm.png

로그인된 상태에서 우클릭하면 **데이터베이스 로그아웃(Logout Database)** 가 나타난다. 클릭하면 확인 대화창이 뜨고, 확인하면 로그인 상태만
해제된다 (저장된 비밀번호는 유지된다).

저장된 로그인 프로필이 있는 데이터베이스는 다음 두 항목도 함께 나타난다.

* **데이터베이스 자격증명 변경(Update Database Credentials)** — 위 "데이터베이스 로그인" 절과 같은 대화창을 다시 열어 저장된 사용자명/비밀번호를 갱신한다.

.. image:: /images/database-forget-credentials-confirm.png

* **저장된 자격증명 삭제(Forget Saved Credentials)** — 저장된 로그인 프로필 자체를 삭제한다. 다음부터는 다시 수동으로 로그인해야 한다.

시작 / 중지
===========

우클릭 시 **데이터베이스 중지(Stop Database)** 와 **데이터베이스 시작(Start Database)** 중 정확히 하나만 보이며, 로그인되어 있지 않으면 둘 다 비활성화된다.
클릭하면 바로 실행되지 않고 확인 대화창이 한 번 더 뜬다.

.. image:: /images/database-stop-confirm.png

**데이터베이스 중지(Stop Database)** 확인 대화창.

.. image:: /images/database-start-confirm.png

**데이터베이스 시작(Start Database)** 확인 대화창.

이름 변경
=========

.. image:: /images/database-rename.png

Manage Database → **데이터베이스 이름 변경(Rename Database)** (실행 중이면 비활성화). "서비스가 완전히 중지된 상태인지 확인하라"는 경고가 표시된다.
**새 데이터베이스 이름(New Database Name)** \* 은 필수 입력 항목이며, 값을 입력해야 실행 버튼이 활성화된다
(영문자로 시작하는 1~17자의 영문/숫자/밑줄/하이픈만 허용).

**백업 볼륨 강제 삭제(Force delete backup volume)** 를 켜면 기존 백업 볼륨을 지운다. 기본값은 꺼짐(지우지 않음)이다.

.. note::

    확장 볼륨 경로는 화면에 노출되지 않고 현재 데이터베이스 디렉터리의 상위 디렉터리로 자동 계산된다
    (``renamedb -E``). 볼륨별 개별 재배치는 이 화면에서 지원하지 않는다. 이름을 바꿔도 백업 이력이나 Backup
    Plan에 등록된 경로는 자동으로 따라 바뀌지 않으므로, 필요하면 직접 갱신해야 한다.

복사
====

.. image:: /images/database-copy.png

Manage Database → **데이터베이스 복사(Copy Database)** (원본이 중지 상태여야 한다). 실제로는 CUBRID의 ``copydb`` 유틸리티를
실행한다.

.. list-table::
    :header-rows: 1
    :widths: 30 55 15

    * - 항목
      - 설명
      - 기본값
    * - 대상 데이터베이스 이름(Database Name) \*
      - 필수. 비워두면 실행 버튼을 눌러도 오류 없이 아무 반응이 없다
      - —
    * - 파일 경로(File path)
      - 데이터베이스가 저장되는 디렉터리 경로
      - 자동 채움
    * - 확장 볼륨 경로(Extend volume path)
      - 확장 볼륨이 저장되는 디렉터리 경로
      - 자동 채움
    * - 로그 파일 경로(Log file path)
      - 로그 볼륨이 저장되는 디렉터리 경로
      - 자동 채움
    * - 볼륨별 개별 지정(Copy individual volumes)
      - 켜면 위 File path/Extend volume path 대신, 볼륨별로 새 이름과 경로를 지정하는 표가 나타나고
        그 두 필드는 무시된다
      - 꺼짐
    * - 기존 데이터베이스 덮어쓰기(Replace existing database)
      - 같은 이름의 데이터베이스가 있으면 덮어쓴다
      - 꺼짐
    * - 복사 후 원본 삭제(Delete Source After Copy)
      - 위험한 옵션이므로 신중하게 사용한다
      - 꺼짐

.. warning::

    "Delete Source After Copy"는 ``copydb`` 자체의 원본 삭제 옵션(``-d, --delete-source``)을 쓰지 않는다.
    대신 복사가 끝난 뒤 원본 데이터베이스에 대해 별도로 삭제를 실행하는 방식으로 동작한다 — 복사와 삭제가
    순차적인 두 단계로 이뤄진다.

볼륨 추가 (Add Database Volume)
================================

.. image:: /images/database-add-volume.png

Manage Database → **데이터베이스 볼륨 추가(Add Database Volume)**. 실제로는 CUBRID의 ``addvoldb`` 유틸리티를 실행한다.

.. list-table::
    :header-rows: 1
    :widths: 30 55 15

    * - 항목
      - 설명
      - 기본값
    * - 용도(Purpose)
      - Data 또는 Temp 중에서 선택한다
      - —
    * - 경로(Path)
      - 저장 경로. 호스트에서 조회한 현재 상태로 자동 채워지며, 존재하지 않으면 CMS가 생성한다
      - 자동 채움
    * - 크기(Size)
      - 프리셋 버튼 또는 직접 입력
      - —
    * - 볼륨 이름(Volume name)
      - 이 화면에는 입력란이 없다. 지정하지 않으면 ``"db"_ext1`` 형태의 이름이 자동 생성된다
      - 자동 생성

.. warning::

    실행하면 실제로 볼륨 파일이 영구적으로 추가된다 — 되돌릴 수 없는 작업이다.

점검 / 압축 / 최적화
======================

Manage Database 안의 **데이터베이스 검사(Check Database)**, **데이터베이스 공간 정리(Compact Database)**, **데이터베이스 최적화(Optimize Database)** 는 옵션을 선택하고
실행 버튼을 누르면 작업이 시작되는 진단/유지보수성 실행 대화창이다. 실행하면 진행 상태 대화창으로 전환되고,
완료되면 성공 대화창이 표시된다 (다른 CMS 작업과 동일하게 :doc:`automation` 에서 설명하는 백그라운드 전환도
가능하다). Unload Database의 필드 설명은 :doc:`backup` 참고.

.. image:: /images/database-check.png

* **데이터베이스 검사(Check Database)** — 옵션은 **비일관성 발견 시 복구(Repair when inconsistency)** 하나뿐이다 (``checkdb -r``).

.. image:: /images/database-compact.png

* **데이터베이스 공간 정리(Compact Database)** — 옵션은 **상세 정보 출력(Verbose monitoring)** 하나뿐이다 (``compactdb -v``).

.. image:: /images/database-optimize.png

* **데이터베이스 최적화(Optimize Database)** — **클래스 이름(Class name)** 을 지정하면 해당 클래스의 통계 정보만, 비워두면 전체
  클래스의 통계 정보를 갱신한다.

.. note::

    Optimize Database 메뉴 항목은 데이터베이스가 실행 중이면 비활성화된다 — 이 화면에서는 오프라인 상태에서만
    실행할 수 있다.

로드
====

.. image:: /images/database-load.png

Manage Database → **데이터베이스 로드(Load Database)** (데이터베이스가 중지 상태여야 한다). 자세한 필드 설명은 :doc:`backup` 참고.

삭제
====

Manage Database → **데이터베이스 삭제(Delete Database)** 는 2단계로 진행된다.

.. image:: /images/database-delete.png

**1단계.** 삭제될 볼륨 목록과 경고를 확인하고 **계속(Proceed)** 를 클릭한다.

.. image:: /images/database-delete-confirm.png

**2단계.** DBA User name(기본값 "dba")/Password를 다시 입력하고 **삭제(Delete)** 를 클릭한다. 두 필드 모두 화면 자체의 필수 표시는
없지만, 값이 올바르지 않으면 인증 단계에서 오류가 표시되어 삭제가 진행되지 않는다.
