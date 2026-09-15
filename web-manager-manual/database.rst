************************
데이터베이스 트리
************************

.. image:: /images/database-tree.png

데이터베이스 노드를 펼치면 **사용자(Users)**, **작업 자동화(Job automation)**, **공간(Space)** 하위 노드가 나타난다.
우클릭 → **데이터베이스 관리(Manage Database)** 안에 데이터베이스 언로드(Unload Database), 데이터베이스 로드(Load Database),
데이터베이스 검사(Check Database), 데이터베이스 공간 정리(Compact Database), 데이터베이스 볼륨 추가(Add Database Volume),
데이터베이스 최적화(Optimize Database), 데이터베이스 복사(Copy Database), 데이터베이스 이름 변경(Rename Database),
데이터베이스 복구(Restore Database), 데이터베이스 백업(Backup Database), 데이터베이스 삭제(Delete Database)가 있다.

.. note::

    데이터베이스 로드/최적화/복사/이름 변경/복구/삭제는 데이터베이스가 실행 중이면 비활성화된다. 먼저 중지해야 한다.
    반대로 **데이터베이스 정보(Database Info)** 하위의 잠금 정보/트랜잭션 정보/질의 수행 계획은 실행 중일 때만
    활성화된다 (실시간 서버 상태를 조회하는 항목이므로).

로그인 여부 표시
================

데이터베이스 트리의 각 행 이름 옆에 자물쇠 아이콘이 표시된다: 열린 자물쇠(밝은 녹색)는 로그인된 상태, 닫힌 자물쇠(회색)는
로그인되지 않은 상태를 뜻한다.

.. important::

    **해당 데이터베이스에 로그인하지 않은 상태에서는 어떤 작업도 실행할 수 없다.** 데이터베이스 시작/중지,
    데이터베이스 관리의 11개 항목(언로드/로드/검사/공간 정리/볼륨 추가/최적화/복사/이름 변경/복구/백업/삭제)
    전부, 데이터베이스 정보의 4개 항목(잠금 정보/트랜잭션 정보/파라미터 덤프/질의 수행 계획), 속성까지 —
    예외 없이 로그인 상태를 먼저 요구하며, 로그인 안 된 상태에서는 메뉴 항목 자체가 비활성화된다.

HA 상태 표시
============

.. image:: /images/database-ha-status.png

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

* **볼륨 분류(Volume Categorization)** — 유형(Type)/용도(Purpose)별로 묶은 요약 표. 각 행에는 볼륨 개수, 사용/여유/전체
  용량, 사용률이 표시되며, 유형 배지를 클릭하면 해당 카테고리의 볼륨 카테고리 모니터가 열린다.
* **볼륨 구성(Physical Volume Topology)** — 볼륨 파일 하나당 한 행으로, 유형/용도, 페이지 단위 할당량(사용/전체
  페이지, 여유 비율 막대), 날짜, 경로가 표시된다. 볼륨 이름을 클릭하면 해당 볼륨의 볼륨 정보 화면이 열린다.
* **파일 공간 사용량(File Space Usage)** — 데이터 유형별 파일 개수와 사용/전체 용량.
* **분포(Distribution)** — 사용/여유 비율을 보여주는 도넛 차트.

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

"Databases" 트리 루트를 우클릭하면 "ALL DATABASES" 메뉴가 나타난다. :doc:`broker` 의 "ALL BROKERS" 메뉴와 같은
성격의, 해당 호스트의 데이터베이스 전체를 대상으로 하는 일괄 작업 메뉴이다.

* **모든 데이터베이스 시작(Start All Databases)** — 현재 중지된 데이터베이스를 전부 시작한다.
* **모든 데이터베이스 중지(Stop All Databases)** — 현재 활성 데이터베이스를 전부 중지한다.
* **모든 데이터베이스 재시작(Restart All Databases)** — 현재 활성 데이터베이스를 전부 중지했다가 다시 시작한다.
* **데이터베이스 생성(Create Database)** — 아래 "데이터베이스 생성" 마법사를 연다.
* **새로 고침(Refresh)** — 데이터베이스 목록을 새로고침한다.
* **속성(Properties)** — 데이터베이스 속성 화면을 연다.

