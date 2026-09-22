****************************
데이터베이스 작업
****************************

:ref:`manage-database` 메뉴와 트리 루트의 "ALL DATABASES" 메뉴에서
실행할 수 있는 각 작업(생성/로그인/시작·중지/백업·복원/언로드·로드 등)의 화면별 사용법을 정리한다.

.. image:: /images/database-context-menu.png
   :width: 480px

데이터베이스를 우클릭하면 위와 같은 메뉴가 열린다.

.. image:: /images/database-manage-menu.png
   :width: 640px

이 중 **데이터베이스 관리(Manage Database)** 에 마우스를 올리면 이 장에서 다루는 작업들이 위와 같이 하위
메뉴로 나열된다.

.. _create-database:

데이터베이스 생성(Create Database)
====================================

"Databases" 트리 루트 우클릭 → **데이터베이스 생성(Create Database)** 를 선택하면 5단계 마법사가 열린다:
General Information → Additional Volume Information → Automatic volume extension → Set DBA Password → Database Information(검토).
실제로는 CUBRID의 ``createdb`` 유틸리티를 실행한다.

.. warning::

    HA로 설정된 호스트에서는 새 데이터베이스 이름과 무관하게 생성 자체가 막힌다. 자세한 내용은 :ref:`ha-restricted-operations` 참고.

.. image:: /images/database-create.png

**1단계. 일반 정보(General Information)**

.. list-table::
    :header-rows: 1
    :widths: 22 18 40 20

    * - 항목
      - CLI 대응
      - 설명
      - 기본값
    * - Database name(데이터베이스 이름) \*
      - —
      - 새로 생성할 데이터베이스 이름
      - —
    * - Locale
      - —
      - 문자 인코딩/정렬 방식. ``en_US.iso88591`` / ``en_US.utf8`` / ``ko_KR.euckr`` / ``ko_KR.utf8`` 또는
        직접 입력(User Defined) 중 선택
      - ``en_US.utf8``
    * - Page size
      - ``--db-page-size``
      - 데이터 페이지 크기(byte). 4096/8192/16384/32768 중 선택
      - 16384
    * - Volume size
      - ``--db-volume-size``
      - 기본(Generic) 볼륨 크기(Mbyte)
      - 512
    * - Volume path
      - ``-F, --file-path``
      - 데이터베이스 볼륨이 저장되는 디렉터리 경로
      - 자동 채움
    * - Log page size
      - ``--log-page-size``
      - 로그 페이지 크기(byte). Page size와 같은 4개 선택지 중 선택
      - 16384
    * - Log volume size
      - ``--log-volume-size``
      - 로그 볼륨 크기(Mbyte)
      - 512
    * - Log path
      - ``-L, --log-path``
      - 로그 볼륨이 저장되는 디렉터리 경로
      - 자동 채움

**Start database after creation** 은 ``createdb`` 옵션이 아니라 생성 완료 후 별도로 실행되는 단계다.

.. image:: /images/database-create-step2.png

**2단계. 추가 볼륨 정보(Additional Volume Information)** — 추가 볼륨이 필요 없으면 그대로 다음으로 진행한다 (이 단계의 볼륨
이름/크기/경로는 선택적으로 입력할 수 있다).

.. image:: /images/database-create-step3.png

**3단계. 볼륨 자동 확장(Automatic volume extension)** — 자동 확장 설정(기본값을 그대로 사용해도 된다)을 확인한다. 이 설정은
``createdb`` 의 옵션이 아니라 CMS의 별도 자동 볼륨 확장 기능이다.

.. image:: /images/database-create-step4.png

**4단계. DBA 비밀번호 설정(Set DBA Password)** — Password/Password Confirm은 선택적으로 입력할 수 있는 값이다. 둘 다 비워두면 DBA 계정에 비밀번호 없이
생성되며, 값을 입력할 경우에는 8자 이상이어야 한다.

.. note::

    이 단계에서 비밀번호를 입력하면, 1단계의 **Start database after creation** 설정과 무관하게 데이터베이스가
    자동으로 시작된다. DBA 비밀번호 변경은 CMS의 updateuser 작업으로 처리되는데, 이 작업은 데이터베이스가
    실행 중이어야만 가능하기 때문이다. 이렇게 시작된 데이터베이스는 생성 작업이 끝난 뒤에도 다시 중지되지
    않고 그대로 실행 상태로 남는다.