.. image:: /images/database-start-all-confirm.png

.. note::

    Start All/Stop All/Restart All은 각각 별도의 확인 다이얼로그를 거친다. Stop All과 Restart All은 "활성 연결과
    트랜잭션이 모두 끊깁니다"라는 경고 문구를 포함한다.

데이터베이스 생성
==================

"Databases" 트리 루트 우클릭 → **데이터베이스 생성(Create Database)** 를 선택하면 5단계 마법사가 열린다:
General Information → Additional Volume Information → Automatic volume extension → Set DBA Password → Database Information(검토).
실제로는 CUBRID의 ``createdb`` 유틸리티를 실행한다.

.. note::

    ``*`` 표시된 항목은 필수 입력 항목입니다.

.. image:: /images/database-create.png

**1단계. 일반 정보(General Information)** — Database name(데이터베이스 이름) \* 은 ``createdb`` 의 커맨드라인 인자로 전달된다.
Locale은 ``createdb`` 의 두 번째 인자(``<데이터베이스 로케일>``, 형식은 ``<language>.<charset>``, 예:
``en_US.iso88591``)로 전달된다. Page size는 ``--db-page-size``, Volume size는 ``--db-volume-size``, Volume
path는 ``-F, --file-path``, Log page size는 ``--log-page-size``, Log volume size는 ``--log-volume-size``,
Log path는 ``-L, --log-path`` 로 전달된다. "Start database after creation"은 ``createdb`` 옵션이 아니라
생성 후 api-server가 별도로 수행하는 후속 단계다.

.. image:: /images/database-create-step2.png

**2단계. 추가 볼륨 정보(Additional Volume Information)** — 추가 볼륨이 필요 없으면 그대로 다음으로 진행한다 (이 단계의 볼륨
이름/크기/경로는 선택 입력이다). 여기서 입력한 볼륨 목록은 CMS가 제어 파일로 만들어 ``--more-volume-file`` 로
전달한다.

.. image:: /images/database-create-step3.png

**3단계. 볼륨 자동 확장(Automatic volume extension)** — 자동 확장 설정(기본값을 그대로 사용해도 된다)을 확인한다. 이 설정은
``createdb`` 의 옵션이 아니라 CMS의 별도 자동-볼륨-확장 기능(``setAutoAddVol``)을 구성하는 것이다.

.. image:: /images/database-create-step4.png

**4단계. DBA 비밀번호 설정(Set DBA Password)** — Password/Password Confirm은 **선택 입력**\ 이다. 둘 다 비워두면 DBA 계정에 비밀번호 없이
생성되며, 값을 입력할 경우에는 8자 이상이어야 하고 Password/Password Confirm이 서로 일치해야 다음 단계로
진행할 수 있다. 이 역시 ``createdb`` 자체의 옵션이 아니라, 생성 후 별도로 실행되는 사용자 정보 갱신 단계다.

.. image:: /images/database-create-step5.png

**5단계. 검토(Database Information)** — 요약을 확인하고 **완료(Finish)** 를 클릭하면 실제 생성 작업이 시작된다. 완료까지
최대 2분 정도 걸릴 수 있다.

데이터베이스 로그인
====================

.. image:: /images/database-login.png

데이터베이스를 더블클릭하면 **데이터베이스 로그인(Login Database)** 모달이 열린다. User name(기본값 "dba")과 Password를 입력한다.
**비밀번호 저장(Save Password)** 를 켜두면 다음부터 다시 입력하지 않아도 된다.