.. image:: /images/database-create-step5.png

**5단계. 검토(Database Information)** — 요약을 확인하고 **완료(Finish)** 를 클릭하면 실제 생성 작업이 시작된다.

.. _login-database:

데이터베이스 로그인(Login Database)
=====================================

.. image:: /images/database-login.png

데이터베이스를 더블클릭하면 **데이터베이스 로그인(Login Database)** 대화창이 열린다. User name(기본값 "dba")과 Password를 입력한다.
**비밀번호 저장(Save Password)** 를 켜두면 다음부터 다시 입력하지 않아도 된다.

로그아웃(Logout Database) / 저장된 자격증명 관리
===================================================

.. image:: /images/database-logout-confirm.png

로그인된 상태에서 우클릭하면 **데이터베이스 로그아웃(Logout Database)** 가 나타난다. 클릭하면 확인 대화창이 뜨고, 확인하면 로그인 상태만
해제된다 (저장된 비밀번호는 유지된다).

저장된 데이터베이스 로그인 프로필이 있는 데이터베이스는 다음 두 항목도 함께 나타난다.

* **데이터베이스 자격증명 변경(Update Database Credentials)** — 위 "데이터베이스 로그인" 절과 같은 대화창을 다시 열어 저장된 사용자명/비밀번호를 갱신한다.

.. image:: /images/database-forget-credentials-confirm.png

* **저장된 자격증명 삭제(Forget Saved Credentials)** — 저장된 데이터베이스 로그인 프로필 자체를 삭제한다. 다음부터는 다시 수동으로 로그인해야 한다.

시작(Start Database) / 중지(Stop Database)
=============================================

우클릭 시 **데이터베이스 중지(Stop Database)** 와 **데이터베이스 시작(Start Database)** 중 정확히 하나만 보이며, 로그인되어 있지 않으면 둘 다 비활성화된다.
클릭하면 바로 실행되지 않고 확인 대화창이 한 번 더 뜬다.

.. image:: /images/database-stop-confirm.png

**데이터베이스 중지(Stop Database)** 확인 대화창.

.. image:: /images/database-start-confirm.png

**데이터베이스 시작(Start Database)** 확인 대화창.

HA로 구성된 데이터베이스는 개별 시작/중지와 "전체 데이터베이스 시작/중지"의 동작이 다르다 — 자세한 내용은
:ref:`ha-start-stop-difference` 참고.

이름 변경(Rename Database)
============================

.. image:: /images/database-rename.png

Manage Database → **데이터베이스 이름 변경(Rename Database)** (실행 중이면 비활성화). "서비스가 완전히 중지된 상태인지 확인하라"는 경고가 표시된다.
**새 데이터베이스 이름(New Database Name)** \* 은 영문자로 시작하는 1~17자의 영문/숫자/밑줄/하이픈만 허용한다.

**백업 볼륨 강제 삭제(Force delete backup volume)** 를 켜면 기존 백업 볼륨을 지운다. 기본값은 꺼짐(지우지 않음)이다.

.. note::

    확장 볼륨 경로는 화면에 노출되지 않고 현재 데이터베이스 디렉터리의 상위 디렉터리로 자동 계산된다
    (``renamedb -E``). 볼륨별 개별 재배치는 이 화면에서 지원하지 않는다. 이름을 바꿔도 백업 이력이나 Backup
    Plan에 등록된 경로는 자동으로 따라 바뀌지 않으므로, 필요하면 직접 갱신해야 한다.

.. warning::

    HA 복제에 포함된 데이터베이스는 이름을 바꿀 수 없다 — 시도하면 오류가 표시된다. 자세한 내용은
    :ref:`ha-restricted-operations` 참고.

복사(Copy Database)
=====================

.. image:: /images/database-copy.png

Manage Database → **데이터베이스 복사(Copy Database)** (원본이 중지 상태여야 한다). 실제로는 CUBRID의 ``copydb`` 유틸리티를
실행한다.