.. note::

    User name이 비어 있으면 로그인 버튼을 눌러도 아무 반응이 없다 (오류 메시지 없이 조용히 무시된다). 기본값 "dba"를
    지우지 않는 것을 권장한다. Password는 화면 자체에는 필수 표시가 없다 — 비밀번호가 없는 계정(예: public)은
    비워두고 로그인할 수 있으며, 값이 틀리면 CMS 인증 단계에서 오류가 표시된다.

로그아웃 / 저장된 자격증명 관리
================================

.. image:: /images/database-logout-confirm.png

로그인된 상태에서 우클릭하면 **데이터베이스 로그아웃(Logout Database)** 가 나타난다. 클릭하면 확인 다이얼로그가 뜨고, 확인하면 로그인 상태만
해제된다 (저장된 비밀번호는 유지된다).

저장된 로그인 프로필이 있는 데이터베이스는 다음 두 항목도 함께 나타난다.

* **데이터베이스 자격증명 변경(Update Database Credentials)** — 위 "데이터베이스 로그인" 절과 같은 모달을 다시 열어 저장된 사용자명/비밀번호를 갱신한다.

.. image:: /images/database-forget-credentials-confirm.png

* **저장된 자격증명 삭제(Forget Saved Credentials)** — 저장된 로그인 프로필 자체를 삭제한다. 다음부터는 다시 수동으로 로그인해야 한다.

시작 / 중지
===========

우클릭 시 **데이터베이스 중지(Stop Database)** 와 **데이터베이스 시작(Start Database)** 중 정확히 하나만 보이며, 로그인되어 있지 않으면 둘 다 비활성화된다.
클릭하면 바로 실행되지 않고 확인 다이얼로그가 한 번 더 뜬다.

.. image:: /images/database-stop-confirm.png

**데이터베이스 중지(Stop Database)** 확인 다이얼로그.

.. image:: /images/database-start-confirm.png

**데이터베이스 시작(Start Database)** 확인 다이얼로그.

.. note::

    Copy Database 같은 무거운 작업 직후에는 몇 분간 로그인이 일시적으로 지연될 수 있다. 앱의 문제가 아니라 CMS 호스트 자체의 특성이다.

이름 변경
=========

.. image:: /images/database-rename.png

Manage Database → **데이터베이스 이름 변경(Rename Database)** (실행 중이면 비활성화). "서비스가 완전히 중지된 상태인지 확인하라"는 경고가 표시된다.
**새 데이터베이스 이름(New Database Name)** \* 은 필수 입력 항목이며, 값을 입력해야 실행 버튼이 활성화된다
(영문자로 시작하는 1~17자의 영문/숫자/밑줄/하이픈만 허용). 실제로는 CUBRID의 ``renamedb`` 유틸리티를 실행하며,
새 이름은 커맨드라인 인자(positional argument)로 그대로 전달된다.

* **백업 볼륨 강제 삭제(Force delete backup volume)** — ``renamedb -d``. 켜면 기존 백업 볼륨을 지운다(공식
  기본값은 "지우지 않음").

.. note::

    확장 볼륨 경로는 화면에 노출되지 않고, 현재 데이터베이스 디렉터리의 상위 디렉터리로 자동 계산되어
    ``renamedb -E`` 로 전달된다. 볼륨별 개별 재배치(``-i, --control-file``)는 이 화면에서 지원하지 않는다.

복사
====

.. image:: /images/database-copy.png

Manage Database → **데이터베이스 복사(Copy Database)** (원본이 중지 상태여야 한다). 실제로는 CUBRID의 ``copydb`` 유틸리티를
실행한다. 아래 필드는 각각 ``copydb`` 의 옵션 하나에 대응한다(공식 ``--help`` 텍스트 기준).

* **대상 데이터베이스 이름(Database Name)** \* — 필수. 비워두면 실행 버튼을 눌러도 오류 없이 아무 반응이 없다.
  ``copydb`` 의 커맨드라인 인자(positional argument)로 전달된다.