.. list-table::
    :header-rows: 1
    :widths: 25 18 42 15

    * - 항목
      - CLI 대응
      - 설명
      - 기본값
    * - 대상 데이터베이스 이름(Database Name) \*
      - — (옵션이 아니라 위치 인자)
      - 필수. 비워두면 실행 버튼을 눌러도 오류 없이 아무 반응이 없다
      - —
    * - 파일 경로(File path)
      - ``-F, --file-path``
      - 데이터베이스가 저장되는 디렉터리 경로
      - 자동 채움
    * - 확장 볼륨 경로(Extend volume path)
      - ``-E, --extended-volume-path``
      - 확장 볼륨이 저장되는 디렉터리 경로
      - 자동 채움
    * - 로그 파일 경로(Log file path)
      - ``-L, --log-path``
      - 로그 볼륨이 저장되는 디렉터리 경로
      - 자동 채움
    * - 볼륨별 개별 지정(Copy individual volumes)
      - ``-i, --control-file``
      - 켜면 위 File path/Extend volume path 대신, 볼륨별로 새 이름과 경로를 지정하는 표가 나타나고
        그 두 필드는 무시된다
      - 꺼짐
    * - 기존 데이터베이스 덮어쓰기(Replace existing database)
      - ``-r, --replace``
      - 같은 이름의 데이터베이스가 있으면 덮어쓴다
      - 꺼짐
    * - 복사 후 원본 삭제(Delete Source After Copy)
      - —
      - 위험한 옵션이므로 신중하게 사용한다 (아래 경고 참고)
      - 꺼짐

.. warning::

    "Delete Source After Copy"는 ``copydb`` 자체의 원본 삭제 옵션(``-d, --delete-source``)을 쓰지 않는다.
    대신 복사가 끝난 뒤 원본 데이터베이스에 대해 별도로 삭제를 실행하는 방식으로 동작한다 — 복사와 삭제가
    순차적인 두 단계로 이뤄진다.

.. _add-database-volume:

볼륨 추가(Add Database Volume)
================================

.. image:: /images/database-add-volume.png

Manage Database → **데이터베이스 볼륨 추가(Add Database Volume)**. 실제로는 CUBRID의 ``addvoldb`` 유틸리티를 실행한다.

.. list-table::
    :header-rows: 1
    :widths: 25 18 42 15

    * - 항목
      - CLI 대응
      - 설명
      - 기본값
    * - 용도(Purpose)
      - ``-p, --purpose``
      - **Permanent**\ (테이블/행 데이터, 전송 값은 ``data``) 또는 **Temp**\ (임시 작업공간) 중에서 선택한다
        (``addvoldb`` 자체는 Index/Generic도 지원하지만 이 화면에서는 두 가지만 선택할 수 있다)
      - —
    * - 경로(Path)
      - ``-F, --file-path``
      - 저장 경로. 호스트에서 조회한 현재 상태로 자동 채워지며, 존재하지 않으면 CMS가 생성한다
      - 자동 채움
    * - 크기(Size)
      - ``--db-volume-size``
      - 프리셋 버튼 또는 직접 입력
      - —
    * - 볼륨 이름(Volume name)
      - ``-n, --volume-name``
      - 이 화면에는 입력란이 없다. 지정하지 않으면 ``"db"_ext1`` 형태의 이름이 자동 생성된다
      - 자동 생성

.. warning::

    실행하면 실제로 볼륨 파일이 영구적으로 추가된다 — 되돌릴 수 없는 작업이다.

검사(Check Database) / 압축(Compact Database) / 최적화(Optimize Database)
============================================================================

Manage Database 안의 **데이터베이스 검사(Check Database)**, **데이터베이스 공간 정리(Compact Database)**, **데이터베이스 최적화(Optimize Database)** 는 옵션을 선택하고
실행 버튼을 누르면 작업이 시작되는 진단/유지보수성 실행 대화창이다. 실행하면 진행 상태 대화창으로 전환되고,
완료되면 성공 대화창이 표시된다 (다른 CMS 작업과 동일하게 백그라운드 전환도 가능하다).

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

데이터베이스 백업(Backup Database)
====================================

.. image:: /images/backup-database.png

Manage Database → **데이터베이스 백업(Backup Database)** 를 선택한다.

.. list-table::
    :header-rows: 1
    :widths: 25 18 42 15

    * - 항목
      - CLI 대응
      - 설명
      - 기본값
    * - 백업 레벨(Backup Level)
      - ``-l, --level``
      - 0(전체) / 1(증분 1) / 2(증분 2) 중 선택
      - 0(전체)
    * - 백업 디렉터리(Backup Directory) \*
      - ``-D, --destination-path``
      - 백업 볼륨이 저장될 디렉터리 경로. 지정하지 않으면 로그 디렉터리에 저장된다
      - —
    * - 병렬 스레드 수(Parallel threads)
      - ``-t, --thread-count``
      - 백업을 수행하는 스레드 개수
      - 자동
    * - 데이터베이스 정합성 확인(Check database consistency)
      - ``--no-check`` (끌 때 적용)
      - 끄면 정합성 확인을 건너뛴다
      - 켜짐
    * - 불필요한 로그 파일 삭제(Delete unnecessary archived logs)
      - ``-r, --remove-archive``
      - 켜면 더 이상 필요 없는 로그 파일을 지운다 (주의해서 사용해야 한다)
      - 꺼짐
    * - 백업 볼륨 압축(Compress backup volume)
      - ``-z, --compress``
      - 켜면 백업 볼륨을 압축한다
      - 켜짐

백업 볼륨 이름은 백업 레벨과 무관하게 항상 ``데이터베이스이름_backup`` 으로 고정되어 저장되며, 별도로
지정할 수 없다.

.. _backup-plan:

백업 계획(Backup Plan)
========================

.. image:: /images/database-backup-plan-menu.png
   :width: 520px

**작업 자동화(Job automation)** 폴더를 펼치면 나오는 **백업 자동화 계획(Backup Plan)** 폴더를 우클릭하면
위와 같은 메뉴가 열린다.

.. image:: /images/backup-plan.png

데이터베이스 → Job automation → **백업 자동화 계획(Backup Plan)** 폴더 우클릭 → **백업 자동화 계획 추가(Create Backup Plan)** 을 선택한다.

Backup Plan은 즉시 백업과 달리 지정한 시각에 예약 실행되는 기능이다. Plan ID·스케줄 관련 필드를 제외한
백업 옵션(Backup Level/Path/Delete archive logs/Check consistency/Compress/Threads/Online·Offline)은
위 "데이터베이스 백업" 절과 동일하다.

.. list-table::
    :header-rows: 1
    :widths: 25 12 48 15

    * - 항목
      - CLI 대응
      - 설명
      - 기본값
    * - 계획 ID(Plan ID) / 경로(Path) / 반복 주기·시각
      - —
      - CMS/webmanager 고유의 예약 스케줄 정보(반복 주기는 월간/주간/일간/특정 요일 중 선택)
      - —
    * - 온라인 모드 / 오프라인 모드(Online mode / Offline mode)
      - —
      - 백업 시점에 데이터베이스를 어떤 모드로 볼지 선택한다. 즉시 백업(Backup Database)은 CMS가 현재 상태를
        자동으로 감지하지만, Backup Plan은 사용자가 직접 지정한다
      - —
    * - 통계 정보 갱신(Update statistics)
      - —
      - 켜져 있고 **오프라인 모드(Offline mode)**\ 로 설정된 계획이면, 백업이 끝난 뒤 전체 클래스 대상 통계
        정보를 갱신한다 (Online mode 계획에서는 켜져 있어도 실행되지 않는다)
      - 꺼짐
    * - 보관할 백업 세트 수(retention)
      - —
      - 화면에는 있지만, 이 값을 근거로 오래된 백업을 자동 삭제하는 동작은 확인되지 않는다 — 오래된 백업
        삭제는 직접 관리해야 한다
      - —

백업 자동화 계획 수행 로그(Auto Backup Log)
=============================================

.. image:: /images/backup-auto-log.png

데이터베이스 → Job automation → **백업 자동화 계획(Backup Plan)** 폴더 우클릭 → **백업 자동화 계획 수행로그(Auto Backup Log)** 를 선택하면 열린다. 예약된
Backup Plan이 실제로 실행된 이력을 보여주는 읽기 전용 로그 화면이다.

컬럼은 **백업 ID(Backup ID)**, **로그 시간(Log Time)**, **설명(Description)** 으로 구성되며, Description
텍스트 내용에 따라 다음과 같이 아이콘이 표시된다.