* **파일 경로(File path)** — ``copydb -F``. 데이터베이스가 저장되는 디렉터리 경로.
* **확장 볼륨 경로(Extend volume path)** — ``copydb -E``. 확장 볼륨이 저장되는 디렉터리 경로.
* **로그 파일 경로(Log file path)** — ``copydb -L``. 로그 볼륨이 저장되는 디렉터리 경로. 위 세 경로 필드는 기본값이
  채워져 있으며 선택적으로 수정한다.
* **볼륨별 개별 지정(Copy individual volumes)** — 켜면 위 File path/Extend volume path 대신, 볼륨별로 새 이름과
  경로를 지정하는 표가 나타난다. 이 표의 내용은 ``copydb -i`` (제어 파일)로 전달된다 — 켜져 있으면 File
  path/Extend volume path 필드 자체가 무시된다.
* **기존 데이터베이스 덮어쓰기(Replace existing database)** — ``copydb -r``. 같은 이름의 데이터베이스가 있으면
  덮어쓴다(공식 기본값은 "덮어쓰기 안 함").
* **복사 후 원본 삭제(Delete Source After Copy)** — 위험한 옵션이므로 신중하게 사용한다.

.. warning::

    "Delete Source After Copy"는 ``copydb`` 자체의 원본 삭제 옵션(``-d, --delete-source``)을 쓰지 않는다.
    대신 복사가 끝난 뒤 **별도의 ``cubrid deletedb`` 프로세스** 를 원본 데이터베이스에 대해 추가로 실행하는
    방식으로 동작한다. 즉 복사와 삭제는 하나의 원자적(atomic) 작업이 아니라 순차적인 두 단계이다.

볼륨 추가 (Add Database Volume)
================================

.. image:: /images/database-add-volume.png

Manage Database → **데이터베이스 볼륨 추가(Add Database Volume)**. 실제로는 CUBRID의 ``addvoldb`` 유틸리티를 실행한다.

* **용도(Purpose)** — ``addvoldb -p``. 화면에서는 Data/Temp 두 가지만 선택할 수 있다. ``addvoldb`` 자체는
  INDEX/GENERIC까지 총 4가지 값을 허용하지만, 이 화면에서는 그 두 값을 선택할 수 없다.
* **경로(Path)** — ``addvoldb -F``. 저장 경로. 호스트에서 조회한 현재 상태로 자동 채워지며, 존재하지 않으면
  CMS가 생성한다.
* **크기(Size)** — ``addvoldb --db-volume-size``. 프리셋 버튼 또는 직접 입력.
* **볼륨 이름(Volume name)** — 이 화면에는 입력란이 없다. ``addvoldb`` 의 ``-n, --volume-name`` (지정하지 않으면
  ``"db"_ext1`` 형태의 이름이 자동 생성됨)에 빈 값이 전달된다.

.. warning::

    실행하면 실제로 볼륨 파일이 영구적으로 추가된다 — 되돌릴 수 없는 작업이다.

점검 / 압축 / 최적화
======================

Manage Database 안의 **데이터베이스 검사(Check Database)**, **데이터베이스 공간 정리(Compact Database)**, **데이터베이스 최적화(Optimize Database)** 는 옵션을 선택하고
실행 버튼을 누르면 작업이 시작되는 진단/유지보수성 실행 다이얼로그이다. 실행하면 진행 상태 모달로 전환되고,
완료되면 성공 모달이 표시된다 (다른 CMS 작업과 동일하게 :doc:`automation` 에서 설명하는 백그라운드 전환도
가능하다). Unload Database의 필드 설명은 :doc:`backup` 참고.

.. image:: /images/database-check.png

* **데이터베이스 검사(Check Database)** — 옵션은 **비일관성 발견 시 복구(Repair when inconsistency)** 하나뿐이다. 실제로는
  ``checkdb -r`` 로 전달된다.

.. image:: /images/database-compact.png

* **데이터베이스 공간 정리(Compact Database)** — 옵션은 **상세 정보 출력(Verbose monitoring)** 하나뿐이다. 실제로는 ``compactdb -v`` 로
  전달된다.

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