.. list-table::
    :header-rows: 1
    :widths: 50 50

    * - Description 텍스트
      - 표시 아이콘
    * - "success" 포함
      - 초록색 체크
    * - "auto job start" 포함
      - 파란색 재생
    * - 그 외
      - 빨간색 오류

* ID/설명으로 필터링, 15건 단위 페이지네이션 또는 전체 보기 전환이 가능하다.
* 현재 선택된 데이터베이스로 목록이 좁혀지며, 선택된 데이터베이스가 없으면 호스트 전체 이력("Global Backup
  History")을 보여준다.
* **새로 고침(Refresh)** 버튼으로 다시 불러온다.

데이터베이스 복구(Restore Database)
=====================================

.. image:: /images/database-restore.png

Manage Database → **데이터베이스 복구(Restore Database)** (데이터베이스가 중지 상태여야 한다). 복원 시점 선택 또는 백업 레벨별 파일을 직접 지정할 수 있다.

.. list-table::
    :header-rows: 1
    :widths: 25 18 42 15

    * - 항목
      - CLI 대응
      - 설명
      - 기본값
    * - 복구 시점 지정(Specify restore date)
      - ``-d, --up-to-date``
      - 백업 시점 또는 ``dd-mm-yyyy:hh:mm:ss`` 형식의 특정 시각으로 데이터베이스 상태를 복구한다
      - —
    * - 백업 레벨 선택(Select backup information)
      - ``-l, --level`` / ``-B, --backup-file-path``
      - 복구에 사용할 백업 레벨과 백업 볼륨이 있는 디렉터리 경로
      - 레벨 0(전체)
    * - 부분 복구 수행(Perform partial recovery)
      - ``-p, --partial-recovery``
      - 아카이브 로그가 없을 경우 강제로 부분 복구를 수행한다
      - 꺼짐
    * - 복원 경로 변경(Change restore path)
      - ``-u, --use-database-location-path``
      - 데이터베이스 위치 파일을 새 경로로 다시 쓴 뒤, 그 경로를 기준으로 복구하도록 지시한다
      - 꺼짐

.. warning::

    HA 복제에 포함된 데이터베이스는 이 화면으로 복원할 수 없다 — 시도하면 오류가 표시된다. 자세한 내용은
    :ref:`ha-restricted-operations` 참고.

데이터베이스 언로드(Unload Database)
======================================

.. image:: /images/database-unload.png

Manage Database → **데이터베이스 언로드(Unload Database...)** 를 선택한다. "선택한 테이블만"을 지정하지 않으면 기본적으로
전체 클래스가 언로드된다.

.. list-table::
    :header-rows: 1
    :widths: 25 18 42 15

    * - 항목
      - CLI 대응
      - 설명
      - 기본값
    * - 대상 디렉터리(Target Directory) \*
      - ``-O, --output-path``
      - 출력 디렉터리 경로
      - —
    * - Schema 포함 / Data 포함
      - ``-s, --schema-only`` / ``-d, --data-only``
      - 스키마만 / 오브젝트만 처리할지 선택한다. 둘 다 켜면 스키마와 데이터 둘 다 처리된다
      - 둘 다 켜짐
    * - 선택한 테이블만(테이블 목록)
      - ``-i, --input-class-file``
      - 지정한 테이블 이름 목록만 처리한다
      - 전체 클래스
    * - 참조 테이블 포함(Include referenced tables)
      - ``--include-reference``
      - "선택한 테이블만"이 함께 지정되어야 의미가 있다
      - 꺼짐
    * - 구분 식별자 사용(Use delimited identifier)
      - ``--use-delimiter``
      - 식별자 처음과 끝에 큰따옴표를 사용한다
      - 꺼짐
    * - 출력 파일 접두어(Prefix output files)
      - ``--output-prefix``
      - 지정하지 않으면 데이터베이스 이름이 접두어로 사용된다
      - 데이터베이스 이름
    * - 해시 파일(File for hash)
      - ``--hash-file``
      - 해시 파일 경로
      - —
    * - 캐시 페이지 수(Number of cached pages)
      - ``--cached-pages``
      - 언로드 작업에 사용할 캐시 페이지 수
      - 계산됨(자동)
    * - 예상 인스턴스 수(Estimated instances)
      - ``--estimated-size``
      - 언로드할 데이터 양을 미리 추정한 값
      - 계산됨(자동)

.. warning::

    "LO file count per directory" 필드는 ``unloaddb`` 의 ``--lo-count`` 옵션에 대응하는데, 이 옵션은 이미
    지원 종료되어 제거된(deprecated) 옵션이다.

.. note::

    Schema/Data 포함 범위는 최소 하나 이상 "포함"으로 선택해야 하고, "선택한 테이블만" 옵션을 쓸 경우 테이블을
    최소 1개 이상 선택해야 한다.

데이터베이스 로드(Load Database)
==================================

.. image:: /images/database-load.png

Manage Database → **데이터베이스 로드(Load Database...)** 를 선택한다.

.. list-table::
    :header-rows: 1
    :widths: 25 18 42 15

    * - 항목
      - CLI 대응
      - 설명
      - 기본값
    * - 사용자 이름 / 비밀번호(User Name / Password)
      - ``-u, --user`` / ``-p, --password``
      - 적재를 수행할 DB 계정 정보
      - —
    * - 신택스 검사 후 적재(Check syntax and load database)
      - ``-l, --load-only`` (끌 때 적용)
      - 기본적으로 꺼져 있으며, **꺼진 상태에서는 신택스 검사 없이 데이터만 적재한다.**
      - 꺼짐
    * - 로그 기록 안 함(No log)
      - ``--no-logging``
      - 트랜잭션 로그를 기록하지 않고 적재한다
      - 꺼짐
    * - 예상 인스턴스 수(Estimated instances)
      - ``--estimated-size``
      - 적재할 데이터 양을 미리 추정한 값
      - 5000
    * - 주기적 커밋 카운트(Periodic commit)
      - ``-c, --periodic-commit``
      - 지정한 레코드 수마다 커밋한다
      - 10240
    * - Don't use OID(OID 사용 안 함)
      - ``--no-oid``
      - 객체 ID(OID)를 사용하지 않고 적재한다
      - 꺼짐
    * - Don't update statistics(통계 정보 갱신 안 함)
      - ``--no-statistics``
      - 적재 후 통계 정보를 갱신하지 않는다
      - 꺼짐
    * - 에러 제어 파일(Error control file)
      - ``--error-control-file``
      - 적재 중 발생하는 에러 처리 방식을 지정한 파일
      - —
    * - 제외 테이블 파일(Ignored table file)
      - ``--ignore-class-file``
      - 적재에서 제외할 테이블 이름 목록 파일
      - —
    * - Schema / Object(Data) / Index 파일 경로
      - ``-s, --schema-file`` / ``-d, --data-file`` / ``-i, --index-file``
      - 각각 스키마 / 데이터 / 인덱스 파일 경로. 언로드로 생성된 파일 목록에서 선택하거나 경로를 직접 입력할 수
        있다
      - —
    * - Trigger 파일 경로
      - ``--trigger-file``
      - 화면에는 있지만 실제로 동작하지 않는다. :ref:`unsupported-features` 참고.
      - —

.. warning::

    Load의 기본 대상은 기존 데이터베이스이므로, 잘못 실행하면 실제 데이터를 덮어쓸 수 있다. 실행 전 대상 데이터베이스명을 반드시 확인한다.

.. warning::

    HA 복제에 포함된 데이터베이스는 이 화면으로 로드할 수 없다 — 시도하면 오류가 표시된다. 자세한 내용은
    :ref:`ha-restricted-operations` 참고.

삭제(Delete Database)
=======================

Manage Database → **데이터베이스 삭제(Delete Database)** 는 2단계로 진행된다.

.. image:: /images/database-delete.png

**1단계.** 삭제될 볼륨 목록과 경고를 확인하고 **계속(Proceed)** 를 클릭한다.

.. image:: /images/database-delete-confirm.png

**2단계.** DBA User name(기본값 "dba")/Password를 다시 입력하고 **삭제(Delete)** 를 클릭한다. 두 필드 모두 화면 자체의 필수 표시는
없지만, 값이 올바르지 않으면 인증 단계에서 오류가 표시되어 삭제가 진행되지 않는다.

.. warning::

    HA로 설정된 호스트에서는 삭제할 데이터베이스가 HA 구성원인지와 무관하게 이 화면 자체가 막힌다. 자세한
    내용은 :ref:`ha-restricted-operations` 참고.
